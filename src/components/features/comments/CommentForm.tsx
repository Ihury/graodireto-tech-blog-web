import { useState } from "react";
import { Button } from "../../ui";

interface CommentFormProps {
	onSubmit: (content: string) => Promise<void>;
	isLoading?: boolean;
	placeholder?: string;
}

export default function CommentForm({
	onSubmit,
	isLoading = false,
	placeholder = "Escreva um comentário...",
}: CommentFormProps) {
	const [content, setContent] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;

		try {
			await onSubmit(content.trim());
			setContent("");
		} catch (error) {
			// Error handling é feito no componente pai
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="flex gap-3">
				{/* Avatar do usuário */}
				<div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
					<span className="text-sm font-medium text-gray-600">U</span>
				</div>

				<div className="flex-1">
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder={placeholder}
						rows={4}
						className="w-full px-4 py-3 border-0 rounded-lg bg-input-background placeholder-placeholder-text text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
						disabled={isLoading}
					/>
					<div className="flex justify-end mt-3">
						<Button
							type="submit"
							disabled={!content.trim() || isLoading}
							className="px-6 py-2"
						>
							{isLoading ? "Enviando..." : "Comentar"}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
