import React from 'react';

export default function Button({ children, className = '', onClick, type = 'button', disabled = false }: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
