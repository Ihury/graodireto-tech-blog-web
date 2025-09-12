import Link from "next/link";
import { useRouter } from "next/router";
import { SignOutIcon } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
	showAuthButton?: boolean;
	onBackClick?: () => void;
}

export default function Header({
	showAuthButton = true,
	onBackClick,
}: HeaderProps) {
	const router = useRouter();
	const { isAuthenticated, logout, user } = useAuth();

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<header className="w-full bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link
							href="/"
							className="text-2xl font-bold text-foreground"
						>
							TechBlog
						</Link>
					</div>

					{/* Auth Button */}
					{showAuthButton && (
						<div className="flex items-center gap-4">
							{isAuthenticated ? (
								<button
									onClick={handleLogout}
									className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
									title="Logout"
								>
									<SignOutIcon size={20} weight="regular" />
								</button>
							) : (
								<Link
									href="/login"
									className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
								>
									Entrar
								</Link>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
