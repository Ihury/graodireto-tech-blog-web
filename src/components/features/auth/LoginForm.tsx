import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

interface LoginFormProps {
	onSuccess?: () => void;
	redirectTo?: string;
}

export default function LoginForm({
	onSuccess,
	redirectTo = "/artigos",
}: LoginFormProps) {
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

			if (onSuccess) {
				onSuccess();
			} else {
				router.push(redirectTo);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro ao fazer login";
			showError(errorMessage);
		}
	};

	return (
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
	);
}
