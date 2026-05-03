import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Instalacao() {
  return (
    <PageContainer
      title="Guia de Instalação Completo"
      subtitle="Da ISO ao primeiro login — instalação manual passo-a-passo, com a saída real de cada comando."
      difficulty="intermediario"
      timeToRead="60 min"
      category="Instalação"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Pendrive USB (mínimo 4 GB), conexão de rede, máquina x86_64. Backup do que importa antes!
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>ISO</strong> — imagem do instalador Arch — só CLI, sem GUI. Baixe em archlinux.org.
      </p>
      <p>
        <strong>archinstall</strong> — script Python interativo que automatiza a instalação (vem na ISO desde 2021).
      </p>
      <p>
        <strong>chroot</strong> — mudar a raiz para <code>/mnt</code> e configurar como se já estivesse no sistema novo.
      </p>
      <p>
        <strong>mkinitcpio</strong> — gera o initramfs final.
      </p>
      <p>
        <strong>Bootloader</strong> — systemd-boot (UEFI minimal) ou GRUB (legacy/multi-boot).
      </p>

      <h2>Antes de começar</h2>
      <p>
        Este guia foca na <strong>instalação manual</strong> (a que ensina). Para a versão assistida,
        execute <code>archinstall</code> dentro da ISO e siga os menus. Mesmo nesse caso, vale ler
        este guia depois — ele mostra o que o script fez por baixo dos panos.
      </p>

      <ul>
        <li>Pen drive ≥ 2 GB (será apagado)</li>
        <li>Internet (cabo é mais simples; Wi-Fi também funciona via <code>iwctl</code>)</li>
        <li>UEFI habilitado (PCs pós-2012 já vêm assim)</li>
        <li>≥ 20 GB de disco (recomendado 50 GB+)</li>
        <li>Backup do que importa</li>
      </ul>

      <h2>1. Baixar e gravar a ISO</h2>

      <TerminalBlock
        command="curl -sLO https://archlinux.org/iso/latest/archlinux-x86_64.iso"
        output={`  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  872M  100  872M    0     0  18.4M      0  0:00:47  0:00:47 --:--:-- 19.1M`}
        comment="ISO oficial — ~870 MB, lançada todo mês"
      />

      <TerminalBlock
        command="sha256sum archlinux-x86_64.iso"
        output={`a3e5cb8b9b1f0c8f9e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5  archlinux-x86_64.iso`}
        comment="confira no site oficial: deve bater com a soma publicada"
      />

      <h3>Identificar o pen drive (NÃO erre!)</h3>

      <TerminalBlock
        command="lsblk -dpno NAME,SIZE,MODEL,TRAN"
        output={`{b}/dev/nvme0n1{/}  476.9G  Samsung_SSD_980_PRO_500GB    nvme
{y}/dev/sdb{/}        14.5G  SanDisk_Cruzer_Blade         usb`}
      />

      <OutputBlock
        title="leia com calma — confunda esses dois e adeus disco"
        output={`/dev/nvme0n1  476.9G  Samsung_SSD_980_PRO_500GB    nvme
/dev/sdb        14.5G  SanDisk_Cruzer_Blade         usb`}
        annotations={[
          { line: 0, note: "seu disco principal — NÃO mexer" },
          { line: 1, note: "pen drive (transporte = usb)" },
        ]}
      />

      <AlertBox type="danger" title="dd = disk destroyer">
        Errar a letra do dispositivo apaga seu HD principal sem perguntar. Confira <strong>3
        vezes</strong> antes de rodar <code>dd</code>.
      </AlertBox>

      <TerminalBlock
        command="sudo dd bs=4M if=archlinux-x86_64.iso of=/dev/sdb status=progress oflag=sync"
        output={`914358272 bytes (914 MB, 872 MiB) copied, 47.8013 s, 19.1 MB/s
218+1 records in
218+1 records out
914358272 bytes (914 MB, 872 MiB) copied, 48.5921 s, 18.8 MB/s`}
      />

      <CommandFlagList
        command="dd"
        items={[
          { flag: "bs=4M", description: "tamanho do bloco — 4 MB acelera muito a gravação" },
          { flag: "if=", description: "input file (a ISO)" },
          { flag: "of=", description: "output file (o pen drive INTEIRO, sem número de partição)" },
          { flag: "status=progress", description: "mostra progresso em tempo real" },
          { flag: "oflag=sync", description: "garante que cada bloco realmente vai pro disco antes do próximo" },
        ]}
      />

      <h2>2. Boot e primeiros passos no live</h2>
      <p>
        Reinicie no pen drive (F12/F2/Esc dependendo da fabricante). No menu, escolha
        <code> "Arch Linux install medium (x86_64, UEFI)"</code>. Você cai num root shell:
      </p>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command=""
        output={`Arch Linux 6.8.7-arch1-1 (tty1)
archiso login: root (automatic login)

To install Arch Linux follow the installation guide:
https://wiki.archlinux.org/title/Installation_guide`}
      />

      <h3>Confirmar boot UEFI</h3>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="ls /sys/firmware/efi/efivars | head -5"
        output={`AMITSESetup-c811fa38-42c8-4579-a9bb-60e94eddfb34
Boot0000-8be4df61-93ca-11d2-aa0d-00e098032b8c
Boot0001-8be4df61-93ca-11d2-aa0d-00e098032b8c
BootCurrent-8be4df61-93ca-11d2-aa0d-00e098032b8c
BootOrder-8be4df61-93ca-11d2-aa0d-00e098032b8c`}
        comment="se mostrar arquivos = UEFI; se der ENOENT = BIOS legada"
      />

      <h3>Teclado brasileiro</h3>
      <TerminalBlock
        prompt="root@archiso ~ # "
        command="loadkeys br-abnt2"
        output=""
        comment="sem saída quando dá certo. Teste digitando ç ou acento."
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="localectl list-keymaps | grep -i br"
        output={`br-abnt
br-abnt2
br-latin1-abnt2
br-latin1-us
br-nodeadkeys`}
      />

      <h3>Internet (Wi-Fi via iwctl)</h3>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="iwctl"
        output={`iwd version 2.15
[iwd]#`}
      />

      <TerminalBlock
        prompt="[iwd]# "
        command="device list"
        output={`                              Devices
--------------------------------------------------------------------------------
  Name        Address              Powered  Adapter   Mode
--------------------------------------------------------------------------------
  {b}wlan0{/}       a4:c3:f0:12:34:56    {g}on{/}       phy0      station`}
      />

      <TerminalBlock
        prompt="[iwd]# "
        command="station wlan0 scan"
        output=""
        comment="o scan é silencioso — em seguida liste as redes"
      />

      <TerminalBlock
        prompt="[iwd]# "
        command="station wlan0 get-networks"
        output={`                          Available Networks
--------------------------------------------------------------------------------
       Network name                Security        Signal
--------------------------------------------------------------------------------
       MinhaCasa_5G                psk             {g}****{/}
       VivoFibra-1234              psk             {y}***{/}
       Cafe_WiFi                   open            {y}**{/}`}
      />

      <TerminalBlock
        prompt="[iwd]# "
        command='station wlan0 connect "MinhaCasa_5G"'
        output={`Type the network passphrase for MinhaCasa_5G psk.
Passphrase: ********`}
      />

      <TerminalBlock
        prompt="[iwd]# "
        command="station wlan0 show"
        output={`                            Station: wlan0
--------------------------------------------------------------------------------
            Settable  Property                Value
--------------------------------------------------------------------------------
                      Scanning                no
                      State                   {g}connected{/}
                      Connected network       MinhaCasa_5G
                      IPv4 address            192.168.1.42`}
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="ping -c 3 archlinux.org"
        output={`PING archlinux.org (95.217.163.246) 56(84) bytes of data.
64 bytes from archlinux.org: icmp_seq=1 ttl=47 time=142 ms
64 bytes from archlinux.org: icmp_seq=2 ttl=47 time=141 ms
64 bytes from archlinux.org: icmp_seq=3 ttl=47 time=140 ms

--- archlinux.org ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 140.123/141.234/142.456/0.987 ms`}
      />

      <h3>Sincronizar relógio</h3>
      <TerminalBlock
        prompt="root@archiso ~ # "
        command="timedatectl set-ntp true"
        output=""
      />
      <TerminalBlock
        prompt="root@archiso ~ # "
        command="timedatectl"
        output={`               Local time: Wed 2024-04-17 15:23:10 UTC
           Universal time: Wed 2024-04-17 15:23:10 UTC
                 RTC time: Wed 2024-04-17 15:23:10
                Time zone: UTC (UTC, +0000)
System clock synchronized: {g}yes{/}
              NTP service: {g}active{/}
          RTC in local TZ: no`}
      />

      <h2>3. Particionar o disco</h2>
      <p>
        Vamos criar 3 partições: EFI (1 GB), swap (4 GB) e raiz (resto). Suposição: o disco é
        <code> /dev/nvme0n1</code>. Em SATA seria <code>/dev/sda</code>.
      </p>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="lsblk /dev/nvme0n1"
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk`}
        comment="disco virgem — sem partições"
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="cfdisk /dev/nvme0n1"
        output={`Select label type: gpt
Device         Start        End    Sectors   Size Type
/dev/nvme0n1p1  2048    2099199    2097152     1G EFI System
/dev/nvme0n1p2  2099200 10487807   8388608     4G Linux swap
/dev/nvme0n1p3  10487808 1000215182 989727375 472G Linux filesystem`}
        comment="cfdisk é um TUI com setas — após salvar, lsblk confirma"
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="lsblk /dev/nvme0n1"
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk
├─nvme0n1p1 259:1    0     1G  0 part
├─nvme0n1p2 259:2    0     4G  0 part
└─nvme0n1p3 259:3    0   472G  0 part`}
      />

      <h3>Formatar</h3>
      <TerminalBlock
        prompt="root@archiso ~ # "
        command="mkfs.fat -F32 /dev/nvme0n1p1"
        output={`mkfs.fat 4.2 (2021-01-31)`}
        comment="EFI exige FAT32"
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="mkswap /dev/nvme0n1p2"
        output={`Setting up swapspace version 1, size = 4 GiB (4294963200 bytes)
no label, UUID=8a1b2c3d-4e5f-6789-abcd-ef0123456789`}
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="mkfs.ext4 /dev/nvme0n1p3"
        output={`mke2fs 1.47.0 (5-Feb-2023)
Discarding device blocks: done
Creating filesystem with 123715921 4k blocks and 30932992 inodes
Filesystem UUID: e1f2a3b4-c5d6-7890-abcd-ef1234567890
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632,
	2654208, 4096000, 7962624, 11239424, 20480000, 23887872, 71663616
Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done`}
      />

      <h3>Montar</h3>
      <TerminalBlock
        prompt="root@archiso ~ # "
        lines={[
          { type: "command", text: "mount /dev/nvme0n1p3 /mnt" },
          { type: "command", text: "mount --mkdir /dev/nvme0n1p1 /mnt/boot" },
          { type: "command", text: "swapon /dev/nvme0n1p2" },
          { type: "command", text: "lsblk -f /dev/nvme0n1" },
          { type: "output", text: `NAME        FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
nvme0n1
├─nvme0n1p1 vfat   FAT32       1234-5678                              1018M     0% /mnt/boot
├─nvme0n1p2 swap   1           8a1b2c3d-4e5f-6789-abcd-ef0123456789                [SWAP]
└─nvme0n1p3 ext4   1.0         e1f2a3b4-c5d6-7890-abcd-ef1234567890   447.4G     0% /mnt` }
        ]}
      />

      <h2>4. pacstrap — instalar o sistema base</h2>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="pacstrap -K /mnt base linux linux-firmware sof-firmware base-devel grub efibootmgr nano sudo networkmanager"
        output={`==> Creating install root at /mnt
==> Installing packages to /mnt
:: Synchronizing package databases...
 core                  130.5 KiB  ...
 extra                   8.2 MiB  ...
:: There are 3 providers available for ttf-font:
:: Repository extra
   1) gnu-free-fonts  2) noto-fonts  3) ttf-bitstream-vera

Enter a number (default=1): 2
resolving dependencies...
looking for conflicting packages...

Packages (158) acl-2.3.2-1  archlinux-keyring-20240416-1  argon2-20190702-6  ...
                base-3-2  base-devel-1-2  bash-5.2.026-2  binutils-2.42-3  ...
                grub-2:2.12-2  linux-6.8.7.arch1-1  linux-firmware-20240410-1  ...

Total Download Size:    421.85 MiB
Total Installed Size:   1623.42 MiB

:: Proceed with installation? [Y/n] {g}Y{/}
:: Retrieving packages...
 acl-2.3.2-1                  56.8 KiB  3.2 MiB/s 00:00 [############] 100%
 ... (158 pacotes) ...
(158/158) checking keys in keyring                          [############] 100%
(158/158) checking package integrity                        [############] 100%
(158/158) loading package files                             [############] 100%
(158/158) checking for file conflicts                       [############] 100%
:: Running pre-transaction hooks...
(1/1) Creating Arch Linux keyring master key...
:: Processing package changes...
(  1/158) installing filesystem                             [############] 100%
... (157 outras) ...
:: Running post-transaction hooks...
(1/4) Reloading system manager configuration...
(2/4) Updating module dependencies...
(3/4) Updating linux initcpios...
(4/4) Arming ConditionNeedsUpdate...`}
      />

      <CommandFlagList
        command="pacstrap"
        items={[
          { flag: "-K", description: "inicializa um keyring fresco no destino (recomendado em ISOs novas)" },
          { flag: "-c", description: "usa o cache do host (acelera reinstalações)" },
          { flag: "-M", description: "não copia o mirrorlist do host" },
          { flag: "-i", description: "modo interativo — pede confirmação a cada operação" },
        ]}
      />

      <h2>5. fstab — montagens persistentes</h2>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="genfstab -U /mnt >> /mnt/etc/fstab"
        output=""
      />

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="cat /mnt/etc/fstab"
        output={`# Static information about the filesystems.
# See fstab(5) for details.

# <file system>             <dir> <type>  <options>     <dump>  <pass>
# /dev/nvme0n1p3
UUID=e1f2a3b4-c5d6-7890-abcd-ef1234567890   /         ext4    rw,relatime  0 1

# /dev/nvme0n1p1
UUID=1234-5678                              /boot     vfat    rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,utf8,errors=remount-ro  0 2

# /dev/nvme0n1p2
UUID=8a1b2c3d-4e5f-6789-abcd-ef0123456789   none      swap    defaults  0 0`}
      />

      <h2>6. arch-chroot — entrar no sistema novo</h2>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="arch-chroot /mnt"
        output=""
        comment="o prompt vai mudar — agora você ESTÁ no sistema novo"
      />

      <h3>Timezone, locale e hostname</h3>

      <TerminalBlock
        prompt="[root@archiso /]# "
        lines={[
          { type: "command", text: "ln -sf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime" },
          { type: "command", text: "hwclock --systohc" },
          { type: "command", text: "date" },
          { type: "output", text: "Wed Apr 17 12:23:10 PM -03 2024" },
        ]}
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="sed -i 's/^#pt_BR.UTF-8/pt_BR.UTF-8/; s/^#en_US.UTF-8/en_US.UTF-8/' /etc/locale.gen"
        output=""
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="locale-gen"
        output={`Generating locales...
  en_US.UTF-8... done
  pt_BR.UTF-8... done
Generation complete.`}
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        lines={[
          { type: "command", text: "echo 'LANG=pt_BR.UTF-8' > /etc/locale.conf" },
          { type: "command", text: "echo 'KEYMAP=br-abnt2' > /etc/vconsole.conf" },
          { type: "command", text: "echo 'meu-arch' > /etc/hostname" },
        ]}
      />

      <h3>Senha do root e usuário comum</h3>

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="passwd"
        output={`New password: ********
Retype new password: ********
{g}passwd: password updated successfully{/}`}
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="useradd -m -G wheel,audio,video,storage -s /bin/bash joao"
        output=""
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="passwd joao"
        output={`New password: ********
Retype new password: ********
{g}passwd: password updated successfully{/}`}
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="EDITOR=nano visudo"
        output={`# Descomente a linha:
# %wheel ALL=(ALL:ALL) ALL
# Salve com Ctrl+O, Enter, Ctrl+X`}
        comment="visudo valida a sintaxe antes de salvar — não edite /etc/sudoers direto"
      />

      <h3>Bootloader (GRUB)</h3>

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB"
        output={`Installing for x86_64-efi platform.
Installation finished. No error reported.`}
      />

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="grub-mkconfig -o /boot/grub/grub.cfg"
        output={`Generating grub configuration file ...
Found theme: /usr/share/grub/themes/starfield/theme.txt
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/initramfs-linux.img
Found fallback initrd image(s) in /boot:  initramfs-linux-fallback.img
{g}done{/}`}
      />

      <h3>Habilitar rede no primeiro boot</h3>

      <TerminalBlock
        prompt="[root@archiso /]# "
        command="systemctl enable NetworkManager"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/NetworkManager.service → /usr/lib/systemd/system/NetworkManager.service.
Created symlink /etc/systemd/system/dbus-org.freedesktop.nm-dispatcher.service → /usr/lib/systemd/system/NetworkManager-dispatcher.service.
Created symlink /etc/systemd/system/network-online.target.wants/NetworkManager-wait-online.service → /usr/lib/systemd/system/NetworkManager-wait-online.service.`}
      />

      <h2>7. Reiniciar</h2>

      <TerminalBlock
        prompt="[root@archiso /]# "
        lines={[
          { type: "command", text: "exit" },
          { type: "command", text: "umount -R /mnt" },
          { type: "command", text: "swapoff /dev/nvme0n1p2" },
          { type: "command", text: "reboot" },
        ]}
      />

      <p>
        Tira o pen drive na hora certa. No próximo boot você vê o GRUB, escolhe Arch Linux e cai em:
      </p>

      <TerminalBlock
        prompt=""
        command=""
        lines={[
          { type: "output", text: `Arch Linux 6.8.7-arch1-1 (tty1)\n\nmeu-arch login: joao\nPassword: ********\n\n[joao@meu-arch ~]$ _` }
        ]}
      />

      <AlertBox type="success" title="Bem-vindo ao Arch.">
        Daqui em diante, siga para <strong>Primeiros Passos</strong> — vamos configurar mirrors,
        instalar pacotes essenciais e o ambiente gráfico.
      </AlertBox>
    </PageContainer>
  );
}
