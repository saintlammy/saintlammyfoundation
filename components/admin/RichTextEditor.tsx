import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Type,
  Upload
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "400px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Format commands
  const execCommand = (command: string, value: string | boolean = false) => {
    document.execCommand(command, false, value as string);
    editorRef.current?.focus();
  };

  // Insert HTML at cursor
  const insertHTML = (html: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const div = document.createElement('div');
      div.innerHTML = html;
      const frag = document.createDocumentFragment();

      let node;
      while ((node = div.firstChild)) {
        frag.appendChild(node);
      }

      range.insertNode(frag);

      // Move cursor to end of inserted content
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Handle content change
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Insert link
  const insertLink = () => {
    if (linkUrl && linkText) {
      insertHTML(`<a href="${linkUrl}" class="text-accent-400 hover:text-accent-300 underline">${linkText}</a>`);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      insertHTML(`<img src="${url}" alt="Image" class="max-w-full h-auto my-4 rounded-lg" />`);
    }
  };

  // Toolbar button component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    active?: boolean;
  }> = ({ onClick, icon, title, active }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors ${
        active
          ? 'bg-accent-500 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-600 rounded-lg bg-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-3 border-b border-gray-600 bg-gray-750 overflow-x-auto">
        {/* Formatting */}
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon={<Bold className="w-4 h-4" />}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon={<Italic className="w-4 h-4" />}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => execCommand('underline')}
          icon={<Underline className="w-4 h-4" />}
          title="Underline"
        />

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h1')}
          icon={<Heading1 className="w-4 h-4" />}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h2')}
          icon={<Heading2 className="w-4 h-4" />}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'h3')}
          icon={<Heading3 className="w-4 h-4" />}
          title="Heading 3"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'p')}
          icon={<Type className="w-4 h-4" />}
          title="Paragraph"
        />

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          icon={<List className="w-4 h-4" />}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          icon={<ListOrdered className="w-4 h-4" />}
          title="Numbered List"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'blockquote')}
          icon={<Quote className="w-4 h-4" />}
          title="Quote"
        />

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => execCommand('justifyLeft')}
          icon={<AlignLeft className="w-4 h-4" />}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          icon={<AlignCenter className="w-4 h-4" />}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyRight')}
          icon={<AlignRight className="w-4 h-4" />}
          title="Align Right"
        />

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Media */}
        <ToolbarButton
          onClick={() => setShowLinkDialog(true)}
          icon={<Link className="w-4 h-4" />}
          title="Insert Link"
        />
        <ToolbarButton
          onClick={insertImage}
          icon={<Image className="w-4 h-4" />}
          title="Insert Image"
        />
        <ToolbarButton
          onClick={() => execCommand('formatBlock', 'pre')}
          icon={<Code className="w-4 h-4" />}
          title="Code Block"
        />

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => execCommand('undo')}
          icon={<Undo className="w-4 h-4" />}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => execCommand('redo')}
          icon={<Redo className="w-4 h-4" />}
          title="Redo"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 text-white focus:outline-none prose prose-invert max-w-none"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        data-placeholder={placeholder}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="Link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={insertLink}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }

        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          color: white;
        }

        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
          color: white;
        }

        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: white;
        }

        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        [contenteditable] blockquote {
          border-left: 4px solid #10B981;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #D1D5DB;
        }

        [contenteditable] pre {
          background: #1F2937;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }

        [contenteditable] code {
          background: #1F2937;
          border: 1px solid #374151;
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        [contenteditable] a {
          color: #10B981;
          text-decoration: underline;
        }

        [contenteditable] a:hover {
          color: #059669;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;