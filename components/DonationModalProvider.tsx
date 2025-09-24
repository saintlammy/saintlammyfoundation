import React, { createContext, useContext, useState, ReactNode } from 'react';
import NewDonationModal from './NewDonationModal';

export interface DonationContext {
  source: 'general' | 'widow-support' | 'family-feeding' | 'outreach-sponsorship' | 'crypto-donation' | 'hero-cta' | 'sticky-button' | 'success-stories' | 'urgent-needs' | 'newsletter' | 'footer';
  category?: 'orphan' | 'widow' | 'family' | 'outreach' | 'emergency';
  amount?: number;
  title?: string;
  description?: string;
  preferredMethod?: 'card' | 'crypto' | 'bank';
}

interface DonationModalContextType {
  openDonationModal: (context?: DonationContext) => void;
  closeDonationModal: () => void;
  isDonationModalOpen: boolean;
  donationContext: DonationContext | null;
}

const DonationModalContext = createContext<DonationModalContextType | undefined>(undefined);

export const useDonationModal = () => {
  const context = useContext(DonationModalContext);
  if (!context) {
    throw new Error('useDonationModal must be used within a DonationModalProvider');
  }
  return context;
};

interface DonationModalProviderProps {
  children: ReactNode;
}

export const DonationModalProvider: React.FC<DonationModalProviderProps> = ({ children }) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationContext, setDonationContext] = useState<DonationContext | null>(null);

  const openDonationModal = (context?: DonationContext) => {
    const defaultContext: DonationContext = {
      source: 'general',
      title: 'Support Our Mission',
      description: 'Your donation helps us transform lives across Nigeria'
    };

    setDonationContext(context || defaultContext);
    setIsDonationModalOpen(true);
  };

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
    // Keep context for analytics even after closing
  };

  return (
    <DonationModalContext.Provider value={{
      openDonationModal,
      closeDonationModal,
      isDonationModalOpen,
      donationContext
    }}>
      {children}
      <NewDonationModal
        isOpen={isDonationModalOpen}
        onClose={closeDonationModal}
        context={donationContext}
      />
    </DonationModalContext.Provider>
  );
};