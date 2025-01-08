import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogOverlay } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';
import { Assessment, AssessmentCardProps } from "@/types/assessment";

const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPopup) {
      timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showPopup]);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Card 
        className="w-full max-w-sm mb-4 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowPopup(true)}
      >
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Live Date: {assessment.liveDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Live Availability: {assessment.availability}</span>
            </div>
            
            <div className="mt-2">
              <p className="font-medium">Subject: {assessment.subject}</p>
              <p>Duration: {assessment.duration}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog 
        open={showPopup} 
        onOpenChange={handleClose}
      >
        <AlertDialogOverlay 
          className="bg-black/50" 
          onClick={handleClose} 
        />
        <AlertDialogContent className="max-w-md bg-[#FDFAF6] rounded-lg p-6">
        
          <div className="text-gray-700">
            The assessment{' '}
            <span className="text-orange-500">
              {assessment.title}
            </span>
            {' '}is not live currently. You can appear for the assessment when it goes live
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Example usage component
const AssessmentList = () => {
  const assessments: Assessment[] = [
    {
      title: "The Human Eye and The Colourful World",
      subject: "Physics",
      liveDate: "17 Oct - 19 Oct",
      availability: "11:00 am - 6:00 pm",
      duration: "20 min",
      isLive: false
    },
    {
      title: "Polynomials",
      subject: "Mathematics", 
      liveDate: "17 Oct",
      availability: "Whole day",
      duration: "20 min",
      isLive: true
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {assessments.map((assessment, index) => (
        <AssessmentCard 
          key={index}
          assessment={assessment}
        />
      ))}
    </div>
  );
};

export default AssessmentList;