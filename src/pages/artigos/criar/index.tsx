import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ArticleForm from "@/components/ArticleForm";
import { useCreateArticle } from "@/hooks/useArticles";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function NovoArtigoPage() {
	const router = useRouter();
	const { showSuccess, showError } = useToast();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const { createArticle, isLoading: createLoading } = useCreateArticle();

	// Redirecionar se não estiver autenticado
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, authLoading, router]);

	const handleBack = () => {
		router.back();
	};

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
						<h1 className="text-3xl font-bold text-foreground">Novo artigo</h1>
					</div>
				</div>

				{/* Formulário */}
				<div className="bg-white rounded-lg border border-gray-200 p-8">
					<ArticleForm onSubmit={handleSubmit} isLoading={createLoading} />
				</div>
			</div>
		</div>
	);
}
