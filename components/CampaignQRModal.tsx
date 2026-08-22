import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { RiQrCodeLine } from 'react-icons/ri';
import QRCode from 'qrcode';
import { trackCampaignShare } from '@/lib/trackCampaignShare';
import LandingModal from './home/LandingModal';

interface CampaignQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
  utmSource?: string;
}

const CampaignQRModal: React.FC<CampaignQRModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  utmSource = 'qr_code'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQRCode = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const campaignUrl = `${window.location.origin}/#urgent-campaign?utm_source=${utmSource}&utm_medium=qr_code&utm_campaign=${encodeURIComponent(campaignId)}&utm_content=${encodeURIComponent(campaignTitle)}`;

      // Use QRCode.toDataURL to generate data URL, then draw to canvas
      const dataUrl = await QRCode.toDataURL(campaignUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Draw the QR code image to canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = 400;
          canvas.height = 400;
          ctx.drawImage(img, 0, 0);
          setQrGenerated(true);
        };
        img.src = dataUrl;
      }

      // Track QR code generation
      await trackCampaignShare(campaignId, 'qr_code', utmSource, 'qr_code');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [campaignId, campaignTitle, utmSource]);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      void generateQRCode();
    }
  }, [generateQRCode, isOpen]);

  const handleClose = () => {
    setQrGenerated(false);
    onClose();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `campaign-${campaignId}-qr.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  if (!isOpen) return null;

  return (
    <LandingModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Share this campaign"
      description="Download a scannable code for print, WhatsApp, or community outreach materials."
      eyebrow="Campaign sharing"
      icon={<RiQrCodeLine />}
      size="sm"
      className="qr-modal-shell"
      bodyClassName="qr-modal-body"
    >
        <div className="landing-modal-content">
          <div className="qr-modal-campaign">
            <p>Campaign</p>
            <h3>{campaignTitle}</h3>
          </div>

          <div className="qr-modal-code">
            {!qrGenerated && <div className="qr-modal-loading" aria-live="polite">Generating code</div>}
            <canvas ref={canvasRef} className={qrGenerated ? 'is-ready' : ''} aria-label={`QR code for ${campaignTitle}`} />
          </div>

          {qrGenerated && (
            <div className="qr-modal-actions">
              <button
                onClick={handleDownload}
                className="landing-modal-primary flex-1"
              >
                <Download className="w-5 h-5 mr-2" />
                Download code
              </button>
              <button
                onClick={handleClose}
                className="landing-modal-secondary flex-1"
              >
                Close
              </button>
            </div>
          )}

          <div className="landing-modal-note mt-5 p-4">
            <p className="text-sm">
              <strong>Practical tip:</strong> Place the code on flyers or event materials so supporters can open the campaign directly on their phones.
            </p>
          </div>
        </div>
    </LandingModal>
  );
};

export default CampaignQRModal;
