import React, { useState, useRef, useEffect } from "react";
import "../../assets/scss/chatcustom.scss";
const ChatbotWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6856950bd0167c190f1e6300/1iu93cdjt";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  return <></>;
};

export default ChatbotWidget;
