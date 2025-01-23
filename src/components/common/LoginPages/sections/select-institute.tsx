import { useState } from "react"
import { MyButton } from "@/components/design-system/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "@tanstack/react-router"

interface InstituteSelectionProps {
  institutes: string[]
  onSelect: (instituteId: string) => void
}



export function InstituteSelection( InstituteSelectionProps) {
    
  const [selectedInstitute, setSelectedInstitute] = useState<string | undefined>()

  const handleSelection = () => {
    if (selectedInstitute) {
      onSelect(selectedInstitute)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Select Your Institute</h2>
      {/* <Select onValueChange={setSelectedInstitute}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an institute" />
        </SelectTrigger>
        <SelectContent>
          {institutes.map((institute) => (
            <SelectItem key={institute} value={institute}>
              {institute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
      <div className="mt-8 flex justify-center">
        <MyButton
          type="button"
          scale="large"
          buttonType="primary"
          layoutVariant="default"
          onClick={handleSelection}
          disabled={!selectedInstitute}
        >
          Continue
        </MyButton>
      </div>
    </div>
  )
}




// import React, { useState } from "react";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
// import { MyButton } from "@/components/design-system/button";

// export const InstituteSelection = ({ authorityKeys }: { authorityKeys: string[] }) => {
//   const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);

  
//   const handleSelect = (institute: string) => {
//     setSelectedInstitute(institute);
//     console.log("Selected Institute:", institute); // Perform any additional actions here
//   };

//   return (
//     <div className="w-full max-w-xs">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <MyButton className="w-full">{selectedInstitute || "Select an Institute"}</MyButton>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           {authorityKeys.map((institute) => (
//             <DropdownMenuItem
//               key={institute}
//               onClick={() => handleSelect(institute)}
//             >
//               {institute}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

// // export default InstictuteSelection;
