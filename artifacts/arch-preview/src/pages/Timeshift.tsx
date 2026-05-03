import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Timeshift() {
  return (
    <PageContainer
      title="Timeshift — snapshots e backup do sistema"
      subtitle="Crie pontos de restauração tipo 'Restauração do Sistema do Windows', mas usando rsync ou (melhor ainda) snapshots Btrfs com integração ao GRUB."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Storage"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Desktop, <code>sudo</code>. <code>timeshift</code> está no AUR (<code>yay -S timeshift</code>). <strong>Não é backup de dados pessoais</strong> — é snapshot do sistema!
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Timeshift</strong> — equivalente Linux do System Restore do Windows.
      </p>
      <p>
        <strong>rsync mode</strong> — funciona em qualquer filesystem.
      </p>
      <p>
        <strong>btrfs mode</strong> — usa snapshots nativos do Btrfs — instantâneo.
      </p>
      <p>
        <strong>snapper</strong> — alternativa nativa Btrfs (sem AUR), também muito usada no Arch.
      </p>

      <p>
        Atualizar um Arch é, na maior parte do tempo, indolor — até a vez em que um upgrade de
        kernel quebra o módulo da Wi-Fi, ou um <code>pacman -Syu</code> deixa o GNOME piscando.
        O <strong>Timeshift</strong> tira foto do <em>sistema</em> (não dos seus arquivos
        pessoais) em poucos segundos e permite reverter para qualquer snapshot anterior — até
        bootando de um pendrive live caso o sistema nem suba mais.
      </p>

      <AlertBox type="info" title="Timeshift ≠ backup de dados">
        Timeshift foi feito para salvar <strong>o sistema</strong>: <code>/etc</code>,{" "}
        <code>/usr</code>, <code>/var</code>, <code>/boot</code>… Por padrão ele{" "}
        <em>exclui</em> <code>/home</code> e <code>/root</code>. Para os seus documentos, fotos
        e código use <code>borg</code>, <code>restic</code>, <code>rsync</code> ou um serviço de
        nuvem. Os dois são complementares.
      </AlertBox>

      <h2>1. Instalação no Arch</h2>

      <p>
        O <code>timeshift</code> não está nos repositórios oficiais — ele vive na AUR. A forma
        mais limpa é com um helper como <code>yay</code> ou <code>paru</code>.
      </p>

      <TerminalBlock
        comment="usando yay (recomendado)"
        command="yay -S timeshift"
        output={`:: Resolving dependencies...
:: Calculating conflicts...
:: Calculating inner conflicts...

Aur (1) timeshift-24.06.1-1

:: Proceed with installation? [Y/n] y
:: Downloading PKGBUILDs...
==> Making package: timeshift 24.06.1-1
==> Checking source...
==> Extracting sources...
==> Starting build()...
==> Entering fakeroot environment...
==> Finished making: timeshift 24.06.1-1
:: Processing package changes...
(1/1) installing timeshift                         [######################] 100%`}
      />

      <TerminalBlock
        comment="alternativa: clone manual + makepkg"
        command={`git clone https://aur.archlinux.org/timeshift.git && cd timeshift && makepkg -si`}
      />

      <TerminalBlock
        command="timeshift --version"
        output={`Timeshift v24.06.1`}
      />

      <h2>2. Btrfs vs RSYNC — qual modo escolher</h2>

      <p>
        Timeshift suporta dois <em>backends</em> totalmente distintos. A escolha depende do
        sistema de arquivos onde está montado o <code>/</code>.
      </p>

      <OutputBlock
        title="comparação rápida"
        output={`┌──────────────────────────┬───────────────────────┬───────────────────────┐
│ característica           │ BTRFS                 │ RSYNC                 │
├──────────────────────────┼───────────────────────┼───────────────────────┤
│ requer FS Btrfs          │ sim                   │ não (qualquer FS)     │
│ tempo do snapshot        │ < 1 segundo           │ minutos (1ª vez)      │
│ uso de espaço inicial    │ ~zero (CoW)           │ tamanho real          │
│ snapshots incrementais   │ por blocos (CoW)      │ por arquivo (hardlink)│
│ destino                  │ mesmo disco           │ qualquer partição     │
│ boot via GRUB do snap    │ sim (grub-btrfs)      │ não                   │
│ resgate offline          │ btrfs subvolume snap  │ rsync reverso         │
└──────────────────────────┴───────────────────────┴───────────────────────┘`}
      />

      <TerminalBlock
        comment="descobrir qual FS tem o /"
        command="findmnt -no FSTYPE /"
        output="btrfs"
      />

      <AlertBox type="warning" title="Para Btrfs funcionar com Timeshift">
        O sistema precisa estar instalado no layout Ubuntu-style de subvolumes:{" "}
        <code>@</code> para a raiz e <code>@home</code> para <code>/home</code>. Se você
        instalou o Arch manualmente sem esses nomes, ou usou um layout customizado, o backend
        Btrfs vai recusar e você precisa cair no modo RSYNC (que funciona em qualquer FS).
        Confira com <code>sudo btrfs subvolume list /</code>.
      </AlertBox>

      <TerminalBlock
        command="sudo btrfs subvolume list /"
        output={`ID 256 gen 142 top level 5 path @
ID 257 gen 138 top level 5 path @home
ID 258 gen 121 top level 5 path @log
ID 259 gen 120 top level 5 path @pkg`}
      />

      <h2>3. Wizard inicial (modo gráfico)</h2>

      <p>
        Rodar <code>sudo timeshift-gtk</code> abre uma janela em 5 passos. Mesmo que você
        prefira CLI, vale passar pelo wizard uma vez para entender o fluxo.
      </p>

      <OutputBlock
        title="passos do setup wizard"
        output={`1. Snapshot Type    →  BTRFS  ou  RSYNC
2. Snapshot Location →  partição que vai guardar (BTRFS = a própria /)
3. Schedule          →  Hourly / Daily / Weekly / Monthly / Boot
4. User Home         →  Exclude All  /  Include Hidden  /  Include All
5. Resumo            →  confirma e cria o primeiro snapshot`}
      />

      <AlertBox type="danger" title='Não marque "Include All" para o /home'>
        Se você incluir o <code>/home</code> inteiro e tiver 80 GB de fotos/vídeos, cada
        snapshot RSYNC precisa de espaço para diferenças, e qualquer reversão vai{" "}
        <strong>desfazer suas edições recentes em documentos</strong>. Mantenha
        <code> /home</code> excluído (default) e use uma ferramenta de backup separada para
        seus arquivos.
      </AlertBox>

      <h2>4. Configuração via CLI</h2>

      <p>
        O Timeshift guarda toda a configuração em <code>/etc/timeshift/timeshift.json</code>.
        Você pode editar à mão, mas a forma idiomática é a CLI.
      </p>

      <TerminalBlock
        comment="iniciar configuração no modo Btrfs"
        command="sudo timeshift --btrfs"
        output={`First run mode (config file not found)
Selected default snapshot type: BTRFS
Mounted '/dev/nvme0n1p2' at '/run/timeshift/12345/backup'
Setup complete.`}
      />

      <TerminalBlock
        comment="ou modo rsync, apontando para outro disco"
        command="sudo timeshift --rsync --snapshot-device /dev/sda1"
      />

      <TerminalBlock
        comment="ver configuração atual"
        command="sudo cat /etc/timeshift/timeshift.json"
        output={`{
  "backup_device_uuid" : "f1c2-…",
  "parent_device_uuid" : "",
  "do_first_run" : "false",
  "btrfs_mode" : "true",
  "include_btrfs_home_for_backup" : "false",
  "stop_cron_emails" : "true",
  "schedule_monthly" : "false",
  "schedule_weekly" : "true",
  "schedule_daily" : "true",
  "schedule_hourly" : "false",
  "schedule_boot" : "true",
  "count_monthly" : "2",
  "count_weekly" : "3",
  "count_daily" : "5",
  "count_hourly" : "6",
  "count_boot" : "5",
  "exclude" : [
    "/home/*/**",
    "/root/**"
  ]
}`}
      />

      <h3>4.1. Agendamento (cron interno do Timeshift)</h3>

      <p>
        Marcar <em>schedule_daily=true</em> não cria entrada no <code>crontab</code> do
        usuário — o Timeshift instala um job em <code>/etc/cron.d/timeshift-hourly</code> que
        roda a cada hora e decide internamente se algum snapshot deve ser tirado.
      </p>

      <TerminalBlock
        command="cat /etc/cron.d/timeshift-hourly"
        output={`SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
0 * * * * root timeshift --check --scripted`}
      />

      <h3>4.2. Política de retenção</h3>

      <OutputBlock
        title="quantas cópias manter de cada nível"
        output={`schedule_hourly  count_hourly = 6     ←  últimas 6 horas
schedule_daily   count_daily  = 5     ←  últimos 5 dias
schedule_weekly  count_weekly = 3     ←  últimas 3 semanas
schedule_monthly count_monthly = 2    ←  últimos 2 meses
schedule_boot    count_boot   = 5     ←  últimos 5 boots`}
      />

      <h2>5. Criando, listando e deletando snapshots</h2>

      <TerminalBlock
        comment="snapshot manual com comentário"
        command={`sudo timeshift --create --comments "antes de upgrade do kernel" --tags D`}
        output={`First run mode (config file found)
Estimating system size...
Creating new snapshot...(BTRFS)
Saving to device: /dev/nvme0n1p2, mounted at path: /run/timeshift/12345/backup
Created control file: /run/timeshift/12345/backup/timeshift-btrfs/snapshots/2026-03-26_18-42-11/info.json
Btrfs Snapshot saved successfully (2s)
Tagged snapshot '2026-03-26_18-42-11': ondemand,daily`}
      />

      <TerminalBlock
        command="sudo timeshift --list"
        output={`Device : /dev/nvme0n1p2
UUID   : f1c2-…
Path   : /run/timeshift/12345/backup
Mode   : BTRFS
Device is OK
6 snapshots, 38.4 GB free

Num     Name                 Tag  Description
─────────────────────────────────────────────────────────────────────
 0    > 2026-03-26_18-42-11  O D  antes de upgrade do kernel
 1      2026-03-26_03-00-00    D
 2      2026-03-25_03-00-00    D
 3      2026-03-22_03-00-00  W
 4      2026-03-15_03-00-00  W
 5      2026-03-08_03-00-00  W M
─────────────────────────────────────────────────────────────────────
Tags: O=On-demand D=Daily W=Weekly M=Monthly H=Hourly B=Boot`}
      />

      <TerminalBlock
        comment="apagar um snapshot específico"
        command="sudo timeshift --delete --snapshot '2026-03-22_03-00-00'"
        output={`Deleting snapshot: 2026-03-22_03-00-00
Deleted snapshot: 2026-03-22_03-00-00`}
      />

      <TerminalBlock
        comment="apagar TODOS (use com cuidado)"
        command="sudo timeshift --delete-all"
      />

      <CommandFlagList
        command="timeshift"
        items={[
          { flag: "--list", description: "Lista todos os snapshots existentes com tags." },
          { flag: "--create", description: "Cria um snapshot 'on-demand'.", example: "sudo timeshift --create --comments 'pre-upgrade'" },
          { flag: "--restore", description: "Restaura um snapshot. Se não passar --snapshot, abre menu interativo." },
          { flag: "--snapshot NOME", description: "Identifica o snapshot por nome (ex: 2026-03-26_18-42-11).", example: "--snapshot '2026-03-26_18-42-11'" },
          { flag: "--delete", description: "Apaga um snapshot específico (use junto com --snapshot)." },
          { flag: "--delete-all", description: "Apaga TODOS os snapshots — irreversível." },
          { flag: "--check", description: "Roda a verificação periódica (escolhe se cria ou não com base no schedule)." },
          { flag: "--btrfs / --rsync", description: "Define/altera o backend." },
          { flag: "--tags T", description: "Marca o snapshot com tag(s): O,D,W,M,B (on-demand, daily, weekly, monthly, boot).", example: "--tags OD" },
          { flag: "--scripted", description: "Modo silencioso (não abre prompts). Usado pelos jobs cron." },
          { flag: "--snapshot-device DEV", description: "Dispositivo de destino (ex: /dev/sdb1)." },
          { flag: "--target DEV", description: "Dispositivo onde restaurar (em RSYNC). Usado em modo offline a partir do live USB." },
          { flag: "--comments TEXT", description: "Anota o motivo do snapshot." },
        ]}
      />

      <h2>6. Restauração (modo online — sistema rodando)</h2>

      <p>
        Cenário: você fez <code>pacman -Syu</code>, rebootou, e o GNOME entra em loop de
        login. Você consegue chegar a um TTY (Ctrl+Alt+F2) e logar.
      </p>

      <TerminalBlock
        command="sudo timeshift --list"
        output={`Num     Name                 Tag  Description
 0      2026-03-26_18-42-11  O D  antes de upgrade do kernel
 1      2026-03-26_03-00-00    D
 2      2026-03-25_03-00-00    D`}
      />

      <TerminalBlock
        command="sudo timeshift --restore --snapshot '2026-03-26_18-42-11'"
        output={`To restore with default options, press the ENTER key for all prompts!

Select target device:
1) /dev/nvme0n1p2 (btrfs) — current root
Enter device number (a=abort): 1

Restore from snapshot: 2026-03-26_18-42-11
Mode: BTRFS
The target device will be rolled back to the state of this snapshot.

Continue with restore? (y/n): y

Renaming current subvolume:
  /run/timeshift/.../@           ->  /run/timeshift/.../@_2026-03-26_19-01-22
Cloning snapshot subvolume:
  snapshots/2026-03-26_18-42-11/@  ->  /run/timeshift/.../@
Restore completed successfully.
Please reboot to apply the changes.`}
      />

      <TerminalBlock command="sudo reboot" />

      <AlertBox type="success" title="O que aconteceu por baixo (modo Btrfs)">
        Em vez de copiar arquivos, o Timeshift apenas <em>renomeia subvolumes</em>: o seu{" "}
        <code>@</code> atual vira <code>@_2026-03-26_19-01-22</code> (preservado!) e o
        snapshot escolhido vira o novo <code>@</code>. Reverter a reversão é trivial — basta
        restaurar o subvolume renomeado. Por isso é tão rápido.
      </AlertBox>

      <h2>7. Restauração offline — bootando de um live USB</h2>

      <p>
        E se o sistema nem chega no TTY? Boote pelo ISO oficial do Arch, conecte-se à rede e
        instale o timeshift no live:
      </p>

      <TerminalBlock
        command="pacman -Sy && pacman -S --needed git base-devel"
      />

      <TerminalBlock
        command={`useradd -m build && su - build -c "git clone https://aur.archlinux.org/timeshift.git && cd timeshift && makepkg -s"`}
      />

      <TerminalBlock
        command="pacman -U /home/build/timeshift/timeshift-*.pkg.tar.zst"
      />

      <TerminalBlock
        comment="abre o GTK em cima do live; escolhe o disco de destino"
        command="timeshift-gtk"
      />

      <p>
        Selecione o snapshot, escolha como dispositivo de destino o seu disco real (ex.
        <code> /dev/nvme0n1p2</code>), e o Timeshift faz o restore. Reboot e o sistema volta
        ao estado anterior.
      </p>

      <h2>8. Exclusões — afinando o que entra no snapshot</h2>

      <p>
        Por padrão o Timeshift já exclui caches, lixeiras e <code>/home/*</code>. Para regras
        próprias, edite o JSON ou use a aba <em>Filters</em> da UI.
      </p>

      <CodeBlock
        title="trecho de /etc/timeshift/timeshift.json"
        code={`"exclude" : [
  "/home/*/**",
  "/root/**",
  "/var/cache/pacman/pkg/**",
  "/var/log/journal/**",
  "/var/lib/docker/**",
  "/srv/www/**",
  "+ /home/joao/.config/**"
]`}
      />

      <p>
        Linhas com <code>+ </code> no início são <strong>inclusões</strong> (override) — útil
        para preservar dotfiles importantes mesmo quando o resto do <code>/home</code> está
        excluído. A ordem importa: regras mais específicas primeiro.
      </p>

      <h2>9. Integração com GRUB — bootar dentro de um snapshot</h2>

      <p>
        Aqui mora a magia da combinação <strong>Btrfs + Timeshift + grub-btrfs</strong>: cada
        snapshot vira uma entrada bootável no menu do GRUB. Se um upgrade quebrou tudo, basta
        escolher um snapshot anterior na inicialização — sem live USB.
      </p>

      <TerminalBlock
        command="yay -S grub-btrfs"
      />

      <TerminalBlock
        comment="ative o serviço que regenera o menu sempre que houver snapshot novo"
        command="sudo systemctl enable --now grub-btrfsd.service"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/grub-btrfsd.service → /usr/lib/systemd/system/grub-btrfsd.service.`}
      />

      <TerminalBlock
        comment="regenera o grub.cfg incluindo a entrada 'Arch Linux snapshots'"
        command="sudo grub-mkconfig -o /boot/grub/grub.cfg"
        output={`Generating grub configuration file ...
Found theme: /boot/grub/themes/arch/theme.txt
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/initramfs-linux.img
Found Btrfs snapshot: 2026-03-26_18-42-11
Found Btrfs snapshot: 2026-03-26_03-00-00
Found Btrfs snapshot: 2026-03-25_03-00-00
done`}
      />

      <OutputBlock
        title="menu GRUB após instalar grub-btrfs"
        output={`Arch Linux
Arch Linux (fallback initramfs)
Arch Linux snapshots  ▶
   ├─ 2026-03-26 18:42:11  (ondemand: antes de upgrade do kernel)
   ├─ 2026-03-26 03:00:00  (daily)
   ├─ 2026-03-25 03:00:00  (daily)
   └─ 2026-03-22 03:00:00  (weekly)
UEFI Firmware Settings`}
      />

      <AlertBox type="warning" title="Snapshot bootado é read-only">
        Quando você boota dentro de um snapshot via GRUB, o sistema sobe em modo
        <em> somente-leitura</em>. É proposital — garante que o snapshot original não seja
        alterado. Para virar o sistema atual de verdade, abra um terminal e rode{" "}
        <code>sudo timeshift --restore --snapshot '...'</code>.
      </AlertBox>

      <h2>10. Snapshot automático antes de cada pacman -Syu</h2>

      <p>
        Combinando com o pacote <code>timeshift-autosnap</code> (AUR), todo upgrade do pacman
        dispara um snapshot ondemand <em>antes</em> de tocar em qualquer arquivo.
      </p>

      <TerminalBlock command="yay -S timeshift-autosnap" />

      <TerminalBlock
        command="cat /etc/pacman.d/hooks/50-timeshift.hook"
        output={`[Trigger]
Operation = Upgrade
Operation = Install
Operation = Remove
Type = Package
Target = *

[Action]
Description = Creating Timeshift snapshot before pacman transaction
When = PreTransaction
Exec = /usr/bin/timeshift-autosnap
Depends = timeshift`}
      />

      <TerminalBlock
        comment="upgrade dispara o hook automaticamente"
        command="sudo pacman -Syu"
        output={`:: Synchronizing package databases...
:: Starting full system upgrade...
resolving dependencies...

Packages (3) linux-6.12.3-1  linux-headers-6.12.3-1  systemd-256.5-2

:: Proceed with installation? [Y/n] y
(running pre-transaction hooks)
:: Creating Timeshift snapshot before pacman transaction
==> Snapshot created: 2026-03-26_19-12-04 [autosnap]
:: Processing package changes...
upgrading linux                                    [######################] 100%
upgrading linux-headers                            [######################] 100%
upgrading systemd                                  [######################] 100%`}
      />

      <h2>11. Troubleshooting</h2>

      <TerminalBlock
        comment="erro: 'BTRFS device not found' mesmo com / em Btrfs"
        command="sudo timeshift --create"
        exitCode={1}
        output={`E: System Btrfs subvolume layout is not supported.
Required layout: subvolumes named '@' and '@home'.`}
      />

      <p>
        Solução: ou re-instale com o layout esperado, ou use <code>--rsync</code>.
      </p>

      <TerminalBlock
        comment="ver onde o Timeshift está montando o destino"
        command="findmnt | grep timeshift"
        output={`/run/timeshift/12345/backup  /dev/nvme0n1p2  btrfs   rw,subvolid=5,subvol=/`}
      />

      <TerminalBlock
        comment="snapshot ocupando muito espaço? lista por tamanho real (Btrfs)"
        command="sudo btrfs filesystem du -s /run/timeshift/*/backup/timeshift-btrfs/snapshots/*"
        output={`     Total   Exclusive  Set shared  Filename
   12.4GiB     142MiB      11.8GiB  .../snapshots/2026-03-26_18-42-11
   12.3GiB      89MiB      11.8GiB  .../snapshots/2026-03-26_03-00-00`}
      />

      <p>
        A coluna <em>Exclusive</em> é o que será liberado se você apagar o snapshot — o
        <em> Set shared</em> continua referenciado por outros.
      </p>

      <TerminalBlock
        comment="verificar saúde geral"
        command="sudo timeshift --check"
        output={`Mounted '/dev/nvme0n1p2' at '/run/timeshift/12345/backup'
Maintenance mode: Daily
Snapshot count: 6
Latest: 2026-03-26_18-42-11 (3h ago)
OK`}
      />

      <h2>12. Resumo prático</h2>

      <OutputBlock
        title="colinha Timeshift no Arch"
        output={`# instalação
yay -S timeshift grub-btrfs timeshift-autosnap

# primeira config (Btrfs)
sudo timeshift --btrfs

# snapshot manual
sudo timeshift --create --comments 'pre-tweak' --tags O

# listar / restaurar / apagar
sudo timeshift --list
sudo timeshift --restore --snapshot '2026-03-26_18-42-11'
sudo timeshift --delete --snapshot '2026-03-22_03-00-00'

# integração com GRUB
sudo systemctl enable --now grub-btrfsd
sudo grub-mkconfig -o /boot/grub/grub.cfg

# resgate offline (do live USB)
pacman -Sy && pacman -S --needed git base-devel
git clone https://aur.archlinux.org/timeshift.git
cd timeshift && makepkg -si
timeshift-gtk   # selecione disco e snapshot`}
      />
    </PageContainer>
  );
}
