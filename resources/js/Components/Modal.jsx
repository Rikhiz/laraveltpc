// resources/js/Components/Modal.jsx
import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, show, onClose, children, width = "w-96" }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-gray-900 border-2 border-red-500 rounded-xl p-8 max-w-[90vw] ${width}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
