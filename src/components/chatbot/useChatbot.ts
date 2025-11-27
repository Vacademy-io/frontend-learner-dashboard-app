import { useState, useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';
import { ChatMessage, ChatbotContext } from './types';
import { v4 as uuidv4 } from 'uuid';
import { getStudentDisplaySettings } from '@/services/student-display-settings';
import { StudentChatbotSettings } from '@/types/student-display-settings';
import { DEFAULT_STUDENT_DISPLAY_SETTINGS } from '@/constants/display-settings/student-defaults';
import { Preferences } from '@capacitor/preferences';

import { getMockChatResponse } from '@/services/chatbot-service';

export const useChatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatbotSettings, setChatbotSettings] = useState<StudentChatbotSettings>(
    DEFAULT_STUDENT_DISPLAY_SETTINGS.chatbot
  );
  const [instituteName, setInstituteName] = useState<string>('Vacademy');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Ref to scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch Institute Name
        const { value } = await Preferences.get({ key: 'InstituteDetails' });
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (parsed?.institute_name) {
              setInstituteName(parsed.institute_name);
            }
          } catch (e) {
            console.error('Error parsing institute details', e);
          }
        }

        const settings = await getStudentDisplaySettings();
        setChatbotSettings(settings.chatbot);
        
        setMessages((prev) => {
          if (prev.length === 0) {
            return [{
              id: uuidv4(),
              role: 'assistant',
              content: `Hi! I am ${settings.chatbot.name} your AI assistant, How can I help you today?`,
              timestamp: Date.now(),
            }];
          }
          return prev;
        });
      } catch (error) {
        console.error('Failed to fetch chatbot settings:', error);
        setMessages((prev) => {
          if (prev.length === 0) {
            return [{
              id: uuidv4(),
              role: 'assistant',
              content: `Hi! I am ${DEFAULT_STUDENT_DISPLAY_SETTINGS.chatbot.name} your AI assistant, How can I help you today?`,
              timestamp: Date.now(),
            }];
          }
          return prev;
        });
      }
    };
    fetchSettings();
  }, []);

  const shouldShowChatbot = () => {
    // Check global visibility setting first
    if (!chatbotSettings.visible) return false;

    const path = location.pathname;
    
    // Exact match for dashboard
    if (path === '/dashboard') return true;
    
    // Match for courses list
    if (path === '/study-library/courses') return true;
    
    // Match for course details and its sub-routes
    if (path.startsWith('/study-library/courses/course-details')) return true;
    
    // Match for live class
    if (path === '/study-library/live-class') return true;

    return false;
  };

  const getContext = (): ChatbotContext => {
    const searchParams = new URLSearchParams(window.location.search);
    
    return {
      route: location.pathname,
      courseId: searchParams.get('courseId') || undefined,
      packageSessionId: searchParams.get('packageSessionId') || undefined,
      subjectId: searchParams.get('subjectId') || undefined,
      moduleId: searchParams.get('moduleId') || undefined,
      chapterId: searchParams.get('chapterId') || undefined,
      slideId: searchParams.get('slideId') || undefined,
      sessionId: searchParams.get('sessionId') || undefined,
    };
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const context = getContext();
      
      // Use the mock service to generate a conversational response
      // In the future, this will be replaced by a real backend API call
      // passing `message` and `context`.
      const responseMessage = await getMockChatResponse(content, context);

      setMessages((prev) => [...prev, responseMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    shouldShowChatbot,
    messagesEndRef,
    chatbotSettings,
    instituteName,
    isExpanded,
    setIsExpanded,
  };
};
