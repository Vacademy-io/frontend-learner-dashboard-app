import React from "react";
import { useChatbot } from "./useChatbot";
import { ChatbotContext } from "./ChatbotContextType";

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const chatbotState = useChatbot();

  return (
    <ChatbotContext.Provider value={chatbotState}>
      {children}
    </ChatbotContext.Provider>
  );
};
