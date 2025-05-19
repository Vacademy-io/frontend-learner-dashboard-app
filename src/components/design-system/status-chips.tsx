import { Check, ExclamationMark, X } from "@phosphor-icons/react";

export type StatusType = "SUCCESS" | "DANGER" | "WARNING" | "INFO"

const statusColors: Record<StatusType, string > = {
    SUCCESS: "bg-success-100 text-success-600 border-success-400",
    DANGER: "bg-danger-100 text-danger-600 border-danger-400",
    WARNING: "bg-warning-100 text-warning-600 border-warning-400",
    INFO: "bg-neutral-100 text-neutral-600 border-neutral-400",
}

const statusIcons: Record<StatusType, React.ReactNode> = {
    SUCCESS: <Check className="text-white bg-success-600 rounded-full size-4 p-1" />,
    DANGER: <ExclamationMark className="text-white bg-danger-600 rounded-full size-4 p-1" />,
    WARNING: <ExclamationMark className="text-white bg-warning-600 rounded-full size-4 p-1" />,
    INFO: <X className="text-white bg-neutral-500 rounded-full size-4 p-1" />,
}
export const StatusChip = ({text, textSize, status, showIcon=true}: {text: string, textSize: string, status: StatusType, showIcon?: boolean}) => {
    return(
        <div className={`border-[1px] w-fit ${statusColors[status]} rounded-md px-2 py-1 ${textSize} flex gap-1 items-center`}>
            {showIcon && statusIcons[status]}
            {text}
        </div>
    )
}