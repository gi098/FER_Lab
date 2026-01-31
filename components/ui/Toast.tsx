"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = (message: string, type: ToastType = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
                pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border 
                animate-in slide-in-from-right-full fade-in duration-300
                ${t.type === 'success'
                                ? 'bg-white border-primary/20 text-foreground'
                                : 'bg-red-50 border-red-200 text-red-900'}
            `}
                    >
                        {t.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium text-sm">{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
