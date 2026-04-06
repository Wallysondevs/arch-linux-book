import{j as a}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as i}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return a.jsxs(o,{title:"Tiling Window Managers",subtitle:"i3, Sway, Hyprland e bspwm — organize suas janelas sem mouse, com produtividade máxima. Entenda a filosofia dos tiling WMs e configure do zero.",difficulty:"intermediario",timeToRead:"20 min",children:[a.jsx("h2",{children:"O que são Tiling Window Managers?"}),a.jsx("p",{children:'Tiling Window Managers (TWMs) organizam janelas automaticamente em "tiles" (azulejos), sem sobreposição. Diferente dos ambientes tradicionais (GNOME, KDE) onde você arrasta janelas com o mouse, nos TWMs as janelas ocupam todo o espaço disponível e são gerenciadas principalmente pelo teclado.'}),a.jsx("p",{children:"Vantagens:"}),a.jsxs("ul",{children:[a.jsx("li",{children:"Máxima eficiência de tela — cada pixel é usado"}),a.jsx("li",{children:"Controle total pelo teclado (muito mais rápido)"}),a.jsx("li",{children:"Consumo mínimo de recursos"}),a.jsx("li",{children:"Altamente personalizáveis"}),a.jsx("li",{children:"Workflow focado e sem distrações"})]}),a.jsx("h2",{children:"i3 (X11)"}),a.jsx("p",{children:"O i3 é o TWM mais popular. Simples, bem documentado, configurável via arquivo de texto. Funciona no X11 (não suporta Wayland nativamente)."}),a.jsx(e,{title:"Instalar e configurar i3",code:`# Instalar i3 e dependências
sudo pacman -S i3-wm i3status i3blocks dmenu
# Ou pacote completo:
sudo pacman -S i3-gaps    # i3 com suporte a gaps entre janelas

# Ferramentas complementares essenciais
sudo pacman -S     alacritty      # Terminal (ou kitty, xterm)
    rofi           # Launcher de aplicativos (melhor que dmenu)
    picom          # Compositor (transparência, sombras)
    nitrogen       # Wallpaper
    dunst          # Notificações
    xclip          # Clipboard
    brightnessctl  # Controle de brilho
    playerctl       # Controle de mídia

# Configuração padrão
mkdir -p ~/.config/i3
cp /etc/i3/config ~/.config/i3/config`}),a.jsx(e,{title:"~/.config/i3/config - Configurações essenciais",code:`# Tecla modificadora (Mod1=Alt, Mod4=Super/Windows)
set $mod Mod4

# Terminal favorito
set $term alacritty

# Launcher
set $menu rofi -show run

# Fontes
font pango:JetBrains Mono 10

# Layout padrão
workspace_layout tabbed

# Teclas essenciais
bindsym $mod+Return exec $term               # Abrir terminal
bindsym $mod+d exec $menu                    # Launcher
bindsym $mod+Shift+q kill                    # Fechar janela
bindsym $mod+Shift+r restart                 # Reiniciar i3
bindsym $mod+Shift+e exec i3-nagbar -t warning -m 'Sair do i3?'     -B 'Sim, sair' 'i3-msg exit'

# Navegação entre janelas
bindsym $mod+h focus left
bindsym $mod+j focus down
bindsym $mod+k focus up
bindsym $mod+l focus right

# Mover janelas
bindsym $mod+Shift+h move left
bindsym $mod+Shift+j move down
bindsym $mod+Shift+k move up
bindsym $mod+Shift+l move right

# Layout
bindsym $mod+b layout splith         # Split horizontal
bindsym $mod+v layout splitv         # Split vertical
bindsym $mod+s layout stacking       # Empilhado
bindsym $mod+w layout tabbed         # Abas
bindsym $mod+e layout toggle split   # Alternar splits

# Fullscreen
bindsym $mod+f fullscreen toggle

# Flutuante
bindsym $mod+Shift+space floating toggle
bindsym $mod+space focus mode_toggle

# Workspaces
set $ws1 "1"
set $ws2 "2"
set $ws3 "3"
set $ws4 "4"

bindsym $mod+1 workspace number $ws1
bindsym $mod+2 workspace number $ws2
bindsym $mod+3 workspace number $ws3
bindsym $mod+4 workspace number $ws4

bindsym $mod+Shift+1 move container to workspace number $ws1
bindsym $mod+Shift+2 move container to workspace number $ws2

# Auto-start
exec --no-startup-id picom -b         # Compositor
exec --no-startup-id nitrogen --restore  # Wallpaper
exec --no-startup-id dunst              # Notificações

# Barra de status
bar {
    status_command i3status
    position top
    colors {
        background #0d1117
        focused_workspace  #1f6feb #1f6feb #ffffff
        inactive_workspace #161b22 #161b22 #888888
    }
}`}),a.jsx("h2",{children:"Sway (Wayland)"}),a.jsx("p",{children:"O Sway é compatível com a configuração do i3, mas roda em Wayland. É a escolha natural para quem quer migrar do i3 para Wayland."}),a.jsx(e,{title:"Instalar e configurar Sway",code:`# Instalar Sway e complementos
sudo pacman -S sway swaybar swaylock swayidle waybar     foot             # Terminal nativo Wayland
    wofi             # Launcher Wayland
    mako             # Notificações Wayland
    grim             # Screenshots
    slurp            # Seleção de área
    wl-clipboard      # Clipboard Wayland

# Copiar config base do i3 (compatível!)
mkdir -p ~/.config/sway
cp /etc/sway/config ~/.config/sway/config

# OU copiar do i3 (maioria das opções são iguais)
cp ~/.config/i3/config ~/.config/sway/config

# Diferenças principais do Sway vs i3:
# $term = foot (ou qualquer terminal Wayland)
# Screenshot: grim -g "$(slurp)" screenshot.png
# Screen lock: swaylock -f -c 000000
# Status bar: waybar (ou swaystatus)

# Iniciar Sway (do TTY, sem DM)
sway`}),a.jsx("h2",{children:"Hyprland (Wayland Moderno)"}),a.jsx("p",{children:"Hyprland é o TWM Wayland mais popular atualmente. Tem animações suaves, visual impressionante e é altamente configurável."}),a.jsx(e,{title:"Instalar Hyprland",code:`# Instalar Hyprland
sudo pacman -S hyprland

# Ferramentas recomendadas
sudo pacman -S     kitty           # Terminal
    wofi            # Launcher
    waybar          # Status bar
    mako            # Notificações
    grim slurp      # Screenshots
    hyprpaper       # Wallpaper (AUR)
    swaylock        # Lock screen
    xdg-desktop-portal-hyprland  # Portais

# Configuração inicial
mkdir -p ~/.config/hypr
# Copiar config exemplo
cp /usr/share/hyprland/hyprland.conf ~/.config/hypr/hyprland.conf

# Editar configuração
nano ~/.config/hypr/hyprland.conf`}),a.jsx(e,{title:"~/.config/hypr/hyprland.conf básico",code:`# Monitor
monitor=,preferred,auto,1

# Programas padrão
$terminal = kitty
$fileManager = dolphin
$menu = wofi --show drun

# Autostart
exec-once = waybar &
exec-once = mako &
exec-once = hyprpaper &

# Aparência
general {
    gaps_in = 5
    gaps_out = 10
    border_size = 2
    col.active_border = rgba(1e66f5ee) rgba(04a5e5ee) 45deg
    col.inactive_border = rgba(595959aa)
    layout = dwindle
}

decoration {
    rounding = 10
    blur { enabled = true; size = 3; passes = 1 }
    drop_shadow = true
    shadow_range = 4
    shadow_render_power = 3
}

animations {
    enabled = true
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 7, myBezier
    animation = windowsOut, 1, 7, default, popin 80%
    animation = fade, 1, 7, default
    animation = workspaces, 1, 6, default
}

# Keybindings
$mainMod = SUPER

bind = $mainMod, Return, exec, $terminal
bind = $mainMod, Q, killactive
bind = $mainMod, D, exec, $menu
bind = $mainMod, F, fullscreen

# Movimento entre janelas
bind = $mainMod, H, movefocus, l
bind = $mainMod, L, movefocus, r
bind = $mainMod, K, movefocus, u
bind = $mainMod, J, movefocus, d

# Workspaces
bind = $mainMod, 1, workspace, 1
bind = $mainMod, 2, workspace, 2
bind = $mainMod SHIFT, 1, movetoworkspace, 1
bind = $mainMod SHIFT, 2, movetoworkspace, 2`}),a.jsxs(i,{type:"info",title:"Status Bar: waybar",children:["O waybar é a status bar mais popular para TWMs Wayland. Altamente personalizável com módulos para relógio, rede, áudio, bateria, workspaces, etc. Configure em",a.jsx("code",{children:"~/.config/waybar/config"})," e ",a.jsx("code",{children:"~/.config/waybar/style.css"}),"."]})]})}export{p as default};
