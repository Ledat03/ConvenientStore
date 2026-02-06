import "../../assets/scss/chatcustom.scss";
import { useEffect, useState } from "react";
import { fetchListProduct, fetchListPromotion } from "../../services/GetAPI";
import { AiOutlineClose } from "react-icons/ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatbotWidget = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Products, setProducts] = useState([]);
  const [Promotions, setPromotions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [User, setUser] = useState({});
  const genAI = new GoogleGenerativeAI("AIzaSyADoMNR5Rp5GpTCegzhVo995jpZb5riHw0");
  const MIN_REQUEST_INTERVAL = 2000;
  const getInfomation = async () => {
    const productData = await fetchListProduct();
    const promotionData = await fetchListPromotion();
    setProducts(productData.data.data);
    setPromotions(promotionData.data.data);
  };

  useEffect(() => {
    getInfomation();
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    if (localStorage.getItem("chatMessages")) {
      setMessages(JSON.parse(localStorage.getItem("chatMessages")));
    }
  }, []);
  const markdownToHtml = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 200px; margin: 10px 0; border-radius: 8px;">')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #007bff; text-decoration: none;">$1</a>')
      .replace(/\n/g, "<br/>");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: " Vui lòng đợi một chút trước khi gửi câu hỏi tiếp theo.",
        },
      ]);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setLastRequestTime(now);
    setMessages((prev) => {
      const newMessages = [...prev, { role: "user", content: userMessage }];
      localStorage.setItem("chatMessages", JSON.stringify(newMessages));
      return newMessages;
    });
    const productsData = Products.map((product) => {
      const variant = product.productVariant?.[0];
      return `
      - Tên: ${product.productName}
      - ID: ${product.productId}
      - Thương hiệu: ${product.brand}
      - Danh mục: ${product.category} - ${product.subCategory}
      - Giá gốc: ${variant?.price}đ
      - Giá khuyến mãi: ${variant?.salePrice}đ
      - Hình ảnh: ${product.image}
      - Variant ID: ${variant?.id}
      - Tồn kho: ${variant?.stock} ${variant?.calUnit}
      - Mô tả: ${product.productDescription}
      - SKU: ${product.sku}
      `;
    }).join("\n---\n");
    const promotionsData = Promotions.map((promo) => `- Mã: ${promo.code || promo.title} - ${promo.description || ""}`).join("\n");
    console.log(productsData);
    console.log(promotionsData);
    const prompt = `Bạn là trợ lý AI của WinMart - website thương mại điện tử bán lẻ hàng đầu Việt Nam.

DANH SÁCH TẤT CẢ SẢN PHẨM HIỆN CÓ:
${productsData}

MÃ KHUYẾN MÃI ĐANG CÓ:
${promotionsData}

HƯỚNG DẪN TRẢ LỜI CHI TIẾT:

1. Khi khách hỏi về sản phẩm (ví dụ: "có sữa gì", "tìm sữa", "sữa vinamilk", "sản phẩm cho bé"):
   - Tìm TẤT CẢ sản phẩm phù hợp trong danh sách trên
   - LUÔN hiển thị TỐI THIỂU 2-3 sản phẩm nếu có nhiều lựa chọn
   - Mỗi sản phẩm PHẢI theo format CHÍNH XÁC sau:

    **[Tên sản phẩm đầy đủ]** - **[Giá khuyến mãi]đ** (nếu có giá khuyến mãi thấp hơn giá gốc thì thêm: giá gốc: ~~[Giá gốc]đ~~)
    Thương hiệu: [Brand] | Danh mục: [Category]
    Còn hàng: [Stock] [Unit]
   
   ![Tên sản phẩm](link_hình_ảnh_từ_data)
   
   [Mô tả ngắn gọn về sản phẩm - lấy từ productDescription]
   
   [Xem chi tiết sản phẩm](http://localhost:3000/products/product/[productId]?variant=[variantId])
   
   ---

2. QUAN TRỌNG - Luôn gợi ý nhiều sản phẩm:
   - Nếu có 1 sản phẩm khớp chính xác → hiển thị nó + gợi ý thêm 1-2 sản phẩm cùng loại/thương hiệu
   - Nếu có nhiều sản phẩm khớp → hiển thị 2-3 sản phẩm bán chạy/giá tốt nhất
   - Cuối cùng luôn thêm: "Còn nhiều sản phẩm khác, bạn muốn xem thêm loại nào không ạ?"
   - Nếu sản phẩm hết hàng -> không đề xuất trừ khi người dùng chỉ định sản phẩm đó.
   - Nếu người dùng hỏi về mã giảm giá → đề xuất danh sách các mã giảm giá  + gợi ý thêm 1-2 sản phẩm liên quan đến mã giảm giá
    - Khi người dùng muốn tư vấn sản phẩm liên quan đến loại sản phẩm cụ thể thì bạn chỉ nên giới thiệu các sản phẩm có sự tương đồng về danh mục, loại sản phẩm cũng như nhãn hàng. Ví dụ người dùng muốn tư vấn sản phẩm về sữa thì chỉ gợi ý các sản phẩm sữa nếu không có sản phẩm phù hợp → xin lỗi và đưa ra các gợi ý về các danh mục sản phẩm khác trong cửa hàng.
    - Nếu như người dùng đưa ra một khoản tiền và muốn đề xuất các sản phẩm có thể mua theo ý của họ nhưng sau đó người dùng lại chỉ có khoản tài chỉnh ít hơn khoản tiền họ đề xuất trước đó thì bạn hãy gợi ý lại các sản phẩm phù hợp với nhu cầu tài chính của khách hàng và phải có sự tương đồng với sản phẩm người dùng muốn tư vấn.
   
3. Về khuyến mãi và mã giảm giá:
   - Nếu sản phẩm đang có giá khuyến mãi (salePrice < price), nhấn mạnh điều này
   - Nếu có mã giảm giá phù hợp (ví dụ MILKSUMMER cho sữa), hướng dẫn:
     "Áp dụng mã **[MÃ]** để được ưu đãi thêm!"
     "[Xem tất cả sản phẩm khuyến mãi](http://localhost:3000/products?promotion=[MÃ])"

4. Thông tin dịch vụ WinMart:
   Giao hàng:
   - MIỄN PHÍ vận chuyển cho đơn hàng từ 500.000đ
   - Giao trong ngày: Bán kính 20-30km
   - Giao ngày hôm sau: Khoảng cách xa hơn
   
   Thanh toán đa dạng:
   - Tiền mặt khi nhận hàng (COD)
   - Ví điện tử: VNPay
    
   
   Hỗ trợ khách hàng:
   - Hotline: 1900-8888 (8h-22h hàng ngày)
   - Email: support@winmart.vn

5. Phong cách trả lời:
   - Thân thiện, lịch sự, gọi khách là "Quý khách" hoặc "Bạn"
   - Sử dụng emoji phù hợp để tạo sự thân thiện
   - Câu trả lời rõ ràng, dễ hiểu
   - Luôn sẵn sàng hỗ trợ thêm
   - Trả lời tiếng việt dễ hiểu, hiệu quả
6.Các bước mua hàng:
  - Người dùng thêm các sản phẩm muốn mua vào giỏ hàng
  - Để tới được phần thanh toán,người dùng phải vào giỏ hàng và chọn các sản phẩm họ muốn mua
  - Thanh toán bằng VNPay người dùng sẽ trực tiếp chuyển hướng sang phía VNPay để thực hiện thanh toán do trang web không có chức năng thanh toán bằng thẻ ngân hàng. 
7. Xử lý các trường hợp đặc biệt:
   - Nếu không tìm thấy sản phẩm: "Rất tiếc, hiện tại WinMart chưa có sản phẩm này. Bạn có thể tham khảo các sản phẩm tương tự sau..."
   - Nếu hỏi về đơn hàng: "Quý khách vui lòng kiểm tra tại mục 'Quản lí đơn hàng' hoặc liên hệ hotline 1900-8888 hoặc gửi tới Email support@winmart.vn để được hỗ trợ chi tiết về đơn hàng ạ."
   - Nếu hỏi giá cụ thể: Luôn hiển thị cả giá gốc và giá khuyến mãi (nếu có)
   - Nếu như hỏi các hình thức thanh toán khác : Rất xin lỗi nếu như người dùng muốn thanh toán bằng các phương thức thanh toán khác.
   - Không trả lời các câu hỏi không liên quan tới cửa hàng và từ chối một cách lịch sự
Câu hỏi của khách hàng: ${userMessage}
Các thông tin về cuộc trò chuyện với người dùng: ${messages}
Hãy trả lời chi tiết, chính xác với thông tin sản phẩm thực tế từ danh sách trên. LUÔN gợi ý nhiều lựa chọn cho khách hàng.`;

    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const botResponse = response.text();
        setMessages((prev) => {
          const newMessages = [...prev, { role: "bot", content: botResponse }];
          localStorage.setItem("chatMessages", JSON.stringify(newMessages));
          return newMessages;
        });
        break;
      } catch (error) {
        console.error("Error:", error);

        if (error.message?.includes("overloaded") && retries < MAX_RETRIES - 1) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, 2000 * retries));
          continue;
        }

        const fallbackResponses = {
          giá: " Quý khách có thể xem giá chi tiết của từng sản phẩm trên website. WinMart cam kết giá tốt nhất thị trường! Bạn đang tìm sản phẩm nào ạ?",

          "giao hàng": ` **Chính sách giao hàng WinMart:**
• Miễn phí vận chuyển cho đơn hàng từ 500.000đ
• Giao trong ngày: Bán kính 20-30km
• Giao ngày hôm sau: Khoảng cách xa hơn

 Hotline hỗ trợ: 1900-1234`,

          "thanh toán ": `**WinMart hỗ trợ nhiều hình thức thanh toán:**
• Tiền mặt khi nhận hàng (COD)
• Ví điện tử: VNPay`,

          "khuyến mãi  ": ` **Khuyến mãi hot tại WinMart:**
• Mã **MILKSUMMER**: Giảm giá cho sản phẩm sữa
• Miễn phí vận chuyển cho đơn từ 500.000đ
`,
        };

        const lowerMessage = userMessage.toLowerCase();
        let fallbackResponse = null;

        for (const [key, response] of Object.entries(fallbackResponses)) {
          if (lowerMessage.includes(key)) {
            fallbackResponse = response;
            break;
          }
        }

        if (fallbackResponse) {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: fallbackResponse + "\n\n (Phản hồi tự động - Hệ thống AI đang bận)",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: " Xin lỗi quý khách, hệ thống đang bận. Vui lòng thử lại sau ít phút hoặc liên hệ hotline 1900-8888 để được hỗ trợ ngay ạ!",
            },
          ]);
        }
        break;
      }
    }

    setIsLoading(false);
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
            <h3> WinMart - Trợ lý mua sắm</h3>
            <div className="header-actions">
              <button onClick={clearChat} className="clear-btn">
                Xóa
              </button>
              <button onClick={toggleChat} className="close-btn-chatbot">
                <AiOutlineClose size={20} />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <h6>Xin chào! Tôi là trợ lý mua sắm của WinMart.</h6>
                <br />
                Tôi có thể giúp bạn:
                <br />• Tìm kiếm sản phẩm
                <br />• Tư vấn giá cả và khuyến mãi
                <br />• Hướng dẫn thanh toán
                <br />• Tư vấn về chính sách và thông tin cửa hàng
                <br />
                <br />
                <span>Bạn cần hỗ trợ gì ạ?</span>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(message.content),
                  }}
                />
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
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hỏi về sản phẩm, giá cả, khuyến mãi..." disabled={isLoading} className="chat-input" />
              <button type="submit" disabled={isLoading || !input.trim()} className="send-btn">
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatbotWidget;
