import { useRouter } from "next/router";
import { PageLayout, Container, PageHeader } from "@/components/layout";
import { ArticleForm } from "@/components/features/articles";
import { AuthGuard } from "@/components/features/auth";
import { useCreateArticle } from "@/hooks/useArticles";
import { useToast } from "@/contexts/ToastContext";

export default function NovoArtigoPage() {
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const { createArticle, isLoading: createLoading } = useCreateArticle();

	const handleSubmit = async (data: {
		title: string;
		content: string;
		coverImageUrl?: string;
		tags: string[];
	}) => {
		try {
			await createArticle(data);
			showSuccess("Artigo criado com sucesso!");
			router.push("/artigos");
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao criar artigo";
			showError(errorMessage);
		}
	};

	return (
		<AuthGuard>
			<PageLayout className="min-h-screen bg-background-white">
				<Container size="md" className="py-8">
					<PageHeader
						title="Novo artigo"
						showBackButton
						onBack={() => router.back()}
					/>

					<div className="bg-white rounded-lg border border-gray-200 p-8">
						<ArticleForm onSubmit={handleSubmit} isLoading={createLoading} />
					</div>
				</Container>
			</PageLayout>
		</AuthGuard>
	);
}
