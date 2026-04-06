import{j as e}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(s,{title:"Locale, Timezone & Teclado",subtitle:"Configure idioma, fuso horário, layout de teclado e variáveis de localização do sistema Arch Linux.",difficulty:"iniciante",timeToRead:"15 min",children:[e.jsx("h2",{children:"O que é Locale?"}),e.jsx("p",{children:"Locale define o idioma, formato de data/hora, moeda, números e outras convenções regionais do sistema. No Arch Linux, os locales são configurados manualmente durante a instalação, mas podem ser alterados a qualquer momento."}),e.jsx("h2",{children:"Configurando Locales"}),e.jsx(o,{title:"Habilitar locales desejados",code:`# Editar o arquivo de locales
sudo vim /etc/locale.gen

# Descomentar os locales que você precisa:
# pt_BR.UTF-8 UTF-8
# en_US.UTF-8 UTF-8

# Gerar os locales
sudo locale-gen`}),e.jsx(o,{title:"Definir o locale padrão do sistema",code:`# Criar/editar o arquivo locale.conf
sudo tee /etc/locale.conf << 'EOF'
LANG=pt_BR.UTF-8
LC_MESSAGES=en_US.UTF-8
EOF

# LANG = locale principal
# LC_MESSAGES = mensagens do sistema (pode manter em inglês para facilitar buscas)`}),e.jsxs(a,{type:"info",title:"Dica: inglês nas mensagens",children:["Muitos usuários avançados mantêm ",e.jsx("code",{children:"LC_MESSAGES=en_US.UTF-8"})," mesmo com o sistema em português. Isso faz as mensagens de erro ficarem em inglês, facilitando buscar soluções no Google e fóruns."]}),e.jsx("h3",{children:"Variáveis LC_* Individuais"}),e.jsx(o,{title:"Configurar cada aspecto do locale separadamente",code:`# /etc/locale.conf — configuração granular
LANG=pt_BR.UTF-8          # Locale padrão geral
LC_MESSAGES=en_US.UTF-8   # Mensagens do sistema em inglês
LC_TIME=pt_BR.UTF-8       # Formato de data/hora brasileiro
LC_MONETARY=pt_BR.UTF-8   # Formato de moeda (R$)
LC_NUMERIC=pt_BR.UTF-8    # Formato de números (vírgula decimal)
LC_PAPER=pt_BR.UTF-8      # Formato de papel (A4)
LC_MEASUREMENT=pt_BR.UTF-8 # Sistema métrico

# Ver todas as variáveis de locale ativas
locale

# Ver locales disponíveis no sistema
locale -a`}),e.jsx("h2",{children:"Fuso Horário (Timezone)"}),e.jsx(o,{title:"Configurar fuso horário",code:`# Listar fusos horários disponíveis
timedatectl list-timezones | grep America

# Definir fuso horário
sudo timedatectl set-timezone America/Sao_Paulo

# Verificar
timedatectl

# Alternativa manual (symlink)
sudo ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime`}),e.jsx("h3",{children:"Sincronização de Relógio (NTP)"}),e.jsx(o,{title:"Configurar sincronização automática do relógio",code:`# Habilitar sincronização NTP
sudo timedatectl set-ntp true

# Verificar status
timedatectl

# Ver status do serviço de sincronização
systemctl status systemd-timesyncd

# Configurar servidores NTP
sudo vim /etc/systemd/timesyncd.conf
# [Time]
# NTP=pool.ntp.br
# FallbackNTP=0.arch.pool.ntp.org 1.arch.pool.ntp.org

# Reiniciar o serviço
sudo systemctl restart systemd-timesyncd`}),e.jsxs(a,{type:"warning",title:"Dual-boot com Windows",children:["O Windows usa hora local (localtime) no relógio de hardware, enquanto o Linux usa UTC. Em dual-boot, isso causa o relógio errado em um dos sistemas. A solução mais segura é configurar o Windows para usar UTC, ou configurar o Linux para usar localtime:",e.jsx("br",{}),e.jsx("br",{}),e.jsx("code",{children:"sudo timedatectl set-local-rtc 1"})," (usar localtime como Windows)",e.jsx("br",{}),e.jsx("code",{children:"sudo timedatectl set-local-rtc 0"})," (usar UTC, padrão Linux)"]}),e.jsx("h2",{children:"Layout de Teclado"}),e.jsx("h3",{children:"Console (TTY)"}),e.jsx(o,{title:"Configurar teclado no console",code:`# Listar layouts disponíveis
localectl list-keymaps | grep br

# Definir layout brasileiro ABNT2
sudo localectl set-keymap br-abnt2

# Verificar
localectl

# O arquivo de configuração fica em:
cat /etc/vconsole.conf
# KEYMAP=br-abnt2`}),e.jsx("h3",{children:"Ambiente Gráfico (X11/Wayland)"}),e.jsx(o,{title:"Configurar teclado no X11",code:`# Listar layouts X11 disponíveis
localectl list-x11-keymap-layouts | grep br

# Definir layout X11 brasileiro
sudo localectl set-x11-keymap br "" abnt2

# Ou manualmente criar arquivo de configuração
sudo tee /etc/X11/xorg.conf.d/00-keyboard.conf << 'EOF'
Section "InputClass"
    Identifier "system-keyboard"
    MatchIsKeyboard "on"
    Option "XkbLayout" "br"
    Option "XkbModel" "abnt2"
    Option "XkbVariant" ""
    Option "XkbOptions" "terminate:ctrl_alt_bksp"
EndSection
EOF`}),e.jsx(o,{title:"Configurar teclado no Wayland (Sway/Hyprland)",code:`# Sway — em ~/.config/sway/config
input "type:keyboard" {
    xkb_layout br
    xkb_model abnt2
}

# Hyprland — em ~/.config/hypr/hyprland.conf
input {
    kb_layout = br
    kb_model = abnt2
}`}),e.jsx("h3",{children:"Configurações Avançadas de Teclado"}),e.jsx(o,{title:"Opções especiais de teclado (XkbOptions)",code:`# Caps Lock como Ctrl adicional
sudo localectl set-x11-keymap br "" abnt2 "ctrl:nocaps"

# Caps Lock como Escape (útil para Vim)
sudo localectl set-x11-keymap br "" abnt2 "caps:escape"

# Trocar Caps Lock e Escape
sudo localectl set-x11-keymap br "" abnt2 "caps:swapescape"

# Ctrl+Alt+Backspace mata o servidor X
sudo localectl set-x11-keymap br "" abnt2 "terminate:ctrl_alt_bksp"

# Combinar opções
sudo localectl set-x11-keymap br "" abnt2 "caps:escape,terminate:ctrl_alt_bksp"

# Listar todas as opções disponíveis
localectl list-x11-keymap-options`}),e.jsx("h2",{children:"Fontes do Console"}),e.jsx(o,{title:"Configurar fonte do console (TTY)",code:`# Listar fontes disponíveis
ls /usr/share/kbd/consolefonts/

# Testar uma fonte
setfont ter-v18n

# Definir permanentemente em /etc/vconsole.conf
KEYMAP=br-abnt2
FONT=ter-v18n

# Instalar mais fontes de console
sudo pacman -S terminus-font`}),e.jsx("h2",{children:"Verificação Completa"}),e.jsx(o,{title:"Verificar todas as configurações regionais",code:`# Locale
locale

# Timezone
timedatectl

# Teclado
localectl

# Console
cat /etc/vconsole.conf

# Verificar se o UTF-8 está funcionando
echo "Olá, mundo! Ação, coração, café ☕"`})]})}export{u as default};
