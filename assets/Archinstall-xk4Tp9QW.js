import{j as a}from"./ui-K-J8Jkwj.js";import{P as o}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as i}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return a.jsxs(o,{title:"archinstall: Instalador Guiado",subtitle:"Use o instalador oficial guiado do Arch Linux para uma instalação mais rápida e simplificada, sem perder o controle.",difficulty:"iniciante",timeToRead:"12 min",children:[a.jsx("h2",{children:"O que é o archinstall?"}),a.jsxs("p",{children:["O ",a.jsx("code",{children:"archinstall"})," é o instalador oficial guiado do Arch Linux. Ele automatiza o processo de instalação através de um menu interativo, mantendo a filosofia do Arch de oferecer escolhas ao usuário. É incluído na ISO oficial desde 2021."]}),a.jsx(i,{type:"info",title:"Instalação manual vs archinstall",children:'O archinstall é uma ferramenta legítima e oficial. Usá-lo não te torna "menos Arch" — é uma forma mais rápida de alcançar o mesmo resultado. Muitos usuários experientes usam archinstall para instalações rápidas e depois personalizam manualmente.'}),a.jsx("h2",{children:"Iniciando o archinstall"}),a.jsx(e,{title:"Executar o archinstall",code:`# Após bootar pela ISO do Arch Linux:

# 1. Conectar à internet primeiro
# Wi-Fi:
iwctl
[iwd]# station wlan0 scan
[iwd]# station wlan0 get-networks
[iwd]# station wlan0 connect "NomeDaRede"

# Ethernet: geralmente conecta automaticamente

# 2. Verificar conexão
ping -c 3 archlinux.org

# 3. Atualizar o archinstall (recomendado)
pacman -Sy archinstall

# 4. Executar
archinstall`}),a.jsx("h2",{children:"Opções do Menu"}),a.jsx("h3",{children:"Idioma e Teclado"}),a.jsx(e,{title:"Configuração de idioma",code:`# Archlinux language: Portuguese (Brazil) ou English
# Keyboard layout: br-abnt2
# Mirror region: Brazil`}),a.jsx("h3",{children:"Particionamento"}),a.jsx(e,{title:"Opções de disco",code:`# Opções disponíveis:
# 1. Use a best-effort default partition layout
#    - Apaga o disco e cria partições automáticas
#    - Escolha o filesystem: ext4, btrfs, xfs, f2fs
#    - Btrfs é recomendado (snapshots, compressão)

# 2. Manual partitioning
#    - Você define cada partição manualmente
#    - Mais controle, mas mais complexo

# 3. Pre-mounted configuration
#    - Usa partições já montadas em /mnt`}),a.jsx("h3",{children:"Perfil de Desktop"}),a.jsx(e,{title:"Perfis disponíveis",code:`# Desktop environments:
# - GNOME
# - KDE Plasma  
# - XFCE
# - Cinnamon
# - Budgie
# - MATE
# - i3 (tiling WM)
# - Sway (tiling WM Wayland)
# - Hyprland (tiling WM Wayland)

# Minimal: sem desktop, só terminal
# Server: perfil para servidores`}),a.jsx("h3",{children:"Pacotes Extras"}),a.jsx(e,{title:"Adicionar pacotes durante a instalação",code:`# No campo "Additional packages", você pode adicionar:
firefox git vim neovim htop btop fastfetch
base-devel networkmanager bluez bluez-utils
pipewire pipewire-pulse pipewire-alsa wireplumber`}),a.jsx("h3",{children:"Configuração de Rede"}),a.jsx(e,{title:"Opções de rede",code:`# NetworkManager (recomendado para desktop)
# - Mais fácil de usar, GUI disponível
# - Suporte completo a Wi-Fi, VPN, etc.

# systemd-networkd (para servidores/minimalistas)
# - Mais leve, integrado ao systemd
# - Sem GUI, configuração por arquivo`}),a.jsx("h2",{children:"Usando Arquivos de Configuração"}),a.jsx("p",{children:"O archinstall suporta arquivos de configuração JSON para automatizar instalações repetidas."}),a.jsx(e,{title:"Salvar e reusar configuração",code:`# Após configurar tudo no menu, o archinstall salva a config em:
# /var/log/archinstall/user_configuration.json
# /var/log/archinstall/user_credentials.json

# Para reusar em outra instalação:
archinstall --config /path/to/user_configuration.json --creds /path/to/user_credentials.json`}),a.jsx(e,{title:"Exemplo de configuração JSON",code:`{
  "audio_config": {
    "audio": "pipewire"
  },
  "bootloader": "systemd-bootctl",
  "hostname": "archlinux",
  "kernels": ["linux"],
  "locale_config": {
    "kb_layout": "br",
    "sys_enc": "UTF-8",
    "sys_lang": "pt_BR.UTF-8"
  },
  "mirror_config": {
    "mirror_regions": {
      "Brazil": []
    }
  },
  "network_config": {
    "type": "nm"
  },
  "profile_config": {
    "profile": {
      "main": "Desktop",
      "details": ["KDE"]
    }
  },
  "timezone": "America/Sao_Paulo"
}`}),a.jsx("h2",{children:"Pós-instalação"}),a.jsx(e,{title:"O que fazer após o archinstall",code:`# 1. Reiniciar o sistema
# 2. Conectar à internet (se Wi-Fi)
nmtui  # Interface gráfica no terminal para NetworkManager

# 3. Atualizar o sistema
sudo pacman -Syu

# 4. Instalar um AUR helper
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay && makepkg -si

# 5. Configurar reflector para mirrors rápidos
sudo pacman -S reflector
sudo reflector --country Brazil --sort rate --number 10 --save /etc/pacman.d/mirrorlist

# 6. Habilitar serviços úteis
sudo systemctl enable --now bluetooth
sudo systemctl enable --now fstrim.timer  # TRIM para SSD`}),a.jsx(i,{type:"warning",title:"Limitações do archinstall",children:"O archinstall é ótimo para instalações padrão, mas pode não cobrir cenários complexos como LUKS com LVM, dual-boot avançado, ou configurações de RAID. Para esses casos, a instalação manual seguindo o guia oficial é recomendada."})]})}export{u as default};
