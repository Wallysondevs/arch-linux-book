import{j as o}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function m(){return o.jsxs(r,{title:"Bootloaders: GRUB & systemd-boot",subtitle:"Entenda os bootloaders do Linux, como configurar GRUB e systemd-boot, e como gerenciar múltiplos sistemas operacionais.",difficulty:"intermediario",timeToRead:"25 min",children:[o.jsx("h2",{children:"O que é um Bootloader?"}),o.jsxs("p",{children:["O bootloader (carregador de inicialização) é o primeiro software que roda quando você liga o computador. Ele é responsável por carregar o kernel do Linux na memória e iniciar o sistema operacional. No Arch Linux, os dois bootloaders mais populares são o ",o.jsx("strong",{children:"GRUB"})," e o ",o.jsx("strong",{children:"systemd-boot"}),"."]}),o.jsxs(a,{type:"info",title:"GRUB vs systemd-boot",children:["O ",o.jsx("strong",{children:"GRUB"})," é mais poderoso e suporta BIOS e UEFI, mas é mais complexo. O ",o.jsx("strong",{children:"systemd-boot"})," (antigo gummiboot) é mais simples, mais rápido e integrado ao systemd, mas só funciona em UEFI. Para instalações modernas com UEFI, o systemd-boot é geralmente preferido pela comunidade Arch."]}),o.jsx("h2",{children:"GRUB (Grand Unified Bootloader)"}),o.jsx("h3",{children:"Instalação do GRUB em UEFI"}),o.jsx(e,{title:"Instalar GRUB em sistema UEFI",code:`# Instalar pacotes necessários
sudo pacman -S grub efibootmgr

# Instalar o GRUB na partição EFI
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB

# Gerar o arquivo de configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg`}),o.jsx("h3",{children:"Instalação do GRUB em BIOS/MBR (Legacy)"}),o.jsx(e,{title:"Instalar GRUB em sistema BIOS",code:`# Instalar GRUB
sudo pacman -S grub

# Instalar no disco (NÃO na partição!)
sudo grub-install --target=i386-pc /dev/sda

# Gerar configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg`}),o.jsxs(a,{type:"danger",title:"Cuidado com grub-install",children:["Em BIOS/MBR, instale no disco (",o.jsx("code",{children:"/dev/sda"}),"), NÃO na partição (",o.jsx("code",{children:"/dev/sda1"}),"). Instalar na partição pode tornar o sistema não-inicializável."]}),o.jsx("h3",{children:"Configuração do GRUB"}),o.jsxs("p",{children:["O arquivo principal de configuração é ",o.jsx("code",{children:"/etc/default/grub"}),". Após qualquer alteração, você precisa regenerar o ",o.jsx("code",{children:"grub.cfg"}),"."]}),o.jsx(e,{title:"Configurações úteis do /etc/default/grub",code:`# Tempo de espera no menu (em segundos)
GRUB_TIMEOUT=5

# Sistema padrão para iniciar (0 = primeiro da lista)
GRUB_DEFAULT=0

# Lembrar a última escolha do usuário
GRUB_DEFAULT=saved
GRUB_SAVEDEFAULT=true

# Parâmetros do kernel
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet"

# Resolução do console
GRUB_GFXMODE=1920x1080

# Desativar submenu (mostra tudo na lista principal)
GRUB_DISABLE_SUBMENU=y

# Habilitar detecção de outros SOs (precisa do os-prober)
GRUB_DISABLE_OS_PROBER=false`}),o.jsx(e,{title:"Regenerar configuração após mudanças",code:"sudo grub-mkconfig -o /boot/grub/grub.cfg"}),o.jsx("h3",{children:"Dual-Boot com Windows"}),o.jsx(e,{title:"Configurar dual-boot com Windows",code:`# Instalar os-prober para detectar Windows
sudo pacman -S os-prober

# Montar a partição do Windows (se não estiver montada)
sudo mount /dev/sda3 /mnt/windows

# Habilitar os-prober no GRUB
sudo vim /etc/default/grub
# Adicionar: GRUB_DISABLE_OS_PROBER=false

# Regenerar configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg

# O Windows deve aparecer como opção no menu do GRUB`}),o.jsx("h3",{children:"Temas do GRUB"}),o.jsx(e,{title:"Instalar um tema no GRUB",code:`# Exemplo: instalar tema do AUR
yay -S grub-theme-vimix

# Configurar o tema em /etc/default/grub
GRUB_THEME="/usr/share/grub/themes/Vimix/theme.txt"

# Regenerar
sudo grub-mkconfig -o /boot/grub/grub.cfg`}),o.jsx("h2",{children:"systemd-boot"}),o.jsx("p",{children:"O systemd-boot é um bootloader UEFI simples e rápido, integrado ao systemd. Ele é a escolha preferida para instalações modernas do Arch Linux."}),o.jsx("h3",{children:"Instalação do systemd-boot"}),o.jsx(e,{title:"Instalar systemd-boot",code:`# A partição EFI deve estar montada em /boot
# (ou /efi, mas /boot é mais simples)

# Instalar
sudo bootctl install

# Verificar status
bootctl status`}),o.jsx("h3",{children:"Configuração de Entradas"}),o.jsx(e,{title:"Configurar o loader principal",code:`# Editar /boot/loader/loader.conf
sudo vim /boot/loader/loader.conf

# Conteúdo:
default arch.conf
timeout 3
console-mode max
editor  no`}),o.jsx(e,{title:"Criar entrada para o Arch Linux",code:`# Criar /boot/loader/entries/arch.conf
sudo vim /boot/loader/entries/arch.conf

# Conteúdo para partição ext4/xfs:
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=XXXX-XXXX-XXXX rw quiet loglevel=3

# Para descobrir o UUID:
blkid /dev/sda2`}),o.jsx(e,{title:"Entrada para kernel LTS (fallback)",code:`# Criar /boot/loader/entries/arch-lts.conf
title   Arch Linux (LTS)
linux   /vmlinuz-linux-lts
initrd  /initramfs-linux-lts.img
options root=UUID=XXXX-XXXX-XXXX rw quiet`}),o.jsx(e,{title:"Entrada com Btrfs e LUKS",code:`# /boot/loader/entries/arch.conf
title   Arch Linux
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options rd.luks.name=UUID-DO-LUKS=cryptroot root=/dev/mapper/cryptroot rootflags=subvol=@ rw quiet`}),o.jsx("h3",{children:"Atualização Automática"}),o.jsx(e,{title:"Configurar atualização automática do systemd-boot",code:`# O pacman hook do systemd-boot atualiza automaticamente
# Verificar se o hook existe
ls /usr/lib/systemd/boot/

# Habilitar atualização automática
sudo systemctl enable systemd-boot-update.service

# Atualizar manualmente
sudo bootctl update`}),o.jsx("h2",{children:"Microcode (Intel/AMD)"}),o.jsx("p",{children:"Microcodes são atualizações de firmware para o processador. Carregá-los no boot corrige bugs e vulnerabilidades de hardware."}),o.jsx(e,{title:"Instalar e configurar microcode",code:`# Intel
sudo pacman -S intel-ucode

# AMD
sudo pacman -S amd-ucode

# Para GRUB: regenerar configuração (detecta automaticamente)
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Para systemd-boot: adicionar na entrada ANTES do initramfs
# initrd  /intel-ucode.img    (ou /amd-ucode.img)
# initrd  /initramfs-linux.img`}),o.jsx("h2",{children:"Recuperação de Boot"}),o.jsx(e,{title:"Recuperar GRUB quebrado usando Live USB",code:`# 1. Bootar pelo Live USB do Arch

# 2. Montar as partições
mount /dev/sda2 /mnt          # partição root
mount /dev/sda1 /mnt/boot/efi # partição EFI (se UEFI)

# 3. Entrar no chroot
arch-chroot /mnt

# 4. Reinstalar GRUB
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# 5. Sair e reiniciar
exit
umount -R /mnt
reboot`}),o.jsxs(a,{type:"info",title:"Qual bootloader escolher?",children:[o.jsx("strong",{children:"systemd-boot"}),": se você usa apenas UEFI, quer simplicidade e velocidade. Ideal para single-boot ou dual-boot simples.",o.jsx("br",{}),o.jsx("br",{}),o.jsx("strong",{children:"GRUB"}),": se precisa de BIOS/Legacy, quer temas visuais, precisa de criptografia complexa ou tem muitos SOs para gerenciar."]})]})}export{m as default};
