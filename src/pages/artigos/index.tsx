import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { PlusIcon } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ArticleCard from "@/components/ArticleCard";
import TagFilter from "@/components/TagFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
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
		<div className="min-h-screen bg-background">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header da página */}
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-foreground">
						Todos os artigos
					</h1>
					<Button
						onClick={handleCreateArticle}
						className="flex items-center gap-2"
					>
						<PlusIcon size={20} weight="regular" />
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
					className="mb-8"
				/>

				{/* Lista de artigos */}
				<div className="space-y-4 mb-8">
					{articlesLoading ? (
						// Loading skeleton
						Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
							>
								<div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
								<div className="flex-1">
									<div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
									<div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
									<div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
								</div>
							</div>
						))
					) : articlesData?.data && articlesData.data.length > 0 ? (
						articlesData.data.map((article) => (
							<div
								key={article.id}
								onClick={() => handleArticleClick(article)}
								className="cursor-pointer"
							>
								<ArticleCard
									article={article}
									showEditButton={true}
									onEdit={handleEditArticle}
									currentUserId={user?.id}
								/>
							</div>
						))
					) : (
						<div className="text-center py-12">
							<p className="text-gray-500 text-lg">
								{searchTerm || selectedTags.length > 0
									? "Nenhum artigo encontrado com os filtros aplicados"
									: "Nenhum artigo encontrado"}
							</p>
						</div>
					)}
				</div>

				{/* Paginação */}
				{pagination.totalPages > 1 && (
					<Pagination
						currentPage={pagination.page}
						totalPages={pagination.totalPages}
						onPageChange={handlePageChange}
					/>
				)}
			</main>
		</div>
	);
}
