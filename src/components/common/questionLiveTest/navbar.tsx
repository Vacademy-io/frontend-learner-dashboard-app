// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { SectionTimer } from './section-timer'
// import { HelpModal } from '@/components/modals/help-modals'
// import { useAssessmentStore } from "@/stores/assessment-store";
// import { SubmitModal } from "@/components/modals/submit-modal";
// import { TimesUpModal } from "@/components/modals/times-up-modal";
// import { useNavigate, useRouter } from "@tanstack/react-router";
// import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HelpCircle, Clock } from 'lucide-react'

// export function Navbar() {
//   const router = useRouter()
//   const { 
//     assessment,
//     sectionTimers,
//     submitAssessment,
//     currentSection,
//     setCurrentSection,
//     moveToNextAvailableSection,
//     testEndTime
//   } = useAssessmentStore()

//   const [showSubmitModal, setShowSubmitModal] = useState(false)
//   const [showTimesUpModal, setShowTimesUpModal] = useState(false)
//   const [showWarningModal, setShowWarningModal] = useState(false)
//   const [warningCount, setWarningCount] = useState(0)
//   const [helpType, setHelpType] = useState<'instructions' | 'alerts' | 'reattempt' | 'time' | null>(null)
//   const [entireTimeLeft, setEntireTimeLeft] = useState<number | null>(null)
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       e.preventDefault()
//       e.returnValue = ''
//     }

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setWarningCount((prev) => prev + 1)
//         setShowWarningModal(true)
//       }
//     }

//     window.addEventListener('beforeunload', handleBeforeUnload)
//     document.addEventListener('visibilitychange', handleVisibilityChange)

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload)
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//     }
//   }, [])

//   useEffect(() => {
//     if (!testEndTime) return

//     const updateTimeLeft = () => {
//       const now = Date.now()
//       const diff = testEndTime - now
//       setEntireTimeLeft(Math.max(0, Math.floor(diff / 1000)))
//     }

//     updateTimeLeft()
//     const timer = setInterval(updateTimeLeft, 1000)

//     return () => clearInterval(timer)
//   }, [testEndTime])

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const remainingSeconds = seconds % 60
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
//   }

//   if (!assessment) return null

//   const isAllTimeUp = Object.values(sectionTimers).every(timer => timer.timeLeft === 0)

//   const handleSubmit = () => {
//     submitAssessment()
//     navigate({
//       to: "/assessment/examination",
//     })
//   }


//   if (isAllTimeUp && !showTimesUpModal) {
//     setShowTimesUpModal(true)
//   }

//   const handleWarningClose = () => {
//     setShowWarningModal(false)
//     if (warningCount >= 3) {
//       handleSubmit()
//     }
//   }

//   return (
//     <>
//       <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//         <div className="flex items-center gap-4">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <HelpCircle className="h-5 w-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuItem onClick={() => setHelpType('instructions')}>
//                 Instructions
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType('alerts')}>
//                 Assessment Alerts
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType('reattempt')}>
//                 Request Reattempt
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType('time')}>
//                 Request Time Increase
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <div className="flex items-center gap-4">
//           <SectionTimer />
//           {assessment.testDuration.entireTestDuration && entireTimeLeft !== null && (
//             <div className="flex items-center gap-2 text-lg font-mono mr-4">
//               <Clock className="h-5 w-5" />
//               <span>
//                 {formatTime(entireTimeLeft)}
//               </span>
//             </div>
//           )}
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

//       {/* <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
//         <AlertDialogContent>
//           <AlertDialogDescription>
//             Warning: You are attempting to leave the test environment. This is warning {warningCount} of 3. 
//             If you attempt to leave again, your test will be automatically submitted.
//           </AlertDialogDescription>
//           <AlertDialogAction onClick={handleWarningClose}>
//             Return to Test
//           </AlertDialogAction>
//         </AlertDialogContent>
//       </AlertDialog> */}

//       <HelpModal
//         open={helpType !== null}
//         onOpenChange={(open) => !open && setHelpType(null)}
//         type={helpType || 'instructions'}
//       />
//     </>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HelpModal } from '@/components/modals/help-modals'
import { useAssessmentStore } from "@/stores/assessment-store";
import { SubmitModal } from "@/components/modals/submit-modal";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HelpCircle } from 'lucide-react'
import { TimesUpModal } from '@/components/modals/times-up-modal';
import { dummyAssessment } from './page';

