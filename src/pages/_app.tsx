import { AppProps } from "next/app";
import { Newsreader } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import "../app/globals.css";

const newsreader = Newsreader({
	variable: "--font-newsreader",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={`${newsreader.variable} antialiased`}>
			<ToastProvider>
				<AuthProvider>
					<Component {...pageProps} />
				</AuthProvider>
			</ToastProvider>
		</div>
	);
}
