import { useState, useMemo, useCallback } from "react";

// ===== OFFSET PAGINATION HOOK =====

export interface UseOffsetPaginationOptions {
	initialPage?: number;
	initialSize?: number;
	maxSize?: number;
}

export interface UseOffsetPaginationReturn {
	page: number;
	size: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
	setPage: (page: number) => void;
	setSize: (size: number) => void;
	nextPage: () => void;
	previousPage: () => void;
	goToFirstPage: () => void;
	goToLastPage: () => void;
	canGoToPage: (page: number) => boolean;
	pageNumbers: number[];
	updateTotal: (total: number) => void;
}

export function useOffsetPagination(
	options: UseOffsetPaginationOptions = {}
): UseOffsetPaginationReturn {
	const { initialPage = 1, initialSize = 10, maxSize = 50 } = options;

	const [page, setPageState] = useState(initialPage);
	const [size, setSizeState] = useState(initialSize);
	const [total, setTotal] = useState(0);

	const totalPages = Math.ceil(total / size);
	const hasNext = page < totalPages;
	const hasPrevious = page > 1;

	const setPage = useCallback((newPage: number) => {
		if (newPage >= 1) {
			setPageState(newPage);
		}
	}, []);

	const setSize = useCallback(
		(newSize: number) => {
			const validSize = Math.min(maxSize, Math.max(1, newSize));
			setSizeState(validSize);
			// Reset para primeira página quando mudar o tamanho
			setPageState(1);
		},
		[maxSize]
	);

	const nextPage = useCallback(() => {
		if (hasNext) {
			setPageState((prev) => prev + 1);
		}
	}, [hasNext]);

	const previousPage = useCallback(() => {
		if (hasPrevious) {
			setPageState((prev) => prev - 1);
		}
	}, [hasPrevious]);

	const goToFirstPage = useCallback(() => {
		setPageState(1);
	}, []);

	const goToLastPage = useCallback(() => {
		setPageState(totalPages);
	}, [totalPages]);

	const canGoToPage = useCallback(
		(pageNumber: number) => {
			return pageNumber >= 1 && pageNumber <= totalPages;
		},
		[totalPages]
	);

	const pageNumbers = useMemo(() => {
		const maxVisible = 5;
		const half = Math.floor(maxVisible / 2);

		let start = Math.max(1, page - half);
		let end = Math.min(totalPages, page + half);

		if (end - start + 1 < maxVisible) {
			if (start === 1) {
				end = Math.min(totalPages, start + maxVisible - 1);
			} else {
				start = Math.max(1, end - maxVisible + 1);
			}
		}

		const pages: number[] = [];
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	}, [page, totalPages]);

	// Função para atualizar o total (usada quando receber dados da API)
	const updateTotal = useCallback((newTotal: number) => {
		setTotal(newTotal);
	}, []);

	return {
		page,
		size,
		total,
		totalPages,
		hasNext,
		hasPrevious,
		setPage,
		setSize,
		nextPage,
		previousPage,
		goToFirstPage,
		goToLastPage,
		canGoToPage,
		pageNumbers,
		updateTotal,
	};
}

// ===== CURSOR PAGINATION HOOK =====

export interface UseCursorPaginationOptions {
	initialSize?: number;
	maxSize?: number;
}

export interface UseCursorPaginationReturn {
	size: number;
	cursor?: string;
	hasNext: boolean;
	setSize: (size: number) => void;
	setCursor: (cursor?: string) => void;
	nextPage: (nextCursor?: string) => void;
	reset: () => void;
	canLoadMore: boolean;
}

export function useCursorPagination(
	options: UseCursorPaginationOptions = {}
): UseCursorPaginationReturn {
	const { initialSize = 10, maxSize = 50 } = options;

	const [size, setSizeState] = useState(initialSize);
	const [cursor, setCursorState] = useState<string | undefined>();
	const [hasNext, setHasNext] = useState(false);

	const setSize = useCallback(
		(newSize: number) => {
			const validSize = Math.min(maxSize, Math.max(1, newSize));
			setSizeState(validSize);
			// Reset cursor quando mudar o tamanho
			setCursorState(undefined);
			setHasNext(false);
		},
		[maxSize]
	);

	const setCursor = useCallback((newCursor?: string) => {
		setCursorState(newCursor);
		setHasNext(!!newCursor);
	}, []);

	const nextPage = useCallback((nextCursor?: string) => {
		setCursorState(nextCursor);
		setHasNext(!!nextCursor);
	}, []);

	const reset = useCallback(() => {
		setCursorState(undefined);
		setHasNext(false);
	}, []);

	const canLoadMore = hasNext;

	return {
		size,
		cursor,
		hasNext,
		setSize,
		setCursor,
		nextPage,
		reset,
		canLoadMore,
	};
}

// ===== PAGINATION STATE HOOK =====

export interface UsePaginationStateOptions {
	type: "offset" | "cursor";
	initialPage?: number;
	initialSize?: number;
	maxSize?: number;
}

export function usePaginationState(options: UsePaginationStateOptions) {
	const { type, ...restOptions } = options;

	// Sempre chamar ambos os hooks, mas retornar apenas o necessário
	const offsetPagination = useOffsetPagination(restOptions);
	const cursorPagination = useCursorPagination(restOptions);

	return type === "offset" ? offsetPagination : cursorPagination;
}
