import { apiClient, handleApiError } from "@/lib/techBlogApi";
import {
	LoginDto,
	LoginResponseDto,
	ValidateTokenResponseDto,
	UserResponseDto,
} from "@/types/techBlogApi";

export class AuthService {
	/**
	 * Realizar login do usuário
	 */
	static async login(credentials: LoginDto): Promise<LoginResponseDto> {
		const response = await apiClient.post<LoginResponseDto>(
			"/auth/login",
			credentials
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		// Salvar token e dados do usuário no localStorage
		if (typeof window !== "undefined") {
			localStorage.setItem("access_token", response.data.access_token);
			localStorage.setItem("user", JSON.stringify(response.data.user));
		}

		return response.data;
	}

	/**
	 * Validar token de acesso
	 */
	static async validateToken(): Promise<ValidateTokenResponseDto> {
		const response = await apiClient.get<ValidateTokenResponseDto>(
			"/auth/validate"
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		// Atualizar dados do usuário no localStorage se o token for válido
		if (response.data.valid && typeof window !== "undefined") {
			localStorage.setItem("user", JSON.stringify(response.data.user));
		}

		return response.data;
	}

	/**
	 * Fazer logout do usuário
	 */
	static logout(): void {
		if (typeof window !== "undefined") {
			localStorage.removeItem("access_token");
			localStorage.removeItem("user");
		}
	}

	/**
	 * Obter dados do usuário do localStorage
	 */
	static getCurrentUser(): UserResponseDto | null {
		if (typeof window === "undefined") return null;

		const userStr = localStorage.getItem("user");
		if (!userStr) return null;

		try {
			return JSON.parse(userStr);
		} catch {
			return null;
		}
	}

	/**
	 * Verificar se o usuário está autenticado
	 */
	static isAuthenticated(): boolean {
		if (typeof window === "undefined") return false;
		return !!localStorage.getItem("access_token");
	}

	/**
	 * Obter token de acesso
	 */
	static getAccessToken(): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem("access_token");
	}
}
