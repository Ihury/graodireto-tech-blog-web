import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "../../common/LoadingSpinner";

interface AuthGuardProps {
	children: ReactNode;
	redirectTo?: string;
	fallback?: ReactNode;
}

export default function AuthGuard({
	children,
	redirectTo = "/login",
	fallback,
}: AuthGuardProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, isLoading, router, redirectTo]);

	if (isLoading) {
		return (
			fallback || (
				<div className="min-h-screen bg-background">
					<LoadingSpinner
						size="lg"
						text="Verificando autenticação..."
						className="h-64"
					/>
				</div>
			)
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}
