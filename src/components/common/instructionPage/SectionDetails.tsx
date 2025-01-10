// import React from "react";
// import { Check } from "lucide-react";
// import { SectionProps } from "@/types/assessment";
// import { StatusChips } from "@/components/design-system/chips";

// export const SectionDetails: React.FC<SectionProps> = ({ section }) => {
//   return (
//     <div className="w-full mb-4">
//       <div className="space-y-6">
//         <h2 className="text-orange-500 text-lg font-medium">
//           {section.subject}
//         </h2>

//         <div className="space-y-4">
//           <div className="text-sm text-gray-600">
//             <div className="font-medium mb-2">
//               <p className="font-semibold">Section Description:</p>
//             </div>
//             <div className="text-gray-700">{section.sectionDesc}</div>
//           </div>

//           <div className="text-sm text-gray-600">
//             <div className="mb-2">
//               <p className="font-semibold">Section Duration: </p>
//               <span className="text-gray-900">NA</span>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div>
//                 <p className="font-semibold">Negative Marking: </p>
//                 {section.negativeMarking.checked
//                   ? section.negativeMarking.value
//                   : "No"}
//               </div>
//               {section.negativeMarking.checked && (
//                 <Check className="w-5 h-5 text-green-500" />
//               )}
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div>
//                 <p className="font-semibold">Partial Marking</p>
//               </div>
//               {section.partialMarking && (
//                 <Check className="w-5 h-5 text-green-500" />
//               )}
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div>
//                 <span className="font-medium">Cut off marks: </span>
//                 {section.cutoffMarking.checked
//                   ? section.cutoffMarking.value
//                   : "NA"}
//               </div>
//               {section.cutoffMarking.checked && (
//                 <Check className="w-5 h-5 text-green-500" />
//               )}
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600"></div>
//             <div className="font-medium">
//               <span className="font-semibold">Total Marks: </span>
//               {section.totalMark}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SectionDetails;

import React from "react";
import { Check } from "lucide-react";
import { SectionProps } from "@/types/previewInstructionAssessment";
import { StatusChips } from "@/components/design-system/chips";

export const SectionDetails: React.FC<SectionProps> = ({ section }) => {
  return (
    <div className="w-full mb-4">
      <div className="space-y-6">
        <h2 className="text-orange-500 text-lg font-semibold">
          {section.subject}
        </h2>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <div className="font-semibold mb-2">
              <p className="font-bold">Section Description:</p>
            </div>
            <div className="text-gray-700">{section.sectionDesc}</div>
          </div>

          <div className="text-sm text-gray-600">
            <div className="mb-2">
              <p className="font-semibold">Section Duration: </p>
              <span className="text-gray-900">NA</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <p className="font-semibold">Negative Marking: </p>
                {section.negativeMarking.checked
                  ? section.negativeMarking.value
                  : "No"}
              </div>
              {section.negativeMarking.checked && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <p className="font-semibold">Partial Marking</p>
              </div>
              {section.partialMarking && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Cut off marks: </span>
                {section.cutoffMarking.checked
                  ? section.cutoffMarking.value
                  : "NA"}
              </div>
              {section.cutoffMarking.checked && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600"></div>
            <div className="">
              <span className="font-semibold">Total Marks: </span>
              {section.totalMark}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDetails;
