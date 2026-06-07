import { FileText, CalendarDays } from 'lucide-react'
import { lazy } from 'react'

export interface ToolRoute {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  component: React.LazyExoticComponent<React.ComponentType>
}

export const tools: ToolRoute[] = [
  {
    path: '/lorem',
    label: 'Lorem Ipsum',
    icon: FileText,
    component: lazy(() => import('@/tools/lorem')),
  },
  {
    path: '/date-converter',
    label: 'تبدیل تاریخ',
    icon: CalendarDays,
    component: lazy(() => import('@/tools/date-converter')),
  },
]

export const defaultPath = '/lorem'