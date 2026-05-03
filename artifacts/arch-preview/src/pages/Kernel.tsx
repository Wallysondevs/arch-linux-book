import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Kernel() {
  return (
    <PageContainer
      title="Kernel — variantes, módulos, sysctl e DKMS"
      subtitle="linux, linux-lts, linux-zen, linux-hardened: qual escolher? Como gerenciar módulos com modprobe/lsmod, ajustar sysctl e compilar drivers fora-da-árvore com DKMS."
      difficulty="avancado"
      timeToRead="45 min"
      category="Sistema"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch instalado, <code>sudo</code>. Arch oferece vários kernels: <code>linux</code> (estável), <code>linux-lts</code> (LTS), <code>linux-zen</code> (gaming/desktop), <code>linux-hardened</code> (segurança).
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Kernel</strong> — núcleo do sistema operacional. No Arch o pacote chama <code>linux</code>.
      </p>
      <p>
        <strong>linux-lts</strong> — versão long-term support — kernel mais antigo, mais estável.
      </p>
      <p>
        <strong>linux-zen</strong> — patches voltados para responsividade desktop e gaming.
      </p>
      <p>
        <strong>mkinitcpio</strong> — gera o initramfs sempre que o kernel atualiza (hook automático).
      </p>
      <p>
        <strong>Módulo</strong> — driver carregável. <code>lsmod</code>, <code>modprobe</code>.
      </p>

      <p>
        O Arch é uma das distros mais "kernel-friendly" — você pode ter quatro kernels instalados ao
        mesmo tempo e escolher no menu do bootloader qual rodar. Esta página cobre as variantes
        oficiais, como o sistema de módulos funciona, ajustes em <code>sysctl</code> e o caminho
        do DKMS para drivers fora da árvore.
      </p>

      <h2>1. Variantes oficiais do kernel</h2>

      <OutputBlock
        title="kernels disponíveis nos repos oficiais"
        output={`linux             kernel mainline estável (atualizado a cada release)
linux-lts         versão Long Term Support (atualizações conservadoras)
linux-zen         tweaks p/ desktop interativo (low-latency, scheduler MuQSS-like)
linux-hardened    foco em segurança (KSPP patches, SLAB hardening, sem PERF)
linux-rt          real-time PREEMPT_RT (extra repo)`}
        annotations={[
          { line: 0, note: "padrão pacstrap — bom para 95% dos casos" },
          { line: 1, note: "use em servidor / quando driver/firmware não suporta o mais novo" },
          { line: 2, note: "perceptivelmente mais responsivo no desktop" },
          { line: 3, note: "ótimo p/ servidor exposto, perde alguns recursos de profiling" },
          { line: 4, note: "áudio profissional, robótica, controle industrial" },
        ]}
      />

      <TerminalBlock
        command="pacman -Ss '^linux$' '^linux-lts$' '^linux-zen$' '^linux-hardened$'"
        output={`core/linux 6.12.1.arch1-1 [installed]
    The Linux kernel and modules
core/linux-lts 6.6.63-1
    The LTS Linux kernel and modules
extra/linux-zen 6.12.1.zen1-1
    The Linux ZEN kernel and modules
extra/linux-hardened 6.11.10.hardened1-1
    The Security-Hardened Linux kernel and modules`}
      />

      <TerminalBlock
        comment="instalar mais um kernel ao lado do atual"
        command="sudo pacman -S linux-lts linux-lts-headers"
        output={`Packages (4) linux-lts-6.6.63-1  linux-lts-headers-6.6.63-1
              linux-firmware-20241110.3b128b60-1  linux-api-headers-6.11-1

Total Installed Size:  362.42 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <AlertBox type="success" title="Sempre tenha um segundo kernel">
        Quando o <code>linux</code> ganha um patch ruim e não boota, ter <code>linux-lts</code>{" "}
        pré-instalado salva sua noite. No menu do GRUB/systemd-boot ele já aparece automaticamente.
      </AlertBox>

      <h2>2. Identificando o kernel rodando</h2>

      <TerminalBlock command="uname -r" output="6.12.1-arch1-1" />
      <TerminalBlock command="uname -a" output={`Linux archlinux 6.12.1-arch1-1 #1 SMP PREEMPT_DYNAMIC Tue, 19 Nov 2024 17:01:53 +0000 x86_64 GNU/Linux`} />

      <TerminalBlock
        comment="qual binário foi carregado?"
        command="ls -lh /boot/vmlinuz-*"
        output={`-rwxr-xr-x 1 root root 13M Nov 19 14:03 /boot/vmlinuz-linux
-rwxr-xr-x 1 root root 12M Nov 14 09:21 /boot/vmlinuz-linux-lts`}
      />

      <TerminalBlock
        comment="quem instalou esse kernel?"
        command="pacman -Qo /boot/vmlinuz-linux"
        output="/boot/vmlinuz-linux is owned by linux 6.12.1.arch1-1"
      />

      <TerminalBlock
        comment="qual config foi usada para compilá-lo?"
        command="zcat /proc/config.gz | head -8"
        output={`#
# Automatically generated file; DO NOT EDIT.
# Linux/x86 6.12.1-arch1 Kernel Configuration
#
CONFIG_CC_VERSION_TEXT="gcc (GCC) 14.2.1 20240910"
CONFIG_CC_IS_GCC=y
CONFIG_GCC_VERSION=140201
CONFIG_CLANG_VERSION=0`}
      />

      <h2>3. Módulos do kernel</h2>

      <p>
        Drivers de dispositivo são <strong>módulos</strong> (.ko) carregados sob demanda. Vivem em{" "}
        <code>/usr/lib/modules/$(uname -r)/</code>. O kernel descobre qual módulo carregar para cada
        device via aliases declarados pelos próprios módulos.
      </p>

      <TerminalBlock
        command="ls /usr/lib/modules/$(uname -r)/"
        output={`build              modules.alias       modules.devname    modules.softdep
kernel             modules.alias.bin   modules.order      modules.symbols
modules.builtin    modules.builtin.bin modules.symbols.bin
modules.dep        modules.builtin.modinfo`}
      />

      <h3>lsmod — quais estão carregados</h3>

      <TerminalBlock
        command="lsmod | head -10"
        output={`Module                  Size  Used by
nvme                   86016  3
nvme_core             237568  4 nvme
nvme_auth              28672  1 nvme_core
i915                 4042752  18
intel_gtt              28672  1 i915
drm_buddy              24576  1 i915
ttm                   118784  1 i915
drm_display_helper    270336  1 i915`}
      />

      <OutputBlock
        title="anatomia da saída de lsmod"
        output={`Module                  Size  Used by
nvme                   86016  3
nvme_core             237568  4 nvme`}
        annotations={[
          { line: 1, note: "nome · bytes ocupados · refcount" },
          { line: 2, note: "Used by: 4 → 4 outros módulos dependem dele; 'nvme' é um deles" },
        ]}
      />

      <h3>modinfo — detalhes de um módulo</h3>

      <TerminalBlock
        command="modinfo i915 | head -15"
        output={`filename:       /lib/modules/6.12.1-arch1-1/kernel/drivers/gpu/drm/i915/i915.ko.zst
license:        GPL and additional rights
description:    Intel Graphics
author:         Tungsten Graphics, Inc.
author:         Intel Corporation
firmware:       i915/dg2_huc_gsc.bin
firmware:       i915/dg2_guc_70.bin
alias:          pci:v00008086d000056C2sv*sd*bc03sc*i*
alias:          pci:v00008086d000056C1sv*sd*bc03sc*i*
depends:        drm,drm_buddy,drm_display_helper,ttm,video,i2c-algo-bit
retpoline:      Y
intree:         Y
name:           i915
vermagic:       6.12.1-arch1-1 SMP preempt mod_unload`}
      />

      <h3>modprobe — carregar / descarregar</h3>

      <CommandFlagList
        command="modprobe"
        items={[
          { flag: "modprobe MOD", description: "Carrega o módulo (e suas dependências).", example: "sudo modprobe v4l2loopback" },
          { flag: "-r", long: "--remove", description: "Descarrega.", example: "sudo modprobe -r nouveau" },
          { flag: "-v", description: "Verbose: mostra quais arquivos são lidos." },
          { flag: "-n", description: "Dry-run: não faz nada, só imprime o que faria." },
          { flag: "-D", description: "Mostra dependências sem carregar." },
          { flag: "--first-time", description: "Falha se o módulo já estava carregado (útil em scripts)." },
        ]}
      />

      <TerminalBlock
        command="sudo modprobe v4l2loopback"
        output=""
      />

      <TerminalBlock
        command="lsmod | grep v4l2"
        output={`v4l2loopback           53248  0
videodev              335872  3 v4l2loopback,videobuf2_v4l2,uvcvideo`}
      />

      <TerminalBlock
        command="sudo modprobe -r v4l2loopback"
      />

      <h3>Carregar módulo no boot</h3>

      <TerminalBlock
        command={`echo 'v4l2loopback' | sudo tee /etc/modules-load.d/webcam.conf`}
        output="v4l2loopback"
      />

      <h3>Passar parâmetros a um módulo</h3>

      <CodeBlock
        title="/etc/modprobe.d/v4l2loopback.conf"
        code={`options v4l2loopback devices=1 video_nr=10 card_label="OBS Camera" exclusive_caps=1`}
      />

      <TerminalBlock
        command="sudo modprobe v4l2loopback && cat /sys/module/v4l2loopback/parameters/card_label"
        output="OBS Camera"
      />

      <h3>Blacklist de módulo</h3>

      <CodeBlock
        title="/etc/modprobe.d/nouveau-blacklist.conf"
        code={`blacklist nouveau
install nouveau /bin/true`}
      />

      <TerminalBlock
        comment="precisa regenerar initramfs depois"
        command="sudo mkinitcpio -P"
      />

      <h2>4. sysctl — parâmetros do kernel em runtime</h2>

      <p>
        O sistema <code>/proc/sys</code> expõe centenas de parâmetros (rede, memória, kernel) que
        podem ser ajustados sem reboot via <code>sysctl</code>.
      </p>

      <TerminalBlock
        command="sysctl -a 2>/dev/null | wc -l"
        output="1283"
      />

      <TerminalBlock
        command="sysctl vm.swappiness"
        output="vm.swappiness = 60"
      />

      <TerminalBlock
        comment="alterar em runtime (não persiste após reboot)"
        command="sudo sysctl -w vm.swappiness=10"
        output="vm.swappiness = 10"
      />

      <CodeBlock
        title="/etc/sysctl.d/99-tweaks.conf — persistir"
        code={`# Reduzir agressividade do swap (laptop com SSD)
vm.swappiness = 10
vm.vfs_cache_pressure = 50

# Network: mais buffers TCP
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216

# Segurança: ignorar pings e spoofing básico
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Permitir mais inotify watchers (IDEs como VS Code adoram)
fs.inotify.max_user_watches = 524288

# Magic SysRq parcial (somente sync e reboot)
kernel.sysrq = 176`}
      />

      <TerminalBlock
        comment="aplica sem reboot"
        command="sudo sysctl --system"
        output={`* Applying /usr/lib/sysctl.d/10-arch.conf ...
* Applying /usr/lib/sysctl.d/50-default.conf ...
* Applying /etc/sysctl.d/99-tweaks.conf ...
vm.swappiness = 10
vm.vfs_cache_pressure = 50
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.icmp_echo_ignore_broadcasts = 1
fs.inotify.max_user_watches = 524288
kernel.sysrq = 176`}
      />

      <CommandFlagList
        command="sysctl"
        items={[
          { flag: "-a", description: "Lista todos os parâmetros." },
          { flag: "-w KEY=VAL", description: "Set em runtime.", example: "sudo sysctl -w net.ipv4.ip_forward=1" },
          { flag: "-p [FILE]", description: "Recarrega de um arquivo específico." },
          { flag: "--system", description: "Aplica TODOS os arquivos em /etc/sysctl.d/, /usr/lib/sysctl.d/." },
          { flag: "-n", description: "Suprime o nome (só o valor). Útil em scripts." },
        ]}
      />

      <h2>5. DKMS — drivers fora da árvore que recompilam sozinhos</h2>

      <p>
        DKMS (<em>Dynamic Kernel Module Support</em>) recompila automaticamente drivers de terceiros
        toda vez que você atualiza o kernel — coisas como <code>nvidia-dkms</code>, drivers de
        Wi-Fi modernos do AUR, módulos VirtualBox.
      </p>

      <TerminalBlock
        command="sudo pacman -S dkms linux-headers linux-lts-headers"
        output={`Packages (3) dkms-3.1.4-1  linux-headers-6.12.1.arch1-1  linux-lts-headers-6.6.63-1

Total Installed Size:  142.18 MiB`}
      />

      <AlertBox type="warning" title="Sempre instale headers do kernel correspondente">
        DKMS precisa dos <strong>headers</strong> de cada kernel instalado para compilar.
        Tem <code>linux</code>? Instale <code>linux-headers</code>. Tem também{" "}
        <code>linux-lts</code>? Instale <code>linux-lts-headers</code> também.
      </AlertBox>

      <TerminalBlock
        comment="exemplo: módulo nvidia"
        command="sudo pacman -S nvidia-dkms"
        output={`==> dkms install --no-depmod nvidia/565.77 -k 6.12.1-arch1-1
Sign command: /lib/modules/6.12.1-arch1-1/build/scripts/sign-file
Building module:
Cleaning build area...
'make' -j12 modules KERNEL_UNAME=6.12.1-arch1-1.....
Cleaning build area...

nvidia.ko.zst:
Running module version sanity check.
 - Original module
   - No original module exists within this kernel
 - Installation
   - Installing to /lib/modules/6.12.1-arch1-1/extra/

depmod...
==> dkms install --no-depmod nvidia/565.77 -k 6.6.63-1-lts
... (compila para o linux-lts também)
Done.`}
      />

      <TerminalBlock
        command="dkms status"
        output={`nvidia/565.77, 6.12.1-arch1-1, x86_64: installed
nvidia/565.77, 6.6.63-1-lts, x86_64: installed`}
      />

      <CommandFlagList
        command="dkms"
        items={[
          { flag: "status", description: "Lista módulos DKMS, kernels e estado (installed/built)." },
          { flag: "install MOD/VER -k KERNEL", description: "Compila e instala manualmente.", example: "sudo dkms install nvidia/565.77 -k 6.12.1-arch1-1" },
          { flag: "remove MOD/VER --all", description: "Remove de todos os kernels." },
          { flag: "autoinstall", description: "Instala módulos pendentes para o kernel atual.", example: "sudo dkms autoinstall" },
        ]}
      />

      <h2>6. Verificando suporte a hardware e firmware</h2>

      <TerminalBlock
        comment="firmware necessário e se está faltando algum"
        command="dmesg | grep -i firmware | head -5"
        output={`[    1.842k] Loading firmware: i915/dg2_huc_gsc.bin
[    1.853k] iwlwifi 0000:02:00.0: loaded firmware version 89.f1c41b06.0 ty-a0-gf-a0-89.ucode op_mode iwlmvm
[    1.901k] Bluetooth: hci0: Minimum firmware build 1 week 10 2014
[    1.902k] Bluetooth: hci0: Found device firmware: intel/ibt-0040-0041.sfi`}
      />

      <TerminalBlock
        command="sudo pacman -S linux-firmware"
        output={`warning: linux-firmware-20241110.3b128b60-1 is up to date -- reinstalling
Total Installed Size: 754.32 MiB

:: Proceed with installation? [Y/n]`}
      />

      <h2>7. Painel /proc e /sys — espelhos do kernel</h2>

      <OutputBlock
        title="atalhos úteis"
        output={`/proc/version          versão completa do kernel
/proc/cmdline          parâmetros passados no boot
/proc/cpuinfo          info por CPU
/proc/meminfo          memória detalhada
/proc/modules          módulos carregados (raw, lsmod usa isso)
/proc/sys/             todos os parâmetros sysctl
/sys/module/X/         parâmetros e estado do módulo X
/sys/class/            devices agrupados por classe (net, block, leds...)
/sys/firmware/         dados do firmware (efivars, dmi)`}
      />

      <TerminalBlock
        command="cat /sys/class/thermal/thermal_zone0/temp"
        output="48000"
      />

      <p>(48000 = 48.0 °C — divide por 1000)</p>

      <h2>8. Recompilar / atualizar — ciclo prático</h2>

      <OutputBlock
        title="quando regenerar initramfs"
        output={`mudou /etc/mkinitcpio.conf  →  sudo mkinitcpio -P
adicionou módulo no MODULES=() →  sudo mkinitcpio -P
trocou de zstd p/ xz       →  sudo mkinitcpio -P
fez sudo pacman -S linux*  →  pacman hook regenera sozinho`}
      />

      <TerminalBlock
        comment="depois de instalar nvidia-dkms ou parecido — força rebuild dos initramfs"
        command="sudo mkinitcpio -P"
      />

      <h2>9. Resumo prático</h2>

      <OutputBlock
        title="cheat sheet"
        output={`# inspeção
uname -a
lsmod
modinfo MOD
cat /proc/cmdline

# carregar / descarregar
sudo modprobe MOD
sudo modprobe -r MOD

# persistir
echo MOD | sudo tee /etc/modules-load.d/MOD.conf
echo 'options MOD param=valor' | sudo tee /etc/modprobe.d/MOD.conf
echo 'blacklist MOD' | sudo tee /etc/modprobe.d/MOD-blacklist.conf

# sysctl
sysctl -a | grep KEY
sudo sysctl -w KEY=VAL                            # runtime
sudo nano /etc/sysctl.d/99-tweaks.conf            # persistente
sudo sysctl --system

# DKMS
sudo pacman -S dkms linux-headers
dkms status
sudo dkms autoinstall`}
      />
    </PageContainer>
  );
}
