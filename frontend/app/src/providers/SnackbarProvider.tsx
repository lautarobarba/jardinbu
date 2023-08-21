'use client'
import { ReactNode } from 'react';
import { SnackbarProvider as SnackbarProviderOriginal } from 'notistack';

type SnackbarProviderProps = {
    children?: ReactNode;
};

export const SnackbarProvider = (props: SnackbarProviderProps) => {
    const { children } = props;
    return (
        <SnackbarProviderOriginal>
            {children}
        </SnackbarProviderOriginal>
    )
}
