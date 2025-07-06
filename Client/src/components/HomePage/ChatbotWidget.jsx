import "../../assets/scss/chatcustom.scss";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
const ChatbotWidget = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const genAI = new GoogleGenerativeAI("AIzaSyADoMNR5Rp5GpTCegzhVo995jpZb5riHw0");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
      });
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const botResponse = response.text();

      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`chat-toggle-btn ${isOpen ? "open" : ""}`} onClick={toggleChat}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {messages.length > 0 && !isOpen && <div className="notification-dot"></div>}
      </div>

      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="chat-widget">
          <div className="chat-header">
            <h3>Chatbot hỗ trợ </h3>
            <div className="header-actions">
              <button onClick={clearChat} className="clear-btn">
                Xóa
              </button>
              <button onClick={toggleChat} className="close-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && <div className="welcome-message">Xin chào! Tôi có thể giúp gì cho bạn?</div>}

            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">{message.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message bot">
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <div className="input-container">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập câu hỏi của bạn..." disabled={isLoading} className="chat-input" />
              <button type="submit" disabled={isLoading || !input.trim()} className="send-btn">
                {isLoading ? "..." : "Gửi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatbotWidget;
