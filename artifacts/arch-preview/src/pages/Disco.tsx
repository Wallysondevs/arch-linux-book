import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Disco() {
  return (
    <PageContainer
      title="Discos, Partições e Sistemas de Arquivos"
      subtitle="Do lsblk ao cryptsetup, com a saída exata de cada comando — e os erros mais comuns explicados."
      difficulty="intermediario"
      timeToRead="35 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com terminal e <code>sudo</code>. Conhecer caminhos de arquivos.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Partição</strong> — fatia lógica de um disco físico. Vira device em <code>/dev</code> (<code>/dev/sda1</code>, <code>/dev/nvme0n1p1</code>).
      </p>
      <p>
        <strong>Filesystem</strong> — formato em que a partição armazena arquivos. Comuns no Arch: <code>ext4</code>, <code>btrfs</code>, <code>xfs</code>.
      </p>
      <p>
        <strong>Mount point</strong> — pasta onde a partição é encaixada na árvore.
      </p>
      <p>
        <strong>Inode</strong> — estrutura de metadados. Acabar inode = não consegue criar arquivo, mesmo com espaço sobrando.
      </p>

      <p>
        No Linux, cada disco é um arquivo dentro de <code>/dev/</code>. Cada partição também. O kernel expõe
        atributos pelos subsistemas <code>block</code>, <code>scsi</code> e <code>nvme</code>; ferramentas como
        <code>lsblk</code> e <code>blkid</code> consultam essas mesmas APIs do udev. Errar de dispositivo aqui
        apaga dados — então TODO comando começa com <code>lsblk</code> para confirmar o alvo.
      </p>

      <h2>1. Visualizando — lsblk, blkid, fdisk -l, findmnt</h2>

      <h3>lsblk — a primeira pergunta</h3>
      <TerminalBlock
        command="lsblk"
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 465.8G  0 disk
├─sda1        8:1    0   512M  0 part /boot
├─sda2        8:2    0 449.3G  0 part /
└─sda3        8:3    0    16G  0 part [SWAP]
sdb           8:16   1  29.8G  0 disk
└─sdb1        8:17   1  29.8G  0 part /run/media/user/PENDRIVE
nvme0n1     259:0    0 953.9G  0 disk
├─nvme0n1p1 259:1    0   512M  0 part /efi
└─nvme0n1p2 259:2    0 953.4G  0 part /home
sr0          11:0    1  1024M  0 rom`}
      />
      <OutputBlock
        title="anatomia da saída do lsblk"
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 465.8G  0 disk
├─sda1        8:1    0   512M  0 part /boot
sdb           8:16   1  29.8G  0 disk
nvme0n1     259:0    0 953.9G  0 disk`}
        annotations={[
          { line: 1, note: "RM=0 → fixo · disk inteiro" },
          { line: 2, note: "└─ partições do sda" },
          { line: 3, note: "RM=1 → removível (USB)" },
          { line: 4, note: "NVMe: namespace (n1), partições serão p1/p2" },
        ]}
        caption="MAJ:MIN é o par usado pelo kernel para identificar o dispositivo. 8 = SCSI/SATA · 259 = NVMe · 11 = ROM."
      />

      <TerminalBlock
        comment="-f mostra FSTYPE, LABEL, UUID — o mais útil"
        command="lsblk -f"
        output={`NAME        FSTYPE FSVER LABEL    UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sda
├─sda1      vfat   FAT32 EFI      2A3B-4C5D                             436.2M    14% /boot
├─sda2      ext4   1.0   ROOT     d4c8e7f1-1234-4567-89ab-cdef01234567  287.4G    36% /
└─sda3      swap   1     SWAP     a1b2c3d4-e5f6-7890-abcd-ef0123456789                [SWAP]
sdb
└─sdb1      vfat   FAT32 PENDRIVE 1234-5678                              28.1G     5% /run/media/user/PENDRIVE
nvme0n1
├─nvme0n1p1 vfat   FAT32 EFI      AABB-CCDD                             420.1M    18% /efi
└─nvme0n1p2 btrfs        DATA     fedcba98-7654-3210-fedc-ba9876543210  812.4G    14% /home`}
      />

      <CommandFlagList
        command="lsblk"
        items={[
          { flag: "-f", description: "Inclui FSTYPE, LABEL e UUID — o jeito mais rápido de inspecionar discos." },
          { flag: "-d", description: "Só discos (sem partições). Útil em listagens curtas.", example: "lsblk -d" },
          { flag: "-b", description: "Tamanho em bytes em vez de unidade legível." },
          { flag: "-p", description: "Mostra o caminho completo (/dev/sda1)." },
          { flag: "-S", description: "Apenas dispositivos SCSI." },
          { flag: "-m", description: "Mostra dono, modo e grupo (permissões dos /dev/sd*)." },
          { flag: "-o", description: "Colunas customizadas. Lista TODAS com -h.", example: "lsblk -o NAME,SIZE,MODEL,TRAN" },
          { flag: "-t", description: "Topologia (alinhamento, IO, sector size)." },
        ]}
      />

      <TerminalBlock
        command="lsblk -o NAME,SIZE,MODEL,TRAN,SERIAL"
        output={`NAME          SIZE MODEL                    TRAN   SERIAL
sda         465.8G Samsung SSD 870 EVO 500G sata   S5SXNG0NA12345Z
sdb          29.8G SanDisk Cruzer Blade     usb    4C530001230412116220
nvme0n1     953.9G WD_BLACK SN850 1TB       nvme   210345678901
sr0        1024M  HL-DT-ST DVDRAM GH24NSD5 sata`}
      />

      <h3>Nomenclatura dos /dev</h3>
      <ul>
        <li><strong>sda, sdb, sdc…</strong> — Discos SATA, SAS, USB (driver <em>sd</em> = SCSI disk).</li>
        <li><strong>nvme0n1, nvme0n2…</strong> — Disco NVMe N, namespace M.</li>
        <li><strong>nvme0n1p1, sda1</strong> — Partição. NVMe usa <code>p</code> antes do número.</li>
        <li><strong>vda, vdb</strong> — Discos virtio (KVM/QEMU).</li>
        <li><strong>mmcblk0, mmcblk0p1</strong> — Cartões SD/eMMC.</li>
        <li><strong>sr0</strong> — CD/DVD óptico.</li>
        <li><strong>loop0…</strong> — Loop devices (montar arquivos como block, snaps, ISOs).</li>
        <li><strong>dm-0…</strong> — Device Mapper (LVM, LUKS).</li>
      </ul>

      <h3>blkid — UUIDs e tipos</h3>
      <TerminalBlock
        command="sudo blkid"
        output={`/dev/sda1: LABEL_FATBOOT="EFI" LABEL="EFI" UUID="2A3B-4C5D" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="00112233-01"
/dev/sda2: LABEL="ROOT" UUID="d4c8e7f1-1234-4567-89ab-cdef01234567" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="00112233-02"
/dev/sda3: LABEL="SWAP" UUID="a1b2c3d4-e5f6-7890-abcd-ef0123456789" TYPE="swap" PARTUUID="00112233-03"
/dev/nvme0n1p1: LABEL_FATBOOT="EFI" UUID="AABB-CCDD" TYPE="vfat" PARTUUID="ddeeff00-01"
/dev/nvme0n1p2: LABEL="DATA" UUID="fedcba98-7654-3210-fedc-ba9876543210" TYPE="btrfs" PARTUUID="ddeeff00-02"`}
      />

      <h3>fdisk -l — esquema da tabela de partições</h3>
      <TerminalBlock
        command="sudo fdisk -l /dev/sda"
        output={`Disk /dev/sda: 465.76 GiB, 500107862016 bytes, 976773168 sectors
Disk model: Samsung SSD 870
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: 00112233-4455-6677-8899-AABBCCDDEEFF

Device       Start       End   Sectors   Size Type
/dev/sda1     2048   1050623   1048576   512M EFI System
/dev/sda2  1050624 943194111 942143488 449.3G Linux filesystem
/dev/sda3 943194112 976773134  33579023    16G Linux swap`}
      />

      <h3>findmnt — leitura amigável de mounts</h3>
      <TerminalBlock
        command="findmnt --real"
        output={`TARGET                                SOURCE        FSTYPE  OPTIONS
/                                     /dev/sda2     ext4    rw,noatime
├─/boot                               /dev/sda1     vfat    rw,noatime,fmask=0022
├─/home                               /dev/nvme0n1p2 btrfs  rw,noatime,compress=zstd:3
├─/efi                                /dev/nvme0n1p1 vfat   rw,noatime
└─/run/media/user/PENDRIVE            /dev/sdb1     vfat    rw,nosuid,nodev,relatime`}
      />

      <h2>2. Particionamento — fdisk, cfdisk, parted</h2>

      <AlertBox type="danger" title="Confirme o disco. SEMPRE.">
        Qualquer comando de particionamento no disco errado destrói dados. Faça <code>lsblk</code> ANTES e confirme:
        tamanho bate? RM=1 se for o pendrive? Está montado onde você espera?
      </AlertBox>

      <h3>fdisk — interativo, suporta GPT e MBR</h3>
      <TerminalBlock
        command="sudo fdisk /dev/sdb"
        output={`Welcome to fdisk (util-linux 2.40.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help): {dim}m{/}

Help:

  GPT
   M   enter protective/hybrid MBR

  Generic
   d   delete a partition
   F   list free unpartitioned space
   l   list known partition types
   n   add a new partition
   p   print the partition table
   t   change a partition type
   v   verify the partition table

  Misc
   m   print this menu
   x   extra functionality (experts only)

  Save & Exit
   w   write table to disk and exit
   q   quit without saving changes`}
      />

      <CodeBlock title="Sequência típica: criar GPT + 1 partição usando todo o espaço" code={`g    → cria nova tabela GPT
n    → nova partição
1    → número da partição
Enter → primeiro setor (default)
Enter → último setor (default = todo o disco)
t    → tipo
20   → "Linux filesystem" (lista com 'L')
p    → revisa
w    → grava (IRREVERSÍVEL)`} />

      <h3>cfdisk — visual, recomendado</h3>
      <TerminalBlock
        command="sudo cfdisk /dev/sdb"
        output={`                                  Disk: /dev/sdb
                Size: 29.8 GiB, 31999197184 bytes, 62498432 sectors
                                Label: gpt, identifier: ...

    Device              Start          End      Sectors     Size Type
>>  Free space           2048     62498398     62496351    29.8G

   ┌─────────────────────────────────────────────────────────────────┐
   │ [   New   ]  [ Quit ]  [ Help ]  [ Write ]  [ Dump ]            │
   └─────────────────────────────────────────────────────────────────┘
                Create new partition from free space`}
      />

      <h3>parted — não interativo (scripts)</h3>
      <TerminalBlock
        command="sudo parted /dev/sdb --script mklabel gpt mkpart primary ext4 1MiB 100%"
        output=""
      />
      <TerminalBlock
        command="sudo parted /dev/sdb --script print"
        output={`Model: SanDisk Cruzer Blade (scsi)
Disk /dev/sdb: 32.0GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name     Flags
 1      1049kB  32.0GB  32.0GB               primary`}
      />

      <h2>3. Formatando — mkfs.*</h2>

      <TerminalBlock
        command="sudo mkfs.ext4 -L DADOS /dev/sdb1"
        output={`mke2fs 1.47.0 (5-Feb-2023)
Creating filesystem with 7812032 4k blocks and 1953504 inodes
Filesystem UUID: 8e7d6c5b-4321-aaaa-bbbb-ccccddddeeee
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000

Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done`}
      />

      <TerminalBlock
        command="sudo mkfs.fat -F32 -n EFI /dev/sdb1"
        output={`mkfs.fat 4.2 (2021-01-31)`}
      />

      <TerminalBlock
        command="sudo mkfs.btrfs -L DADOS /dev/sdb1"
        output={`btrfs-progs v6.7
See http://btrfs.wiki.kernel.org for more information.

NOTE: several default settings have changed in version 5.15.

Label:              DADOS
UUID:               c1e2d3f4-aaaa-4444-9999-fedcba987654
Node size:          16384
Sector size:        4096
Filesystem size:    29.80GiB
Block group profiles:
  Data:             single            8.00MiB
  Metadata:         DUP             256.00MiB
  System:           DUP               8.00MiB
SSD detected:       yes
Zoned device:       no
Incompat features:  extref, skinny-metadata, no-holes
Runtime features:   free-space-tree
Checksum:           crc32c
Number of devices:  1
Devices:
   ID        SIZE  PATH
    1    29.80GiB  /dev/sdb1`}
      />

      <TerminalBlock
        command="sudo mkfs.exfat -L PENDRIVE /dev/sdb1"
        output={`exfatprogs version : 1.2.2
Creating exFAT filesystem(/dev/sdb1, cluster size=131072)

Writing volume boot record: done
Writing backup volume boot record: done
Fat table creation: done
Allocation bitmap creation: done
Upcase table creation: done
Writing root directory entry: done
Synchronizing...

exFAT format complete!`}
      />

      <p>Comparativo rápido:</p>
      <ul>
        <li><strong>ext4</strong> — Padrão, maduro, rápido. Use no <code>/</code> e <code>/home</code> em desktops.</li>
        <li><strong>btrfs</strong> — Snapshots, subvolumes, compressão zstd. Padrão dos rolling distros modernos.</li>
        <li><strong>xfs</strong> — Excelente para arquivos grandes, servidores. Não encolhe.</li>
        <li><strong>vfat (FAT32)</strong> — OBRIGATÓRIO para a partição EFI. Limite de 4 GB por arquivo.</li>
        <li><strong>exfat</strong> — Sem limite de 4 GB; lê em Windows/Mac/Linux. Ideal para HD externo.</li>
        <li><strong>ntfs</strong> — Compatibilidade total com Windows. No Linux via <code>ntfs-3g</code> (FUSE).</li>
        <li><strong>swap</strong> — Não é "filesystem", é área de swap.</li>
      </ul>

      <h2>4. Montagem — mount, umount e /etc/fstab</h2>

      <TerminalBlock
        comment="montar sdb1 em /mnt"
        command="sudo mount /dev/sdb1 /mnt"
        output=""
      />
      <TerminalBlock command="findmnt /mnt" output={`TARGET SOURCE    FSTYPE OPTIONS
/mnt   /dev/sdb1 ext4   rw,relatime`} />

      <TerminalBlock
        comment="montar com opções customizadas"
        command="sudo mount -o ro,noexec,nodev /dev/sdb1 /mnt"
        output=""
      />
      <TerminalBlock
        comment="ISO via loop"
        command="sudo mount -o loop archlinux-2025.01.01-x86_64.iso /mnt/iso"
        output=""
      />

      <CommandFlagList
        command="mount"
        items={[
          { flag: "-t TYPE", description: "Força o tipo de FS (auto-detecção é o default).", example: "sudo mount -t ntfs-3g /dev/sdb1 /mnt" },
          { flag: "-o OPTS", description: "Opções: ro, rw, noatime, nosuid, nodev, noexec, loop, bind, remount." },
          { flag: "-a", description: "Monta tudo do /etc/fstab que não está montado.", example: "sudo mount -a" },
          { flag: "-r", description: "Atalho para -o ro." },
          { flag: "-B", long: "--bind", description: "Bind mount: faz um diretório aparecer em outro lugar.", example: "sudo mount --bind /var/data /srv/exposto" },
          { flag: "-o remount,XXX", description: "Reaplica opções sem desmontar.", example: "sudo mount -o remount,rw /" },
        ]}
      />

      <TerminalBlock
        comment="ver TUDO que está montado, em colunas"
        command="mount | column -t | head"
        output={`proc          on  /proc                       type  proc        (rw,nosuid,nodev,noexec,relatime)
sys           on  /sys                        type  sysfs       (rw,nosuid,nodev,noexec,relatime)
dev           on  /dev                        type  devtmpfs    (rw,nosuid,relatime,size=8112764k,nr_inodes=2028191)
run           on  /run                        type  tmpfs       (rw,nosuid,nodev,relatime,size=1622648k)
/dev/sda2     on  /                           type  ext4        (rw,noatime)
/dev/sda1     on  /boot                       type  vfat        (rw,noatime,fmask=0022,dmask=0022)
/dev/sdb1     on  /mnt                        type  ext4        (rw,relatime)`}
      />

      <h3>umount</h3>
      <TerminalBlock command="sudo umount /mnt" output="" />
      <TerminalBlock
        comment="o erro mais comum"
        command="sudo umount /mnt"
        output="umount: /mnt: target is busy."
        exitCode={32}
      />
      <TerminalBlock
        comment="quem está usando?"
        command="sudo lsof +D /mnt"
        output={`COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF  NODE NAME
bash     5012 user  cwd    DIR   8,17     4096     2 /mnt
vim      5421 user    4u   REG   8,17    18432    13 /mnt/notes.txt`}
      />
      <TerminalBlock
        comment="lazy: desmonta quando ninguém mais usar"
        command="sudo umount -l /mnt"
        output=""
      />

      <h3>/etc/fstab — montagem persistente</h3>
      <CodeBlock title="/etc/fstab típico" code={`# <file system>                            <dir>      <type>  <options>                              <dump> <pass>
UUID=2A3B-4C5D                              /boot      vfat    rw,noatime,fmask=0022,dmask=0022,utf8  0      2
UUID=d4c8e7f1-1234-4567-89ab-cdef01234567   /          ext4    rw,noatime                              0      1
UUID=a1b2c3d4-e5f6-7890-abcd-ef0123456789   none       swap    defaults                                0      0
UUID=fedcba98-7654-3210-fedc-ba9876543210   /home      btrfs   rw,noatime,compress=zstd:3,subvol=@home 0      0

# Disco externo — nofail é OBRIGATÓRIO para não travar o boot
UUID=8e7d6c5b-4321-aaaa-bbbb-ccccddddeeee   /mnt/dados ext4    defaults,nofail,noatime                 0      2

# Bind mount
/srv/data                                   /var/www   none    bind                                    0      0`} />

      <TerminalBlock
        comment="testar o fstab SEM reiniciar (essencial!)"
        command="sudo mount -a"
        output=""
      />
      <TerminalBlock
        comment="erro de digitação no fstab — aborta sem montar"
        command="sudo mount -a"
        output={`mount: /mnt/dados: can't find UUID=8e7d6c5b-4321-XXXX-bbbb-ccccddddeeee.
       dmesg(1) may have more information after failed mount system call.`}
        exitCode={32}
      />

      <AlertBox type="danger" title="nofail salva o boot">
        Sem <code>nofail</code> em discos removíveis, se o disco não estiver conectado o systemd entra em
        emergency mode. Sempre teste com <code>sudo mount -a</code> antes de reiniciar.
      </AlertBox>

      <h3>Pegar UUID rapidinho (para colar no fstab)</h3>
      <TerminalBlock
        command="lsblk -no UUID /dev/sdb1"
        output="8e7d6c5b-4321-aaaa-bbbb-ccccddddeeee"
      />

      <h2>5. Espaço em disco — df, du, ncdu</h2>

      <h3>df — quanto sobra em cada FS montado</h3>
      <TerminalBlock
        command="df -hT"
        output={`Filesystem     Type      Size  Used Avail Use% Mounted on
dev            devtmpfs  7.8G     0  7.8G   0% /dev
run            tmpfs     1.6G  1.4M  1.6G   1% /run
/dev/sda2      ext4      442G  149G  271G  36% /
tmpfs          tmpfs     7.8G   45M  7.8G   1% /dev/shm
tmpfs          tmpfs     1.6G  108K  1.6G   1% /run/user/1000
/dev/sda1      vfat      511M   76M  436M  15% /boot
/dev/nvme0n1p2 btrfs     953G  141G  812G  15% /home`}
      />
      <OutputBlock
        title="por que dois números 'usados' diferem em btrfs?"
        output={`/dev/nvme0n1p2 btrfs     953G  141G  812G  15% /home`}
        annotations={[
          { line: 0, note: "df mostra dados COMPRIMIDOS no caso do btrfs" },
        ]}
        caption="Em btrfs e zfs, df pode mentir por subvolumes/snapshots. Use 'btrfs filesystem usage /home' para a verdade."
      />

      <h3>du — quanto cada coisa pesa</h3>
      <TerminalBlock
        command="du -sh /home/user"
        output="48G     /home/user"
      />
      <TerminalBlock
        command="du -h --max-depth=1 /home/user 2>/dev/null | sort -h"
        output={`24K    /home/user/.ssh
2.1M    /home/user/.cache/fontconfig
4.8M    /home/user/.config
112M    /home/user/Documents
3.4G    /home/user/.cache
8.7G    /home/user/Videos
12.5G   /home/user/Downloads
21.0G   /home/user/.local
48G     /home/user`}
      />
      <TerminalBlock
        comment="top 10 maiores em /var"
        command="sudo du -h --max-depth=1 /var 2>/dev/null | sort -rh | head"
        output={`14G    /var
9.2G    /var/cache
3.8G    /var/log
512M    /var/lib
98M     /var/tmp
24M     /var/spool
8.0K    /var/local
4.0K    /var/opt
4.0K    /var/games
4.0K    /var/empty`}
      />

      <h3>ncdu — interativo, navegável</h3>
      <TerminalBlock command="sudo pacman -S ncdu" output="..." />
      <TerminalBlock
        command="ncdu /home/user"
        output={`ncdu 2.3 ~ Use the arrow keys to navigate, press ? for help

--- /home/user ----------------------------------------------------------------
   21.0 GiB [##########] /.local
   12.5 GiB [#####     ] /Downloads
    8.7 GiB [####      ] /Videos
    3.4 GiB [#         ] /.cache
  112.0 MiB [          ] /Documents
    4.8 MiB [          ] /.config
    2.1 MiB [          ] /.cache/fontconfig
   24.0 KiB [          ] /.ssh

 Total disk usage:  48.0 GiB  Apparent size:  46.2 GiB  Items: 215438`}
      />

      <h2>6. Receita: formatar um pendrive do zero</h2>

      <AlertBox type="warning" title="Apaga TUDO">
        Salve antes o que estiver no pendrive. Após formatar, recuperar é caro e nem sempre funciona.
      </AlertBox>

      <h3>Passo 1 — identificar o dispositivo</h3>
      <TerminalBlock
        comment="ANTES de plugar"
        command="lsblk -d -o NAME,SIZE,RM,MODEL"
        output={`NAME      SIZE RM MODEL
sda     465.8G  0 Samsung SSD 870
nvme0n1 953.9G  0 WD_BLACK SN850 1TB`}
      />
      <TerminalBlock
        comment="DEPOIS de plugar"
        command="lsblk -d -o NAME,SIZE,RM,MODEL"
        output={`NAME      SIZE RM MODEL
sda     465.8G  0 Samsung SSD 870
sdb      29.8G  1 Cruzer Blade
nvme0n1 953.9G  0 WD_BLACK SN850 1TB`}
      />
      <p>O dispositivo novo é <code>/dev/sdb</code> (RM=1, tamanho compatível).</p>

      <h3>Passo 2 — desmontar</h3>
      <TerminalBlock command="lsblk /dev/sdb" output={`NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sdb      8:16   1 29.8G  0 disk
└─sdb1   8:17   1 29.8G  0 part /run/media/user/PENDRIVE`} />
      <TerminalBlock command="sudo umount /dev/sdb1" output="" />

      <h3>Passo 3 — recriar tabela de partições</h3>
      <TerminalBlock
        command="sudo wipefs -a /dev/sdb"
        output={`/dev/sdb: 8 bytes were erased at offset 0x00000200 (gpt): 45 46 49 20 50 41 52 54
/dev/sdb: 8 bytes were erased at offset 0x76b39be00 (gpt): 45 46 49 20 50 41 52 54
/dev/sdb: 2 bytes were erased at offset 0x000001fe (PMBR): 55 aa
/dev/sdb: calling ioctl to re-read partition table: Success`}
      />
      <TerminalBlock
        command="sudo parted /dev/sdb --script mklabel gpt mkpart pendrive fat32 1MiB 100%"
        output=""
      />

      <h3>Passo 4 — formatar e nomear</h3>
      <TerminalBlock
        command="sudo mkfs.exfat -L MEUUSB /dev/sdb1"
        output={`exfatprogs version : 1.2.2
Creating exFAT filesystem(/dev/sdb1, cluster size=131072)
Writing volume boot record: done
Writing backup volume boot record: done
Fat table creation: done
Allocation bitmap creation: done
Upcase table creation: done
Writing root directory entry: done
Synchronizing...
exFAT format complete!`}
      />

      <h3>Passo 5 — confirmar</h3>
      <TerminalBlock
        command="lsblk -f /dev/sdb"
        output={`NAME   FSTYPE FSVER LABEL   UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sdb
└─sdb1 exfat  1.0   MEUUSB 1234-ABCD`}
      />

      <h3>Erros frequentes</h3>
      <TerminalBlock
        command="sudo umount /dev/sdb1"
        output="umount: /run/media/user/PENDRIVE: target is busy."
        exitCode={32}
      />
      <TerminalBlock
        comment="quem segura?"
        command="sudo fuser -vm /dev/sdb1"
        output={`                     USER        PID ACCESS COMMAND
/dev/sdb1:           user       4812 ..c.. nautilus
                     user       5012 ..c.. bash`}
      />
      <TerminalBlock command="sudo fuser -km /dev/sdb1" output="/dev/sdb1: 4812c 5012c" />

      <TerminalBlock
        comment='pendrive "read-only" no kernel'
        command="dmesg | tail -3"
        output={`[ 4521.834] usb 2-1: new high-speed USB device number 7 using xhci_hcd
[ 4521.972] sd 7:0:0:0: [sdb] Write Protect is on
[ 4521.973] sd 7:0:0:0: [sdb] Mode Sense: 23 00 80 00`}
      />
      <p>"Write Protect is on" → trava física no pendrive (slider). Não é problema do Linux.</p>

      <h2>7. Pendrive bootável — dd</h2>
      <p>
        O <code>dd</code> copia bloco-a-bloco. ISOs híbridas modernas (Arch, Ubuntu, Fedora) gravadas com
        <code>dd</code> ficam bootáveis em UEFI e BIOS legado.
      </p>

      <AlertBox type="danger" title='dd grava no DISCO inteiro'>
        Use <code>/dev/sdb</code>, NÃO <code>/dev/sdb1</code>. A ISO já carrega sua própria tabela de partições.
        E confirme <strong>10 vezes</strong> que é o pendrive — no disco do sistema isso é fatal.
      </AlertBox>

      <TerminalBlock
        command="sudo dd if=archlinux-2025.01.01-x86_64.iso of=/dev/sdb bs=4M status=progress oflag=sync"
        output={`1145044992 bytes (1.1 GB, 1.1 GiB) copied, 38 s, 30.1 MB/s
275+1 records in
275+1 records out
1153433600 bytes (1.2 GB, 1.1 GiB) copied, 41.8923 s, 27.5 MB/s`}
      />
      <TerminalBlock command="sync" output="" comment="garante que tudo foi pro disco" />
      <TerminalBlock command="sudo eject /dev/sdb" output="" />

      <h2>8. Verificação e reparo — fsck</h2>

      <AlertBox type="danger" title="fsck só em FS desmontado">
        Rodar <code>fsck</code> num filesystem montado em rw pode corromper dados. Para o root:
        rebote em modo recovery ou de um live-USB.
      </AlertBox>

      <TerminalBlock
        comment="checagem segura (read-only) sem reparar"
        command="sudo fsck -n /dev/sdb1"
        output={`fsck from util-linux 2.40.2
e2fsck 1.47.0 (5-Feb-2023)
Warning!  /dev/sdb1 is mounted.
Warning: skipping journal recovery because doing a read-only filesystem check.
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
DADOS: 14/1953504 files (0.0% non-contiguous), 132045/7812032 blocks`}
      />
      <TerminalBlock
        comment="reparo automático (depois de desmontar)"
        command="sudo fsck -y /dev/sdb1"
        output={`e2fsck 1.47.0 (5-Feb-2023)
DADOS: clean, 14/1953504 files, 132045/7812032 blocks`}
      />

      <h2>9. Swap</h2>

      <h3>Status</h3>
      <TerminalBlock
        command="swapon --show"
        output={`NAME      TYPE      SIZE USED PRIO
/dev/sda3 partition  16G   0B   -2`}
      />
      <TerminalBlock command="free -h | grep Swap" output="Swap:          16Gi          0B        16Gi" />

      <h3>Criar swap em arquivo (sem reparticionar)</h3>
      <TerminalBlock
        command="sudo fallocate -l 4G /swapfile"
        output=""
      />
      <TerminalBlock command="sudo chmod 600 /swapfile" output="" />
      <TerminalBlock
        command="sudo mkswap /swapfile"
        output={`Setting up swapspace version 1, size = 4 GiB (4294967296 bytes)
no label, UUID=11223344-5566-7788-99aa-bbccddeeff00`}
      />
      <TerminalBlock
        command="sudo swapon /swapfile"
        output=""
      />
      <TerminalBlock
        command="swapon --show"
        output={`NAME       TYPE       SIZE USED PRIO
/dev/sda3  partition   16G   0B   -2
/swapfile  file        4G    0B   -3`}
      />
      <p>Para tornar persistente, adicione no <code>/etc/fstab</code>:</p>
      <CodeBlock code={`/swapfile  none  swap  defaults  0 0`} />

      <h2>10. LUKS — disco criptografado</h2>

      <TerminalBlock
        command="sudo cryptsetup luksFormat /dev/sdb1"
        output={`WARNING!
========
This will overwrite data on /dev/sdb1 irrevocably.

Are you sure? (Type 'yes' in capital letters): YES
Enter passphrase for /dev/sdb1: {dim}(invisível){/}
Verify passphrase: {dim}(invisível){/}
Key slot 0 created.
Command successful.`}
      />
      <TerminalBlock
        command="sudo cryptsetup open /dev/sdb1 cofre"
        output={`Enter passphrase for /dev/sdb1: {dim}(invisível){/}`}
      />
      <TerminalBlock
        command="ls /dev/mapper/"
        output={`control  cofre`}
      />
      <TerminalBlock command="sudo mkfs.ext4 /dev/mapper/cofre" output="..." />
      <TerminalBlock command="sudo mount /dev/mapper/cofre /mnt" output="" />
      <TerminalBlock
        comment="ver status"
        command="sudo cryptsetup status cofre"
        output={`/dev/mapper/cofre is active and is in use.
  type:    LUKS2
  cipher:  aes-xts-plain64
  keysize: 512 bits
  key location: keyring
  device:  /dev/sdb1
  sector size:  512
  offset:  32768 sectors
  size:    62465664 sectors
  mode:    read/write`}
      />
      <TerminalBlock command="sudo umount /mnt && sudo cryptsetup close cofre" output="" />

      <h2>11. LVM — Logical Volume Manager</h2>

      <TerminalBlock
        comment="criar PV (physical volume) num disco"
        command="sudo pvcreate /dev/sdc"
        output='  Physical volume "/dev/sdc" successfully created.'
      />
      <TerminalBlock
        comment="criar VG (volume group)"
        command="sudo vgcreate dados /dev/sdc"
        output='  Volume group "dados" successfully created'
      />
      <TerminalBlock
        comment="criar LV de 50G dentro do VG"
        command="sudo lvcreate -L 50G -n midia dados"
        output='  Logical volume "midia" created.'
      />
      <TerminalBlock
        command="sudo lvdisplay dados/midia"
        output={`  --- Logical volume ---
  LV Path                /dev/dados/midia
  LV Name                midia
  VG Name                dados
  LV UUID                AbCdEf-1234-5678-9ABC-DEF012345678
  LV Write Access        read/write
  LV Status              available
  # open                 0
  LV Size                50.00 GiB
  Current LE             12800
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           254:0`}
      />
      <TerminalBlock command="sudo mkfs.ext4 /dev/dados/midia" output="..." />
      <TerminalBlock
        comment="aumentar online em +20G"
        command="sudo lvextend -L +20G -r dados/midia"
        output={`  Size of logical volume dados/midia changed from 50.00 GiB (12800 extents) to 70.00 GiB (17920 extents).
  Logical volume dados/midia successfully resized.
resize2fs 1.47.0 (5-Feb-2023)
The filesystem on /dev/dados/midia is now 18350080 (4k) blocks long.`}
      />

      <h2>12. SMART — saúde do disco</h2>
      <TerminalBlock command="sudo pacman -S smartmontools" output="..." />
      <TerminalBlock
        command="sudo smartctl -H /dev/sda"
        output={`smartctl 7.4 2023-08-01 r5530 [x86_64-linux-6.7.4-arch1-1] (local build)
Copyright (C) 2002-23, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED`}
      />
      <TerminalBlock
        command="sudo smartctl -a /dev/sda | head -30"
        output={`smartctl 7.4 2023-08-01 r5530 [x86_64-linux-6.7.4-arch1-1] (local build)

=== START OF INFORMATION SECTION ===
Model Family:     Samsung based SSDs
Device Model:     Samsung SSD 870 EVO 500GB
Serial Number:    S5SXNG0NA12345Z
Firmware Version: SVT02B6Q
User Capacity:    500,107,862,016 bytes [500 GB]
Sector Size:      512 bytes logical/physical
Rotation Rate:    Solid State Device
Form Factor:      2.5 inches
TRIM Command:     Available, Deterministic, Zeroed
Device is:        In smartctl database
ATA Version is:   ACS-4 T13/BSR INCITS 529 revision 5
SATA Version is:  SATA 3.3, 6.0 Gb/s (current: 6.0 Gb/s)
Local Time is:    Wed Jan 15 12:48:32 2025 -03

=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED

ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  5 Reallocated_Sector_Ct   0x0033   100   100   010    Pre-fail  Always       -       0
  9 Power_On_Hours          0x0032   098   098   000    Old_age   Always       -       8421
 12 Power_Cycle_Count       0x0032   099   099   000    Old_age   Always       -       412
177 Wear_Leveling_Count     0x0013   099   099   000    Pre-fail  Always       -       1
241 Total_LBAs_Written      0x0032   099   099   000    Old_age   Always       -       18234560`}
      />

      <h2>13. dd — outros usos</h2>

      <AlertBox type="danger" title='dd = "disk destroyer" se errar o of='>
        Sempre confirme com <code>lsblk</code> antes de rodar. Um <code>of=/dev/sda</code> errado apaga o sistema.
      </AlertBox>

      <TerminalBlock
        comment="backup completo de uma partição"
        command="sudo dd if=/dev/sdb1 of=backup-sdb1.img bs=4M status=progress"
        output={`30276452864 bytes (30 GB, 28 GiB) copied, 142 s, 213 MB/s
7411+1 records in
7411+1 records out
31086149632 bytes (31 GB, 29 GiB) copied, 145.7 s, 213 MB/s`}
      />
      <TerminalBlock
        comment="restaurar"
        command="sudo dd if=backup-sdb1.img of=/dev/sdb1 bs=4M status=progress"
        output="..."
      />
      <TerminalBlock
        comment="zerar primeiros 4MB (apaga MBR/GPT/superbloco — dispositivo vira 'novo')"
        command="sudo dd if=/dev/zero of=/dev/sdb bs=1M count=4"
        output={`4+0 records in
4+0 records out
4194304 bytes (4.2 MB, 4.0 MiB) copied, 0.034 s, 123 MB/s`}
      />
      <TerminalBlock
        comment="gerar arquivo de 1G de zeros (testes)"
        command="dd if=/dev/zero of=teste.bin bs=1M count=1024 status=progress"
        output={`1073741824 bytes (1.1 GB, 1.0 GiB) copied, 1 s, 1.1 GB/s
1024+0 records in
1024+0 records out`}
      />

    </PageContainer>
  );
}
