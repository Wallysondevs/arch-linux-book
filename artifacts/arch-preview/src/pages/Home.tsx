import { Link } from "wouter";
import { Terminal, HardDrive, BookOpen, Shield, Cpu, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { title: "Fundamentos", desc: "História, filosofia e instalação", icon: BookOpen, path: "/historia", color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Gerenciamento", desc: "Pacman, AUR e atualizações", icon: Terminal, path: "/pacman", color: "text-secondary", bg: "bg-secondary/10" },
  { title: "Sistema", desc: "FHS, processos e usuários", icon: Cpu, path: "/sistema-arquivos", color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Armazenamento", desc: "Discos, partições e navegação", icon: HardDrive, path: "/disco", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { title: "Avançado", desc: "Shell scripting, segurança e mais", icon: Shield, path: "/avancado", color: "text-red-500", bg: "bg-red-500/10" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Guia Completo 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Domine o <span className="text-primary">Arch Linux</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              De iniciante a expert. O material em português definitivo para entender, instalar e dominar o sistema operacional mais personalizável do mundo.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/instalacao" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Começar do Zero
              </Link>
              <Link 
                href="/pacman" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-muted hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Terminal className="w-5 h-5" />
                Guia de Comandos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="pt-4 md:pt-0">
              <div className="text-4xl font-black text-foreground mb-2">500+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Comandos Explicados</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl font-black text-foreground mb-2">25</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Tópicos e Categorias</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl font-black text-secondary mb-2">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Prático e Direto</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-4 max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 border-0">Explore por Categorias</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Navegue pelos módulos estruturados como um curso completo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Link key={i} href={cat.path}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="group p-6 rounded-2xl bg-card border border-border shadow-md hover:shadow-xl transition-all cursor-pointer h-full flex flex-col"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 mt-0">{cat.title}</h3>
                <p className="text-muted-foreground mb-6 flex-1">{cat.desc}</p>
                <div className="flex items-center text-primary font-medium text-sm mt-auto">
                  Acessar guia <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
