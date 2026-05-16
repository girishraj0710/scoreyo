import { NextRequest, NextResponse } from "next/server";
import { CURRENT_SYLLABUS } from "../../../../lib/syllabus-config";

/**
 * Syllabus Review Reminder Cron Endpoint
 *
 * Called by Vercel Cron: Once a year in May (before June 1st update)
 * URL: /api/cron/syllabus-reminder
 *
 * Purpose: Send reminder to check if any exam syllabi changed
 * Timing: May 15th gives 2 weeks to update config before June 1st auto-update
 * Security: Only callable by Vercel cron (verifies Authorization header)
 */
export async function GET(request: NextRequest) {
  // Security: Verify this is a legitimate Vercel cron request
  const authHeader = request.headers.get("authorization");

  if (process.env.NODE_ENV === "production") {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("❌ CRON_SECRET not configured in environment variables");
      return NextResponse.json(
        { error: "Cron secret not configured" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("❌ Unauthorized cron request");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    console.log("📅 Generating syllabus review reminder...");

    const currentYear = new Date().getFullYear();
    const examsToCheck: Array<{
      examId: string;
      examName: string;
      currentYear: number;
      yearsSinceUpdate: number;
      priority: "high" | "medium" | "low";
    }> = [];

    // Analyze each exam
    for (const config of CURRENT_SYLLABUS) {
      const yearsSinceUpdate = currentYear - config.currentSyllabusYear;

      let priority: "high" | "medium" | "low" = "low";

      // High priority: JEE, NEET, major exams
      if (
        config.examId.includes("jee") ||
        config.examId.includes("neet") ||
        config.examId.includes("cet")
      ) {
        priority = "high";
      }
      // Medium: All others
      else if (yearsSinceUpdate >= 2) {
        priority = "medium";
      }

      examsToCheck.push({
        examId: config.examId,
        examName: config.examName,
        currentYear: config.currentSyllabusYear,
        yearsSinceUpdate,
        priority,
      });
    }

    // Sort by priority and years since update
    examsToCheck.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.yearsSinceUpdate - a.yearsSinceUpdate;
    });

    const highPriority = examsToCheck.filter((e) => e.priority === "high");
    const mediumPriority = examsToCheck.filter((e) => e.priority === "medium");

    // Generate reminder message
    const reminderMessage = `
📅 ANNUAL SYLLABUS REVIEW REMINDER

It's May! Time to check if any exam syllabi changed for the new academic year.

🔴 HIGH PRIORITY (${highPriority.length} exams):
${highPriority.map(e => `  - ${e.examName} (current: ${e.currentYear}, ${e.yearsSinceUpdate}y old)`).join("\n")}

🟡 MEDIUM PRIORITY (${mediumPriority.length} exams):
${mediumPriority.slice(0, 5).map(e => `  - ${e.examName} (current: ${e.currentYear}, ${e.yearsSinceUpdate}y old)`).join("\n")}
${mediumPriority.length > 5 ? `  ... and ${mediumPriority.length - 5} more` : ""}

📝 ACTION STEPS:
1. Check official notifications:
   - NTA (JEE/NEET): https://nta.ac.in/
   - State boards: Check respective websites

2. If syllabus changed:
   npx tsx scripts/update-syllabus.ts <exam-id> <year> "<changes>"

3. If no changes:
   Update lastUpdated to mark as checked

⏰ DEADLINE: Before June 1st (auto-update runs)

Run locally:
  npx tsx scripts/check-syllabus-updates.ts
    `.trim();

    console.log(reminderMessage);

    // TODO: Send email notification (future enhancement)
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: "Syllabus Review Reminder - May Check",
    //   body: reminderMessage,
    // });

    return NextResponse.json({
      success: true,
      message: "Syllabus review reminder generated",
      highPriorityCount: highPriority.length,
      mediumPriorityCount: mediumPriority.length,
      examsToCheck: examsToCheck.filter((e) => e.priority !== "low"),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Syllabus reminder failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
