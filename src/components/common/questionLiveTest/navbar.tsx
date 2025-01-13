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





'use client'


import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SectionTimer } from './section-timer'
import { useAssessmentStore } from '@/stores/assessment-store'
import { Navigate, useRouter } from '@tanstack/react-router'
import { SubmitModal } from '@/components/modals/submit-modal'
import { TimesUpModal } from '@/components/modals/times-up-modal'
import { HelpModal } from '@/components/modals/help-modals'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HelpCircle } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const { 
    assessment,
    sectionTimers,
    submitAssessment,
    currentSection,
    setCurrentSection,
    moveToNextAvailableSection
  } = useAssessmentStore()

  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimesUpModal, setShowTimesUpModal] = useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [helpType, setHelpType] = useState<'instructions' | 'alerts' | 'reattempt' | 'time' | null>(null)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => prev + 1)
        setShowWarningModal(true)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (!assessment) return null

  const isAllTimeUp = Object.values(sectionTimers).every(timer => timer.timeLeft === 0)

  const handleSubmit = () => {
    submitAssessment()
    router.push('/assessment/completed')
  }

  const handleEndSection = () => {
    if (assessment.canSwitchSections) {
      moveToNextAvailableSection()
    } else {
      setCurrentSection(currentSection + 1)
    }
  }

  if (isAllTimeUp && !showTimesUpModal) {
    setShowTimesUpModal(true)
  }

  const handleWarningClose = () => {
    setShowWarningModal(false)
    if (warningCount >= 3) {
      handleSubmit()
    }
  }

  return (
    <>
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4">
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
          <h2 className="text-lg font-semibold">{assessment.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <SectionTimer />
          {!assessment.canSwitchSections && (
            <Button 
              variant="outline"
              onClick={handleEndSection}
            >
              End Section
            </Button>
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

      <TimesUpModal
        open={showTimesUpModal}
        onOpenChange={setShowTimesUpModal}
        onFinish={handleSubmit}
      />

      <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <AlertDialogContent>
          <AlertDialogDescription>
            Warning: You are attempting to leave the test environment. This is warning {warningCount} of 3. 
            If you attempt to leave again, your test will be automatically submitted.
          </AlertDialogDescription>
          <AlertDialogAction onClick={handleWarningClose}>
            Return to Test
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <HelpModal
        open={helpType !== null}
        onOpenChange={(open) => !open && setHelpType(null)}
        type={helpType || 'instructions'}
      />
    </>
  )
}

