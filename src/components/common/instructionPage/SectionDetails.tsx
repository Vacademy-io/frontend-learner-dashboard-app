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
import { StatusCheck } from "@/components/design-system/chips";

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
                <StatusCheck  />
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <p className="font-semibold">Partial Marking</p>
              </div>
              {section.partialMarking && (
                <StatusCheck  />
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
                <StatusCheck  />
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




// import React from "react";
// import { Check } from "lucide-react";
// import { SectionProps } from "@/types/previewInstructionAssessment";
// import { Chips, StatusChips } from "@/components/design-system/chips";

// export const SectionDetails: React.FC<SectionProps> = ({ section }) => {
//   return (
//     <div className="w-full mb-4">
//       <div className="space-y-6">
//         <div className="flex items-center gap-3">
//           <h2 className="text-orange-500 text-lg font-semibold">
//             {section.subject}
//           </h2>
//           <StatusChips status="active" />
//         </div>

//         <div className="space-y-4">
//           <div className="text-sm text-gray-600">
//             <div className="font-semibold mb-2">
//               <p className="font-bold">Section Description:</p>
//             </div>
//             <div className="text-gray-700">{section.sectionDesc}</div>
//           </div>

//           <div className="text-sm text-gray-600">
//             <div className="mb-2">
//               <p className="font-semibold">Section Duration: </p>
//               <Chips
//                 label="NA"
//                 className="mt-1 bg-neutral-50"
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div>
//                 <p className="font-semibold">Negative Marking: </p>
//                 <Chips
//                   label={section.negativeMarking.checked ? section.negativeMarking.value : "No"}
//                   className="mt-1"
//                   selected={section.negativeMarking.checked}
//                 />
//               </div>
//               {section.negativeMarking.checked && (
//                 <Chips
//                   leadingIcon={Check}
//                   className="bg-success-50"
//                 />
//               )}
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div>
//                 <p className="font-semibold">Partial Marking</p>
//                 <Chips
//                   label="Enabled"
//                   className="mt-1"
//                   selected={section.partialMarking}
//                 />
//               </div>
//               {section.partialMarking && (
//                 <Chips
//                   leadingIcon={Check}
//                   className="bg-success-50"
//                 />
//               )}
//             </div>

//             <div className="flex items-center justify-between text-sm text-gray-600">
//               <div>
//                 <span className="font-medium">Cut off marks: </span>
//                 <Chips
//                   label={section.cutoffMarking.checked ? section.cutoffMarking.value : "NA"}
//                   className="mt-1"
//                   selected={section.cutoffMarking.checked}
//                 />
//               </div>
//               {section.cutoffMarking.checked && (
//                 <Chips
//                   leadingIcon={Check}
//                   className="bg-success-50"
//                 />
//               )}
//             </div>

//             <div className="mt-4">
//               <span className="font-semibold">Total Marks: </span>
//               <Chips
//                 label={section.totalMark}
//                 className="mt-1 bg-primary-50"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SectionDetails;



