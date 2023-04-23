import { lazy } from 'react'
import { Suspense } from 'react'
import { useRoutes as useReactRoutes, Outlet } from 'react-router-dom'
const Home = lazy(() => import('@/pages/index'))

export const useRoutes = () => {
  const routes = useReactRoutes([
    {
      path: '/',
      element: <Outlet />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<div>Loading</div>}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <>Not Found</>,
        },
      ],
    },
  ])

  return routes
}
