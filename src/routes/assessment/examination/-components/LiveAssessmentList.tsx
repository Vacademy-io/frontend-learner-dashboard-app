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
import { MyButton } from '@/components/design-system/button';
import { StatusChips } from '@/components/design-system/chips';
// import { Assessment, AssessmentCardProps, AssessmentListProps } from '@/types/assessment';

// Define types for the assessment data structure
import { Assessment, AssessmentCardProps, AssessmentListProps } from '@/types/assessment';
import { assessments } from '../-utils.ts/dummyData';

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
          {/* <StatusChips statusData = {status} /> */}
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
      <MyButton 
        buttonType = "secondary"
        className="w-full"
        disabled={status.toLowerCase() !== 'active'}
        onClick={handleJoinAssessment}
      >
        Join Assessment
      </MyButton>
    </Card>
  );
};

const AssessmentList: React.FC<AssessmentListProps> = ({ assessments }) => {
  return (
    <div className="w-full ">
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
  

  return <AssessmentList assessments={assessments} />;
};
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

export default LiveAssessmentList;