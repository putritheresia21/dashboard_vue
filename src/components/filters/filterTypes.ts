export interface SelectFilterDef {
  type: 'select'
  key: string
  placeholder: string
  options?: string[] // kosongkan untuk auto-derive dari data
}

export interface RangeFilterDef {
  type: 'range'
  key: string
  label: string
  min?: number
  max?: number
  unit?: string
  compute?: (row: any) => number
}

export type FilterDef = SelectFilterDef | RangeFilterDef
export type FilterValue = string | null | [number, number]

export function deriveSelectOptions(data: any[], key: string): string[] {
  return [...new Set(data.map((item) => item[key]))].filter(Boolean).sort()
}

export function defaultFilterValue(filter: FilterDef): FilterValue {
  if (filter.type === 'range') return [filter.min ?? 0, filter.max ?? 100]
  return null
}

export function matchesAllFilters(
  item: any,
  filters: FilterDef[],
  activeValues: Record<string, FilterValue>,
): boolean {
  return filters.every((f) => {
    const value = activeValues[f.key]
    if (f.type === 'select') {
      if (!value) return true
      return item[f.key] === value
    }
    if (!value) return true
    const [min, max] = value as [number, number]
    const actual = f.compute ? f.compute(item) : item[f.key]
    return actual >= min && actual <= max
  })
}
