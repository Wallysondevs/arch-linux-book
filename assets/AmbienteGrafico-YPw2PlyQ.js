import{j as a}from"./ui-K-J8Jkwj.js";import{P as i}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function p(){return a.jsxs(i,{title:"Ambiente Gráfico",subtitle:"Xorg vs Wayland, Display Managers, Desktop Environments e Window Managers — escolha e instale o ambiente ideal para você.",difficulty:"intermediario",timeToRead:"25 min",children:[a.jsx("h2",{children:"Visão Geral"}),a.jsx("p",{children:"Diferente de outras distribuições, o Arch Linux não vem com ambiente gráfico. Isso é uma vantagem: você escolhe exatamente o que quer usar. Para ter uma interface gráfica, precisamos de três componentes:"}),a.jsxs("ul",{children:[a.jsxs("li",{children:[a.jsx("strong",{children:"Servidor de Display"})," — Xorg ou Wayland (a base que permite gráficos)"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Desktop Environment ou Window Manager"})," — A interface visual em si"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Display Manager"})," — Tela de login gráfica (opcional)"]})]}),a.jsx("h2",{children:"Xorg vs Wayland"}),a.jsx("p",{children:"O Xorg (X11) é o servidor de display tradicional do Linux, em uso há mais de 30 anos. O Wayland é seu substituto moderno, projetado para ser mais seguro, eficiente e simples."}),a.jsx("h3",{children:"Xorg (X11)"}),a.jsxs("ul",{children:[a.jsx("li",{children:"Maduro e extremamente compatível"}),a.jsx("li",{children:"Funciona com praticamente todas as aplicações e drivers"}),a.jsx("li",{children:"Suporte completo a NVIDIA proprietária"}),a.jsx("li",{children:"Permite captura de tela e controle remoto facilmente"}),a.jsx("li",{children:"Arquitetura antiga com problemas de segurança (qualquer app pode capturar o teclado)"})]}),a.jsx("h3",{children:"Wayland"}),a.jsxs("ul",{children:[a.jsx("li",{children:"Mais seguro — aplicações são isoladas"}),a.jsx("li",{children:"Melhor performance com menos tearing"}),a.jsx("li",{children:"Suporte a HiDPI nativo"}),a.jsx("li",{children:"Algumas aplicações ainda não são 100% compatíveis"}),a.jsx("li",{children:"Suporte a NVIDIA melhorou muito, mas pode ter problemas"})]}),a.jsx(e,{title:"Instalar Xorg",code:`# Instalar Xorg completo
sudo pacman -S xorg-server xorg-xinit

# Ou o grupo completo (inclui utilitários extras)
sudo pacman -S xorg`}),a.jsx(o,{type:"info",title:"Qual escolher?",children:"Se você usa NVIDIA ou aplicações que dependem do X11, comece com Xorg. Se usa AMD/Intel e quer o mais moderno, escolha Wayland. Muitos DEs suportam ambos — você pode alternar na tela de login."}),a.jsx("h2",{children:"Drivers de Vídeo"}),a.jsx(e,{title:"Instalar drivers de vídeo",code:`# Intel
sudo pacman -S mesa intel-media-driver

# AMD
sudo pacman -S mesa xf86-video-amdgpu vulkan-radeon

# NVIDIA (drivers proprietários)
sudo pacman -S nvidia nvidia-utils nvidia-settings

# NVIDIA (drivers open source - performance inferior)
sudo pacman -S xf86-video-nouveau

# Verificar qual GPU você tem
lspci | grep -i vga`}),a.jsx("h2",{children:"Desktop Environments (DEs)"}),a.jsx("p",{children:"Desktop Environments são ambientes completos com gerenciador de janelas, barra de tarefas, gerenciador de arquivos, configurações e aplicativos integrados."}),a.jsx("h3",{children:"GNOME"}),a.jsx("p",{children:"Moderno, elegante e focado em simplicidade. Usa Wayland por padrão. Visual limpo e minimalista, extensível com extensões."}),a.jsx(e,{title:"Instalar GNOME",code:`# Instalação mínima
sudo pacman -S gnome

# Instalação completa (com apps extras)
sudo pacman -S gnome gnome-extra

# Habilitar o Display Manager
sudo systemctl enable gdm

# Reiniciar para a tela de login
sudo reboot`}),a.jsx("h3",{children:"KDE Plasma"}),a.jsx("p",{children:"Extremamente personalizável, bonito e completo. Suporta Wayland e Xorg. Parecido com Windows em layout padrão, mas pode ser configurado de qualquer forma."}),a.jsx(e,{title:"Instalar KDE Plasma",code:`# Instalação do Plasma
sudo pacman -S plasma kde-applications

# Ou instalação mínima
sudo pacman -S plasma-desktop konsole dolphin

# Habilitar Display Manager
sudo systemctl enable sddm

sudo reboot`}),a.jsx("h3",{children:"XFCE"}),a.jsx("p",{children:"Leve, rápido e estável. Ideal para máquinas com hardware limitado. Usa Xorg (sem suporte a Wayland nativo)."}),a.jsx(e,{title:"Instalar XFCE",code:`sudo pacman -S xfce4 xfce4-goodies

# Usar com LightDM
sudo pacman -S lightdm lightdm-gtk-greeter
sudo systemctl enable lightdm

sudo reboot`}),a.jsx("h3",{children:"Outros DEs"}),a.jsx(e,{title:"Outros ambientes populares",code:`# Cinnamon (usado pelo Linux Mint, familiar para usuários Windows)
sudo pacman -S cinnamon nemo-fileroller

# MATE (fork do GNOME 2, leve e tradicional)
sudo pacman -S mate mate-extra

# Budgie (moderno e elegante)
sudo pacman -S budgie-desktop

# LXQt (ultraleve)
sudo pacman -S lxqt`}),a.jsx("h2",{children:"Window Managers (WMs)"}),a.jsx("p",{children:"Window Managers são mais leves que DEs — gerenciam apenas janelas, sem apps integrados. Ideais para quem quer controle total e eficiência máxima. A maioria é controlada inteiramente pelo teclado."}),a.jsx(o,{type:"warning",title:"Window Managers exigem mais configuração",children:"Diferente de DEs que vêm prontos, WMs exigem configuração manual para coisas como papel de parede, barra de status, notificações, controle de volume, etc. A curva de aprendizado é maior, mas o resultado é um sistema extremamente leve e personalizado."}),a.jsx("h3",{children:"i3 (Xorg)"}),a.jsx("p",{children:"Um dos WMs tiling mais populares. Fácil de configurar, boa documentação."}),a.jsx(e,{title:"Instalar i3",code:`# i3 com barra de status e launcher
sudo pacman -S i3-wm i3status i3lock dmenu

# Extras recomendados
sudo pacman -S picom feh alacritty polybar rofi

# Configurar para iniciar via xinit
echo "exec i3" > ~/.xinitrc

# Iniciar
startx`}),a.jsx("h3",{children:"Sway (Wayland)"}),a.jsx("p",{children:"Equivalente do i3 para Wayland. Quase a mesma configuração e atalhos."}),a.jsx(e,{title:"Instalar Sway",code:`sudo pacman -S sway swaylock swayidle swaybg waybar wofi foot

# Copiar configuração padrão
mkdir -p ~/.config/sway
cp /etc/sway/config ~/.config/sway/config

# Iniciar
sway`}),a.jsx("h3",{children:"Hyprland (Wayland)"}),a.jsx("p",{children:"WM dinâmico com animações suaves e visual impressionante. Muito popular na comunidade Arch."}),a.jsx(e,{title:"Instalar Hyprland",code:`sudo pacman -S hyprland

# Extras recomendados
sudo pacman -S waybar wofi kitty hyprpaper

# Copiar configuração padrão
mkdir -p ~/.config/hypr
cp /usr/share/hyprland/hyprland.conf ~/.config/hypr/

# Iniciar
Hyprland`}),a.jsx("h3",{children:"Outros WMs"}),a.jsx(e,{title:"Outros Window Managers",code:`# bspwm (Xorg) - WM tiling controlado via sxhkd
sudo pacman -S bspwm sxhkd

# dwm (Xorg) - WM do suckless, configurado via código C
# Instalar via AUR ou compilar do source
git clone https://git.suckless.org/dwm
cd dwm && sudo make clean install

# awesome (Xorg) - WM com configuração em Lua
sudo pacman -S awesome

# Openbox (Xorg) - WM flutuante/stacking, leve
sudo pacman -S openbox`}),a.jsx("h2",{children:"Display Managers"}),a.jsxs("p",{children:["Display Managers (DMs) são telas de login gráficas. Você pode iniciar sem um (usando ",a.jsx("code",{children:"startx"}),"), mas DMs são mais práticos."]}),a.jsx(e,{title:"Display Managers populares",code:`# SDDM (padrão do KDE, suporta temas)
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
sudo systemctl enable ly`}),a.jsxs(o,{type:"danger",title:"Apenas um Display Manager",children:["Habilite apenas UM display manager por vez. Se quiser trocar, desabilite o atual antes de habilitar o novo: ",a.jsx("code",{children:"sudo systemctl disable gdm"})," e depois",a.jsx("code",{children:"sudo systemctl enable sddm"}),"."]}),a.jsx("h2",{children:"Iniciar sem Display Manager (startx)"}),a.jsx(e,{title:"Configurar xinit/startx",code:`# Instalar xinit
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
fi`}),a.jsx("h2",{children:"Qual Escolher?"}),a.jsx(e,{title:"Guia de escolha",language:"text",code:`Ambiente        | Peso   | Dificuldade | Wayland | Para quem
----------------|--------|-------------|---------|-------------------
GNOME           | Pesado | Fácil       | Sim     | Quer algo pronto e moderno
KDE Plasma      | Médio  | Fácil       | Sim     | Quer personalização sem esforço
XFCE            | Leve   | Fácil       | Não     | Hardware limitado, estabilidade
Cinnamon        | Médio  | Fácil       | Não     | Vindo do Windows/Mint
i3              | Ultra  | Médio       | Não     | Quer tiling keyboard-driven
Sway            | Ultra  | Médio       | Sim     | i3 + Wayland
Hyprland        | Leve   | Médio       | Sim     | Visual impressionante + tiling
bspwm           | Ultra  | Difícil     | Não     | Controle absoluto`}),a.jsx(o,{type:"success",title:"Não precisa escolher apenas um",children:"Você pode instalar múltiplos DEs e WMs e alternar entre eles na tela de login. É uma das grandes vantagens do Arch Linux!"})]})}export{p as default};
