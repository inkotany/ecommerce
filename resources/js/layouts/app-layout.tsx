import { Page } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface AppLayoutProps {
    children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <>{children}</>;
}