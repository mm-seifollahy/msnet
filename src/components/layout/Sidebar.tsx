import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Sun, Moon, Monitor } from 'lucide-react'
import { tools } from '@/app/routes'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-background border-e border-border',
        'transition-all duration-300 ease-in-out shrink-0',
        open ? 'w-52' : 'w-14'
      )}
    >
      <div className="flex items-center h-14 px-3 border-b border-border">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label={open ? 'بستن منو' : 'باز کردن منو'}
        >
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
        {open && (
          <span className="me-3 font-semibold text-sm tracking-wide text-foreground">
            msnet
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <NavLink
              key={tool.path}
              to={tool.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors',
                  'text-muted-foreground hover:text-foreground hover:bg-muted',
                  isActive && 'bg-muted text-foreground font-medium',
                  !open && 'justify-center'
                )
              }
            >
              <Icon className="shrink-0" size={18} />
              {open && <span className="truncate">{tool.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
          className={cn(
            'flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors w-full',
            'text-muted-foreground hover:text-foreground hover:bg-muted',
            !open && 'justify-center'
          )}
        >
          {theme === 'dark' ? (
            <Moon size={18} className="shrink-0" />
          ) : theme === 'light' ? (
            <Sun size={18} className="shrink-0" />
          ) : (
            <Monitor size={18} className="shrink-0" />
          )}
          {open && (
            <span>{theme === 'dark' ? 'تاریک' : theme === 'light' ? 'روشن' : 'سیستم'}</span>
          )}
        </button>
      </div>
    </aside>
  )
}