import { useState, useEffect } from "react";
import { TrashIcon, ArrowBendUpLeftIcon } from "@phosphor-icons/react";
import {
	CommentWithRepliesResponseDto,
	CommentResponseDto,
} from "@/types/techBlogApi";
import { formatCommentDate } from "@/utils/dateUtils";
import { useAuth } from "@/contexts/AuthContext";
import { CommentsService } from "@/services/comments.service";

interface CommentProps {
	comment: CommentWithRepliesResponseDto;
	onReply?: (parentId: string, content: string) => Promise<void>;
	onDelete?: (commentId: string) => Promise<void>;
	isLoading?: boolean;
}

export default function Comment({
	comment,
	onReply,
	onDelete,
	isLoading = false,
}: CommentProps) {
	const { user } = useAuth();
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [isSubmittingReply, setIsSubmittingReply] = useState(false);
	const [allReplies, setAllReplies] = useState<CommentResponseDto[]>(
		comment.replies.data
	);
	const [nextCursor, setNextCursor] = useState<string | undefined>(
		comment.replies.meta.nextCursor
	);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Resetar respostas quando o comentário mudar
	useEffect(() => {
		setAllReplies(comment.replies.data);
		setNextCursor(comment.replies.meta.nextCursor);
		setIsLoadingMore(false);
	}, [comment.replies.data, comment.replies.meta.nextCursor]);

	const isAuthor = user?.id === comment.author.id;
	const canDelete = isAuthor; // Ou adicionar lógica de admin

	const handleReplySubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!replyContent.trim() || !onReply) return;

		setIsSubmittingReply(true);
		try {
			await onReply(comment.id, replyContent.trim());
			setReplyContent("");
			setShowReplyForm(false);
		} catch (error) {
			// Error handling já é feito no componente pai
		} finally {
			setIsSubmittingReply(false);
		}
	};

	const handleDelete = async () => {
		if (
			!onDelete ||
			!window.confirm("Tem certeza que deseja excluir este comentário?")
		)
			return;

		try {
			await onDelete(comment.id);
		} catch (error) {
			// Error handling já é feito no componente pai
		}
	};

	const handleLoadMoreReplies = async () => {
		if (!nextCursor) return;

		setIsLoadingMore(true);
		try {
			const moreReplies = await CommentsService.listReplies(comment.id, {
				size: 10,
				after: nextCursor,
			});

			// Adicionar as novas respostas à lista existente
			setAllReplies((prev) => [...prev, ...moreReplies.data]);

			// Atualizar o cursor para a próxima página
			setNextCursor(moreReplies.meta.nextCursor);
		} catch (error) {
			console.error("Erro ao carregar mais respostas:", error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	return (
		<div className="space-y-4">
			{/* Comentário principal */}
			<div className="flex gap-3">
				{/* Avatar */}
				<div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
					{comment.author.avatarUrl ? (
						<img
							src={comment.author.avatarUrl}
							alt={comment.author.displayName}
							className="w-full h-full rounded-full object-cover"
						/>
					) : (
						<span className="text-sm font-medium text-gray-600">
							{comment.author.displayName.charAt(0).toUpperCase()}
						</span>
					)}
				</div>

				{/* Conteúdo do comentário */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-medium text-foreground">
							{comment.author.displayName}
						</span>
						<span className="text-sm text-gray-500">
							{formatCommentDate(comment.createdAt)}
						</span>
						{canDelete && (
							<button
								onClick={handleDelete}
								className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
								title="Excluir comentário"
								disabled={isLoading}
							>
								<TrashIcon size={16} />
							</button>
						)}
					</div>

					<p className="text-gray-700 mb-2 whitespace-pre-wrap">
						{comment.content}
					</p>

					{/* Botão de resposta */}
					{user && (
						<button
							onClick={() => setShowReplyForm(!showReplyForm)}
							className="p-1 text-gray-500 hover:text-primary transition-colors"
							disabled={isLoading}
							title="Responder"
						>
							<ArrowBendUpLeftIcon size={16} weight="regular" />
						</button>
					)}

					{/* Formulário de resposta */}
					{showReplyForm && (
						<form onSubmit={handleReplySubmit} className="mt-3 space-y-3">
							<textarea
								value={replyContent}
								onChange={(e) => setReplyContent(e.target.value)}
								placeholder="Escreva uma resposta..."
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-input-background placeholder-placeholder-text text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
								disabled={isSubmittingReply}
							/>
							<div className="flex gap-2">
								<button
									type="submit"
									disabled={!replyContent.trim() || isSubmittingReply}
									className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isSubmittingReply ? "Enviando..." : "Responder"}
								</button>
								<button
									type="button"
									onClick={() => {
										setShowReplyForm(false);
										setReplyContent("");
									}}
									className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
									disabled={isSubmittingReply}
								>
									Cancelar
								</button>
							</div>
						</form>
					)}
				</div>
			</div>

			{/* Respostas */}
			{allReplies.length > 0 && (
				<div className="ml-13 space-y-4">
					{allReplies.map((reply) => (
						<div key={reply.id} className="flex gap-3">
							{/* Avatar da resposta */}
							<div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
								{reply.author.avatarUrl ? (
									<img
										src={reply.author.avatarUrl}
										alt={reply.author.displayName}
										className="w-full h-full rounded-full object-cover"
									/>
								) : (
									<span className="text-xs font-medium text-gray-600">
										{reply.author.displayName.charAt(0).toUpperCase()}
									</span>
								)}
							</div>

							{/* Conteúdo da resposta */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span className="font-medium text-foreground text-sm">
										{reply.author.displayName}
									</span>
									<span className="text-xs text-gray-500">
										{formatCommentDate(reply.createdAt)}
									</span>
									{user?.id === reply.author.id && (
										<button
											onClick={() => onDelete?.(reply.id)}
											className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
											title="Excluir resposta"
											disabled={isLoading}
										>
											<TrashIcon size={14} />
										</button>
									)}
								</div>

								<p className="text-gray-700 text-sm whitespace-pre-wrap">
									{reply.content}
								</p>
							</div>
						</div>
					))}

					{/* Botão "Ver mais comentários" se houver mais */}
					{nextCursor && (
						<button
							onClick={handleLoadMoreReplies}
							disabled={isLoadingMore}
							className="ml-11 text-sm text-primary hover:underline disabled:opacity-50"
						>
							{isLoadingMore ? "Carregando..." : "Ver mais comentários"}
						</button>
					)}
				</div>
			)}
		</div>
	);
}
