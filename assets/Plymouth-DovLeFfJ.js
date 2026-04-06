import{j as e}from"./ui-K-J8Jkwj.js";import{P as t}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function h(){return e.jsxs(t,{title:"Plymouth: Tela de Boot",subtitle:"Configure uma tela de boot bonita com animação, temas e transição suave para o login no Arch Linux.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsx("h2",{children:"O que é Plymouth?"}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"Plymouth"})," é o sistema de splash screen do Linux. Ele mostra uma tela de boot bonita com animação enquanto o sistema carrega, substituindo as mensagens de texto técnicas. Fornece uma transição visual suave do boot até a tela de login."]}),e.jsx("h2",{children:"Instalação"}),e.jsx(o,{title:"Instalar e configurar Plymouth",code:`# Instalar Plymouth
sudo pacman -S plymouth

# Adicionar hook ao mkinitcpio
sudo vim /etc/mkinitcpio.conf
# Adicionar "plymouth" após "base" e "udev" nos HOOKS:
# HOOKS=(base udev plymouth ... filesystems ...)
# Se usar encrypt: substituir "encrypt" por "plymouth-encrypt"

# Reconstruir initramfs
sudo mkinitcpio -P`}),e.jsx("h2",{children:"Configuração do Bootloader"}),e.jsx(o,{title:"Configurar kernel para Plymouth",code:`# GRUB: editar /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash loglevel=3 rd.udev.log_priority=3 vt.global_cursor_default=0"

# Regenerar
sudo grub-mkconfig -o /boot/grub/grub.cfg

# systemd-boot: editar entrada
options ... quiet splash loglevel=3 rd.udev.log_priority=3 vt.global_cursor_default=0

# Parâmetros explicados:
# quiet        — reduzir mensagens de boot
# splash       — habilitar Plymouth
# loglevel=3   — só mostrar erros
# rd.udev.log_priority=3 — reduzir logs do udev
# vt.global_cursor_default=0 — esconder cursor piscante`}),e.jsx("h2",{children:"Temas"}),e.jsx(o,{title:"Gerenciar temas do Plymouth",code:`# Listar temas instalados
plymouth-set-default-theme --list

# Ver tema atual
plymouth-set-default-theme

# Mudar tema
sudo plymouth-set-default-theme -R bgrt
# -R reconstrui o initramfs automaticamente

# Temas incluídos:
# bgrt       — Logo do fabricante (do UEFI)
# fade-in    — Fade simples com estrelas
# glow       — Logo com brilho
# script     — Logo Arch com spinner
# solar      — Efeito solar
# spinner    — Spinner animado
# text       — Apenas texto
# tribar     — Barras coloridas

# Instalar temas extras do AUR
yay -S plymouth-theme-arch-charge
yay -S plymouth-theme-monoarch

# Após instalar tema novo
sudo plymouth-set-default-theme -R nome-do-tema`}),e.jsx("h2",{children:"Integração com Display Manager"}),e.jsx(o,{title:"Transição suave para o login",code:`# Para SDDM
sudo systemctl disable sddm
sudo systemctl enable sddm-plymouth

# Para GDM
sudo systemctl disable gdm
sudo systemctl enable gdm-plymouth

# Para LightDM
sudo systemctl disable lightdm
sudo systemctl enable lightdm-plymouth

# Isso faz o Plymouth fazer uma transição suave
# para a tela de login em vez de piscar`}),e.jsx("h2",{children:"Testando sem Reiniciar"}),e.jsx(o,{title:"Testar tema do Plymouth",code:`# Testar em modo texto (dentro do desktop)
sudo plymouthd
sudo plymouth --show-splash
# Esperar alguns segundos
sudo plymouth --quit

# Definir duração do teste
sudo plymouthd; sudo plymouth --show-splash; sleep 5; sudo plymouth --quit`}),e.jsx("h2",{children:"Criando Tema Personalizado"}),e.jsx(o,{title:"Estrutura de um tema Plymouth",code:`# Temas ficam em /usr/share/plymouth/themes/
# Cada tema tem:
# ├── nome-do-tema.plymouth  # Arquivo de definição
# ├── nome-do-tema.script    # Script de animação
# └── imagens/               # Imagens do tema

# Exemplo de arquivo .plymouth
# /usr/share/plymouth/themes/meu-tema/meu-tema.plymouth
[Plymouth Theme]
Name=Meu Tema
Description=Tema personalizado para Arch
ModuleName=script

[script]
ImageDir=/usr/share/plymouth/themes/meu-tema
ScriptFile=/usr/share/plymouth/themes/meu-tema/meu-tema.script`}),e.jsxs(a,{type:"info",title:"Plymouth e tempo de boot",children:["O Plymouth adiciona uma fração de segundo ao boot. Em SSDs/NVMe modernos, o boot pode ser tão rápido que a animação mal aparece. Nesse caso, você pode adicionar ",e.jsx("code",{children:"plymouth.force-splash-screen"})," aos parâmetros do kernel para garantir que a animação seja exibida."]})]})}export{h as default};
