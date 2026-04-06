import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Gaming() {
  return (
    <PageContainer
      title="Gaming no Arch Linux"
      subtitle="Steam, Wine, Proton, Lutris e drivers GPU — o Arch Linux é uma excelente plataforma para jogos. Configure tudo para a melhor performance em jogos nativos e Windows."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>O Arch Linux e Gaming</h2>
      <p>
        O Arch Linux se tornou uma das melhores distribuições para jogos por ter sempre os
        drivers mais recentes, o kernel mais novo e as libs mais atualizadas.
        Com Proton/Wine, a maioria dos jogos Windows roda perfeitamente.
      </p>

      <h2>Drivers GPU</h2>
      <h3>AMD (Recomendado para Gaming Linux)</h3>
      <CodeBlock
        title="Instalar drivers AMD"
        code={`# Mesa (driver open-source AMD - já funciona out-of-the-box)
sudo pacman -S mesa lib32-mesa \
    vulkan-radeon lib32-vulkan-radeon \
    libva-mesa-driver lib32-libva-mesa-driver \
    mesa-vdpau lib32-mesa-vdpau

# Para GPUs AMD mais antigas (GCN 1.0-3.0):
sudo pacman -S xf86-video-amdgpu

# ACO (compilador de shaders - já padrão no Mesa)
# Verificar: glxinfo | grep "OpenGL renderer"

# RADV_PERFTEST para features experimentais (opcional)
RADV_PERFTEST=gpl gamescope -- game`}
      />

      <h3>NVIDIA</h3>
      <CodeBlock
        title="Instalar drivers NVIDIA"
        code={`# Driver proprietário NVIDIA (mais performance)
sudo pacman -S nvidia nvidia-utils lib32-nvidia-utils \
    nvidia-settings opencl-nvidia lib32-opencl-nvidia

# Para kernel LTS
sudo pacman -S nvidia-lts

# DKMS (para múltiplos kernels)
sudo pacman -S nvidia-dkms

# Habilitar modeset (necessário para Wayland e PRIME)
# Em /etc/modprobe.d/nvidia.conf:
echo "options nvidia_drm modeset=1 fbdev=1" | sudo tee /etc/modprobe.d/nvidia.conf

# Adicionar ao mkinitcpio
# MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)
sudo mkinitcpio -P

# Verificar driver
nvidia-smi
nvidia-settings`}
      />

      <h2>Steam</h2>
      <CodeBlock
        title="Instalar e configurar Steam"
        code={`# Habilitar repositório multilib (para libs 32-bit)
sudo nano /etc/pacman.conf

# Descomentar:
[multilib]
Include = /etc/pacman.d/mirrorlist

# Atualizar
sudo pacman -Sy

# Instalar Steam
sudo pacman -S steam

# Dependências importantes
sudo pacman -S lib32-systemd \
    lib32-alsa-plugins \
    lib32-libpulse \
    lib32-openal

# Abrir Steam
steam

# Nas configurações do Steam:
# Steam → Configurações → Steam Play
# Habilitar "Enable Steam Play for all other titles"
# Selecionar a versão mais recente do Proton

# Proton Experimental (mais features)
# Instalar via Steam → Biblioteca → Ferramentas → Proton Experimental`}
      />

      <h2>Proton - Jogos Windows no Linux</h2>
      <CodeBlock
        title="Proton e ProtonGE"
        code={`# Proton é fork do Wine otimizado para jogos pela Valve
# Já incluído no Steam, mas versões customizadas têm melhor compatibilidade

# Instalar ProtonGE (Proton GloriousEggroll - mais compatível)
yay -S proton-ge-custom-bin

# Ou manualmente:
mkdir -p ~/.steam/root/compatibilitytools.d
# Baixar de: https://github.com/GloriousEggroll/proton-ge-custom/releases
# Extrair em ~/.steam/root/compatibilitytools.d/

# Verificar ProtonGE no Steam:
# Propriedades do Jogo → Compatibilidade → Forçar uso de ferramenta → GE-ProtonX-XX

# ProtonDB - Compatibilidade de jogos
# https://www.protondb.com
# Consulte antes de comprar um jogo!

# Variáveis de ambiente para debug do Proton
PROTON_LOG=1 %command%       # Habilitar log
PROTON_DUMP_DEBUG_COMMANDS=1 %command%
PROTON_ENABLE_NVAPI=1 %command%  # Para jogos com DLSS`}
      />

      <h2>Lutris - Gerenciador de Jogos</h2>
      <CodeBlock
        title="Instalar e usar Lutris"
        code={`# Instalar Lutris
sudo pacman -S lutris

# Dependências Wine
sudo pacman -S wine wine-mono wine-gecko \
    winetricks \
    lib32-gnutls lib32-libldap lib32-libgpg-error \
    lib32-openal lib32-mpg123

# Lutris baixa scripts de instalação automáticos para:
# - Battle.net (Diablo, WoW, Overwatch)
# - EA App (EA Sports, Apex Legends)
# - Epic Games Store
# - GOG
# - Itch.io
# - Jogos com scripts customizados

# Instalar jogo via Lutris:
# 1. Abrir Lutris
# 2. Buscar o jogo no ícone de pesquisa
# 3. Clicar em Instalar
# 4. Seguir as instruções`}
      />

      <h2>Heroic Games Launcher</h2>
      <CodeBlock
        title="Epic Games e GOG no Linux"
        code={`# Instalar Heroic (frontend para Epic Games Store e GOG)
sudo pacman -S heroic-games-launcher
# ou via Flatpak:
flatpak install flathub com.heroicgameslauncher.hgl

# O Heroic usa Proton/Wine para rodar jogos Windows
# Login com conta Epic Games ou GOG
# Baixar e rodar jogos diretamente`}
      />

      <h2>Otimizações de Performance</h2>
      <CodeBlock
        title="Tweaks para melhor performance em jogos"
        code={`# GameMode - Otimiza sistema durante gaming
sudo pacman -S gamemode lib32-gamemode

# Usar no Steam: adicionar aos parâmetros de lançamento:
# gamemoderun %command%

# Verificar se está ativo
gamemoded -s

# MangoHud - Overlay de performance (FPS, temperatura, etc.)
sudo pacman -S mangohud lib32-mangohud

# Usar no Steam:
# MANGOHUD=1 %command%

# Configurar MangoHud
mkdir -p ~/.config/MangoHud
nano ~/.config/MangoHud/MangoHud.conf`}
      />
      <CodeBlock
        title="~/.config/MangoHud/MangoHud.conf"
        code={`# Posição do overlay
position=top-left

# Informações a exibir
fps
frametime
cpu_stats
gpu_stats
cpu_temp
gpu_temp
ram
vram
time

# Configurações visuais
font_size=24
background_alpha=0.5
round_corners=5`}
      />
      <CodeBlock
        title="Mais otimizações"
        code={`# CPU Governor para performance (durante gaming)
# Ver governor atual
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Mudar para performance
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Automaticamente com cpupower
sudo pacman -S cpupower
sudo systemctl enable --now cpupower
sudo nano /etc/default/cpupower
# governor='performance'

# Swappiness baixa (para sistemas com muita RAM)
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-gaming.conf
sudo sysctl -p /etc/sysctl.d/99-gaming.conf

# Verificar limites do sistema (pode afetar performance)
ulimit -a
# Aumentar limite de arquivos abertos
echo "* soft nofile 1048576" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 1048576" | sudo tee -a /etc/security/limits.conf`}
      />

      <h2>Resolução de Problemas Comuns</h2>
      <CodeBlock
        title="Problemas frequentes em gaming"
        code={`# Jogo não abre / crasha na abertura
# 1. Verificar logs: ~/.steam/steam/logs/
# 2. Executar no terminal para ver erros:
steam -applaunch ID_DO_JOGO

# Erro de libs 32-bit
# Verificar se multilib está habilitado e libs instaladas
sudo pacman -S lib32-glibc lib32-gcc-libs

# DXVK (DirectX 11 → Vulkan) não funciona
# Verificar Vulkan
vulkaninfo | head -20
vkcube    # Deve abrir janela giratória

# Performance ruim
# Verificar driver de vídeo
glxinfo | grep "OpenGL renderer"
# Para NVIDIA, deve mostrar "NVIDIA GeForce..."
# Para AMD, deve mostrar "RADV..."

# Anti-cheat (EAC, BattlEye) bloqueando
# Ver: https://www.protondb.com para compatibilidade
# Muitos jogos com anti-cheat agora suportam Linux nativo

# Verificar compatibilidade antes de comprar
# https://www.protondb.com
# https://store.steampowered.com (filtrar por "Verificado para Steam Deck")`}
      />

      <AlertBox type="success" title="Steam Deck e Arch Linux">
        O Steam Deck usa uma versão do Arch Linux (SteamOS 3)! Isso garante excelente
        compatibilidade de jogos testados para Steam Deck no Arch Linux normal.
        Filtre jogos por "Verificado para Steam Deck" para garantir compatibilidade.
      </AlertBox>
    </PageContainer>
  );
}
