// import React from "react";

// import { SectionProps } from "@/types/assessment";

// export const SectionDetails: React.FC<SectionProps> = ({ section }) => {
//   return (
//     <div className="bg-white shadow p-4 rounded-lg mb-4">
//       <h3 className="text-lg font-semibold mb-2">{section.subject}</h3>
//       <p className="text-gray-700">{section.sectionDesc}</p>
//       <div className="mt-4">
//         <p>
//           <strong>Negative Marking:</strong>{" "}
//           {section.negativeMarking.checked
//             ? section.negativeMarking.value
//             : "No"}
//         </p>
//         <p>
//           <strong>Partial Marking:</strong>{" "}
//           {section.partialMarking ? "Yes" : "No"}
//         </p>
//         <p>
//           <strong>Cutoff Marks:</strong>{" "}
//           {section.cutoffMarking.checked ? section.cutoffMarking.value : "NA"}
//         </p>
//         <p>
//           <strong>Total Marks:</strong> {section.totalMark}
//         </p>
//       </div>
//     </div>
//   );
// };



import React from 'react';
import { Check } from 'lucide-react';
import { SectionProps } from '@/types/assessment';
import { StatusChips } from '@/components/design-system/chips';

export const SectionDetails: React.FC<SectionProps> = ({ section }) => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 mb-4">
      <div className="p-4 space-y-6">
      <h2 className="text-orange-500 text-lg font-medium">{section.subject}</h2>
      
      <div className="space-y-4">
      <div className="text-sm text-gray-600">
      <p className="font-medium mb-2"><strong>Section Description:</strong></p>
      <p className="text-gray-700">{section.sectionDesc}</p>
      </div>

      <div className="text-sm text-gray-600">
      <p className="mb-2"><strong>Section Duration: </strong><span className="text-gray-900">NA</span></p>
      </div>

      <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span><strong>Negative Marking: </strong>{section.negativeMarking.checked ? section.negativeMarking.value : 'No'}</span>
        {section.negativeMarking.checked && (
        <Check className="w-5 h-5 text-green-500" />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span><strong>Partial Marking</strong></span>
        {section.partialMarking && (
        <Check className="w-5 h-5 text-green-500" />
        // <StatusChips status={section} />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span><strong>Cut off marks: </strong>{section.cutoffMarking.checked ? section.cutoffMarking.value : 'NA'}</span>
        {section.cutoffMarking.checked && (
        <Check className="w-5 h-5 text-green-500" />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="font-medium"><strong>Total Marks: </strong>{section.totalMark}</span>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default SectionDetails;