import React from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className = "",
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;
		const half = Math.floor(maxVisible / 2);

		let start = Math.max(1, currentPage - half);
		let end = Math.min(totalPages, currentPage + half);

		if (end - start + 1 < maxVisible) {
			if (start === 1) {
				end = Math.min(totalPages, start + maxVisible - 1);
			} else {
				start = Math.max(1, end - maxVisible + 1);
			}
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		return pages;
	};

	if (totalPages <= 1) return null;

	return (
		<div className={`flex justify-center items-center gap-2 ${className}`}>
			{getPageNumbers().map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`
						w-10 h-10 rounded-full text-sm font-medium transition-colors
						${
							page === currentPage
								? "bg-input-background text-foreground shadow-sm"
								: "text-gray-600 hover:bg-gray-100"
						}
					`}
				>
					{page}
				</button>
			))}
		</div>
	);
}
