import{j as a}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return a.jsxs(s,{title:"Flatpak no Arch Linux",subtitle:"Instale aplicativos universais de forma isolada. O Flatpak permite usar apps de qualquer distro no Arch Linux com sandbox e atualizações independentes.",difficulty:"iniciante",timeToRead:"10 min",children:[a.jsx("h2",{children:"O que é Flatpak?"}),a.jsx("p",{children:"Flatpak é um sistema de empacotamento universal para Linux. Ao contrário do pacman que instala pacotes específicos para o Arch, o Flatpak instala aplicativos que funcionam em qualquer distro Linux."}),a.jsx("p",{children:"Benefícios do Flatpak:"}),a.jsxs("ul",{children:[a.jsxs("li",{children:[a.jsx("strong",{children:"Sandbox"})," — Apps rodam isolados, sem acesso total ao sistema"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Independência de versão"})," — Cada app traz suas próprias dependências"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Apps atualizados"})," — Versões mais recentes que o repositório da distro"]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Sem conflito"})," — Não conflita com pacotes do sistema"]})]}),a.jsx("h2",{children:"Instalação e Configuração"}),a.jsx(e,{title:"Instalar e configurar Flatpak",code:`# Instalar Flatpak
sudo pacman -S flatpak

# Adicionar o repositório Flathub (principal fonte de apps)
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

# Reiniciar a sessão para os apps aparecerem no menu
# (logout e login novamente)

# Verificar repositórios configurados
flatpak remotes

# Listar todos os apps disponíveis no Flathub
flatpak search firefox`}),a.jsx("h2",{children:"Gerenciando Apps"}),a.jsx(e,{title:"Instalar, atualizar e remover Flatpaks",code:`# Buscar um app
flatpak search spotify

# Instalar app (--user: apenas para seu usuário)
flatpak install flathub com.spotify.Client
flatpak install --user flathub org.mozilla.firefox

# Ver apps instalados
flatpak list
flatpak list --app     # Apenas apps (não runtimes)

# Rodar um app
flatpak run com.spotify.Client
flatpak run org.mozilla.firefox

# Atualizar todos os apps Flatpak
flatpak update

# Atualizar app específico
flatpak update com.spotify.Client

# Remover app
flatpak uninstall com.spotify.Client

# Remover e limpar dados
flatpak uninstall --delete-data com.spotify.Client

# Remover orphans (runtimes não usados)
flatpak uninstall --unused`}),a.jsx("h2",{children:"Apps Populares no Flathub"}),a.jsx(e,{title:"Instalar apps populares",code:`# Navegadores
flatpak install flathub com.brave.Browser
flatpak install flathub org.mozilla.firefox
flatpak install flathub com.google.Chrome

# Comunicação
flatpak install flathub com.discordapp.Discord
flatpak install flathub org.telegram.desktop
flatpak install flathub com.slack.Slack
flatpak install flathub us.zoom.Zoom

# Produtividade
flatpak install flathub org.libreoffice.LibreOffice
flatpak install flathub md.obsidian.Obsidian
flatpak install flathub com.notion.Notion

# Desenvolvimento
flatpak install flathub com.visualstudio.code
flatpak install flathub io.dbeaver.DBeaverCommunity

# Multimídia
flatpak install flathub org.videolan.VLC
flatpak install flathub com.spotify.Client
flatpak install flathub org.gimp.GIMP
flatpak install flathub org.inkscape.Inkscape

# Gaming
flatpak install flathub com.heroicgameslauncher.hgl
flatpak install flathub net.lutris.Lutris`}),a.jsx("h2",{children:"Permissões e Sandbox"}),a.jsx(e,{title:"Gerenciar permissões dos apps",code:`# Ver permissões de um app
flatpak info --show-permissions com.spotify.Client

# Instalar Flatseal (GUI para gerenciar permissões)
flatpak install flathub com.github.tchx84.Flatseal

# Modificar permissões via linha de comando
# Dar acesso a uma pasta específica
flatpak override --user --filesystem=~/Downloads com.spotify.Client

# Remover acesso à câmera
flatpak override --user --nodevice=dri com.exemplo.App

# Ver overrides aplicados
flatpak override --user --show com.spotify.Client

# Resetar todas as permissões
flatpak override --user --reset com.spotify.Client`}),a.jsx("h2",{children:"Flatpak vs Pacman vs AUR"}),a.jsx("p",{children:"Quando usar cada um:"}),a.jsxs("ul",{children:[a.jsxs("li",{children:[a.jsx("strong",{children:"Pacman"})," — Ferramentas de sistema, bibliotecas, apps de linha de comando. Melhor integração, menor overhead."]}),a.jsxs("li",{children:[a.jsx("strong",{children:"AUR"})," — Apps que não estão no repositório oficial mas são nativos do Linux. Boa integração, compilado local."]}),a.jsxs("li",{children:[a.jsx("strong",{children:"Flatpak"})," — Apps proprietários (Discord, Spotify), versões mais recentes, apps com muitas dependências, melhor sandbox."]})]}),a.jsx(o,{type:"info",title:"Performance do Flatpak",children:"Flatpaks podem ter overhead de inicialização e usar mais espaço em disco (cada app carrega suas próprias libs). Para apps de linha de comando, prefira sempre o pacman ou AUR."}),a.jsx("h2",{children:"Integração com o Sistema"}),a.jsx(e,{title:"Integrar Flatpaks com o sistema",code:`# Temas GTK para Flatpaks
# Os Flatpaks não veem temas do sistema por padrão
flatpak install flathub org.gtk.Gtk3theme.Adwaita-dark

# Ou usar xdg-desktop-portal para integração
sudo pacman -S xdg-desktop-portal xdg-desktop-portal-gtk

# Para KDE:
sudo pacman -S xdg-desktop-portal-kde

# Para GNOME (já incluído):
sudo pacman -S xdg-desktop-portal-gnome

# Variáveis de ambiente para temas
flatpak override --user --env=GTK_THEME=Adwaita:dark com.discord.Discord

# Localização (idioma em português)
flatpak override --user --env=LANG=pt_BR.UTF-8 com.spotify.Client`})]})}export{m as default};
