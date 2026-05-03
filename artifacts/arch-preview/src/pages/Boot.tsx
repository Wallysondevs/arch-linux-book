import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Boot() {
  return (
    <PageContainer
      title="Boot do Arch Linux"
      subtitle="Do firmware ao login: GRUB vs systemd-boot, layout de /boot, mkinitcpio, fallback e dual-boot. Tudo com saída real."
      difficulty="avancado"
      timeToRead="50 min"
      category="Sistema"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch instalado, <code>sudo</code>. Útil ter visto <a href="#/systemd">Systemd</a>. Cuidado: erros em GRUB/systemd-boot podem deixar o sistema sem boot.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>UEFI / BIOS</strong> — firmware que inicia o hardware. UEFI é o moderno (gpt, secure boot); BIOS é o legado.
      </p>
      <p>
        <strong>systemd-boot</strong> — bootloader minimalista padrão do Arch em UEFI (recomendado pelo wiki).
      </p>
      <p>
        <strong>GRUB</strong> — bootloader clássico. Usado em sistemas BIOS legacy ou multi-boot complexo.
      </p>
      <p>
        <strong>mkinitcpio</strong> — gera o initramfs do Arch. Hooks definem o que entra (encrypt, lvm2, btrfs).
      </p>
      <p>
        <strong>Target</strong> — alvo do systemd que define o estado do boot.
      </p>

      <p>
        Entender o boot é a diferença entre <em>"meu Arch não liga"</em> ser uma tragédia de horas ou
        um chroot de cinco minutos. O caminho é sempre o mesmo: <strong>firmware (UEFI/BIOS) →
        bootloader → kernel + initramfs → systemd (PID 1) → target</strong>. Esta página percorre cada
        camada com os comandos e arquivos reais de um Arch instalado.
      </p>

      <AlertBox type="info" title="Pacotes que aparecem aqui">
        <code>grub</code>, <code>efibootmgr</code>, <code>os-prober</code>, <code>mkinitcpio</code>,{" "}
        <code>linux</code>, <code>linux-firmware</code>, <code>intel-ucode</code> ou{" "}
        <code>amd-ucode</code>. O <code>systemd-boot</code> já vem no pacote <code>systemd</code>.
      </AlertBox>

      <h2>1. Visão geral do boot UEFI</h2>

      <OutputBlock
        title="cadeia de inicialização (UEFI)"
        output={`UEFI firmware
  ├─ lê NVRAM (efibootmgr) e escolhe entry
  ├─ carrega .efi da ESP (/boot/EFI/...)
  │
bootloader (GRUB ou systemd-boot)
  ├─ apresenta menu
  ├─ carrega vmlinuz-linux + initramfs-linux.img
  ├─ passa cmdline (root=UUID=..., rw, etc.)
  │
kernel Linux
  ├─ descomprime initramfs em /
  ├─ executa /init (busybox no early-userspace)
  ├─ monta o root real, switch_root
  │
systemd (PID 1)
  ├─ ativa default.target (graphical / multi-user)
  └─ logind → display manager (sddm/gdm) ou getty`}
      />

      <TerminalBlock
        comment="confirme se você bootou em UEFI (diretório existe = sim)"
        command="ls /sys/firmware/efi/efivars | head -3"
        output={`AcpiGlobalVariable-414e6bdd-e47b-47cc-b244-bb61020cf516
BootCurrent-8be4df61-93ca-11d2-aa0d-00e098032b8c
BootOrder-8be4df61-93ca-11d2-aa0d-00e098032b8c`}
      />

      <TerminalBlock
        comment="se o diretório não existir, você bootou em modo BIOS/legacy"
        command="[ -d /sys/firmware/efi ] && echo UEFI || echo BIOS"
        output={`UEFI`}
      />

      <h2>2. A ESP — EFI System Partition</h2>

      <p>
        Em sistemas UEFI todos os bootloaders moram em uma partição FAT32 marcada com a flag{" "}
        <code>esp</code>. O Arch Wiki recomenda montá-la em <code>/boot</code> para que o kernel e o
        initramfs fiquem diretamente acessíveis ao firmware.
      </p>

      <TerminalBlock
        command="lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINTS,PARTTYPENAME"
        output={`NAME        SIZE FSTYPE MOUNTPOINTS PARTTYPENAME
nvme0n1   476.9G
├─nvme0n1p1   1G vfat   /boot       EFI System
├─nvme0n1p2  16G swap   [SWAP]      Linux swap
└─nvme0n1p3 459.9G ext4 /           Linux filesystem`}
      />

      <TerminalBlock
        command="findmnt /boot"
        output={`TARGET SOURCE         FSTYPE OPTIONS
/boot  /dev/nvme0n1p1 vfat   rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=ascii,shortname=mixed,utf8,errors=remount-ro`}
      />

      <TerminalBlock
        command="ls /boot"
        output={`EFI                            initramfs-linux.img
amd-ucode.img                  initramfs-linux-fallback.img
grub                           vmlinuz-linux
intel-ucode.img                vmlinuz-linux-lts`}
      />

      <OutputBlock
        title="o que cada arquivo é"
        output={`vmlinuz-linux                 kernel comprimido (bzImage)
initramfs-linux.img           initramfs "normal" (módulos só do hw atual)
initramfs-linux-fallback.img  initramfs "tudo" (todos os módulos)
intel-ucode.img / amd-ucode   microcode da CPU (carregado antes do kernel)
EFI/                          executáveis .efi dos bootloaders
grub/                         config + módulos do GRUB`}
        annotations={[
          { line: 1, note: "menor, mais rápido — gerado com HOOKS=autodetect" },
          { line: 2, note: "use no menu se o normal não bootar" },
          { line: 3, note: "patches contra Spectre/Meltdown" },
        ]}
      />

      <h2>3. Bootloader A — GRUB</h2>

      <p>
        GRUB é o padrão histórico, suporta BIOS e UEFI, lê quase tudo (ext4, btrfs, xfs, lvm, luks)
        e tem detecção automática de outros SOs via <code>os-prober</code>.
      </p>

      <TerminalBlock
        comment="instale na ESP (modo UEFI)"
        command="sudo pacman -S grub efibootmgr os-prober"
        output={`Packages (3) efibootmgr-18-1  grub-2:2.12-2  os-prober-1.81-2

Total Installed Size:  37.84 MiB

:: Proceed with installation? [Y/n]`}
      />

      <TerminalBlock
        comment="instala o .efi em /boot/EFI/GRUB e cria entrada na NVRAM"
        command="sudo grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB"
        output={`Installing for x86_64-efi platform.
Installation finished. No error reported.`}
      />

      <TerminalBlock
        comment="gera /boot/grub/grub.cfg a partir de /etc/default/grub + scripts"
        command="sudo grub-mkconfig -o /boot/grub/grub.cfg"
        output={`Generating grub configuration file ...
Found theme: /boot/grub/themes/arch/theme.txt
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/intel-ucode.img /boot/initramfs-linux.img
Found fallback initrd image(s) in /boot:  initramfs-linux-fallback.img
Found linux image: /boot/vmlinuz-linux-lts
Found initrd image: /boot/intel-ucode.img /boot/initramfs-linux-lts.img
Warning: os-prober will not be executed to detect other bootable partitions.
Systems on them will not be added to the GRUB boot menu.
done`}
      />

      <h3>/etc/default/grub — opções principais</h3>

      <CodeBlock
        title="/etc/default/grub (trechos relevantes)"
        language="bash"
        code={`GRUB_DEFAULT=0
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="Arch"
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet nowatchdog"
GRUB_CMDLINE_LINUX=""
GRUB_PRELOAD_MODULES="part_gpt part_msdos"
GRUB_TIMEOUT_STYLE=menu
GRUB_TERMINAL_INPUT=console
GRUB_GFXMODE=auto
GRUB_GFXPAYLOAD_LINUX=keep
GRUB_DISABLE_RECOVERY=true
GRUB_DISABLE_OS_PROBER=false`}
      />

      <CommandFlagList
        command="/etc/default/grub — chaves importantes"
        items={[
          { flag: "GRUB_TIMEOUT", description: "Segundos de espera no menu. 0 = pula direto.", example: "GRUB_TIMEOUT=3" },
          { flag: "GRUB_DEFAULT", description: "Entrada padrão (índice 0,1,2... ou 'saved' p/ lembrar última escolha)." },
          { flag: "GRUB_CMDLINE_LINUX_DEFAULT", description: "Cmdline padrão. Adicione cryptdevice=, resume= etc.", example: "GRUB_CMDLINE_LINUX_DEFAULT=\"quiet splash nvidia-drm.modeset=1\"" },
          { flag: "GRUB_DISABLE_OS_PROBER", description: "false para detectar Windows e outros Linux instalados." },
          { flag: "GRUB_GFXMODE", description: "Resolução do menu (1920x1080x32 ou auto)." },
        ]}
      />

      <TerminalBlock
        comment="depois de qualquer mudança em /etc/default/grub:"
        command="sudo grub-mkconfig -o /boot/grub/grub.cfg"
      />

      <h2>4. Bootloader B — systemd-boot</h2>

      <p>
        Mais simples, embutido no <code>systemd</code>, mas <strong>só UEFI</strong> e só lê FAT/ESP
        (kernel e initramfs PRECISAM estar em /boot, que precisa ser a ESP). Sem menu gráfico — text
        only — mas atualiza sozinho com <code>systemctl</code>.
      </p>

      <TerminalBlock
        comment="instala bootx64.efi e systemd-bootx64.efi"
        command="sudo bootctl install"
        output={`Created "/boot/EFI/systemd".
Created "/boot/EFI/BOOT".
Created "/boot/loader".
Created "/boot/loader/entries".
Copied "/usr/lib/systemd/boot/efi/systemd-bootx64.efi" to "/boot/EFI/systemd/systemd-bootx64.efi".
Copied "/usr/lib/systemd/boot/efi/systemd-bootx64.efi" to "/boot/EFI/BOOT/BOOTX64.EFI".
Random seed file /boot/loader/random-seed successfully written (32 bytes).
Created EFI boot entry "Linux Boot Manager".`}
      />

      <CodeBlock
        title="/boot/loader/loader.conf"
        code={`default  arch.conf
timeout  3
console-mode max
editor   no`}
      />

      <CodeBlock
        title="/boot/loader/entries/arch.conf"
        code={`title    Arch Linux
linux    /vmlinuz-linux
initrd   /intel-ucode.img
initrd   /initramfs-linux.img
options  root=UUID=8c2b1d4a-0e5a-4f22-9a3e-4f6e8e3b7c11 rw quiet`}
      />

      <CodeBlock
        title="/boot/loader/entries/arch-fallback.conf"
        code={`title    Arch Linux (fallback initramfs)
linux    /vmlinuz-linux
initrd   /intel-ucode.img
initrd   /initramfs-linux-fallback.img
options  root=UUID=8c2b1d4a-0e5a-4f22-9a3e-4f6e8e3b7c11 rw`}
      />

      <TerminalBlock
        command="bootctl status"
        output={`System:
      Firmware: {g}UEFI 2.70{/} (American Megatrends 5.27)
 Firmware Arch: x64
   Secure Boot: disabled (setup)
  TPM2 Support: yes
  Boot into FW: supported

Current Boot Loader:
      Product: {g}systemd-boot 256.5-2-arch{/}
     Features: ✓ Boot counting
               ✓ Menu timeout control
               ✓ One-shot menu timeout control
               ✓ Default entry control
               ✓ One-shot entry control
          ESP: /dev/disk/by-partuuid/abc...  (/boot)
         File: └─/EFI/systemd/systemd-bootx64.efi`}
      />

      <AlertBox type="success" title="Atualização automática">
        Quando o pacote <code>systemd</code> é atualizado, um pacman hook chama{" "}
        <code>bootctl update</code> sozinho. Com GRUB você precisa rodar{" "}
        <code>grub-mkconfig</code> manualmente após upgrade do kernel se você editou config.
      </AlertBox>

      <h2>5. efibootmgr — entradas na NVRAM</h2>

      <TerminalBlock
        command="sudo efibootmgr -v"
        output={`BootCurrent: 0001
Timeout: 1 seconds
BootOrder: 0001,0000,2001,2002,2003
Boot0000* Windows Boot Manager  HD(1,GPT,...,0x800,0x32000)/File(\\EFI\\Microsoft\\Boot\\bootmgfw.efi)
Boot0001* Linux Boot Manager    HD(1,GPT,...,0x800,0x32000)/File(\\EFI\\systemd\\systemd-bootx64.efi)
Boot2001* EFI USB Device        RC
Boot2002* EFI DVD/CDROM         RC
Boot2003* EFI Network           RC`}
      />

      <CommandFlagList
        command="efibootmgr"
        items={[
          { flag: "-v", description: "Verbose: mostra path completo do .efi de cada entrada." },
          { flag: "-c", description: "Cria nova entrada (combine com -d, -p, -L, -l).", example: "sudo efibootmgr -c -d /dev/nvme0n1 -p 1 -L 'Arch' -l '\\EFI\\GRUB\\grubx64.efi'" },
          { flag: "-b NUM", description: "Seleciona entrada por número.", example: "sudo efibootmgr -b 0001 -B" },
          { flag: "-B", description: "Apaga a entrada selecionada com -b." },
          { flag: "-o", description: "Define ordem de boot.", example: "sudo efibootmgr -o 0001,0000" },
          { flag: "-n NUM", description: "BootNext: bota nessa entrada SÓ na próxima vez." },
        ]}
      />

      <h2>6. mkinitcpio — gerador de initramfs</h2>

      <p>
        O initramfs é um pequeno sistema de arquivos comprimido carregado junto com o kernel; sua
        única missão é montar o root real. No Arch ele é gerado pelo <code>mkinitcpio</code> a partir
        de <code>/etc/mkinitcpio.conf</code>.
      </p>

      <CodeBlock
        title="/etc/mkinitcpio.conf (trechos)"
        language="bash"
        code={`MODULES=()
BINARIES=()
FILES=()
HOOKS=(base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck)
COMPRESSION="zstd"
COMPRESSION_OPTIONS=()`}
      />

      <OutputBlock
        title="hooks na ordem certa"
        output={`base udev autodetect microcode modconf kms keyboard keymap consolefont block filesystems fsck
 │   │     │           │      │      │   │        │           │      │           │
 │   │     │           │      │      │   │        │           │      │           └─ verifica fs
 │   │     │           │      │      │   │        │           │      └─ monta /
 │   │     │           │      │      │   │        │           └─ udev p/ block devices
 │   │     │           │      │      │   │        └─ fonte do console
 │   │     │           │      │      │   └─ keymap (layout do teclado)
 │   │     │           │      │      └─ módulos de teclado p/ digitar senha LUKS
 │   │     │           │      └─ KMS p/ resolução nativa cedo
 │   │     │           └─ módulos extra (alsa, bluetooth, etc.)
 │   │     └─ ucode da CPU bem cedo
 │   └─ AUTODETECT — só inclui módulos do HW atual (initramfs pequeno)
 └─ filesystems mínimos`}
      />

      <CommandFlagList
        command="HOOKS extras comuns"
        items={[
          { flag: "encrypt", description: "Antes de filesystems para destravar LUKS no boot.", example: "HOOKS=(... block encrypt filesystems ...)" },
          { flag: "lvm2", description: "Se / está em volume LVM. Vai depois de encrypt." },
          { flag: "btrfs", description: "Para subvolumes btrfs como root (precisa do hook btrfs)." },
          { flag: "resume", description: "Para hibernação — junto com 'resume=UUID=...' no cmdline." },
          { flag: "systemd", description: "Substitui base+udev por systemd no early userspace (sintaxe diferente p/ cryptsetup)." },
        ]}
      />

      <TerminalBlock
        comment="-P regenera TODAS as imagens (linux, linux-lts, etc.)"
        command="sudo mkinitcpio -P"
        output={`==> Building image from preset: /etc/mkinitcpio.d/linux.preset: 'default'
  -> -k /boot/vmlinuz-linux -c /etc/mkinitcpio.conf -g /boot/initramfs-linux.img
==> Starting build: '6.12.1-arch1-1'
  -> Running build hook: [base]
  -> Running build hook: [udev]
  -> Running build hook: [autodetect]
  -> Running build hook: [microcode]
  -> Running build hook: [modconf]
  -> Running build hook: [kms]
  -> Running build hook: [keyboard]
  -> Running build hook: [keymap]
  -> Running build hook: [consolefont]
  -> Running build hook: [block]
  -> Running build hook: [filesystems]
  -> Running build hook: [fsck]
==> Generating module dependencies
==> Creating zstd-compressed initcpio image: '/boot/initramfs-linux.img'
==> Image generation successful
==> Building image from preset: /etc/mkinitcpio.d/linux.preset: 'fallback'
  -> -k /boot/vmlinuz-linux -c /etc/mkinitcpio.conf -g /boot/initramfs-linux-fallback.img -S autodetect
==> Image generation successful`}
      />

      <TerminalBlock
        comment="só uma preset"
        command="sudo mkinitcpio -p linux"
      />

      <TerminalBlock
        comment="lista módulos dentro do initramfs"
        command="lsinitcpio /boot/initramfs-linux.img | head -10"
        output={`bin
buildconfig
config
early_cpio
etc
etc/group
etc/initrd-release
etc/ld.so.cache
etc/ld.so.conf
etc/modprobe.d`}
      />

      <h2>7. Cmdline do kernel</h2>

      <TerminalBlock
        command="cat /proc/cmdline"
        output={`initrd=\\intel-ucode.img initrd=\\initramfs-linux.img root=UUID=8c2b1d4a-0e5a-4f22-9a3e-4f6e8e3b7c11 rw quiet loglevel=3`}
      />

      <CommandFlagList
        command="parâmetros úteis no cmdline"
        items={[
          { flag: "root=UUID=...", description: "Onde está o root real. Sempre prefira UUID a /dev/sdaX." },
          { flag: "rw", description: "Monta root como leitura/escrita já no early-userspace." },
          { flag: "quiet", description: "Silencia mensagens do kernel (vê só erros)." },
          { flag: "loglevel=N", description: "0=emerg ... 7=debug. 3 = err é típico." },
          { flag: "nomodeset", description: "Desabilita KMS — emergência p/ vídeo travado." },
          { flag: "single", description: "Boota em rescue.target (single-user)." },
          { flag: "init=/bin/bash", description: "Pula systemd e cai num bash (root sem nada montado)." },
          { flag: "cryptdevice=UUID=...:cryptroot", description: "Para LUKS root com hook encrypt." },
          { flag: "resume=UUID=swap", description: "Hibernação — restaura imagem do swap." },
        ]}
      />

      <h2>8. Fallback — quando o sistema não boota</h2>

      <AlertBox type="warning" title="Receita de chroot de emergência">
        Boot pelo USB de instalação do Arch, identifique seu disco com <code>lsblk</code>, monte o
        root e a ESP, e pule pra dentro com <code>arch-chroot</code>:
      </AlertBox>

      <TerminalBlock
        comment="dentro do live USB"
        command="lsblk"
        output={`NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0 476.9G  0 disk
├─nvme0n1p1 259:1    0     1G  0 part
├─nvme0n1p2 259:2    0    16G  0 part
└─nvme0n1p3 259:3    0 459.9G  0 part`}
      />

      <TerminalBlock
        command={`sudo mount /dev/nvme0n1p3 /mnt
sudo mount /dev/nvme0n1p1 /mnt/boot
sudo arch-chroot /mnt`}
        output={`[root@archiso /]#`}
      />

      <TerminalBlock
        comment="agora você está DENTRO do sistema instalado"
        command="mkinitcpio -P && grub-mkconfig -o /boot/grub/grub.cfg"
        output={`==> Building image from preset: ...
==> Image generation successful
Generating grub configuration file ...
done`}
      />

      <TerminalBlock
        comment="reinicie e tire o USB"
        command="exit && umount -R /mnt && reboot"
      />

      <h2>9. Dual-boot com Windows</h2>

      <TerminalBlock
        comment="primeiro instale o os-prober"
        command="sudo pacman -S os-prober ntfs-3g"
      />

      <TerminalBlock
        comment="habilite a detecção"
        command='sudo sed -i "s/^#GRUB_DISABLE_OS_PROBER=false/GRUB_DISABLE_OS_PROBER=false/" /etc/default/grub'
      />

      <TerminalBlock
        command="sudo grub-mkconfig -o /boot/grub/grub.cfg"
        output={`Generating grub configuration file ...
Found theme: /boot/grub/themes/arch/theme.txt
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/intel-ucode.img /boot/initramfs-linux.img
Found fallback initrd image(s) in /boot:  initramfs-linux-fallback.img
Warning: os-prober will be executed to detect other bootable partitions.
Found Windows Boot Manager on /dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi
done`}
      />

      <AlertBox type="danger" title="Cuidado com Fast Boot e BitLocker">
        Desligue o <strong>Fast Startup</strong> no Windows (ele deixa o filesystem NTFS num estado
        sujo) e suspenda o <strong>BitLocker</strong> antes de mudar partições. Caso contrário o
        Windows vai pedir chave de recuperação no próximo boot.
      </AlertBox>

      <h2>10. Diagnóstico do boot</h2>

      <TerminalBlock
        command="systemd-analyze"
        output={`Startup finished in 4.821s (firmware) + 2.103s (loader) + 1.612s (kernel) + 3.418s (userspace) = 11.954s
graphical.target reached after 3.417s in userspace.`}
      />

      <TerminalBlock
        command="systemd-analyze blame | head -8"
        output={`1.412s NetworkManager-wait-online.service
 612ms systemd-udev-trigger.service
 384ms ldconfig.service
 287ms systemd-journal-flush.service
 198ms upower.service
 176ms ModemManager.service
 142ms systemd-logind.service
 128ms polkit.service`}
      />

      <TerminalBlock
        command="dmesg | head -10"
        output={`[    0.000000] Linux version 6.12.1-arch1-1 (linux@archlinux) (gcc (GCC) 14.2.1 20240910) #1 SMP PREEMPT_DYNAMIC Tue, 19 Nov 2024 17:01:53 +0000
[    0.000000] Command line: initrd=\\intel-ucode.img initrd=\\initramfs-linux.img root=UUID=8c2b1d4a-... rw quiet
[    0.000000] KERNEL supported cpus:
[    0.000000]   Intel GenuineIntel
[    0.000000]   AMD AuthenticAMD
[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000001000-0x0000000000057fff] usable
[    0.000000] BIOS-e820: [mem 0x0000000000058000-0x0000000000058fff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000059000-0x000000000009dfff] usable`}
      />

      <h2>11. Resumo prático</h2>

      <OutputBlock
        title="comandos de bolso"
        output={`# checagens rápidas
[ -d /sys/firmware/efi ] && echo UEFI
findmnt /boot
ls /boot

# atualizar cada bootloader
sudo grub-mkconfig -o /boot/grub/grub.cfg     # GRUB
sudo bootctl update                             # systemd-boot

# regenerar initramfs (sempre que mudar mkinitcpio.conf, kernel ou módulos)
sudo mkinitcpio -P

# manipular NVRAM
sudo efibootmgr -v
sudo efibootmgr -o 0001,0000

# rescue (de dentro do live USB)
mount /dev/nvmeXn1p3 /mnt
mount /dev/nvmeXn1p1 /mnt/boot
arch-chroot /mnt`}
      />
    </PageContainer>
  );
}
