import { Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, HardDrive, Shield, Settings,
  FileText, Users, Network, Cpu, Clock, History, PenTool,
  Search, X, Gamepad2, Code2, Lock, Zap, Box, Wifi,
  Volume2, Monitor, Package, ArchiveX, Layers, Database,
  Timer, GitBranch, Container, Server, Wrench, Radio,
  Globe, Plug, Type, Battery, Cog, Gauge, Hammer,
  Anchor, ShieldCheck, KeyRound, Wine as WineIcon, FolderSync,
  HardDriveDownload, Printer, Boxes, Sparkles, Download,
  PackageOpen, Coffee
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Introdução",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "História", icon: History },
      { path: "/filosofia", label: "Filosofia Arch", icon: PenTool },
    ]
  },
  {
    title: "Instalação & Setup",
    items: [
      { path: "/instalacao", label: "Guia de Instalação", icon: HardDrive },
      { path: "/archinstall", label: "archinstall (Guiado)", icon: Download },
      { path: "/primeiros-passos", label: "Primeiros Passos", icon: Clock },
      { path: "/mirrors", label: "Mirrors & Reflector", icon: Globe },
      { path: "/locale", label: "Locale & Timezone", icon: Settings },
      { path: "/fstab", label: "fstab & Montagem", icon: FileText },
      { path: "/swap-zram", label: "Swap & Zram", icon: Database },
      { path: "/ambiente-grafico", label: "Ambiente Gráfico", icon: Monitor },
      { path: "/display-managers", label: "Display Managers", icon: Settings },
      { path: "/dotfiles", label: "Dotfiles & Config", icon: FileText },
    ]
  },
  {
    title: "Kernel & Boot",
    items: [
      { path: "/kernel", label: "Kernel Linux", icon: Cpu },
      { path: "/boot-process", label: "Processo de Boot", icon: Zap },
      { path: "/bootloaders", label: "GRUB & systemd-boot", icon: HardDrive },
      { path: "/modulos-kernel", label: "Módulos do Kernel", icon: Box },
      { path: "/initramfs", label: "initramfs & mkinitcpio", icon: Layers },
      { path: "/plymouth", label: "Plymouth (Boot Screen)", icon: Sparkles },
    ]
  },
  {
    title: "Gerenciamento de Pacotes",
    items: [
      { path: "/pacman", label: "Pacman (Completo)", icon: Terminal },
      { path: "/pacman-hooks", label: "Pacman Hooks", icon: Anchor },
      { path: "/aur", label: "AUR & Helpers", icon: Users },
      { path: "/makepkg", label: "makepkg & PKGBUILD", icon: Hammer },
      { path: "/instalacao-software", label: "Instalação de Software", icon: PackageOpen },
      { path: "/flatpak", label: "Flatpak", icon: Package },
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
      { path: "/disco", label: "Discos e Partições", icon: HardDrive },
      { path: "/lvm", label: "LVM & RAID", icon: Layers },
      { path: "/btrfs", label: "Btrfs Avançado", icon: Database },
      { path: "/zfs", label: "ZFS", icon: HardDriveDownload },
      { path: "/udev", label: "udev (Dispositivos)", icon: Plug },
      { path: "/sysctl", label: "sysctl (Kernel Params)", icon: Cog },
      { path: "/polkit", label: "Polkit (Privilégios)", icon: KeyRound },
      { path: "/logs", label: "Logs do Sistema", icon: FileText },
    ]
  },
  {
    title: "Terminal & Shell",
    items: [
      { path: "/shell-bash", label: "Shell Bash", icon: Terminal },
      { path: "/redirecionamento", label: "Redirecionamento", icon: Terminal },
      { path: "/compressao", label: "Compressão", icon: ArchiveX },
      { path: "/avancado", label: "Comandos Avançados", icon: Terminal },
      { path: "/tmux", label: "tmux & Multiplexadores", icon: Layers },
      { path: "/vim-neovim", label: "Vim & Neovim", icon: Code2 },
    ]
  },
  {
    title: "Rede & Conectividade",
    items: [
      { path: "/redes", label: "Redes", icon: Network },
      { path: "/network-manager", label: "NetworkManager", icon: Wifi },
      { path: "/dns", label: "DNS & Resolução", icon: Globe },
      { path: "/ssh", label: "SSH", icon: Terminal },
      { path: "/ssh-avancado", label: "SSH Avançado", icon: Lock },
      { path: "/firewall", label: "Firewall", icon: Shield },
      { path: "/vpn", label: "VPN", icon: Lock },
      { path: "/wifi-avancado", label: "Wi-Fi Avançado", icon: Wifi },
      { path: "/samba", label: "NFS & Samba", icon: FolderSync },
    ]
  },
  {
    title: "Desktop & Interface",
    items: [
      { path: "/xorg", label: "Xorg (X11)", icon: Monitor },
      { path: "/tiling-wm", label: "Tiling Window Managers", icon: Layers },
      { path: "/wayland", label: "Wayland", icon: Monitor },
      { path: "/fontes", label: "Fontes & Renderização", icon: Type },
      { path: "/bluetooth", label: "Bluetooth", icon: Radio },
      { path: "/pipewire", label: "PipeWire & Áudio", icon: Volume2 },
      { path: "/impressao", label: "Impressão (CUPS)", icon: Printer },
      { path: "/power-management", label: "Energia & Bateria", icon: Battery },
    ]
  },
  {
    title: "Desenvolvimento",
    items: [
      { path: "/java-sdks", label: "Java, Flutter & SDKs", icon: Coffee },
      { path: "/ambiente-dev", label: "Ambiente de Dev", icon: Code2 },
      { path: "/git", label: "Git", icon: GitBranch },
      { path: "/python", label: "Python", icon: Code2 },
      { path: "/nodejs", label: "Node.js", icon: Server },
      { path: "/rust", label: "Rust", icon: Zap },
      { path: "/containers", label: "Docker & Podman", icon: Container },
      { path: "/cgroups", label: "Cgroups & Namespaces", icon: Boxes },
      { path: "/virtualizacao", label: "Virtualização KVM", icon: Box },
    ]
  },
  {
    title: "Segurança",
    items: [
      { path: "/seguranca", label: "Segurança", icon: Shield },
      { path: "/luks", label: "Criptografia LUKS", icon: Lock },
      { path: "/gpg", label: "GPG & Assinaturas", icon: Lock },
      { path: "/hardening", label: "Hardening do Sistema", icon: Shield },
      { path: "/secure-boot", label: "Secure Boot", icon: ShieldCheck },
      { path: "/apparmor", label: "AppArmor (MAC)", icon: Shield },
    ]
  },
  {
    title: "Performance",
    items: [
      { path: "/performance", label: "Performance & Tuning", icon: Gauge },
    ]
  },
  {
    title: "Manutenção",
    items: [
      { path: "/backup", label: "Backup & Recuperação", icon: ArchiveX },
      { path: "/automacao", label: "Automação & Cron", icon: Timer },
      { path: "/troubleshooting", label: "Troubleshooting", icon: Wrench },
    ]
  },
  {
    title: "Extras",
    items: [
      { path: "/gaming", label: "Gaming no Arch", icon: Gamepad2 },
      { path: "/wine", label: "Wine (Windows)", icon: Monitor },
      { path: "/referencias", label: "Referências", icon: BookOpen },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useHashLocation();

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
        <div className="p-5">
          <div className="flex items-center justify-between lg:justify-center mb-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold mt-0 mb-0 pb-0 border-0 leading-tight">Arch Linux</h2>
                <p className="text-xs text-muted-foreground">Livro Completo 2025</p>
              </div>
            </Link>
            <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-6">
            {NAVIGATION.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-0 pb-0 border-0">
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
                            "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-all duration-150",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-primary" : "opacity-60")} />
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
