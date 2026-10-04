import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  displayMode?: boolean;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '', displayMode = false }) => {
  // Parses text with \( ... \), \[ ... \], or raw text mixed with latex
  const renderContent = () => {
    if (!text) return null;

    // Pattern matches \( ... \) and \[ ... \] and standard math tokens
    const regex = /(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            throwOnError: false,
            displayMode: false
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block align-middle px-0.5" />;
        } catch {
          return <span key={index} className="font-mono text-slate-800">{math}</span>;
        }
      } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            throwOnError: false,
            displayMode: true
          });
          return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2 overflow-x-auto text-center" />;
        } catch {
          return <div key={index} className="font-mono text-slate-800">{math}</div>;
        }
      } else {
        // Plain text with newlines
        return (
          <span key={index}>
            {part.split('\\n').map((line, lIdx, arr) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
    });
  };

  return <span className={className}>{renderContent()}</span>;
};
