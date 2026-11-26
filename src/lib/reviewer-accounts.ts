/** Play Store / internal reviewer accounts that skip Checkr and get demo payout wiring. */
const PLAY_REVIEWER_EMAILS = new Set([
  "driver-review@myrunner.shop",
  "driver-reviewer@myrunner.shop",
]);

export function isPlayReviewerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return PLAY_REVIEWER_EMAILS.has(email.trim().toLowerCase());
}