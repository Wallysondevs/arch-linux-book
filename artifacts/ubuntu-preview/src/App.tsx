import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import Ssh from "@/pages/Ssh";
import GenericPage from "@/pages/GenericPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [location] = useHashLocation();
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ssh" component={Ssh} />
        <Route path="/historia">
          <GenericPage title="História do Ubuntu" subtitle="De Mark Shuttleworth ao Ubuntu 24.04 LTS — a trajetória da distro Linux mais popular do mundo." difficulty="iniciante" timeToRead="15 min" />
        </Route>
        <Route path="/filosofia">
          <GenericPage title="Filosofia Ubuntu" subtitle="'Eu sou porque nós somos' — a visão de software livre, comunidade e o papel da Canonical." difficulty="iniciante" timeToRead="10 min" />
        </Route>
        <Route path="/instalacao">
          <GenericPage title="Guia de Instalação" subtitle="Instalação do Ubuntu Desktop e Server — passo a passo completo com exemplos práticos." difficulty="iniciante" timeToRead="30 min" />
        </Route>
        <Route path="/primeiros-passos">
          <GenericPage title="Primeiros Passos" subtitle="Configurações essenciais após a instalação do Ubuntu — atualizações, drivers e personalização." difficulty="iniciante" timeToRead="20 min" />
        </Route>
        <Route path="/ambiente-grafico">
          <GenericPage title="GNOME & Desktop" subtitle="Configurando o ambiente gráfico GNOME, extensões e personalizações no Ubuntu." difficulty="iniciante" timeToRead="20 min" />
        </Route>
        <Route path="/apt">
          <GenericPage title="APT — Gerenciador de Pacotes" subtitle="Domine o APT: instalação, remoção, atualização, repositórios PPA e muito mais." difficulty="iniciante" timeToRead="25 min" />
        </Route>
        <Route path="/snap-flatpak">
          <GenericPage title="Snap & Flatpak" subtitle="Instalando aplicativos via Snap Store e Flathub — vantagens, limitações e comparações." difficulty="iniciante" timeToRead="15 min" />
        </Route>
        <Route path="/systemd">
          <GenericPage title="Systemd" subtitle="Gerenciando serviços, timers e o processo de boot no Ubuntu com systemd e systemctl." difficulty="intermediario" timeToRead="25 min" />
        </Route>
        <Route path="/sistema-arquivos">
          <GenericPage title="Hierarquia FHS" subtitle="Estrutura de diretórios do Linux — o que fica em /etc, /var, /usr e todos os outros." difficulty="iniciante" timeToRead="20 min" />
        </Route>
        <Route path="/navegacao">
          <GenericPage title="Navegação" subtitle="Movendo-se pelo sistema de arquivos com ls, cd, find, tree e muito mais." difficulty="iniciante" timeToRead="15 min" />
        </Route>
        <Route path="/manipulacao-arquivos">
          <GenericPage title="Manipulação de Arquivos" subtitle="cp, mv, rm, mkdir, touch, ln — manipulando arquivos e diretórios no Ubuntu." difficulty="iniciante" timeToRead="20 min" />
        </Route>
        <Route path="/visualizacao">
          <GenericPage title="Visualização" subtitle="cat, less, head, tail, grep, wc — lendo e filtrando conteúdo de arquivos." difficulty="iniciante" timeToRead="15 min" />
        </Route>
        <Route path="/permissoes">
          <GenericPage title="Permissões" subtitle="chmod, chown, umask — entendendo e gerenciando permissões de arquivos no Linux." difficulty="intermediario" timeToRead="20 min" />
        </Route>
        <Route path="/usuarios">
          <GenericPage title="Usuários e Grupos" subtitle="Criando e gerenciando usuários, grupos e sudo no Ubuntu." difficulty="intermediario" timeToRead="20 min" />
        </Route>
        <Route path="/processos">
          <GenericPage title="Processos" subtitle="ps, top, htop, kill, nice — monitorando e gerenciando processos no Ubuntu." difficulty="intermediario" timeToRead="20 min" />
        </Route>
        <Route path="/redes">
          <GenericPage title="Redes" subtitle="ip, ifconfig, ping, traceroute, netstat, nmcli — configuração e diagnóstico de rede." difficulty="intermediario" timeToRead="25 min" />
        </Route>
        <Route path="/disco">
          <GenericPage title="Discos e Partições" subtitle="fdisk, parted, mkfs, mount, lsblk — gerenciando discos e partições no Ubuntu." difficulty="intermediario" timeToRead="25 min" />
        </Route>
        <Route path="/shell-bash">
          <GenericPage title="Shell Bash" subtitle="Variáveis, funções, scripts, loops e condicionais — scripting Bash no Ubuntu." difficulty="intermediario" timeToRead="30 min" />
        </Route>
        <Route path="/redirecionamento">
          <GenericPage title="Redirecionamento" subtitle="stdin, stdout, stderr, pipes — dominando o redirecionamento de I/O no terminal." difficulty="intermediario" timeToRead="15 min" />
        </Route>
        <Route path="/compressao">
          <GenericPage title="Compressão" subtitle="tar, gzip, bzip2, zip, xz — comprimindo e descomprimindo arquivos no Ubuntu." difficulty="iniciante" timeToRead="15 min" />
        </Route>
        <Route path="/avancado">
          <GenericPage title="Comandos Avançados" subtitle="awk, sed, xargs, find avançado, substituição de processos e mais." difficulty="avancado" timeToRead="35 min" />
        </Route>
        <Route path="/seguranca">
          <GenericPage title="Segurança" subtitle="UFW, fail2ban, AppArmor, auditd — hardening e segurança no Ubuntu Server." difficulty="avancado" timeToRead="30 min" />
        </Route>
        <Route path="/troubleshooting">
          <GenericPage title="Troubleshooting" subtitle="Diagnosticando e resolvendo problemas comuns no Ubuntu — boot, rede, espaço em disco." difficulty="intermediario" timeToRead="25 min" />
        </Route>
        <Route path="/referencias">
          <GenericPage title="Referências" subtitle="Links, man pages e documentação oficial do Ubuntu para aprofundamento." difficulty="iniciante" timeToRead="5 min" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
