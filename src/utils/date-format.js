export default function getFormattedDate(isoString) {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Add 5 hours 30 minutes for Sri Lanka time
  const sriLankaDate = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);

  const day = sriLankaDate.getUTCDate();
  const weekday = sriLankaDate.toLocaleString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const month = sriLankaDate.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const time = sriLankaDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  function getOrdinal(n) {
    if (n >= 11 && n <= 13) return `${n}th`;

    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  }

  return `${getOrdinal(day)} ${weekday} of ${month} ${time}`;
}