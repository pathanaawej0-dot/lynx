import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Button = forwardRef(({
    className,
    variant = 'filled',
    size = 'default',
    children,
    disabled,
    ...props
}, ref) => {

    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-38 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
        filled: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-elevation-1 rounded-full shadow-sm",
        tonal: "bg-surface-container-high text-on-surface hover:bg-surface-container-high/80 rounded-full",
        outlined: "bg-transparent border border-outline text-primary hover:bg-surface-container-high/10 rounded-full",
        text: "bg-transparent text-primary hover:bg-surface-container-high/10 rounded-full min-w-0 px-4",
        icon: "bg-transparent text-on-surface-variant hover:bg-on-surface-variant/10 rounded-full p-2 aspect-square",
    };

    const sizes = {
        default: "h-10 px-6 text-label-large",
        sm: "h-8 px-4 text-label-large",
        lg: "h-12 px-8 text-title-medium",
        icon: "h-10 w-10",
        'icon-sm': "h-8 w-8 p-1.5",
    };

    return (
        <button
            ref={ref}
            disabled={disabled}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[variant === 'icon' || variant === 'icon-sm' ? (variant === 'icon-sm' ? 'icon-sm' : 'icon') : size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
