import{j as e}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as a}from"./CodeBlock-DEDRw1y6.js";import{A as o}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(r,{title:"Criptografia LUKS",subtitle:"Proteja seus dados com criptografia de disco completa. LUKS (Linux Unified Key Setup) é o padrão para criptografia de partições e discos no Linux.",difficulty:"avancado",timeToRead:"20 min",children:[e.jsx("h2",{children:"O que é LUKS?"}),e.jsx("p",{children:"O LUKS (Linux Unified Key Setup) é o padrão de facto para criptografia de disco no Linux. Ele cria um container criptografado onde você armazena partições ou sistemas de arquivos completos."}),e.jsxs("p",{children:["Com LUKS, mesmo que alguém roube seu HD, sem a senha/chave nada pode ser lido. O Arch Linux suporta LUKS de primeira classe via ",e.jsx("code",{children:"cryptsetup"}),"."]}),e.jsx("h2",{children:"Criptografar uma Partição"}),e.jsx(o,{type:"danger",title:"CUIDADO: A criptografia DESTRÓI dados existentes",children:"Formatar uma partição com LUKS apaga todos os dados existentes nela. Faça backup antes de continuar!"}),e.jsx(a,{title:"Criar e montar container LUKS",code:`# Instalar cryptsetup
sudo pacman -S cryptsetup

# Formatar partição com LUKS (APAGA TUDO!)
# Use LUKS2 (padrão moderno)
sudo cryptsetup luksFormat /dev/sdb1

# Saída:
# WARNING! Este dispositivo será sobrescrito e todos os dados serão perdidos.
# Tem certeza? (Escreva maiúsculas yes): YES
# Informe a frase-chave:
# Verifique a frase-chave:

# Abrir o container LUKS (montar criptografia)
sudo cryptsetup open /dev/sdb1 nome-mapeado
# Senha solicitada
# Cria /dev/mapper/nome-mapeado

# Formatar o volume decriptografado
sudo mkfs.ext4 /dev/mapper/nome-mapeado
sudo mkfs.btrfs /dev/mapper/nome-mapeado

# Montar
sudo mount /dev/mapper/nome-mapeado /mnt/dados

# Usar normalmente!

# Quando terminar, desmontar e fechar
sudo umount /mnt/dados
sudo cryptsetup close nome-mapeado`}),e.jsx("h2",{children:"LUKS com LUKS2 e Argon2id"}),e.jsx(a,{title:"Criação segura com parâmetros avançados",code:`# LUKS2 com Argon2id (mais seguro para senhas)
sudo cryptsetup luksFormat     --type luks2     --cipher aes-xts-plain64     --hash sha512     --iter-time 5000     --key-size 512     --pbkdf argon2id     --pbkdf-memory 1048576   # 1GB de memória para derivação de chave
    /dev/sdb1

# Ver informações do container LUKS
sudo cryptsetup luksDump /dev/sdb1

# Saída:
# LUKS header information
# Version:        2
# Epoch:          3
# Metadata area:  16384 [bytes]
# Keyslots area:  16744448 [bytes]
# UUID:           xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# Label:          (no label)
# Subsystem:      (no subsystem)
# Flags:          (no flags)
# ...`}),e.jsx("h2",{children:"Full Disk Encryption na Instalação"}),e.jsx(a,{title:"Instalar Arch Linux com FDE (Full Disk Encryption)",code:`# Na ISO do Arch Linux:

# 1. Criar partições
# sda1: EFI (512MB) - NÃO criptografar! O bootloader precisa acessar.
# sda2: LUKS container (resto do disco)
fdisk /dev/sda
# Partição 1: tipo EF00 (EFI)
# Partição 2: tipo 8300 (Linux filesystem)

# 2. Configurar EFI
mkfs.fat -F32 /dev/sda1

# 3. Criptografar partição principal
cryptsetup luksFormat --type luks2 /dev/sda2

# 4. Abrir container
cryptsetup open /dev/sda2 cryptroot

# 5. Criar estrutura de volumes (opcional: LVM sobre LUKS)
# Sem LVM:
mkfs.btrfs -L "Arch Linux" /dev/mapper/cryptroot

# Com LVM:
pvcreate /dev/mapper/cryptroot
vgcreate vg0 /dev/mapper/cryptroot
lvcreate -L 50G vg0 -n root
lvcreate -l 100%FREE vg0 -n home
mkfs.btrfs /dev/vg0/root
mkfs.btrfs /dev/vg0/home

# 6. Montar e instalar
mount /dev/mapper/cryptroot /mnt
# ou se LVM:
mount /dev/vg0/root /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot

pacstrap -K /mnt base linux linux-firmware cryptsetup lvm2

# 7. Configurar mkinitcpio para LUKS
arch-chroot /mnt
nano /etc/mkinitcpio.conf
# HOOKS=(base udev autodetect microcode modconf kms keyboard keymap block encrypt lvm2 filesystems fsck)
mkinitcpio -P

# 8. Configurar GRUB
nano /etc/default/grub
# Adicionar ao GRUB_CMDLINE_LINUX:
# cryptdevice=UUID=xxx:cryptroot root=/dev/mapper/cryptroot

# Pegar UUID:
blkid /dev/sda2 | grep UUID

grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg`}),e.jsx("h2",{children:"Gerenciar Chaves LUKS"}),e.jsx(a,{title:"Adicionar e remover chaves/senhas",code:`# LUKS suporta até 32 keyslots (chaves)!
# Útil para ter chave de recuperação além da senha principal

# Adicionar nova chave (senha ou arquivo)
sudo cryptsetup luksAddKey /dev/sda2
# Pedirá: senha existente, depois a nova senha

# Adicionar chave via arquivo (keyfile)
# Criar arquivo de chave aleatória
sudo dd if=/dev/urandom of=/etc/luks-keyfile bs=512 count=8
sudo chmod 400 /etc/luks-keyfile    # Apenas root pode ler

# Adicionar keyfile como chave LUKS
sudo cryptsetup luksAddKey /dev/sda2 /etc/luks-keyfile
# Pedirá: senha existente para autorizar

# Listar keyslots (quais estão em uso)
sudo cryptsetup luksDump /dev/sda2 | grep "Key Slot"

# Remover chave específica (pelo slot ou informando a senha)
sudo cryptsetup luksRemoveKey /dev/sda2    # Remove informando a chave
sudo cryptsetup luksKillSlot /dev/sda2 1  # Pelo slot 1

# Mudar senha (adicionar nova + remover antiga)
sudo cryptsetup luksChangeKey /dev/sda2`}),e.jsx("h2",{children:"Auto-montagem com crypttab"}),e.jsx(a,{title:"/etc/crypttab - Montar automaticamente no boot",code:`# Para discos secundários criptografados (não o root)

# Ver UUID do disco LUKS
sudo cryptsetup luksDump /dev/sdb1 | grep "UUID"
# ou:
blkid /dev/sdb1

# Editar /etc/crypttab
sudo nano /etc/crypttab

# Formato: nome  dispositivo  chave  opções

# Solicitar senha no boot
dados   UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   none   luks

# Com keyfile (sem digitar senha no boot)
dados   UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   /etc/luks-keyfile   luks

# Adicionar ao /etc/fstab para montar automaticamente
sudo nano /etc/fstab
# /dev/mapper/dados   /mnt/dados   ext4   defaults   0 2`}),e.jsxs(o,{type:"info",title:"Backup do header LUKS",children:["O header LUKS contém todas as chaves criptografadas. Se for corrompido, você perde acesso aos dados PARA SEMPRE. Faça backup:",e.jsx("code",{children:"sudo cryptsetup luksHeaderBackup /dev/sda2 --header-backup-file luks-header.bak"}),"e armazene em local seguro (diferente do disco)."]})]})}export{u as default};
