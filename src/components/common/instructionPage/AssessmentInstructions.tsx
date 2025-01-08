import React from 'react';

interface InstructionsProps {
  instructions: string;
  duration: string;
  preview: string;
  canSwitchSections: boolean;
}

export const AssessmentInstructions: React.FC<InstructionsProps> = ({ instructions, duration, preview, canSwitchSections }) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg mb-4">
      <h2 className="text-xl font-bold mb-2">Assessment Instructions</h2>
      <p className="text-gray-700 whitespace-pre-line">{instructions}</p>
      <div className="mt-4">
        <p><strong>Assessment Duration:</strong> {duration}</p>
        <p><strong>Assessment Preview:</strong> {preview}</p>
        <p><strong>Switch between sections:</strong> {canSwitchSections ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};
