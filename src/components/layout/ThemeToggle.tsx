import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        if (resolvedTheme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    if (!mounted) {
        return (
            <button className="p-2 rounded-full text-gray-400 opacity-50 cursor-default">
                <Sun className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 relative"
            aria-label="Przełącz motyw"
            title={resolvedTheme === 'dark' ? 'Przełącz na jasny' : 'Przełącz na ciemny'}
        >
            {resolvedTheme === "light" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
}
