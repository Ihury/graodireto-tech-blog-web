import axios from "axios";
import { ApiError, ApiResponse } from "@/types/techBlogApi";

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class TechBlogApiClient {
	private axiosInstance: ReturnType<typeof axios.create>;

	constructor(baseURL: string) {
		this.axiosInstance = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Interceptor para adicionar token de autenticação
		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token =
					typeof window !== "undefined"
						? localStorage.getItem("access_token")
						: null;

				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Interceptor para tratamento de respostas
		this.axiosInstance.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				const apiError: ApiError = {
					message:
						error.response?.data?.message ||
						error.message ||
						"Erro na requisição",
					statusCode: error.response?.status || 0,
					error: error.response?.data?.error || error.code || "NETWORK_ERROR",
				};

				// Retornar erro no formato esperado
				return Promise.reject(apiError);
			}
		);
	}

	private async request<T>(
		config: Parameters<typeof this.axiosInstance.request>[0]
	): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.request(config);
			return { data: response.data as T };
		} catch (error) {
			// O interceptor já transformou o erro no formato ApiError
			return { error: error as ApiError };
		}
	}

	async get<T>(
		endpoint: string,
		params?: Record<string, unknown>
	): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: "GET",
			url: endpoint,
			params,
		});
	}

	async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: "POST",
			url: endpoint,
			data,
		});
	}

	async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: "PUT",
			url: endpoint,
			data,
		});
	}

	async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: "PATCH",
			url: endpoint,
			data,
		});
	}

	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: "DELETE",
			url: endpoint,
		});
	}
}

// Instância global do cliente da API
export const apiClient = new TechBlogApiClient(API_BASE_URL);

// Utilitários para tratamento de erros
export const handleApiError = (error: ApiError): string => {
	// Priorizar a mensagem da API quando disponível
	if (error.message) {
		return error.message;
	}

	// Fallback para erros técnicos/sistema
	switch (error.statusCode) {
		case 0:
			return "Erro de conexão. Verifique sua internet.";
		case 500:
		case 502:
		case 503:
		case 504:
			return "Erro interno do servidor. Tente novamente mais tarde.";
		default:
			return "Erro inesperado. Tente novamente.";
	}
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
	if (typeof window === "undefined") return false;
	return !!localStorage.getItem("access_token");
};

// Função para fazer logout
export const logout = (): void => {
	if (typeof window === "undefined") return;
	localStorage.removeItem("access_token");
	localStorage.removeItem("user");
	window.location.href = "/login";
};
