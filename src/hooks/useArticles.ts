import { useState, useEffect, useCallback, useMemo } from "react";
import { ArticlesService } from "@/services/articles.service";
import { useOffsetPagination } from "./usePagination";
import {
	ArticleResponseDto,
	CreateArticleDto,
	ListArticlesParams,
	UpdateArticleDto,
	ListArticlesResponseDto,
} from "@/types/techBlogApi";

export interface UseArticlesOptions {
	initialPage?: number;
	initialSize?: number;
	search?: string;
	tags?: string[];
}

// Hook para listar artigos com paginação
export function useArticles(options: UseArticlesOptions = {}) {
	const { initialPage = 1, initialSize = 10, search, tags } = options;

	const pagination = useOffsetPagination({
		initialPage,
		initialSize,
	});

	const [data, setData] = useState<ListArticlesResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchArticles = useCallback(async () => {
		const queryParams: ListArticlesParams = {
			page: pagination.page,
			size: pagination.size,
			...(search && { search }),
			...(tags && tags.length > 0 && { tags }),
		};

		try {
			setIsLoading(true);
			setError(null);
			const result = await ArticlesService.listArticles(queryParams);
			setData(result);
			pagination.updateTotal(result.meta.total);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, [pagination.page, pagination.size, search, tags, pagination.updateTotal]);

	useEffect(() => {
		fetchArticles();
	}, [pagination.page, pagination.size, search, tags]);

	// Memoizar o objeto de paginação para evitar re-renders desnecessários
	const paginationData = useMemo(
		() => ({
			...pagination,
			// Sobrescrever com os dados da API
			total: data?.meta?.total ?? pagination.total,
			totalPages: data?.meta?.totalPages ?? pagination.totalPages,
			hasNext: data?.meta?.hasNext ?? pagination.hasNext,
			hasPrevious: data?.meta?.hasPrevious ?? pagination.hasPrevious,
		}),
		[pagination, data?.meta]
	);

	return {
		data,
		isLoading,
		error,
		refetch: fetchArticles,
		pagination: paginationData,
	};
}

// Hook para obter artigo por ID
export function useArticle(id: string) {
	const [data, setData] = useState<ArticleResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchArticle = useCallback(async () => {
		if (!id) return;

		try {
			setIsLoading(true);
			setError(null);
			const result = await ArticlesService.getArticleById(id);
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchArticle();
	}, [fetchArticle]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchArticle,
	};
}

// Hook para obter artigo por slug
export function useArticleBySlug(slug: string) {
	const [data, setData] = useState<ArticleResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchArticle = useCallback(async () => {
		if (!slug) return;

		try {
			setIsLoading(true);
			setError(null);
			const result = await ArticlesService.getArticleBySlug(slug);
			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		fetchArticle();
	}, [fetchArticle]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchArticle,
	};
}

// Hook para criar artigo
export function useCreateArticle() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const createArticle = useCallback(async (data: CreateArticleDto) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ArticlesService.createArticle(data);
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
		createArticle,
		isLoading,
		error,
	};
}

// Hook para atualizar artigo
export function useUpdateArticle() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const updateArticle = useCallback(
		async (id: string, data: UpdateArticleDto) => {
			try {
				setIsLoading(true);
				setError(null);
				const result = await ArticlesService.updateArticle(id, data);
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
		updateArticle,
		isLoading,
		error,
	};
}

// Hook para deletar artigo
export function useDeleteArticle() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const deleteArticle = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await ArticlesService.deleteArticle(id);
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
		deleteArticle,
		isLoading,
		error,
	};
}
