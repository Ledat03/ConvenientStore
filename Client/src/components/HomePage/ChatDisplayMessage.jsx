import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { parseMarkdownProducts } from "../../utils/normalizeMarkdownReply";
import "../../assets/scss/chatdisplaymessage.scss";

function safeImageUrl(value) {
  if (!value) return null;
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

function safeLinkUrl(value) {
  if (!value) return null;
  if (value.startsWith("/") || value.startsWith("#")) return value;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

function MarkdownContent({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      components={{
        a: ({ href, children, ...props }) => {
          const safeHref = safeLinkUrl(href);
          if (!safeHref) return <span>{children}</span>;
          const external = /^https?:\/\//i.test(safeHref);
          return (
            <a
              href={safeHref}
              className="cs-chat-link"
              rel={external ? "noopener noreferrer" : undefined}
              target={external ? "_blank" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
        img: ({ src, alt, ...props }) => {
          const safeSrc = safeImageUrl(src);
          return safeSrc ? (
            <img
              src={safeSrc}
              alt={alt || "Hình ảnh sản phẩm"}
              loading="lazy"
              decoding="async"
              {...props}
            />
          ) : null;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

function formatPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price)) return null;
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function StructuredProductCard({ product }) {
  const imageUrl = safeImageUrl(product.image);
  const price = formatPrice(product.price);
  const salePrice = formatPrice(product.salePrice);
  const hasDiscount = Number(product.salePrice) > 0 && Number(product.salePrice) < Number(product.price);
  const productUrl = product.productId
    ? `/products/product/${product.productId}?variant=${encodeURIComponent(product.calUnit || "")}`
    : null;

  return (
    <article className="cs-product-card cs-product-card--structured">
      <div className="cs-product-media">
        {imageUrl ? (
          <img className="cs-product-image" src={imageUrl} alt={product.productName || "Sản phẩm"} loading="lazy" decoding="async" />
        ) : (
          <div className="cs-product-image-placeholder">Chưa có ảnh sản phẩm</div>
        )}
      </div>
      <div className="cs-product-content">
        <h3 className="cs-product-name">{product.productName || "Sản phẩm"}</h3>
        <div className="cs-product-meta">
          {product.brand && <span>{product.brand}</span>}
          {product.calUnit && <span>{product.calUnit}</span>}
        </div>
        <div className="cs-product-pricing">
          <strong>{hasDiscount ? salePrice : price}</strong>
          {hasDiscount && <del>{price}</del>}
        </div>
        {Number.isFinite(Number(product.stock)) && (
          <span className={`cs-product-stock ${Number(product.stock) > 0 ? "is-available" : "is-empty"}`}>
            {Number(product.stock) > 0 ? `Còn ${product.stock} sản phẩm` : "Tạm hết hàng"}
          </span>
        )}
        {productUrl && <a className="cs-product-link" href={productUrl}>Xem sản phẩm</a>}
      </div>
    </article>
  );
}

function ProductCard({ product }) {
  const imageUrl = safeImageUrl(product.imageUrl);

  return (
    <article className="cs-product-card">
      <div className="cs-product-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.imageAlt}
            loading="lazy"
            className="cs-product-image"
          />
        ) : (
          <div className="cs-product-image-placeholder">
            Chưa có ảnh sản phẩm
          </div>
        )}
      </div>

      <div className="cs-product-content">
        <h3 className="cs-product-name">
          <span className="cs-product-number">{product.number}</span>

          {product.name}
        </h3>

        <div className="cs-product-details">
          <MarkdownContent>{product.markdown}</MarkdownContent>
        </div>
      </div>
    </article>
  );
}

export default function ChatDisplayMessage({ message, products = [] }) {
  const parsed = useMemo(() => parseMarkdownProducts(message), [message]);
  const hasStructuredProducts = Array.isArray(products) && products.length > 0;

  return (
    <div className="cs-chat-reply">
      {parsed.intro && (
        <div className="cs-chat-intro">
          <MarkdownContent>{parsed.intro}</MarkdownContent>
        </div>
      )}

      {hasStructuredProducts ? (
        <div className="cs-product-list">
          {products.map((product, index) => (
            <StructuredProductCard key={product.variantId || `${product.productId}-${index}`} product={product} />
          ))}
        </div>
      ) : parsed.products.length > 0 && (
        <div className="cs-product-list">
          {parsed.products.map((product, index) => (
            <ProductCard key={`${product.number}-${index}`} product={product} />
          ))}
        </div>
      )}

      {parsed.outro && (
        <div className="cs-chat-outro">
          <MarkdownContent>{parsed.outro}</MarkdownContent>
        </div>
      )}
    </div>
  );
}
