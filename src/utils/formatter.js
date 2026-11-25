export function formatMinutesToMilliseconds(minutes) {
    return minutes * 60 * 1000;
}

export function formatUpdatedAt(updatedAt, locale, label) {
    if (!updatedAt) return '';
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) return label + String(updatedAt);
    return label + date.toLocaleString(locale);
}
