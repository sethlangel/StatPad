'use client';

import React, { useEffect, useState } from 'react';
import { SafeArea } from 'capacitor-plugin-safe-area';

export default function ClientSafeArea({ children }: { children: React.ReactNode }) {
  const [insets, setInsets] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

  useEffect(() => {
    async function fetchInsets() {
      try {
        const result = await SafeArea.getSafeAreaInsets();
        setInsets(result.insets);
      } catch (e) {
        console.warn('SafeArea plugin not available', e);
      }
    }
    fetchInsets();
  }, []);


  return <div style={style}>{children}</div>;
}