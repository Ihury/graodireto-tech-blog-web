import { apiClient, handleApiError } from "@/lib/techBlogApi";
import {
	ArticleResponseDto,
	CreateArticleDto,
	DeleteArticleResponseDto,
	ListArticlesParams,
	ListArticlesResponseDto,
	UpdateArticleDto,
} from "@/types/techBlogApi";

export class ArticlesService {
	/**
	 * Listar artigos com paginação e filtros
	 */
	static async listArticles(
		params?: ListArticlesParams
	): Promise<ListArticlesResponseDto> {
		const response = await apiClient.get<ListArticlesResponseDto>(
			"/articles",
			params as Record<string, unknown>
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}

	/**
	 * Obter artigo por ID
	 */
	static async getArticleById(id: string): Promise<ArticleResponseDto> {
		const response = await apiClient.get<ArticleResponseDto>(`/articles/${id}`);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}

	/**
	 * Obter artigo por slug
	 */
	static async getArticleBySlug(slug: string): Promise<ArticleResponseDto> {
		const response = await apiClient.get<ArticleResponseDto>(
			`/articles/slug/${slug}`
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}

	/**
	 * Criar novo artigo
	 */
	static async createArticle(
		articleData: CreateArticleDto
	): Promise<ArticleResponseDto> {
		const response = await apiClient.post<ArticleResponseDto>(
			"/articles",
			articleData
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}

	/**
	 * Atualizar artigo existente
	 */
	static async updateArticle(
		id: string,
		articleData: UpdateArticleDto
	): Promise<ArticleResponseDto> {
		const response = await apiClient.put<ArticleResponseDto>(
			`/articles/${id}`,
			articleData
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}

	/**
	 * Deletar artigo
	 */
	static async deleteArticle(id: string): Promise<DeleteArticleResponseDto> {
		const response = await apiClient.delete<DeleteArticleResponseDto>(
			`/articles/${id}`
		);

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}
}
