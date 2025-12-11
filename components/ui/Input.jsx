import { forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = forwardRef(({ className, type, label, error, icon: Icon, rightIcon: RightIcon, ...props }, ref) => {
    return (
        <div className="relative w-full group">
            <input
                type={type}
                className={cn(
                    "peer flex h-14 w-full rounded-xs border border-outline bg-surface-container px-4 py-2 text-body-large text-on-surface ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all pt-5",
                    Icon && "pl-11",
                    RightIcon && "pr-11",
                    error && "border-error focus-visible:ring-error",
                    className
                )}
                placeholder={label}
                ref={ref}
                {...props}
            />
            {label && (
                <label className={cn(
                    "absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-body-medium text-on-surface-variant duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary",
                    Icon && "left-11"
                )}>
                    {label}
                </label>
            )}
            {Icon && (
                <div className="absolute left-3 top-4 text-on-surface-variant peer-focus:text-primary transition-colors">
                    <Icon size={24} />
                </div>
            )}
            {RightIcon && (
                <div className="absolute right-3 top-4 text-on-surface-variant">
                    <RightIcon size={24} />
                </div>
            )}
            {error && (
                <p className="mt-1 text-body-medium text-error px-4">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export { Input };
