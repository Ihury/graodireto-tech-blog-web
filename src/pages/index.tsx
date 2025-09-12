import { useRouter } from "next/router";
import { PageLayout, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	const handleStartReading = () => {
		if (isAuthenticated) {
			router.push("/artigos");
		} else {
			router.push("/login");
		}
	};

	return (
		<PageLayout>
			<main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
				<Container size="lg">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
							Insights & Learning
						</h1>

						<p className="text-lg md:text-xl lg:text-2xl text-foreground mb-12 max-w-2xl mx-auto">
							Explorando tendências Tech, um post por vez
						</p>

						<Button
							size="lg"
							className="text-lg px-12 py-4"
							onClick={handleStartReading}
						>
							Começar a ler
						</Button>
					</div>
				</Container>
			</main>
		</PageLayout>
	);
}
