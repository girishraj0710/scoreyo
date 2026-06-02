"use client";

import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'alert' | 'success' | 'error' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showCancel?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  type = 'confirm',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = true,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-indigo-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 whitespace-pre-line">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 ${getButtonColor()} text-white rounded-lg font-medium transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom prompt modal for text input
interface PromptModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptModal({
  isOpen,
  title,
  message,
  placeholder = '',
  defaultValue = '',
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: PromptModalProps) {
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    onCancel();
    setValue('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-indigo-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          {message}
        </p>

        {/* Input */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white mb-4 resize-none"
          rows={3}
          autoFocus
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Need to import React for useState
import React from 'react';
