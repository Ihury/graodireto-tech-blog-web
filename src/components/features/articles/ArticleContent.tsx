interface ArticleContentProps {
	content: string;
	className?: string;
}

export default function ArticleContent({
	content,
	className = "",
}: ArticleContentProps) {
	return (
		<article className={`prose prose-lg max-w-none mb-12 ${className}`}>
			<div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
				{content}
			</div>
		</article>
	);
}
