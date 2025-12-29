import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "~/lib/utils";

function PasswordInput({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='relative'>
      <input
        type={showPassword ? "text" : "password"}
        data-slot='input'
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-12 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:ring-0",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
      >
        {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
      </button>
    </div>
  );
}

export { PasswordInput };
