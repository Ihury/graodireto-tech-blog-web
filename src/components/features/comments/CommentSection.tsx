import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CommentWithRepliesResponseDto } from "@/types/techBlogApi";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
	useCommentsByArticle,
	useCreateComment,
	useDeleteComment,
} from "@/hooks/useComments";
import { Comment, CommentForm } from ".";
import { LoadingSpinner, EmptyState } from "../../common";
import { Button } from "../../ui";

interface CommentSectionProps {
	articleId: string;
	className?: string;
}

export default function CommentSection({
	articleId,
	className = "",
}: CommentSectionProps) {
	const router = useRouter();
	const { user, isAuthenticated } = useAuth();
	const { showSuccess, showError } = useToast();

	// Hooks para comentários
	const {
		data: commentsData,
		isLoading: commentsLoading,
		error: commentsError,
		refetch: refetchComments,
	} = useCommentsByArticle({
		articleId,
		initialSize: 10,
	});

	const { createComment } = useCreateComment();
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
		if (!isAuthenticated) return;

		setIsSubmittingComment(true);
		try {
			await createComment(articleId, { content });
			showSuccess("Comentário adicionado com sucesso!");
			refetchComments();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao adicionar comentário";
			showError(errorMessage);
			throw err;
		} finally {
			setIsSubmittingComment(false);
		}
	};

	const handleReplyComment = async (parentId: string, content: string) => {
		if (!isAuthenticated) return;

		try {
			await createComment(articleId, { content, parentId });
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

	return (
		<section className={`border-t border-gray-200 pt-8 ${className}`}>
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
					<Button onClick={() => router.push("/login")}>Fazer login</Button>
				</div>
			)}

			{/* Lista de comentários */}
			{commentsLoading ? (
				<LoadingSpinner text="Carregando comentários..." className="py-8" />
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
				<EmptyState description="Seja o primeiro a comentar neste artigo!" />
			)}
		</section>
	);
}
