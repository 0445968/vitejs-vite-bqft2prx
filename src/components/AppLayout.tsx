import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './Header';

export function AppLayout() {
  const location = useLocation();

  const isCategoryToolPage =
    location.pathname.startsWith('/tools/') &&
    location.pathname !== '/tools/qr-code' &&
    location.pathname !== '/tools/password-generator';

  return (
    <div className="min-h-dvh">
      <Header />

      <main
        className={
          isCategoryToolPage
            ? 'min-h-[calc(100dvh-4rem)]'
            : 'mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'
        }
      >
        <Outlet />
      </main>
    </div>
  );
}