export function Navbar() {
  const navigate = useNavigate();
  const [showTimesUpModal, setShowTimesUpModal] = useState(false)
  const {
    assessment,
    submitAssessment,
  } = useAssessmentStore();



  const [timeLeft, setTimeLeft] = useState(() => {
      const [minutes, seconds] =
        dummyAssessment.testDuration.entireTestDuration.split(":").map(Number);
      return minutes * 60 + seconds;
    });

  useEffect(() => {
      // if (timeLeft <= 0) {
      //   navigate({
      //     to: "/assessment/examination",
      //   });
      //   return;
      // }

      
  if ( timeLeft <= 0) {
    setShowTimesUpModal(true)
  }
  
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
  
      return () => clearInterval(timer);
    }, [timeLeft, navigate]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [helpType, setHelpType] = useState<'instructions' | 'alerts' | 'reattempt' | 'time' | null>(null);

  if (!assessment) return null;

  const handleSubmit = () => {
    submitAssessment();
    navigate({
      to: "/assessment/examination",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="sticky bg-primary-50 top-0 z-50 flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setHelpType('instructions')}>
                Instructions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHelpType('alerts')}>
                Assessment Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHelpType('reattempt')}>
                Request Reattempt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHelpType('time')}>
                Request Time Increase
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2  mt-2 sm:mt-0 lg:mr-10 md:mr-10">
            {formatTime(timeLeft)
              .split(":")
              .map((time, index) => (
                <span
                  key={index}
                  className="border border-gray-400 px-2 py-1 rounded"
                >
                  {time}
                </span>
              ))}
          </div>
        <div className="flex items-center gap-4">
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

      
       <TimesUpModal
        open={showTimesUpModal}
        onOpenChange={setShowTimesUpModal}
        onFinish={handleSubmit}
      />

      <HelpModal
        open={helpType !== null}
        onOpenChange={(open) => !open && setHelpType(null)}
        type={helpType || 'instructions'}
      />
    </>
  );
}


// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { SectionTimer } from './section-timer'
// import { HelpModal } from '@/components/modals/help-modals'
// import { useAssessmentStore } from "@/stores/assessment-store";
// import { SubmitModal } from "@/components/modals/submit-modal";
// import { TimesUpModal } from "@/components/modals/times-up-modal";
// import { useRouter } from "@tanstack/react-router";
// import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HelpCircle, Clock } from 'lucide-react'

// export function Navbar() {
//   const router = useRouter()
//   const { 
//     assessment,
//     sectionTimers,
//     submitAssessment,
//     currentSection,
//     setCurrentSection,
//     moveToNextAvailableSection,
//     testEndTime
//   } = useAssessmentStore()

//   const [showSubmitModal, setShowSubmitModal] = useState(false)
//   const [showTimesUpModal, setShowTimesUpModal] = useState(false)
//   const [showWarningModal, setShowWarningModal] = useState(false)
//   const [warningCount, setWarningCount] = useState(0)
//   const [helpType, setHelpType] = useState<'instructions' | 'alerts' | 'reattempt' | 'time' | null>(null)
//   const [entireTimeLeft, setEntireTimeLeft] = useState<number | null>(null)

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       e.preventDefault()
//       e.returnValue = ''
//     }

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setWarningCount((prev) => prev + 1)
//         setShowWarningModal(true)
//       }
//     }

//     window.addEventListener('beforeunload', handleBeforeUnload)
//     document.addEventListener('visibilitychange', handleVisibilityChange)

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload)
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//     }
//   }, [])

//   useEffect(() => {
//     if (!testEndTime) return

//     const updateTimeLeft = () => {
//       const now = Date.now()
//       const diff = testEndTime - now
//       setEntireTimeLeft(Math.max(0, Math.floor(diff / 1000)))
//     }

//     updateTimeLeft()
//     const timer = setInterval(updateTimeLeft, 1000)

//     return () => clearInterval(timer)
//   }, [testEndTime])

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const remainingSeconds = seconds % 60
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
//   }

//   if (!assessment) return null

//   const isAllTimeUp = Object.values(sectionTimers).every(timer => timer.timeLeft === 0)

//   const handleSubmit = () => {
//     submitAssessment()
//     router.push('/assessment/completed')
//   }

//   if (isAllTimeUp && !showTimesUpModal) {
//     setShowTimesUpModal(true)
//   }

//   const handleWarningClose = () => {
//     setShowWarningModal(false)
//     if (warningCount >= 3) {
//       handleSubmit()
//     }
//   }

//   return (
//     <>
//       <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//         <div className="flex items-center gap-4">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <HelpCircle className="h-5 w-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuItem onClick={() => setHelpType('instructions')}>
//                 Instructions
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType('alerts')}>
//                 Assessment Alerts
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType('reattempt')}>
//                 Request Reattempt
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType('time')}>
//                 Request Time Increase
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//         <div className="flex items-center gap-4">
//           <SectionTimer />
//           {entireTimeLeft !== null && (
//             <div className="flex items-center gap-2 text-lg font-mono mr-4">
//               <Clock className="h-5 w-5" />
//               <span>
//                 {formatTime(entireTimeLeft)}
//               </span>
//             </div>
//           )}
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

//       <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
//         <AlertDialogContent>
//           <AlertDialogDescription>
//             Warning: You are attempting to leave the test environment. This is warning {warningCount} of 3. 
//             If you attempt to leave again, your test will be automatically submitted.
//           </AlertDialogDescription>
//           <AlertDialogAction onClick={handleWarningClose}>
//             Return to Test
//           </AlertDialogAction>
//         </AlertDialogContent>
//       </AlertDialog>

