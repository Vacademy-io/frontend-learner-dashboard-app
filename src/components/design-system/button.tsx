import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MyButtonProps } from "./utils/types/button-types";

// Button Variants Configuration
const myButtonVariants = {
    base: "font-normal focus:outline-none focus:ring-primary-200 disabled:cursor-not-allowed transition-colors text-subtitle font-semibold shadow-none",
    types: {
        primary: "bg-primary-500 !text-neutral-50 font-semibold hover:bg-primary-400 active:bg-[#be5d1d] disabled:bg-[#fad5bd]",
        secondary: "bg-white font-regular border-neutral-300 border !text-neutral-600 hover:border-primary-300 hover:bg-[#fef7ee] active:border-primary-500 active:bg-[#fdedd7] disabled:text-[#7f7f7f] disabled:bg-white disabled:border-neutral-200",
        text: "shadow-none bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:text-neutral-300 disabled:bg-transparent",
    },
    textStyles: {
        large: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-regular",
        medium: "text-base sm:text-lg md:text-xl lg:text-2xl font-regular",
        small: "text-sm sm:text-base md:text-lg lg:text-xl font-regular",
    },
    scales: {
        default: {
            large: "min-w-60 h-10 px-4 text-subtitle sm:min-w-48 sm:h-9 sm:px-3 md:min-w-56 md:h-9 md:px-3 lg:min-w-60 lg:h-10 lg:px-4",
            medium: "min-w-[140px] h-9 px-3 text-body sm:min-w-[120px] sm:h-8 sm:px-2 md:min-w-[130px] md:h-8 md:px-2 lg:min-w-[140px] lg:h-9 lg:px-3",
            small: "min-w-[83px] h-6 px-2 text-caption sm:min-w-[70px] sm:h-5 sm:px-1 md:min-w-[75px] md:h-5 md:px-1 lg:min-w-[83px] lg:h-6 lg:px-2",
        },
        icon: {
            large: "w-10 h-10 !p-0 sm:w-9 sm:h-9 md:w-9 md:h-9 lg:w-10 lg:h-10",
            medium: "w-9 h-9 !p-0 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-9 lg:h-9",
            small: "w-6 h-6 !p-0 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6",
        },
        floating: {
            large: "w-24 h-24 rounded-full sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24",
            medium: "w-14 h-14 rounded-full sm:w-12 sm:h-12 md:w-13 md:h-13 lg:w-14 lg:h-14",
            small: "w-10 h-10 rounded-full sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10",
        },
        extendedFloating: {
            large: "w-24 h-24 rounded-full sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24",
            medium: "w-24 h-14 rounded-full px-4 sm:w-20 sm:h-12 sm:px-3 md:w-22 md:h-13 md:px-3 lg:w-24 lg:h-14 lg:px-4",
            small: "w-[71px] h-10 rounded-full px-3 sm:w-[60px] sm:h-8 sm:px-2 md:w-[65px] md:h-9 md:px-2 lg:w-[71px] lg:h-10 lg:px-3",
        },
    },
} as const;

// Button Component
export const MyButton = ({
    className,
    buttonType = "primary",
    scale = "medium",
    layoutVariant = "default",
    children,
    ...props
}: MyButtonProps) => {
    const getButtonClasses = () => {
        // Create an array of classes
        const classes: string[] = [
            myButtonVariants.base,
            myButtonVariants.types[buttonType],
            myButtonVariants.scales[layoutVariant][scale],
        ];

        // Add text-specific styles only for text type buttons
        if (buttonType === "text") {
            classes.push(myButtonVariants.textStyles[scale]);
        }

        return classes.join(" ");
    };

    return (
        <Button className={cn(getButtonClasses(), className)} {...props}>
            {children}
        </Button>
    );
};

// Usage Examples:
/*
// Primary button
<MyButton 
    buttonType="primary" 
    scale="large" 
    layoutVariant="default"
    onClick={() => console.log('clicked')}
>
    Click Me
</MyButton>

// Text variant
<MyButton 
    buttonType="text" 
    scale="medium"
>
    Text Button
</MyButton>

// Icon button
<MyButton 
    layoutVariant="icon" 
    scale="small"
>
    <IconComponent />
</MyButton>
*/
