import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { VscError } from "react-icons/vsc";
import { FormInputProps } from "./utils/types/input-types";
import { InputErrorProps } from "./utils/types/input-types";
import { Label } from "../ui/label";

const inputSizeVariants = {
    large: "w-full w-60 md:w-96 lg:w-120 h-10 py-2 px-3 text-body md:text-subtitle lg:text-title",
    medium: "w-full w-72 md:w-80 lg:w-96 h-9 py-2 px-3 text-caption md:text-body lg:text-subtitle",
    small: "w-full w-40 md:w-48 lg:w-60 h-6 p-2 text-small md:text-caption lg:text-body",
} as const;

const InputError = ({ errorMessage }: InputErrorProps) => {
    return (
        <div className="flex items-center gap-1 pl-1 text-body font-regular text-danger-600">
            <span>
                <VscError />
            </span>
            <span className="mt-[3px]">{errorMessage}</span>
        </div>
    );
};

export const MyInput = ({
    inputType,
    inputPlaceholder,
    input,
    onChangeFunction,
    error,
    required,
    className,
    size = "medium",
    disabled,
    label,
    ...props
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col gap-2 md:gap-3 lg:gap-4">
            <div className="flex flex-col gap-1 md:gap-[2vh] lg:gap-[1.5vh]">
                {label && (
                    <Label className="text-subtitle md:text-body lg:text-small font-regular md:text-[1.8vh] lg:text-[2vh]">
                        {label}
                        {required && <span className="text-subtitle text-danger-600 md:text-[2vh] lg:text-[2vh]">*</span>}
                    </Label>
                )}
                <div className="relative">
                    <Input
                        disabled={disabled}
                        type={
                            inputType === "password"
                                ? showPassword
                                    ? "text"
                                    : "password"
                                : inputType
                        }
                        placeholder={inputPlaceholder}
                        className={cn(
                            inputSizeVariants[size],
                            error ? "border-danger-600" : "border-neutral-300",
                            inputType === "password" ? "pr-10" : "",
                            "text-subtitle text-neutral-600 shadow-none placeholder:text-body placeholder:font-regular md:placeholder:text-subtitle lg:placeholder:text-body hover:border-primary-200 focus:border-primary-500 focus-visible:ring-0",
                            className,
                        )}
                        value={input}
                        onChange={onChangeFunction}
                        required={required}
                        {...props}
                    />
                    {inputType === "password" && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <IoEyeOffOutline className="size-4 text-neutral-600" />
                            ) : (
                                <IoEyeOutline className="size-4 text-neutral-600" />
                            )}
                        </button>
                    )}
                </div>
            </div>
            {error && <InputError errorMessage={error} />}
        </div>
    );
};
