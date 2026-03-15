export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

export function formatPostDateForDisplay(date: Date): string {
	const isDateOnly =
		date.getUTCHours() === 0 &&
		date.getUTCMinutes() === 0 &&
		date.getUTCSeconds() === 0 &&
		date.getUTCMilliseconds() === 0;

	const timeZone = "Asia/Shanghai";

	const dateParts = new Intl.DateTimeFormat("zh-CN", {
		timeZone,
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(date);
	const y = dateParts.find((p) => p.type === "year")?.value ?? "";
	const m = dateParts.find((p) => p.type === "month")?.value ?? "";
	const d = dateParts.find((p) => p.type === "day")?.value ?? "";

	const datePart = `${y}年${m}月${d}日`;
	if (isDateOnly) return datePart;

	const timeParts = new Intl.DateTimeFormat("zh-CN", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).formatToParts(date);
	const hh = timeParts.find((p) => p.type === "hour")?.value ?? "00";
	const mm = timeParts.find((p) => p.type === "minute")?.value ?? "00";
	const ss = timeParts.find((p) => p.type === "second")?.value ?? "00";

	const timePart = ss !== "00" ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
	return `${datePart} ${timePart}`;
}
