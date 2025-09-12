import Header from "@/components/Header";
import Button from "@/components/Button";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<Header />

			{/* Main Content */}
			<main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
				<div className="text-center max-w-4xl mx-auto">
					{/* Main Title */}
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
						Insights & Learning
					</h1>

					{/* Subtitle */}
					<p className="text-lg md:text-xl lg:text-2xl text-foreground mb-12 max-w-2xl mx-auto">
						Explorando tendências Tech, um post por vez
					</p>

					{/* CTA Button */}
					<Button size="lg" className="text-lg px-12 py-4">
						Começar a ler
					</Button>
				</div>
			</main>
		</div>
	);
}
