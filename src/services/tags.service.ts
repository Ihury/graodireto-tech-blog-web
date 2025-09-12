import { apiClient, handleApiError } from "@/lib/techBlogApi";
import { ListTagsResponseDto } from "@/types/techBlogApi";

export class TagsService {
	/**
	 * Listar todas as tags disponíveis
	 * Rota pública - não requer autenticação
	 */
	static async listTags(): Promise<ListTagsResponseDto> {
		const response = await apiClient.get<ListTagsResponseDto>("/tags");

		if (response.error) {
			throw new Error(handleApiError(response.error));
		}

		if (!response.data) {
			throw new Error("Resposta inválida do servidor");
		}

		return response.data;
	}
}
