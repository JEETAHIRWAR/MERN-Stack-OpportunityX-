import sanitizeHtml from "sanitize-html";

const options = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "blockquote",
    "pre",
    "code",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "a",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform(
      "a",
      { rel: "noopener noreferrer" },
      true
    ),
  },
  nestingLimit: 10,
};

// Rich text is sanitized before persistence. The frontend is never considered
// a security boundary because API clients can bypass browser validation.
export const sanitizeRichText = (value) =>
  typeof value === "string" ? sanitizeHtml(value, options) : value;
