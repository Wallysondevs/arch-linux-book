import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AmbienteGrafico() {
  return (
    <PageContainer
      title="Ambiente Gráfico"
      subtitle="Xorg vs Wayland, Display Managers, Desktop Environments e Window Managers — escolha e instale o ambiente ideal para você."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <h2>Visão Geral</h2>
      <p>
        Diferente de outras distribuições, o Arch Linux não vem com ambiente gráfico. Isso é uma vantagem:
        você escolhe exatamente o que quer usar. Para ter uma interface gráfica, precisamos de três componentes:
      </p>
      <ul>
        <li><strong>Servidor de Display</strong> — Xorg ou Wayland (a base que permite gráficos)</li>
        <li><strong>Desktop Environment ou Window Manager</strong> — A interface visual em si</li>
        <li><strong>Display Manager</strong> — Tela de login gráfica (opcional)</li>
      </ul>

      <h2>Xorg vs Wayland</h2>
      <p>
        O Xorg (X11) é o servidor de display tradicional do Linux, em uso há mais de 30 anos.
        O Wayland é seu substituto moderno, projetado para ser mais seguro, eficiente e simples.
      </p>

      <h3>Xorg (X11)</h3>
      <ul>
        <li>Maduro e extremamente compatível</li>
        <li>Funciona com praticamente todas as aplicações e drivers</li>
        <li>Suporte completo a NVIDIA proprietária</li>
        <li>Permite captura de tela e controle remoto facilmente</li>
        <li>Arquitetura antiga com problemas de segurança (qualquer app pode capturar o teclado)</li>
      </ul>

      <h3>Wayland</h3>
      <ul>
        <li>Mais seguro — aplicações são isoladas</li>
        <li>Melhor performance com menos tearing</li>
        <li>Suporte a HiDPI nativo</li>
        <li>Algumas aplicações ainda não são 100% compatíveis</li>
        <li>Suporte a NVIDIA melhorou muito, mas pode ter problemas</li>
      </ul>

      <CodeBlock
        title="Instalar Xorg"
        code={`# Instalar Xorg completo
sudo pacman -S xorg-server xorg-xinit

# Ou o grupo completo (inclui utilitários extras)
sudo pacman -S xorg`}
      />

      <AlertBox type="info" title="Qual escolher?">
        Se você usa NVIDIA ou aplicações que dependem do X11, comece com Xorg. Se usa AMD/Intel
        e quer o mais moderno, escolha Wayland. Muitos DEs suportam ambos — você pode alternar
        na tela de login.
      </AlertBox>

      <h2>Drivers de Vídeo</h2>
      <CodeBlock
        title="Instalar drivers de vídeo"
        code={`# Intel
sudo pacman -S mesa intel-media-driver

# AMD
sudo pacman -S mesa xf86-video-amdgpu vulkan-radeon

# NVIDIA (drivers proprietários)
sudo pacman -S nvidia nvidia-utils nvidia-settings

# NVIDIA (drivers open source - performance inferior)
sudo pacman -S xf86-video-nouveau

# Verificar qual GPU você tem
lspci | grep -i vga`}
      />

      <h2>Desktop Environments (DEs)</h2>
      <p>
        Desktop Environments são ambientes completos com gerenciador de janelas, barra de tarefas,
        gerenciador de arquivos, configurações e aplicativos integrados.
      </p>

      <h3>GNOME</h3>
      <p>
        Moderno, elegante e focado em simplicidade. Usa Wayland por padrão.
        Visual limpo e minimalista, extensível com extensões.
      </p>
      <CodeBlock
        title="Instalar GNOME"
        code={`# Instalação mínima
sudo pacman -S gnome

# Instalação completa (com apps extras)
sudo pacman -S gnome gnome-extra

# Habilitar o Display Manager
sudo systemctl enable gdm

# Reiniciar para a tela de login
sudo reboot`}
      />

      <h3>KDE Plasma</h3>
      <p>
        Extremamente personalizável, bonito e completo. Suporta Wayland e Xorg.
        Parecido com Windows em layout padrão, mas pode ser configurado de qualquer forma.
      </p>
      <CodeBlock
        title="Instalar KDE Plasma"
        code={`# Instalação do Plasma
sudo pacman -S plasma kde-applications

# Ou instalação mínima
sudo pacman -S plasma-desktop konsole dolphin

# Habilitar Display Manager
sudo systemctl enable sddm

sudo reboot`}
      />

      <h3>XFCE</h3>
      <p>
        Leve, rápido e estável. Ideal para máquinas com hardware limitado.
        Usa Xorg (sem suporte a Wayland nativo).
      </p>
      <CodeBlock
        title="Instalar XFCE"
        code={`sudo pacman -S xfce4 xfce4-goodies

# Usar com LightDM
sudo pacman -S lightdm lightdm-gtk-greeter
sudo systemctl enable lightdm

sudo reboot`}
      />

      <h3>Outros DEs</h3>
      <CodeBlock
        title="Outros ambientes populares"
        code={`# Cinnamon (usado pelo Linux Mint, familiar para usuários Windows)
sudo pacman -S cinnamon nemo-fileroller

# MATE (fork do GNOME 2, leve e tradicional)
sudo pacman -S mate mate-extra

# Budgie (moderno e elegante)
sudo pacman -S budgie-desktop

# LXQt (ultraleve)
sudo pacman -S lxqt`}
      />

      <h2>Window Managers (WMs)</h2>
      <p>
        Window Managers são mais leves que DEs — gerenciam apenas janelas, sem apps integrados.
        Ideais para quem quer controle total e eficiência máxima. A maioria é controlada inteiramente pelo teclado.
      </p>

      <AlertBox type="warning" title="Window Managers exigem mais configuração">
        Diferente de DEs que vêm prontos, WMs exigem configuração manual para coisas como
        papel de parede, barra de status, notificações, controle de volume, etc.
        A curva de aprendizado é maior, mas o resultado é um sistema extremamente leve e personalizado.
      </AlertBox>

      <h3>i3 (Xorg)</h3>
      <p>
        Um dos WMs tiling mais populares. Fácil de configurar, boa documentação.
      </p>
      <CodeBlock
        title="Instalar i3"
        code={`# i3 com barra de status e launcher
sudo pacman -S i3-wm i3status i3lock dmenu

# Extras recomendados
sudo pacman -S picom feh alacritty polybar rofi

# Configurar para iniciar via xinit
echo "exec i3" > ~/.xinitrc

# Iniciar
startx`}
      />

      <h3>Sway (Wayland)</h3>
      <p>
        Equivalente do i3 para Wayland. Quase a mesma configuração e atalhos.
      </p>
      <CodeBlock
        title="Instalar Sway"
        code={`sudo pacman -S sway swaylock swayidle swaybg waybar wofi foot

# Copiar configuração padrão
mkdir -p ~/.config/sway
cp /etc/sway/config ~/.config/sway/config

# Iniciar
sway`}
      />

      <h3>Hyprland (Wayland)</h3>
      <p>
        WM dinâmico com animações suaves e visual impressionante. Muito popular na comunidade Arch.
      </p>
      <CodeBlock
        title="Instalar Hyprland"
        code={`sudo pacman -S hyprland

# Extras recomendados
sudo pacman -S waybar wofi kitty hyprpaper

# Copiar configuração padrão
mkdir -p ~/.config/hypr
cp /usr/share/hyprland/hyprland.conf ~/.config/hypr/

# Iniciar
Hyprland`}
      />

      <h3>Outros WMs</h3>
      <CodeBlock
        title="Outros Window Managers"
        code={`# bspwm (Xorg) - WM tiling controlado via sxhkd
sudo pacman -S bspwm sxhkd

# dwm (Xorg) - WM do suckless, configurado via código C
# Instalar via AUR ou compilar do source
git clone https://git.suckless.org/dwm
cd dwm && sudo make clean install

# awesome (Xorg) - WM com configuração em Lua
sudo pacman -S awesome

# Openbox (Xorg) - WM flutuante/stacking, leve
sudo pacman -S openbox`}
      />

      <h2>Display Managers</h2>
      <p>
        Display Managers (DMs) são telas de login gráficas. Você pode iniciar sem um (usando <code>startx</code>),
        mas DMs são mais práticos.
      </p>

      <CodeBlock
        title="Display Managers populares"
        code={`# SDDM (padrão do KDE, suporta temas)
sudo pacman -S sddm
sudo systemctl enable sddm

# GDM (padrão do GNOME, suporta Wayland)
sudo pacman -S gdm
sudo systemctl enable gdm

# LightDM (leve, universal)
sudo pacman -S lightdm lightdm-gtk-greeter
sudo systemctl enable lightdm

# ly (TUI - tela de login no terminal, minimalista)
sudo pacman -S ly
sudo systemctl enable ly`}
      />

      <AlertBox type="danger" title="Apenas um Display Manager">
        Habilite apenas UM display manager por vez. Se quiser trocar, desabilite o atual antes
        de habilitar o novo: <code>sudo systemctl disable gdm</code> e depois
        <code>sudo systemctl enable sddm</code>.
      </AlertBox>

      <h2>Iniciar sem Display Manager (startx)</h2>
      <CodeBlock
        title="Configurar xinit/startx"
        code={`# Instalar xinit
sudo pacman -S xorg-xinit

# Criar/editar ~/.xinitrc
nano ~/.xinitrc

# Conteúdo exemplo para i3:
#!/bin/sh
exec i3

# Conteúdo exemplo para XFCE:
#!/bin/sh
exec startxfce4

# Iniciar o ambiente gráfico manualmente
startx

# Para iniciar automaticamente no login (adicionar ao ~/.bash_profile):
if [ -z "$DISPLAY" ] && [ "$XDG_VTNR" -eq 1 ]; then
    exec startx
fi`}
      />

      <h2>Qual Escolher?</h2>
      <CodeBlock
        title="Guia de escolha"
        language="text"
        code={`Ambiente        | Peso   | Dificuldade | Wayland | Para quem
----------------|--------|-------------|---------|-------------------
GNOME           | Pesado | Fácil       | Sim     | Quer algo pronto e moderno
KDE Plasma      | Médio  | Fácil       | Sim     | Quer personalização sem esforço
XFCE            | Leve   | Fácil       | Não     | Hardware limitado, estabilidade
Cinnamon        | Médio  | Fácil       | Não     | Vindo do Windows/Mint
i3              | Ultra  | Médio       | Não     | Quer tiling keyboard-driven
Sway            | Ultra  | Médio       | Sim     | i3 + Wayland
Hyprland        | Leve   | Médio       | Sim     | Visual impressionante + tiling
bspwm           | Ultra  | Difícil     | Não     | Controle absoluto`}
      />

      <AlertBox type="success" title="Não precisa escolher apenas um">
        Você pode instalar múltiplos DEs e WMs e alternar entre eles na tela de login.
        É uma das grandes vantagens do Arch Linux!
      </AlertBox>
    </PageContainer>
  );
}
