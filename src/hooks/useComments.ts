import { useState, useEffect, useCallback, useMemo } from "react";
import { CommentsService } from "@/services/comments.service";
import { useCursorPagination } from "./usePagination";
import {
	CreateCommentDto,
	ListCommentsParams,
	ListRepliesParams,
	ListCommentsResponseDto,
	ListRepliesResponseDto,
} from "@/types/techBlogApi";

export interface UseCommentsByArticleOptions {
	articleId: string;
	initialSize?: number;
}

// Hook para listar comentários de um artigo com paginação
export function useCommentsByArticle(options: UseCommentsByArticleOptions) {
	const { articleId, initialSize = 10 } = options;

	const pagination = useCursorPagination({
		initialSize,
	});

	const [data, setData] = useState<ListCommentsResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchComments = useCallback(async () => {
		if (!articleId) return;

		const queryParams: ListCommentsParams = {
			size: pagination.size,
			...(pagination.cursor && { after: pagination.cursor }),
		};

		try {
			setIsLoading(true);
			setError(null);
			const result = await CommentsService.listCommentsByArticle(
				articleId,
				queryParams
			);
			setData(result);
			pagination.setCursor(result.meta.nextCursor);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, [articleId, pagination.size, pagination.cursor, pagination.setCursor]);

	useEffect(() => {
		if (articleId) {
			fetchComments();
		}
	}, [fetchComments, articleId]);

	// Memoizar o objeto de paginação para evitar re-renders desnecessários
	const paginationData = useMemo(
		() => ({
			...pagination,
			// Sobrescrever o hasNext com os dados da API
			hasNext: data?.meta?.nextCursor ? true : false,
		}),
		[pagination, data?.meta?.nextCursor]
	);

	return {
		data,
		isLoading,
		error,
		refetch: fetchComments,
		pagination: paginationData,
	};
}

export interface UseCommentRepliesOptions {
	commentId: string;
	initialSize?: number;
}

// Hook para listar respostas de um comentário com paginação obrigatória
export function useCommentReplies(options: UseCommentRepliesOptions) {
	const { commentId, initialSize = 10 } = options;

	const pagination = useCursorPagination({
		initialSize,
	});

	const [data, setData] = useState<ListRepliesResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchReplies = useCallback(async () => {
		if (!commentId) return;

		const queryParams: ListRepliesParams = {
			size: pagination.size,
			...(pagination.cursor && { after: pagination.cursor }),
		};

		try {
			setIsLoading(true);
			setError(null);
			const result = await CommentsService.listReplies(commentId, queryParams);
			setData(result);
			pagination.setCursor(result.meta.nextCursor);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, [commentId, pagination.size, pagination.cursor, pagination.setCursor]);

	useEffect(() => {
		if (commentId) {
			fetchReplies();
		}
	}, [fetchReplies, commentId]);

	// Memoizar o objeto de paginação para evitar re-renders desnecessários
	const paginationData = useMemo(
		() => ({
			...pagination,
			// Sobrescrever o hasNext com os dados da API
			hasNext: data?.meta?.nextCursor ? true : false,
		}),
		[pagination, data?.meta?.nextCursor]
	);

	return {
		data,
		isLoading,
		error,
		refetch: fetchReplies,
		pagination: paginationData,
	};
}

// Hook para criar comentário
export function useCreateComment() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const createComment = useCallback(
		async (articleId: string, data: CreateCommentDto) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await CommentsService.createComment(articleId, data);
				return result;
			} catch (err) {
				const error =
					err instanceof Error ? err : new Error("Erro desconhecido");
				setError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		createComment,
		isLoading,
		error,
	};
}

// Hook para deletar comentário
export function useDeleteComment() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const deleteComment = useCallback(async (commentId: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await CommentsService.deleteComment(commentId);
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
		deleteComment,
		isLoading,
		error,
	};
}
