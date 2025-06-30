import "../../assets/scss/chatcustom.scss";
import React, { useEffect, useState } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };

      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args) => target(prop, ...args);
        },
      });
    }

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "8OwIZgJu-J6LSN-nec_95";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);

    window.addEventListener("chatbase:ready", handleChatbaseReady);
    window.addEventListener("chatbase:message", handleChatbaseMessage);

    return () => {
      window.removeEventListener("chatbase:ready", handleChatbaseReady);
      window.removeEventListener("chatbase:message", handleChatbaseMessage);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleChatbaseReady = () => {
    window.chatbase("configure", {
      chatbotId: "8OwIZgJu-J6LSN-nec_95",
      customStyles: true,
    });
  };

  const handleChatbaseMessage = (event) => {
    const message = event.detail;
    if (message.type === "product") {
      renderProductCard(message.data);
    }
  };

  const renderProductCard = (product) => {
    return (
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">{product.price}</p>
          <a href={product.url} className="view-button">
            Xem chi tiết
          </a>
        </div>
      </div>
    );
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      window.chatbase("open");
    } else {
      window.chatbase("close");
    }
  };

  return (
    <div className="chatbot-widget">
      <button className={`chat-toggle-button ${isOpen ? "active" : ""}`} onClick={toggleChat}>
        {isOpen ? <IoMdClose /> : <MdOutlineChatBubbleOutline />}
      </button>

      <div id="chatbase-container" className={`chat-window ${isOpen ? "open" : ""}`}></div>
    </div>
  );
};

export default ChatbotWidget;
