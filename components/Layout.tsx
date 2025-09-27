import React from 'react';
import { useRouter } from 'next/router';
import Footer from './Footer';
import Navigation from './Navigation';
import { DonationModalProvider, useDonationModal } from './DonationModalProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { openDonationModal } = useDonationModal();

  // Pages that should NOT have footer or navigation
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
    <div className="min-h-screen flex flex-col">
      {!shouldHideFooter && (
        <Navigation
          onDonateClick={() => openDonationModal({
            source: 'navigation',
            title: 'Support Our Mission',
            description: 'Your donation helps us transform lives across Nigeria'
          })}
        />
      )}
      <div className="flex-grow">
        {children}
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <DonationModalProvider>
      <LayoutContent>{children}</LayoutContent>
    </DonationModalProvider>
  );
};

export default Layout;