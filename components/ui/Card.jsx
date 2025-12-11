import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Card = forwardRef(({ className, elevation = 1, hover = false, children, ...props }, ref) => {
    const elevations = {
        0: "bg-surface border border-outline-variant",
        1: "bg-surface-container-low shadow-elevation-1",
        2: "bg-surface-container shadow-elevation-2",
        3: "bg-surface-container-high shadow-elevation-3",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-md overflow-hidden transition-all duration-200",
                elevations[elevation],
                hover && "hover:shadow-elevation-2 hover:-translate-y-0.5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = "Card";

export { Card };
