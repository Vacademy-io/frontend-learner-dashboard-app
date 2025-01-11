// import React, { useEffect } from "react";
// import { cn } from "@/lib/utils";
// import {
//     InputChipsProps,
//     FilterChipsProps,
//     ChipsProps,
//     ChipsWrapperProps,
// } from "./utils/types/chips-types";
// import { PlusCircle, Check } from "@phosphor-icons/react";
// import { ActivityStatusData } from "./utils/constants/chips-data";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
//     CommandSeparator,
// } from "../ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Separator } from "../ui/separator";
// import { ActivityStatus } from "./utils/types/chips-types";

// const ChipsWrapper = ({ children, className }: ChipsWrapperProps) => {
//     return (
//         <div
//             className={cn(
//                 "inline-flex h-8 flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 px-3 py-[6px] text-body font-regular text-neutral-600",
//                 className,
//             )}
//         >
//             {children}
//         </div>
//     );
// };

// const Chips = ({
//     label,
//     trailingIcon,
//     leadingIcon,
//     avatarAddress,
//     selected,
//     disabled,
//     className,
// }: ChipsProps) => {
//     return (
//         <ChipsWrapper
//             className={cn(
//                 avatarAddress ? "rounded-full" : "rounded-lg",
//                 "active:bg-[#f5e6d1]",
//                 disabled
//                     ? "border-neutral-100"
//                     : selected
//                       ? "border-primary-500 bg-primary-100"
//                       : "hover:border-primary-500 hover:bg-primary-50",
//                 className,
//             )}
//         >
//             {leadingIcon &&
//                 React.createElement(leadingIcon, {
//                     className: cn(
//                         "size-[18px]",
//                         disabled ? "text-neutral-300" : "text-neutral-600",
//                     ),
//                 })}

//             {avatarAddress && (
//                 <div className="size-5 overflow-hidden rounded-full">
//                     <img src={avatarAddress} className="size-5 object-cover" alt="avatar" />
//                 </div>
//             )}

//             {label && (
//                 <div
//                     className={cn(
//                         "flex items-center text-[14px] leading-[22px]",
//                         disabled ? "text-neutral-300" : "text-neutral-600",
//                     )}
//                 >
//                     {label}
//                 </div>
//             )}
//             {trailingIcon &&
//                 React.createElement(trailingIcon, {
//                     className: cn("size-4", disabled ? "text-neutral-300" : "text-neutral-600"),
//                 })}
//         </ChipsWrapper>
//     );
// };

// export const InputChips = (props: InputChipsProps) => {
//     return <Chips {...props} />;
// };

// export const FilterChips = ({
//     label,
//     filterList,
//     selectedFilters,
//     setSelectedFilters,
//     disabled,
//     clearFilters,
// }: FilterChipsProps) => {
//     const isSelected = (option: string | number) => selectedFilters.includes(String(option));

//     const handleSelect = (option: string | number) => {
//         if (setSelectedFilters) {
//             if (isSelected(option)) {
//                 setSelectedFilters((prev) => prev.filter((item) => item !== String(option)));
//             } else {
//                 setSelectedFilters((prev) => [...prev, String(option)]);
//             }
//         }
//     };

//     const handleClearFilters = () => {
//         if (setSelectedFilters) {
//             setSelectedFilters([]);
//         }
//     };

//     useEffect(() => {
//         if (clearFilters) handleClearFilters();
//     }, [clearFilters]);

//     return (
//         <Popover>
//             <PopoverTrigger className="flex items-center">
//                 <button>
//                     <ChipsWrapper
//                         className={cn(
//                             disabled
//                                 ? "border-neutral-100"
//                                 : selectedFilters.length > 0
//                                   ? "border-primary-500 bg-primary-100"
//                                   : "hover:border-primary-500 hover:bg-primary-50",
//                         )}
//                     >
//                         <div className="flex items-center gap-2">
//                             {React.createElement(PlusCircle, {
//                                 className: cn(
//                                     "size-[18px]",
//                                     disabled ? "text-neutral-300" : "text-neutral-600",
//                                 ),
//                             })}
//                             <div
//                                 className={cn(
//                                     "flex items-center text-[14px] leading-[22px]",
//                                     disabled ? "text-neutral-300" : "text-neutral-600",
//                                 )}
//                             >
//                                 {label}{" "}
//                             </div>

