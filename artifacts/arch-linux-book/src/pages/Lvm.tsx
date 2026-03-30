import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Lvm() {
  return (
    <PageContainer
      title="LVM & RAID"
      subtitle="Gerenciamento avançado de volumes e redundância de dados. LVM oferece flexibilidade máxima para organizar discos, criar snapshots e redimensionar partições online."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <h2>O que é LVM?</h2>
      <p>
        LVM (Logical Volume Manager) é uma camada de abstração entre o hardware de armazenamento
        e o sistema de arquivos. Com LVM você pode:
      </p>
      <ul>
        <li>Redimensionar partições sem desmontar (online resize)</li>
        <li>Combinar múltiplos discos em um único volume lógico</li>
        <li>Criar snapshots instantâneos de volumes</li>
        <li>Mover dados entre discos sem downtime</li>
        <li>Renomear e reorganizar volumes facilmente</li>
      </ul>

      <h2>Conceitos do LVM</h2>
      <ul>
        <li><strong>PV (Physical Volume)</strong> — O disco físico ou partição que você dá ao LVM. Ex: <code>/dev/sda</code>, <code>/dev/sdb1</code></li>
        <li><strong>VG (Volume Group)</strong> — Um pool de armazenamento criado de um ou mais PVs. Ex: <code>vg0</code></li>
        <li><strong>LV (Logical Volume)</strong> — Uma "partição virtual" criada dentro de um VG. É onde você formata e monta. Ex: <code>/dev/vg0/root</code></li>
        <li><strong>PE (Physical Extent)</strong> — A menor unidade de alocação no LVM (padrão 4MB)</li>
      </ul>

      <h2>Instalação e Configuração Inicial</h2>
      <CodeBlock
        title="Instalar LVM e preparar discos"
        code={`# Instalar lvm2
sudo pacman -S lvm2

# Verificar discos disponíveis
lsblk
fdisk -l

# Criar partição do tipo "Linux LVM" no disco
# (use gdisk ou fdisk)
sudo gdisk /dev/sdb
# n = nova partição
# tipo: 8e00 (Linux LVM)
# w = gravar

# Ou usar o disco inteiro como PV (sem partição)
# (apenas se o disco for dedicado ao LVM)`}
      />

      <h2>Criar Estrutura LVM</h2>
      <CodeBlock
        title="Criar PV, VG e LVs"
        code={`# 1. Criar Physical Volumes (PV)
sudo pvcreate /dev/sdb
sudo pvcreate /dev/sdb1  # Se usou partição

# Ver PVs criados
pvdisplay
pvs    # Formato curto

# 2. Criar Volume Group (VG) com um ou mais PVs
sudo vgcreate vg0 /dev/sdb
# Ou com múltiplos discos (JBOD - concatenação):
sudo vgcreate vg0 /dev/sdb /dev/sdc

# Ver VGs
vgdisplay
vgs    # Formato curto

# 3. Criar Logical Volumes (LV)
# -L: tamanho fixo, -l: em extents ou percentual
sudo lvcreate -L 50G vg0 -n root
sudo lvcreate -L 8G vg0 -n swap
sudo lvcreate -L 100G vg0 -n home
sudo lvcreate -l 100%FREE vg0 -n data   # Usa todo o espaço restante

# Ver LVs
lvdisplay
lvs    # Formato curto

# 4. Formatar os LVs
sudo mkfs.ext4 /dev/vg0/root
sudo mkfs.ext4 /dev/vg0/home
sudo mkswap /dev/vg0/swap

# 5. Montar
sudo mount /dev/vg0/root /mnt
sudo mkdir /mnt/home
sudo mount /dev/vg0/home /mnt/home
sudo swapon /dev/vg0/swap`}
      />

      <h2>Redimensionar Volumes</h2>
      <CodeBlock
        title="Expandir e reduzir volumes LVM"
        code={`# === EXPANDIR um LV ===

# 1. Adicionar mais espaço ao VG (adicionar novo disco)
sudo pvcreate /dev/sdc
sudo vgextend vg0 /dev/sdc

# 2. Expandir o LV (pode ser feito online, com o volume montado!)
sudo lvextend -L +50G /dev/vg0/home        # Adicionar 50GB
sudo lvextend -l +100%FREE /dev/vg0/home   # Usar todo espaço livre

# 3. Expandir o sistema de arquivos (online para ext4/btrfs/xfs)
sudo resize2fs /dev/vg0/home               # ext4
sudo xfs_growfs /home                      # xfs (precisa estar montado)
sudo btrfs filesystem resize max /home     # btrfs

# Combinado em um passo (ext4):
sudo lvextend -L +50G -r /dev/vg0/home    # -r resize FS automaticamente

# === REDUZIR um LV (CUIDADO - pode perder dados!) ===
# NUNCA reduza online! Desmonte primeiro!
sudo umount /home

# Verificar e reduzir o FS primeiro (ext4 apenas)
sudo e2fsck -f /dev/vg0/home
sudo resize2fs /dev/vg0/home 100G

# Depois reduzir o LV
sudo lvreduce -L 100G /dev/vg0/home

# Remontar
sudo mount /dev/vg0/home /home`}
      />

      <AlertBox type="danger" title="Cuidado ao reduzir!">
        Reduzir volumes lógicos é arriscado. Sempre faça backup antes. XFS e Btrfs
        não suportam redução! Apenas ext4 suporta redução. Sempre reduza o sistema
        de arquivos ANTES de reduzir o LV, nunca depois.
      </AlertBox>

      <h2>Snapshots LVM</h2>
      <p>
        Snapshots permitem criar uma "foto" instantânea de um volume. São úteis para backups
        e para testar mudanças com capacidade de reverter.
      </p>
      <CodeBlock
        title="Criar e usar snapshots"
        code={`# Criar snapshot de um LV (precisa de espaço livre no VG)
sudo lvcreate -L 10G -s -n root_snap /dev/vg0/root
# -s = snapshot
# -n = nome
# /dev/vg0/root = volume de origem

# Ver snapshots
lvs

# Saída:
# LV         VG   Attr       LSize  Origin
# root       vg0  owi-aos--- 50.00g
# root_snap  vg0  swi-a-s--- 10.00g root   0.00

# Montar o snapshot (para leitura)
sudo mount /dev/vg0/root_snap /mnt/backup_root

# Reverter para o snapshot (volume deve estar desmontado)
sudo umount /dev/vg0/root
sudo lvconvert --merge /dev/vg0/root_snap
# Reiniciar para aplicar

# Remover snapshot quando não precisar mais
sudo lvremove /dev/vg0/root_snap`}
      />

      <h2>LVM em Instalação do Arch</h2>
      <CodeBlock
        title="Configurar LVM durante instalação do Arch"
        code={`# Na ISO de instalação:

# 1. Criar partições
fdisk /dev/sda
# sda1: EFI (512MB, tipo ef00)
# sda2: LVM (resto do disco, tipo 8e00)

# 2. Configurar LVM
pvcreate /dev/sda2
vgcreate archvg /dev/sda2
lvcreate -L 50G archvg -n root
lvcreate -L 16G archvg -n swap
lvcreate -l 100%FREE archvg -n home

# 3. Formatar
mkfs.fat -F32 /dev/sda1
mkfs.ext4 /dev/archvg/root
mkfs.ext4 /dev/archvg/home
mkswap /dev/archvg/swap

# 4. Montar
mount /dev/archvg/root /mnt
mkdir /mnt/boot /mnt/home
mount /dev/sda1 /mnt/boot
mount /dev/archvg/home /mnt/home
swapon /dev/archvg/swap

# 5. Instalar sistema base
pacstrap -K /mnt base linux linux-firmware lvm2

# 6. No chroot, configurar mkinitcpio
nano /etc/mkinitcpio.conf
# Adicionar 'lvm2' nos HOOKS:
# HOOKS=(base udev autodetect microcode modconf kms keyboard keymap block lvm2 filesystems fsck)

mkinitcpio -P`}
      />

      <h2>RAID via mdadm</h2>
      <p>
        O RAID (Redundant Array of Independent Disks) oferece redundância de dados ou
        performance melhor usando múltiplos discos.
      </p>

      <h3>Níveis de RAID mais comuns</h3>
      <ul>
        <li><strong>RAID 0 (Striping)</strong> — Performance dobrada, zero redundância. Um disco falha = tudo perdido. Mínimo 2 discos.</li>
        <li><strong>RAID 1 (Mirroring)</strong> — Espelho exato. Metade da capacidade total. Um disco pode falhar sem perder dados. Mínimo 2 discos.</li>
        <li><strong>RAID 5</strong> — Paridade distribuída. Pode perder 1 disco. Mínimo 3 discos. 1 disco de paridade "desperdiçado".</li>
        <li><strong>RAID 6</strong> — Pode perder 2 discos. Mínimo 4 discos.</li>
        <li><strong>RAID 10</strong> — RAID 1 + RAID 0. Performance + redundância. Mínimo 4 discos.</li>
      </ul>

      <CodeBlock
        title="Criar RAID 1 com mdadm"
        code={`# Instalar mdadm
sudo pacman -S mdadm

# Criar RAID 1 (mirror) com dois discos
sudo mdadm --create /dev/md0 \
  --level=1 \
  --raid-devices=2 \
  /dev/sdb /dev/sdc

# Ver status do RAID (pode demorar para sincronizar)
cat /proc/mdstat
sudo mdadm --detail /dev/md0

# Salvar configuração
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf

# Formatar e usar
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /mnt/raid

# Simular falha de disco (para teste)
sudo mdadm --manage /dev/md0 --fail /dev/sdc
sudo mdadm --manage /dev/md0 --remove /dev/sdc

# Substituir disco com falha
sudo mdadm --manage /dev/md0 --add /dev/sdd`}
      />
    </PageContainer>
  );
}
