import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ArticleForm from "@/components/ArticleForm";
import { useArticleBySlug, useUpdateArticle } from "@/hooks/useArticles";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";

export default function EditArticlePage() {
	const router = useRouter();
	const { slug } = router.query;
	const { showSuccess, showError } = useToast();
	const { isAuthenticated, isLoading: authLoading, user } = useAuth();
	const {
		data: article,
		isLoading: articleLoading,
		error: articleError,
	} = useArticleBySlug(slug as string);
	const { updateArticle, isLoading: updateLoading } = useUpdateArticle();

	// Redirecionar se não estiver autenticado
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, authLoading, router]);

	// Verificar se o usuário é o autor do artigo
	useEffect(() => {
		if (article && user && article.author.id !== user.id) {
			showError("Você não tem permissão para editar este artigo");
			router.push("/artigos");
		}
	}, [article, user, showError, router]);

	const handleBack = () => {
		router.back();
	};

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
			// Não fazer mais nada aqui - o formulário manterá os dados editados
		}
	};

	// Mostrar loading enquanto verifica autenticação
	if (authLoading) {
		return (
			<div className="min-h-screen bg-background-white">
				<Header showAuthButton={true} />
				<div className="max-w-4xl mx-auto px-4 py-8">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-gray-600">Carregando...</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Não mostrar nada se não estiver autenticado (será redirecionado)
	if (!isAuthenticated) {
		return null;
	}

	// Mostrar loading enquanto carrega o artigo
	if (articleLoading) {
		return (
			<div className="min-h-screen bg-background-white">
				<Header showAuthButton={true} />
				<div className="max-w-4xl mx-auto px-4 py-8">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-gray-600">Carregando artigo...</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Mostrar erro se não conseguir carregar o artigo
	if (articleError || !article) {
		return (
			<div className="min-h-screen bg-background-white">
				<Header showAuthButton={true} />
				<div className="max-w-4xl mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Erro ao carregar artigo
						</h1>
						<p className="text-gray-600 mb-6">
							{articleError?.message || "Artigo não encontrado"}
						</p>
						<Button onClick={() => router.push("/artigos")}>
							Voltar para artigos
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background-white">
			<Header showAuthButton={true} />

			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header da página */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<Button variant="ghost" onClick={handleBack} className="p-2">
							<ArrowLeftIcon size={20} weight="regular" />
						</Button>
						<h1 className="text-3xl font-bold text-foreground">
							Editar artigo
						</h1>
					</div>
				</div>

				{/* Formulário */}
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
			</div>
		</div>
	);
}
