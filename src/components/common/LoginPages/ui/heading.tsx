import { HeadingProps } from "../../../../types/loginTypes";

export const Heading = ({ heading, subHeading }: HeadingProps) => {
    return (
        <div className="flex w-full flex-col gap-[2vh] p-[2vh] text-neutral-600 md:gap-[1.5vh] md:p-[1.5vh] lg:gap-[1vh] lg:p-[1vh]">
            <div className="w-full text-center text-[3vh] font-bold md:text-[4vh] lg:text-[5vh]">{heading}</div>
            <div className="w-full text-center">
                {heading == "Set New Password" ? (
                    <div>
                        Secure your account <span className="text-primary-500">email</span> with a
                        new password
                    </div>
                ) : (
                    <div className="text-[2vh] font-regular md:text-[2.5vh] lg:text-[3vh]">{subHeading}</div>
                )}
            </div>
        </div>
    );
};
