import { GridViewIcon, Home01Icon } from '@hugeicons/core-free-icons'

import { createHugeIconComponent } from '@/shared/utils/createHugeIconComponent'

const HomeIcon = createHugeIconComponent(Home01Icon, 20)
const GridIcon = createHugeIconComponent(GridViewIcon, 20)

export const sidebarRail = [
  { label: 'Portal', icon: HomeIcon, to: '/' },
  { label: 'Aplikasi', icon: GridIcon, to: '/app' },
]
