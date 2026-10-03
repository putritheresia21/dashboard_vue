export type DataRow = Record<string, unknown>

type Flag = boolean | ((row: DataRow) => boolean)

export interface ColumnDef {
  field: string
  header: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  slot?: string
  type?: 'text' | 'number' | 'select' | 'badge' | 'index' | 'dot' | 'icon-text'
  badgeMap?: Record<string, { label?: string; bg: string; text: string }>
  uniqueField?: string
  boxed?: Flag
  editable?: Flag
  options?: Array<string | { value: string; label: string }>
  min?: number
  max?: number
  dotColor?: (row: DataRow) => string | null
}
