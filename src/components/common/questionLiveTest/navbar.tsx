// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { SectionTimer } from './section-timer'
// import { useAssessmentStore } from '@/stores/assessment-store'
// import { Navigate, useRouter } from '@tanstack/react-router'
// import { SubmitModal } from '@/components/modals/submit-modal'
// import { TimesUpModal } from '@/components/modals/times-up-modal'

// export function Navbar() {
//   const router = useRouter()
//   const {
//     assessment,
//     sectionTimers,
//     submitAssessment
//   } = useAssessmentStore()

//   const [showSubmitModal, setShowSubmitModal] = useState(false)
//   const [showTimesUpModal, setShowTimesUpModal] = useState(false)

//   if (!assessment) return null

//   const isAllTimeUp = Object.values(sectionTimers).every(timer => timer.timeLeft === 0)

//   const handleSubmit = () => {
//     submitAssessment()
//     Navigate({ to: `/assessment/examination` }); // Replace with your completion page route
//   }

//   // Show times up modal when all sections are complete
//   if (isAllTimeUp && !showTimesUpModal) {
//     setShowTimesUpModal(true)
//   }

//   return (
//     <>
//       <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//         <div className="flex items-center gap-4">
//           <h2 className="text-lg font-semibold">{assessment.title}</h2>
//         </div>
//         <div className="flex items-center gap-4">
//           <SectionTimer />
//           <Button
//             variant="default"
//             onClick={() => setShowSubmitModal(true)}
//             className="bg-orange-500 hover:bg-orange-600"
//           >
//             Submit
//           </Button>
//         </div>
//       </div>

//       <SubmitModal
//         open={showSubmitModal}
//         onOpenChange={setShowSubmitModal}
//         onConfirm={handleSubmit}
//       />

//       <TimesUpModal
//         open={showTimesUpModal}
//         onOpenChange={setShowTimesUpModal}
//         onFinish={handleSubmit}
//       />
//     </>
//   )
// }








// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { SectionTimer } from "./section-timer";
// import { useAssessmentStore } from "@/stores/assessment-store";
// import { Navigate, useRouter } from "@tanstack/react-router";
// import { SubmitModal } from "@/components/modals/submit-modal";
// import { TimesUpModal } from "@/components/modals/times-up-modal";
// import { HelpModal } from "@/components/modals/help-modals";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { HelpCircle } from "lucide-react";
// import { MyButton } from "@/components/design-system/button";

// export function Navbar() {
//   const router = useRouter();
//   const {
//     assessment,
//     sectionTimers,
//     submitAssessment,
//     currentSection,
//     setCurrentSection,
//     moveToNextAvailableSection,
//   } = useAssessmentStore();

//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [showTimesUpModal, setShowTimesUpModal] = useState(false);
//   const [showWarningModal, setShowWarningModal] = useState(false);
//   const [warningCount, setWarningCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null)

//   const [helpType, setHelpType] = useState<
//     "instructions" | "alerts" | "reattempt" | "time" | null
//   >(null);

//   if (!assessment) return null;

//   const isAllTimeUp = Object.values(sectionTimers).every(
//     (timer) => timer.timeLeft === 0
//   );

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const remainingSeconds = seconds % 60
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
//   }

//   const handleSubmit = () => {
//     submitAssessment();
//     Navigate({ to: `/assessment/report` });
//   };

//   const handleEndSection = () => {
//     if (assessment.canSwitchSections) {
//       moveToNextAvailableSection();
//     } else {
//       setCurrentSection(currentSection + 1);
//     }
//   };

//   if (isAllTimeUp && !showTimesUpModal) {
//     setShowTimesUpModal(true);
//   }

//   const handleWarningClose = () => {
//     setShowWarningModal(false);
//     if (warningCount >= 3) {
//       handleSubmit();
//     }
//   };

  

//   return (
//     <>
//       <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//         <div className="flex  gap-4">
//           <SectionTimer />
//           {timeLeft !== null && (
//             <div className="flex items-center gap-2 text-lg font-mono">
//               <Clock className="h-5 w-5" />
//               <span>{formatTime(timeLeft)}</span>
//             </div>
//           )}
//           <div className="items-end">
//           <MyButton onClick={() => setShowSubmitModal(true)}>
//             Submit
//           </MyButton>
//           </div>
//         </div>
//       </div>

//       <SubmitModal
//         open={showSubmitModal}
//         onOpenChange={setShowSubmitModal}
//         onConfirm={handleSubmit}
//       />

//       <TimesUpModal
//         open={showTimesUpModal}
//         onOpenChange={setShowTimesUpModal}
//         onFinish={handleSubmit}
//       />

//       <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
//         <AlertDialogContent>
//           <AlertDialogDescription>
//             Warning: You are attempting to leave the test environment. This is
//             warning {warningCount} of 3. If you attempt to leave again, your
//             test will be automatically submitted.
//           </AlertDialogDescription>
//           <AlertDialogAction onClick={handleWarningClose}>
//             Return to Test
//           </AlertDialogAction>
//         </AlertDialogContent>
//       </AlertDialog>

