/**
 * Utilitários para formatação de datas
 */

/**
 * Formatar data para exibição em português brasileiro
 * Exemplo: "15/01/2025" ou "15 de janeiro de 2025"
 */
export function formatDate(
	dateString: string,
	format: "short" | "long" = "short"
): string {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		return "Data inválida";
	}

	if (format === "short") {
		return date.toLocaleDateString("pt-BR");
	}

	return date.toLocaleDateString("pt-BR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Formatar data relativa (há X dias, há X horas, etc.)
 */
export function formatRelativeDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();

	if (isNaN(date.getTime())) {
		return "Data inválida";
	}

	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes < 1) {
		return "Agora mesmo";
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes}m`;
	} else if (diffInHours < 24) {
		return `${diffInHours}h`;
	} else if (diffInDays < 7) {
		return `${diffInDays}d`;
	} else {
		return formatDate(dateString, "short");
	}
}

/**
 * Formatar data para comentários (formato mais legível)
 */
export function formatCommentDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();

	if (isNaN(date.getTime())) {
		return "Data inválida";
	}

	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes < 1) {
		return "Agora mesmo";
	} else if (diffInMinutes < 60) {
		return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
	} else if (diffInHours < 24) {
		return `há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
	} else if (diffInDays < 7) {
		return `há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
	} else {
		return formatDate(dateString, "long");
	}
}
