import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { VideoPlayer } from "./course-details-video-player";
import { CourseDetailsFormValues } from "./course-details-schema";

type CourseData = CourseDetailsFormValues['courseData'];

interface LevelOption {
    _id: string;
    value: string;
    label: string;
}

interface SessionOption {
    _id: string;
    value: string;
    label: string;
}

interface CourseSelectorsProps {
    courseData: CourseData;
    sessionOptions: SessionOption[];
    levelOptions: LevelOption[];
    selectedSession: string;
    selectedLevel: string;
    onSessionChange: (sessionId: string) => void;
    onLevelChange: (levelId: string) => void;
}

export const CourseSelectors = ({
    courseData,
    sessionOptions,
    levelOptions,
    selectedSession,
    selectedLevel,
    onSessionChange,
    onLevelChange,
}: CourseSelectorsProps) => {
    return (
        <div className="relative bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 p-3 sm:p-4 group animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>

            {/* Floating orb effect */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-primary-100/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1 translate-x-3"></div>

            <div className="relative">
            {/* Video Player for smaller screens - positioned above levels */}
            {courseData.courseMediaId && (
                <div className="mb-6 lg:hidden flex items-start">
                    <VideoPlayer
                        src={courseData.courseMediaId}
                        className="!w-full max-w-sm"
                    />
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Session Dropdown Logic */}
                {sessionOptions.length === 1 &&
                sessionOptions[0].label === "default" ? null : sessionOptions.length === 1 ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <label className="text-sm font-medium">
                            {sessionOptions[0]?.label}
                        </label>
                    </div>
                ) : sessionOptions.length > 1 ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <label className="text-sm font-medium">Session</label>
                        <Select value={selectedSession} onValueChange={onSessionChange}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Select Session" />
                            </SelectTrigger>
                            <SelectContent>
                                {sessionOptions.map((option) => (
                                    <SelectItem key={option._id} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : null}

                {/* Level Dropdown Logic */}
                {levelOptions.length === 1 &&
                levelOptions[0].label === "default" ? null : levelOptions.length === 1 ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <label className="text-sm font-medium">
                            {/* {levelOptions[0]?.label} */}
                        </label>
                    </div>
                ) : levelOptions.length > 1 ? (
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <label className="text-sm font-medium">Level</label>
                        <Select
                            value={selectedLevel}
                            onValueChange={onLevelChange}
                            disabled={!selectedSession}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {levelOptions.map((option) => (
                                    <SelectItem key={option._id} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : null}
            </div>
            </div>
        </div>
    );
};
