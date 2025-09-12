import { NotePencilIcon } from "@phosphor-icons/react";
import { ArticleListItemResponseDto } from "@/types/techBlogApi";
import { Tag } from "@/components/ui";

interface ArticleCardProps {
	article: ArticleListItemResponseDto;
	showEditButton?: boolean;
	onEdit?: (article: ArticleListItemResponseDto) => void;
	currentUserId?: string;
}

export default function ArticleCard({
	article,
	showEditButton = false,
	onEdit,
	currentUserId,
}: ArticleCardProps) {
	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation(); // Impede que o clique no botão acione o clique do card
		onEdit?.(article);
	};

	// Verificar se o usuário atual é o autor do artigo
	const isAuthor = currentUserId && article.authorId === currentUserId;
	const shouldShowEditButton = showEditButton && isAuthor;

	return (
		<div className="flex items-start gap-4 p-4 bg-white rounded-lg">
			{/* Thumbnail */}
			<div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center relative">
				{article.coverImageUrl ? (
					<img
						src={article.coverImageUrl}
						alt={article.title}
						className="w-full h-full object-cover rounded-lg"
					/>
				) : (
					<div className="w-8 h-8 bg-gray-300 rounded"></div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				{/* Title and Tags - Mobile: tags como parte do título, Desktop: apenas título */}
				<div className="mb-2">
					<h3 className="text-lg font-semibold text-foreground">
						{article.title}
						{/* Tags - Mobile: como parte do título, com quebra de linha */}
						<span className="sm:hidden">
							{article.tags.map((tag) => (
								<Tag
									key={tag.slug}
									name={tag.name}
									slug={tag.slug}
									variant="small"
									className="ml-2 inline-block"
								/>
							))}
						</span>
					</h3>
				</div>

				{/* Summary */}
				<p className="text-sm text-gray-600 mb-3 line-clamp-2">
					{article.summary || "Sem descrição disponível"}
				</p>

				{/* Tags - Desktop: abaixo do sumário */}
				<div className="hidden sm:flex items-center gap-2 flex-wrap">
					{article.tags.map((tag) => (
						<Tag
							key={tag.slug}
							name={tag.name}
							slug={tag.slug}
							variant="default"
						/>
					))}
				</div>
			</div>

			{/* Edit Button */}
			{shouldShowEditButton && (
				<button
					onClick={handleEdit}
					className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
					title="Editar artigo"
				>
					<NotePencilIcon size={16} weight="regular" />
				</button>
			)}
		</div>
	);
}
