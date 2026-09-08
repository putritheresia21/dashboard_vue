interface SelectFilterDef {
  type: 'select'
  key: string
  placeholder: string
  options?: string
}

interface RangeFilterDef {
  type: 'range'
  key: string
  label: string
  min?: number
  max?: number
  unit?: string
  compute?: (row: any) => number //untuk nilai bukan field langsung
}

type FilterDef = SelectFilterDef | RangeFilterDef
type FilterValue = string | null | [number, number]

export function deriveSelectOptions(data: any[], key: string): string[] {
  return [...new Set(data.map((item) => item[key]))].filter(Boolean).sort()
}

export function defaultFilterValue(filter: FilterDef): FilterValue {
  if (filter.type === 'range') return [filter.min ?? 0, filter.max ?? 100]
  return null
}

function matchesOne(item: any, filter: FilterDef, value: FilterValue): boolean {
  if (filter.type === 'select') {
    if (!value) return true
    return item[filter.key] === value
  }
  //range
  if (!value) return true
  const [min, max] = value as [number, number]
  const actual = filter.compute ? filter.compute(item) : item[filter.key]
  return actual >= min && actual <= max
}

export function matchesAllFilters(
  item: any,
  filters: FilterDef[],
  activeValues: Record<string, FilterValue>,
): boolean {
  return filters.every((f) => matchesOne(item, f, activeValues[f.key] ?? defaultFilterValue(f)))
}
