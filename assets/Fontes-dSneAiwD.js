import{j as o}from"./ui-K-J8Jkwj.js";import{P as t}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return o.jsxs(t,{title:"Fontes & Renderização",subtitle:"Configure fontes, renderização de texto, hinting, antialiasing e emoji no Arch Linux para uma experiência visual perfeita.",difficulty:"iniciante",timeToRead:"15 min",children:[o.jsx("h2",{children:"Fontes Essenciais"}),o.jsx("p",{children:"O Arch Linux vem com poucas fontes instaladas por padrão. Para uma experiência visual adequada, você precisa instalar fontes para texto, código, emojis e caracteres internacionais."}),o.jsx(e,{title:"Instalar fontes essenciais",code:`# Fontes básicas de sistema
sudo pacman -S \\
  noto-fonts \\
  noto-fonts-cjk \\
  noto-fonts-emoji \\
  noto-fonts-extra \\
  ttf-liberation \\
  ttf-dejavu

# Fontes para programação (monospace)
sudo pacman -S \\
  ttf-firacode-nerd \\
  ttf-jetbrains-mono-nerd \\
  ttf-cascadia-code-nerd \\
  ttf-hack-nerd

# Fontes da Microsoft (compatibilidade)
yay -S ttf-ms-fonts

# Emojis coloridos
sudo pacman -S noto-fonts-emoji

# Fonte para ícones (usado por tiling WMs)
sudo pacman -S ttf-font-awesome otf-font-awesome`}),o.jsxs(a,{type:"info",title:"Fontes Nerd",children:["As Nerd Fonts são fontes para programação com ícones embutidos. São essenciais para terminais modernos (Starship, Powerlevel10k) e editores como Neovim com plugins de ícones. O sufixo ",o.jsx("code",{children:"-nerd"})," no nome do pacote indica que é uma Nerd Font."]}),o.jsx("h2",{children:"Configuração de Renderização (Fontconfig)"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"fontconfig"})," controla como as fontes são renderizadas — antialiasing, hinting, substituição de fontes e ordem de preferência."]}),o.jsx(e,{title:"Configuração pessoal de fontes",code:`# Criar arquivo de configuração
mkdir -p ~/.config/fontconfig
vim ~/.config/fontconfig/fonts.conf

# Conteúdo recomendado:
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <!-- Habilitar antialiasing -->
  <match target="font">
    <edit name="antialias" mode="assign"><bool>true</bool></edit>
  </match>

  <!-- Hinting: melhor renderização de texto pequeno -->
  <match target="font">
    <edit name="hinting" mode="assign"><bool>true</bool></edit>
    <edit name="hintstyle" mode="assign"><const>hintslight</const></edit>
  </match>

  <!-- Sub-pixel rendering para LCDs -->
  <match target="font">
    <edit name="rgba" mode="assign"><const>rgb</const></edit>
    <edit name="lcdfilter" mode="assign"><const>lcddefault</const></edit>
  </match>

  <!-- Fonte padrão sans-serif -->
  <alias>
    <family>sans-serif</family>
    <prefer><family>Noto Sans</family></prefer>
  </alias>

  <!-- Fonte padrão serif -->
  <alias>
    <family>serif</family>
    <prefer><family>Noto Serif</family></prefer>
  </alias>

  <!-- Fonte padrão monospace -->
  <alias>
    <family>monospace</family>
    <prefer><family>JetBrainsMono Nerd Font</family></prefer>
  </alias>
</fontconfig>`}),o.jsx("h2",{children:"Comandos Úteis"}),o.jsx(e,{title:"Gerenciar fontes com fc-* tools",code:`# Listar todas as fontes instaladas
fc-list

# Buscar uma fonte específica
fc-list | grep "JetBrains"

# Listar fontes monospace
fc-list :spacing=mono

# Ver qual fonte será usada para um nome genérico
fc-match sans-serif
fc-match serif
fc-match monospace

# Atualizar cache de fontes (após instalar novas)
fc-cache -fv

# Ver detalhes de uma fonte
fc-query /usr/share/fonts/TTF/JetBrainsMonoNerdFont-Regular.ttf`}),o.jsx("h2",{children:"Instalar Fontes Manualmente"}),o.jsx(e,{title:"Instalar fontes baixadas manualmente",code:`# Fontes para todos os usuários
sudo mkdir -p /usr/local/share/fonts
sudo cp MInhaFonte.ttf /usr/local/share/fonts/
sudo fc-cache -fv

# Fontes só para seu usuário
mkdir -p ~/.local/share/fonts
cp MinhaFonte.ttf ~/.local/share/fonts/
fc-cache -fv

# Instalar múltiplas fontes de uma vez
cp ~/Downloads/fontes/*.ttf ~/.local/share/fonts/
fc-cache -fv`}),o.jsx("h2",{children:"Configuração de Emojis"}),o.jsx(e,{title:"Configurar emojis corretamente",code:`# Instalar fonte de emoji
sudo pacman -S noto-fonts-emoji

# Configurar prioridade de emoji em ~/.config/fontconfig/fonts.conf
# Adicionar dentro de <fontconfig>:
<match target="pattern">
  <test qual="any" name="family"><string>emoji</string></test>
  <edit name="family" mode="assign" binding="same">
    <string>Noto Color Emoji</string>
  </edit>
</match>

# Forçar Noto Color Emoji para todos os emojis
<match target="pattern">
  <test name="prgname" compare="not_eq"><string>alacritty</string></test>
  <test qual="any" name="family"><string>sans-serif</string></test>
  <edit name="family" mode="append"><string>Noto Color Emoji</string></edit>
</match>

# Testar emojis no terminal
echo "🎉 🚀 ❤️ 🔥 ⭐ 🎮 💻 🐧"`}),o.jsx("h2",{children:"Fontes por Aplicação"}),o.jsx(e,{title:"Configurar fontes em aplicações específicas",code:`# Terminal (Alacritty) — ~/.config/alacritty/alacritty.toml
[font]
size = 12.0
[font.normal]
family = "JetBrainsMono Nerd Font"
style = "Regular"
[font.bold]
family = "JetBrainsMono Nerd Font"
style = "Bold"

# Terminal (Kitty) — ~/.config/kitty/kitty.conf
font_family JetBrainsMono Nerd Font
bold_font auto
italic_font auto
font_size 12.0

# GTK (GNOME/XFCE/etc) — via gsettings
gsettings set org.gnome.desktop.interface font-name 'Noto Sans 11'
gsettings set org.gnome.desktop.interface document-font-name 'Noto Sans 11'
gsettings set org.gnome.desktop.interface monospace-font-name 'JetBrainsMono Nerd Font 10'

# Qt/KDE — via qt5ct ou configurações do KDE
# Instalar qt5ct se necessário
sudo pacman -S qt5ct`}),o.jsx("h2",{children:"DPI e Escala HiDPI"}),o.jsx(e,{title:"Configurar HiDPI (telas de alta resolução)",code:`# GNOME — suporte nativo
# Configurações > Tela > Escala

# X11 — Xresources
echo 'Xft.dpi: 192' >> ~/.Xresources
xrdb -merge ~/.Xresources

# Wayland/Sway
output eDP-1 scale 2

# Hyprland
monitor=eDP-1,preferred,auto,2

# GTK
export GDK_SCALE=2
export GDK_DPI_SCALE=0.5

# Qt
export QT_SCALE_FACTOR=2`}),o.jsx("h2",{children:"Troubleshooting"}),o.jsx(e,{title:"Resolver problemas comuns de fontes",code:`# Fontes feias ou serrilhadas
# → Habilitar antialiasing e hinting no fonts.conf

# Emojis não aparecem ou aparecem em preto e branco
# → Instalar noto-fonts-emoji e configurar fontconfig

# Caracteres aparecendo como quadrados (tofu)
# → Instalar noto-fonts-cjk (asiáticos) e noto-fonts-extra

# Fonte não encontrada após instalação
fc-cache -fv   # Rebuild do cache

# Ver qual fonte substitui qual
fc-match -a "Arial"  # Ver substituições de Arial

# Resetar configuração de fontes
rm ~/.config/fontconfig/fonts.conf
fc-cache -fv`})]})}export{l as default};
