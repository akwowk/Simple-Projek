export const TIMEZONE = "Asia/Jakarta";

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIMEZONE,
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return `${formatDate(value)}, ${formatTime(value)} WIB`;
}

// UTC ISO string ke input datetime-local dalam WIB
export function toLocalInput(value: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

// Input datetime-local WIB ke UTC ISO string
export function fromLocalInput(value: string) {
  return new Date(`${value}:00+07:00`).toISOString();
}

export function isOverdue(
  deadline: string,
  now = Date.now()
) {
  return Date.parse(deadline) < now;
}

export function getCountdown(
  deadline: string,
  now = Date.now()
) {
  const difference = Date.parse(deadline) - now;
  const absolute = Math.abs(difference);

  const days = Math.floor(absolute / 86400000);
  const hours = Math.floor(
    (absolute % 86400000) / 3600000
  );
  const minutes = Math.floor(
    (absolute % 3600000) / 60000
  );

  let duration: string;

  if (days > 0) {
    duration = `${days} hari ${hours} jam`;
  } else if (hours > 0) {
    duration = `${hours} jam ${minutes} menit`;
  } else if (minutes > 0) {
    duration = `${minutes} menit`;
  } else {
    return difference < 0
      ? "Terlambat kurang dari 1 menit"
      : "Kurang dari 1 menit lagi";
  }

  return difference < 0
    ? `Terlambat ${duration}`
    : `${duration} lagi`;
}

export function getEventStatus(
  startAt: string,
  endAt: string,
  now = Date.now()
): "upcoming" | "ongoing" | "completed" {
  if (now >= Date.parse(endAt)) {
    return "completed";
  }

  if (now >= Date.parse(startAt)) {
    return "ongoing";
  }

  return "upcoming";
}