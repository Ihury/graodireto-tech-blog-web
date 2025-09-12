import { useState, useEffect } from "react";
import { TagDto } from "@/types/techBlogApi";
import { useTags } from "@/hooks/useTags";
import { Input, Button } from "../../ui";
import { PageHeader } from "../../layout";

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
	showBackButton?: boolean;
	onBack?: () => void;
}

export default function ArticleForm({
	onSubmit,
	isLoading = false,
	initialData,
	mode = "create",
	showBackButton = false,
	onBack,
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
		<div>
			<PageHeader
				title={mode === "create" ? "Novo artigo" : "Editar artigo"}
				showBackButton={showBackButton}
				onBack={onBack}
				action={
					<Button
						type="submit"
						disabled={isLoading}
						className="px-8 py-3 text-lg font-semibold"
						onClick={handleSubmit}
					>
						{isLoading
							? mode === "create"
								? "Criando..."
								: "Salvando..."
							: mode === "create"
							? "Criar artigo"
							: "Salvar"}
					</Button>
				}
			/>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Título */}
				<div>
					<label className="block text-lg font-semibold text-foreground mb-3">
						Título do artigo *
					</label>
					<Input
						type="text"
						placeholder="Título"
						value={formData.title}
						onChange={(e) => handleInputChange("title", e.target.value)}
						className={`w-full px-4 py-3 text-lg bg-input-background border-0 rounded-lg placeholder-placeholder-text text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
							errors.title ? "ring-2 ring-red-500" : ""
						}`}
					/>
					{errors.title && (
						<p className="mt-2 text-sm text-red-600">{errors.title}</p>
					)}
				</div>

				{/* Imagem */}
				<div>
					<label className="block text-lg font-semibold text-foreground mb-3">
						Imagem do artigo
					</label>
					<Input
						type="url"
						placeholder="URL da imagem"
						value={formData.coverImageUrl}
						onChange={(e) => handleInputChange("coverImageUrl", e.target.value)}
						className="w-full px-4 py-3 text-lg bg-input-background border-0 rounded-lg placeholder-placeholder-text text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
					/>
				</div>

				{/* Tags */}
				<div>
					<label className="block text-lg font-semibold text-foreground mb-3">
						Tags *
					</label>
					<div className="flex flex-wrap gap-3">
						{tags?.map((tag: TagDto) => (
							<button
								key={tag.slug}
								type="button"
								onClick={() => handleTagToggle(tag.slug)}
								className={`
								px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
								${
									formData.tags.includes(tag.slug)
										? "bg-primary/[20%] text-primary"
										: "bg-input-background text-foreground hover:bg-primary/[20%] hover:text-primary"
								}
							`}
							>
								{tag.name}
							</button>
						))}
					</div>
					{errors.tags && (
						<p className="mt-2 text-sm text-red-600">{errors.tags}</p>
					)}
				</div>

				{/* Conteúdo */}
				<div>
					<label className="block text-lg font-semibold text-foreground mb-3">
						Conteúdo *
					</label>
					<textarea
						placeholder="Escreva aqui seu artigo..."
						value={formData.content}
						onChange={(e) => handleInputChange("content", e.target.value)}
						rows={12}
						className={`w-full px-4 py-3 text-lg bg-input-background border-0 rounded-lg placeholder-placeholder-text text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 resize-none ${
							errors.content ? "ring-2 ring-red-500" : ""
						}`}
					/>
					{errors.content && (
						<p className="mt-2 text-sm text-red-600">{errors.content}</p>
					)}
				</div>
			</form>
		</div>
	);
}
