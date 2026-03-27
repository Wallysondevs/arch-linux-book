import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SnapFlatpak() {
  return (
    <PageContainer
      title="Snap & Flatpak"
      subtitle="Instalando aplicativos via Snap Store e Flathub — entenda os formatos universais de pacotes e suas diferenças."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Além do APT (para pacotes .deb), o Ubuntu suporta dois formatos modernos de distribuição
        de aplicativos: <strong>Snap</strong> (criado pela Canonical) e <strong>Flatpak</strong>
        (criado pelo projeto freedesktop.org). Ambos instalam aplicativos de forma isolada do
        sistema, com todas as dependências embutidas.
      </p>

      <h2>Snap: O Formato da Canonical</h2>
      <p>
        Snaps são pacotes que incluem o aplicativo e todas as suas dependências. São
        atualizados automaticamente e funcionam em qualquer distribuição Linux que tenha o
        snapd instalado.
      </p>

      <h3>Comandos Essenciais do Snap</h3>
      <CodeBlock
        title="Gerenciando snaps"
        code={`# Buscar um snap
snap find firefox
snap find spotify

# Instalar um snap
sudo snap install spotify
sudo snap install code --classic
sudo snap install discord

# A flag --classic dá acesso irrestrito ao sistema de arquivos
# (necessário para IDEs, editores e ferramentas de desenvolvimento)

# Ver snaps instalados
snap list

# Informações sobre um snap
snap info spotify

# Atualizar todos os snaps
sudo snap refresh

# Atualizar um snap específico
sudo snap refresh spotify

# Remover um snap
sudo snap remove spotify

# Reverter para a versão anterior de um snap
sudo snap revert spotify

# Ver histórico de atualizações
snap changes`}
      />

      <h3>Snaps Populares</h3>
      <CodeBlock
        title="Snaps mais usados"
        code={`# Ferramentas de desenvolvimento
sudo snap install code --classic          # VS Code
sudo snap install intellij-idea-community --classic
sudo snap install pycharm-community --classic
sudo snap install android-studio --classic
sudo snap install sublime-text --classic
sudo snap install postman

# Navegadores
sudo snap install chromium
sudo snap install brave
sudo snap install opera

# Comunicação
sudo snap install discord
sudo snap install slack --classic
sudo snap install telegram-desktop
sudo snap install zoom-client

# Multimídia
sudo snap install vlc
sudo snap install spotify
sudo snap install obs-studio

# Produtividade
sudo snap install notion-snap-reborn
sudo snap install obsidian --classic`}
      />

      <AlertBox type="warning" title="Snaps e performance de inicialização">
        Snaps podem demorar mais para abrir na primeira vez depois do boot do sistema porque
        precisam ser montados. O Firefox no Ubuntu 22.04+ é um snap por padrão, o que pode
        causar demora inicial. Se isso incomodar, você pode instalar a versão .deb:
        <code>sudo snap remove firefox</code> e depois instalar pelo repositório da Mozilla.
      </AlertBox>

      <h3>Gerenciando Canais de Atualização</h3>
      <CodeBlock
        title="Canais (channels) do Snap"
        code={`# Cada snap tem canais: stable, candidate, beta, edge
# stable = versão estável (padrão)
# candidate = próxima versão estável, para testes
# beta = funcionalidades novas, pode ter bugs
# edge = build mais recente do código fonte, instável

# Instalar em canal específico
sudo snap install brave --channel=beta

# Mudar o canal de um snap instalado
sudo snap switch spotify --channel=beta
sudo snap refresh spotify

# Ver qual canal está sendo usado
snap info spotify | grep tracking`}
      />

      <h2>Flatpak: O Formato Universal</h2>
      <p>
        Flatpak é o padrão da comunidade Linux (apoiado por Red Hat, Fedora, GNOME). O
        Flathub é o repositório central e maior loja de aplicativos para Flatpak.
      </p>

      <h3>Instalando o Flatpak</h3>
      <CodeBlock
        title="Configurar Flatpak e Flathub"
        code={`# Instalar o Flatpak
sudo apt install flatpak

# Instalar o plugin do GNOME Software (para integração com a Loja de Apps)
sudo apt install gnome-software-plugin-flatpak

# Adicionar o repositório Flathub (principal fonte de Flatpaks)
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# IMPORTANTE: Após adicionar o Flathub, reinicie o sistema
# para que os aplicativos apareçam no GNOME Software`}
      />

      <h3>Comandos Flatpak</h3>
      <CodeBlock
        title="Gerenciando flatpaks"
        code={`# Buscar aplicativo no Flathub
flatpak search firefox

# Instalar aplicativo do Flathub
flatpak install flathub org.mozilla.firefox
flatpak install flathub com.spotify.Client
flatpak install flathub com.discordapp.Discord
flatpak install flathub org.videolan.VLC

# Você pode confirmar com "y" ou aceitar automaticamente com -y:
flatpak install -y flathub com.spotify.Client

# Listar flatpaks instalados
flatpak list

# Executar um flatpak
flatpak run com.spotify.Client

# Atualizar todos os flatpaks
flatpak update

# Atualizar um flatpak específico
flatpak update com.spotify.Client

# Remover um flatpak
flatpak uninstall com.spotify.Client

# Remover flatpaks não utilizados (runtimes órfãos)
flatpak uninstall --unused

# Informações de um flatpak instalado
flatpak info com.spotify.Client`}
      />

      <h3>Flatpak e Permissões</h3>
      <CodeBlock
        title="Gerenciar permissões de flatpaks"
        code={`# Instalar Flatseal para gerenciar permissões graficamente
flatpak install flathub com.github.tchx84.Flatseal

# Ver permissões de um aplicativo
flatpak info --show-permissions com.spotify.Client

# Dar permissão para acessar um diretório específico
flatpak override --user --filesystem=/home/joao/Musicas com.spotify.Client

# Remover permissão de acesso à câmera
flatpak override --user --nodevice=all com.discordapp.Discord

# Resetar todas as permissões de um app para o padrão
flatpak override --user --reset com.spotify.Client`}
      />

      <h2>Snap vs Flatpak vs APT: Quando Usar Cada Um?</h2>
      <AlertBox type="info" title="Guia prático de escolha">
        <ul className="mt-1 mb-0">
          <li><strong>APT (.deb)</strong>: Para ferramentas do sistema, bibliotecas, servidores e aplicativos
          que precisam de integração profunda com o sistema. Mais rápido, mais confiável, sem overhead de isolamento.</li>
          <li><strong>Snap</strong>: Para aplicativos proprietários como Spotify, Discord, e para ferramentas
          de desenvolvimento (VS Code, JetBrains IDEs). Vantagem: atualização automática.</li>
          <li><strong>Flatpak</strong>: Para aplicativos de terceiros onde você quer controle fino de permissões.
          Flathub tem uma curadoria rigorosa. Preferido pela comunidade Linux em geral.</li>
        </ul>
      </AlertBox>

      <h2>GNOME Software: A Loja de Aplicativos</h2>
      <p>
        O <strong>GNOME Software</strong> é a loja de aplicativos gráfica do Ubuntu. Com Flatpak
        e Snap configurados, ele exibe todos os tipos de pacotes em uma interface unificada.
        Você pode buscar, instalar, atualizar e remover aplicativos clicando — sem precisar de
        linha de comando.
      </p>
      <CodeBlock
        title="Abrir a loja de aplicativos"
        code={`# Via Activities → "Centro de Programas" ou "Software"
# Ou via terminal:
gnome-software

# Para forçar atualização de todos os apps instalados (snap + flatpak + apt):
gnome-software --mode=updates`}
      />

      <h2>Desinstalação Completa</h2>
      <CodeBlock
        title="Remover snap e flatpak limpos"
        code={`# Remover snap com dados do usuário também:
sudo snap remove --purge spotify

# Remover flatpak com dados do usuário:
flatpak uninstall com.spotify.Client
rm -rf ~/.var/app/com.spotify.Client  # Dados do usuário

# Limpar runtimes Flatpak não usados:
flatpak uninstall --unused`}
      />
    </PageContainer>
  );
}
