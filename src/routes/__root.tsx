import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'Dillon Rochon | Lethbridge Real Estate | 2% Realty',
      },
      {
        name: 'description',
        content:
          'Full-service real estate with only 2% commission across Southern Alberta. Live listings, market insights, and a free home valuation from Dillon Rochon.',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
})