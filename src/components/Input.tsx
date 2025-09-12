import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className = "", ...props }, ref) => {
		return (
			<div className="w-full">
				{label && (
					<label className="block text-sm font-medium text-foreground mb-2">
						{label}
					</label>
				)}
				<input
					ref={ref}
					className={`
            w-full px-4 py-3 rounded-lg border-0 
            bg-input-background text-foreground 
            placeholder-placeholder-text
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            transition-colors
            ${error ? "ring-2 ring-red-500" : ""}
            ${className}
          `}
					{...props}
				/>
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
			</div>
		);
	}
);

Input.displayName = "Input";

export default Input;
