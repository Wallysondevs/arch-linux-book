import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Fstab() {
  return (
    <PageContainer
      title="/etc/fstab — File System Table"
      subtitle="O arquivo que decide o que o Arch monta no boot. UUID, opções, ext4/btrfs/swap/tmpfs/nfs — com fstab real e comandos de validação."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Storage"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com <code>sudo</code>. Cuidado: erro em <code>/etc/fstab</code> pode impedir o boot. <code>genfstab -U /mnt</code> gera durante a instalação.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>fstab</strong> — file system table — <code>/etc/fstab</code> com partições montadas no boot.
      </p>
      <p>
        <strong>UUID</strong> — identificador único da partição. Sempre prefira UUID a <code>/dev/sdaN</code>.
      </p>
      <p>
        <strong>Mount options</strong> — <code>defaults</code>, <code>noatime</code>, <code>ro</code>, <code>user</code>, <code>nofail</code>, <code>compress=zstd</code>.
      </p>
      <p>
        <strong>dump / pass</strong> — últimos campos: <code>dump</code> (backup) e <code>pass</code> (ordem do fsck no boot).
      </p>

      <p>
        O <code>/etc/fstab</code> (<em>file system table</em>) é lido pelo systemd na
        montagem inicial — cada linha vira uma <code>.mount</code> unit. Errar uma vírgula
        aqui pode impedir o boot, então este capítulo cobre o formato exato, exemplos
        reais por filesystem, ferramentas de inspeção (<code>blkid</code>, <code>lsblk</code>,
        <code>findmnt</code>) e como testar mudanças sem reiniciar.
      </p>

      <AlertBox type="warning" title="Sempre teste antes de reiniciar">
        Após editar o fstab, execute <code>sudo mount -a</code> (monta tudo o que está
        marcado em fstab e ainda não está montado). Se houver erro, você sabe agora
        — não na próxima inicialização, presa em <em>emergency mode</em>.
      </AlertBox>

      <h2>1. Formato — os 6 campos</h2>

      <OutputBlock
        title="anatomia de uma linha"
        annotations={[
          { line: 1, note: "device  ·  mount  ·  fstype  ·  opts  ·  dump  ·  pass" },
        ]}
        output={`# <file system>      <mount point>  <type>  <options>          <dump>  <pass>
UUID=a1b2c3d4-...    /              ext4    rw,relatime         0       1`}
      />

      <OutputBlock
        title="o que cada coluna significa"
        output={`1) device     UUID=, LABEL=, /dev/sdXN, /dev/disk/by-id/..., remoto (//host/share, nfs:/exp)
2) mount      caminho absoluto onde montar (/, /home, /boot, /mnt/dados)  — "none" para swap
3) type       ext4, btrfs, xfs, vfat, swap, tmpfs, nfs, cifs, fuse.sshfs ...
4) options    defaults, noatime, nofail, ro, x-systemd.automount, ...
5) dump       0 quase sempre (legacy do dump(8))
6) pass       0 = sem fsck, 1 = root, 2 = outras (rodam em paralelo após root)`}
      />

      <h2>2. Descobrindo UUIDs e LABELs com blkid e lsblk</h2>

      <p>
        <strong>Sempre prefira UUID</strong> a <code>/dev/sdXN</code>: o nome do device
        muda quando você troca a ordem de cabos SATA, troca de SSD ou pluga um pendrive,
        mas o UUID acompanha o filesystem.
      </p>

      <TerminalBlock
        command="lsblk -f"
        output={`NAME        FSTYPE      FSVER LABEL    UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
nvme0n1
├─nvme0n1p1 vfat        FAT32 EFI      C1A2-9F47                             492.4M     4% /boot
├─nvme0n1p2 ext4        1.0   ARCH     a1b2c3d4-1234-5678-9abc-def012345678  198.4G    16% /
├─nvme0n1p3 ext4        1.0   HOME     b2c3d4e5-2345-6789-abcd-ef0123456789  712.8G    21% /home
└─nvme0n1p4 swap        1     SWAP     c3d4e5f6-3456-789a-bcde-f01234567890                [SWAP]
sda
└─sda1      ext4        1.0   BACKUP   d4e5f6a7-4567-89ab-cdef-012345678901  1.6T      12% /mnt/backup`}
      />

      <TerminalBlock
        comment="blkid mostra UUID + TYPE de cada dispositivo (precisa root para ler superblocos)"
        command="sudo blkid"
        output={`/dev/nvme0n1p1: LABEL_FATBOOT="EFI" LABEL="EFI" UUID="C1A2-9F47" BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI System Partition" PARTUUID="68fe5b9a-01"
/dev/nvme0n1p2: LABEL="ARCH" UUID="a1b2c3d4-1234-5678-9abc-def012345678" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="68fe5b9a-02"
/dev/nvme0n1p3: LABEL="HOME" UUID="b2c3d4e5-2345-6789-abcd-ef0123456789" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="68fe5b9a-03"
/dev/nvme0n1p4: LABEL="SWAP" UUID="c3d4e5f6-3456-789a-bcde-f01234567890" TYPE="swap" PARTUUID="68fe5b9a-04"
/dev/sda1: LABEL="BACKUP" UUID="d4e5f6a7-4567-89ab-cdef-012345678901" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="9ab12c34-01"`}
      />

      <TerminalBlock
        comment="só o UUID de uma partição"
        command="blkid -s UUID -o value /dev/nvme0n1p2"
        output="a1b2c3d4-1234-5678-9abc-def012345678"
      />

      <TerminalBlock
        comment="links persistentes — by-id é estável mesmo entre reboots"
        command="ls -l /dev/disk/by-uuid/"
        output={`lrwxrwxrwx 1 root root 15 Mar 26 09:01 C1A2-9F47 -> ../../nvme0n1p1
lrwxrwxrwx 1 root root 15 Mar 26 09:01 a1b2c3d4-1234-5678-9abc-def012345678 -> ../../nvme0n1p2
lrwxrwxrwx 1 root root 15 Mar 26 09:01 b2c3d4e5-2345-6789-abcd-ef0123456789 -> ../../nvme0n1p3
lrwxrwxrwx 1 root root 15 Mar 26 09:01 c3d4e5f6-3456-789a-bcde-f01234567890 -> ../../nvme0n1p4
lrwxrwxrwx 1 root root 10 Mar 26 09:01 d4e5f6a7-4567-89ab-cdef-012345678901 -> ../../sda1`}
      />

      <h2>3. Um fstab real de um Arch desktop</h2>

      <CodeBlock
        title="/etc/fstab"
        language="ini"
        code={`# Static information about the filesystems.
# See fstab(5) for details.

# <file system>                                <mount point>  <type>  <options>                                  <dump>  <pass>

# / — root ext4
UUID=a1b2c3d4-1234-5678-9abc-def012345678      /              ext4    rw,relatime,errors=remount-ro              0       1

# /boot — partição EFI FAT32
UUID=C1A2-9F47                                 /boot          vfat    rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,utf8,errors=remount-ro  0  2

# /home — separado
UUID=b2c3d4e5-2345-6789-abcd-ef0123456789      /home          ext4    rw,relatime                                0       2

# swap
UUID=c3d4e5f6-3456-789a-bcde-f01234567890      none           swap    defaults                                   0       0

# disco extra para backups, montagem lazy on-demand
UUID=d4e5f6a7-4567-89ab-cdef-012345678901      /mnt/backup    ext4    noauto,nofail,x-systemd.automount,x-systemd.idle-timeout=600  0  2

# tmpfs em /tmp (RAM)
tmpfs                                          /tmp           tmpfs   defaults,nosuid,nodev,size=4G              0       0

# share NFS
192.168.1.10:/srv/media                        /mnt/media     nfs     rw,_netdev,x-systemd.automount             0       0

# share Samba (Windows / NAS)
//192.168.1.20/musica                          /mnt/musica    cifs    credentials=/etc/samba/credentials,uid=1000,gid=1000,_netdev,nofail  0  0`}
      />

      <h2>4. As opções (campo 4) que você precisa conhecer</h2>

      <CommandFlagList
        command="opções de montagem mais usadas"
        items={[
          { flag: "defaults", description: <>Equivale a <code>rw,suid,dev,exec,auto,nouser,async</code> — o "valor padrão razoável".</> },
          { flag: "rw / ro", description: <>Leitura+escrita / só leitura. Pra <code>/</code> é comum manter <code>rw</code> e adicionar <code>errors=remount-ro</code>.</> },
          { flag: "noatime", description: <>Não atualiza timestamp de leitura — economiza I/O em SSD. <code>relatime</code> (default no kernel) já é bom suficiente.</> },
          { flag: "nofail", description: <>Não trava o boot se o device sumir. <strong>Essencial</strong> em discos externos/USB.</> },
          { flag: "noauto", description: <>Não monta automaticamente no boot — só quando você rodar <code>mount /ponto</code>.</> },
          { flag: "x-systemd.automount", description: <>Monta sob demanda (no primeiro acesso ao caminho). Combine com <code>noauto</code>.</> },
          { flag: "x-systemd.idle-timeout=N", description: <>Desmonta após N segundos sem uso. Útil para HDDs externos que dormem.</> },
          { flag: "_netdev", description: <>Marca como dependente de rede — só monta após <code>network-online.target</code>.</> },
          { flag: "discard", description: <>TRIM contínuo (SSD). <strong>Prefira</strong> a unit <code>fstrim.timer</code> (TRIM semanal).</> },
          { flag: "compress=zstd", description: <>btrfs: compressão transparente. Excelente para diretórios cheios de texto/código.</> },
          { flag: "subvol=@home", description: <>btrfs: monta um subvolume específico (instalação Arch+btrfs típica).</> },
          { flag: "uid=1000,gid=1000", description: <>vfat/ntfs/cifs: define dono dos arquivos no FS sem permissões POSIX.</> },
          { flag: "user / users", description: <>Permite usuários comuns montarem (com <code>mount</code> sem sudo).</> },
        ]}
      />

      <h2>5. Exemplos por filesystem</h2>

      <h3>ext4 (root, home, dados)</h3>
      <CodeBlock
        language="ini"
        code={`UUID=a1b2c3d4-...   /          ext4   rw,relatime,errors=remount-ro   0  1
UUID=b2c3d4e5-...   /home      ext4   rw,relatime                     0  2`}
      />

      <h3>btrfs com subvolumes (instalação típica)</h3>
      <CodeBlock
        language="ini"
        code={`UUID=e5f6a7b8-...   /          btrfs  rw,noatime,compress=zstd:3,space_cache=v2,subvol=@         0 0
UUID=e5f6a7b8-...   /home      btrfs  rw,noatime,compress=zstd:3,space_cache=v2,subvol=@home     0 0
UUID=e5f6a7b8-...   /.snapshots btrfs rw,noatime,compress=zstd:3,space_cache=v2,subvol=@snapshots 0 0
UUID=e5f6a7b8-...   /var/log   btrfs  rw,noatime,compress=zstd:3,space_cache=v2,subvol=@log      0 0`}
      />

      <h3>swap — partição e arquivo</h3>
      <CodeBlock
        language="ini"
        code={`# swap em partição
UUID=c3d4e5f6-...   none    swap   defaults                       0 0

# swap em arquivo (/swapfile criado com:
#   sudo dd if=/dev/zero of=/swapfile bs=1M count=8192 status=progress
#   sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile )
/swapfile            none    swap   defaults                       0 0`}
      />

      <h3>tmpfs em RAM</h3>
      <CodeBlock
        language="ini"
        code={`tmpfs   /tmp        tmpfs   defaults,nosuid,nodev,size=4G          0 0
tmpfs   /var/tmp    tmpfs   defaults,nosuid,nodev,size=2G          0 0`}
      />

      <AlertBox type="info" title="Já existe um tmpfs em /tmp por padrão">
        No Arch, o systemd monta <code>tmpfs</code> em <code>/tmp</code> automaticamente
        (via <code>/usr/lib/systemd/system/tmp.mount</code>). Só adicione no fstab se
        quiser sobrescrever — sua entrada vence.
      </AlertBox>

      <h3>NFS (rede)</h3>
      <CodeBlock
        language="ini"
        code={`# instale antes:  sudo pacman -S nfs-utils
192.168.1.10:/srv/media   /mnt/media   nfs   rw,_netdev,x-systemd.automount,x-systemd.idle-timeout=300   0 0`}
      />

      <h3>CIFS / Samba</h3>
      <CodeBlock
        language="ini"
        code={`# instale antes:  sudo pacman -S cifs-utils
//192.168.1.20/share   /mnt/share   cifs   credentials=/etc/samba/cred,uid=1000,gid=1000,iocharset=utf8,nofail,_netdev   0 0`}
      />

      <CodeBlock
        title="/etc/samba/cred (modo 0600 — só root lê)"
        code={`username=joao
password=segredo123
domain=WORKGROUP`}
      />

      <h3>FAT/NTFS (pendrive, dual-boot)</h3>
      <CodeBlock
        language="ini"
        code={`# pendrive vfat com seu UID dono
UUID=DEAD-BEEF      /mnt/pendrive   vfat    rw,uid=1000,gid=1000,umask=022,nofail  0 0

# partição NTFS de dual-boot Windows (instale ntfs-3g):  sudo pacman -S ntfs-3g
UUID=AABBCCDDEEFF0011  /mnt/windows  ntfs3   rw,uid=1000,gid=1000,umask=022,nofail   0 0`}
      />

      <h2>6. Validando e aplicando sem reiniciar</h2>

      <TerminalBlock
        comment="monta tudo no fstab que ainda não está montado (excelente teste!)"
        command="sudo mount -a"
        output=""
      />

      <TerminalBlock
        comment="o que está montado AGORA, com as opções efetivas"
        command="findmnt --real"
        output={`TARGET                                SOURCE         FSTYPE     OPTIONS
/                                     /dev/nvme0n1p2 ext4       rw,relatime,errors=remount-ro
├─/proc                               proc           proc       rw,nosuid,nodev,noexec,relatime
├─/sys                                sys            sysfs      rw,nosuid,nodev,noexec,relatime
├─/dev                                dev            devtmpfs   rw,nosuid,relatime,size=8042020k
├─/run                                run            tmpfs      rw,nosuid,nodev,relatime,mode=755
├─/tmp                                tmpfs          tmpfs      rw,nosuid,nodev,size=4194304k
├─/boot                               /dev/nvme0n1p1 vfat       rw,relatime,fmask=0022,dmask=0022,codepage=437
├─/home                               /dev/nvme0n1p3 ext4       rw,relatime
└─/mnt/backup                         systemd-1      autofs     rw,relatime,fd=49,pgrp=1,timeout=600,minproto=5`}
      />

      <TerminalBlock
        comment="só o caminho que você quer"
        command="findmnt /home"
        output={`TARGET SOURCE         FSTYPE OPTIONS
/home  /dev/nvme0n1p3 ext4   rw,relatime`}
      />

      <TerminalBlock
        comment="mounts do tipo nfs/cifs apenas"
        command="findmnt -t nfs,cifs"
        output={`TARGET     SOURCE                         FSTYPE OPTIONS
/mnt/media 192.168.1.10:/srv/media        nfs4   rw,relatime,vers=4.2,...
/mnt/share //192.168.1.20/share           cifs   rw,relatime,vers=3.1.1,...`}
      />

      <TerminalBlock
        comment="remontar com novas opções sem desmontar (ex: ro -> rw)"
        command="sudo mount -o remount,rw /mnt/backup"
        output=""
      />

      <h2>7. Erros típicos (e como sair deles)</h2>

      <TerminalBlock
        comment="UUID errado / device sumiu"
        command="sudo mount -a"
        exitCode={32}
        output={`mount: /mnt/backup: special device UUID=ZZZZZZZZ-... does not exist.
       dmesg(1) may have more information after failed mount system call.`}
      />

      <TerminalBlock
        comment="opção inválida"
        command="sudo mount -a"
        exitCode={32}
        output={`mount: /home: bad option; for several filesystems (e.g. nfs, cifs) you might
       need a /sbin/mount.<type> helper program.`}
      />

      <AlertBox type="danger" title="Travou em emergency mode após editar fstab?">
        Se o fstab tiver erro fatal, o systemd cai em <em>emergency.target</em> pedindo a
        senha de root. Logue, monte <code>/</code> em modo escrita
        (<code>mount -o remount,rw /</code>), edite o fstab com <code>nano /etc/fstab</code>,
        rode <code>systemctl daemon-reload</code> e digite <code>exit</code> para
        continuar o boot. Use <code>nofail</code> em discos opcionais para nunca cair
        nesse buraco.
      </AlertBox>

      <h2>8. systemd .mount units — o que o fstab gera por baixo</h2>

      <p>
        Cada linha do fstab é convertida pelo <code>systemd-fstab-generator</code> em uma
        unit <code>.mount</code>:
      </p>

      <TerminalBlock
        command="systemctl list-units --type=mount"
        output={`  UNIT                       LOAD   ACTIVE SUB     DESCRIPTION
  -.mount                    loaded {g}active{/} mounted Root Mount
  boot.mount                 loaded {g}active{/} mounted /boot
  home.mount                 loaded {g}active{/} mounted /home
  mnt-backup.automount       loaded {g}active{/} waiting Automount for /mnt/backup
  tmp.mount                  loaded {g}active{/} mounted Temporary Directory /tmp

5 loaded units listed.`}
      />

      <TerminalBlock
        command="systemctl status home.mount"
        output={`{g}● home.mount{/} - /home
     Loaded: loaded (/etc/fstab; generated)
     Active: {g}active (mounted){/} since Wed 2026-03-26 09:01:14 -03; 4h ago
      Where: /home
       What: /dev/nvme0n1p3
       Docs: man:fstab(5)
             man:systemd-fstab-generator(8)`}
      />

      <h2>9. Cola de bolso</h2>

      <OutputBlock
        title="ciclo de edição segura"
        output={`1)  blkid   ou   lsblk -f      → pegue o UUID
2)  sudoedit /etc/fstab          → adicione/edite a linha
3)  sudo systemctl daemon-reload → registra a mudança no systemd
4)  sudo mount -a                → testa montagem (FALHA AQUI = ainda dá tempo)
5)  findmnt /caminho             → confirma opções efetivas
6)  reboot (opcional, agora seguro)`}
      />
    </PageContainer>
  );
}
