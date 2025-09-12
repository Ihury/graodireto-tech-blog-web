import { useRouter } from "next/router";
import { PageLayout, Container } from "@/components/layout";
import { LoadingSpinner, ErrorState } from "@/components/common";
import { ArticleHeader, ArticleContent } from "@/components/features/articles";
import { CommentSection } from "@/components/features/comments";
import { useArticleBySlug } from "@/hooks/useArticles";
import { Button } from "@/components/ui";

export default function ArticlePage() {
	const router = useRouter();
	const { slug } = router.query;

	// Hooks para artigo
	const {
		data: article,
		isLoading: articleLoading,
		error: articleError,
	} = useArticleBySlug(slug as string);

	// Loading state
	if (articleLoading) {
		return (
			<PageLayout>
				<Container size="md" className="py-8">
					<LoadingSpinner
						size="lg"
						text="Carregando artigo..."
						className="h-64"
					/>
				</Container>
			</PageLayout>
		);
	}

	// Error state
	if (articleError || !article) {
		return (
			<PageLayout>
				<Container size="md" className="py-8">
					<ErrorState
						title="Artigo não encontrado"
						message="O artigo que você procura não existe ou foi removido."
						action={
							<Button onClick={() => router.push("/artigos")}>
								Voltar para artigos
							</Button>
						}
					/>
				</Container>
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			<Container size="md" className="py-8">
				{/* Cabeçalho do artigo */}
				<ArticleHeader article={article} />

				{/* Conteúdo do artigo */}
				<ArticleContent content={article.content} />

				{/* Seção de comentários */}
				<CommentSection articleId={article.id} />
			</Container>
		</PageLayout>
	);
}
