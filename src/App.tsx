import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";

const Historia = lazy(() => import("@/pages/Historia"));
const Filosofia = lazy(() => import("@/pages/Filosofia"));
const Instalacao = lazy(() => import("@/pages/Instalacao"));
const PrimeirosPassos = lazy(() => import("@/pages/PrimeirosPassos"));
const AmbienteGrafico = lazy(() => import("@/pages/AmbienteGrafico"));
const DisplayManagers = lazy(() => import("@/pages/DisplayManagers"));
const Dotfiles = lazy(() => import("@/pages/Dotfiles"));
const Kernel = lazy(() => import("@/pages/Kernel"));
const BootProcess = lazy(() => import("@/pages/BootProcess"));
const ModulosKernel = lazy(() => import("@/pages/ModulosKernel"));
const Initramfs = lazy(() => import("@/pages/Initramfs"));
const Pacman = lazy(() => import("@/pages/Pacman"));
const Aur = lazy(() => import("@/pages/Aur"));
const Flatpak = lazy(() => import("@/pages/Flatpak"));
const Systemd = lazy(() => import("@/pages/Systemd"));
const SistemaArquivos = lazy(() => import("@/pages/SistemaArquivos"));
const Navegacao = lazy(() => import("@/pages/Navegacao"));
const ManipulacaoArquivos = lazy(() => import("@/pages/ManipulacaoArquivos"));
const Visualizacao = lazy(() => import("@/pages/Visualizacao"));
const Permissoes = lazy(() => import("@/pages/Permissoes"));
const Usuarios = lazy(() => import("@/pages/Usuarios"));
const Processos = lazy(() => import("@/pages/Processos"));
const Disco = lazy(() => import("@/pages/Disco"));
const Lvm = lazy(() => import("@/pages/Lvm"));
const Btrfs = lazy(() => import("@/pages/Btrfs"));
const Logs = lazy(() => import("@/pages/Logs"));
const ShellBash = lazy(() => import("@/pages/ShellBash"));
const Redirecionamento = lazy(() => import("@/pages/Redirecionamento"));
const Compressao = lazy(() => import("@/pages/Compressao"));
const Avancado = lazy(() => import("@/pages/Avancado"));
const Tmux = lazy(() => import("@/pages/Tmux"));
const VimNeovim = lazy(() => import("@/pages/VimNeovim"));
const Redes = lazy(() => import("@/pages/Redes"));
const Ssh = lazy(() => import("@/pages/Ssh"));
const SshAvancado = lazy(() => import("@/pages/SshAvancado"));
const Firewall = lazy(() => import("@/pages/Firewall"));
const Vpn = lazy(() => import("@/pages/Vpn"));
const WifiAvancado = lazy(() => import("@/pages/WifiAvancado"));
const TilingWm = lazy(() => import("@/pages/TilingWm"));
const Wayland = lazy(() => import("@/pages/Wayland"));
const Bluetooth = lazy(() => import("@/pages/Bluetooth"));
const Pipewire = lazy(() => import("@/pages/Pipewire"));
const AmbienteDev = lazy(() => import("@/pages/AmbienteDev"));
const Git = lazy(() => import("@/pages/Git"));
const Python = lazy(() => import("@/pages/Python"));
const Nodejs = lazy(() => import("@/pages/Nodejs"));
const Rust = lazy(() => import("@/pages/Rust"));
const Containers = lazy(() => import("@/pages/Containers"));
const Virtualizacao = lazy(() => import("@/pages/Virtualizacao"));
const Seguranca = lazy(() => import("@/pages/Seguranca"));
const Luks = lazy(() => import("@/pages/Luks"));
const Gpg = lazy(() => import("@/pages/Gpg"));
const Hardening = lazy(() => import("@/pages/Hardening"));
const Backup = lazy(() => import("@/pages/Backup"));
const Automacao = lazy(() => import("@/pages/Automacao"));
const Gaming = lazy(() => import("@/pages/Gaming"));
const Troubleshooting = lazy(() => import("@/pages/Troubleshooting"));
const Referencias = lazy(() => import("@/pages/Referencias"));
const Mirrors = lazy(() => import("@/pages/Mirrors"));
const Bootloaders = lazy(() => import("@/pages/Bootloaders"));
const Fstab = lazy(() => import("@/pages/Fstab"));
const SwapZram = lazy(() => import("@/pages/SwapZram"));
const Locale = lazy(() => import("@/pages/Locale"));
const Archinstall = lazy(() => import("@/pages/Archinstall"));
const NetworkManagerPage = lazy(() => import("@/pages/NetworkManagerPage"));
const Dns = lazy(() => import("@/pages/Dns"));
const Fontes = lazy(() => import("@/pages/Fontes"));
const Xorg = lazy(() => import("@/pages/Xorg"));
const PowerManagement = lazy(() => import("@/pages/PowerManagement"));
const Udev = lazy(() => import("@/pages/Udev"));
const Sysctl = lazy(() => import("@/pages/Sysctl"));
const Performance = lazy(() => import("@/pages/Performance"));
const Makepkg = lazy(() => import("@/pages/Makepkg"));
const PacmanHooks = lazy(() => import("@/pages/PacmanHooks"));
const SecureBoot = lazy(() => import("@/pages/SecureBoot"));
const AppArmor = lazy(() => import("@/pages/AppArmor"));
const Polkit = lazy(() => import("@/pages/Polkit"));
const Wine = lazy(() => import("@/pages/Wine"));
const Samba = lazy(() => import("@/pages/Samba"));
const Zfs = lazy(() => import("@/pages/Zfs"));
const Impressao = lazy(() => import("@/pages/Impressao"));
const Cgroups = lazy(() => import("@/pages/Cgroups"));
const Plymouth = lazy(() => import("@/pages/Plymouth"));
const InstalacaoSoftware = lazy(() => import("@/pages/InstalacaoSoftware"));
const JavaSdks = lazy(() => import("@/pages/JavaSdks"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
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
        <Route path="/mirrors" component={Mirrors} />
        <Route path="/bootloaders" component={Bootloaders} />
        <Route path="/fstab" component={Fstab} />
        <Route path="/swap-zram" component={SwapZram} />
        <Route path="/locale" component={Locale} />
        <Route path="/archinstall" component={Archinstall} />
        <Route path="/network-manager" component={NetworkManagerPage} />
        <Route path="/dns" component={Dns} />
        <Route path="/fontes" component={Fontes} />
        <Route path="/xorg" component={Xorg} />
        <Route path="/power-management" component={PowerManagement} />
        <Route path="/udev" component={Udev} />
        <Route path="/sysctl" component={Sysctl} />
        <Route path="/performance" component={Performance} />
        <Route path="/makepkg" component={Makepkg} />
        <Route path="/pacman-hooks" component={PacmanHooks} />
        <Route path="/secure-boot" component={SecureBoot} />
        <Route path="/apparmor" component={AppArmor} />
        <Route path="/polkit" component={Polkit} />
        <Route path="/wine" component={Wine} />
        <Route path="/samba" component={Samba} />
        <Route path="/zfs" component={Zfs} />
        <Route path="/impressao" component={Impressao} />
        <Route path="/cgroups" component={Cgroups} />
        <Route path="/plymouth" component={Plymouth} />
        <Route path="/instalacao-software" component={InstalacaoSoftware} />
        <Route path="/java-sdks" component={JavaSdks} />
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
