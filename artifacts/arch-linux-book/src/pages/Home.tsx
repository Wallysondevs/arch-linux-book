import { Link } from "wouter";
import { Terminal, HardDrive, BookOpen, Shield, Cpu, ChevronRight, Network, Code2, Layers, Gamepad2, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { title: "Introdução & Filosofia", desc: "História, filosofia e a mentalidade Arch", icon: BookOpen, path: "/historia", color: "text-blue-400", bg: "bg-blue-500/10", count: "3 tópicos" },
  { title: "Instalação & Setup", desc: "Do zero ao sistema configurado", icon: HardDrive, path: "/instalacao", color: "text-green-400", bg: "bg-green-500/10", count: "5 tópicos" },
  { title: "Kernel & Boot", desc: "Entenda o coração do sistema", icon: Cpu, path: "/kernel", color: "text-yellow-400", bg: "bg-yellow-500/10", count: "4 tópicos" },
  { title: "Gerenciamento", desc: "Pacman, AUR, Flatpak e Systemd", icon: Terminal, path: "/pacman", color: "text-primary", bg: "bg-primary/10", count: "4 tópicos" },
  { title: "Sistema de Arquivos", desc: "FHS, navegação, permissões e mais", icon: Layers, path: "/sistema-arquivos", color: "text-purple-400", bg: "bg-purple-500/10", count: "5 tópicos" },
  { title: "Administração", desc: "Usuários, processos, discos, LVM e logs", icon: HardDrive, path: "/usuarios", color: "text-orange-400", bg: "bg-orange-500/10", count: "6 tópicos" },
  { title: "Terminal & Shell", desc: "Bash, tmux, Neovim e comandos avançados", icon: Terminal, path: "/shell-bash", color: "text-cyan-400", bg: "bg-cyan-500/10", count: "6 tópicos" },
  { title: "Rede & Conectividade", desc: "SSH, firewall, VPN e Wi-Fi avançado", icon: Network, path: "/redes", color: "text-pink-400", bg: "bg-pink-500/10", count: "6 tópicos" },
  { title: "Desktop & Interface", desc: "Tiling WMs, Wayland, áudio e Bluetooth", icon: Layers, path: "/tiling-wm", color: "text-indigo-400", bg: "bg-indigo-500/10", count: "4 tópicos" },
  { title: "Desenvolvimento", desc: "Git, Python, Node.js, Rust e containers", icon: Code2, path: "/ambiente-dev", color: "text-emerald-400", bg: "bg-emerald-500/10", count: "7 tópicos" },
  { title: "Segurança Avançada", desc: "LUKS, GPG, hardening e boas práticas", icon: Lock, path: "/seguranca", color: "text-red-400", bg: "bg-red-500/10", count: "4 tópicos" },
  { title: "Gaming no Arch", desc: "Steam, Wine, Proton e drivers GPU", icon: Gamepad2, path: "/gaming", color: "text-violet-400", bg: "bg-violet-500/10", count: "1 tópico" },
];

const HIGHLIGHTS = [
  { icon: Zap, title: "Kernel & Módulos", desc: "Entenda o coração do Linux", path: "/kernel" },
  { icon: Lock, title: "LUKS Full Disk Encryption", desc: "Criptografia completa do disco", path: "/luks" },
  { icon: Layers, title: "LVM & RAID", desc: "Volumes lógicos avançados", path: "/lvm" },
  { icon: Code2, title: "Docker & Podman", desc: "Containers no Arch Linux", path: "/containers" },
  { icon: Terminal, title: "tmux & Neovim", desc: "Produtividade máxima no terminal", path: "/tmux" },
  { icon: Shield, title: "Hardening do Sistema", desc: "Fortaleça a segurança do Arch", path: "/hardening" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Livro Completo 2025 — 60+ Tópicos
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 mt-0 pb-0 border-0">
              <span className="text-foreground">Domine o </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Arch Linux</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              De iniciante absoluto a expert. O guia mais completo em português para entender, instalar e dominar o Arch Linux — com mais de 60 tópicos, exemplos práticos e explicações didáticas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/instalacao" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all text-sm">
                Começar do Zero
              </Link>
              <Link href="/pacman" className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-muted hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm">
                <Terminal className="w-4 h-4" />
                Guia de Comandos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y-2 md:divide-y-0 md:divide-x divide-border">
            {[
              { value: "60+", label: "Tópicos Cobertos" },
              { value: "1000+", label: "Comandos Explicados" },
              { value: "100%", label: "Em Português" },
              { value: "2025", label: "Totalmente Atualizado" },
            ].map((stat, i) => (
              <div key={i} className="py-2">
                <div className={`text-3xl font-black mb-1 ${i === 2 ? "text-secondary" : "text-foreground"}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3 border-0 mt-0">Explore por Categorias</h2>
          <p className="text-muted-foreground">12 seções estruturadas, do básico ao avançado absoluto.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} href={cat.path}>
              <motion.div whileHover={{ y: -4 }} className="group p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base font-bold text-foreground mt-0 mb-0 border-0">{cat.title}</h3>
                  <span className="text-xs text-muted-foreground ml-2 shrink-0 mt-0.5">{cat.count}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{cat.desc}</p>
                <div className="flex items-center text-primary font-medium text-xs mt-auto">
                  Acessar <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-card/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Novos Tópicos Avançados</span>
            <h2 className="text-2xl font-bold mt-2 border-0">Conteúdo Expandido</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HIGHLIGHTS.map((h, i) => (
              <Link key={i} href={h.path}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <h.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{h.title}</div>
                    <div className="text-xs text-muted-foreground">{h.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3 border-0">Pronto para dominar o Arch?</h2>
          <p className="text-muted-foreground mb-6">Comece pela instalação e siga o caminho estruturado até os tópicos avançados.</p>
          <Link href="/instalacao" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all text-sm">
            <Terminal className="w-4 h-4" />
            Começar Agora
          </Link>
        </div>
      </section>
    </div>
  );
}
