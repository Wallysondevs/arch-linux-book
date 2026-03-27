import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, HardDrive, Shield, Settings,
  FileText, Users, Network, Cpu, Clock, History, PenTool,
  Search, X, Package
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Introdução",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "História do Ubuntu", icon: History },
      { path: "/filosofia", label: "Filosofia Ubuntu", icon: PenTool },
    ]
  },
  {
    title: "Instalação & Setup",
    items: [
      { path: "/instalacao", label: "Guia de Instalação", icon: HardDrive },
      { path: "/primeiros-passos", label: "Primeiros Passos", icon: Clock },
      { path: "/ambiente-grafico", label: "GNOME & Desktop", icon: Settings },
    ]
  },
  {
    title: "Gerenciamento",
    items: [
      { path: "/apt", label: "APT (Completo)", icon: Package },
      { path: "/snap-flatpak", label: "Snap & Flatpak", icon: Package },
      { path: "/systemd", label: "Systemd", icon: Cpu },
    ]
  },
  {
    title: "Sistema de Arquivos",
    items: [
      { path: "/sistema-arquivos", label: "Hierarquia FHS", icon: FileText },
      { path: "/navegacao", label: "Navegação", icon: Search },
      { path: "/manipulacao-arquivos", label: "Manipulação", icon: FileText },
      { path: "/visualizacao", label: "Visualização", icon: FileText },
      { path: "/permissoes", label: "Permissões", icon: Shield },
    ]
  },
  {
    title: "Administração",
    items: [
      { path: "/usuarios", label: "Usuários e Grupos", icon: Users },
      { path: "/processos", label: "Processos", icon: Cpu },
      { path: "/redes", label: "Redes", icon: Network },
      { path: "/ssh", label: "SSH", icon: Terminal },
      { path: "/disco", label: "Discos e Partições", icon: HardDrive },
    ]
  },
  {
    title: "Terminal & Shell",
    items: [
      { path: "/shell-bash", label: "Shell Bash", icon: Terminal },
      { path: "/redirecionamento", label: "Redirecionamento", icon: Terminal },
      { path: "/compressao", label: "Compressão", icon: FileText },
      { path: "/avancado", label: "Comandos Avançados", icon: Terminal },
    ]
  },
  {
    title: "Extras",
    items: [
      { path: "/seguranca", label: "Segurança", icon: Shield },
      { path: "/troubleshooting", label: "Troubleshooting", icon: Settings },
      { path: "/referencias", label: "Referências", icon: BookOpen },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold mt-0 mb-0 pb-0 border-0 leading-tight">Ubuntu</h2>
                <p className="text-xs text-muted-foreground">Guia Completo</p>
              </div>
            </Link>
            <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-8">
            {NAVIGATION.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3 mt-0 border-0 pb-0">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={i}>
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70")} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
