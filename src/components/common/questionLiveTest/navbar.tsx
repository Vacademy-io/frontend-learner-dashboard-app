
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HelpModal } from '@/components/modals/help-modals'
import { useAssessmentStore } from "@/stores/assessment-store";
import { SubmitModal } from "@/components/modals/submit-modal";
import { useNavigate } from "@tanstack/react-router";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HelpCircle } from 'lucide-react'
import { TimesUpModal } from '@/components/modals/times-up-modal';
import { dummyAssessment } from './page';
import { App } from "@capacitor/app";


export function Navbar() {
  const navigate = useNavigate();
  const [showTimesUpModal, setShowTimesUpModal] = useState(false)
  const {
    assessment,
    submitAssessment,
  } = useAssessmentStore();
    const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningCount, setWarningCount] = useState(0)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => prev + 1)
        setShowWarningModal(true)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const [timeLeft, setTimeLeft] = useState(() => {
      const [minutes, seconds] =
        dummyAssessment.testDuration.entireTestDuration.split(":").map(Number);
      return minutes * 60 + seconds;
    });



    //restrict back button
    useEffect(() => {
      const backButtonListener = App.addListener("backButton", () => {
        // Simply show the submit dialog without preventing default behavior
        setShowSubmitModal(true)
      });
    
      // Cleanup the listener when the component unmounts
      return () => {
        backButtonListener.remove();
      };
    }, []);

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

    const handleWarningClose = () => {
    setShowWarningModal(false)
    if (warningCount >= 3) {
      handleSubmit()
    }
  }

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
  );
}
