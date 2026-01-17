'use client';

import React from 'react';

import Navbar from '@/components/common/Navbar';

import TechNewsContent from './TechNewsContent';

export const dynamic = 'force-dynamic';

export default function TechNews() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <TechNewsContent />
      </main>
    </div>
  );
}