//       <HelpModal
//         open={helpType !== null}
//         onOpenChange={(open) => !open && setHelpType(null)}
//         type={helpType || 'instructions'}
//       />
//     </>
//   )
// }




// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { SubmitModal } from "./modals/submit-modal"
// import { TimesUpModal } from "./modals/times-up-modal"
// import { HelpModal } from "./modals/help-modals"
// import useAssessmentStore from "../store/assessment-store"
// import { useRouter } from "next/navigation"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { HelpCircle, Clock } from "lucide-react"
// import { Capacitor } from "@capacitor/core"
// import { App } from "@capacitor/app"




// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { SectionTimer } from './section-timer'
// import { HelpModal } from '@/components/modals/help-modals'
// import { useAssessmentStore } from "@/stores/assessment-store";
// import { SubmitModal } from "@/components/modals/submit-modal";
// import { TimesUpModal } from "@/components/modals/times-up-modal";
// import { useRouter } from "@tanstack/react-router";
// import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { HelpCircle, Clock } from 'lucide-react'

// export function Navbar() {
//   // const router = useRouter()
//   const {
//     assessment,
//     sectionTimers,
//     submitAssessment,
//     currentSection,
//     setCurrentSection,
//     moveToNextAvailableSection,
//     testEndTime,
//     updateEntireTestTimer,
//   } = useAssessmentStore()

//   const [showSubmitModal, setShowSubmitModal] = useState(false)
//   const [showTimesUpModal, setShowTimesUpModal] = useState(false)
//   const [showWarningModal, setShowWarningModal] = useState(false)
//   const [warningCount, setWarningCount] = useState(0)
//   const [helpType, setHelpType] = useState<"instructions" | "alerts" | "reattempt" | "time" | null>(null)
//   const [entireTimeLeft, setEntireTimeLeft] = useState<string | null>(null)

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       e.preventDefault()
//       e.returnValue = ""
//     }

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setWarningCount((prev) => prev + 1)
//         setShowWarningModal(true)
//       }
//     }

//     window.addEventListener("beforeunload", handleBeforeUnload)
//     document.addEventListener("visibilitychange", handleVisibilityChange)

//     if (Capacitor.isNativePlatform()) {
//       App.addListener("backButton", handleBackButton)
//     }

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload)
//       document.removeEventListener("visibilitychange", handleVisibilityChange)
//       if (Capacitor.isNativePlatform()) {
//         App.removeAllListeners()
//       }
//     }
//   }, [])

//   useEffect(() => {
//     const updateEntireTimeLeft = () => {
//       const { entireTestTimer } = useAssessmentStore.getState()
//       setEntireTimeLeft(formatTime(entireTestTimer))
//     }

//     updateEntireTimeLeft()
//     const timer = setInterval(() => {
//       updateEntireTestTimer()
//       updateEntireTimeLeft()
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const remainingSeconds = seconds % 60
//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
//   }

//   const handleBackButton = () => {
//     setShowSubmitModal(true)
//   }

//   if (!assessment) return null

//   const isAllTimeUp = Object.values(sectionTimers).every((timer) => timer.timeLeft === 0)

//   const handleSubmit = () => {
//     submitAssessment()
//     // router.push("/assessment/completed")
//   }

//   if (isAllTimeUp && !showTimesUpModal) {
//     setShowTimesUpModal(true)
//   }

//   const handleWarningClose = () => {
//     setShowWarningModal(false)
//     if (warningCount >= 3) {
//       handleSubmit()
//     }
//   }

//   return (
//     <>
//       <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
//         <div className="flex items-center gap-4">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <HelpCircle className="h-5 w-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuItem onClick={() => setHelpType("instructions")}>Instructions</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType("alerts")}>Assessment Alerts</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType("reattempt")}>Request Reattempt</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setHelpType("time")}>Request Time Increase</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <h2 className="text-lg font-semibold">{assessment.title}</h2>
//         </div>
//         <div className="flex items-center gap-4">
//           {assessment?.testDuration.entireTestDuration && entireTimeLeft && (
//             <div className="flex items-center gap-2 text-lg font-mono">
//               <Clock className="h-5 w-5" />
//               <span>{entireTimeLeft}</span>
//             </div>
//           )}
//           <Button
//             variant="default"
//             onClick={() => setShowSubmitModal(true)}
//             className="bg-orange-500 hover:bg-orange-600"
//           >
//             Submit
//           </Button>
//         </div>
//       </div>

//       <SubmitModal open={showSubmitModal} onOpenChange={setShowSubmitModal} onConfirm={handleSubmit} />

//       <TimesUpModal open={showTimesUpModal} onOpenChange={setShowTimesUpModal} onFinish={handleSubmit} />

//       <HelpModal
//         open={helpType !== null}
//         onOpenChange={(open) => !open && setHelpType(null)}
//         type={helpType || "instructions"}
//       />
//     </>
//   )
// }

