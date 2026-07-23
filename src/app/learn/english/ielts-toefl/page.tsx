import { redirect } from "next/navigation";

// The canonical IELTS & TOEFL track now lives at /english/ielts-toefl (premium
// look, working study/practice flow, progress tracking).
export default function LegacyIeltsToeflRedirect() {
  redirect("/english/ielts-toefl");
}
