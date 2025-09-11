import { apiClient, handleApiError } from "@/lib/techBlogApi";
import {
	CommentResponseDto,
	CreateCommentDto,
	DeleteCommentResponseDto,
	ListCommentsParams,
	ListCommentsResponseDto,
	ListRepliesParams,
	ListRepliesResponseDto,
} from "@/types/techBlogApi";

export class CommentsService {
	/**
	 * Listar comentários de um artigo com paginação por cursor
	 */
	static async listCommentsByArticle(
		articleId: string,
		params?: ListCommentsParams
	): Promise<ListCommentsResponseDto> {
		const response = await apiClient.get<ListCommentsResponseDto>(
			`/comments/article/${articleId}`,
			params as Record<string, unknown> | undefined
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
	 * Listar respostas de um comentário com paginação por cursor
	 */
	static async listReplies(
		commentId: string,
		params?: ListRepliesParams
	): Promise<ListRepliesResponseDto> {
		const response = await apiClient.get<ListRepliesResponseDto>(
			`/comments/${commentId}/replies`,
			params as Record<string, unknown> | undefined
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
	 * Criar novo comentário em um artigo
	 */
	static async createComment(
		articleId: string,
		commentData: CreateCommentDto
	): Promise<CommentResponseDto> {
		const response = await apiClient.post<CommentResponseDto>(
			`/comments/article/${articleId}`,
			commentData
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
	 * Deletar comentário
	 */
	static async deleteComment(
		commentId: string
	): Promise<DeleteCommentResponseDto> {
		const response = await apiClient.delete<DeleteCommentResponseDto>(
			`/comments/${commentId}`
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
