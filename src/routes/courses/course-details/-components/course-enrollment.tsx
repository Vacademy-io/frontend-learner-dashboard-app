import { MyButton } from "@/components/design-system/button";
import { CourseDetailsFormValues } from "./course-details-schema";

type CourseData = CourseDetailsFormValues['courseData'];

interface CourseEnrollmentProps {
    courseData: CourseData;
    selectedSession: string;
    selectedLevel: string;
    onEnrollmentClick: () => void;
}

export const CourseEnrollment = ({
    courseData,
    selectedSession,
    selectedLevel,
    onEnrollmentClick,
}: CourseEnrollmentProps) => {
    // Check if user is already enrolled (this would need to be passed as a prop in real implementation)
    const isAlreadyEnrolled = false; // This should come from props or context

    return (
        <div className="w-full max-w-[350px] rounded-lg border bg-white p-4 sm:p-6 shadow-lg">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <div className="p-1.5 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg shadow-sm">
                        <svg
                            className="w-4 h-4 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                        Enroll in Course
                    </h2>
                </div>

                {/* Course Info */}
                <div className="space-y-3">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {courseData.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Start your learning journey today
                        </p>
                    </div>

                    {/* Enroll Button */}
                    {!isAlreadyEnrolled && selectedSession && selectedLevel && (
                        <MyButton
                            type="button"
                            scale="large"
                            buttonType="primary"
                            layoutVariant="default"
                            className="mt-2 !min-w-full !w-full text-xs h-8"
                            onClick={onEnrollmentClick}
                        >
                            Enroll Now
                        </MyButton>
                    )}

                    {isAlreadyEnrolled && (
                        <div className="text-center py-2">
                            <span className="text-sm text-green-600 font-medium">
                                ✓ Already Enrolled
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
