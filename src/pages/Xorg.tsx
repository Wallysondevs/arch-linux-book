import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Xorg() {
  return (
    <PageContainer
      title="Xorg (X11)"
      subtitle="O servidor gráfico X11: instalação, configuração, drivers de vídeo, multi-monitor e xrandr no Arch Linux."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>O que é o Xorg?</h2>
      <p>
        O <strong>Xorg</strong> (X.Org Server) é a implementação mais usada do protocolo X Window System (X11).
        Ele é o servidor gráfico que permite usar ambientes de desktop, window managers e aplicações gráficas.
        Embora o Wayland esteja crescendo, o Xorg ainda é necessário para muitas aplicações e drivers.
      </p>

      <CodeBlock
        title="Instalar Xorg"
        code={`# Instalação mínima (recomendado)
sudo pacman -S xorg-server xorg-xinit

# Instalação completa (inclui utilitários extras)
sudo pacman -S xorg

# Instalar também (útil)
sudo pacman -S xorg-xrandr xorg-xinput xorg-xdpyinfo`}
      />

      <h2>Drivers de Vídeo</h2>

      <CodeBlock
        title="Instalar drivers de vídeo"
        code={`# Identificar sua placa de vídeo
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
sudo pacman -S mesa xf86-video-qxl`}
      />

      <AlertBox type="warning" title="NVIDIA e Wayland">
        Os drivers proprietários NVIDIA historicamente tiveram problemas com Wayland.
        Se usar NVIDIA, o Xorg pode ser mais estável. Versões recentes (535+) do driver
        melhoraram significativamente o suporte a Wayland.
      </AlertBox>

      <h2>Configuração do Xorg</h2>
      <p>
        O Xorg se auto-configura na maioria dos casos. Quando precisar de configuração manual,
        use arquivos em <code>/etc/X11/xorg.conf.d/</code>.
      </p>

      <CodeBlock
        title="Gerar configuração inicial"
        code={`# Gerar xorg.conf automaticamente (necessário parar o X)
sudo Xorg :0 -configure
# Gera /root/xorg.conf.new

# Copiar para o local correto
sudo cp /root/xorg.conf.new /etc/X11/xorg.conf

# Método preferido: usar snippets em xorg.conf.d/
ls /etc/X11/xorg.conf.d/
# Cada arquivo .conf neste diretório é carregado automaticamente`}
      />

      <CodeBlock
        title="Configurar teclado no Xorg"
        code={`# /etc/X11/xorg.conf.d/00-keyboard.conf
Section "InputClass"
    Identifier "keyboard"
    MatchIsKeyboard "on"
    Option "XkbLayout" "br"
    Option "XkbModel" "abnt2"
    Option "XkbOptions" "caps:escape,terminate:ctrl_alt_bksp"
EndSection`}
      />

      <CodeBlock
        title="Configurar touchpad"
        code={`# Instalar driver do touchpad
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
EndSection`}
      />

      <h2>xrandr — Gerenciar Monitores</h2>
      <p>
        O <code>xrandr</code> é a ferramenta para configurar resolução, taxa de atualização,
        posição e orientação de monitores no X11.
      </p>

      <CodeBlock
        title="Comandos básicos do xrandr"
        code={`# Ver monitores e resoluções disponíveis
xrandr

# Alterar resolução
xrandr --output HDMI-1 --mode 1920x1080

# Alterar resolução e taxa de atualização
xrandr --output HDMI-1 --mode 2560x1440 --rate 144

# Desligar um monitor
xrandr --output VGA-1 --off

# Ligar monitor com resolução automática
xrandr --output HDMI-1 --auto`}
      />

      <CodeBlock
        title="Multi-monitor com xrandr"
        code={`# Monitor à direita do principal
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
       --output DP-1 --mode 1920x1080 --pos 4480x0`}
      />

      <CodeBlock
        title="Rotação de tela"
        code={`# Rotação normal
xrandr --output HDMI-1 --rotate normal

# 90 graus (esquerda)
xrandr --output HDMI-1 --rotate left

# 90 graus (direita)
xrandr --output HDMI-1 --rotate right

# 180 graus (invertido)
xrandr --output HDMI-1 --rotate inverted`}
      />

      <h3>Tornar Configuração Permanente</h3>
      <CodeBlock
        title="Persistir configuração de xrandr"
        code={`# Método 1: Script no ~/.xprofile (executado no login gráfico)
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
EndSection`}
      />

      <h2>xinit e .xinitrc</h2>

      <CodeBlock
        title="Iniciar X sem display manager"
        code={`# Instalar xinit
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
startx`}
      />

      <h2>Diagnóstico</h2>

      <CodeBlock
        title="Ferramentas de diagnóstico do Xorg"
        code={`# Ver informações do display
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
xdpyinfo -ext all | head -50`}
      />

      <AlertBox type="info" title="Xorg vs Wayland">
        O Wayland é o sucessor do X11, com melhor segurança, performance e suporte a HiDPI.
        Porém, o Xorg ainda é necessário para: aplicações que não suportam Wayland nativamente 
        (rodam via XWayland), drivers NVIDIA mais antigos, e alguns softwares como gravadores de tela.
        Muitos desktops modernos (GNOME, KDE, Sway, Hyprland) já suportam ambos.
      </AlertBox>
    </PageContainer>
  );
}
