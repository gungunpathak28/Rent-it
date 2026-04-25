import { createContext, useContext, useState, ReactNode } from "react";
import { Item } from "../pages/Home";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
  quickReplies?: string[];
}

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, sender: "bot" | "user", quickReplies?: string[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  currentItem: Item | null;
  setCurrentItem: (item: Item | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your RentIt assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
      quickReplies: ["Rent rules", "Browse Gear", "Contact Support"]
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  const addMessage = (text: string, sender: "bot" | "user", quickReplies?: string[]) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender,
      timestamp: new Date(),
      quickReplies
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        isOpen,
        setIsOpen,
        isTyping,
        setIsTyping,
        currentItem,
        setCurrentItem
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
