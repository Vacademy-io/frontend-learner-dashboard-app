// import { useIsMobile } from "@/hooks/use-mobile";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { MyButton } from "@/components/design-system/button";
// import { CalendarBlank } from "phosphor-react";
// import { Link } from "@tanstack/react-router";

// export const ScheduleTestHeaderDescription = () => {
//     const isMobile = useIsMobile();
//     return (
//         <div
//             className={`mb-8 flex items-center justify-between ${
//             isMobile ? "flex-wrap gap-4" : "gap-10"
//             }`}
//         >
//             <div className="flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
//                 <h1 className="text-[1.25rem] font-semibold text-neutral-600 sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem]">
//                     Comprehensive Test Management
//                 </h1>
//                 <p className="text-neutral-600 text-sm md:text-base lg:text-lg">
//                     Effortlessly monitor and manage all assessments with a comprehensive view of
//                     ongoing, upcoming, and past exams. Gain easy access to each test&rsquo;s
//                     details, schedule, and status, ensuring organized oversight of the entire
//                     testing process from start to finish.
//                 </p>
//             </div>
//             <AlertDialog>
//                 <AlertDialogTrigger>
//                     <Link to="/assessment/tests/create-assessment">
//                         <MyButton scale="large" buttonType="primary" layoutVariant="default">
//                             <CalendarBlank size={32} />
//                             Schedule Test
//                         </MyButton>
//                     </Link>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             This action cannot be undone. This will permanently delete your account
//                             and remove your data from our servers.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction>Continue</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </div>
//     );
// };

import { useIsMobile } from "@/hooks/use-mobile";

export const ScheduleTestHeaderDescription = () => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`mb-8 flex  items-center justify-between ${
        isMobile ? "flex-wrap gap-4" : "gap-10"
      }`}
    >
      {/* Responsive Container for Heading and Description */}
      <div className="flex flex-col w-full sm:w-80% md:w-66% lg:w-50%">
        <h1 className="text-[1.25rem] font-semibold text-neutral-600 text-weight-600 sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem]">
          Stay Assessment Ready
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base md:text-lg lg:text-xl">
          View all the Assessments created by the admin, along with their
          schedules and statuses to stay on track.
        </p>
      </div>
    </div>
  );
};
