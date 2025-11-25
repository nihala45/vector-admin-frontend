export function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
  
    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short", // "Sep"
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
  
    return date.toLocaleString(undefined, options); 
    // `undefined` → uses user’s locale automatically
  }