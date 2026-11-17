
export function normalizeMarkdown(value) {
  if (typeof value !== "string") return "";

  let markdown = value.replace(/\r\n?/g, "\n");
  if (!markdown.includes("\n") && markdown.includes("\\n")) {
    markdown = markdown.replace(/\\r\\n|\\n|\\r/g, "\n");
  }

  return markdown
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseMarkdownProducts (rawResponse) {
  const markdown = normalizeMarkdown(rawResponse);
  const headingRegex =
    /^(?:(\d+)\.\s+\*\*(.+?)\*\*|\*\*(\d+)\.\s+(.+?)\*\*)[ \t]*$/gm;

  const matches = [...markdown.matchAll(headingRegex)];

  if (matches.length === 0) {
    return {
      intro: markdown,
      products: [],
      outro: "",
    };
  }

  const intro = markdown
    .slice(0, matches[0].index)
    .trim();

  const products = [];
  let outro = "";

  matches.forEach((match, index) => {
    const number = Number(match[1] ?? match[3]);
    const name = (match[2] ?? match[4]).trim();

    const start = match.index + match[0].length;

    const end =
      index + 1 < matches.length
        ? matches[index + 1].index
        : markdown.length;

    let content = markdown.slice(start, end).trim();

    if (index === matches.length - 1) {
      const detailRegex =
        /^-\s+\*\*Chi tiết:\*\*.*$/gm;

      const details = [...content.matchAll(detailRegex)];

      if (details.length > 0) {
        const lastDetail = details.at(-1);

        const detailEnd =
          lastDetail.index + lastDetail[0].length;

        outro = content.slice(detailEnd).trim();
        content = content.slice(0, detailEnd).trim();
      }
    }

    const imageRegex =
      /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)[ \t]*$/m;

    const imageMatch = content.match(imageRegex);

    const imageUrl = imageMatch?.[2] ?? null;
    const imageAlt = imageMatch?.[1] ?? name;

    // Tách ảnh để render trong card.
    if (imageMatch) {
      content = content
        .replace(imageMatch[0], "")
        .trim();
    }

    products.push({
      number,
      name,
      imageUrl,
      imageAlt,
      markdown: content,
    });
  });

  return {
    intro,
    products,
    outro,
  };
}
