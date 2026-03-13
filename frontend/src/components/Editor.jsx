import React, { useState } from 'react';

export default function Editor({ content: initialContent = '', onSave }) {
  const [content, setContent] = useState(initialContent);
  const handleSave = () => { if (onSave) onSave(content); };

  return (
    <div className="editor fade-in">
      <textarea className="textarea" value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleSave} className="btn-primary mt-2">Save</button>
    </div>
  );
}