import{j as o}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as r}from"./CodeBlock-DEDRw1y6.js";import{A as e}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return o.jsxs(a,{title:"Xorg (X11)",subtitle:"O servidor gráfico X11: instalação, configuração, drivers de vídeo, multi-monitor e xrandr no Arch Linux.",difficulty:"intermediario",timeToRead:"20 min",children:[o.jsx("h2",{children:"O que é o Xorg?"}),o.jsxs("p",{children:["O ",o.jsx("strong",{children:"Xorg"})," (X.Org Server) é a implementação mais usada do protocolo X Window System (X11). Ele é o servidor gráfico que permite usar ambientes de desktop, window managers e aplicações gráficas. Embora o Wayland esteja crescendo, o Xorg ainda é necessário para muitas aplicações e drivers."]}),o.jsx(r,{title:"Instalar Xorg",code:`# Instalação mínima (recomendado)
sudo pacman -S xorg-server xorg-xinit

# Instalação completa (inclui utilitários extras)
sudo pacman -S xorg

# Instalar também (útil)
sudo pacman -S xorg-xrandr xorg-xinput xorg-xdpyinfo`}),o.jsx("h2",{children:"Drivers de Vídeo"}),o.jsx(r,{title:"Instalar drivers de vídeo",code:`# Identificar sua placa de vídeo
lspci -v | grep -A 5 VGA

# Intel
sudo pacman -S mesa intel-media-driver
# ou para GPUs Intel mais antigas:
sudo pacman -S mesa xf86-video-intel

# AMD (Radeon)
sudo pacman -S mesa xf86-video-amdgpu vulkan-radeon

# NVIDIA (driver proprietário)
sudo pacman -S nvidia nvidia-utils nvidia-settings
# Para kernel LTS:
sudo pacman -S nvidia-lts

# NVIDIA (driver open-source nouveau)
sudo pacman -S mesa xf86-video-nouveau

# Virtual machine (VirtualBox, VMware, QEMU)
sudo pacman -S mesa xf86-video-vmware
# ou
sudo pacman -S mesa xf86-video-qxl`}),o.jsx(e,{type:"warning",title:"NVIDIA e Wayland",children:"Os drivers proprietários NVIDIA historicamente tiveram problemas com Wayland. Se usar NVIDIA, o Xorg pode ser mais estável. Versões recentes (535+) do driver melhoraram significativamente o suporte a Wayland."}),o.jsx("h2",{children:"Configuração do Xorg"}),o.jsxs("p",{children:["O Xorg se auto-configura na maioria dos casos. Quando precisar de configuração manual, use arquivos em ",o.jsx("code",{children:"/etc/X11/xorg.conf.d/"}),"."]}),o.jsx(r,{title:"Gerar configuração inicial",code:`# Gerar xorg.conf automaticamente (necessário parar o X)
sudo Xorg :0 -configure
# Gera /root/xorg.conf.new

# Copiar para o local correto
sudo cp /root/xorg.conf.new /etc/X11/xorg.conf

# Método preferido: usar snippets em xorg.conf.d/
ls /etc/X11/xorg.conf.d/
# Cada arquivo .conf neste diretório é carregado automaticamente`}),o.jsx(r,{title:"Configurar teclado no Xorg",code:`# /etc/X11/xorg.conf.d/00-keyboard.conf
Section "InputClass"
    Identifier "keyboard"
    MatchIsKeyboard "on"
    Option "XkbLayout" "br"
    Option "XkbModel" "abnt2"
    Option "XkbOptions" "caps:escape,terminate:ctrl_alt_bksp"
EndSection`}),o.jsx(r,{title:"Configurar touchpad",code:`# Instalar driver do touchpad
sudo pacman -S xf86-input-libinput

# /etc/X11/xorg.conf.d/30-touchpad.conf
Section "InputClass"
    Identifier "touchpad"
    MatchIsTouchpad "on"
    Driver "libinput"
    Option "Tapping" "on"
    Option "TappingDrag" "on"
    Option "NaturalScrolling" "on"
    Option "ScrollMethod" "twofinger"
    Option "AccelSpeed" "0.3"
    Option "DisableWhileTyping" "on"
EndSection`}),o.jsx("h2",{children:"xrandr — Gerenciar Monitores"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"xrandr"})," é a ferramenta para configurar resolução, taxa de atualização, posição e orientação de monitores no X11."]}),o.jsx(r,{title:"Comandos básicos do xrandr",code:`# Ver monitores e resoluções disponíveis
xrandr

# Alterar resolução
xrandr --output HDMI-1 --mode 1920x1080

# Alterar resolução e taxa de atualização
xrandr --output HDMI-1 --mode 2560x1440 --rate 144

# Desligar um monitor
xrandr --output VGA-1 --off

# Ligar monitor com resolução automática
xrandr --output HDMI-1 --auto`}),o.jsx(r,{title:"Multi-monitor com xrandr",code:`# Monitor à direita do principal
xrandr --output HDMI-1 --right-of eDP-1 --auto

# Monitor à esquerda
xrandr --output HDMI-1 --left-of eDP-1 --auto

# Monitor acima
xrandr --output HDMI-1 --above eDP-1 --auto

# Espelhar (mesmo conteúdo)
xrandr --output HDMI-1 --same-as eDP-1 --auto

# Definir monitor primário
xrandr --output eDP-1 --primary

# Configuração complexa (3 monitores)
xrandr --output eDP-1 --primary --mode 1920x1080 --pos 0x0 \\
       --output HDMI-1 --mode 2560x1440 --pos 1920x0 \\
       --output DP-1 --mode 1920x1080 --pos 4480x0`}),o.jsx(r,{title:"Rotação de tela",code:`# Rotação normal
xrandr --output HDMI-1 --rotate normal

# 90 graus (esquerda)
xrandr --output HDMI-1 --rotate left

# 90 graus (direita)
xrandr --output HDMI-1 --rotate right

# 180 graus (invertido)
xrandr --output HDMI-1 --rotate inverted`}),o.jsx("h3",{children:"Tornar Configuração Permanente"}),o.jsx(r,{title:"Persistir configuração de xrandr",code:`# Método 1: Script no ~/.xprofile (executado no login gráfico)
echo 'xrandr --output HDMI-1 --right-of eDP-1 --auto' >> ~/.xprofile

# Método 2: Usar arandr (interface gráfica para xrandr)
sudo pacman -S arandr
arandr  # Configure visualmente e salve como script

# Método 3: Arquivo xorg.conf.d
# /etc/X11/xorg.conf.d/10-monitor.conf
Section "Monitor"
    Identifier "HDMI-1"
    Option "RightOf" "eDP-1"
    Option "PreferredMode" "2560x1440"
EndSection`}),o.jsx("h2",{children:"xinit e .xinitrc"}),o.jsx(r,{title:"Iniciar X sem display manager",code:`# Instalar xinit
sudo pacman -S xorg-xinit

# Criar ~/.xinitrc
cat > ~/.xinitrc << 'EOF'
#!/bin/sh

# Carregar recursos
[ -f ~/.Xresources ] && xrdb -merge ~/.Xresources

# Configurar teclado
setxkbmap -layout br -model abnt2

# Configurar monitores
xrandr --output HDMI-1 --right-of eDP-1 --auto

# Iniciar window manager
exec i3
# ou: exec bspwm
# ou: exec openbox-session
# ou: exec startxfce4
EOF

chmod +x ~/.xinitrc

# Iniciar o X
startx`}),o.jsx("h2",{children:"Diagnóstico"}),o.jsx(r,{title:"Ferramentas de diagnóstico do Xorg",code:`# Ver informações do display
xdpyinfo | head -30

# Ver DPI
xdpyinfo | grep -B2 resolution

# Ver log do Xorg
cat /var/log/Xorg.0.log | grep -E "(EE|WW)"

# Listar dispositivos de entrada
xinput list

# Ver propriedades de um dispositivo
xinput list-props "pointer:Logitech G502"

# Testar teclas
xev  # Mostra eventos de teclado/mouse em tempo real

# Listar extensões do X
xdpyinfo -ext all | head -50`}),o.jsx(e,{type:"info",title:"Xorg vs Wayland",children:"O Wayland é o sucessor do X11, com melhor segurança, performance e suporte a HiDPI. Porém, o Xorg ainda é necessário para: aplicações que não suportam Wayland nativamente (rodam via XWayland), drivers NVIDIA mais antigos, e alguns softwares como gravadores de tela. Muitos desktops modernos (GNOME, KDE, Sway, Hyprland) já suportam ambos."})]})}export{l as default};
