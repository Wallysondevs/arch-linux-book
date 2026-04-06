import{j as o}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return o.jsxs(a,{title:"Processo de Boot",subtitle:"Da pressão do botão de ligar até o prompt de login. Entenda cada etapa do boot no Arch Linux com UEFI, GRUB e systemd.",difficulty:"intermediario",timeToRead:"18 min",children:[o.jsx("h2",{children:"Visão Geral do Boot"}),o.jsx("p",{children:"Quando você liga o computador, uma sequência precisa de eventos acontece antes de você ver o prompt de login. Entender essa sequência é essencial para diagnosticar problemas de boot e configurar o sistema corretamente."}),o.jsx("p",{children:"A sequência completa em um sistema moderno com UEFI é:"}),o.jsxs("ol",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"Power-on"})," — CPU executa código da ROM/Flash (firmware UEFI)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"UEFI POST"})," — Power-On Self Test, verifica hardware básico"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"UEFI Boot Manager"})," — Identifica e carrega o bootloader"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Bootloader (GRUB/systemd-boot)"})," — Carrega o kernel e initramfs"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Kernel"})," — Inicializa hardware, monta o initramfs"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"initramfs"})," — Ambiente temporário para preparar o sistema real"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Root filesystem"})," — Sistema de arquivos real é montado"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"systemd (PID 1)"})," — Gerencia inicialização dos serviços"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"Login"})," — Getty ou display manager aparece"]})]}),o.jsx("h2",{children:"Etapa 1: Firmware UEFI"}),o.jsx("p",{children:"UEFI (Unified Extensible Firmware Interface) substituiu o BIOS legado na maioria dos computadores fabricados após 2012. É o primeiro software que roda ao ligar o PC."}),o.jsxs("ul",{children:[o.jsx("li",{children:"Armazenado em chip flash na placa-mãe"}),o.jsx("li",{children:"Roda em modo 64-bit (diferente do BIOS que era 16-bit)"}),o.jsx("li",{children:"Suporta discos GPT maiores que 2TB"}),o.jsx("li",{children:"Tem seu próprio shell e gerenciador de boot"}),o.jsx("li",{children:"Pode inicializar diretamente sem bootloader (EFISTUB)"})]}),o.jsx(e,{title:"Gerenciar entradas UEFI via efibootmgr",code:`# Listar entradas de boot UEFI
efibootmgr

# Saída típica:
# BootCurrent: 0002
# Timeout: 1 seconds
# BootOrder: 0002,0000,0001
# Boot0000* Windows Boot Manager    HD(1,GPT,...)
# Boot0001* UEFI: USB Drive         HD(2,GPT,...)
# Boot0002* Arch Linux              HD(1,GPT,...)/File(EFIGRUBgrubx64.efi)

# Criar nova entrada de boot
efibootmgr --create --disk /dev/sda --part 1 --label "Arch Linux" --loader 'EFIGRUBgrubx64.efi'

# Remover entrada de boot
efibootmgr --delete-bootnum --bootnum 0003

# Definir ordem de boot
efibootmgr --bootorder 0002,0001,0000

# Ativar/desativar entrada
efibootmgr --active --bootnum 0002
efibootmgr --inactive --bootnum 0001

# Próximo boot (uma vez só)
efibootmgr --bootnext 0001`}),o.jsx("h2",{children:"Partição EFI (ESP)"}),o.jsxs("p",{children:["A ESP (EFI System Partition) é onde o UEFI procura os bootloaders. Deve ser formatada como FAT32 e montada em ",o.jsx("code",{children:"/boot"})," ou ",o.jsx("code",{children:"/boot/efi"}),"."]}),o.jsx(e,{title:"Configurar a partição EFI",code:`# Ver partições e identificar a ESP
lsblk -f
# nvme0n1p1  vfat  FAT32  ESP   ...  /boot

# A ESP geralmente é identificada pelo tipo GPT:
# gdisk: EF00 (EFI System)
# fdisk: EFI System

# Montar a ESP manualmente
mount /dev/nvme0n1p1 /boot

# Ver conteúdo típico da ESP
ls /boot/EFI/
# BOOT/  Arch/  Microsoft/  grub/

ls /boot/EFI/grub/
# grubx64.efi

# Verificar tipo da partição
blkid /dev/nvme0n1p1
# ... TYPE="vfat" PARTLABEL="EFI system partition" ...`}),o.jsx("h2",{children:"Etapa 2: GRUB (Bootloader)"}),o.jsx("p",{children:"O GRUB (Grand Unified Bootloader) é o bootloader mais popular no Arch Linux. Ele:"}),o.jsxs("ul",{children:[o.jsx("li",{children:"Apresenta um menu para escolher o sistema operacional"}),o.jsx("li",{children:"Carrega o kernel e o initramfs na memória RAM"}),o.jsx("li",{children:"Passa parâmetros de boot ao kernel"}),o.jsx("li",{children:"Suporta múltiplos SO (Windows, outras distros)"})]}),o.jsx("h3",{children:"Configuração do GRUB"}),o.jsx(e,{title:"Gerenciar o GRUB",code:`# Instalar GRUB (se não estiver instalado)
sudo pacman -S grub efibootmgr

# Instalar GRUB na ESP (para UEFI)
sudo grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB

# Gerar o arquivo de configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Ver o arquivo gerado
cat /boot/grub/grub.cfg | head -50

# Configuração principal do GRUB
sudo nano /etc/default/grub`}),o.jsx(e,{title:"/etc/default/grub - Configurações importantes",code:`# Tempo de espera no menu (segundos)
GRUB_TIMEOUT=5

# Entrada padrão (0 = primeira, saved = última escolhida)
GRUB_DEFAULT=0
# ou: GRUB_DEFAULT=saved com GRUB_SAVEDEFAULT=true

# Parâmetros passados ao kernel
GRUB_CMDLINE_LINUX_DEFAULT="quiet loglevel=3"
# quiet = menos mensagens de boot
# loglevel=3 = apenas erros
# nomodeset = desabilitar KMS (útil para problemas de vídeo)
# resume=/dev/sdaX = partição de swap para hibernação
# nvidia-drm.modeset=1 = para NVIDIA com Wayland
# iommu=on = para passthrough de GPU em VMs

# Parâmetros para todos os boots (incluindo recovery)
GRUB_CMDLINE_LINUX=""

# Resolução do menu GRUB
GRUB_GFXMODE=1920x1080,auto
GRUB_GFXPAYLOAD_LINUX=keep

# Salvar última escolha
GRUB_SAVEDEFAULT=true
GRUB_DEFAULT=saved

# APÓS EDITAR: regenerar configuração
# sudo grub-mkconfig -o /boot/grub/grub.cfg`}),o.jsxs(r,{type:"info",title:"Sempre regenerar após editar",children:["Após qualquer mudança em ",o.jsx("code",{children:"/etc/default/grub"}),", execute",o.jsx("code",{children:"sudo grub-mkconfig -o /boot/grub/grub.cfg"})," para aplicar as mudanças. O arquivo ",o.jsx("code",{children:"grub.cfg"})," é gerado automaticamente e não deve ser editado diretamente."]}),o.jsx("h2",{children:"systemd-boot (Alternativa ao GRUB)"}),o.jsxs("p",{children:["O systemd-boot é um bootloader minimalista incluído no systemd. Mais simples que o GRUB, mas suporta apenas sistemas UEFI e funciona melhor quando a ESP é montada em ",o.jsx("code",{children:"/boot"}),"."]}),o.jsx(e,{title:"Instalar e configurar systemd-boot",code:`# Instalar systemd-boot na ESP
sudo bootctl install

# Verificar instalação
bootctl status

# Localização dos arquivos
ls /boot/loader/          # Configuração principal
ls /boot/loader/entries/  # Entradas de boot

# Criar entrada para Arch Linux
sudo nano /boot/loader/entries/arch.conf`}),o.jsx(e,{title:"/boot/loader/entries/arch.conf",code:`title   Arch Linux
linux   /vmlinuz-linux
initrd  /amd-ucode.img    # ou intel-ucode.img
initrd  /initramfs-linux.img
options root=PARTUUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx rw quiet loglevel=3

# Para encontrar o PARTUUID da partição root:
# blkid /dev/nvme0n1p3 | grep PARTUUID`}),o.jsx(e,{title:"/boot/loader/loader.conf - Configuração principal",code:`default arch.conf
timeout 5
console-mode max
editor no    # Desabilitar edição de parâmetros no boot (mais seguro)`}),o.jsx(e,{title:"Gerenciar systemd-boot",code:`# Ver status
bootctl status

# Atualizar o bootloader
bootctl update

# Listar entradas de boot
bootctl list

# Definir próximo boot
bootctl set-oneshot arch-fallback.conf`}),o.jsx("h2",{children:"Microcode (Intel/AMD)"}),o.jsx("p",{children:"Microcode são atualizações de firmware para a CPU que corrigem bugs e vulnerabilidades. Devem ser carregados o mais cedo possível no boot, antes do kernel inicializar a CPU."}),o.jsx(e,{title:"Instalar e configurar microcode",code:`# Para CPU Intel
sudo pacman -S intel-ucode

# Para CPU AMD
sudo pacman -S amd-ucode

# Verificar qual CPU você tem
lscpu | grep "Model name"
cat /proc/cpuinfo | grep "model name" | head -1

# Para GRUB: apenas regenerar a configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg
# O GRUB detecta automaticamente e adiciona o microcode

# Para systemd-boot: adicionar linha initrd no .conf
# initrd /intel-ucode.img   (antes do initramfs)
# initrd /initramfs-linux.img

# Verificar se o microcode está sendo carregado
dmesg | grep -i microcode
# microcode: Current revision: 0x0000000f
# microcode: Updated early: 0x00000010`}),o.jsx("h2",{children:"Etapas 5-7: Kernel e initramfs"}),o.jsx("p",{children:"Após o bootloader, o kernel é carregado na RAM e começa a execução. Ele:"}),o.jsxs("ol",{children:[o.jsx("li",{children:"Descomprime a si mesmo (o kernel é armazenado comprimido)"}),o.jsx("li",{children:"Inicializa hardware básico (CPU, memória, barramento PCI)"}),o.jsx("li",{children:"Monta o initramfs como sistema de arquivos temporário"}),o.jsxs("li",{children:["Executa ",o.jsx("code",{children:"/init"})," dentro do initramfs (que é o systemd no Arch)"]}),o.jsx("li",{children:"O initramfs carrega módulos necessários e monta o sistema real"}),o.jsxs("li",{children:["O sistema real é montado em ",o.jsx("code",{children:"/"})]}),o.jsx("li",{children:"O initramfs passa o controle para o systemd do sistema real"})]}),o.jsx("h2",{children:"Etapa 8: systemd (PID 1)"}),o.jsx("p",{children:"O systemd é o primeiro processo no espaço de usuário (PID 1). Ele é responsável por inicializar todos os outros serviços do sistema."}),o.jsx(e,{title:"Visualizar o processo de boot do systemd",code:`# Análise de tempo de boot
systemd-analyze

# Saída:
# Startup finished in 1.234s (firmware) + 3.567s (loader) + 1.890s (kernel) + 8.123s (userspace) = 14.814s
# graphical.target reached after 8.045s in userspace.

# Ver qual serviço está atrasando o boot
systemd-analyze blame

# Gráfico SVG do boot (abre no navegador)
systemd-analyze plot > boot.svg && xdg-open boot.svg

# Ver a cadeia crítica do boot
systemd-analyze critical-chain

# Ver log completo do boot atual
journalctl -b

# Ver log do boot anterior
journalctl -b -1

# Ver apenas mensagens de erro do boot
journalctl -b -p err`}),o.jsx("h2",{children:"Recuperação de Boot Quebrado"}),o.jsx("p",{children:"Se o sistema não consegue bootar, você pode usar a ISO do Arch para entrar em chroot e reparar o sistema."}),o.jsx(e,{title:"Recuperar sistema via chroot",code:`# Boot pela ISO do Arch Linux
# Conectar na internet
iwctl station wlan0 connect "MinhaRede"

# Montar o sistema instalado
mount /dev/nvme0n1p3 /mnt        # partição root
mount /dev/nvme0n1p1 /mnt/boot   # partição ESP (EFI)
# Se tiver /home separado:
mount /dev/nvme0n1p4 /mnt/home

# Montar sistemas virtuais necessários
arch-chroot /mnt    # Isso cuida de montar proc, sys, dev automaticamente

# Agora você está dentro do sistema instalado
# Reparar problemas:

# Regenerar initramfs
mkinitcpio -P

# Reinstalar/reconfigurar GRUB
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Ou reinstalar systemd-boot
bootctl install

# Sair do chroot
exit

# Desmontar e reiniciar
umount -R /mnt
reboot`}),o.jsxs(r,{type:"warning",title:"Fallback initramfs",children:["O Arch sempre gera dois initramfs: o normal e um ",o.jsx("strong",{children:"fallback"}),". O fallback inclui todos os módulos disponíveis, sendo muito maior mas mais compatível. Se o sistema normal não boota, tente o fallback no menu do GRUB."]}),o.jsx("h2",{children:"Secure Boot"}),o.jsx("p",{children:"O Secure Boot é uma funcionalidade UEFI que verifica assinaturas digitais dos bootloaders antes de carregá-los. Por padrão, o Arch Linux não tem suporte a Secure Boot, mas é possível configurar."}),o.jsx(e,{title:"Lidar com Secure Boot",code:`# Verificar status do Secure Boot
bootctl status | grep "Secure Boot"
# ou
mokutil --sb-state

# Opção 1: Desabilitar Secure Boot (mais fácil)
# Entre na UEFI/BIOS e procure por "Secure Boot" e desabilite

# Opção 2: Usar shim (mantém Secure Boot)
sudo pacman -S shim-signed

# Opção 3: Assinar seu próprio bootloader (avançado)
# Requer criar chaves MOK (Machine Owner Keys)
sudo pacman -S sbsigntools efitools
# Processo complexo, ver wiki.archlinux.org/Secure_Boot`})]})}export{u as default};
