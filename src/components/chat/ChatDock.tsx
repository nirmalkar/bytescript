'use client';

import { MessageCircle, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import ChatWidget from './ChatWidget';

const ChatDock: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button in bottom-right */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            size="icon"
            className="rounded-full shadow-lg h-12 w-12"
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Right-side drawer */}
      <div
        className={
          'fixed right-0 top-16 bottom-0 z-40 w-full max-w-md transform transition-transform duration-200 ease-out ' +
          (open ? 'translate-x-0' : 'translate-x-full pointer-events-none')
        }
      >
        <div className="flex h-full flex-col bg-background border-l shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/70">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">byteScript chat</span>
              <span className="text-[11px] text-muted-foreground">
                Ask questions about what you&apos;re learning
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 p-3 overflow-hidden">
            <ChatWidget />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDock;
