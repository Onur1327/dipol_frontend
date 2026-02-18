'use client';

import React, { useState, useEffect } from 'react';
import FloatingButtons from './FloatingButtons';
import CookieBanner from './CookieBanner';

export default function ClientOnly({ children }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <>
            {children}
            <FloatingButtons />
            <CookieBanner />
        </>
    );
}
