"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import { UserResponseDto, LoginDto } from "@/types/techBlogApi";
import { AuthService } from "@/services/auth.service";

interface AuthContextType {
	user: UserResponseDto | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginDto) => Promise<void>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserResponseDto | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticated = !!user;

	// Carregar dados do usuário do localStorage na inicialização
	useEffect(() => {
		const loadUser = async () => {
			try {
				setIsLoading(true);

				// Verificar se há token no localStorage
				if (AuthService.isAuthenticated()) {
					const storedUser = AuthService.getCurrentUser();

					if (storedUser) {
						setUser(storedUser);

						// Validar token no servidor
						try {
							const validation = await AuthService.validateToken();
							if (validation.valid) {
								setUser(validation.user);
							} else {
								// Token inválido, fazer logout
								AuthService.logout();
								setUser(null);
							}
						} catch (error) {
							// Erro na validação, fazer logout
							AuthService.logout();
							setUser(null);
						}
					}
				}
			} catch (error) {
				console.error("Erro ao carregar usuário:", error);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadUser();
	}, []);

	const login = async (credentials: LoginDto) => {
		try {
			setIsLoading(true);
			const response = await AuthService.login(credentials);
			setUser(response.user);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		AuthService.logout();
		setUser(null);
	};

	const refreshUser = async () => {
		try {
			if (AuthService.isAuthenticated()) {
				const validation = await AuthService.validateToken();
				if (validation.valid) {
					setUser(validation.user);
				} else {
					logout();
				}
			}
		} catch (error) {
			console.error("Erro ao atualizar usuário:", error);
			logout();
		}
	};

	const value: AuthContextType = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
		refreshUser,
	};

	// Mostrar loading durante a inicialização
	if (isLoading) {
		return null;
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
