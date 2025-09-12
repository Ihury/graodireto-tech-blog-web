import { useState } from "react";
import Button from "@/components/Button";

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
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder={placeholder}
				rows={4}
				className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-input-background placeholder-placeholder-text text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
				disabled={isLoading}
			/>
			<div className="flex justify-end">
				<Button
					type="submit"
					disabled={!content.trim() || isLoading}
					className="px-6 py-2"
				>
					{isLoading ? "Enviando..." : "Comentar"}
				</Button>
			</div>
		</form>
	);
}
