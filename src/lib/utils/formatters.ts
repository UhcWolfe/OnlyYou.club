export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function formatDate(dateString: string, locale: string = "pl-PL"): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string, locale: string = "pl"): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return locale === "pl" ? "przed chwilą" : "just now";
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return locale === "pl" ? `${diffInMinutes} min temu` : `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return locale === "pl" ? `${diffInHours} godz. temu` : `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return locale === "pl" ? `${diffInDays} dni temu` : `${diffInDays}d ago`;
    }
    return formatDate(dateString, locale === "pl" ? "pl-PL" : "en-US");
  } catch {
    return dateString;
  }
}
