import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function Troubleshooting() {
  return (
    <PageContainer
      title="Troubleshooting"
      subtitle="Cookbook de diagnóstico: erros reais que aparecem no terminal e exatamente como sair deles."
      difficulty="avancado"
      timeToRead="40 min"
      category="Extras"
    >
      <h2>Metodologia: leia, registre, isole</h2>
      <p>
        Quase todo problema no Arch deixa rastro em <code>journalctl</code>, <code>dmesg</code> ou
        <code>/var/log/pacman.log</code>. A regra de ouro: <strong>leia a mensagem inteira</strong>.
        O Arch quase nunca mente — ele diz exatamente onde quebrou.
      </p>

      <TerminalBlock
        comment="Os 4 comandos que você roda PRIMEIRO em qualquer problema"
        command={`systemctl --failed
journalctl -b -p err --no-pager | tail -30
dmesg --level=err,warn | tail -20
tail -30 /var/log/pacman.log`}
        output={``}
      />

      <h2>1. Boot quebrado — sistema não inicia</h2>

      <h3>Identificar onde travou</h3>
      <TerminalBlock
        command="sudo systemd-analyze blame | head -10"
        output={`12.483s NetworkManager-wait-online.service
 4.218s systemd-networkd-wait-online.service
 2.812s plymouth-quit-wait.service
 1.456s systemd-udev-settle.service
   876ms snapd.service
   612ms apparmor.service
   428ms systemd-journal-flush.service
   312ms systemd-logind.service
   287ms systemd-tmpfiles-setup.service
   245ms ldconfig.service`}
      />

      <TerminalBlock
        command="systemctl --failed"
        output={`  UNIT                   LOAD   ACTIVE SUB    DESCRIPTION
{r}● bluetooth.service{/}      loaded failed failed Bluetooth service
{r}● ModemManager.service{/}   loaded failed failed Modem Manager

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state.
SUB    = The low-level unit activation state, values depend on unit type.

2 loaded units listed.`}
      />

      <h3>Recuperar via USB de instalação</h3>
      <TerminalBlock
        comment="Bootando do ISO do Arch — montar o sistema instalado"
        command={`lsblk
mount /dev/nvme0n1p2 /mnt
mount /dev/nvme0n1p1 /mnt/boot
arch-chroot /mnt`}
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk 
├─nvme0n1p1 259:1    0   512M  0 part 
├─nvme0n1p2 259:2    0 460.4G  0 part 
└─nvme0n1p3 259:3    0    16G  0 part [SWAP]
[root@archiso /]# `}
      />

      <h3>Regenerar initramfs</h3>
      <TerminalBlock
        command="mkinitcpio -P"
        output={`==> Building image from preset: /etc/mkinitcpio.d/linux.preset: 'default'
  -> -k /boot/vmlinuz-linux -c /etc/mkinitcpio.conf -g /boot/initramfs-linux.img
==> Starting build: '6.12.8-arch1-1'
  -> Running build hook: [base]
  -> Running build hook: [udev]
  -> Running build hook: [autodetect]
  -> Running build hook: [microcode]
  -> Running build hook: [modconf]
  -> Running build hook: [kms]
  -> Running build hook: [keyboard]
  -> Running build hook: [keymap]
  -> Running build hook: [block]
  -> Running build hook: [filesystems]
  -> Running build hook: [fsck]
==> Generating module dependencies
==> Creating zstd-compressed initcpio image: '/boot/initramfs-linux.img'
{g}==> Image generation successful{/}`}
      />

      <h3>Reinstalar o bootloader</h3>
      <TerminalBlock
        comment="systemd-boot (UEFI)"
        command="bootctl install"
        output={`Created "/boot/EFI".
Created "/boot/EFI/systemd".
Created "/boot/EFI/BOOT".
Created "/boot/loader".
Created "/boot/loader/entries".
Created "/boot/EFI/Linux".
Copied "/usr/lib/systemd/boot/efi/systemd-bootx64.efi" to "/boot/EFI/systemd/systemd-bootx64.efi".
Copied "/usr/lib/systemd/boot/efi/systemd-bootx64.efi" to "/boot/EFI/BOOT/BOOTX64.EFI".
Random seed file /boot/loader/random-seed successfully written (32 bytes).
Successfully initialized system token in EFI variable with 32 bytes.
Created EFI boot entry "Linux Boot Manager".`}
      />

      <TerminalBlock
        comment="GRUB (UEFI)"
        command={`grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg`}
        output={`Installing for x86_64-efi platform.
{g}Installation finished. No error reported.{/}
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/initramfs-linux.img
Found fallback initrd image(s) in /boot:  initramfs-linux-fallback.img
Found linux image: /boot/vmlinuz-linux-lts
Found initrd image: /boot/initramfs-linux-lts.img
{g}done{/}`}
      />

      <AlertBox type="success" title="Sempre tenha um kernel LTS instalado">
        <code>sudo pacman -S linux-lts linux-lts-headers</code>. Quando o kernel mainline quebrar
        algo (acontece), você escolhe o LTS no boot e investiga depois.
      </AlertBox>

      <h2>2. Pacman quebrado</h2>

      <h3>Database lock</h3>
      <TerminalBlock
        command="sudo pacman -Syu"
        output={`error: failed to init transaction (unable to lock database)
error: could not lock database: File exists
  if you're sure a package manager is not already
  running, you can remove /var/lib/pacman/db.lck`}
        exitCode={1}
      />

      <TerminalBlock
        comment="Confirmar que NÃO há outro pacman rodando antes de remover"
        command="pgrep -a pacman; sudo rm /var/lib/pacman/db.lck"
        output={``}
      />

      <h3>Chaves PGP inválidas</h3>
      <TerminalBlock
        command="sudo pacman -Syu"
        output={`:: Synchronizing package databases...
 core                  157.6 KiB   612 KiB/s 00:00 [######################] 100%
 extra                  10.2 MiB  4.20 MiB/s 00:02 [######################] 100%
:: Starting full system upgrade...
error: firefox: signature from "Levente Polyak (anthraxx) <levente@leventepolyak.net>" is unknown trust
:: File /var/cache/pacman/pkg/firefox-134.0-1-x86_64.pkg.tar.zst is corrupted (invalid or corrupted package (PGP signature)).
Do you want to delete it? [Y/n]`}
        exitCode={1}
      />

      <TerminalBlock
        comment="A correção: atualizar keyring"
        command={`sudo pacman -Sy archlinux-keyring
sudo pacman -Su`}
        output={`:: Synchronizing package databases...
resolving dependencies...
looking for conflicting packages...

Packages (1) archlinux-keyring-20250108-1

Total Installed Size:  1473.72 KiB
Net Upgrade Size:        12.40 KiB

:: Proceed with installation? [Y/n] 
(1/1) upgrading archlinux-keyring        [######################] 100%
==> Appending keys from archlinux.gpg...
==> Locally signing trusted keys in keyring...
  -> Locally signing key 3056513887B78AEB...
==> Importing owner trust values...
==> Disabling revoked keys in keyring...
==> Updating trust database...
{g}gpg: next trustdb check due at 2026-01-08{/}`}
      />

      <h3>Conflito entre arquivos</h3>
      <TerminalBlock
        command="sudo pacman -S nvidia"
        output={`(1/1) checking for file conflicts                  [###########] 100%
error: failed to commit transaction (conflicting files)
nvidia: /usr/lib/modules/6.12.8-arch1-1/kernel/drivers/video/nvidia.ko.zst exists in filesystem
Errors occurred, no packages were upgraded.`}
        exitCode={1}
      />

      <TerminalBlock
        comment="Use --overwrite quando o arquivo existe mas pertence ao mesmo pacote"
        command={`sudo pacman -S nvidia --overwrite '/usr/lib/modules/*/kernel/drivers/video/nvidia.ko.zst'`}
        output={`(1/1) installing nvidia                             [######################] 100%`}
      />

      <h3>Pacotes parcialmente atualizados (NUNCA faça isso)</h3>
      <TerminalBlock
        command="sudo pacman -S firefox  # sem ter rodado -Syu antes"
        output={`error: failed to commit transaction (invalid or corrupted package)
:: File /var/cache/pacman/pkg/firefox-134.0-1-x86_64.pkg.tar.zst is corrupted
Errors occurred, no packages were upgraded.`}
        exitCode={1}
      />

      <AlertBox type="danger" title="Partial upgrade is not supported">
        Arch é rolling release. Use sempre <code>-Syu</code> (nunca <code>-Sy pacote</code>).
        Combinar bancos novos com sistema antigo é a causa #1 de pacman quebrado.
      </AlertBox>

      <h2>3. Tela preta após boot</h2>
      <TerminalBlock
        comment="Vá para um TTY: Ctrl+Alt+F2 e investigue"
        command="cat /var/log/Xorg.0.log | grep '(EE)'"
        output={`[    14.218] (EE) NVIDIA: Failed to load the NVIDIA kernel module. Please check your
[    14.218] (EE) NVIDIA:     system's kernel log for additional error messages and
[    14.218] (EE) NVIDIA:     consult the NVIDIA README for details.
[    14.218] (EE) no screens found(EE)`}
      />

      <TerminalBlock
        command="dmesg | grep -i nvidia"
        output={`[    8.412] nvidia: loading out-of-tree module taints kernel.
[    8.412] nvidia: module verification failed: signature and/or required key missing - tainting kernel
[    8.418] {r}NVRM: API mismatch: the client has the version 535.183.01, but{/}
[    8.418] {r}NVRM: this kernel module has the version 550.78.{/}`}
      />

      <p>Solução: regenerar initramfs após troca de driver/kernel:</p>
      <TerminalBlock
        command="sudo mkinitcpio -P && sudo reboot"
        output={``}
      />

      <h2>4. Áudio sem som</h2>
      <TerminalBlock
        command="systemctl --user status pipewire pipewire-pulse wireplumber --no-pager"
        output={`{g}● pipewire.service{/} - PipeWire Multimedia Service
     Active: {g}active (running){/} since 09:12:14; 4h 22min ago
{g}● pipewire-pulse.service{/} - PipeWire PulseAudio
     Active: {g}active (running){/} since 09:12:14; 4h 22min ago
{r}● wireplumber.service{/} - Multimedia Service Session Manager
     Active: {r}failed (Result: exit-code){/} since 09:12:18`}
      />

      <TerminalBlock
        command="wpctl status"
        output={`PipeWire 'pipewire-0' [1.2.7, user@archlinux, cookie:1421]

Audio
 ├─ Devices:
 │      32. Family 17h/19h HD Audio Controller    [alsa]
 │
 ├─ Sinks:
 │  *   45. Speaker                                [vol: 0.45 MUTED]
 │      47. HDMI / DisplayPort                     [vol: 1.00]
 │
 ├─ Sources:
 │  *   46. Built-in Microphone                    [vol: 0.78]
 │
 └─ Default Configured Devices:
        0.  Audio/Sink     alsa_output.pci-0000_03_00.6.HiFi__Speaker__sink`}
      />

      <TerminalBlock
        comment="Sink padrão estava MUTADO — eis a correção"
        command="wpctl set-mute @DEFAULT_AUDIO_SINK@ 0 && wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.6"
        output={``}
      />

      <h2>5. Rede caída</h2>
      <TerminalBlock
        command={`ip -br link
ip -br addr
ip route`}
        output={`lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
wlan0            UP             a4:c3:f0:12:34:56 <BROADCAST,MULTICAST,UP,LOWER_UP>
eth0             {r}DOWN{/}           {r}d8:bb:c1:ab:cd:ef <NO-CARRIER,BROADCAST,MULTICAST,UP>{/}

lo               UNKNOWN        127.0.0.1/8 ::1/128
wlan0            UP             192.168.1.42/24 fe80::a6c3:f0ff:fe12:3456/64

default via 192.168.1.1 dev wlan0 proto dhcp src 192.168.1.42 metric 600`}
      />

      <TerminalBlock
        command="nmcli device status"
        output={`DEVICE  TYPE      STATE                    CONNECTION    
wlan0   wifi      {g}connected{/}                Casa-2.4G     
eth0    ethernet  {y}unavailable{/}              --            
lo      loopback  unmanaged                --            `}
      />

      <TerminalBlock
        comment="DNS não resolve mas ping por IP funciona = problema de DNS"
        command="resolvectl status | head -20"
        output={`Global
       Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
resolv.conf mode: stub

Link 2 (wlan0)
    Current Scopes: DNS
         Protocols: +DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 192.168.1.1
       DNS Servers: 192.168.1.1 1.1.1.1`}
      />

      <h2>6. Espaço em disco esgotado</h2>
      <TerminalBlock
        command="df -hT / /home /var"
        output={`Filesystem     Type   Size  Used Avail Use% Mounted on
/dev/nvme0n1p2 ext4    50G   {r}49G{/}  812M  {r}99%{/} /
/dev/nvme0n1p4 ext4   400G  238G  142G  63% /home
/dev/nvme0n1p2 ext4    50G   49G  812M  99% /var`}
      />

      <TerminalBlock
        comment="Onde está o entulho? Cache do pacman é o suspeito #1"
        command="du -sh /var/cache/pacman/pkg /var/log /var/lib/systemd/coredump 2>/dev/null"
        output={`12G	/var/cache/pacman/pkg
4.2G	/var/log
1.8G	/var/lib/systemd/coredump`}
      />

      <TerminalBlock
        command={`sudo paccache -rk1     # mantém apenas 1 versão antiga
sudo paccache -ruk0    # remove TUDO de pacotes não instalados
sudo journalctl --vacuum-time=2weeks`}
        output={`==> finished: 487 packages removed (disk space saved: 8.42 GiB)
==> finished: 213 packages removed (disk space saved: 3.18 GiB)
Vacuuming done, freed 3.4G of archived journals from /var/log/journal/4f...`}
      />

      <h2>7. Kernel panic</h2>
      <OutputBlock
        title="Mensagem típica no console"
        output={`[ 8.412] {r}Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0){/}
[ 8.412] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 6.12.8-arch1-1 #1
[ 8.412] Hardware name: ASUS ROG Strix
[ 8.412] Call Trace:
[ 8.412]  <TASK>
[ 8.412]  dump_stack_lvl+0x47/0x70
[ 8.412]  panic+0x18d/0x340
[ 8.412]  mount_block_root+0x196/0x230`}
        annotations={[
          { line: 0, note: "raiz não montou" },
          { line: 6, note: "stack do panic" },
        ]}
        caption="A causa quase sempre é initramfs sem o módulo do controlador de disco (nvme/ahci) ou root= errado."
      />

      <p>Recuperação: bootar o LTS, ou via USB:</p>
      <CodeBlock
        title="/etc/mkinitcpio.conf — corrigir HOOKS"
        language="bash"
        code={`MODULES=(nvme)
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)`}
      />
      <TerminalBlock command="mkinitcpio -P" output={`==> Image generation successful`} />

      <h2>8. Hora errada / SSL falhando</h2>
      <TerminalBlock
        command="timedatectl"
        output={`               Local time: Mon 2025-01-13 12:34:18 -03
           Universal time: Mon 2025-01-13 15:34:18 UTC
                 RTC time: Mon 2025-01-13 15:34:18
                Time zone: America/Sao_Paulo (-03, -0300)
{g}System clock synchronized: yes{/}
              NTP service: {g}active{/}
          RTC in local TZ: no`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now systemd-timesyncd"
        output={`Created symlink /etc/systemd/system/sysinit.target.wants/systemd-timesyncd.service → /usr/lib/systemd/system/systemd-timesyncd.service.`}
      />

      <h2>9. Sistema travado — usar SysRq de emergência</h2>
      <CodeBlock
        title="Reboot seguro REISUB (Alt+SysRq + sequência)"
        language="text"
        code={`R - tira teclado de modo raw
E - SIGTERM em todos os processos
I - SIGKILL em todos os processos
S - sync nos discos
U - remonta tudo read-only
B - reboot

Habilitar: echo 1 | sudo tee /proc/sys/kernel/sysrq`}
      />

      <h2>Sua caixa de ferramentas de diagnóstico</h2>
      <OutputBlock
        title="Os 12 comandos que resolvem 90% dos problemas"
        output={`journalctl -b                       # logs do boot atual
journalctl -b -p err --no-pager     # só erros do boot
journalctl -xeu nome.service        # logs de um serviço com explicação
dmesg --level=err,warn -T           # mensagens do kernel
systemctl --failed                  # serviços quebrados
systemctl status nome.service       # estado + últimas linhas de log
systemd-analyze blame               # o que demorou no boot
lsblk -f                            # discos, partições, FS, UUIDs
ip -br addr / ip route              # rede em uma linha
ss -tulnp                           # quem está escutando
free -h / df -hT                    # memória / disco
pacman -Qkk 2>&1 | grep -v "0 alt"  # arquivos modificados`}
      />

      <AlertBox type="info" title="ArchWiki primeiro, fórum depois">
        Antes de perguntar, busque <code>site:wiki.archlinux.org</code> + a mensagem de erro.
        Em 90% dos casos a solução já está documentada com mais qualidade do que qualquer fórum.
      </AlertBox>
    </PageContainer>
  );
}
