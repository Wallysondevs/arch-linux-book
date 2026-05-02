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
import Localizacao from "@/pages/Localizacao";
import AmbientesAlternativos from "@/pages/AmbientesAlternativos";

import Pacman from "@/pages/Pacman";
import Aur from "@/pages/Aur";
import CodigoFonte from "@/pages/CodigoFonte";
import AppImage from "@/pages/AppImage";
import SnapFlatpak from "@/pages/SnapFlatpak";

import Systemd from "@/pages/Systemd";
import Boot from "@/pages/Boot";
import Kernel from "@/pages/Kernel";
import JournalCtl from "@/pages/JournalCtl";
import Cron from "@/pages/Cron";

import SistemaArquivos from "@/pages/SistemaArquivos";
import Navegacao from "@/pages/Navegacao";
import ManipulacaoArquivos from "@/pages/ManipulacaoArquivos";
import Visualizacao from "@/pages/Visualizacao";
import Editores from "@/pages/Editores";
import Vim from "@/pages/Vim";
import ManPages from "@/pages/ManPages";
import Permissoes from "@/pages/Permissoes";
import Usuarios from "@/pages/Usuarios";
import Processos from "@/pages/Processos";

import ShellBash from "@/pages/ShellBash";
import Redirecionamento from "@/pages/Redirecionamento";
import Compressao from "@/pages/Compressao";
import Avancado from "@/pages/Avancado";
import ScriptsBash from "@/pages/ScriptsBash";
import ExpansoesBash from "@/pages/ExpansoesBash";
import VariaveisAmbiente from "@/pages/VariaveisAmbiente";
import Aliases from "@/pages/Aliases";
import Zsh from "@/pages/Zsh";

import Hardware from "@/pages/Hardware";
import Disco from "@/pages/Disco";
import IOStat from "@/pages/IOStat";

import Fstab from "@/pages/Fstab";
import Particoes from "@/pages/Particoes";
import LUKS from "@/pages/LUKS";
import LVM from "@/pages/LVM";
import Backup from "@/pages/Backup";
import Timeshift from "@/pages/Timeshift";

import Redes from "@/pages/Redes";
import Ssh from "@/pages/Ssh";
import DNS from "@/pages/DNS";
import VPN from "@/pages/VPN";
import RedeAvancada from "@/pages/RedeAvancada";

import Apache from "@/pages/Apache";
import Nginx from "@/pages/Nginx";
import Samba from "@/pages/Samba";

import Docker from "@/pages/Docker";
import DockerCompose from "@/pages/DockerCompose";
import KVM from "@/pages/KVM";
import Wine from "@/pages/Wine";
import CloudInit from "@/pages/CloudInit";

import PostgreSQL from "@/pages/PostgreSQL";
import MySQL from "@/pages/MySQL";

import Python from "@/pages/Python";
import NodeJS from "@/pages/NodeJS";
import PHP from "@/pages/PHP";
import Java from "@/pages/Java";

import Git from "@/pages/Git";
import VSCode from "@/pages/VSCode";
import Ansible from "@/pages/Ansible";
import AmbienteDev from "@/pages/AmbienteDev";

import Multimedia from "@/pages/Multimedia";
import Gaming from "@/pages/Gaming";
import GNOMEExtensions from "@/pages/GNOMEExtensions";

import Seguranca from "@/pages/Seguranca";
import AppArmor from "@/pages/AppArmor";
import Fail2Ban from "@/pages/Fail2Ban";
import GPG from "@/pages/GPG";

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
        <Route path="/historia" component={Historia} />
        <Route path="/filosofia" component={Filosofia} />

        <Route path="/instalacao" component={Instalacao} />
        <Route path="/primeiros-passos" component={PrimeirosPassos} />
        <Route path="/ambiente-grafico" component={AmbienteGrafico} />
        <Route path="/localizacao" component={Localizacao} />
        <Route path="/ambientes-alternativos" component={AmbientesAlternativos} />

        <Route path="/navegacao" component={Navegacao} />
        <Route path="/visualizacao" component={Visualizacao} />
        <Route path="/manipulacao-arquivos" component={ManipulacaoArquivos} />
        <Route path="/editores" component={Editores} />
        <Route path="/vim" component={Vim} />
        <Route path="/man-pages" component={ManPages} />

        <Route path="/sistema-arquivos" component={SistemaArquivos} />
        <Route path="/permissoes" component={Permissoes} />

        <Route path="/pacman" component={Pacman} />
        <Route path="/aur" component={Aur} />
        <Route path="/codigo-fonte" component={CodigoFonte} />
        <Route path="/appimage" component={AppImage} />
        <Route path="/snap-flatpak" component={SnapFlatpak} />

        <Route path="/systemd" component={Systemd} />
        <Route path="/boot" component={Boot} />
        <Route path="/kernel" component={Kernel} />
        <Route path="/journalctl" component={JournalCtl} />
        <Route path="/cron" component={Cron} />
        <Route path="/processos" component={Processos} />
        <Route path="/usuarios" component={Usuarios} />

        <Route path="/shell-bash" component={ShellBash} />
        <Route path="/redirecionamento" component={Redirecionamento} />
        <Route path="/compressao" component={Compressao} />
        <Route path="/avancado" component={Avancado} />
        <Route path="/scripts-bash" component={ScriptsBash} />
        <Route path="/expansoes-bash" component={ExpansoesBash} />
        <Route path="/variaveis-ambiente" component={VariaveisAmbiente} />
        <Route path="/aliases" component={Aliases} />
        <Route path="/zsh" component={Zsh} />

        <Route path="/hardware" component={Hardware} />
        <Route path="/disco" component={Disco} />
        <Route path="/iostat" component={IOStat} />

        <Route path="/fstab" component={Fstab} />
        <Route path="/particoes" component={Particoes} />
        <Route path="/luks" component={LUKS} />
        <Route path="/lvm" component={LVM} />
        <Route path="/backup" component={Backup} />
        <Route path="/timeshift" component={Timeshift} />

        <Route path="/redes" component={Redes} />
        <Route path="/ssh" component={Ssh} />
        <Route path="/dns" component={DNS} />
        <Route path="/vpn" component={VPN} />
        <Route path="/rede-avancada" component={RedeAvancada} />

        <Route path="/apache" component={Apache} />
        <Route path="/nginx" component={Nginx} />
        <Route path="/samba" component={Samba} />

        <Route path="/docker" component={Docker} />
        <Route path="/docker-compose" component={DockerCompose} />
        <Route path="/kvm" component={KVM} />
        <Route path="/wine" component={Wine} />
        <Route path="/cloud-init" component={CloudInit} />

        <Route path="/postgresql" component={PostgreSQL} />
        <Route path="/mysql" component={MySQL} />

        <Route path="/python" component={Python} />
        <Route path="/nodejs" component={NodeJS} />
        <Route path="/php" component={PHP} />
        <Route path="/java" component={Java} />

        <Route path="/git" component={Git} />
        <Route path="/vscode" component={VSCode} />
        <Route path="/ansible" component={Ansible} />
        <Route path="/ambiente-dev" component={AmbienteDev} />

        <Route path="/multimedia" component={Multimedia} />
        <Route path="/gaming" component={Gaming} />
        <Route path="/gnome-extensions" component={GNOMEExtensions} />

        <Route path="/seguranca" component={Seguranca} />
        <Route path="/apparmor" component={AppArmor} />
        <Route path="/fail2ban" component={Fail2Ban} />
        <Route path="/gpg" component={GPG} />

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
