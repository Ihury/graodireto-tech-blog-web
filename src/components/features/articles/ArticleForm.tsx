import { useState, useEffect } from "react";
import { TagDto } from "@/types/techBlogApi";
import { useTags } from "@/hooks/useTags";
import { Input, Button } from "../../ui";

interface ArticleFormProps {
	onSubmit: (data: {
		title: string;
		content: string;
		coverImageUrl?: string;
		tags: string[];
	}) => void;
	isLoading?: boolean;
	initialData?: {
		title?: string;
		content?: string;
		coverImageUrl?: string;
		tags?: string[];
	};
	mode?: "create" | "edit";
}

export default function ArticleForm({
	onSubmit,
	isLoading = false,
	initialData,
	mode = "create",
}: ArticleFormProps) {
	const { tags } = useTags();
	const [formData, setFormData] = useState({
		title: initialData?.title || "",
		content: initialData?.content || "",
		coverImageUrl: initialData?.coverImageUrl || "",
		tags: initialData?.tags || [],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isInitialized, setIsInitialized] = useState(false);

	// Atualizar formData apenas na primeira vez que initialData estiver disponível
	useEffect(() => {
		if (initialData && !isInitialized) {
			setFormData({
				title: initialData.title || "",
				content: initialData.content || "",
				coverImageUrl: initialData.coverImageUrl || "",
				tags: initialData.tags || [],
			});
			setIsInitialized(true);
		}
	}, [initialData, isInitialized]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Limpar erro do campo quando usuário começar a digitar
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handleTagToggle = (tagSlug: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.includes(tagSlug)
				? prev.tags.filter((t) => t !== tagSlug)
				: [...prev.tags, tagSlug],
		}));
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = "Título é obrigatório";
		}

		if (!formData.content.trim()) {
			newErrors.content = "Conteúdo é obrigatório";
		}

		if (formData.tags.length === 0) {
			newErrors.tags = "Selecione pelo menos uma tag";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			// Limpar erros antes de submeter
			setErrors({});
			onSubmit({
				title: formData.title.trim(),
				content: formData.content.trim(),
				coverImageUrl: formData.coverImageUrl.trim() || undefined,
				tags: formData.tags,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Título */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Título do artigo *
				</label>
				<Input
					type="text"
					placeholder="Título"
					value={formData.title}
					onChange={(e) => handleInputChange("title", e.target.value)}
					className={errors.title ? "border-red-500" : ""}
				/>
				{errors.title && (
					<p className="mt-1 text-sm text-red-600">{errors.title}</p>
				)}
			</div>

			{/* Imagem */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Imagem do artigo
				</label>
				<Input
					type="url"
					placeholder="URL da imagem"
					value={formData.coverImageUrl}
					onChange={(e) => handleInputChange("coverImageUrl", e.target.value)}
				/>
			</div>

			{/* Tags */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Tags *
				</label>
				<div className="flex flex-wrap gap-2">
					{tags?.map((tag: TagDto) => (
						<button
							key={tag.slug}
							type="button"
							onClick={() => handleTagToggle(tag.slug)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								formData.tags.includes(tag.slug)
									? "bg-primary text-white"
									: "bg-input-background text-gray-700 hover:bg-gray-200"
							}`}
						>
							{tag.name}
						</button>
					))}
				</div>
				{errors.tags && (
					<p className="mt-1 text-sm text-red-600">{errors.tags}</p>
				)}
			</div>

			{/* Conteúdo */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Conteúdo *
				</label>
				<textarea
					placeholder="Escreva aqui seu artigo..."
					value={formData.content}
					onChange={(e) => handleInputChange("content", e.target.value)}
					rows={12}
					className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-input-background placeholder-placeholder-text text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
						errors.content ? "border-red-500" : ""
					}`}
				/>
				{errors.content && (
					<p className="mt-1 text-sm text-red-600">{errors.content}</p>
				)}
			</div>

			{/* Botão de Submit */}
			<div className="flex justify-end">
				<Button type="submit" disabled={isLoading} className="px-8 py-3">
					{isLoading
						? mode === "create"
							? "Criando..."
							: "Salvando..."
						: mode === "create"
						? "Criar artigo"
						: "Salvar"}
				</Button>
			</div>
		</form>
	);
}
