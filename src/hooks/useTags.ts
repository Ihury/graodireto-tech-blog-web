import { useState, useEffect, useCallback } from "react";
import { TagsService } from "@/services/tags.service";
import { TagDto } from "@/types/techBlogApi";

// Hook para listar todas as tags
export function useTags() {
	const [data, setData] = useState<TagDto[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchTags = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await TagsService.listTags();
			setData(result.tags);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTags();
	}, [fetchTags]);

	return {
		tags: data,
		isLoading,
		error,
		refetch: fetchTags,
	};
}

// Hook para obter uma tag específica por slug
export function useTagBySlug(slug: string) {
	const [data, setData] = useState<TagDto | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchTag = useCallback(async () => {
		if (!slug) return;

		try {
			setIsLoading(true);
			setError(null);
			const result = await TagsService.listTags();
			const tag = result.tags.find((t) => t.slug === slug);
			setData(tag || null);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Erro desconhecido"));
		} finally {
			setIsLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		fetchTag();
	}, [fetchTag]);

	return {
		tag: data,
		isLoading,
		error,
		refetch: fetchTag,
	};
}
