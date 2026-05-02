import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Backup() {
  return (
    <PageContainer
      title="Backup — rsync, borg, restic, tar e snapshots"
      subtitle="As cinco abordagens que cobrem 99% dos cenários: incrementais com hardlinks, deduplicação cifrada, snapshots btrfs e arquivos tar para off-site."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Storage"
    >
      <p>
        Backup não é cópia. Backup é a sua versão futura conseguindo voltar a um momento
        passado — mesmo que o disco original tenha derretido, mesmo que o ransomware
        tenha cifrado tudo, mesmo que você tenha rodado <code>rm -rf</code> no diretório
        errado. Esta página cobre cinco ferramentas com filosofias diferentes; escolha
        a que combina com o seu cenário.
      </p>

      <AlertBox type="info" title="Regra 3-2-1">
        <strong>3</strong> cópias dos dados, em <strong>2</strong> mídias diferentes,
        com <strong>1</strong> off-site. Backup local protege contra erro humano e
        falha de disco; off-site protege contra incêndio, roubo e ransomware. As
        ferramentas abaixo se complementam.
      </AlertBox>

      <h2>1. rsync — incrementais simples e rápidos</h2>

      <p>
        Já vem instalado em qualquer Arch (pacote <code>rsync</code>). Faz cópia
        diferencial: só transfere o que mudou. Combinado com <code>--link-dest</code>{" "}
        produz <em>snapshots de diretório</em> com hard links — cada snapshot ocupa
        o tamanho das diferenças, mas aparece como uma árvore completa.
      </p>

      <CommandFlagList
        command="rsync"
        items={[
          { flag: "-a", long: "--archive", description: "Modo arquivo: -rlptgoD (recursivo, links, perms, times, group, owner, devices)." },
          { flag: "-H", description: "Preserva HARD LINKS — essencial para backups baseados em --link-dest." },
          { flag: "-A -X", description: "Preserva ACLs (-A) e xattrs (-X)." },
          { flag: "-v", description: "Verbose. -vv ainda mais. -P = --partial --progress (retomar + barra)." },
          { flag: "-z", description: "Comprime na transferência (rede). Sobre LAN gigabit costuma ser pior." },
          { flag: "--delete", description: "Remove no destino arquivos que sumiram da origem (espelho real)." },
          { flag: "--link-dest=DIR", description: "Para arquivos idênticos a DIR, cria HARD LINK em vez de copiar — snapshots baratos.", example: "rsync -aH --link-dest=../2026-03-25 src/ ./2026-03-26/" },
          { flag: "--exclude=PAT", description: "Exclui padrão. Use --exclude-from=arq para ler de arquivo." },
          { flag: "--dry-run / -n", description: "Mostra o que faria SEM fazer. SEMPRE rode antes de --delete." },
          { flag: "--info=progress2", description: "Barra de progresso global (não por arquivo)." },
        ]}
      />

      <TerminalBlock
        comment="cópia simples: espelhar /home no HD externo"
        command="rsync -aHAX --info=progress2 --delete /home/ /mnt/backup/home/"
        output={`           412,847,123,456  37%  118.42MB/s    1:23:54 (xfr#138421, to-chk=12872/187543)
sent 412.85G  bytes  received 18.42M  bytes  118.40M  bytes/sec
total size is 1.10T  speedup is 2.66`}
      />

      <h3>1.1. Backup incremental com snapshots (estilo Time Machine)</h3>

      <CodeBlock
        title="~/bin/snapshot-backup.sh"
        code={`#!/usr/bin/env bash
set -euo pipefail

SRC="/home/joao/"
DST_BASE="/mnt/backup/home"
TODAY="$DST_BASE/$(date +%Y-%m-%d_%H%M)"
LATEST="$DST_BASE/latest"

mkdir -p "$DST_BASE"

rsync -aHAX --delete --info=progress2 \\
    --exclude='.cache/' --exclude='node_modules/' \\
    --link-dest="$LATEST" \\
    "$SRC" "$TODAY/"

# atualiza ponteiro 'latest'
rm -f "$LATEST"
ln -s "$TODAY" "$LATEST"

# mantém últimos 30 snapshots
ls -1dt "$DST_BASE"/2*/ | tail -n +31 | xargs -r rm -rf`}
      />

      <TerminalBlock command="ls -lh /mnt/backup/home/" output={`drwxr-xr-x 4 joao joao 4.0K Mar 24 03:00 2026-03-24_0300
drwxr-xr-x 4 joao joao 4.0K Mar 25 03:00 2026-03-25_0300
drwxr-xr-x 4 joao joao 4.0K Mar 26 03:00 2026-03-26_0300
lrwxrwxrwx 1 joao joao   38 Mar 26 03:00 latest -> /mnt/backup/home/2026-03-26_0300`} />

      <TerminalBlock
        comment="duplicado em disco? não — graças aos hard links"
        command={`du -sh /mnt/backup/home/2026-03-2{4,5,6}_0300`}
        output={`412G    /mnt/backup/home/2026-03-24_0300
 8.4G   /mnt/backup/home/2026-03-25_0300
 1.2G   /mnt/backup/home/2026-03-26_0300`}
      />

      <h3>1.2. Backup remoto via SSH</h3>

      <TerminalBlock
        command={`rsync -aHAX --delete --info=progress2 -e "ssh -i ~/.ssh/backup_ed25519" /home/ backup@nas.lan:/srv/backup/home/`}
      />

      <h2>2. borg — deduplicação cifrada (recomendado)</h2>

      <p>
        O <strong>BorgBackup</strong> faz deduplicação por bloco com compressão e
        criptografia AES-256. Resultado típico: 10 backups completos diários
        ocupando 1.1× o tamanho de um único.
      </p>

      <TerminalBlock command="sudo pacman -S borg" output={`Packages (1)  borg-1.4.0-1\nTotal Installed Size:  6.84 MiB`} />

      <TerminalBlock
        comment="1) inicializar o repositório (uma vez)"
        command="borg init --encryption=repokey-blake2 /mnt/backup/borg-repo"
        output={`Enter new passphrase: ********
Enter same passphrase again: ********
Do you want your passphrase to be displayed for verification? [yN]: n

By default repositories initialized with this version will produce security
errors if upgraded later and accessed with an old version that does not support
the upgrade.

IMPORTANT: you will need both KEY AND PASSPHRASE to access this repo!`}
      />

      <TerminalBlock
        comment="2) criar snapshot"
        command={`borg create --stats --progress \\
    --compression zstd,9 \\
    --exclude '/home/*/.cache' --exclude '/home/*/node_modules' \\
    /mnt/backup/borg-repo::'home-{now:%Y-%m-%dT%H:%M}' \\
    /home /etc`}
        output={`Enter passphrase for key /mnt/backup/borg-repo: ********

------------------------------------------------------------------------------
Repository: /mnt/backup/borg-repo
Archive name: home-2026-03-26T14:32
Archive fingerprint: 4f9c8e7d6b5a4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c
Time (start): Wed, 2026-03-26 14:32:18
Time (end):   Wed, 2026-03-26 15:08:42
Duration: 36 minutes 24.18 seconds
Number of files: 187432

                       Original size      Compressed size    Deduplicated size
This archive:              412.84 GB            187.41 GB              1.24 GB
All archives:                4.13 TB              1.87 TB             412.91 GB
                       Unique chunks         Total chunks
Chunk index:                  3,142,891           28,184,234
------------------------------------------------------------------------------`}
      />

      <TerminalBlock
        comment="3) listar snapshots"
        command="borg list /mnt/backup/borg-repo"
        output={`home-2026-03-20T03:00         Fri, 2026-03-20 03:00:14 [4f9c8e7d...]
home-2026-03-21T03:00         Sat, 2026-03-21 03:00:08 [a3b2c1d0...]
home-2026-03-22T03:00         Sun, 2026-03-22 03:00:11 [9e8d7c6b...]
home-2026-03-23T03:00         Mon, 2026-03-23 03:00:09 [5a4b3c2d...]
home-2026-03-24T03:00         Tue, 2026-03-24 03:00:12 [8b7a6c5d...]
home-2026-03-25T03:00         Wed, 2026-03-25 03:00:07 [2d1e0f9a...]
home-2026-03-26T14:32         Wed, 2026-03-26 14:32:18 [4f9c8e7d...]`}
      />

      <TerminalBlock
        comment="4) restaurar UM arquivo específico"
        command={`borg extract --progress /mnt/backup/borg-repo::home-2026-03-25T03:00 home/joao/Documents/contrato.pdf`}
      />

      <TerminalBlock
        comment="5) montar snapshot via FUSE (navegar como pasta)"
        command="borg mount /mnt/backup/borg-repo::home-2026-03-25T03:00 /mnt/borg-mount"
      />
      <TerminalBlock command="ls /mnt/borg-mount/home/joao" output="Documents  Downloads  Music  Pictures  Videos  ..." />
      <TerminalBlock command="borg umount /mnt/borg-mount" output="" />

      <TerminalBlock
        comment="6) política de retenção: mantém 7 diários, 4 semanais, 6 mensais"
        command={`borg prune -v --list \\
    --keep-daily 7 --keep-weekly 4 --keep-monthly 6 \\
    /mnt/backup/borg-repo`}
        output={`Keeping archive: home-2026-03-26T14:32 ...
Keeping archive: home-2026-03-25T03:00 ...
Pruning archive: home-2026-03-19T03:00 ...
Pruning archive: home-2026-03-18T03:00 ...
...`}
      />

      <h2>3. restic — alternativa moderna a borg</h2>

      <p>
        Mesma ideia do borg (dedup + cifrado), com binário Go estático e suporte
        nativo a backends remotos (S3, Backblaze B2, Wasabi, SFTP, REST).
      </p>

      <TerminalBlock command="sudo pacman -S restic" output="Packages (1)  restic-0.17.1-1" />

      <TerminalBlock
        command="restic init --repo /mnt/backup/restic-repo"
        output={`enter password for new repository: ********
enter password again: ********
created restic repository 7d8e9f0a1b at /mnt/backup/restic-repo

Please note that knowledge of your password is required to access
the repository. Losing your password means that your data is
irrecoverably lost.`}
      />

      <TerminalBlock
        command={`RESTIC_PASSWORD_FILE=~/.restic.pw restic -r /mnt/backup/restic-repo backup /home /etc \\
    --exclude='/home/*/.cache' --exclude='/home/*/node_modules'`}
        output={`open repository
repository 7d8e9f0a opened (version 2, compression level auto)
created new cache in /home/joao/.cache/restic
no parent snapshot found, will read all files

Files:       187432 new,     0 changed,     0 unmodified
Dirs:         18234 new,     0 changed,     0 unmodified
Added to the repository: 187.4 GiB (94.3 GiB stored)

processed 187432 files, 412.84 GiB in 38:12
snapshot a4b3c2d1 saved`}
      />

      <TerminalBlock
        command="restic -r /mnt/backup/restic-repo snapshots"
        output={`ID        Time                 Host         Tags        Paths
---------------------------------------------------------------
a4b3c2d1  2026-03-26 14:32:18  archlinux                /home /etc

1 snapshots`}
      />

      <TerminalBlock
        comment="restaurar"
        command="restic -r /mnt/backup/restic-repo restore a4b3c2d1 --target /tmp/restore"
        output={`restoring <Snapshot a4b3c2d1 of [/home /etc] at 2026-03-26 14:32:18 by joao@archlinux> to /tmp/restore`}
      />

      <h3>3.1. restic com backend S3</h3>

      <CodeBlock
        title="~/.restic.env"
        code={`export RESTIC_REPOSITORY="s3:s3.us-west-002.backblazeb2.com/meu-bucket/arch"
export RESTIC_PASSWORD_FILE=~/.restic.pw
export AWS_ACCESS_KEY_ID="K00xxxxxxxx"
export AWS_SECRET_ACCESS_KEY="K00yyyyyyyy"`}
      />

      <TerminalBlock command="source ~/.restic.env && restic backup /home" output="..." />

      <h2>4. tar — arquivo único portável</h2>

      <p>
        Quando o destino é "um arquivo .tar.gz que vou jogar no Drive", o tar é a
        opção mais universal. Sem deduplicação, sem cifragem nativa (use{" "}
        <code>gpg</code> em pipe), mas funciona em qualquer Linux/UNIX.
      </p>

      <TerminalBlock
        comment="full backup compactado com zstd"
        command={`sudo tar --zstd -cpf /mnt/backup/etc-$(date +%F).tar.zst -C / etc`}
      />

      <TerminalBlock command="ls -lh /mnt/backup/etc-2026-03-26.tar.zst" output="-rw-r--r-- 1 root root 4.2M Mar 26 15:42 /mnt/backup/etc-2026-03-26.tar.zst" />

      <TerminalBlock
        comment="incremental com --listed-incremental"
        command={`sudo tar --listed-incremental=/var/backups/home.snar -czf /mnt/backup/home-$(date +%F).tar.gz /home`}
      />

      <TerminalBlock
        comment="cifrado com gpg em pipe (sem tocar o disco em claro)"
        command={`sudo tar --zstd -cf - /etc | gpg -c --cipher-algo AES256 -o /mnt/backup/etc.tar.zst.gpg`}
      />

      <TerminalBlock
        comment="restaurar"
        command="sudo tar --zstd -xpf /mnt/backup/etc-2026-03-26.tar.zst -C /tmp/restore"
      />

      <h2>5. btrfs send/receive + snapper — snapshots no nível do FS</h2>

      <p>
        Se sua raiz for btrfs, snapshots são <em>instantâneos</em> e ocupam zero espaço
        inicial (CoW). O <strong>snapper</strong> automatiza criação e retenção; o
        <code>btrfs send</code> exporta um snapshot como stream para outro disco.
      </p>

      <TerminalBlock command="sudo pacman -S snapper snap-pac" output="Packages (2)  snapper-0.11.4-1  snap-pac-3.5.3-2" />

      <TerminalBlock
        comment="cria config para o subvolume montado em /"
        command="sudo snapper -c root create-config /"
        output=""
      />

      <TerminalBlock
        comment="snapshot manual"
        command={`sudo snapper -c root create --description "antes-do-pacman-Syu"`}
      />

      <TerminalBlock
        command="sudo snapper -c root list"
        output={`  # | Type   | Pre # | Date                            | User | Cleanup | Description                | Userdata
----+--------+-------+---------------------------------+------+---------+----------------------------+---------
 0  | single |       |                                 | root |         | current                    |
 1  | single |       | Wed Mar 26 03:00:14 2026 -03    | root | timeline| timeline                   |
 2  | pre    |       | Wed Mar 26 14:18:33 2026 -03    | root | number  | pacman -Syu                | important=yes
 3  | post   |     2 | Wed Mar 26 14:21:08 2026 -03    | root | number  |                            | important=yes
 4  | single |       | Wed Mar 26 15:00:01 2026 -03    | root |         | antes-do-pacman-Syu        |`}
      />

      <p>O <code>snap-pac</code> cria automaticamente um par <em>pre/post</em> a cada <code>pacman -Syu</code>.</p>

      <h3>5.1. Enviar snapshot para outro disco</h3>

      <TerminalBlock command="sudo btrfs subvolume snapshot -r / /.snapshots/snap-2026-03-26" output="Create a readonly snapshot of '/' in '/.snapshots/snap-2026-03-26'" />
      <TerminalBlock
        command={`sudo btrfs send /.snapshots/snap-2026-03-26 | sudo btrfs receive /mnt/backup/btrfs/`}
        output={`At subvol /.snapshots/snap-2026-03-26
At subvol snap-2026-03-26`}
      />

      <h2>6. Automatização — systemd timer</h2>

      <CodeBlock
        title="/etc/systemd/system/borg-backup.service"
        language="ini"
        code={`[Unit]
Description=Borg Backup do home
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
Environment=BORG_PASSCOMMAND=cat /root/.borg.pw
Environment=BORG_REPO=/mnt/backup/borg-repo
ExecStart=/usr/bin/borg create --compression zstd,9 \\
    --exclude '/home/*/.cache' \\
    ::'{hostname}-{now:%Y-%m-%dT%H:%M}' /home /etc
ExecStartPost=/usr/bin/borg prune -v \\
    --keep-daily 7 --keep-weekly 4 --keep-monthly 6
Nice=10
IOSchedulingClass=idle`}
      />

      <CodeBlock
        title="/etc/systemd/system/borg-backup.timer"
        language="ini"
        code={`[Unit]
Description=Borg Backup diário (03:00)

[Timer]
OnCalendar=*-*-* 03:00:00
RandomizedDelaySec=15min
Persistent=true

[Install]
WantedBy=timers.target`}
      />

      <TerminalBlock command="sudo systemctl enable --now borg-backup.timer" output="Created symlink /etc/systemd/system/timers.target.wants/borg-backup.timer ..." />
      <TerminalBlock command="systemctl list-timers borg-backup" output={`NEXT                        LEFT     LAST                        PASSED       UNIT                ACTIVATES
Thu 2026-03-27 03:11:42 -03 11h left Wed 2026-03-26 03:08:14 -03 12h ago      borg-backup.timer   borg-backup.service`} />

      <h2>7. Quadro comparativo</h2>

      <OutputBlock
        title="qual ferramenta para qual cenário"
        output={`ferramenta   dedup  cripto  snapshot  remoto       caso típico
-----------  -----  ------  --------  -----------  --------------------------------------------
rsync        não    não     hardlink  ssh          mirror simples + diários (--link-dest)
borg         sim    sim     sim       ssh          servidor próprio, retenção longa
restic       sim    sim     sim       S3,B2,SSH    cloud-friendly, S3/Backblaze
tar+gpg      não    sim     não       qualquer     arquivo único, off-site manual
snapper(btrfs) -    -       sim       send/receive Arch+btrfs, rollback de pacman -Syu`}
      />

      <AlertBox type="success" title="Configuração balanceada">
        Para um desktop Arch típico: <strong>snapper</strong> (rollback de pacman) +
        <strong> borg local diário</strong> via systemd timer + <strong>restic
        semanal off-site no Backblaze B2</strong>. Custo &lt; US$1/mês para 100 GB.
      </AlertBox>
    </PageContainer>
  );
}
