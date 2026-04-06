import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Luks() {
  return (
    <PageContainer
      title="Criptografia LUKS"
      subtitle="Proteja seus dados com criptografia de disco completa. LUKS (Linux Unified Key Setup) é o padrão para criptografia de partições e discos no Linux."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <h2>O que é LUKS?</h2>
      <p>
        O LUKS (Linux Unified Key Setup) é o padrão de facto para criptografia de disco no Linux.
        Ele cria um container criptografado onde você armazena partições ou sistemas de arquivos completos.
      </p>
      <p>
        Com LUKS, mesmo que alguém roube seu HD, sem a senha/chave nada pode ser lido.
        O Arch Linux suporta LUKS de primeira classe via <code>cryptsetup</code>.
      </p>

      <h2>Criptografar uma Partição</h2>
      <AlertBox type="danger" title="CUIDADO: A criptografia DESTRÓI dados existentes">
        Formatar uma partição com LUKS apaga todos os dados existentes nela.
        Faça backup antes de continuar!
      </AlertBox>
      <CodeBlock
        title="Criar e montar container LUKS"
        code={`# Instalar cryptsetup
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
sudo cryptsetup close nome-mapeado`}
      />

      <h2>LUKS com LUKS2 e Argon2id</h2>
      <CodeBlock
        title="Criação segura com parâmetros avançados"
        code={`# LUKS2 com Argon2id (mais seguro para senhas)
sudo cryptsetup luksFormat \
    --type luks2 \
    --cipher aes-xts-plain64 \
    --hash sha512 \
    --iter-time 5000 \
    --key-size 512 \
    --pbkdf argon2id \
    --pbkdf-memory 1048576 \  # 1GB de memória para derivação de chave
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
# ...`}
      />

      <h2>Full Disk Encryption na Instalação</h2>
      <CodeBlock
        title="Instalar Arch Linux com FDE (Full Disk Encryption)"
        code={`# Na ISO do Arch Linux:

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
grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <h2>Gerenciar Chaves LUKS</h2>
      <CodeBlock
        title="Adicionar e remover chaves/senhas"
        code={`# LUKS suporta até 32 keyslots (chaves)!
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
sudo cryptsetup luksChangeKey /dev/sda2`}
      />

      <h2>Auto-montagem com crypttab</h2>
      <CodeBlock
        title="/etc/crypttab - Montar automaticamente no boot"
        code={`# Para discos secundários criptografados (não o root)

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
# /dev/mapper/dados   /mnt/dados   ext4   defaults   0 2`}
      />

      <AlertBox type="info" title="Backup do header LUKS">
        O header LUKS contém todas as chaves criptografadas. Se for corrompido, você perde
        acesso aos dados PARA SEMPRE. Faça backup:
        <code>sudo cryptsetup luksHeaderBackup /dev/sda2 --header-backup-file luks-header.bak</code>
        e armazene em local seguro (diferente do disco).
      </AlertBox>
    </PageContainer>
  );
}
