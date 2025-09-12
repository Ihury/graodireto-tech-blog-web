import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { PageLayout, Container } from "@/components/layout";
import { Button, SearchBar, Pagination } from "@/components/ui";
import { ArticleList, TagFilter } from "@/components/features/articles";
import { useArticles } from "@/hooks/useArticles";
import { useTags } from "@/hooks/useTags";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ArtigosPage() {
	const router = useRouter();
	const { showError } = useToast();
	const { user } = useAuth();

	// Estados locais
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);

	// Hooks
	const { tags, isLoading: tagsLoading, error: tagsError } = useTags();

	// Memoizar os parâmetros para evitar re-renders desnecessários
	const articlesParams = useMemo(
		() => ({
			initialPage: currentPage,
			initialSize: 6,
			search: searchTerm || undefined,
			tags: selectedTags.length > 0 ? selectedTags : undefined,
		}),
		[currentPage, searchTerm, selectedTags]
	);

	const {
		data: articlesData,
		isLoading: articlesLoading,
		error: articlesError,
		pagination,
		refetch: refetchArticles,
	} = useArticles(articlesParams);

	// Efeitos
	useEffect(() => {
		if (tagsError) {
			showError("Erro ao carregar tags");
		}
	}, [tagsError, showError]);

	useEffect(() => {
		if (articlesError) {
			showError("Erro ao carregar artigos");
		}
	}, [articlesError, showError]);

	// Handlers
	const handleTagToggle = (tagSlug: string) => {
		setSelectedTags((prev) => {
			if (prev.includes(tagSlug)) {
				return prev.filter((slug) => slug !== tagSlug);
			} else {
				return [...prev, tagSlug];
			}
		});
		setCurrentPage(1); // Reset para primeira página
	};

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1); // Reset para primeira página
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		pagination.setPage(page);
	};

	const handleCreateArticle = () => {
		router.push("/artigos/criar");
	};

	const handleEditArticle = (article: any) => {
		router.push(`/artigos/${article.slug}/editar`);
	};

	const handleArticleClick = (article: any) => {
		router.push(`/artigos/${article.slug}`);
	};

	return (
		<PageLayout>
			<Container size="xl" className="py-8">
				{/* Header da página */}
				<div className="flex justify-between items-center gap-4 mb-6">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
						Todos os artigos
					</h1>
					<Button
						onClick={handleCreateArticle}
						className="flex items-center gap-2 text-sm sm:text-base px-3 py-2 sm:px-4"
					>
						Criar artigo
					</Button>
				</div>

				{/* Filtros de tags */}
				<TagFilter
					tags={tags}
					selectedTags={selectedTags}
					onTagToggle={handleTagToggle}
					isLoading={tagsLoading}
				/>

				{/* Barra de pesquisa */}
				<SearchBar
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder="Pesquisar..."
					className="mb-6"
				/>

				{/* Lista de artigos */}
				<ArticleList
					articles={articlesData?.data || []}
					isLoading={articlesLoading}
					onArticleClick={handleArticleClick}
					onArticleEdit={handleEditArticle}
					currentUserId={user?.id}
					emptyMessage={
						searchTerm || selectedTags.length > 0
							? "Nenhum artigo encontrado com os filtros aplicados"
							: "Nenhum artigo encontrado"
					}
				/>

				{/* Paginação */}
				{pagination.totalPages > 1 && (
					<Pagination
						currentPage={pagination.page}
						totalPages={pagination.totalPages}
						onPageChange={handlePageChange}
					/>
				)}
			</Container>
		</PageLayout>
	);
}
