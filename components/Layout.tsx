import React from 'react';
import { useRouter } from 'next/router';
import Footer from './Footer';
import { DonationModalProvider } from './DonationModalProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  // Pages that should NOT have footer
  const noFooterPages = [
    '/admin',
    '/admin/dashboard',
    '/admin/analytics',
    '/admin/donations',
    '/admin/wallet-management'
  ];

  // Check if current route or any parent route should exclude footer
  const shouldHideFooter = noFooterPages.some(page =>
    router.pathname === page || router.pathname.startsWith(page + '/')
  );

  return (
    <DonationModalProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          {children}
        </div>
        {!shouldHideFooter && <Footer />}
      </div>
    </DonationModalProvider>
  );
};

export default Layout;