//       <HelpModal
//         open={helpType !== null}
//         onOpenChange={(open) => !open && setHelpType(null)}
//         type={helpType || "instructions"}
//       />
//     </>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SectionTimer } from "./section-timer";
import { useAssessmentStore } from "@/stores/assessment-store";
import { Navigate, useRouter } from "@tanstack/react-router";
import { SubmitModal } from "@/components/modals/submit-modal";
import { TimesUpModal } from "@/components/modals/times-up-modal";
import { HelpModal } from "@/components/modals/help-modals";
import { Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle } from "lucide-react";
import { MyButton } from "@/components/design-system/button";

// export function Navbar() {
//   const router = useRouter();
//   const {
//     assessment,
//     sectionTimers,
//     submitAssessment,
//     currentSection,
//     setCurrentSection,
//     moveToNextAvailableSection,
//   } = useAssessmentStore();

//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [showTimesUpModal, setShowTimesUpModal] = useState(false);
//   const [showWarningModal, setShowWarningModal] = useState(false);
//   const [warningCount, setWarningCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [totalTimeLeft, setTotalTimeLeft] = useState<number>(1200); // 20 minutes in seconds

//   const [helpType, setHelpType] = useState<
//     "instructions" | "alerts" | "reattempt" | "time" | null
//   >(null);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (totalTimeLeft > 0) {
//       interval = setInterval(() => {
//         setTotalTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             setShowTimesUpModal(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [totalTimeLeft]);

//   if (!assessment) return null;

//   const isAllTimeUp = Object.values(sectionTimers).every(
//     (timer) => timer.timeLeft === 0
//   ) || totalTimeLeft === 0;

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const remainingSeconds = seconds % 60
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
//   }

//   const handleSubmit = () => {
//     submitAssessment();
//     Navigate({ to: `/assessment/report` });
//   };

//   const handleEndSection = () => {
//     if (assessment.canSwitchSections) {
//       moveToNextAvailableSection();
//     } else {
//       setCurrentSection(currentSection + 1);
//     }
//   };

//   if (isAllTimeUp && !showTimesUpModal) {
//     setShowTimesUpModal(true);
//   }

//   const handleWarningClose = () => {
//     setShowWarningModal(false);
//     if (warningCount >= 3) {
//       handleSubmit();
//     }
//   };

//   return (
//     <>
//       <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//         <div className="flex gap-4">
//           {/* Total Assessment Timer */}
//           <div className="flex items-center gap-2 text-lg font-mono">
//             <Clock className="h-5 w-5" />
//             <span>Total: {formatTime(totalTimeLeft)}</span>
//           </div>
//           {/* Section Timer */}
//           <SectionTimer />  
//           {timeLeft !== null && (
//             <div className="flex items-center gap-2 text-lg font-mono">
//               <Clock className="h-5 w-5" />
//               <span>{formatTime(timeLeft)}</span>
//             </div>
//           )}
//           <div className="items-end">
//             <MyButton onClick={() => setShowSubmitModal(true)}>
//               Submit
//             </MyButton>
//           </div>
//         </div>
//       </div>

//       <SubmitModal
//         open={showSubmitModal}
//         onOpenChange={setShowSubmitModal}
//         onConfirm={handleSubmit}
//       />

//       {/* <TimesUpModal
//         open={showTimesUpModal}
//         onOpenChange={setShowTimesUpModal}
//         onFinish={handleSubmit}
//       /> */}

//       <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
//         <AlertDialogContent>
//           <AlertDialogDescription>
//             Warning: You are attempting to leave the test environment. This is
//             warning {warningCount} of 3. If you attempt to leave again, your
//             test will be automatically submitted.
//           </AlertDialogDescription>
//           <AlertDialogAction onClick={handleWarningClose}>
//             Return to Test
//           </AlertDialogAction>
//         </AlertDialogContent>
//       </AlertDialog>

//       <HelpModal
//         open={helpType !== null}
//         onOpenChange={(open) => !open && setHelpType(null)}
//         type={helpType || "instructions"}
//       />
//     </>
//   );
// }








export function Navbar() {
  const router = useRouter()
  const { 
    assessment,
    sectionTimers,
    submitAssessment,
    entireTestTimer,
    updateEntireTestTimer
  } = useAssessmentStore()
  
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimesUpModal, setShowTimesUpModal] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      updateEntireTestTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [updateEntireTestTimer]);

  if (!assessment) return null

  const isAllTimeUp = Object.values(sectionTimers).every(timer => timer.timeLeft === 0)

  const handleSubmit = () => {
    submitAssessment()
    router.push('/assessment/completed') // Replace with your completion page route
  }

  // Show times up modal when all sections are complete
  if (isAllTimeUp && !showTimesUpModal) {
    setShowTimesUpModal(true)
  }

  return (
    <>
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{assessment.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          {assessment && (
            <div className="flex items-center gap-2 text-lg font-mono">
              <Clock className="h-5 w-5" />
              <span>
                {String(Math.floor((entireTestTimer % 3600000) / 60000)).padStart(2, '0')}:
                {String(Math.floor((entireTestTimer % 60000) / 1000)).padStart(2, '0')}
              </span>
            </div>
          )}
          <Button 
            variant="default"
            onClick={() => setShowSubmitModal(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Submit
          </Button>
        </div>
      </div>

      <SubmitModal 
        open={showSubmitModal}
        onOpenChange={setShowSubmitModal}
        onConfirm={handleSubmit}
      />

      {/* <TimesUpModal
        open={showTimesUpModal}
        onOpenChange={setShowTimesUpModal}
        onFinish={handleSubmit}
      /> */}
    </>
  )
}

