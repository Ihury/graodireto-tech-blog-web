import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Comment from "@/components/Comment";
import CommentForm from "@/components/CommentForm";
import { useArticleBySlug } from "@/hooks/useArticles";
import {
	useCommentsByArticle,
	useCreateComment,
	useDeleteComment,
} from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { formatDate } from "@/utils/dateUtils";

export default function ArticlePage() {
	const router = useRouter();
	const { slug } = router.query;
	const { user, isAuthenticated } = useAuth();
	const { showSuccess, showError } = useToast();

	// Hooks para artigo
	const {
		data: article,
		isLoading: articleLoading,
		error: articleError,
	} = useArticleBySlug(slug as string);

	// Hooks para comentários
	const {
		data: commentsData,
		isLoading: commentsLoading,
		error: commentsError,
		refetch: refetchComments,
	} = useCommentsByArticle({
		articleId: article?.id || "",
		initialSize: 10,
	});

	const { createComment, isLoading: createLoading } = useCreateComment();
	const { deleteComment, isLoading: deleteLoading } = useDeleteComment();

	// Estados locais
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);

	// Efeitos
	useEffect(() => {
		if (commentsError) {
			showError("Erro ao carregar comentários");
		}
	}, [commentsError, showError]);

	// Handlers
	const handleCreateComment = async (content: string) => {
		if (!article || !isAuthenticated) return;

		setIsSubmittingComment(true);
		try {
			await createComment(article.id, { content });
			showSuccess("Comentário adicionado com sucesso!");
			refetchComments();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao adicionar comentário";
			showError(errorMessage);
			throw err; // Re-throw para o componente saber que deu erro
		} finally {
			setIsSubmittingComment(false);
		}
	};

	const handleReplyComment = async (parentId: string, content: string) => {
		if (!article || !isAuthenticated) return;

		try {
			await createComment(article.id, { content, parentId });
			showSuccess("Resposta adicionada com sucesso!");
			refetchComments();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao adicionar resposta";
			showError(errorMessage);
			throw err;
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		try {
			await deleteComment(commentId);
			showSuccess("Comentário excluído com sucesso!");
			refetchComments();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao excluir comentário";
			showError(errorMessage);
			throw err;
		}
	};

	// Loading state
	if (articleLoading) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="max-w-4xl mx-auto px-4 py-8">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-3/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						<div className="h-64 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (articleError || !article) {
		return (
			<div className="min-h-screen bg-background">
				<Header />
				<div className="max-w-4xl mx-auto px-4 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">
							Artigo não encontrado
						</h1>
						<p className="text-gray-600 mb-6">
							O artigo que você procura não existe ou foi removido.
						</p>
						<button
							onClick={() => router.push("/artigos")}
							className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
						>
							Voltar para artigos
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="max-w-4xl mx-auto px-4 py-8">
				{/* Cabeçalho do artigo */}
				<header className="mb-8">
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						{article.title}
					</h1>

					<div className="flex items-center gap-4 mb-6">
						<span className="px-3 py-1 text-sm font-medium bg-input-background text-foreground rounded-full">
							{article.tags[0]?.name}
						</span>
					</div>

					<div className="flex items-center text-gray-600 text-sm">
						<span>Publicado por {article.author.displayName}</span>
						<span className="mx-2">•</span>
						<span>{formatDate(article.createdAt)}</span>
					</div>
				</header>

				{/* Conteúdo do artigo */}
				<article className="prose prose-lg max-w-none mb-12">
					<div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
						{article.content}
					</div>
				</article>

				{/* Seção de comentários */}
				<section className="border-t border-gray-200 pt-8">
					<h2 className="text-2xl font-bold text-foreground mb-6">
						Comentários
					</h2>

					{/* Formulário de comentário (apenas se logado) */}
					{isAuthenticated ? (
						<div className="mb-8">
							<CommentForm
								onSubmit={handleCreateComment}
								isLoading={isSubmittingComment}
								placeholder="Escreva um comentário..."
							/>
						</div>
					) : (
						<div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
							<p className="text-gray-600 mb-4">
								Você precisa estar logado para comentar
							</p>
							<button
								onClick={() => router.push("/login")}
								className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
							>
								Fazer login
							</button>
						</div>
					)}

					{/* Lista de comentários */}
					{commentsLoading ? (
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className="animate-pulse flex gap-3">
									<div className="w-10 h-10 bg-gray-200 rounded-full"></div>
									<div className="flex-1 space-y-2">
										<div className="h-4 bg-gray-200 rounded w-1/4"></div>
										<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									</div>
								</div>
							))}
						</div>
					) : commentsData?.data && commentsData.data.length > 0 ? (
						<div className="space-y-6">
							{commentsData.data.map((comment) => (
								<Comment
									key={comment.id}
									comment={comment}
									onReply={handleReplyComment}
									onDelete={handleDeleteComment}
									isLoading={deleteLoading}
								/>
							))}

							{/* Botão "Ver mais comentários" se houver mais */}
							{commentsData.meta.nextCursor && (
								<div className="text-center pt-4">
									<button className="text-primary hover:underline">
										Ver mais comentários
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-gray-500">
								Seja o primeiro a comentar neste artigo!
							</p>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
