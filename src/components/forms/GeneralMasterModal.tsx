// src/components/Modal.tsx
import React from "react";

interface GeneralModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GeneralMasterModal({
  title,
  onClose,
  children,
}: GeneralModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[650px] max-w-[90vw] relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-red-800">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          ✖
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
