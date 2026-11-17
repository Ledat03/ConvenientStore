import "../../assets/scss/chatcustom.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineDelete, AiOutlineRobot } from "react-icons/ai";
import { FiSend, FiRefreshCw } from "react-icons/fi";
import ChatDisplayMessage from "./ChatDisplayMessage";
import { chatHandleRequest } from "../../services/AuthAPI";

const STORAGE_KEY = "chatMessages";
const MAX_STORED_MESSAGES = 50;
const QUICK_ACTIONS = [
  "Tìm sản phẩm",
  "Khuyến mãi hiện có",
  "Hướng dẫn giao hàng",
  "Phương thức thanh toán",
];

function createMessage(role, content, extra = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    ...extra,
  };
}

function restoreMessages() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(stored)) return [];

    return stored
      .filter(
        (item) =>
          item &&
          ["user", "bot"].includes(item.role) &&
          typeof item.content === "string",
      )
      .slice(-MAX_STORED_MESSAGES)
      .map((item) => ({ ...item, id: item.id || createMessage(item.role, item.content).id }));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function extractReply(response) {
  const data = response?.data?.responseData;

  if (typeof data === "string") return { content: data, products: [] };
  if (data && typeof data === "object") {
    const content = [data.message, data.reply, data.content].find(
      (value) => typeof value === "string" && value.trim(),
    );
    const products = Array.isArray(data.productRes)
      ? data.productRes
      : Array.isArray(data.products)
        ? data.products
        : [];
    if (content) return { content, products };
  }

  throw new Error("Invalid chatbot response");
}

