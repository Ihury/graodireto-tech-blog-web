import { apiClient } from "@/lib/techBlogApi";
import {
	ArticleResponseDto,
	CreateArticleDto,
	UpdateArticleDto,
	DeleteArticleResponseDto,
	ListArticlesParams,
	ListArticlesResponseDto,
} from "@/types/techBlogApi";

export class ArticlesService {
	/**
	 * Lista artigos com paginação e filtros
	 */
	static async listArticles(
		params: ListArticlesParams = {}
	): Promise<ListArticlesResponseDto> {
		const searchParams = new URLSearchParams();

		// Adicionar parâmetros de paginação
		if (params.page) searchParams.append("page", params.page.toString());
		if (params.size) searchParams.append("size", params.size.toString());

		// Adicionar parâmetros de busca
		if (params.search) searchParams.append("search", params.search);
		if (params.tags && params.tags.length > 0) {
			params.tags.forEach((tag) => searchParams.append("tags", tag));
		}

		const queryString = searchParams.toString();
		const url = queryString ? `/articles?${queryString}` : "/articles";

		const response = await apiClient.get<ListArticlesResponseDto>(url);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data!;
	}

	/**
	 * Busca um artigo por ID
	 */
	static async getArticleById(id: string): Promise<ArticleResponseDto> {
		const response = await apiClient.get<ArticleResponseDto>(`/articles/${id}`);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data!;
	}

	/**
	 * Busca um artigo por slug
	 */
	static async getArticleBySlug(slug: string): Promise<ArticleResponseDto> {
		const response = await apiClient.get<ArticleResponseDto>(
			`/articles/slug/${slug}`
		);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data!;
	}

	/**
	 * Cria um novo artigo
	 */
	static async createArticle(
		articleData: CreateArticleDto
	): Promise<ArticleResponseDto> {
		const response = await apiClient.post<ArticleResponseDto>(
			"/articles",
			articleData
		);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data!;
	}

	/**
	 * Atualiza um artigo existente
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
			throw new Error(response.error.message);
		}
		return response.data!;
	}

	/**
	 * Exclui um artigo
	 */
	static async deleteArticle(id: string): Promise<DeleteArticleResponseDto> {
		const response = await apiClient.delete<DeleteArticleResponseDto>(
			`/articles/${id}`
		);
		if (response.error) {
			throw new Error(response.error.message);
		}
		return response.data!;
	}
}
