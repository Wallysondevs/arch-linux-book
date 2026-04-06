import{j as a}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return a.jsxs(o,{title:"Wayland & X11",subtitle:"Entenda a diferença entre X11 e Wayland, por que o Wayland é o futuro e como resolver problemas de compatibilidade ao migrar para Wayland no Arch Linux.",difficulty:"intermediario",timeToRead:"15 min",children:[a.jsx("h2",{children:"X11 vs Wayland"}),a.jsx("p",{children:"O X Window System (X11) é o protocolo de display usado pelo Linux há décadas. O Wayland é seu substituto moderno, mais seguro e eficiente."}),a.jsx("h3",{children:"X11 (X.Org)"}),a.jsxs("ul",{children:[a.jsx("li",{children:"Criado em 1984. Arquitetura cliente-servidor com compositor separado."}),a.jsx("li",{children:"Qualquer app pode capturar a tela/teclado de outros apps (problema de segurança)"}),a.jsx("li",{children:"Mais latência por causa da arquitetura distribuída"}),a.jsx("li",{children:"Suporte universal — quase todo app funciona"}),a.jsx("li",{children:"Melhor para acesso remoto (X11 forwarding via SSH)"})]}),a.jsx("h3",{children:"Wayland"}),a.jsxs("ul",{children:[a.jsx("li",{children:"Criado em 2008. O compositor É o servidor de display."}),a.jsx("li",{children:"Apps isolados — não podem capturar outros apps (mais seguro)"}),a.jsx("li",{children:"Menor latência, tear-free por design"}),a.jsx("li",{children:"Melhor suporte a multi-monitor com diferentes DPIs"}),a.jsx("li",{children:"Escalamento fracionário nativo"}),a.jsx("li",{children:"Nem todos os apps suportam ainda (use XWayland como fallback)"})]}),a.jsx("h2",{children:"XWayland: Retrocompatibilidade"}),a.jsx("p",{children:"O XWayland é uma implementação do servidor X que roda dentro do Wayland. Permite que aplicativos X11 funcionem em sessões Wayland sem modificação."}),a.jsx(e,{title:"Instalar e verificar XWayland",code:`# Instalar XWayland
sudo pacman -S xorg-xwayland

# Verificar se um app está usando Wayland ou XWayland
xlsclients    # Lista apps X11 rodando
# Se o app aparecer aqui, está usando XWayland

# Verificar tipo de sessão
echo $XDG_SESSION_TYPE    # wayland ou x11

# Verificar variáveis de ambiente Wayland
echo $WAYLAND_DISPLAY     # wayland-0 (se em sessão Wayland)
echo $DISPLAY             # :0 (se X11 ou XWayland disponível)`}),a.jsx("h2",{children:"Forçar Apps para Wayland"}),a.jsx(e,{title:"Configurar apps para usar Wayland nativo",code:`# Firefox (suporte Wayland nativo)
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
QT_QPA_PLATFORM=wayland dolphin`}),a.jsx("h2",{children:"NVIDIA e Wayland"}),a.jsx(r,{type:"warning",title:"NVIDIA tem problemas no Wayland",children:"Historicamente, NVIDIA tinha péssimo suporte a Wayland. Com drivers 545+ e kernel 6.6+, a situação melhorou muito, mas ainda pode haver problemas."}),a.jsx(e,{title:"Configurar NVIDIA para Wayland",code:`# Verificar versão do driver NVIDIA
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
env = WLR_NO_HARDWARE_CURSORS,1`}),a.jsx("h2",{children:"Variáveis de Ambiente Importantes"}),a.jsx(e,{title:"Variáveis essenciais para Wayland",code:`# Arquivo: ~/.config/environment.d/10-wayland.conf
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
XCURSOR_SIZE=24`}),a.jsx("h2",{children:"Multi-Monitor com Wayland"}),a.jsx(e,{title:"Configurar múltiplos monitores",code:`# Para Sway: em ~/.config/sway/config
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
swaymsg -t get_outputs | jq '.[].name'`}),a.jsx("h2",{children:"Screensharing e Portais"}),a.jsx(e,{title:"Configurar screensharing no Wayland",code:`# Para screensharing funcionar (Discord, Zoom, Meet...)
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
systemctl --user enable --now pipewire pipewire-pulse wireplumber`})]})}export{m as default};
