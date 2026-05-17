import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AppProvider, CategoryIdProvider } from './context/AppContext'
import { CATEGORY_BY_ID } from './constants'
import type { CategoryId } from './types'
import { Home } from './pages/Home'
import { CategoryPage } from './pages/CategoryPage'

function isCategoryId(id: string): id is CategoryId {
  return id in CATEGORY_BY_ID
}

function CategoryRoute() {
  const { id } = useParams<{ id: string }>()
  if (!id || !isCategoryId(id)) {
    return <Navigate to="/" replace />
  }
  return (
    <CategoryIdProvider categoryId={id}>
      <CategoryPage />
    </CategoryIdProvider>
  )
}

const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
