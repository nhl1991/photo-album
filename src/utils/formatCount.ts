const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number | undefined | null) {
  return formatter.format(value ?? 0);
}
