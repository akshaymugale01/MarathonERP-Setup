import React from "react";
import SelectBox from "./SelectBox";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MaterialModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white border-bottom border rounded-md p-4 shadow-lg w-full max-w-5xl relative">
        <div className="">
          <button
            onClick={onClose}
            className="absolute top-2 right-5 px-2 text-red-800 hover:text-black text-2xl"
          >
            X
          </button>
          
        </div>
        <div className="p-4 mt-5 border rounded-md">
            {children}</div>
      </div>
    </div>
  );
};

export default MaterialModal;
