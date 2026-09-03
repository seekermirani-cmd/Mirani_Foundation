import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  RemoveFormatting,
  Underline,
} from "lucide-react";
import { getPlainTextFromRichText, sanitizeRichTextHtml } from "@/lib/rich-text";

type RichTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({ label, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-ink focus-visible:outline-none"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ id, value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value;
      setEmpty(!getPlainTextFromRichText(value).trim());
    }
  }, [value]);

  function syncEditor() {
    const editor = editorRef.current;
    if (!editor) return;

    const sanitized = sanitizeRichTextHtml(editor.innerHTML);
    if (sanitized !== editor.innerHTML) {
      editor.innerHTML = sanitized;
    }
    setEmpty(!getPlainTextFromRichText(sanitized).trim());
    onChange(sanitized);
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncEditor();
  }

  function applyLink() {
    const rawUrl = window.prompt("Enter a link URL");
    if (!rawUrl?.trim()) return;

    const url = /^[a-z][a-z0-9+.-]*:/i.test(rawUrl.trim())
      ? rawUrl.trim()
      : `https://${rawUrl.trim()}`;
    runCommand("createLink", url);
    editorRef.current?.querySelectorAll("a").forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
    syncEditor();
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const insertion = html ? sanitizeRichTextHtml(html) : text.replace(/\r?\n/g, "<br>");
    document.execCommand("insertHTML", false, insertion);
    syncEditor();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring/30">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
        <ToolbarButton label="Paragraph" onClick={() => runCommand("formatBlock", "p")}>
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" onClick={() => runCommand("formatBlock", "h2")}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" onClick={() => runCommand("formatBlock", "h3")}>
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton label="Bold" onClick={() => runCommand("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => runCommand("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" onClick={() => runCommand("underline")}>
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Remove formatting" onClick={() => runCommand("removeFormat")}>
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton label="Bulleted list" onClick={() => runCommand("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => runCommand("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Add link" onClick={applyLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton label="Align left" onClick={() => runCommand("justifyLeft")}>
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Align center" onClick={() => runCommand("justifyCenter")}>
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Align right" onClick={() => runCommand("justifyRight")}>
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Justify" onClick={() => runCommand("justifyFull")}>
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div
        id={id}
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Blog content"
        data-empty={empty ? "true" : "false"}
        data-placeholder={placeholder}
        className="rich-text-editor rich-text-content min-h-[280px] px-3 py-2 text-sm text-ink outline-none"
        onInput={syncEditor}
        onBlur={syncEditor}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />
    </div>
  );
}
