'use client';

import { getAuth } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatWidget: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const streamingContentRef = useRef<string>('');

  const handleRedirectToLogin = () => {
    const callbackUrl = pathname || '/';
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      console.error('No auth token available for chat request');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    const assistantMessage: Message = { role: 'assistant', content: '' };

    // Reset streaming content
    streamingContentRef.current = '';

    // Add both messages at once
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: userMessage.content }],
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                // Accumulate content in ref
                streamingContentRef.current += parsed.choices[0].delta.content;

                // Update the last message with accumulated content
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  if (
                    newMessages[lastIndex] &&
                    newMessages[lastIndex].role === 'assistant'
                  ) {
                    newMessages[lastIndex].content =
                      streamingContentRef.current;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parsing errors for individual SSE lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calling chat API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth gating
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        Loading chat...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="border rounded-lg p-4 bg-background shadow-sm flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Log in to use the byteScript chat assistant.
        </div>
        <Button size="sm" onClick={handleRedirectToLogin}>
          Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[80%]',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border'
                )}
              >
                {msg.role === 'assistant' ? (
                  <div className="text-sm">
                    <ChatMarkdown
                      content={msg.content}
                      className="prose-sm max-w-none [&_p]:mb-2 [&_pre]:my-2"
                    />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-background">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask byteScript anything about your code or learning..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
