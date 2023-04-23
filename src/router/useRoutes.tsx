import { lazy } from 'react'
import { Suspense } from 'react'
import { useRoutes as useReactRoutes, Outlet } from 'react-router-dom'
const Matching = lazy(() => import('@/pages/matching'))

export const useRoutes = () => {
  const routes = useReactRoutes([
    {
      path: '/',
      element: <Outlet />,
      children: [
        {
          path: '/matching',
          element: (
            <Suspense fallback={<div>Loading</div>}>
              <Matching />
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
