"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Tạo một instance của QueryClient
const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};