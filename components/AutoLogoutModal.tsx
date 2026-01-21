import React from 'react';
import { AlertTriangle, LogOut, Clock } from 'lucide-react';

interface AutoLogoutModalProps {
  isOpen: boolean;
  reason: string;
  onClose: () => void;
}

const AutoLogoutModal: React.FC<AutoLogoutModalProps> = ({ isOpen, reason, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Session Expired</h3>
              <p className="text-sm text-yellow-100">You have been logged out</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex items-start space-x-3 mb-6">
            <div className="flex-shrink-0 mt-1">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reason}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Security Tip:</strong> Regular automatic logouts help protect your account from unauthorized access when you're away from your device.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoLogoutModal;
