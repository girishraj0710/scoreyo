// Integration test: exercise the group-study db helpers against the real DB
// with throwaway users, then clean up. Verifies create → join → idempotent
// re-join → leave → owner-cannot-leave → membership guard → cascade delete.
// Run: npx tsx scripts/test-group-study.ts
//
// Uses two synthetic users (inserted + deleted here). All rows created are
// removed at the end even if an assertion fails.

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
// Supabase requires SSL; getPool() only enables it when NODE_ENV=production.
// Force production-like DB behavior for this standalone script.
if (process.env.POSTGRES_URL && !process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

import { randomUUID } from "crypto";
import {
  getPool,
  createStudyGroup,
  getUserGroups,
  isGroupMember,
  getGroupByIdForMember,
  getGroupByJoinCode,
  getGroupMembers,
  joinGroupByCode,
  leaveGroup,
} from "../src/lib/db";

let passed = 0;
let failed = 0;

function ok(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// Synthetic users — clearly marked so they're easy to spot and purge.
const OWNER_ID = `__test_group_owner_${randomUUID()}`;
const JOINER_ID = `__test_group_joiner_${randomUUID()}`;
const STRANGER_ID = `__test_group_stranger_${randomUUID()}`;

async function seedUser(pool: any, id: string, name: string, email: string) {
  await pool.query(
    `INSERT INTO users (id, name, email, avatar_color) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO NOTHING`,
    [id, name, email, "#6366f1"]
  );
}

async function run() {
  const pool = getPool();
  let groupId: string | null = null;

  try {
    // --- setup: three throwaway users -------------------------------------
    await seedUser(pool, OWNER_ID, "Test Owner", `${OWNER_ID}@example.test`);
    await seedUser(pool, JOINER_ID, "Test Joiner", `${JOINER_ID}@example.test`);
    await seedUser(pool, STRANGER_ID, "Test Stranger", `${STRANGER_ID}@example.test`);

    // -----------------------------------------------------------------------
    console.log("\n1. createStudyGroup: creates group + owner membership");
    const group = await createStudyGroup(OWNER_ID, "Physics Squad", "JEE physics prep");
    groupId = group.id;
    ok("group row returned with id", !!group.id);
    ok("name persisted", group.name === "Physics Squad");
    ok("description persisted", group.description === "JEE physics prep");
    ok("owner_id set", group.owner_id === OWNER_ID);
    ok("join_code generated (8 chars)", typeof group.join_code === "string" && group.join_code.length === 8);
    ok("owner is automatically a member", await isGroupMember(group.id, OWNER_ID));

    const ownerMembers = await getGroupMembers(group.id);
    ok("exactly one member after create", ownerMembers.length === 1, `got ${ownerMembers.length}`);
    ok("owner has role 'owner'", ownerMembers[0]?.role === "owner");

    // -----------------------------------------------------------------------
    console.log("\n2. getGroupByJoinCode: resolves the shareable code");
    const byCode = await getGroupByJoinCode(group.join_code);
    ok("code resolves to the group", byCode?.id === group.id);
    ok("unknown code returns undefined", (await getGroupByJoinCode("zzzzzzzz")) === undefined);

    // -----------------------------------------------------------------------
    console.log("\n3. joinGroupByCode: a friend joins via the invite code");
    const joinResult = await joinGroupByCode(group.join_code, JOINER_ID);
    ok("join returns the group", joinResult?.group.id === group.id);
    ok("alreadyMember is false on first join", joinResult?.alreadyMember === false);
    ok("joiner is now a member", await isGroupMember(group.id, JOINER_ID));

    const twoMembers = await getGroupMembers(group.id);
    ok("two members after join", twoMembers.length === 2, `got ${twoMembers.length}`);
    ok("joiner has role 'member'", twoMembers.find((m: any) => m.user_id === JOINER_ID)?.role === "member");
    ok("member list includes joined-user name", twoMembers.some((m: any) => m.name === "Test Joiner"));

    // -----------------------------------------------------------------------
    console.log("\n4. joinGroupByCode is idempotent (re-join = no duplicate)");
    const rejoin = await joinGroupByCode(group.join_code, JOINER_ID);
    ok("rejoin flags alreadyMember", rejoin?.alreadyMember === true);
    const stillTwo = await getGroupMembers(group.id);
    ok("still two members after rejoin", stillTwo.length === 2, `got ${stillTwo.length}`);

    console.log("\n5. joinGroupByCode with invalid code returns null");
    ok("invalid code → null", (await joinGroupByCode("badcode0", STRANGER_ID)) === null);

    // -----------------------------------------------------------------------
    console.log("\n6. Membership guard: getGroupByIdForMember");
    ok("member can load group detail", !!(await getGroupByIdForMember(group.id, JOINER_ID)));
    ok("owner can load group detail", !!(await getGroupByIdForMember(group.id, OWNER_ID)));
    ok("non-member cannot load group detail", (await getGroupByIdForMember(group.id, STRANGER_ID)) === undefined);

    // -----------------------------------------------------------------------
    console.log("\n7. getUserGroups: lists a user's groups with counts/role");
    const joinerGroups = await getUserGroups(JOINER_ID);
    ok("joiner sees the group", joinerGroups.some((g: any) => g.id === group.id));
    const g = joinerGroups.find((g: any) => g.id === group.id);
    ok("member_count is 2", Number(g?.member_count) === 2, `got ${g?.member_count}`);
    ok("my_role is 'member' for joiner", g?.my_role === "member");
    ok("stranger sees no groups", (await getUserGroups(STRANGER_ID)).length === 0);

    // -----------------------------------------------------------------------
    console.log("\n8. leaveGroup: member leaves, owner cannot");
    ok("owner cannot leave (returns false)", (await leaveGroup(group.id, OWNER_ID)) === false);
    ok("owner still a member after failed leave", await isGroupMember(group.id, OWNER_ID));

    ok("member leaves successfully (returns true)", (await leaveGroup(group.id, JOINER_ID)) === true);
    ok("joiner no longer a member", !(await isGroupMember(group.id, JOINER_ID)));
    const afterLeave = await getGroupMembers(group.id);
    ok("one member after leave", afterLeave.length === 1, `got ${afterLeave.length}`);

    // -----------------------------------------------------------------------
    console.log("\n9. Cascade delete: removing the group removes memberships");
    await pool.query("DELETE FROM study_groups WHERE id = $1", [group.id]);
    groupId = null;
    const orphans = await pool.query("SELECT COUNT(*)::int AS n FROM group_members WHERE group_id = $1", [group.id]);
    ok("no orphan memberships after group delete", orphans.rows[0].n === 0, `got ${orphans.rows[0].n}`);
  } finally {
    // --- teardown: remove everything we created ---------------------------
    const pool = getPool();
    if (groupId) await pool.query("DELETE FROM study_groups WHERE id = $1", [groupId]);
    await pool.query("DELETE FROM study_groups WHERE owner_id = $1", [OWNER_ID]); // safety net
    await pool.query("DELETE FROM users WHERE id = ANY($1)", [[OWNER_ID, JOINER_ID, STRANGER_ID]]);
  }

  console.log(`\n${failed === 0 ? "✅ ALL PASSED" : "❌ FAILURES"}: ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
