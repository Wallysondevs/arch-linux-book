import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Wine() {
  return (
    <PageContainer
      title="Wine: Programas Windows no Linux"
      subtitle="Execute aplicativos e jogos do Windows no Arch Linux usando Wine, Bottles e Proton."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <h2>O que é Wine?</h2>
      <p>
        <strong>Wine</strong> (Wine Is Not an Emulator) é uma camada de compatibilidade que traduz chamadas 
        de API do Windows para Linux em tempo real. Ele permite rodar muitos programas e jogos do Windows 
        sem uma máquina virtual, com performance quase nativa.
      </p>

      <h2>Instalação</h2>

      <CodeBlock
        title="Instalar Wine"
        code={`# Habilitar repositório multilib (necessário para 32-bit)
# Editar /etc/pacman.conf e descomentar:
# [multilib]
# Include = /etc/pacman.d/mirrorlist
sudo vim /etc/pacman.conf
sudo pacman -Syu

# Instalar Wine
sudo pacman -S wine wine-mono wine-gecko

# Para aplicações 32-bit (a maioria)
sudo pacman -S lib32-mesa lib32-vulkan-icd-loader

# Drivers de vídeo 32-bit
# Intel:
sudo pacman -S lib32-mesa
# AMD:
sudo pacman -S lib32-vulkan-radeon lib32-mesa
# NVIDIA:
sudo pacman -S lib32-nvidia-utils

# Fontes Microsoft (melhora compatibilidade)
sudo pacman -S winetricks
winetricks corefonts`}
      />

      <h2>Configuração Básica</h2>

      <CodeBlock
        title="Configurar Wine"
        code={`# Criar prefix (ambiente Windows) 64-bit
WINEPREFIX=~/.wine wineboot

# Criar prefix 32-bit (para programas mais antigos)
WINEARCH=win32 WINEPREFIX=~/.wine32 wineboot

# Abrir configuração do Wine
winecfg

# Na aba "Applications":
# - Escolher versão do Windows (Windows 10 recomendado)
# Na aba "Graphics":
# - Ajustar DPI se necessário
# Na aba "Audio":
# - Selecionar driver de áudio (PulseAudio/PipeWire)`}
      />

      <h2>Executando Programas</h2>

      <CodeBlock
        title="Rodar programas Windows"
        code={`# Executar um .exe
wine programa.exe

# Executar com prefix específico
WINEPREFIX=~/meuprograma wine programa.exe

# Executar um instalador
wine setup.exe

# Abrir explorador de arquivos do Wine
wine explorer

# Abrir regedit (editor de registro)
wine regedit

# Abrir notepad
wine notepad

# Abrir prompt de comando
wine cmd

# Desinstalar programas
wine uninstaller`}
      />

      <h2>Winetricks</h2>
      <p>
        O <code>winetricks</code> facilita a instalação de bibliotecas, fontes e componentes 
        necessários para muitos programas Windows.
      </p>

      <CodeBlock
        title="Usar winetricks"
        code={`# Interface gráfica
winetricks --gui

# Instalar componentes comuns
winetricks vcrun2019        # Visual C++ Runtime 2019
winetricks dotnet48         # .NET Framework 4.8
winetricks d3dx9            # DirectX 9
winetricks dxvk             # Vulkan-based DirectX 10/11 (melhor para jogos)
winetricks corefonts        # Fontes Microsoft
winetricks allfonts         # Todas as fontes

# Ajustes de configuração
winetricks win10            # Simular Windows 10
winetricks vd=1920x1080     # Desktop virtual com resolução fixa

# Instalar em prefix específico
WINEPREFIX=~/jogos winetricks dxvk vcrun2019`}
      />

      <h2>Bottles — Interface Gráfica para Wine</h2>

      <CodeBlock
        title="Usar Bottles"
        code={`# Instalar via Flatpak (recomendado)
flatpak install flathub com.usebottles.bottles

# Ou via AUR
yay -S bottles

# O Bottles oferece:
# - Interface gráfica bonita
# - Prefixes isolados por programa
# - Instalação automática de dependências
# - Runners pré-configurados (Wine, Proton, etc.)
# - Categorias: Gaming, Software, Custom`}
      />

      <h2>Proton (Steam)</h2>
      <p>
        O <strong>Proton</strong> é o Wine modificado pela Valve para o Steam. 
        Ele inclui DXVK, VKD3D e patches extras para melhor compatibilidade com jogos.
      </p>

      <CodeBlock
        title="Configurar Proton no Steam"
        code={`# 1. Instalar Steam
sudo pacman -S steam

# 2. No Steam:
# Settings → Compatibility → Enable Steam Play for all titles
# Escolher versão do Proton (mais recente geralmente é melhor)

# 3. Verificar compatibilidade de jogos:
# https://www.protondb.com/
# ProtonDB tem reports da comunidade para cada jogo

# Proton GE (versão com patches extras da comunidade)
yay -S proton-ge-custom-bin
# Ou baixar de: https://github.com/GloriousEggroll/proton-ge-custom`}
      />

      <h2>Lutris — Launcher de Jogos</h2>

      <CodeBlock
        title="Usar Lutris para jogos"
        code={`# Instalar
sudo pacman -S lutris

# O Lutris oferece:
# - Scripts de instalação prontos para centenas de jogos
# - Suporte a GOG, Epic Games, Battle.net, etc.
# - Gerenciamento automático de Wine/Proton
# - Configuração de DXVK, VKD3D, etc.

# Instalar jogo via Lutris:
# 1. Abrir Lutris
# 2. Buscar o jogo em lutris.net
# 3. Clicar em "Install"
# 4. Seguir as instruções`}
      />

      <h2>Troubleshooting</h2>

      <CodeBlock
        title="Resolver problemas comuns do Wine"
        code={`# Ver logs detalhados
WINEDEBUG=+all wine programa.exe 2>&1 | tee wine.log

# Logs apenas de erros
WINEDEBUG=err wine programa.exe

# Programa com tela preta:
# → Tentar com desktop virtual
wine explorer /desktop=MeuApp,1920x1080 programa.exe

# Programa não inicia:
# → Verificar dependências
winetricks vcrun2019 d3dx9

# Fonte/texto estranho:
winetricks corefonts

# Áudio não funciona:
# → Verificar PipeWire/PulseAudio
# → Em winecfg, aba Audio, testar cada driver

# Resetar prefix (começar do zero)
rm -rf ~/.wine
wineboot

# Verificar compatibilidade:
# https://appdb.winehq.org/ — Database de compatibilidade
# https://www.protondb.com/ — Para jogos Steam`}
      />

      <AlertBox type="info" title="Performance">
        Para melhor performance em jogos, instale <strong>DXVK</strong> (traduz DirectX 9-11 para Vulkan)
        e <strong>VKD3D-proton</strong> (traduz DirectX 12 para Vulkan). 
        O Proton e Bottles já incluem esses componentes automaticamente.
      </AlertBox>
    </PageContainer>
  );
}
