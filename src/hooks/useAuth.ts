import { useState, useCallback } from "react";
import { AuthService } from "@/services/auth.service";
import { LoginDto } from "@/types/techBlogApi";

// Hook para login
export function useLogin() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const login = useCallback(async (credentials: LoginDto) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await AuthService.login(credentials);
			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Erro desconhecido");
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		login,
		isLoading,
		error,
	};
}

// Hook para validar token
export function useValidateToken() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const validateToken = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await AuthService.validateToken();
			return result;
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Erro desconhecido");
			setError(error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		validateToken,
		isLoading,
		error,
	};
}
