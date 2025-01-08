// import React, { useState, useEffect } from 'react';
// import { AlertDialog, AlertDialogContent, AlertDialogOverlay } from '@/components/ui/alert-dialog';
// import { Card, CardContent } from '@/components/ui/card';
// import { Clock, Calendar } from 'lucide-react';
// import { Assessment, AssessmentCardProps } from "@/types/assessment";

// const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (showPopup) {
//       timer = setTimeout(() => {
//         setShowPopup(false);
//       }, 3000);
//     }
//     return () => clearTimeout(timer);
//   }, [showPopup]);

//   const handleClose = () => {
//     setShowPopup(false);
//   };

//   return (
//     <>
//       <Card 
//         className="w-full mb-4 hover:shadow-lg transition-shadow cursor-pointer"
//         onClick={() => setShowPopup(true)}
//       >
//         <CardContent className="p-4">
//           <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
          
//           <div className="space-y-2 text-sm text-gray-600">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               <span>Live Date: {assessment.liveDate}</span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4" />
//               <span>Live Availability: {assessment.availability}</span>
//             </div>
            
//             <div className="mt-2">
//               <p className="font-medium">Subject: {assessment.subject}</p>
//               <p>Duration: {assessment.duration}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <AlertDialog 
//         open={showPopup} 
//         onOpenChange={handleClose}
//       >
//         <AlertDialogOverlay 
//           className="bg-black/50" 
//           onClick={handleClose} 
//         />
//         <AlertDialogContent className="max-w-md bg-[#FDFAF6] rounded-lg p-6">
        
//           <div className="text-gray-700">
//             The assessment{' '}
//             <span className="text-orange-500">
//               {assessment.title}
//             </span>
//             {' '}is not live currently. You can appear for the assessment when it goes live
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// };

// // Example usage component
// const AssessmentList = () => {
//   const assessments: Assessment[] = [
//     {
//       title: "The Human Eye and The Colourful World",
//       subject: "Physics",
//       liveDate: "17 Oct - 19 Oct",
//       availability: "11:00 am - 6:00 pm",
//       duration: "20 min",
//       isLive: false
//     },
//     {
//       title: "Polynomials",
//       subject: "Mathematics", 
//       liveDate: "17 Oct",
//       availability: "Whole day",
//       duration: "20 min",
//       isLive: true
//     }
//   ];

//   return (
//     <div className="p-4 space-y-4">
//       {assessments.map((assessment, index) => (
//         <AssessmentCard 
//           key={index}
//           assessment={assessment}
//         />
//       ))}
//     </div>
//   );
// };

// export default AssessmentList;




















import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogOverlay } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Assessment, AssessmentCardProps } from "@/types/assessment";

const ITEMS_PER_PAGE = 2;

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
        className="w-full mb-4 hover:shadow-lg transition-shadow cursor-pointer"
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

const AssessmentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
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
    },
    // Add more sample assessments for pagination demonstration
    {
      title: "Chemical Reactions",
      subject: "Chemistry",
      liveDate: "18 Oct",
      availability: "9:00 am - 5:00 pm",
      duration: "30 min",
      isLive: false
    },
    {
      title: "Trigonometry",
      subject: "Mathematics",
      liveDate: "19 Oct",
      availability: "Whole day",
      duration: "25 min",
      isLive: true
    },
    {
      title: "Electricity",
      subject: "Physics",
      liveDate: "20 Oct",
      availability: "10:00 am - 4:00 pm",
      duration: "35 min",
      isLive: false
    },
  ];

  const totalPages = Math.ceil(assessments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAssessments = assessments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-4">
        {currentAssessments.map((assessment, index) => (
          <AssessmentCard 
            key={index}
            assessment={assessment}
          />
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default AssessmentList;













// import React, { useState } from "react";
// import { AlertDialog, AlertDialogContent, AlertDialogOverlay } from "@/components/ui/alert-dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Clock, Calendar } from "lucide-react";
// import { Assessment, AssessmentCardProps } from "@/types/assessment";

// const AssessmentCard = ({ assessment }: AssessmentCardProps) => {
//   const [showPopup, setShowPopup] = useState(false);

//   const handleClose = () => setShowPopup(false);

//   return (
//     <>
//       <Card 
//         className="w-full mb-4 hover:shadow-lg transition-shadow cursor-pointer"
//         onClick={() => setShowPopup(true)}
//       >
//         <CardContent className="p-4">
//           <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
          
//           <div className="space-y-2 text-sm text-gray-600">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               <span>Live Date: {assessment.liveDate}</span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4" />
//               <span>Live Availability: {assessment.availability}</span>
//             </div>
            
//             <div className="mt-2">
//               <p className="font-medium">Subject: {assessment.subject}</p>
//               <p>Duration: {assessment.duration}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <AlertDialog 
//         open={showPopup} 
//         onOpenChange={handleClose}
//       >
//         <AlertDialogOverlay 
//           className="bg-black/50" 
//           onClick={handleClose} 
//         />
//         <AlertDialogContent className="max-w-md bg-[#FDFAF6] rounded-lg p-6">
//           <div className="text-gray-700">
//             The assessment{" "}
//             <span className="text-orange-500">
//               {assessment.title}
//             </span>{" "}
//             is not live currently. You can appear for the assessment when it goes live
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// };

// const AssessmentList = () => {
//   const assessments: Assessment[] = [
//     {
//       title: "The Human Eye and The Colourful World",
//       subject: "Physics",
//       liveDate: "17 Oct - 19 Oct",
//       availability: "11:00 am - 6:00 pm",
//       duration: "20 min",
//       isLive: false,
//     },
//     {
//       title: "Polynomials",
//       subject: "Mathematics",
//       liveDate: "17 Oct",
//       availability: "Whole day",
//       duration: "20 min",
//       isLive: true,
//     },
//     // Add more assessments as needed
//   ];

//   const itemsPerPage = 1; // Number of cards per page
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(assessments.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   return (
//     <div className="p-4 space-y-4">
//       {/* Render current page items */}
//       {assessments.slice(startIndex, endIndex).map((assessment, index) => (
//         <AssessmentCard key={index} assessment={assessment} />
//       ))}

//       {/* Pagination controls */}
//       <div className="flex items-center justify-between pt-4">
//         <button
//           className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//           onClick={handlePrevious}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//           onClick={handleNext}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AssessmentList;
