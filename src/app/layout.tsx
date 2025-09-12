import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
	variable: "--font-newsreader",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "Tech Blog - Grão Direto",
	description: "Blog de tecnologia da Grão Direto",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className={`${newsreader.variable} antialiased`}>{children}</body>
		</html>
	);
}