//                             <div
//                                 className={`${
//                                     selectedFilters.length > 0 ? "visible" : "hidden"
//                                 } flex items-center gap-2`}
//                             >
//                                 <Separator
//                                     orientation="vertical"
//                                     className="mx-2 h-4 bg-neutral-500"
//                                 />
//                                 <div
//                                     className={`inline-flex items-center rounded-md bg-primary-200 px-2.5 py-0.5 text-caption font-normal ${
//                                         selectedFilters.length > 0 ? "visible" : "hidden"
//                                     }`}
//                                 >
//                                     {selectedFilters.length} selected
//                                 </div>
//                             </div>
//                         </div>
//                     </ChipsWrapper>
//                 </button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[200px] p-0" align="start">
//                 <Command>
//                     <CommandInput placeholder="Search" />
//                     <CommandList>
//                         <CommandEmpty>filters_no_results_found</CommandEmpty>
//                         <CommandGroup>
//                             {filterList?.map((option) => (
//                                 <CommandItem
//                                     key={String(option)}
//                                     onSelect={() => handleSelect(option)}
//                                 >
//                                     <div
//                                         className={cn(
//                                             "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300",
//                                             isSelected(option)
//                                                 ? "text-base-white border-none bg-primary-300"
//                                                 : "opacity-70 [&_svg]:invisible",
//                                         )}
//                                     >
//                                         <Check className={cn("h-4 w-4")} />
//                                     </div>
//                                     <span>{option}</span>
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                         {selectedFilters.length > 0 && (
//                             <>
//                                 <CommandSeparator />
//                                 <CommandGroup>
//                                     <CommandItem onSelect={handleClearFilters}>
//                                         clear_filters
//                                     </CommandItem>
//                                 </CommandGroup>
//                             </>
//                         )}
//                     </CommandList>
//                 </Command>
//             </PopoverContent>
//         </Popover>
//     );
// };

// export const StatusChips = ({ status }: { status: ActivityStatus }) => {
//     const statusData = ActivityStatusData[status];
//     const StatusIcon = statusData.icon;

//     return (
//         <ChipsWrapper className={cn(statusData.color.bg, "")}>
//             <StatusIcon className={cn(statusData.color.icon, "size-[18px]")} weight="fill" />
//             <div className="text-body capitalize text-neutral-600">{status}</div>
//         </ChipsWrapper>
//     );
// };

// export { Chips, ChipsWrapper };






// import React from 'react';
// import { Pause, PauseCircle } from 'lucide-react';

// export type StatusMode = 'Online' | 'Offline';
// export type StatusState = 'Active' | 'Paused';

// export interface StatusChipProps {
//   mode?: StatusMode;
//   status?: StatusState;
//   showDot?: boolean;
//   className?: string;
// }

// export const StatusChip: React.FC<StatusChipProps> = ({ 
//   mode, 
//   status,
//   showDot = true,
//   className = ''
// }) => {
//   const getStateStyles = () => {
//     if (status === 'Paused' || mode === 'Offline') {
//       return {
//         bg: 'bg-gray-50',
//         text: 'text-gray-600',
//         dot: 'bg-gray-400'
//       };
//     }
    
//     return {
//       bg: 'bg-green-50',
//       text: 'text-green-700',
//       dot: 'bg-green-500'
//     };
//   };

//   const styles = getStateStyles();
//   const displayText = status || mode;

//   return (
//     <div 
//       className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${styles.bg} ${className}`}
//     >
//       {status === 'Paused' ? (
//         // <Pause className={`h-3 w-3 ${styles.text}`} />
//         <PauseIcon />
//       ) : (
//         showDot && <div className={`h-2 w-2 rounded-full ${styles.dot}`} />
//       )}
//       <div className="flex items-center gap-1">
//         <span className={`text-sm font-medium ${styles.text}`}>
//           {displayText}
//         </span>
//       </div>
//     </div>
//   );
// };




// // import React from 'react';

export const PauseIcon = ({ className = '', size = 24 }) => {
  return (
    <div className={`inline-flex ${className}`} style={{ width: size, height: size }}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <circle cx="12" cy="12" r="10" fill="#E5E7EB"/>
      <rect x="9" y="8" width="2" height="8" rx="1" fill="#6B7280"/>
      <rect x="13" y="8" width="2" height="8" rx="1" fill="#6B7280"/>
    </svg>
    </div>
  );
};

// export default PauseIcon;





import React from 'react';
import { Pause } from 'lucide-react';
import { Check } from 'lucide-react';

export type StatusMode = 'Online' | 'Offline';
export type StatusState = 'Active' | 'Paused';

export interface StatusChipProps {
  mode?: StatusMode;
  status?: StatusState;
  showDot?: boolean;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ 
  mode, 
  status,
  showDot = true,
  className = ''
}) => {
  const getStateStyles = () => {
    if (status === 'Paused' || mode === 'Offline') {
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        dot: 'bg-gray-400',
        border: 'border-gray-300',
      };
    }
    
    return {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
      border: 'border-gray-300',
    };
  };

  const styles = getStateStyles();
  const displayText = status || mode;

  return (
    <div 
      className={`inline-flex items-center gap-2 rounded-sm px-3 py-1 border ${styles.bg} ${styles.border} transition-all duration-200 ${className}`}
    >
      {status === 'Paused' ? (
        <PauseIcon/>
      ) : (
        status ? (
            
        //   <StatusCheck />
        <div className="flex items-center justify-center rounded-full bg-green-500 p-1">
      <Check className="h-2 w-2 text-white" />
    </div>
        ) : (
          showDot && <div className={`h-2 w-2 rounded-full ${styles.dot}`} />
        )
      )}
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${styles.text}`}>
          {displayText}
        </span>
      </div>
    </div>
  );
};



export const StatusCheck = () => (
    <div className="flex items-center justify-center rounded-full bg-green-500 p-1">
      <Check className="h-3 w-3 text-white" />
    </div>
  );