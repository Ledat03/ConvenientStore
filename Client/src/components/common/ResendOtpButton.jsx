import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const COOLDOWN_SECONDS = 60;

export default function ResendOtpButton({ onResend, sendState }) {
  const [expiresAt, setExpiresAt] = useState(
    sendState ? Date.now() + COOLDOWN_SECONDS : 0,
  );
  const [remaining, setRemaining] = useState(sendState ? 60 : 0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

      setRemaining(seconds);
    }, 250);

    return () => clearInterval(interval);
  }, [expiresAt, sendState]);

  const handleResend = async () => {
    if (isSending || remaining > 0) return;

    setIsSending(true);

    try {
      await onResend();

      const nextExpiresAt = Date.now() + COOLDOWN_SECONDS * 1000;

      setExpiresAt(nextExpiresAt);
      setRemaining(COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Gửi lại OTP thất bại:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleResend}
      disabled={isSending || remaining > 0}
    >
      {isSending
        ? "Đang gửi..."
        : remaining > 0
          ? `Gửi lại mã sau ${remaining}s`
          : "Gửi lại OTP"}
    </Button>
  );
}
