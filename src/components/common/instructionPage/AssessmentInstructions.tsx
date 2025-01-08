import React from "react";
import { InstructionsProps } from "@/types/assessment";
import { Check } from "lucide-react";

export const AssessmentInstructions: React.FC<InstructionsProps> = ({
  instructions,
  duration,
  preview,
  canSwitchSections,
}) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Assessment Instructions</h2>
      <p className="text-gray-700 whitespace-pre-line">{instructions}</p>
      <div className="mt-4">
        <p>
          <strong>Assessment Duration:</strong>
          <p>Entire Assessment Dureation</p>
          {duration}
        </p>
        <p>
          <strong>Assessment Preview:</strong> {preview}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            <strong>Switch between sections:</strong>{" "}
            {canSwitchSections ? "Yes" : "No"}
          </span>
          {canSwitchSections && (
            <Check className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
    </div>
  );
};
