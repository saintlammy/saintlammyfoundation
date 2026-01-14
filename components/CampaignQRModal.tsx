import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { trackCampaignShare } from '@/lib/trackCampaignShare';

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

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQRCode();
    }
  }, [isOpen, campaignId]);

  const generateQRCode = async () => {
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
        };
        img.src = dataUrl;
      }

      setQrGenerated(true);

      // Track QR code generation
      await trackCampaignShare(campaignId, 'qr_code', utmSource, 'qr_code');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Campaign QR Code
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {campaignTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan this QR code to share or donate to this campaign
            </p>
          </div>

          <div className="flex justify-center mb-6 bg-white p-6 rounded-lg">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>

          {qrGenerated && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download QR Code
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Tip:</strong> Print this QR code on flyers, posters, or business cards to make it easy for people to access your campaign from their mobile devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignQRModal;
