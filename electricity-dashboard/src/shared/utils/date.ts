import { dayjs } from "@/shared/lib/dayjs";

export function formatDate(date: string | Date, format = "MMM D, YYYY"): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format("MMM D, YYYY h:mm A");
}

export function formatRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function formatDuration(minutes: number): string {
  const d = dayjs.duration(minutes, "minutes");
  const hours = Math.floor(d.asHours());
  const mins = d.minutes();
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
