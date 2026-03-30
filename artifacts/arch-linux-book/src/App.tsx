import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import Historia from "@/pages/Historia";
import Filosofia from "@/pages/Filosofia";
import Instalacao from "@/pages/Instalacao";
import PrimeirosPassos from "@/pages/PrimeirosPassos";
import AmbienteGrafico from "@/pages/AmbienteGrafico";
import DisplayManagers from "@/pages/DisplayManagers";
import Dotfiles from "@/pages/Dotfiles";
import Kernel from "@/pages/Kernel";
import BootProcess from "@/pages/BootProcess";
import ModulosKernel from "@/pages/ModulosKernel";
import Initramfs from "@/pages/Initramfs";
import Pacman from "@/pages/Pacman";
import Aur from "@/pages/Aur";
import Flatpak from "@/pages/Flatpak";
import Systemd from "@/pages/Systemd";
import SistemaArquivos from "@/pages/SistemaArquivos";
import Navegacao from "@/pages/Navegacao";
import ManipulacaoArquivos from "@/pages/ManipulacaoArquivos";
import Visualizacao from "@/pages/Visualizacao";
import Permissoes from "@/pages/Permissoes";
import Usuarios from "@/pages/Usuarios";
import Processos from "@/pages/Processos";
import Disco from "@/pages/Disco";
import Lvm from "@/pages/Lvm";
import Btrfs from "@/pages/Btrfs";
import Logs from "@/pages/Logs";
import ShellBash from "@/pages/ShellBash";
import Redirecionamento from "@/pages/Redirecionamento";
import Compressao from "@/pages/Compressao";
import Avancado from "@/pages/Avancado";
import Tmux from "@/pages/Tmux";
import VimNeovim from "@/pages/VimNeovim";
import Redes from "@/pages/Redes";
import Ssh from "@/pages/Ssh";
import SshAvancado from "@/pages/SshAvancado";
import Firewall from "@/pages/Firewall";
import Vpn from "@/pages/Vpn";
import WifiAvancado from "@/pages/WifiAvancado";
import TilingWm from "@/pages/TilingWm";
import Wayland from "@/pages/Wayland";
import Bluetooth from "@/pages/Bluetooth";
import Pipewire from "@/pages/Pipewire";
import AmbienteDev from "@/pages/AmbienteDev";
import Git from "@/pages/Git";
import Python from "@/pages/Python";
import Nodejs from "@/pages/Nodejs";
import Rust from "@/pages/Rust";
import Containers from "@/pages/Containers";
import Virtualizacao from "@/pages/Virtualizacao";
import Seguranca from "@/pages/Seguranca";
import Luks from "@/pages/Luks";
import Gpg from "@/pages/Gpg";
import Hardening from "@/pages/Hardening";
import Backup from "@/pages/Backup";
import Automacao from "@/pages/Automacao";
import Gaming from "@/pages/Gaming";
import Troubleshooting from "@/pages/Troubleshooting";
import Referencias from "@/pages/Referencias";
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
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/historia" component={Historia} />
        <Route path="/filosofia" component={Filosofia} />
        <Route path="/instalacao" component={Instalacao} />
        <Route path="/primeiros-passos" component={PrimeirosPassos} />
        <Route path="/ambiente-grafico" component={AmbienteGrafico} />
        <Route path="/display-managers" component={DisplayManagers} />
        <Route path="/dotfiles" component={Dotfiles} />
        <Route path="/kernel" component={Kernel} />
        <Route path="/boot-process" component={BootProcess} />
        <Route path="/modulos-kernel" component={ModulosKernel} />
        <Route path="/initramfs" component={Initramfs} />
        <Route path="/pacman" component={Pacman} />
        <Route path="/aur" component={Aur} />
        <Route path="/flatpak" component={Flatpak} />
        <Route path="/systemd" component={Systemd} />
        <Route path="/sistema-arquivos" component={SistemaArquivos} />
        <Route path="/navegacao" component={Navegacao} />
        <Route path="/manipulacao-arquivos" component={ManipulacaoArquivos} />
        <Route path="/visualizacao" component={Visualizacao} />
        <Route path="/permissoes" component={Permissoes} />
        <Route path="/usuarios" component={Usuarios} />
        <Route path="/processos" component={Processos} />
        <Route path="/disco" component={Disco} />
        <Route path="/lvm" component={Lvm} />
        <Route path="/btrfs" component={Btrfs} />
        <Route path="/logs" component={Logs} />
        <Route path="/shell-bash" component={ShellBash} />
        <Route path="/redirecionamento" component={Redirecionamento} />
        <Route path="/compressao" component={Compressao} />
        <Route path="/avancado" component={Avancado} />
        <Route path="/tmux" component={Tmux} />
        <Route path="/vim-neovim" component={VimNeovim} />
        <Route path="/redes" component={Redes} />
        <Route path="/ssh" component={Ssh} />
        <Route path="/ssh-avancado" component={SshAvancado} />
        <Route path="/firewall" component={Firewall} />
        <Route path="/vpn" component={Vpn} />
        <Route path="/wifi-avancado" component={WifiAvancado} />
        <Route path="/tiling-wm" component={TilingWm} />
        <Route path="/wayland" component={Wayland} />
        <Route path="/bluetooth" component={Bluetooth} />
        <Route path="/pipewire" component={Pipewire} />
        <Route path="/ambiente-dev" component={AmbienteDev} />
        <Route path="/git" component={Git} />
        <Route path="/python" component={Python} />
        <Route path="/nodejs" component={Nodejs} />
        <Route path="/rust" component={Rust} />
        <Route path="/containers" component={Containers} />
        <Route path="/virtualizacao" component={Virtualizacao} />
        <Route path="/seguranca" component={Seguranca} />
        <Route path="/luks" component={Luks} />
        <Route path="/gpg" component={Gpg} />
        <Route path="/hardening" component={Hardening} />
        <Route path="/backup" component={Backup} />
        <Route path="/automacao" component={Automacao} />
        <Route path="/gaming" component={Gaming} />
        <Route path="/troubleshooting" component={Troubleshooting} />
        <Route path="/referencias" component={Referencias} />
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
