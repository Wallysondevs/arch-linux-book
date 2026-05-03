import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Particoes() {
  return (
    <PageContainer
      title="Particionamento — fdisk, parted, gdisk"
      subtitle="GPT vs MBR, criação e edição de partições, alinhamento, swap e formatação. Toda a saída real das ferramentas que você vai usar antes (e depois) de instalar o Arch."
      difficulty="avancado"
      timeToRead="40 min"
      category="Storage"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo</code>. Cuidado <strong>extremo</strong>: ferramentas de particionamento podem destruir dados.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Tabela de partições</strong> — MBR (legado, máx 2 TB) ou GPT (moderno).
      </p>
      <p>
        <strong>Partição primária / estendida / lógica</strong> — conceitos do MBR. GPT só tem partições "comuns".
      </p>
      <p>
        <strong>parted / gdisk / fdisk / cfdisk</strong> — ferramentas CLI. <code>cfdisk</code> tem TUI amigável.
      </p>
      <p>
        <strong>mkfs</strong> — formata uma partição com um filesystem (<code>mkfs.ext4</code>, <code>mkfs.btrfs</code>).
      </p>

      <p>
        Particionar é dividir um disco em pedaços lógicos independentes, cada um com seu
        filesystem. No Arch isso normalmente acontece dentro do live ISO antes do{" "}
        <code>pacstrap</code>, mas também aparece quando você adiciona um SSD novo,
        cria swap em arquivo ou troca o esquema de tabela. Esta página cobre as três
        ferramentas mais usadas e como combiná-las com <code>mkfs</code>, alinhamento e
        boas práticas de UEFI.
      </p>

      <AlertBox type="danger" title="Particionar = perder dados se errar o alvo">
        Confirme <strong>três vezes</strong> qual disco está mexendo. Use
        <code> lsblk</code>, <code>fdisk -l</code> e <code>blkid</code> antes de digitar
        qualquer comando destrutivo. Pendrive USB normalmente é
        <code> /dev/sda</code>/<code>/dev/sdb</code>; SSD NVMe interno é
        <code> /dev/nvme0n1</code>; eMMC é <code>/dev/mmcblk0</code>.
      </AlertBox>

      <h2>1. GPT vs MBR — qual usar?</h2>

      <OutputBlock
        title="comparação prática"
        output={`característica           MBR (msdos)              GPT (recomendado)
-----------------------  -----------------------  ----------------------------------
ano                      1983                     2010
tamanho máx. de disco    2 TiB                    9.4 ZiB (≈ infinito)
nº de partições          4 primárias (3+1ext)     128 (sem "primária/lógica")
boot UEFI                — (precisa CSM/legacy)   ✓ NATIVO
boot BIOS                ✓                        ✓ (com partição BIOS Boot, 1 MiB)
checksum CRC32           não                      ✓ (detecta corrupção)
backup de tabela         não                      ✓ (cópia no fim do disco)`}
      />

      <p>
        Em qualquer máquina UEFI moderna (≈ 2013 em diante) use <strong>GPT</strong>.
        Só fique no MBR se for hardware muito antigo ou pendrive de boot legacy.
      </p>

      <h2>2. lsblk e fdisk -l — inventário</h2>

      <TerminalBlock
        command="lsblk"
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 953.9G  0 disk
├─nvme0n1p1 259:1    0   512M  0 part /boot
├─nvme0n1p2 259:2    0   200G  0 part /
├─nvme0n1p3 259:3    0 745.4G  0 part /home
└─nvme0n1p4 259:4    0     8G  0 part [SWAP]
sda           8:0    0   1.8T  0 disk
└─sda1        8:1    0   1.8T  0 part /mnt/backup`}
      />

      <TerminalBlock
        command="sudo fdisk -l /dev/nvme0n1"
        output={`Disk /dev/nvme0n1: 953.87 GiB, 1024209543168 bytes, 2000409264 sectors
Disk model: Samsung SSD 980 PRO 1TB
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 68FE5B9A-1234-4567-89AB-CDEF01234567

Device            Start        End    Sectors   Size Type
/dev/nvme0n1p1     2048    1050623    1048576   512M EFI System
/dev/nvme0n1p2  1050624  420696063  419645440   200G Linux filesystem
/dev/nvme0n1p3 420696064 1983322111 1562626048 745.4G Linux filesystem
/dev/nvme0n1p4 1983322112 2000408575   17086464     8G Linux swap`}
      />

      <h2>3. fdisk — interativo, simples e confiável</h2>

      <CommandFlagList
        command="fdisk (modo interativo)"
        items={[
          { flag: "m", description: "Help — lista todos os comandos." },
          { flag: "p", description: "Print — mostra a tabela atual (não escrita)." },
          { flag: "g", description: "Cria nova tabela GPT vazia." },
          { flag: "o", description: "Cria nova tabela MBR vazia." },
          { flag: "n", description: "Nova partição (pergunta número, primeiro setor, tamanho)." },
          { flag: "d", description: "Deleta partição." },
          { flag: "t", description: "Muda tipo (ex: 1 = EFI System, 19 = Linux swap, 30 = Linux LVM)." },
          { flag: "L", description: "Lista todos os tipos disponíveis (dentro do comando t)." },
          { flag: "w", description: "Escreve a tabela no disco e sai. SÓ AQUI as mudanças são persistidas." },
          { flag: "q", description: "Sai SEM gravar. Use se errou tudo." },
          { flag: "x", description: "Modo expert (mover partições, mudar UUID, etc.)." },
        ]}
      />

      <TerminalBlock
        comment="abrir disco para edição"
        command="sudo fdisk /dev/nvme0n1"
        output={`Welcome to fdisk (util-linux 2.40.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Command (m for help):`}
      />

      <OutputBlock
        title="sessão completa: criar EFI + ROOT + SWAP em disco vazio"
        output={`Command (m for help): g
Created a new GPT disklabel (GUID: 12345678-...).

Command (m for help): n
Partition number (1-128, default 1): 1
First sector (2048-2000409230, default 2048): {bold}↵{/}
Last sector, +/-sectors or +/-size{...K,M,G,T,P} (2048-2000409230, default 2000409230): +512M
Created a new partition 1 of type 'Linux filesystem' and of size 512 MiB.

Command (m for help): t
Selected partition 1
Partition type or alias (type L to list all): 1
Changed type of partition 'Linux filesystem' to 'EFI System'.

Command (m for help): n
Partition number (2-128, default 2): {bold}↵{/}
First sector (1050624-2000409230, default 1050624): {bold}↵{/}
Last sector, +/-sectors or +/-size{...K,M,G,T,P} (1050624-2000409230, default 2000409230): -8G
Created a new partition 2 of type 'Linux filesystem' and of size 944.4 GiB.

Command (m for help): n
Partition number (3-128, default 3): {bold}↵{/}
First sector (1983322112-2000409230, default 1983322112): {bold}↵{/}
Last sector, +/-sectors or +/-size{...K,M,G,T,P} (1983322112-2000409230, default 2000409230): {bold}↵{/}
Created a new partition 3 of type 'Linux filesystem' and of size 8 GiB.

Command (m for help): t
Partition number (1-3, default 3): 3
Partition type or alias (type L to list all): 19
Changed type of partition 'Linux filesystem' to 'Linux swap'.

Command (m for help): p
Disk /dev/nvme0n1: 953.87 GiB
Disklabel type: gpt
Device              Start        End    Sectors   Size Type
/dev/nvme0n1p1       2048    1050623    1048576   512M EFI System
/dev/nvme0n1p2    1050624 1983322111 1982271488 944.4G Linux filesystem
/dev/nvme0n1p3 1983322112 2000409230   17087119     8G Linux swap

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.`}
      />

      <h2>4. parted — não interativo (ideal para scripts)</h2>

      <CommandFlagList
        command="parted /dev/X"
        items={[
          { flag: "mklabel TIPO", description: "Cria nova tabela: gpt ou msdos.", example: "parted /dev/nvme0n1 mklabel gpt" },
          { flag: "mkpart NOME FS START END", description: "Cria partição (use 'primary' como nome em GPT).", example: "parted /dev/sda mkpart ROOT ext4 1MiB 200GiB" },
          { flag: "set N flag on/off", description: "Liga flags: boot, esp, swap, lvm, raid.", example: "parted /dev/nvme0n1 set 1 esp on" },
          { flag: "print", description: "Mostra tabela atual + alinhamento.", example: "parted /dev/sda print" },
          { flag: "rm N", description: "Remove partição N." },
          { flag: "resizepart N END", description: "Redimensiona (combine com resize2fs/btrfs filesystem resize)." },
          { flag: "align-check optimal N", description: "Confirma se a partição N está alinhada ao melhor offset (4K/1MiB)." },
          { flag: "-s / --script", description: "Modo silencioso (não pergunta confirmação) — para automação." },
        ]}
      />

      <TerminalBlock
        comment="exemplo automatizado: GPT + EFI + ROOT + SWAP num disco vazio"
        command={`sudo parted -s /dev/nvme0n1 \\
    mklabel gpt \\
    mkpart EFI fat32 1MiB 513MiB     set 1 esp on \\
    mkpart ROOT ext4 513MiB 100%     \\
    print`}
        output={`Model: Samsung SSD 980 PRO 1TB (nvme)
Disk /dev/nvme0n1: 1024GB
Sector size (logical/physical): 512B/512B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name  Flags
 1      1049kB  513MB   512MB   fat32        EFI   boot, esp
 2      513MB   1024GB  1024GB                ROOT`}
      />

      <h2>5. gdisk — fdisk, mas só para GPT</h2>

      <p>
        O <code>gdisk</code> (pacote <code>gptfdisk</code>) é praticamente idêntico ao{" "}
        <code>fdisk</code> em uso, mas especializado em GPT. Útil para reparar tabela
        corrompida (<code>r</code> = recovery menu) e sincronizar com o backup do GPT.
      </p>

      <TerminalBlock command="sudo pacman -S gptfdisk" output={`Packages (1)  gptfdisk-1.0.10-1\nTotal Installed Size:  0.92 MiB\n:: Proceed with installation? [Y/n]`} />

      <TerminalBlock
        command="sudo gdisk /dev/nvme0n1"
        output={`GPT fdisk (gdisk) version 1.0.10

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.

Command (? for help):`}
      />

      <h2>6. Alinhamento — porque importa</h2>

      <p>
        SSDs e discos modernos esperam que partições comecem em múltiplos de
        <strong> 1 MiB</strong> (2048 setores de 512B). Desalinhar perde performance e
        encurta a vida do SSD. Felizmente: <code>fdisk</code> e <code>parted</code>
        modernos alinham por padrão. Para conferir:
      </p>

      <TerminalBlock
        command="sudo parted /dev/nvme0n1 align-check optimal 1"
        output="1 aligned"
      />

      <TerminalBlock
        comment="ou conferir o setor inicial (deve ser múltiplo de 2048)"
        command="sudo fdisk -l /dev/nvme0n1 | grep '^/dev'"
        output={`/dev/nvme0n1p1     2048    1050623    1048576   512M EFI System
/dev/nvme0n1p2  1050624  420696063  419645440   200G Linux filesystem`}
      />

      <h2>7. Tipos de partição (GPT GUID)</h2>

      <OutputBlock
        title="tipos mais usados"
        output={`alias  GUID                                  uso
-----  ------------------------------------  -------------------------------------------
1      C12A7328-F81F-11D2-BA4B-00A0C93EC93B  EFI System Partition (ESP / /boot)
19     0657FD6D-A4AB-43C4-84E5-0933C84B4F4F  Linux swap
20     0FC63DAF-8483-4772-8E79-3D69D8477DE4  Linux filesystem (uso geral)
30     E6D6D379-F507-44C2-A23C-238F2A3DF928  Linux LVM
44     A19D880F-05FC-4D3B-A006-743F0F84911E  Linux RAID
21686148-6449-6E6F-744E-656564454649     BIOS Boot (1 MiB para GRUB em BIOS+GPT)`}
      />

      <h2>8. Formatando depois de particionar</h2>

      <TerminalBlock
        comment="ext4 — root, home, dados em geral"
        command="sudo mkfs.ext4 -L ROOT /dev/nvme0n1p2"
        output={`mke2fs 1.47.0 (5-Feb-2023)
Creating filesystem with 52428160 4k blocks and 13107200 inodes
Filesystem UUID: a1b2c3d4-1234-5678-9abc-def012345678
Superblock backups stored on blocks: ...
Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done`}
      />

      <TerminalBlock
        comment="FAT32 — partição EFI"
        command="sudo mkfs.fat -F32 -n EFI /dev/nvme0n1p1"
        output={`mkfs.fat 4.2 (2021-01-31)`}
      />

      <TerminalBlock
        comment="btrfs — moderno, com subvolumes/snapshots/compressão"
        command="sudo mkfs.btrfs -L ARCH /dev/nvme0n1p2"
        output={`btrfs-progs v6.7
NOTE: several default settings have changed in version 5.15
       free-space-tree (space_cache=v2)
       no-holes
       extref, skinny-metadata, no-holes
Label:              ARCH
UUID:               e5f6a7b8-1234-5678-9abc-def012345678
Node size:          16384
Sector size:        4096
Filesystem size:    944.40GiB
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
    1   944.40GiB  /dev/nvme0n1p2`}
      />

      <TerminalBlock
        comment="xfs — performance em cargas grandes"
        command="sudo mkfs.xfs -L DADOS /dev/sda1"
        output={`meta-data=/dev/sda1              isize=512    agcount=4, agsize=122096128 blks
         =                       sectsz=4096  attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=0
         =                       reflink=1    bigtime=1 inobtcount=1 nrext64=0
data     =                       bsize=4096   blocks=488384512, imaxpct=5
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=238469, version=2
         =                       sectsz=4096  sunit=1 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0`}
      />

      <TerminalBlock
        comment="swap — duas etapas"
        command="sudo mkswap -L SWAP /dev/nvme0n1p4"
        output={`Setting up swapspace version 1, size = 8 GiB (8589930496 bytes)
LABEL=SWAP, UUID=c3d4e5f6-3456-789a-bcde-f01234567890`}
      />
      <TerminalBlock command="sudo swapon /dev/nvme0n1p4" output="" />
      <TerminalBlock
        command="swapon --show"
        output={`NAME           TYPE      SIZE   USED PRIO
/dev/nvme0n1p4 partition   8G     0B   -2`}
      />

      <h2>9. Redimensionar partição existente</h2>

      <p>
        Para crescer uma ext4 (com o disco desmontado, por live ISO):
      </p>

      <TerminalBlock
        comment="1. estende a partição com parted"
        command="sudo parted /dev/sda resizepart 1 100%"
        output={`Information: You may need to update /etc/fstab.`}
      />

      <TerminalBlock
        comment="2. estende o filesystem"
        command="sudo e2fsck -f /dev/sda1 && sudo resize2fs /dev/sda1"
        output={`e2fsck 1.47.0 (5-Feb-2023)
Pass 1: Checking inodes, blocks, and sizes
... (várias passes) ...
/dev/sda1: 187432/122093568 files (0.1% non-contiguous), 8472413/488384512 blocks
resize2fs 1.47.0 (5-Feb-2023)
Resizing the filesystem on /dev/sda1 to 488384512 (4k) blocks.
The filesystem on /dev/sda1 is now 488384512 (4k) blocks long.`}
      />

      <p>btrfs cresce sem desmontar:</p>
      <TerminalBlock
        command="sudo btrfs filesystem resize max /mnt/dados"
        output={`Resize device id 1 (/dev/sda1) from 1.50TiB to max`}
      />

      <h2>10. Boas práticas — esquema típico de um Arch desktop UEFI</h2>

      <OutputBlock
        title="layout recomendado"
        output={`/dev/nvme0n1p1   512M   FAT32   /boot       EFI System Partition
/dev/nvme0n1p2   200G   ext4    /           root
/dev/nvme0n1p3   resto  ext4    /home       (separado, sobrevive a reinstall)
/dev/nvme0n1p4   8G     swap                (= RAM se for usar hibernação; senão metade)`}
      />

      <AlertBox type="success" title="Dica de produção">
        Adote <strong>GPT</strong>, alinhe em 1 MiB (default), use <strong>LABEL</strong>{" "}
        em todas as partições (facilita identificar em <code>lsblk</code>) e <strong>sempre</strong>
        salve um backup da tabela: <code>sudo sgdisk --backup=tabela.bin /dev/nvme0n1</code>.
        Restaurar é <code>sudo sgdisk --load-backup=tabela.bin /dev/nvme0n1</code>.
      </AlertBox>

      <h2>11. Resumo</h2>

      <OutputBlock
        title="receita do início ao fim"
        output={`# 1) inventário
lsblk; sudo fdisk -l /dev/nvme0n1

# 2) particionar (escolha 1 das ferramentas)
sudo fdisk /dev/nvme0n1                # interativo
sudo parted -s /dev/nvme0n1 mklabel gpt mkpart ...   # script

# 3) formatar
sudo mkfs.fat -F32 /dev/nvme0n1p1      # ESP
sudo mkfs.ext4 /dev/nvme0n1p2          # root
sudo mkswap /dev/nvme0n1p4 && sudo swapon /dev/nvme0n1p4

# 4) montar e instalar (live ISO)
sudo mount /dev/nvme0n1p2 /mnt
sudo mount --mkdir /dev/nvme0n1p1 /mnt/boot
sudo pacstrap -K /mnt base linux linux-firmware
sudo genfstab -U /mnt >> /mnt/etc/fstab`}
      />
    </PageContainer>
  );
}
