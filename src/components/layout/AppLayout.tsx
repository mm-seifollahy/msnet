import { useState, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            در حال بارگذاری...
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}