// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Circle, CheckCircle2, PauseCircle } from 'lucide-react';
// import { useNavigate } from '@tanstack/react-router';
// // Define types for the assessment data structure
// interface AssessmentStatus {
//   online: boolean;
//   state: 'Active' | 'Paused';
// }

// interface Assessment {
//   title: string;
//   status: AssessmentStatus;
//   start_date: string;
//   end_date: string;
//   subject: string;
//   duration: string;
// }

// // Props interface for the AssessmentCard component
// interface AssessmentCardProps {
//   assessment: Assessment;
// }

// // Props interface for the AssessmentList component
// interface AssessmentListProps {
//   assessments: Assessment[];
// }

// // Helper function types
// type StatusColor = 'text-green-600 bg-green-50' | 'text-orange-600 bg-orange-50' | 'text-gray-600 bg-gray-50';
// type StateType = Assessment['status']['state'];

// const getStatusColor = (state: StateType): StatusColor => {
//   switch (state.toLowerCase()) {
//     case 'active':
//       return 'text-green-600 bg-green-50';
//     case 'paused':
//       return 'text-orange-600 bg-orange-50';
//     default:
//       return 'text-gray-600 bg-gray-50';
//   }
// };

// const getStatusIcon = (state: StateType): React.ReactNode => {
//   switch (state.toLowerCase()) {
//     case 'active':
//       return <CheckCircle2 className="w-4 h-4" />;
//     case 'paused':
//       return <PauseCircle className="w-4 h-4" />;
//     default:
//       return null;
//   }
// };


// const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
//   const navigate = useNavigate();
//   const {
//     title,
//     status,
//     start_date,
//     end_date,
//     subject,
//     duration
//   } = assessment;

//   const handleJoinAssessment = (assessmentId) => {
//     // Navigate using the assessmentId directly from the data
//     navigate({
//       to: `/assessment/examination/${assessmentId}`,
//       params: { assessmentId }
//     });
//   };

//   return (
//     <Card className="max-w-sm p-6 space-y-6">
//       {/* Title */}
//       <h2 className="text-lg font-semibold">
//         {title}
//       </h2>

//       {/* Status Badges */}
//       <div className="flex gap-3">
//         <div className={`flex items-center gap-1.5 text-sm ${status.online ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'} px-3 py-1 rounded-full`}>
//           <Circle className={`w-4 h-4 ${status.online ? 'fill-current' : ''}`} />
//           <span>{status.online ? 'Online' : 'Offline'}</span>
//         </div>
//         <div className={`flex items-center gap-1.5 text-sm ${getStatusColor(status.state)} px-3 py-1 rounded-full`}>
//           {getStatusIcon(status.state)}
//           <span>{status.state}</span>
//         </div>
//       </div>

//       {/* Assessment Details */}
//       <div className="space-y-2 text-sm text-gray-600">
//         <div>
//           <div>Start Date and Time: {start_date}</div>
//           <div>End Date and Time: {end_date}</div>
//         </div>
//         <div>Subject: {subject}</div>
//         <div>Duration: {duration}</div>
//       </div>

//       {/* Join Button */}
//       <Button 
//         className="w-full"
//         disabled={status.state.toLowerCase() === 'paused'}
//         onClick={() => handleJoinAssessment(assessment.assessmentId)}
//       >
//         Join Assessment
//       </Button>
//     </Card>
//   );
// };

// const AssessmentList: React.FC<AssessmentListProps> = ({ assessments }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {assessments.map((assessment, index) => (
//         <AssessmentCard 
//           key={index} 
//           assessment={assessment}
//         />
//       ))}
//     </div>
//   );
// };

