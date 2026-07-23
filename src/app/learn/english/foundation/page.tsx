import { redirect } from "next/navigation";

// The canonical Foundation track now lives at /english/foundation (premium look,
// full A1–B1 topic set, working study/practice flow, progress tracking).
export default function LegacyFoundationRedirect() {
  redirect("/english/foundation");
}
