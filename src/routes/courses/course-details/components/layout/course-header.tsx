import { Steps } from "@phosphor-icons/react";
import { VideoPlayer } from "../media/course-details-video-player";
import { CourseDetailsFormValues } from "../../types/course-details-schema";

type CourseData = CourseDetailsFormValues['courseData'];

interface CourseHeaderProps {
    courseData: CourseData;
}

export const CourseHeader = ({ courseData }: CourseHeaderProps) => {
    return (
        <div className="relative min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] overflow-hidden rounded-t-2xl">
            {/* Background Image or Color */}
            {courseData.courseBannerMediaId ? (
                <div className="pointer-events-none absolute inset-0 z-10 bg-black/50" />
            ) : (
                <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" />
            )}
            {!courseData.courseBannerMediaId ? (
                <div className="absolute inset-0 z-0 bg-transparent" />
            ) : (
                <div className="absolute inset-0 z-0 opacity-70">
                    <img
                        src={courseData.courseBannerMediaId}
                        alt="Course Banner"
                        className="size-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement?.classList.add(
                                "bg-primary-500"
                            );
                        }}
                    />
                </div>
            )}
            
            {/* Primary color overlay with 70% opacity */}
            <div
                className={`relative z-20 px-8 py-6 sm:py-8 md:py-12 ${
                    !courseData.courseBannerMediaId
                        ? "text-black"
                        : "text-white"
                }`}
            >
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8">
                    {/* Left side - Title and Description */}
                    <div className="w-full lg:max-w-2xl">
                        {!courseData.title ? (
                            <div className="space-y-4">
                                <div className="h-6 sm:h-8 w-24 sm:w-32 animate-pulse rounded bg-white/20" />
                                <div className="h-8 sm:h-12 w-full sm:w-3/4 animate-pulse rounded bg-white/20" />
                                <div className="h-3 sm:h-4 w-full animate-pulse rounded bg-white/20" />
                                <div className="h-3 sm:h-4 w-2/3 animate-pulse rounded bg-white/20" />
                            </div>
                        ) : (
                            <>
                                <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
                                    {courseData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                                                !courseData.courseBannerMediaId
                                                    ? "text-black bg-white"
                                                    : "text-white bg-blue-500"
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                                    {courseData.title}
                                </h1>
                                <p
                                    className="text-base sm:text-lg opacity-90 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: courseData.description || "",
                                    }}
                                />
                            </>
                        )}
                    </div>

                    {/* Right side - Video Player */}
                    {courseData.courseMediaId && (
                        <div className="hidden lg:block w-full lg:w-auto mt-4 lg:mt-0">
                            <VideoPlayer
                                src={courseData.courseMediaId}
                                className="!w-full sm:!w-[320px] md:!w-[370px] lg:!w-[370px]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
