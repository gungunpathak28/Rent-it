import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Slide,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close,
  Send,
  SmartToy,
  WhatsApp,
} from "@mui/icons-material";
import { useChat } from "../context/ChatContext";

export default function Chatbot() {
  const { 
    messages, 
    addMessage, 
    isOpen, 
    setIsOpen, 
    isTyping, 
    setIsTyping, 
    currentItem 
  } = useChat();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickReplies = [
    "Price info",
    "Stock status",
    "Rental rules",
    "Book item"
  ];

  const getBotResponse = (msg: string) => {
    const text = msg.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      return "Hi 👋 Welcome to RentIt! How can I help you?";
    }

    if (text.includes("price")) {
      return "💰 Prices depend on item and duration. You can check price per day on item page.";
    }

    if (text.includes("book")) {
      return "📅 To book, click on 'Book Now' and select your dates.";
    }

    if (text.includes("stock")) {
      return "📦 Stock status is shown on each item card.";
    }

    if (text.includes("rules")) {
      return "📜 Rental rules: Return item on time, avoid damage, and follow guidelines.";
    }

    if (text.includes("payment")) {
      return "💳 You can pay using UPI QR (Paytm / PhonePe).";
    }

    return "🤖 Sorry, I didn’t understand. Try asking about price, booking, or stock.";
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    // User Message
    addMessage(text, "user");
    if (text === inputText) setInputText("");

    // Bot Response Logic
    setIsTyping(true);
    setTimeout(() => {
      const reply = getBotResponse(text);
      addMessage(reply, "bot", quickReplies);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Tooltip title="Chat with Assistant" placement="left" arrow>
        <Fab
          className="floating-btn"
          color="primary"
          aria-label="chat"
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            position: "fixed",
            bottom: { xs: 80, md: 32 },
            right: 32,
            bgcolor: "#2D3A8D",
            zIndex: 9999, // High z-index as requested
            transition: "all 0.3s",
            "&:hover": { transform: "scale(1.1)" }
          }}
        >
          {isOpen ? <Close /> : <ChatIcon />}
        </Fab>
      </Tooltip>

      {/* Chat Window */}
      <AnimatePresence>
      {isOpen && (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
        style={{
            position: "fixed",
            bottom: "100px", /* Handle responsiveness via sx internally */
            right: "32px",
            zIndex: 9999,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: { xs: "calc(100vw - 32px)", sm: 380 },
            height: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: "#2D3A8D", color: "white", display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 1.5 }}>
              <SmartToy />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>RentIt Assistant</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Online | Usually replies instantly</Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>

          {/* Messages Container */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", bgcolor: "#f5f7fb", display: "flex", flexDirection: "column", gap: 1.5 }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: msg.sender === "bot" ? "20px 20px 20px 4px" : "20px 20px 4px 20px",
                    bgcolor: msg.sender === "bot" ? "white" : "#2D3A8D",
                    color: msg.sender === "bot" ? "text.primary" : "white",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
                
                {msg.sender === "bot" && msg.quickReplies && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {msg.quickReplies.map((reply) => (
                      <Button
                        key={reply}
                        size="small"
                        variant="outlined"
                        onClick={() => handleSend(reply)}
                        sx={{ 
                          borderRadius: "12px", 
                          fontSize: "10px", 
                          textTransform: "none",
                          borderColor: "rgba(45, 58, 141, 0.3)",
                          color: "#2D3A8D"
                        }}
                      >
                        {reply}
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
            
            {isTyping && (
              <Box sx={{ alignSelf: "flex-start", bgcolor: "white", p: 1, borderRadius: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>Bot is typing...</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid", borderColor: "grey.100" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask me something..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
              />
              <IconButton 
                color="primary" 
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                sx={{ bgcolor: "#2D3A8D", color: "white", "&:hover": { bgcolor: "#1A237E" }, "&.Mui-disabled": { bgcolor: "grey.100", color: "grey.400" } }}
              >
                <Send fontSize="small" />
              </IconButton>
            </Box>
            
            {currentItem && (
              <Button
                fullWidth
                size="small"
                startIcon={<WhatsApp />}
                href={`https://wa.me/${currentItem.ownerId?.phoneNumber?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in renting your ${currentItem.name}.`)}`}
                target="_blank"
                sx={{ mt: 1.5, color: "#25D366", fontSize: "11px", textTransform: "none" }}
              >
                Chat on WhatsApp with Owner
              </Button>
            )}
          </Box>
        </Paper>
      </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
