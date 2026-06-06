import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { tools, defaultPath } from '@/app/routes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={defaultPath} replace />} />
          {tools.map((tool) => (
            <Route
              key={tool.path}
              path={tool.path}
              element={<tool.component />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}