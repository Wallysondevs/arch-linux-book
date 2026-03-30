import { Menu, Moon, Sun, Terminal } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">Arch Linux</span>
        </Link>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-xs text-muted-foreground w-56">
          <span>🔍 Pesquisar conteúdo...</span>
          <span className="ml-auto opacity-50 border border-border rounded px-1 py-0.5 text-[10px]">Ctrl+K</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          60+ Tópicos
        </span>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Alternar tema"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
