import { redirect } from "next/navigation";

// The canonical Advanced track now lives at /english/advanced (premium look,
// full B2–C2 topic set incl. Expert/C2, working study/practice flow, progress).
export default function LegacyAdvancedRedirect() {
  redirect("/english/advanced");
}
