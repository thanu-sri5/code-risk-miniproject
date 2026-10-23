import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Check, Download, Code2, Maximize2, Minimize2 } from "lucide-react";
import { SupportedLanguage } from "../types";

interface CodeEditorProps {
  value: string;
  onChange?: (val: string) => void;
  language: SupportedLanguage;
  readOnly?: boolean;
  height?: string;
  title?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false,
  height = "380px",
  title,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === "java" ? "java" : language === "python" ? "py" : "js";
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Map supported language to Monaco language
  const monacoLang = language === "java" ? "java" : language === "python" ? "python" : "javascript";

  return (
    <div
      className={`rounded-xl border border-gray-800 bg-[#0E131F] flex flex-col overflow-hidden transition-all ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "relative"
      }`}
    >
      {/* Editor Header Bar */}
      <div className="h-10 px-4 bg-[#141A29] border-b border-gray-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 text-xs">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-gray-200">
            {title || `Source Code (${language.toUpperCase()})`}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 uppercase font-mono">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800/80 rounded transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800/80 rounded transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-800/80 rounded transition-colors"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="relative flex-1" style={{ height: isExpanded ? "calc(100% - 40px)" : height }}>
        <Editor
          height="100%"
          language={monacoLang}
          value={value}
          onChange={(val) => onChange && onChange(val || "")}
          theme="vs-dark"
          onMount={() => setMonacoLoaded(true)}
          options={{
            readOnly,
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            renderLineHighlight: "all",
            tabSize: 2,
            fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, monospace",
            fontLigatures: true,
            padding: { top: 12, bottom: 12 },
          }}
          loading={
            <div className="h-full flex items-center justify-center bg-[#0E131F] text-gray-500 text-xs">
              Loading code editor...
            </div>
          }
        />
      </div>
    </div>
  );
};
