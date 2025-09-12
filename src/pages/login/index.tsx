import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading } = useAuth();
	const { showError, showSuccess } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await login({ email, password });
			showSuccess("Login realizado com sucesso!");
			router.push("/artigos");
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao fazer login";
			showError(errorMessage);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<Header showAuthButton={false} onBackClick={() => router.back()} />

			{/* Main Content */}
			<main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
				<div className="w-full max-w-md">
					{/* Title */}
					<h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
						Bem-vindo de volta
					</h1>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<Input
							label="Email"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
						/>

						<Input
							label="Senha"
							type="password"
							placeholder="Senha"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
						/>

						<Button type="submit" fullWidth size="lg" disabled={isLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
