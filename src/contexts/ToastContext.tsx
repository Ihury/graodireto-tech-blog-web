"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "@/components/ui";
import { ToastProps } from "@/components/ui/Toast";

interface ToastContextType {
	showToast: (
		message: string,
		type: ToastProps["type"],
		duration?: number
	) => void;
	showSuccess: (message: string, duration?: number) => void;
	showError: (message: string, duration?: number) => void;
	showInfo: (message: string, duration?: number) => void;
	showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastContextProviderProps {
	children: ReactNode;
}

interface ToastItem extends ToastProps {
	id: string;
}

export function ToastProvider({ children }: ToastContextProviderProps) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const showToast = (
		message: string,
		type: ToastProps["type"],
		duration?: number
	) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newToast: ToastItem = {
			id,
			message,
			type,
			duration,
		};

		setToasts((prev) => [...prev, newToast]);
	};

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const showSuccess = (message: string, duration?: number) => {
		showToast(message, "success", duration);
	};

	const showError = (message: string, duration?: number) => {
		showToast(message, "error", duration);
	};

	const showInfo = (message: string, duration?: number) => {
		showToast(message, "info", duration);
	};

	const showWarning = (message: string, duration?: number) => {
		showToast(message, "warning", duration);
	};

	return (
		<ToastContext.Provider
			value={{
				showToast,
				showSuccess,
				showError,
				showInfo,
				showWarning,
			}}
		>
			{children}
			{/* Render toasts */}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						duration={toast.duration}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast deve ser usado dentro de um ToastProvider");
	}
	return context;
}
