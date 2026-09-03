const ALLOWED_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "div",
  "em",
  "h2",
  "h3",
  "h4",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
]);

const ALIGNABLE_TAGS = new Set(["blockquote", "div", "h2", "h3", "h4", "li", "p"]);
const ALLOWED_ALIGNMENTS = new Set(["left", "center", "right", "justify"]);
const HTML_TAG_RE = /<\/?[a-z][\s\S]*>/i;

function isSafeUrl(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (
    value.startsWith("#") ||
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../")
  ) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function sanitizeNode(node: Node, documentRef: Document): Node | DocumentFragment | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return documentRef.createTextNode(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const source = node as HTMLElement;
  const tagName = source.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    const fragment = documentRef.createDocumentFragment();
    source.childNodes.forEach((child) => {
      const sanitized = sanitizeNode(child, documentRef);
      if (sanitized) fragment.appendChild(sanitized);
    });
    return fragment;
  }

  const element = documentRef.createElement(tagName);
  if (tagName === "a") {
    const href = source.getAttribute("href") ?? "";
    if (isSafeUrl(href)) {
      element.setAttribute("href", href.trim());
      element.setAttribute("target", "_blank");
      element.setAttribute("rel", "noopener noreferrer");
    }
  }

  const textAlign = source.style.textAlign;
  if (ALIGNABLE_TAGS.has(tagName) && ALLOWED_ALIGNMENTS.has(textAlign)) {
    element.style.textAlign = textAlign;
  }

  source.childNodes.forEach((child) => {
    const sanitized = sanitizeNode(child, documentRef);
    if (sanitized) element.appendChild(sanitized);
  });

  return element;
}

export function sanitizeRichTextHtml(html: string): string {
  if (typeof document === "undefined" || typeof DOMParser === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(html, "text/html");
  const container = document.createElement("div");

  parsed.body.childNodes.forEach((node) => {
    const sanitized = sanitizeNode(node, document);
    if (sanitized) container.appendChild(sanitized);
  });

  return container.innerHTML.trim();
}

export function getPlainTextFromRichText(html: string): string {
  if (typeof document !== "undefined") {
    const container = document.createElement("div");
    container.innerHTML = sanitizeRichTextHtml(html);
    return container.textContent ?? "";
  }

  return html.replace(/<[^>]*>/g, " ");
}

export function isRichTextHtml(content: string): boolean {
  return HTML_TAG_RE.test(content);
}