// // Example usage with type checking
// const LiveAssessmentList: React.FC = () => {
//   const assessments: Assessment[] = [
//     {
//       "title": "The Human Eye and The Colourful World",
//       "status": {
//         "online": true,
//         "state": "Active"
//       },
//       "start_date": "13/10/2024, 11:15 AM",
//       "end_date": "15/10/2024, 08:30 PM",
//       "subject": "Physics",
//       "duration": "20 min"
//     },
//     {
//       "title": "Polynomials",
//       "status": {
//         "online": false,
//         "state": "Active"
//       },
//       "start_date": "13/10/2024, 11:15 AM",
//       "end_date": "15/10/2024, 08:30 PM",
//       "subject": "Physics",
//       "duration": "20 min"
//     },
//     {
//       "title": "The Human Eye and The Colourful World",
//       "status": {
//         "online": true,
//         "state": "Paused"
//       },
//       "start_date": "13/10/2024, 11:15 AM",
//       "end_date": "15/10/2024, 08:30 PM",
//       "subject": "Physics",
//       "duration": "20 min"
//     }
//   ];

//   return <AssessmentList assessments={assessments} />;
// };

// export default LiveAssessmentList;



import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle, CheckCircle2, PauseCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
// import { Assessment, AssessmentCardProps, AssessmentListProps } from '@/types/assessment';

// Define types for the assessment data structure
interface Question {
  questionType: string;
  questionId: string;
  questionName: string;
  questionMark: string;
  imageDetails: any[];
  options: Array<{
    optionId: string;
    optionName: string;
  }>;
}

interface Section {
  assesmentDuration: string;
  subject: string;
  sectionDesc: string;
  sectionDuration: string;
  negativeMarking: {
    checked: boolean;
    value: string;
  };
  partialMarking: boolean;
  cutoffMarking: {
    checked: boolean;
    value: string;
  };
  totalMark: string;
  questions: Question[];
}

interface Assessment {
  assessmentId: string;
  title: string;
  mode: string;
  status: string;
  startDate: string;
  endDate: string;
  assessmentDuration: string;
  subject: string;
  assessmentInstruction: string;
  assessmentPreview: string;
  canSwitchSections: boolean;
  sections: Section[];
}

// Props interface for the AssessmentCard component
interface AssessmentCardProps {
  assessment: Assessment;
}

// Props interface for the AssessmentList component
interface AssessmentListProps {
  assessments: Assessment[];
}

