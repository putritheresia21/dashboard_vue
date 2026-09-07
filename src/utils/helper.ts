export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLocaleLowerCase()
}

export function generateProductCode(nextNumber: number): string {
  return `PRD-${String(nextNumber).padStart(4, '0')}`
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`
}

export function sumBy<T>(items: T[], selector: keyof T | ((item: T) => number)): number {
  const getValue =
    typeof selector === 'function' ? selector : (item: T) => Number(item[selector] ?? 0)
  return items.reduce((sum, item) => sum + getValue(item), 0)
}

export function countBy<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.filter(predicate).length
}

export function countByGroup<T, K extends string>(
  items: T[],
  groups: K[],
  getGroup: (item: T) => string,
): Record<K, number> {
  const counts = Object.fromEntries(groups.map((g) => [g, 0])) as Record<K, number>
  items.forEach((item) => {
    const group = getGroup(item) as K
    if (group in counts) counts[group]++
  })
  return counts
}
