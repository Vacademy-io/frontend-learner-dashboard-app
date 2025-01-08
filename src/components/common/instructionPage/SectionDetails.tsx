import React from 'react';

interface SectionProps {
  section: {
    assesmentDuration: string;
    subject: string;
    sectionDesc: string;
    sectionDuration: string;
    negativeMarking: { checked: boolean; value: string };
    partialMarking: boolean;
    cutoffMarking: { checked: boolean; value: string };
    totalMark: string;
  };
}

export const SectionDetails: React.FC<SectionProps> = ({ section }) => {
  return (
    <div className="bg-white shadow p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">{section.subject}</h3>
      <p className="text-gray-700">{section.sectionDesc}</p>
      <div className="mt-4">
        <p><strong>Negative Marking:</strong> {section.negativeMarking.checked ? section.negativeMarking.value : 'No'}</p>
        <p><strong>Partial Marking:</strong> {section.partialMarking ? 'Yes' : 'No'}</p>
        <p><strong>Cutoff Marks:</strong> {section.cutoffMarking.checked ? section.cutoffMarking.value : 'NA'}</p>
        <p><strong>Total Marks:</strong> {section.totalMark}</p>
      </div>
    </div>
  );
};