const ChatbotWidget = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(restoreMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesRef = useRef(null);
  const toggleRef = useRef(null);
  const inputRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const shouldFollowRef = useRef(true);
  const requestInFlightRef = useRef(false);

  useEffect(() => {
    try {
      if (messages.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
      );
    } catch (error) {
      console.log(error)
    }
  }, [messages]);

  const scrollToLatest = useCallback((behavior = "smooth") => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    if (!isOpen || (!shouldFollowRef.current && !isNearBottomRef.current)) return;
    const frame = requestAnimationFrame(() => scrollToLatest());
    shouldFollowRef.current = false;
    return () => cancelAnimationFrame(frame);
  }, [messages, isLoading, isOpen, scrollToLatest]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const handleScroll = () => {
    const container = messagesRef.current;
    if (!container) return;
    const remaining = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = remaining < 90;
  };

  const toggleChat = () => {
    setIsOpen((open) => {
      if (open) requestAnimationFrame(() => toggleRef.current?.focus());
      else shouldFollowRef.current = true;
      return !open;
    });
    setShowClearConfirm(false);
  };

  const clearChat = () => {
    setMessages([]);
    setFailedMessage("");
    setShowClearConfirm(false);
    localStorage.removeItem(STORAGE_KEY);
    shouldFollowRef.current = true;
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const requestReply = useCallback(async (text, { appendUser = true } = {}) => {
    const normalized = text.trim();
    if (!normalized || requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    shouldFollowRef.current = true;
    setFailedMessage("");
    setIsLoading(true);
    if (appendUser) setMessages((previous) => [...previous, createMessage("user", normalized)]);
    setInput("");

    try {
      const response = await chatHandleRequest(normalized);
      const reply = extractReply(response);
      setMessages((previous) => [
        ...previous,
        createMessage("bot", reply.content, { products: reply.products }),
      ]);
    } catch {
      setFailedMessage(normalized);
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    requestReply(input);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      requestReply(input);
    }
  };

  const handleContentLoad = () => {
    if (isNearBottomRef.current) scrollToLatest("auto");
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Đóng trợ lý mua sắm" : "Mở trợ lý mua sắm Base AI"}
        aria-expanded={isOpen}
        aria-controls="base-ai-chat"
      >
        {isOpen ? <AiOutlineClose aria-hidden="true" /> : <AiOutlineRobot aria-hidden="true" />}
        {messages.length > 0 && !isOpen && <span className="notification-dot" aria-hidden="true" />}
      </button>

      <section
        id="base-ai-chat"
        className={`chat-window ${isOpen ? "open" : ""}`}
        aria-label="Base AI - Trợ lý mua sắm ConvenientStore"
        aria-hidden={!isOpen}
      >
        <div className="chat-widget">
          <header className="chat-header">
            <div className="chat-identity">
              <span className="chat-avatar" aria-hidden="true"><AiOutlineRobot /></span>
              <div>
                <h2>Base AI</h2>
                <p><span className="online-dot" />Trợ lý mua sắm ConvenientStore</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                type="button"
                onClick={() => messages.length && setShowClearConfirm(true)}
                className="chat-icon-btn"
                aria-label="Xóa cuộc trò chuyện"
                disabled={messages.length === 0 || isLoading}
              >
                <AiOutlineDelete aria-hidden="true" />
              </button>
              <button type="button" onClick={toggleChat} className="chat-icon-btn" aria-label="Đóng cửa sổ trò chuyện">
                <AiOutlineClose aria-hidden="true" />
              </button>
            </div>
          </header>

          {showClearConfirm && (
            <div className="clear-confirm" role="dialog" aria-label="Xác nhận xóa cuộc trò chuyện">
              <span>Xóa toàn bộ cuộc trò chuyện?</span>
              <div>
                <button type="button" onClick={() => setShowClearConfirm(false)}>Hủy</button>
                <button type="button" className="confirm" onClick={clearChat}>Xóa</button>
              </div>
            </div>
          )}

          <div
            ref={messagesRef}
            className="chat-messages"
            onScroll={handleScroll}
            onLoadCapture={handleContentLoad}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 && !isLoading && (
              <div className="welcome-message">
                <span className="welcome-icon" aria-hidden="true"><AiOutlineRobot /></span>
                <h3>Xin chào! Tôi là Base AI</h3>
                <p>
                  Trợ lý mua sắm của ConvenientStore. Tôi có thể giúp bạn tìm sản phẩm,
                  khám phá ưu đãi và giải đáp các thắc mắc.
                </p>
                <div className="quick-actions" aria-label="Câu hỏi gợi ý">
                  {QUICK_ACTIONS.map((action) => (
                    <button key={action} type="button" onClick={() => requestReply(action)} disabled={isLoading}>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <span className="message-sender">{message.role === "user" ? "Bạn" : "Base AI"}</span>
                <div className="message-content">
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    <ChatDisplayMessage message={message.content} products={message.products} />
                  )}
                </div>
              </article>
            ))}

            {isLoading && (
              <div className="message bot chatbot-status" role="status">
                <span className="message-sender">Base AI</span>
                <div className="message-content loading">
                  <div className="typing-indicator" aria-hidden="true"><span /><span /><span /></div>
                  <span>Đang tìm kiếm thông tin...</span>
                </div>
              </div>
            )}

            {failedMessage && !isLoading && (
              <div className="chat-error" role="alert">
                <div>
                  <strong>Chưa thể nhận phản hồi</strong>
                  <span>Vui lòng kiểm tra kết nối và thử lại.</span>
                </div>
                <button type="button" onClick={() => requestReply(failedMessage, { appendUser: false })}>
                  <FiRefreshCw aria-hidden="true" /> Thử lại
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <label className="sr-only" htmlFor="base-ai-input">Nhập câu hỏi cho Base AI</label>
            <div className="input-container">
              <textarea
                ref={inputRef}
                id="base-ai-input"
                rows="1"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Hỏi Base AI về sản phẩm, ưu đãi..."
                disabled={isLoading}
                className="chat-input"
                maxLength={1000}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="send-btn" aria-label="Gửi tin nhắn">
                <FiSend aria-hidden="true" />
              </button>
            </div>
            <span className="input-hint">Enter để gửi · Shift + Enter để xuống dòng</span>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChatbotWidget;
