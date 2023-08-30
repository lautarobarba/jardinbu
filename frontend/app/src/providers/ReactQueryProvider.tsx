'use client'
import { ReactNode } from 'react';
import { NextUIProvider as NextUIProviderOriginal } from '@nextui-org/react'
import { QueryClient, QueryClientProvider as QueryClientProviderOriginal } from '@tanstack/react-query';

type ReactQueryProviderProps = {
    children?: ReactNode;
};

export const ReactQueryProvider = (props: ReactQueryProviderProps) => {
    const { children } = props;
    // React query client
    const queryClient = new QueryClient();

    return (
        <QueryClientProviderOriginal client={queryClient}>
            {children}
        </QueryClientProviderOriginal >
    )
}
