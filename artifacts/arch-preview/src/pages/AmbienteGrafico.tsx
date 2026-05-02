import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function AmbienteGrafico() {
  return (
    <PageContainer
      title="Ambiente Gráfico"
      subtitle="Xorg vs Wayland, Display Managers, Desktop Environments e Window Managers — escolha, instale e teste com saídas reais."
      difficulty="intermediario"
      timeToRead="30 min"
      category="Instalação"
    >
      <h2>Visão geral — três peças</h2>
      <p>
        Para sair do tty preto e ter uma interface gráfica, três componentes precisam coexistir:
      </p>

      <OutputBlock
        title="a stack gráfica em três camadas"
        output={`┌──────────────────────────────────────────────┐
│  Display Manager  (gdm, sddm, lightdm, ly)   │  ← tela de login
├──────────────────────────────────────────────┤
│  Desktop Environment  /  Window Manager      │  ← interface
│  (GNOME, KDE, XFCE, i3, Sway, Hyprland...)   │
├──────────────────────────────────────────────┤
│  Display Server  (Xorg / Wayland)            │  ← grafico cru
├──────────────────────────────────────────────┤
│  Driver de GPU  (mesa / nvidia)              │  ← hardware
└──────────────────────────────────────────────┘`}
        annotations={[
          { line: 1, note: "opcional — dá pra usar startx" },
          { line: 3, note: "DE = pacote completo; WM = só janelas" },
          { line: 5, note: "Wayland é o futuro" },
        ]}
      />

      <h2>1. Confirmar o hardware</h2>

      <TerminalBlock
        command="lspci -k | grep -EA3 'VGA|3D|Display'"
        output={`00:02.0 VGA compatible controller: Intel Corporation Alder Lake-P GT2 [Iris Xe Graphics] (rev 0c)
        DeviceName: Onboard - Video
        Subsystem: Lenovo Device 230f
        Kernel driver in use: i915
        Kernel modules: i915, xe`}
      />

      <OutputBlock
        title="o que isso quer dizer"
        output={`00:02.0  → endereço PCI
Intel ... Iris Xe Graphics
Kernel driver in use: i915
Kernel modules: i915, xe`}
        annotations={[
          { line: 0, note: "slot na placa-mãe" },
          { line: 1, note: "fabricante e modelo" },
          { line: 2, note: "driver carregado AGORA" },
          { line: 3, note: "drivers disponíveis" },
        ]}
      />

      <h2>2. Xorg vs Wayland</h2>

      <TerminalBlock
        command="echo $XDG_SESSION_TYPE"
        output="wayland"
        comment="depois de logar, este envvar te diz onde você está"
      />

      <TerminalBlock
        command="loginctl show-session $(loginctl | awk '/seat/{print $1}') -p Type -p Remote"
        output={`Type=wayland
Remote=no`}
      />

      <h3>Resumão</h3>

      <OutputBlock
        title="Xorg vs Wayland — escolha consciente"
        output={`Xorg (X11)        Wayland
─────────────────────────────────────────────────
+ ultra compatível       + isolamento de apps (seguro)
+ controle remoto fácil  + sem tearing
+ NVIDIA proprietário    + HiDPI + multi-monitor melhor
- arquitetura antiga     - apps X11 precisam de XWayland
- key-loggers triviais   - controle remoto ainda em evolução`}
      />

      <AlertBox type="info" title="Regra prática">
        AMD/Intel modernos → <strong>Wayland</strong> (GNOME, KDE Plasma 6, Sway, Hyprland).
        NVIDIA antigo ou apps muito antigos → <strong>Xorg</strong>.
      </AlertBox>

      <h2>3. Drivers de vídeo</h2>

      <TerminalBlock
        command="sudo pacman -S mesa intel-media-driver vulkan-intel"
        output={`Packages (3) intel-media-driver-24.1.5-1  mesa-1:24.0.5-1  vulkan-intel-1:24.0.5-1
Total Download Size:   76.18 MiB
:: Proceed with installation? [Y/n] Y`}
        comment="Intel"
      />

      <TerminalBlock
        command="sudo pacman -S mesa xf86-video-amdgpu vulkan-radeon libva-mesa-driver"
        output={`Packages (4) libva-mesa-driver-24.0.5-1  mesa-1:24.0.5-1
              vulkan-radeon-1:24.0.5-1  xf86-video-amdgpu-23.0.0-1
Total Download Size:   89.42 MiB
:: Proceed with installation? [Y/n] Y`}
        comment="AMD"
      />

      <TerminalBlock
        command="sudo pacman -S nvidia nvidia-utils nvidia-settings"
        output={`Packages (3) nvidia-550.67-12  nvidia-utils-550.67-2  nvidia-settings-550.67-1
Total Download Size:    298.42 MiB
:: Proceed with installation? [Y/n] Y`}
        comment="NVIDIA proprietário"
      />

      <h3>Validação rápida</h3>

      <TerminalBlock
        command="glxinfo -B | head -10"
        output={`name of display: :0
display: :0  screen: 0
direct rendering: {g}Yes{/}
Extended renderer info (GLX_MESA_query_renderer):
    Vendor: Intel (0x8086)
    Device: Mesa Intel(R) Iris(R) Xe Graphics (ADL GT2) (0x46a6)
    Version: 24.0.5
    Accelerated: yes
    Video memory: 7872MB
    Unified memory: yes`}
      />

      <TerminalBlock
        command="vulkaninfo --summary | head -15"
        output={`========
VULKANINFO
========

Vulkan Instance Version: 1.3.275

GPU0:
        apiVersion         = 1.3.275
        driverVersion      = 24.0.5
        vendorID           = 0x8086
        deviceID           = 0x46a6
        deviceType         = PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU
        deviceName         = Intel(R) Graphics (ADL GT2)
        driverName         = Intel open-source Mesa driver`}
      />

      <h2>4. Desktop Environments</h2>

      <h3>GNOME (Wayland por padrão)</h3>

      <TerminalBlock
        command="sudo pacman -S gnome gnome-tweaks"
        output={`resolving dependencies...
Packages (158) ... gnome-shell-46.1-1  mutter-46.1-1  gdm-46.1-1
                gnome-control-center-46.1-1  nautilus-46.1-1
                gnome-tweaks-46-1  ...

Total Download Size:    548.42 MiB
Total Installed Size:  1842.51 MiB

:: Proceed with installation? [Y/n] Y`}
      />

      <TerminalBlock
        command="sudo systemctl enable gdm.service"
        output={`Created symlink /etc/systemd/system/display-manager.service → /usr/lib/systemd/system/gdm.service.`}
      />

      <h3>KDE Plasma 6 (Wayland sólido)</h3>

      <TerminalBlock
        command="sudo pacman -S plasma kde-applications sddm"
        output={`Packages (245) plasma-meta-6  plasma-desktop-6.0.4-1  plasma-workspace-6.0.4-1
                sddm-0.21.0-3  konsole-24.02.1-1  dolphin-24.02.1-1
                ...

Total Download Size:    742.18 MiB
Total Installed Size:  2918.42 MiB

:: Proceed with installation? [Y/n] Y`}
      />

      <TerminalBlock
        command="sudo systemctl enable sddm"
        output={`Created symlink /etc/systemd/system/display-manager.service → /usr/lib/systemd/system/sddm.service.`}
      />

      <h3>XFCE (leve, Xorg)</h3>

      <TerminalBlock
        command="sudo pacman -S xfce4 xfce4-goodies lightdm lightdm-gtk-greeter"
        output={`Packages (62) xfce4-meta-1  xfwm4-4.18.0-3  xfce4-panel-4.18.6-1
              xfce4-session-4.18.4-1  thunar-4.18.10-1  lightdm-1:1.32.0-5
              lightdm-gtk-greeter-1:2.0.8-2  ...
Total Download Size:    198.42 MiB`}
      />

      <TerminalBlock
        command="sudo systemctl enable lightdm"
        output={`Created symlink /etc/systemd/system/display-manager.service → /usr/lib/systemd/system/lightdm.service.`}
      />

      <AlertBox type="danger" title="UM display manager por vez">
        Habilitar dois ao mesmo tempo gera conflito no <code>display-manager.service</code>.
        Para trocar: <code>sudo systemctl disable gdm</code> antes de habilitar outro.
      </AlertBox>

      <h2>5. Window Managers (mais leves, mais manuais)</h2>

      <h3>Hyprland (Wayland, animado e tiling)</h3>

      <TerminalBlock
        command="sudo pacman -S hyprland waybar wofi kitty hyprpaper xdg-desktop-portal-hyprland"
        output={`Packages (12) hyprland-0.39.1-1  waybar-0.10.0-1  wofi-1.4.1-2
              kitty-0.34.1-1  hyprpaper-0.7.0-1  xdg-desktop-portal-hyprland-1.3.2-1
              ...
Total Download Size:    78.42 MiB`}
      />

      <TerminalBlock
        command={"mkdir -p ~/.config/hypr && cp /usr/share/hypr/hyprland.conf ~/.config/hypr/"}
        output=""
        comment="copia a config padrão para edição"
      />

      <h3>i3 (Xorg, clássico)</h3>

      <TerminalBlock
        command="sudo pacman -S i3-wm i3status i3lock dmenu rofi alacritty picom feh"
        output={`Packages (8) i3-wm-4.23-1  i3status-2.14-2  i3lock-2.15-1  dmenu-5.3-1
             rofi-1.7.5-3  alacritty-0.13.2-1  picom-11.2-1  feh-3.10.2-1
Total Download Size:    8.42 MiB`}
      />

      <TerminalBlock
        command={'echo "exec i3" > ~/.xinitrc && startx'}
        output={`Xorg X server 21.1.13
... (logs do X) ...
[i3] starting i3 4.23 (2024-03-30, branch \\"4.23\\")`}
      />

      <h3>Sway (i3 para Wayland)</h3>

      <TerminalBlock
        command="sudo pacman -S sway swaybg swaylock swayidle waybar foot wofi grim slurp"
        output={`Packages (9) sway-1:1.9-2  swaybg-1.2.1-1  swaylock-1.7.2-1  swayidle-1.8.0-1
             waybar-0.10.0-1  foot-1.16.2-1  wofi-1.4.1-2
             grim-1.4.1-1  slurp-1.5.0-1
Total Download Size:    7.82 MiB`}
      />

      <h2>6. Display Managers — comparativo rápido</h2>

      <OutputBlock
        title="qual DM usar"
        output={`gdm       casa com GNOME, suporta Wayland nativamente
sddm      padrão do KDE Plasma, temas QML lindos
lightdm   leve, universal, greeters intercambiáveis
ly        TUI no terminal, ultra minimalista, sem deps gráficas`}
        annotations={[
          { line: 0, note: "pesado, mas integrado" },
          { line: 3, note: "ideal pra WMs sem DE" },
        ]}
      />

      <TerminalBlock
        command="systemctl status display-manager"
        output={`● gdm.service - GNOME Display Manager
     Loaded: loaded (/usr/lib/systemd/system/gdm.service; {g}enabled{/}; preset: disabled)
     Active: {g}active (running){/} since Wed 2024-04-17 12:45:01 -03; 5min ago
   Main PID: 1842 (gdm)
      Tasks: 4 (limit: 9387)
     Memory: 12.4M (peak: 18.1M)
        CPU: 1.234s
     CGroup: /system.slice/gdm.service
             └─1842 /usr/bin/gdm

Apr 17 12:45:02 meu-arch gdm[1842]: GLib-Message: Using systemd for session management`}
      />

      <h2>7. Sem display manager — startx</h2>

      <TerminalBlock
        command="sudo pacman -S xorg-server xorg-xinit"
        output={`Packages (15) xorg-server-21.1.13-2  xorg-xinit-1.4.2-3  ...
Total Download Size:    32.42 MiB`}
      />

      <TerminalBlock
        command="cat ~/.xinitrc"
        output={`#!/bin/sh
# Para i3:
exec i3
# Para XFCE:
# exec startxfce4
# Para Openbox:
# exec openbox-session`}
      />

      <TerminalBlock
        command="startx"
        output={`X.Org X Server 21.1.13
X Protocol Version 11, Revision 0
Build Operating System: Linux 6.8.7-arch1-1 x86_64
Current Operating System: Linux meu-arch 6.8.7-arch1-1
Build Date: 09 April 2024  03:27:35PM

Markers: (--) probed, (**) from config file, (==) default setting,
         (++) from command line, (!!) notice, (II) informational,
         (WW) warning, (EE) error, (NI) not implemented, (??) unknown.

(==) Log file: "/home/joao/.local/share/xorg/Xorg.0.log"
(==) Using config directory: "/etc/X11/xorg.conf.d"
(==) Using system config directory "/usr/share/X11/xorg.conf.d"
[i3] starting i3 4.23`}
      />

      <h3>Auto-startx no login do tty1</h3>

      <TerminalBlock
        command={`cat >> ~/.bash_profile <<'EOF'
if [ -z "$DISPLAY" ] && [ "$XDG_VTNR" -eq 1 ]; then
    exec startx
fi
EOF`}
        output=""
        comment="ao logar no tty1, X inicia automaticamente"
      />

      <h2>8. Tabela de decisão</h2>

      <OutputBlock
        title="qual ambiente é pra mim?"
        output={`Ambiente      Peso     Curva    Wayland   Para quem
─────────────────────────────────────────────────────────────────
GNOME         pesado   fácil    sim       quer pronto e moderno
KDE Plasma    médio    fácil    sim       quer customizar sem ralar
XFCE          leve     fácil    não       hardware velho, estabilidade
Cinnamon      médio    fácil    não       vindo do Mint/Windows
i3            ultra    média    não       teclado-only, tiling clássico
Sway          ultra    média    sim       i3 + Wayland
Hyprland      leve     média    sim       visual + tiling
bspwm         ultra    difícil  não       controle absoluto
dwm           ultra    difícil  não       configura editando .c`}
        annotations={[
          { line: 1, note: "padrão do Fedora/Ubuntu" },
          { line: 2, note: "padrão do KDE neon" },
          { line: 7, note: "manycore + animações" },
        ]}
      />

      <AlertBox type="success" title="Não precisa escolher só um">
        Você pode instalar GNOME, KDE e i3 lado a lado. Na tela do display manager, há um seletor
        no canto inferior — escolha o ambiente antes de digitar a senha.
      </AlertBox>

      <h2>9. Reiniciar e logar no gráfico</h2>

      <TerminalBlock
        command="sudo reboot"
        output=""
        comment="próximo boot cai direto na tela do display manager"
      />
    </PageContainer>
  );
}
