import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, HardDrive, Shield, Settings,
  FileText, Users, Network, Cpu, Clock, History, PenTool,
  Search, X, Folder, Lock, Package, Wrench, Code2,
  Eye, KeyRound, Archive, ChevronRight, GitBranch,
  Database, Server, Container, Globe, Languages, Activity,
  Layers, Box, Save, Music, Gamepad2, Key, Zap, Boxes,
  Workflow, Cloud, Edit3, ScrollText, Variable, Monitor,
  Globe2, ShieldAlert, FileCode, Sparkles
} from "lucide-react";

const NAVIGATION = [
  {
    title: "1. Introdução",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "História do Arch", icon: History },
      { path: "/filosofia", label: "Filosofia (KISS)", icon: PenTool },
    ]
  },
  {
    title: "2. Instalação",
    items: [
      { path: "/instalacao", label: "Guia de Instalação", icon: HardDrive },
      { path: "/primeiros-passos", label: "Pós-Instalação", icon: Clock },
      { path: "/ambiente-grafico", label: "Ambiente Gráfico", icon: Settings },
      { path: "/localizacao", label: "Localização (locale, timezone)", icon: Globe2 },
      { path: "/ambientes-alternativos", label: "TTYs, tmux, distrobox", icon: Layers },
    ]
  },
  {
    title: "3. Terminal Básico",
    items: [
      { path: "/navegacao", label: "Navegação", icon: Folder },
      { path: "/visualizacao", label: "Visualização", icon: Eye },
      { path: "/manipulacao-arquivos", label: "Manipulação de Arquivos", icon: FileText },
      { path: "/editores", label: "Editores (nano)", icon: PenTool },
      { path: "/vim", label: "Vim — Tutorial", icon: Edit3 },
      { path: "/man-pages", label: "Man Pages & Docs", icon: ScrollText },
    ]
  },
  {
    title: "4. Sistema de Arquivos",
    items: [
      { path: "/sistema-arquivos", label: "Hierarquia FHS", icon: FileText },
      { path: "/permissoes", label: "Permissões", icon: Lock },
    ]
  },
  {
    title: "5. Pacotes",
    items: [
      { path: "/pacman", label: "Pacman", icon: Package },
      { path: "/aur", label: "AUR & Helpers", icon: Package },
      { path: "/codigo-fonte", label: "Compilar do Fonte", icon: FileCode },
      { path: "/appimage", label: "AppImage", icon: Box },
      { path: "/snap-flatpak", label: "Snap & Flatpak", icon: Boxes },
    ]
  },
  {
    title: "6. Sistema",
    items: [
      { path: "/systemd", label: "Systemd", icon: Cpu },
      { path: "/boot", label: "Boot (GRUB, systemd-boot)", icon: Zap },
      { path: "/kernel", label: "Kernel", icon: Cpu },
      { path: "/journalctl", label: "JournalCtl & Logs", icon: ScrollText },
      { path: "/cron", label: "Cron & Timers", icon: Clock },
      { path: "/processos", label: "Processos", icon: Activity },
      { path: "/usuarios", label: "Usuários e Grupos", icon: Users },
    ]
  },
  {
    title: "7. Shell Avançado",
    items: [
      { path: "/shell-bash", label: "Shell Bash", icon: Terminal },
      { path: "/redirecionamento", label: "Redirecionamento", icon: Terminal },
      { path: "/compressao", label: "Compressão", icon: Archive },
      { path: "/avancado", label: "Comandos Avançados", icon: Wrench },
      { path: "/scripts-bash", label: "Scripts Bash", icon: FileCode },
      { path: "/expansoes-bash", label: "Expansões do Bash", icon: Variable },
      { path: "/variaveis-ambiente", label: "Variáveis de Ambiente", icon: Variable },
      { path: "/aliases", label: "Aliases & Funções", icon: Sparkles },
      { path: "/zsh", label: "Zsh & Oh-My-Zsh", icon: Terminal },
    ]
  },
  {
    title: "8. Hardware",
    items: [
      { path: "/hardware", label: "Inspeção de Hardware", icon: Cpu },
      { path: "/disco", label: "Discos e Partições", icon: HardDrive },
      { path: "/iostat", label: "IOStat & Performance", icon: Activity },
    ]
  },
  {
    title: "9. Storage Avançado",
    items: [
      { path: "/fstab", label: "Fstab & Mount", icon: HardDrive },
      { path: "/particoes", label: "Particionamento", icon: HardDrive },
      { path: "/luks", label: "LUKS — Criptografia", icon: Lock },
      { path: "/lvm", label: "LVM — Logical Volumes", icon: Layers },
      { path: "/backup", label: "Backup (rsync, borg)", icon: Save },
      { path: "/timeshift", label: "Timeshift", icon: History },
    ]
  },
  {
    title: "10. Redes",
    items: [
      { path: "/redes", label: "Redes Básicas", icon: Network },
      { path: "/ssh", label: "SSH", icon: KeyRound },
      { path: "/dns", label: "DNS", icon: Globe },
      { path: "/vpn", label: "VPN (WireGuard)", icon: Shield },
      { path: "/rede-avancada", label: "Rede Avançada (nft, ip)", icon: Network },
    ]
  },
  {
    title: "11. Servidores",
    items: [
      { path: "/apache", label: "Apache HTTPD", icon: Server },
      { path: "/nginx", label: "Nginx", icon: Server },
      { path: "/samba", label: "Samba (SMB/CIFS)", icon: Server },
    ]
  },
  {
    title: "12. Containers & Virt",
    items: [
      { path: "/docker", label: "Docker", icon: Container },
      { path: "/docker-compose", label: "Docker Compose", icon: Container },
      { path: "/kvm", label: "KVM / QEMU", icon: Monitor },
      { path: "/wine", label: "Wine", icon: Monitor },
      { path: "/cloud-init", label: "Cloud-Init", icon: Cloud },
    ]
  },
  {
    title: "13. Bancos de Dados",
    items: [
      { path: "/postgresql", label: "PostgreSQL", icon: Database },
      { path: "/mysql", label: "MySQL / MariaDB", icon: Database },
    ]
  },
  {
    title: "14. Linguagens",
    items: [
      { path: "/python", label: "Python", icon: Languages },
      { path: "/nodejs", label: "Node.js", icon: Languages },
      { path: "/php", label: "PHP", icon: Languages },
      { path: "/java", label: "Java", icon: Languages },
    ]
  },
  {
    title: "15. DevOps",
    items: [
      { path: "/git", label: "Git", icon: GitBranch },
      { path: "/vscode", label: "VS Code", icon: Code2 },
      { path: "/ansible", label: "Ansible", icon: Workflow },
      { path: "/ambiente-dev", label: "Ambiente de Dev", icon: Code2 },
    ]
  },
  {
    title: "16. Multimídia & Desktop",
    items: [
      { path: "/multimedia", label: "Multimídia (PipeWire)", icon: Music },
      { path: "/gaming", label: "Gaming (Steam, Proton)", icon: Gamepad2 },
      { path: "/gnome-extensions", label: "GNOME Extensions", icon: Sparkles },
    ]
  },
  {
    title: "17. Segurança",
    items: [
      { path: "/seguranca", label: "Segurança (geral)", icon: Shield },
      { path: "/apparmor", label: "AppArmor", icon: ShieldAlert },
      { path: "/fail2ban", label: "Fail2Ban", icon: ShieldAlert },
      { path: "/gpg", label: "GPG", icon: Key },
    ]
  },
  {
    title: "18. Extras",
    items: [
      { path: "/troubleshooting", label: "Troubleshooting", icon: Wrench },
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

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 arch-scroll overflow-y-auto",
          "bg-[#080a0e] border-r border-[hsl(220_12%_14%)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Subtle teal glow at the top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1793D1] to-transparent opacity-40" />

        <div className="p-5">
          <div className="flex items-center justify-between lg:justify-start mb-6">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Arch logo - simplified triangle */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-9 h-9">
                  <defs>
                    <linearGradient id="archGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1793D1" />
                      <stop offset="100%" stopColor="#0B6FA8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 10 L88 88 L72 80 L50 70 L28 80 L12 88 Z"
                    fill="url(#archGrad)"
                    stroke="#1793D1"
                    strokeWidth="1.5"
                    className="drop-shadow-[0_0_6px_rgba(23,147,209,0.4)]"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold mt-0 mb-0 pb-0 border-0 leading-tight text-white before:content-none">
                  Arch Linux
                </h2>
                <p className="text-[10px] text-[#7c8497] font-mono uppercase tracking-wider">
                  Manual Definitivo
                </p>
              </div>
            </Link>
            <button
              className="lg:hidden p-2 text-[#7c8497] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mock terminal prompt above nav */}
          <div className="mb-5 px-2.5 py-2 rounded bg-[#0d1117] border border-[hsl(220_12%_14%)] font-mono text-[11px] flex items-center gap-1.5">
            <Search className="w-3 h-3 text-[#5fff87]" />
            <span className="text-[#5fff87]">$</span>
            <span className="text-[#7c8497]">man arch</span>
            <span className="ml-auto text-[10px] text-[#5c6370]">⌘K</span>
          </div>

          <nav className="space-y-5">
            {NAVIGATION.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-bold text-[#1793D1] uppercase tracking-[0.15em] mb-2 px-2 font-mono before:content-none">
                  {section.title}
                </h4>
                <ul className="space-y-0.5">
                  {section.items.map((item, i) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={i}>
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 px-2.5 py-1.5 rounded text-[13px] transition-all duration-150 group relative",
                            isActive
                              ? "bg-[#1793D1]/15 text-[#5fc7ff] font-medium border-l-2 border-[#1793D1] -ml-[2px] pl-[14px]"
                              : "text-[#9aa3b2] hover:bg-white/[0.03] hover:text-white"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110",
                              isActive ? "text-[#1793D1]" : "opacity-60"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto text-[#1793D1]" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-[hsl(220_12%_14%)]">
            <a
              href="https://archlinux.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-[#5c6370] hover:text-[#1793D1] transition-colors font-mono border-0"
            >
              <GitBranch className="w-3 h-3" />
              archlinux.org →
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
