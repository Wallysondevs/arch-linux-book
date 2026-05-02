import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LVM() {
  return (
    <PageContainer
      title="LVM — Logical Volume Manager"
      subtitle="PV → VG → LV: a abstração que permite redimensionar volumes ao vivo, criar snapshots e somar discos. Tudo com o pacote lvm2 do Arch."
      difficulty="avancado"
      timeToRead="35 min"
      category="Storage"
    >
      <p>
        O <strong>LVM</strong> insere uma camada entre as partições físicas e os
        filesystems. Em vez de fixar "esta partição tem 200G", você cria volumes
        lógicos que crescem, encolhem, viajam entre discos e tiram snapshots — sem
        desmontar. No Arch tudo vem no pacote <code>lvm2</code>.
      </p>

      <OutputBlock
        title="o vocabulário do LVM"
        output={`PV  Physical Volume    partição (ou disco inteiro) marcada para o LVM
VG  Volume Group       "pool" formado por 1+ PVs — onde o espaço fica disponível
LV  Logical Volume     o "device" que você formata e monta (/dev/VG/LV)
PE  Physical Extent    bloco fixo (default 4 MiB) — unidade interna do LVM
LE  Logical Extent     contraparte lógica do PE no LV`}
      />

      <h2>1. Instalação e ativação</h2>

      <TerminalBlock command="sudo pacman -S lvm2" output={`Packages (1)  lvm2-2.03.27-1\nTotal Installed Size:  4.21 MiB\n:: Proceed with installation? [Y/n]`} />

      <TerminalBlock
        comment="o serviço é ativado por udev — não precisa enable, mas confira:"
        command="systemctl status lvm2-monitor"
        output={`{g}● lvm2-monitor.service{/} - Monitoring of LVM2 mirrors, snapshots etc. using dmeventd or progress polling
     Loaded: loaded (/usr/lib/systemd/system/lvm2-monitor.service; enabled; preset: enabled)
     Active: {g}active (exited){/} since Wed 2026-03-26 08:03:14 -03; 6h ago`}
      />

      <h2>2. Criando do zero — PV → VG → LV</h2>

      <h3>2.1. Marcar duas partições como Physical Volumes</h3>

      <TerminalBlock command="sudo pvcreate /dev/sdb1 /dev/sdc1" output={`  Physical volume "/dev/sdb1" successfully created.\n  Physical volume "/dev/sdc1" successfully created.`} />

      <TerminalBlock
        command="sudo pvs"
        output={`  PV         VG     Fmt  Attr PSize  PFree
  /dev/sdb1         lvm2 ---  1.82t 1.82t
  /dev/sdc1         lvm2 ---  1.82t 1.82t`}
      />

      <TerminalBlock
        command="sudo pvdisplay /dev/sdb1"
        output={`  "/dev/sdb1" is a new physical volume of "1.82 TiB"
  --- NEW Physical volume ---
  PV Name               /dev/sdb1
  VG Name
  PV Size               1.82 TiB
  Allocatable           NO
  PE Size               0
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               aBCdef-12Gh-Ijkl-MnoP-qrSt-uvWx-yz0123`}
      />

      <h3>2.2. Agrupar em um Volume Group</h3>

      <TerminalBlock command="sudo vgcreate dados /dev/sdb1 /dev/sdc1" output={`  Volume group "dados" successfully created`} />

      <TerminalBlock
        command="sudo vgs"
        output={`  VG    #PV #LV #SN Attr   VSize VFree
  dados   2   0   0 wz--n- 3.64t 3.64t`}
      />

      <TerminalBlock
        command="sudo vgdisplay dados"
        output={`  --- Volume group ---
  VG Name               dados
  System ID
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  1
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                0
  Open LV               0
  Max PV                0
  Cur PV                2
  Act PV                2
  VG Size               3.64 TiB
  PE Size               4.00 MiB
  Total PE              954310
  Alloc PE / Size       0 / 0
  Free  PE / Size       954310 / 3.64 TiB
  VG UUID               XYZ123-abcd-EFGH-ijkl-MNOP-qrst-UVWXYZ`}
      />

      <h3>2.3. Cortar Logical Volumes</h3>

      <TerminalBlock command="sudo lvcreate -L 500G -n filmes dados" output={`  Logical volume "filmes" created.`} />
      <TerminalBlock command="sudo lvcreate -L 200G -n musica dados" output={`  Logical volume "musica" created.`} />
      <TerminalBlock command="sudo lvcreate -l 100%FREE -n geral dados" output={`  Logical volume "geral" created.`} />

      <TerminalBlock
        command="sudo lvs"
        output={`  LV     VG     Attr       LSize    Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  filmes dados  -wi-a-----  500.00g
  musica dados  -wi-a-----  200.00g
  geral  dados  -wi-a-----    2.95t`}
      />

      <TerminalBlock command="ls -l /dev/dados/" output={`lrwxrwxrwx 1 root root 7 Mar 26 14:32 filmes -> ../dm-0\nlrwxrwxrwx 1 root root 7 Mar 26 14:32 geral -> ../dm-2\nlrwxrwxrwx 1 root root 7 Mar 26 14:32 musica -> ../dm-1`} />

      <h3>2.4. Formatar e montar</h3>

      <TerminalBlock command="sudo mkfs.ext4 /dev/dados/filmes" output="Creating filesystem with 131072000 4k blocks ...\ndone" />
      <TerminalBlock command={`sudo mkdir /mnt/filmes && sudo mount /dev/dados/filmes /mnt/filmes`} output="" />

      <CodeBlock
        title="/etc/fstab"
        language="ini"
        code={`/dev/dados/filmes  /mnt/filmes  ext4  defaults  0  2
/dev/dados/musica  /mnt/musica  ext4  defaults  0  2
/dev/dados/geral   /mnt/geral   ext4  defaults  0  2`}
      />

      <h2>3. Cheatsheet — pvX, vgX, lvX</h2>

      <CommandFlagList
        command="LVM"
        items={[
          { flag: "pvcreate / pvs / pvdisplay / pvremove", description: "Cria, lista e remove Physical Volumes." },
          { flag: "vgcreate VG PV...", description: "Cria Volume Group somando PVs.", example: "sudo vgcreate dados /dev/sdb1 /dev/sdc1" },
          { flag: "vgextend VG NOVO_PV", description: "Adiciona PV a um VG existente.", example: "sudo vgextend dados /dev/sdd1" },
          { flag: "vgreduce VG PV", description: "Remove PV (precisa antes pvmove dos extents)." },
          { flag: "vgs / vgdisplay", description: "Status / detalhes dos VGs." },
          { flag: "lvcreate -L SIZE -n NOME VG", description: "Cria LV de tamanho fixo.", example: "lvcreate -L 50G -n root sistema" },
          { flag: "lvcreate -l 100%FREE -n NOME VG", description: "Cria LV usando todo espaço livre." },
          { flag: "lvextend -L +N -r LV", description: "Aumenta LV E o filesystem em uma chamada (-r faz resize2fs/xfs_growfs).", example: "lvextend -L +20G -r /dev/dados/filmes" },
          { flag: "lvreduce -L -N -r LV", description: "Reduz LV (CUIDADO: shrink só ext4/btrfs/xfs com cuidados especiais)." },
          { flag: "lvremove /dev/VG/LV", description: "Remove LV (apaga conteúdo)." },
          { flag: "lvconvert", description: "Converte: linear → mirror, snapshot → merge, etc." },
          { flag: "pvmove /dev/sdX1 [/dev/sdY1]", description: "Move extents de um PV para outro online (ex: trocar HD)." },
        ]}
      />

      <h2>4. Crescer um LV ao vivo</h2>

      <p>
        A vantagem clássica: ampliar volume sem desmontar. Aqui crescemos
        <code>/mnt/filmes</code> em 100 GiB:
      </p>

      <TerminalBlock
        comment="aumenta LV E o filesystem em uma só linha"
        command="sudo lvextend -L +100G -r /dev/dados/filmes"
        output={`  Size of logical volume dados/filmes changed from 500.00 GiB (128000 extents) to 600.00 GiB (153600 extents).
  Logical volume dados/filmes successfully resized.
resize2fs 1.47.0 (5-Feb-2023)
Filesystem at /dev/mapper/dados-filmes is mounted on /mnt/filmes; on-line resizing required
old_desc_blocks = 63, new_desc_blocks = 75
The filesystem on /dev/mapper/dados-filmes is now 157286400 (4k) blocks long.`}
      />

      <TerminalBlock command="df -h /mnt/filmes" output={`Filesystem                Size  Used Avail Use% Mounted on
/dev/mapper/dados-filmes  590G  142G  423G  26% /mnt/filmes`} />

      <h2>5. Adicionar disco novo ao VG</h2>

      <TerminalBlock command="sudo pvcreate /dev/sdd1" output={`  Physical volume "/dev/sdd1" successfully created.`} />
      <TerminalBlock command="sudo vgextend dados /dev/sdd1" output={`  Volume group "dados" successfully extended`} />
      <TerminalBlock
        command="sudo vgs dados"
        output={`  VG    #PV #LV #SN Attr   VSize VFree
  dados   3   3   0 wz--n- 5.46t 1.82t`}
      />

      <h2>6. Snapshots — cópia point-in-time</h2>

      <p>
        Um snapshot LVM é um LV especial que guarda apenas as <em>diferenças</em> em
        relação ao volume original (copy-on-write). Excelente para fazer backup
        consistente sem parar o serviço:
      </p>

      <TerminalBlock
        comment="cria snapshot read-only de 50G (espaço para alterações enquanto o snap viver)"
        command="sudo lvcreate -L 50G -s -n filmes-snap /dev/dados/filmes"
        output={`  Logical volume "filmes-snap" created.`}
      />

      <TerminalBlock
        command="sudo lvs"
        output={`  LV          VG    Attr       LSize  Pool Origin Data%  Meta%  Move Log Cpy%Sync
  filmes      dados owi-aos--- 600.00g
  filmes-snap dados swi-a-s---  50.00g      filmes 0.04
  geral       dados -wi-a-----   2.95t
  musica      dados -wi-a----- 200.00g`}
      />

      <TerminalBlock
        comment="monta o snap em outro lugar — backup tranquilo"
        command={`sudo mount -o ro /dev/dados/filmes-snap /mnt/snap && rsync -aH /mnt/snap/ /backup/filmes/`}
      />

      <TerminalBlock
        comment="terminou o backup — descarta o snapshot"
        command="sudo umount /mnt/snap && sudo lvremove -f /dev/dados/filmes-snap"
        output={`  Logical volume "filmes-snap" successfully removed`}
      />

      <AlertBox type="warning" title="Snapshot enche → original morre">
        Se o snap LVM clássico encher (Data% chega a 100%), ele é invalidado e
        REMOVIDO automaticamente. Dimensione o tamanho do snap proporcional a quanto
        de I/O você espera durante a vida dele. Para uso contínuo, considere{" "}
        <strong>thin provisioning</strong> com <code>lvcreate --type thin-pool</code>{" "}
        e snapshots thin (que crescem sob demanda).
      </AlertBox>

      <h2>7. Trocar HD ao vivo com pvmove</h2>

      <TerminalBlock
        comment="passo 1: adicione o novo disco e crie PV"
        command="sudo pvcreate /dev/sde1 && sudo vgextend dados /dev/sde1"
        output={`  Physical volume "/dev/sde1" successfully created.
  Volume group "dados" successfully extended`}
      />

      <TerminalBlock
        comment="passo 2: move tudo do disco velho para o novo (online)"
        command="sudo pvmove /dev/sdb1 /dev/sde1"
        output={`  /dev/sdb1: Moved: 0.00%
  /dev/sdb1: Moved: 12.34%
  /dev/sdb1: Moved: 35.12%
  /dev/sdb1: Moved: 78.41%
  /dev/sdb1: Moved: 100.00%`}
      />

      <TerminalBlock
        comment="passo 3: tira o velho do VG"
        command="sudo vgreduce dados /dev/sdb1 && sudo pvremove /dev/sdb1"
        output={`  Removed "/dev/sdb1" from volume group "dados"
  Labels on physical volume "/dev/sdb1" successfully wiped.`}
      />

      <h2>8. LVM em cima de LUKS (criptografia full-disk + flexibilidade)</h2>

      <p>
        Padrão "LUKS-on-LVM-on-LUKS" no Arch:
        partição → <code>cryptsetup luksFormat</code> → <code>pvcreate</code>{" "}
        no <code>/dev/mapper/cryptlvm</code> → VG → LVs (root, swap, home).
      </p>

      <TerminalBlock command="sudo cryptsetup luksFormat /dev/nvme0n1p2" output="..." />
      <TerminalBlock command="sudo cryptsetup open /dev/nvme0n1p2 cryptlvm" output="" />
      <TerminalBlock command="sudo pvcreate /dev/mapper/cryptlvm" output={`  Physical volume "/dev/mapper/cryptlvm" successfully created.`} />
      <TerminalBlock command="sudo vgcreate sistema /dev/mapper/cryptlvm" output={`  Volume group "sistema" successfully created`} />
      <TerminalBlock command="sudo lvcreate -L 8G  -n swap sistema" output="" />
      <TerminalBlock command="sudo lvcreate -L 80G -n root sistema" output="" />
      <TerminalBlock command="sudo lvcreate -l 100%FREE -n home sistema" output="" />

      <TerminalBlock command="sudo mkfs.ext4 /dev/sistema/root" output="" />
      <TerminalBlock command="sudo mkfs.ext4 /dev/sistema/home" output="" />
      <TerminalBlock command="sudo mkswap /dev/sistema/swap" output="" />

      <AlertBox type="info" title="HOOKS do mkinitcpio para LVM+LUKS">
        Em <code>/etc/mkinitcpio.conf</code>, ordem importa: <code>encrypt</code> precisa vir
        antes de <code>lvm2</code>, e <code>lvm2</code> antes de <code>filesystems</code>:
        <br />
        <code>HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block encrypt lvm2 filesystems fsck)</code>
        <br />
        Depois rode <code>mkinitcpio -P</code>.
      </AlertBox>

      <h2>9. Diagnóstico</h2>

      <TerminalBlock
        command="sudo lvs -o +devices,lv_health_status"
        output={`  LV          VG    Attr       LSize  Pool Origin Data% Devices       Health
  filmes      dados -wi-ao---- 600.00g                  /dev/sde1(0)
  geral       dados -wi-ao---- 2.95t                    /dev/sdc1(0)
  musica      dados -wi-ao---- 200.00g                  /dev/sde1(128000)`}
      />

      <TerminalBlock command="sudo dmsetup info" output={`Name:              dados-filmes
State:             ACTIVE
Read Ahead:        256
Tables present:    LIVE
Open count:        1
Event number:      0
Major, minor:      254, 0
Number of targets: 1
UUID: LVM-XYZ123abcd...`} />

      <h2>10. Cola</h2>

      <OutputBlock
        title="ciclo completo"
        output={`# criar
sudo pvcreate /dev/sdb1 /dev/sdc1
sudo vgcreate dados /dev/sdb1 /dev/sdc1
sudo lvcreate -L 500G -n filmes dados
sudo mkfs.ext4 /dev/dados/filmes
sudo mount /dev/dados/filmes /mnt/filmes

# crescer
sudo lvextend -L +100G -r /dev/dados/filmes

# snapshot pra backup
sudo lvcreate -L 50G -s -n snap /dev/dados/filmes
sudo mount -o ro /dev/dados/snap /mnt/snap
rsync -aH /mnt/snap/ /backup/
sudo umount /mnt/snap && sudo lvremove -f /dev/dados/snap

# substituir HD
sudo pvcreate /dev/sde1 && sudo vgextend dados /dev/sde1
sudo pvmove /dev/sdb1 /dev/sde1
sudo vgreduce dados /dev/sdb1 && sudo pvremove /dev/sdb1`}
      />
    </PageContainer>
  );
}