const getStatusColor = (mode: string, status: string): string => {
  if (status.toLowerCase() !== 'active') {
    return 'text-orange-600 bg-orange-50';
  }
  return mode.toLowerCase() === 'online' 
    ? 'text-green-600 bg-green-50' 
    : 'text-gray-600 bg-gray-50';
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status.toLowerCase()) {
    case 'active':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'paused':
      return <PauseCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  const navigate = useNavigate();
  const {
    assessmentId,
    title,
    mode,
    status,
    startDate,
    endDate,
    subject,
    assessmentDuration
  } = assessment;

  const id = assessment?.assessmentId || "";

  const handleJoinAssessment = () => {
    navigate({
      to: `/assessment/examination/${id}`
    });
  };

  return (
    <Card className="max-w-sm p-6 space-y-6">
      {/* Title */}
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      {/* Status Badges */}
      <div className="flex gap-3">
        <div className={`flex items-center gap-1.5 text-sm ${getStatusColor(mode, status)} px-3 py-1 rounded-full`}>
          <Circle className={`w-4 h-4 ${mode.toLowerCase() === 'online' ? 'fill-current' : ''}`} />
          <span>{mode}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-sm ${getStatusColor(mode, status)} px-3 py-1 rounded-full`}>
          {getStatusIcon(status)}
          <span>{status}</span>
        </div>
      </div>

      {/* Assessment Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <div>Start Date and Time: {startDate}</div>
          <div>End Date and Time: {endDate}</div>
        </div>
        <div>Subject: {subject}</div>
        <div>Duration: {assessmentDuration}</div>
      </div>

      {/* Join Button */}
      <Button 
        className="w-full"
        disabled={status.toLowerCase() !== 'active'}
        onClick={handleJoinAssessment}
      >
        Join Assessment
      </Button>
    </Card>
  );
};

const AssessmentList: React.FC<AssessmentListProps> = ({ assessments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {assessments.map((assessment) => (
        <AssessmentCard 
          key={assessment.assessmentId} 
          assessment={assessment}
        />
      ))}
    </div>
  );
};

// Example usage with the provided data
const LiveAssessmentList: React.FC = () => {
  const assessments: Assessment[] = [
    {
      assessmentId: "A001",
      title: "The Human Eye and The Colourful World",
      mode: "Online",
      status: "Active",
      startDate: "13/10/2024, 11:15 AM",
      endDate: "15/10/2024, 08:30 PM",
      assessmentDuration: "20 min",
      subject: "Physics",
      assessmentInstruction: `
        1. Attempt All Questions: Answer all questions. Ensure accuracy and completeness in each response.
        2. Objective Format: All questions are multiple-choice. Select the best answer for each question.
        3. Single Attempt Only: This Assessment allows for one submission only. Once you submit, you cannot change your answers.
        4. Negative Marking: Incorrect answers may result in a deduction of points.
        5. Submission Guidelines: Double-check all answers before submitting. Click Submit only when you are ready.
        6. No External Help: This is an individual Assessment. Using textbooks, notes, or assistance from others is not permitted.
        7. Stay Focused: Avoid switching tabs or leaving the exam screen, as it may be flagged as suspicious behavior.
        8. Good Luck! Answer carefully and review each question before proceeding.`,
      assessmentPreview: "5 min",
      canSwitchSections: true,
      sections: [
        {
          assesmentDuration: "20 min",
          subject: "Biology",
          sectionDesc: `
            Challenge your understanding of the chapter "Human Eye" with this test. Dive into topics such as the structure of the eye, vision mechanisms, common visual defects, and their corrections. Sharpen your knowledge and prepare effectively!`,
          sectionDuration: "NA",
          negativeMarking: {
            checked: true,
            value: "1",
          },
          partialMarking: true,
          cutoffMarking: {
            checked: true,
            value: "08",
          },
          totalMark: "20",
          questions: [
            {
              questionType: "Multiple Choice",
              questionId: "Q001",
              questionName: "What is the primary function of the human eye?",
              questionMark: "2",
              imageDetails: [],
              options: [
                { optionId: "O001", optionName: "To detect sound" },
                { optionId: "O002", optionName: "To detect light" },
                { optionId: "O003", optionName: "To pump blood" },
                { optionId: "O004", optionName: "To support breathing" },
              ],
            },
            {
              questionType: "Multiple Choice",
              questionId: "Q002",
              questionName: "Which part of the eye controls the amount of light entering it?",
              questionMark: "2",
              imageDetails: [],
              options: [
                { optionId: "O001", optionName: "Cornea" },
                { optionId: "O002", optionName: "Iris" },
                { optionId: "O003", optionName: "Lens" },
                { optionId: "O004", optionName: "Retina" },
              ],
            },
          ],
        },
      ],
    },
    {
      assessmentId: "A002",
      title: "Polynomials",
      mode: "Offline",
      status: "Active",
      startDate: "13/10/2024, 11:15 AM",
      endDate: "15/10/2024, 08:30 PM",
      assessmentDuration: "20 min",
      subject: "Mathematics",
      assessmentInstruction: `
        Follow the general assessment guidelines as mentioned in other assessments.`,
      assessmentPreview: "5 min",
      canSwitchSections: false,
      sections: [
        {
          assesmentDuration: "20 min",
          subject: "Mathematics",
          sectionDesc: `
            Solve polynomial equations and test your algebraic understanding. Learn to identify polynomial degrees, roots, and factorization methods.`,
          sectionDuration: "NA",
          negativeMarking: {
            checked: false,
            value: "0",
          },
          partialMarking: false,
          cutoffMarking: {
            checked: false,
            value: "0",
          },
          totalMark: "25",
          questions: [
            {
              questionType: "Short Answer",
              questionId: "Q101",
              questionName: "Find the roots of the polynomial x^2 - 5x + 6 = 0.",
              questionMark: "5",
              imageDetails: [],
              options: [],
            },
          ],
        },
      ],
    },
  ];

  return <AssessmentList assessments={assessments} />;
};

export default LiveAssessmentList;