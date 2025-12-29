'use client';

import { Check, Copy } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import { Button } from '@/components/ui/button';

import 'highlight.js/styles/github-dark.css';

interface ChatMarkdownProps {
  content: string;
  className?: string;
}

export default function ChatMarkdown({
  content,
  className,
}: ChatMarkdownProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((prev) => (prev === key ? null : prev)),
        1200
      );
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  }, []);

  const components: Components = useMemo(
    () => ({
      code: ({ inline, className: codeClassName, children, ...props }: any) => {
        if (inline) {
          return (
            <code
              className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono"
              {...props}
            >
              {children}
            </code>
          );
        }

        const raw = String(children ?? '');
        const codeText = raw.replace(/\n$/, '');
        const key = `${codeText.length}-${codeText.slice(0, 24)}`;

        return (
          <div className="relative my-2">
            <div className="absolute right-2 top-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 px-2"
                onClick={() => handleCopy(key, codeText)}
              >
                {copiedKey === key ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto">
              <code className={codeClassName} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      },
      p: ({ children, ...props }) => (
        <p className="mb-2 leading-relaxed" {...props}>
          {children}
        </p>
      ),
    }),
    [copiedKey, handleCopy]
  );

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
