import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import Ssh from "@/pages/Ssh";
import Historia from "@/pages/Historia";
import Filosofia from "@/pages/Filosofia";
import Instalacao from "@/pages/Instalacao";
import PrimeirosPassos from "@/pages/PrimeirosPassos";
import AmbienteGrafico from "@/pages/AmbienteGrafico";
import Apt from "@/pages/Apt";
import SnapFlatpak from "@/pages/SnapFlatpak";
import Systemd from "@/pages/Systemd";
import SistemaArquivos from "@/pages/SistemaArquivos";
import Navegacao from "@/pages/Navegacao";
import ManipulacaoArquivos from "@/pages/ManipulacaoArquivos";
import Visualizacao from "@/pages/Visualizacao";
import Permissoes from "@/pages/Permissoes";
import Usuarios from "@/pages/Usuarios";
import Processos from "@/pages/Processos";
import Redes from "@/pages/Redes";
import Disco from "@/pages/Disco";
import ShellBash from "@/pages/ShellBash";
import Redirecionamento from "@/pages/Redirecionamento";
import Compressao from "@/pages/Compressao";
import Avancado from "@/pages/Avancado";
import Seguranca from "@/pages/Seguranca";
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
        <Route path="/apt" component={Apt} />
        <Route path="/snap-flatpak" component={SnapFlatpak} />
        <Route path="/systemd" component={Systemd} />
        <Route path="/sistema-arquivos" component={SistemaArquivos} />
        <Route path="/navegacao" component={Navegacao} />
        <Route path="/manipulacao-arquivos" component={ManipulacaoArquivos} />
        <Route path="/visualizacao" component={Visualizacao} />
        <Route path="/permissoes" component={Permissoes} />
        <Route path="/usuarios" component={Usuarios} />
        <Route path="/processos" component={Processos} />
        <Route path="/redes" component={Redes} />
        <Route path="/ssh" component={Ssh} />
        <Route path="/disco" component={Disco} />
        <Route path="/shell-bash" component={ShellBash} />
        <Route path="/redirecionamento" component={Redirecionamento} />
        <Route path="/compressao" component={Compressao} />
        <Route path="/avancado" component={Avancado} />
        <Route path="/seguranca" component={Seguranca} />
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
