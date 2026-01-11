import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatbotContext } from "./useChatbotContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ChatbotTrigger: React.FC = () => {
  const { isOpen, setIsOpen, shouldShowChatbot, chatbotSettings } =
    useChatbotContext();

  if (!shouldShowChatbot()) {
    return null;
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div
          className="p-0.5 rounded-full border border-primary-500 flex items-center justify-center"
          role="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* <MessageCircle className="h-4 w-4" /> */}
          <Avatar className="size-8 bg-background shrink-0">
            {chatbotSettings.avatarUrl ? (
              <AvatarImage
                src={chatbotSettings.avatarUrl}
                alt={chatbotSettings.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="text-primary font-bold">
              {chatbotSettings.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-primary-400 text-white" side="bottom">
        <p>{chatbotSettings.name}</p>
      </TooltipContent>
    </Tooltip>
  );
};
