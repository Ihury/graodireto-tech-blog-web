import { useRouter } from "next/router";
import { PageLayout, Container } from "@/components/layout";
import { LoginForm } from "@/components/features/auth";

export default function LoginPage() {
	const router = useRouter();

	return (
		<PageLayout showAuthButton={false}>
			<main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
				<Container size="sm">
					<div className="w-full max-w-md mx-auto">
						<h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
							Bem-vindo de volta
						</h1>
						<LoginForm />
					</div>
				</Container>
			</main>
		</PageLayout>
	);
}
