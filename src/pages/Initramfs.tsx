import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Initramfs() {
  return (
    <PageContainer
      title="initramfs & mkinitcpio"
      subtitle="O ambiente temporário de boot. Entenda o papel do initramfs, como o mkinitcpio funciona e como personalizar o processo de inicialização."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <h2>O que é o initramfs?</h2>
      <p>
        O initramfs (initial RAM filesystem) é um sistema de arquivos temporário carregado na
        memória RAM durante o boot. Ele contém o mínimo necessário para montar o sistema de
        arquivos root real.
      </p>
      <p>
        Antigamente chamado de "initrd" (initial RAM disk), o initramfs é extraído diretamente
        na memória como um sistema de arquivos tmpfs, sem precisar de um dispositivo de bloco.
      </p>
      <p>
        O motivo de sua existência: o kernel precisa de drivers para acessar o disco, mas os
        drivers estão no disco. O initramfs quebra esse paradoxo fornecendo um ambiente mínimo
        com os drivers necessários para acessar o sistema real.
      </p>

      <h2>O que fica no initramfs?</h2>
      <ul>
        <li>Módulos do kernel necessários para o boot (drivers de disco, sistema de arquivos)</li>
        <li>Ferramentas mínimas de espaço de usuário (<code>busybox</code> ou binários estáticos)</li>
        <li>Script <code>/init</code> (geralmente o systemd no Arch)</li>
        <li>Hooks personalizados (como para LUKS, LVM, btrfs)</li>
      </ul>

      <h2>mkinitcpio no Arch Linux</h2>
      <p>
        O Arch Linux usa o <code>mkinitcpio</code> para gerar o initramfs. É configurado via
        <code>/etc/mkinitcpio.conf</code>.
      </p>
      <CodeBlock
        title="Gerenciar o initramfs"
        code={`# Gerar initramfs para todos os kernels instalados
sudo mkinitcpio -P

# Gerar para um kernel específico
sudo mkinitcpio -p linux
sudo mkinitcpio -p linux-lts
sudo mkinitcpio -p linux-zen

# Ver arquivos de preset
ls /etc/mkinitcpio.d/
# linux.preset  linux-lts.preset

cat /etc/mkinitcpio.d/linux.preset`}
      />

      <CodeBlock
        title="/etc/mkinitcpio.conf - Configuração principal"
        code={`# Módulos extras a incluir no initramfs
MODULES=()
# Exemplos:
# MODULES=(ext4)              # Para boot de ext4
# MODULES=(btrfs)             # Para boot de btrfs
# MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)  # Para NVIDIA no boot
# MODULES=(i915)              # Para Intel iGPU early KMS

# Binários extras a incluir
BINARIES=()
# Exemplos:
# BINARIES=(btrfs)   # Para reparar btrfs no boot

# Arquivos extras
FILES=()

# Hooks - A PARTE MAIS IMPORTANTE
# Define a sequência de scripts executados durante o boot
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)

# Hooks comuns:
# base       - Ambiente mínimo (sempre necessário)
# udev       - Detecção de dispositivos
# autodetect - Otimiza: inclui apenas módulos do hardware atual
# microcode  - Carrega microcode da CPU
# modconf    - Aplica configurações de /etc/modprobe.d/
# kms        - KMS (modo kernel de vídeo) antecipado
# keyboard   - Suporte a teclado no early boot
# keymap     - Layout de teclado no early boot
# consolefont- Fonte do console
# block      - Dispositivos de bloco (discos)
# filesystems- Módulos de sistema de arquivos
# fsck       - Verificação de integridade do FS

# Hooks para casos especiais:
# encrypt    - Para LUKS (criptografia de disco)
# lvm2       - Para LVM
# mdadm_udev - Para RAID via mdadm
# resume     - Para hibernação (suspend-to-disk)
# sd-vconsole- Alternativa ao keymap/consolefont para systemd`}
      />

      <AlertBox type="info" title="Sempre regenerar após mudanças">
        Após qualquer mudança em <code>/etc/mkinitcpio.conf</code>, execute
        <code>sudo mkinitcpio -P</code> para regenerar o initramfs.
        Sem isso, as mudanças não terão efeito no próximo boot.
      </AlertBox>

      <h2>Hooks Especiais</h2>
      <h3>Hook encrypt (LUKS)</h3>
      <CodeBlock
        title="Configurar initramfs para LUKS"
        code={`# Em /etc/mkinitcpio.conf:
# Adicionar 'encrypt' ANTES de 'filesystems':
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap block encrypt filesystems fsck)

# Para systemd-based initramfs (mais moderno):
HOOKS=(base systemd autodetect microcode modconf kms keyboard sd-vconsole sd-encrypt filesystems fsck)

# Regenerar
sudo mkinitcpio -P

# Configurar o GRUB para passar o UUID do disco LUKS:
# Em /etc/default/grub:
# GRUB_CMDLINE_LINUX="cryptdevice=UUID=xxxx:cryptroot root=/dev/mapper/cryptroot"

# Regenerar GRUB também
sudo grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <h3>Hook lvm2 (LVM)</h3>
      <CodeBlock
        title="Configurar initramfs para LVM"
        code={`# Instalar lvm2
sudo pacman -S lvm2

# Em /etc/mkinitcpio.conf:
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap block lvm2 filesystems fsck)

# Para LVM sobre LUKS:
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap block encrypt lvm2 filesystems fsck)

# Regenerar
sudo mkinitcpio -P`}
      />

      <h2>Tamanho do initramfs</h2>
      <CodeBlock
        title="Verificar tamanho do initramfs"
        code={`# Ver arquivos gerados
ls -lh /boot/initramfs-*.img

# Saída típica:
# -rw------- 1 root root  45M initramfs-linux-fallback.img
# -rw------- 1 root root 8.5M initramfs-linux.img

# O fallback é muito maior porque inclui TODOS os módulos
# O normal usa autodetect para incluir apenas o necessário

# Inspecionar conteúdo do initramfs
lsinitcpio /boot/initramfs-linux.img | head -30
lsinitcpio /boot/initramfs-linux.img | grep -i nvidia

# Ver conteúdo detalhado
lsinitcpio -a /boot/initramfs-linux.img | head -50`}
      />

      <h2>Compressão do initramfs</h2>
      <CodeBlock
        title="Configurar compressão"
        code={`# Em /etc/mkinitcpio.conf:
# COMPRESSION="zstd"    # Padrão no Arch - bom equilíbrio
# COMPRESSION="lz4"     # Mais rápido para descomprimir (boot mais rápido)
# COMPRESSION="xz"      # Maior compressão (arquivo menor, boot mais lento)
# COMPRESSION="gzip"    # Compatível com kernels mais antigos
# COMPRESSION="none"    # Sem compressão (maior, mas boot mais rápido)

# Opções de compressão
# COMPRESSION_OPTIONS=(-9)  # Nível máximo de compressão

# Verificar qual compressão está sendo usada
file /boot/initramfs-linux.img
# /boot/initramfs-linux.img: Zstandard compressed data`}
      />
    </PageContainer>
  );
}
