import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Wayland() {
  return (
    <PageContainer
      title="Wayland & X11"
      subtitle="Entenda a diferença entre X11 e Wayland, por que o Wayland é o futuro e como resolver problemas de compatibilidade ao migrar para Wayland no Arch Linux."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <h2>X11 vs Wayland</h2>
      <p>
        O X Window System (X11) é o protocolo de display usado pelo Linux há décadas. O Wayland
        é seu substituto moderno, mais seguro e eficiente.
      </p>
      <h3>X11 (X.Org)</h3>
      <ul>
        <li>Criado em 1984. Arquitetura cliente-servidor com compositor separado.</li>
        <li>Qualquer app pode capturar a tela/teclado de outros apps (problema de segurança)</li>
        <li>Mais latência por causa da arquitetura distribuída</li>
        <li>Suporte universal — quase todo app funciona</li>
        <li>Melhor para acesso remoto (X11 forwarding via SSH)</li>
      </ul>
      <h3>Wayland</h3>
      <ul>
        <li>Criado em 2008. O compositor É o servidor de display.</li>
        <li>Apps isolados — não podem capturar outros apps (mais seguro)</li>
        <li>Menor latência, tear-free por design</li>
        <li>Melhor suporte a multi-monitor com diferentes DPIs</li>
        <li>Escalamento fracionário nativo</li>
        <li>Nem todos os apps suportam ainda (use XWayland como fallback)</li>
      </ul>

      <h2>XWayland: Retrocompatibilidade</h2>
      <p>
        O XWayland é uma implementação do servidor X que roda dentro do Wayland. Permite que
        aplicativos X11 funcionem em sessões Wayland sem modificação.
      </p>
      <CodeBlock
        title="Instalar e verificar XWayland"
        code={`# Instalar XWayland
sudo pacman -S xorg-xwayland

# Verificar se um app está usando Wayland ou XWayland
xlsclients    # Lista apps X11 rodando
# Se o app aparecer aqui, está usando XWayland

# Verificar tipo de sessão
echo $XDG_SESSION_TYPE    # wayland ou x11

# Verificar variáveis de ambiente Wayland
echo $WAYLAND_DISPLAY     # wayland-0 (se em sessão Wayland)
echo $DISPLAY             # :0 (se X11 ou XWayland disponível)`}
      />

      <h2>Forçar Apps para Wayland</h2>
      <CodeBlock
        title="Configurar apps para usar Wayland nativo"
        code={`# Firefox (suporte Wayland nativo)
# Criar/editar arquivo de ambiente:
sudo nano /etc/environment

# Adicionar:
MOZ_ENABLE_WAYLAND=1       # Firefox
QT_QPA_PLATFORM=wayland    # Apps Qt (KDE)
GDK_BACKEND=wayland        # Apps GTK

# Ou para sessão do usuário:
nano ~/.config/environment.d/wayland.conf
# MOZ_ENABLE_WAYLAND=1
# QT_QPA_PLATFORM=wayland:xcb  # wayland com fallback para xcb

# Forçar individualmente ao lançar
MOZ_ENABLE_WAYLAND=1 firefox
QT_QPA_PLATFORM=wayland dolphin`}
      />

      <h2>NVIDIA e Wayland</h2>
      <AlertBox type="warning" title="NVIDIA tem problemas no Wayland">
        Historicamente, NVIDIA tinha péssimo suporte a Wayland. Com drivers 545+ e kernel 6.6+,
        a situação melhorou muito, mas ainda pode haver problemas.
      </AlertBox>
      <CodeBlock
        title="Configurar NVIDIA para Wayland"
        code={`# Verificar versão do driver NVIDIA
nvidia-smi | head -5

# Adicionar parâmetros ao kernel (em /etc/default/grub):
GRUB_CMDLINE_LINUX_DEFAULT="quiet nvidia-drm.modeset=1 nvidia-drm.fbdev=1"
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Para mkinitcpio (adicionar módulos NVIDIA no early boot)
sudo nano /etc/mkinitcpio.conf
# MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)
sudo mkinitcpio -P

# Variáveis de ambiente para NVIDIA + Wayland
# Em /etc/environment:
LIBVA_DRIVER_NAME=nvidia
XDG_SESSION_TYPE=wayland
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
WLR_NO_HARDWARE_CURSORS=1    # Para Sway/wlroots

# Para Hyprland com NVIDIA:
# Na configuração do Hyprland:
env = LIBVA_DRIVER_NAME,nvidia
env = XDG_SESSION_TYPE,wayland
env = GBM_BACKEND,nvidia-drm
env = __GLX_VENDOR_LIBRARY_NAME,nvidia
env = WLR_NO_HARDWARE_CURSORS,1`}
      />

      <h2>Variáveis de Ambiente Importantes</h2>
      <CodeBlock
        title="Variáveis essenciais para Wayland"
        code={`# Arquivo: ~/.config/environment.d/10-wayland.conf
# (Carregado pelo systemd para sessões de usuário)

# Sessão Wayland
XDG_SESSION_TYPE=wayland

# Firefox e browsers baseados em Gecko
MOZ_ENABLE_WAYLAND=1

# Apps Electron (VSCode, Discord, Slack...)
ELECTRON_OZONE_PLATFORM_HINT=wayland
# ou para cada app individualmente:
# code --enable-features=UseOzonePlatform --ozone-platform=wayland

# Apps Qt
QT_QPA_PLATFORM=wayland
QT_WAYLAND_DISABLE_WINDOWDECORATION=1  # Para GNOME/KDE que gerencia decorações

# Apps GTK
GDK_BACKEND=wayland

# Java (para IntelliJ, etc.)
_JAVA_AWT_WM_NONREPARENTING=1
AWT_TOOLKIT=MToolkit

# Tema de cursor
XCURSOR_THEME=Adwaita
XCURSOR_SIZE=24`}
      />

      <h2>Multi-Monitor com Wayland</h2>
      <CodeBlock
        title="Configurar múltiplos monitores"
        code={`# Para Sway: em ~/.config/sway/config
# Listar monitores disponíveis
swaymsg -t get_outputs

# Configurar monitores
output HDMI-A-1 resolution 1920x1080 position 0,0 scale 1
output DP-1 resolution 2560x1440 position 1920,0 scale 1.5

# Monitor primário
output HDMI-A-1 background ~/wallpaper.jpg fill

# Para Hyprland: em ~/.config/hypr/hyprland.conf
monitor=HDMI-A-1,1920x1080@60,0x0,1
monitor=DP-1,2560x1440@144,1920x0,1.5
# Formato: monitor=name,resolution@refresh,position,scale

# Para saber nomes dos monitores:
# Hyprland:
hyprctl monitors

# Sway:
swaymsg -t get_outputs | jq '.[].name'`}
      />

      <h2>Screensharing e Portais</h2>
      <CodeBlock
        title="Configurar screensharing no Wayland"
        code={`# Para screensharing funcionar (Discord, Zoom, Meet...)
# é necessário xdg-desktop-portal

# Para GNOME
sudo pacman -S xdg-desktop-portal xdg-desktop-portal-gnome

# Para KDE
sudo pacman -S xdg-desktop-portal xdg-desktop-portal-kde

# Para Sway/wlroots
sudo pacman -S xdg-desktop-portal xdg-desktop-portal-wlr

# Para Hyprland
sudo pacman -S xdg-desktop-portal-hyprland

# Verificar portais ativos
/usr/lib/xdg-desktop-portal --verbose &

# Para PipeWire (necessário para screensharing)
sudo pacman -S pipewire wireplumber xdg-desktop-portal
systemctl --user enable --now pipewire pipewire-pulse wireplumber`}
      />
    </PageContainer>
  );
}
