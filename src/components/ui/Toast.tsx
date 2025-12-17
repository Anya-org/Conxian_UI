
"use client";

import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  error: <XCircleIcon className="w-6 h-6 text-red-400" />,
  info: <InformationCircleIcon className="w-6 h-6 text-blue-400" />,
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  return (
    <div className="fixed top-5 right-5 bg-gray-800 text-white p-4 rounded-md shadow-lg flex items-center space-x-2">
      {icons[type]}
      <p>{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-white">
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
