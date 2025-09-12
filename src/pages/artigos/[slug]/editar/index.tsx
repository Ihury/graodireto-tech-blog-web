import { useEffect } from "react";
import { useRouter } from "next/router";
import { PageLayout, Container, PageHeader } from "@/components/layout";
import { LoadingSpinner, ErrorState } from "@/components/common";
import { ArticleForm } from "@/components/features/articles";
import { AuthGuard } from "@/components/features/auth";
import { useArticleBySlug, useUpdateArticle } from "@/hooks/useArticles";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui";

export default function EditArticlePage() {
	const router = useRouter();
	const { slug } = router.query;
	const { showSuccess, showError } = useToast();
	const { user } = useAuth();
	const {
		data: article,
		isLoading: articleLoading,
		error: articleError,
	} = useArticleBySlug(slug as string);
	const { updateArticle, isLoading: updateLoading } = useUpdateArticle();

	// Verificar se o usuário é o autor do artigo
	useEffect(() => {
		if (article && user && article.author.id !== user.id) {
			showError("Você não tem permissão para editar este artigo");
			router.push("/artigos");
		}
	}, [article, user, showError, router]);

	const handleSubmit = async (data: {
		title: string;
		content: string;
		coverImageUrl?: string;
		tags: string[];
	}) => {
		if (!article) return;

		try {
			await updateArticle(article.id, data);
			showSuccess("Artigo atualizado com sucesso!");
			router.push(`/artigos/${article.slug}`);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao atualizar artigo";
			showError(errorMessage);
		}
	};

	// Loading state
	if (articleLoading) {
		return (
			<AuthGuard>
				<PageLayout className="min-h-screen bg-background-white">
					<Container size="md" className="py-8">
						<LoadingSpinner
							size="lg"
							text="Carregando artigo..."
							className="h-64"
						/>
					</Container>
				</PageLayout>
			</AuthGuard>
		);
	}

	// Error state
	if (articleError || !article) {
		return (
			<AuthGuard>
				<PageLayout className="min-h-screen bg-background-white">
					<Container size="md" className="py-8">
						<ErrorState
							title="Erro ao carregar artigo"
							message={articleError?.message || "Artigo não encontrado"}
							action={
								<Button onClick={() => router.push("/artigos")}>
									Voltar para artigos
								</Button>
							}
						/>
					</Container>
				</PageLayout>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard>
			<PageLayout className="min-h-screen bg-background-white">
				<Container size="md" className="py-8">
					<PageHeader
						title="Editar artigo"
						showBackButton
						onBack={() => router.back()}
					/>

					<div className="bg-white rounded-lg border border-gray-200 p-8">
						<ArticleForm
							onSubmit={handleSubmit}
							isLoading={updateLoading}
							mode="edit"
							initialData={{
								title: article.title,
								content: article.content,
								coverImageUrl: article.coverImageUrl,
								tags: article.tags.map((tag) => tag.slug),
							}}
						/>
					</div>
				</Container>
			</PageLayout>
		</AuthGuard>
	);
}
