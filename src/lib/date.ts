/**
 * Formats a Date as a Java `LocalDateTime`-compatible string with no timezone
 * and no milliseconds: "YYYY-MM-DDTHH:mm:ss".
 *
 * Mirrors the RN app's contract exactly: `date.toISOString().split(".")[0]`.
 */
export function toLocalDateTimeNoTZ(date: Date): string {
  return date.toISOString().split(".")[0];
}
