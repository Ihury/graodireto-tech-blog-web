// ===== PAGINATION TYPES =====
export interface BasePaginatedResult<T> {
	data: T[];
}

export interface OffsetPaginationMeta {
	page: number;
	size: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface OffsetPaginatedResult<T> extends BasePaginatedResult<T> {
	meta: OffsetPaginationMeta;
}

export interface OffsetPaginationOptions {
	page: number;
	size: number;
}

export interface CursorPaginationMeta {
	size: number;
	nextCursor?: string;
}

export interface CursorPaginatedResult<T> extends BasePaginatedResult<T> {
	meta: CursorPaginationMeta;
}

export interface CursorPaginationOptions {
	size: number;
	after?: string;
}

// ===== AUTH TYPES =====
export interface LoginDto {
	email: string;
	password: string;
}

export interface UserResponseDto {
	id: string;
	email: string;
	displayName: string;
	avatarUrl?: string;
}

export interface LoginResponseDto {
	access_token: string;
	user: UserResponseDto;
}

export interface ValidateTokenResponseDto {
	valid: boolean;
	user: UserResponseDto;
}

// ===== ARTICLE TYPES =====
export interface ArticleTagDto {
	slug: string;
	name: string;
}

export interface ArticleListItemResponseDto {
	id: string;
	authorId: string;
	title: string;
	slug: string;
	summary?: string;
	coverImageUrl?: string;
	tags: ArticleTagDto[];
	createdAt: string;
	updatedAt: string;
}

export type ListArticlesResponseDto = OffsetPaginatedResult<ArticleListItemResponseDto>;

export interface ArticleResponseDto {
	id: string;
	author: UserResponseDto;
	title: string;
	slug: string;
	summary?: string;
	content: string;
	coverImageUrl?: string;
	tags: ArticleTagDto[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateArticleDto {
	title: string;
	content: string;
	coverImageUrl?: string;
	tags?: string[];
}

export interface UpdateArticleDto {
	title?: string;
	content?: string;
	coverImageUrl?: string;
	tags?: string[];
}

export interface DeleteArticleResponseDto {
	success: boolean;
	message: string;
}

// ===== COMMENT TYPES =====
export interface CommentResponseDto {
	id: string;
	articleId: string;
	parentId?: string;
	author: UserResponseDto;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export type CommentRepliesDto = CursorPaginatedResult<CommentResponseDto>;

export interface CommentWithRepliesResponseDto {
	id: string;
	articleId: string;
	parentId?: string;
	author: UserResponseDto;
	content: string;
	createdAt: string;
	updatedAt: string;
	replies: CommentRepliesDto;
}

export type ListCommentsResponseDto = CursorPaginatedResult<CommentWithRepliesResponseDto>;

export type ListRepliesResponseDto = CursorPaginatedResult<CommentResponseDto>;

export interface CreateCommentDto {
	content: string;
	parentId?: string;
}

export interface DeleteCommentResponseDto {
	success: boolean;
	message: string;
}

// ===== API RESPONSE TYPES =====
export interface ApiError {
	message: string;
	statusCode: number;
	error?: string;
}

export interface ApiResponse<T> {
	data?: T;
	error?: ApiError;
}

// ===== QUERY PARAMETERS =====
export interface ListArticlesParams extends Partial<OffsetPaginationOptions> {
	search?: string;
	tags?: string[];
}

export interface ListCommentsParams extends CursorPaginationOptions {}

export interface ListRepliesParams extends CursorPaginationOptions {}
