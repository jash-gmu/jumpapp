import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import './MarkdownEditor.css';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>('# Hello World\n\nStart typing your markdown here...');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (previewRef.current) {
      const element = previewRef.current;
      const opt = {
        margin: 1,
        filename: 'markdown-export.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  const handleCopy = () => {
    if (previewRef.current) {
      const range = document.createRange();
      range.selectNode(previewRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    }
  };

  return (
    <div className="markdown-editor">
      <div className="editor-pane">
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write your markdown here..."
        />
      </div>
      <div className="preview-pane">
        <div className="preview-actions">
          <button onClick={handleExport}>Export PDF</button>
          <button onClick={handleCopy}>Copy</button>
        </div>
        {showCopyNotification && (
          <div className="copy-notification">Copied to clipboard!</div>
        )}
        <div className="preview-content" ref={previewRef}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor; 