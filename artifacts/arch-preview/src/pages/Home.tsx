import { Link } from "wouter";
import {
  Terminal, HardDrive, BookOpen, Shield, Cpu, ChevronRight,
  Folder, Package, Network, Code2, Lock, Wrench, Eye
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CATEGORIES = [
  { num: "01", title: "Introdução", desc: "História, filosofia e base conceitual", icon: BookOpen, path: "/historia", count: 3 },
  { num: "02", title: "Instalação", desc: "Do live ISO ao primeiro boot funcional", icon: HardDrive, path: "/instalacao", count: 3 },
  { num: "03", title: "Terminal Básico", desc: "Navegar, ler, criar e mover arquivos", icon: Folder, path: "/navegacao", count: 3 },
  { num: "04", title: "Sistema de Arquivos", desc: "FHS e modelo de permissões Unix", icon: Eye, path: "/sistema-arquivos", count: 2 },
  { num: "05", title: "Pacotes", desc: "Pacman, AUR, repositórios e helpers", icon: Package, path: "/pacman", count: 2 },
  { num: "06", title: "Sistema", desc: "Systemd, processos e usuários", icon: Cpu, path: "/systemd", count: 3 },
  { num: "07", title: "Shell Avançado", desc: "Bash, redirects, scripts e pipes", icon: Terminal, path: "/shell-bash", count: 4 },
  { num: "08", title: "Hardware", desc: "Discos, partições, LVM e RAID", icon: HardDrive, path: "/disco", count: 1 },
  { num: "09", title: "Redes", desc: "ip, ss, NetworkManager e SSH", icon: Network, path: "/redes", count: 2 },
  { num: "10", title: "Desenvolvimento", desc: "Stack completa para programar", icon: Code2, path: "/ambiente-dev", count: 1 },
  { num: "11", title: "Extras", desc: "Segurança, troubleshooting, referências", icon: Shield, path: "/seguranca", count: 3 },
];

const HERO_LINES = [
  { delay: 0,    type: "cmd",    text: "uname -a" },
  { delay: 600,  type: "out",    text: "Linux archlinux 6.8.7-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" },
  { delay: 1100, type: "cmd",    text: "cat /etc/os-release | head -3" },
  { delay: 1700, type: "out",    text: "NAME=\"Arch Linux\"\nPRETTY_NAME=\"Arch Linux\"\nID=arch" },
  { delay: 2400, type: "cmd",    text: "neofetch --stdout | head -7" },
  { delay: 3100, type: "out",    text: "user@archlinux\n--------------\nOS:   Arch Linux x86_64\nKernel: 6.8.7-arch1-1\nUptime: 2 hours, 14 mins\nPackages: 1024 (pacman)\nShell: bash 5.2.26" },
];

export default function Home() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    HERO_LINES.forEach((line, i) => {
      const t = window.setTimeout(() => setVisible(i + 1), line.delay);
      timers.push(t);
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div className="min-h-screen arch-grid-bg">
      {/* ======= HERO ======= */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 px-4 arch-scanlines">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1793D1]/[0.04] via-transparent to-[#08090C]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#1793D1]/[0.07] blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1793D1]/10 text-[#1793D1] border border-[#1793D1]/30 text-xs font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1793D1] animate-pulse" />
              v2.0 — manual completo 2026
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05] before:content-none">
              <span className="block text-white">Aprenda</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1793D1] via-[#5fc7ff] to-[#1793D1] term-glow">
                Arch Linux
              </span>
              <span className="block text-white text-3xl md:text-4xl lg:text-5xl mt-2">
                de verdade.
              </span>
            </h1>
            <p className="text-base md:text-lg text-[#9aa3b2] mb-8 max-w-xl leading-relaxed">
              Um manual exaustivo, em português, com a saída <strong className="text-white">real de cada comando</strong> explicada
              linha por linha. Do primeiro boot ao kernel customizado, sem encurtar nada.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <Link
                href="/instalacao"
                className="group px-6 py-3 rounded-md bg-[#1793D1] text-white font-semibold shadow-[0_0_20px_rgba(23,147,209,0.4)] hover:bg-[#1ea4e8] hover:shadow-[0_0_28px_rgba(23,147,209,0.55)] transition-all flex items-center justify-center gap-2 border-0"
              >
                <Terminal className="w-4 h-4" />
                ./start.sh — Começar do Zero
              </Link>
              <Link
                href="/pacman"
                className="px-6 py-3 rounded-md bg-[#0d1117] border border-[hsl(220_12%_22%)] text-[#cbd1dc] font-medium hover:border-[#1793D1]/50 hover:text-white transition-all flex items-center justify-center gap-2 font-mono text-sm"
              >
                man pacman
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* mini stats */}
            <div className="flex items-center gap-6 text-xs font-mono text-[#7c8497]">
              <span><span className="text-[#5fff87]">●</span> 26 capítulos</span>
              <span><span className="text-[#1793D1]">●</span> 700+ comandos</span>
              <span><span className="text-[#ffd75f]">●</span> 100% PT-BR</span>
            </div>
          </motion.div>

          {/* ======= TERMINAL DEMO ======= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-[#1793D1]/10 blur-2xl rounded-2xl" />
            <div className="relative rounded-lg border border-[hsl(220_12%_22%)] bg-[#0a0d11] shadow-2xl overflow-hidden">
              <div className="flex items-center px-3 py-2 bg-gradient-to-b from-[#161a21] to-[#11141a] border-b border-[hsl(220_12%_18%)]">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[11px] font-mono text-[#7c8497] ml-3">user@archlinux: ~</span>
              </div>
              <div className="p-4 font-mono text-[12.5px] leading-[1.55] min-h-[280px]">
                {HERO_LINES.slice(0, visible).map((line, i) => (
                  <div key={i}>
                    {line.type === "cmd" ? (
                      <div>
                        <span className="text-[#7c8497]">[</span>
                        <span className="text-[#5fff87]">user</span>
                        <span className="text-[#9aa3b2]">@</span>
                        <span className="text-[#1793D1]">archlinux</span>{" "}
                        <span className="text-[#5faaff]">~</span>
                        <span className="text-[#7c8497]">]$ </span>
                        <span className="text-white">{line.text}</span>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap text-[#cbd1dc] m-0">{line.text}</pre>
                    )}
                  </div>
                ))}
                {visible >= HERO_LINES.length && (
                  <div>
                    <span className="text-[#7c8497]">[</span>
                    <span className="text-[#5fff87]">user</span>
                    <span className="text-[#9aa3b2]">@</span>
                    <span className="text-[#1793D1]">archlinux</span>{" "}
                    <span className="text-[#5faaff]">~</span>
                    <span className="text-[#7c8497]">]$ </span>
                    <span className="arch-cursor" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======= STATS BAR ======= */}
      <section className="border-y border-[hsl(220_12%_14%)] bg-[#0a0d11] relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "700+", label: "comandos com saída real", color: "text-[#1793D1]" },
            { value: "26", label: "capítulos progressivos", color: "text-[#5fff87]" },
            { value: "100%", label: "português brasileiro", color: "text-[#ffd75f]" },
            { value: "0", label: "dependências de cdn de css", color: "text-[#ff87ff]" },
          ].map((s, i) => (
            <div key={i}>
              <div className={`text-3xl sm:text-4xl font-black font-mono ${s.color} mb-1`}>{s.value}</div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#7c8497] font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= LEARNING PATH ======= */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="text-xs font-mono text-[#1793D1] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <span className="text-[#5fff87]">$</span>
            <span>ls -1 /docs/capitulos/</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3 border-0 before:content-none">
            Trilha do iniciante ao expert
          </h2>
          <p className="text-[#9aa3b2] max-w-2xl">
            Cada capítulo continua de onde o anterior parou. Você sai sabendo exatamente o que esperar quando digitar cada comando.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} href={cat.path}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                className="group relative p-5 rounded-md bg-[#0d1117] border border-[hsl(220_12%_18%)] hover:border-[#1793D1]/50 hover:bg-[#11151c] transition-all cursor-pointer h-full flex flex-col"
              >
                {/* Number badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] font-mono text-[#5c6370] tracking-widest">{cat.num}</span>
                  <div className="w-8 h-8 rounded bg-[#1793D1]/10 text-[#1793D1] flex items-center justify-center group-hover:bg-[#1793D1]/20 group-hover:scale-110 transition-all">
                    <cat.icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 mt-0 before:content-none">{cat.title}</h3>
                <p className="text-xs text-[#9aa3b2] leading-relaxed mb-4 flex-1">{cat.desc}</p>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#5c6370]">{cat.count} {cat.count === 1 ? "página" : "páginas"}</span>
                  <span className="text-[#1793D1] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    cd → <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======= QUOTE / KISS ======= */}
      <section className="border-t border-[hsl(220_12%_14%)] py-20 px-4 bg-[#08090C]">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-mono text-lg sm:text-xl md:text-2xl text-[#cbd1dc] leading-relaxed">
            <span className="text-[#1793D1]">&quot;</span>
            Keep It Simple, Stupid. Arch é o sistema operacional para quem
            quer entender <span className="text-[#5fff87]">o que está rodando na própria máquina</span>.
            <span className="text-[#1793D1]">&quot;</span>
          </blockquote>
          <div className="mt-6 text-xs font-mono text-[#7c8497] uppercase tracking-[0.2em]">
            — The Arch Way
          </div>
        </div>
      </section>
    </div>
  );
}
