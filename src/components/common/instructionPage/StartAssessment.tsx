import React, { useState } from "react";
import { X } from "lucide-react";
import { MyButton } from "@/components/design-system/button";

const AssessmentStartModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center pt-4">
      
      <MyButton
        onClick={() => setIsOpen(true)}
        buttonType="primary"
        scale="large"
        layoutVariant="default"
      >
        Start Assessment
      </MyButton>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-rose-50 rounded-lg w-full max-w-md mx-4">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-orange-500 text-xl font-medium">
                Start Assessment
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 text-lg">Attention</span>
                <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center">
                  <span className="text-red-500">!</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg">
                Once you start the assessment, you must complete it without
                interruption. Begin only when you're ready.
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 flex justify-end">
              <button
                onClick={handleClose}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentStartModal;
