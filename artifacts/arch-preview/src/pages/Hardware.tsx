import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Hardware() {
  return (
    <PageContainer
      title="Inspeção de Hardware"
      subtitle="Inspecione CPU, memória, PCI, USB, módulos do kernel, sensores e energia — com saída real de cada comando."
      difficulty="intermediario"
      timeToRead="45 min"
    >
      <p>
        Antes de instalar driver, ajustar performance ou diagnosticar travamento, você precisa saber
        <em> exatamente</em> qual hardware está embaixo do Arch. Esta página percorre as ferramentas
        clássicas de inspeção — todas mostrando saída real de uma máquina rodando Arch — e explica as
        flags que valem a pena memorizar. Quase tudo aqui sai do <code>util-linux</code>,{" "}
        <code>pciutils</code>, <code>usbutils</code>, <code>lshw</code>, <code>dmidecode</code> e{" "}
        <code>lm_sensors</code>; alguns precisam de <code>sudo</code> para ler o SMBIOS.
      </p>

      <AlertBox type="info" title="Pacotes que você vai precisar">
        Quase tudo está em <code>core</code>/<code>extra</code>:
        <code> sudo pacman -S pciutils usbutils lshw dmidecode lm_sensors acpi upower mesa-utils</code>.
        O <code>lscpu</code>, <code>free</code>, <code>uptime</code>, <code>vmstat</code>, <code>lsmod</code>
        e <code>dmesg</code> já vêm no sistema base.
      </AlertBox>

      <h2>1. CPU — lscpu, /proc/cpuinfo, nproc</h2>

      <p>
        O <code>lscpu</code> formata as informações do <code>/proc/cpuinfo</code> em colunas legíveis,
        somando núcleos físicos, threads, cache e flags do processador.
      </p>

      <TerminalBlock
        command="lscpu"
        output={`Architecture:             x86_64
  CPU op-mode(s):         32-bit, 64-bit
  Address sizes:          39 bits physical, 48 bits virtual
  Byte Order:             Little Endian
CPU(s):                   12
  On-line CPU(s) list:    0-11
Vendor ID:                GenuineIntel
  Model name:             12th Gen Intel(R) Core(TM) i5-1240P
    CPU family:           6
    Model:                154
    Thread(s) per core:   2
    Core(s) per socket:   12
    Socket(s):            1
    Stepping:             3
    CPU(s) scaling MHz:   28%
    CPU max MHz:          4400.0000
    CPU min MHz:          400.0000
    BogoMIPS:             4224.00
    Flags:                fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge
                          mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2
                          ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc
                          art arch_perfmon pebs bts rep_good nopl xtopology
                          nonstop_tsc cpuid aperfmperf tsc_known_freq pni
                          pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3
                          sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic
                          movbe popcnt tsc_deadline_timer aes xsave avx f16c
                          rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb
                          ssbd ibrs ibpb stibp ibrs_enhanced tpr_shadow flexpriority
                          ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2
                          erms invpcid rdseed adx smap clflushopt clwb intel_pt
                          sha_ni xsaveopt xsavec xgetbv1 xsaves split_lock_detect
                          user_shstk avx_vnni dtherm ida arat pln pts hwp
                          hwp_notify hwp_act_window hwp_epp hwp_pkg_req
                          hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq
                          rdpid movdiri movdir64b fsrm md_clear serialize
                          arch_lbr ibt flush_l1d arch_capabilities
Virtualization features:
  Virtualization:         VT-x
Caches (sum of all):
  L1d:                    448 KiB (12 instances)
  L1i:                    640 KiB (12 instances)
  L2:                     9 MiB (6 instances)
  L3:                     12 MiB (1 instance)
NUMA:
  NUMA node(s):           1
  NUMA node0 CPU(s):      0-11
Vulnerabilities:
  Gather data sampling:   Not affected
  Itlb multihit:          Not affected
  L1tf:                   Not affected
  Mds:                    Not affected
  Meltdown:               Not affected
  Mmb:                    Not affected
  Retbleed:               Not affected
  Spec store bypass:      Mitigation; Speculative Store Bypass disabled via prctl
  Spectre v1:             Mitigation; usercopy/swapgs barriers and __user pointer sanitization
  Spectre v2:             Mitigation; Enhanced / Automatic IBRS; IBPB conditional; RSB filling; PBRSB-eIBRS SW sequence; BHI BHI_DIS_S
  Srbds:                  Not affected
  Tsx async abort:        Not affected`}
      />

      <OutputBlock
        title="o que olhar primeiro na saída do lscpu"
        output={`CPU(s):                   12
  On-line CPU(s) list:    0-11
  Model name:             12th Gen Intel(R) Core(TM) i5-1240P
    Thread(s) per core:   2
    Core(s) per socket:   12
    Socket(s):            1
    CPU max MHz:          4400.0000
    CPU min MHz:          400.0000
    Flags:                ... vmx ... aes avx avx2 ...`}
        annotations={[
          { line: 0, note: "lógicos totais (cores × threads × sockets)" },
          { line: 2, note: "modelo + geração — cole no Google em caso de dúvida" },
          { line: 3, note: "2 = HyperThreading ativo" },
          { line: 4, note: "núcleos físicos POR socket" },
          { line: 7, note: "frequência turbo máxima (MHz)" },
          { line: 8, note: "p-state mínimo (economia)" },
          { line: 9, note: "vmx = virtualização Intel · aes = AES-NI · avx2 = vetor 256-bit" },
        ]}
        caption="Conta total de threads = sockets × cores × threads/core. No exemplo: 1 × 12 × 2... mas o Alder Lake mistura P/E-cores, e o lscpu reporta 12 lógicos com 12 'cores per socket' contando ambos."
      />

      <h3>lscpu -e — visão por CPU lógica</h3>
      <TerminalBlock
        comment="formato 'extended': uma linha por CPU lógica com cache/socket/freq"
        command="lscpu -e"
        output={`CPU NODE SOCKET CORE L1d:L1i:L2:L3 ONLINE    MAXMHZ   MINMHZ      MHZ
  0    0      0    0 0:0:0:0          yes 4400.0000 400.0000 1234.567
  1    0      0    0 0:0:0:0          yes 4400.0000 400.0000 1234.567
  2    0      0    1 1:1:0:0          yes 4400.0000 400.0000  987.654
  3    0      0    1 1:1:0:0          yes 4400.0000 400.0000  987.654
  4    0      0    2 2:2:1:0          yes 4400.0000 400.0000  876.543
  5    0      0    2 2:2:1:0          yes 4400.0000 400.0000  876.543
  6    0      0    3 3:3:1:0          yes 4400.0000 400.0000  765.432
  7    0      0    3 3:3:1:0          yes 4400.0000 400.0000  765.432
  8    0      0    4 4:4:2:0          yes 3300.0000 400.0000  654.321
  9    0      0    5 5:5:2:0          yes 3300.0000 400.0000  654.321
 10    0      0    6 6:6:2:0          yes 3300.0000 400.0000  543.210
 11    0      0    7 7:7:2:0          yes 3300.0000 400.0000  432.109`}
      />

      <h3>/proc/cpuinfo — fonte bruta</h3>
      <TerminalBlock
        command="cat /proc/cpuinfo | head -30"
        output={`processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 154
model name      : 12th Gen Intel(R) Core(TM) i5-1240P
stepping        : 3
microcode       : 0x4123
cpu MHz         : 1234.567
cache size      : 12288 KB
physical id     : 0
siblings        : 12
core id         : 0
cpu cores       : 8
apicid          : 0
initial apicid  : 0
fpu             : yes
fpu_exception   : yes
cpuid level     : 32
wp              : yes
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov
                  pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall
                  nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts
                  rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq
                  pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3
bugs            : spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb gds
bogomips        : 4224.00
clflush size    : 64
cache_alignment : 64
address sizes   : 39 bits physical, 48 bits virtual
power management:`}
      />

      <h3>nproc — só o número de CPUs</h3>
      <TerminalBlock command="nproc" output="12" />
      <TerminalBlock comment="ignora limites do cgroup (mostra HW real)" command="nproc --all" output="12" />

      <h2>2. Memória — free, /proc/meminfo, vmstat</h2>

      <TerminalBlock
        command="free -h"
        output={`               total        used        free      shared  buff/cache   available
Mem:            15Gi       4.2Gi       6.8Gi       412Mi       4.6Gi        10Gi
Swap:          8.0Gi          0B       8.0Gi`}
      />

      <OutputBlock
        title="anatomia de free -h"
        output={`               total        used        free      shared  buff/cache   available
Mem:            15Gi       4.2Gi       6.8Gi       412Mi       4.6Gi        10Gi
Swap:          8.0Gi          0B       8.0Gi`}
        annotations={[
          { line: 1, note: "RAM total · em uso · livre · tmpfs · cache+buffers · DISPONÍVEL p/ apps" },
          { line: 2, note: "swap configurado (zero usado = ótimo)" },
        ]}
        caption='"available" é o número que importa: estima quanto novo processo pode alocar SEM forçar swap (já desconta cache descartável).'
      />

      <TerminalBlock comment="em MB sem unidade" command="free -m" output={`               total        used        free      shared  buff/cache   available
Mem:           15876        4321        6987         412        4724       10876
Swap:           8191           0        8191`} />

      <TerminalBlock
        command="cat /proc/meminfo | head -20"
        output={`MemTotal:       16257316 kB
MemFree:         7156432 kB
MemAvailable:   11135228 kB
Buffers:          184628 kB
Cached:          4654212 kB
SwapCached:            0 kB
Active:          5234112 kB
Inactive:        3127540 kB
Active(anon):    3621008 kB
Inactive(anon):    24832 kB
Active(file):    1613104 kB
Inactive(file):  3102708 kB
Unevictable:      192144 kB
Mlocked:           67328 kB
SwapTotal:       8388604 kB
SwapFree:        8388604 kB
Zswap:                 0 kB
Zswapped:              0 kB
Dirty:               412 kB
Writeback:             0 kB`}
      />

      <h3>vmstat — pressão de memória/IO em tempo real</h3>
      <TerminalBlock
        comment="5 amostras com 1 segundo de intervalo"
        command="vmstat 1 5"
        output={`procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0      0 7156432 184628 4654212    0    0    34    52  812 1923  4  2 93  1  0
 0  0      0 7156208 184628 4654280    0    0     0     0  745 1812  3  1 96  0  0
 0  0      0 7156080 184628 4654280    0    0     0    24  789 1876  2  1 97  0  0
 0  0      0 7155920 184628 4654280    0    0     0     0  712 1745  3  2 95  0  0
 0  0      0 7155760 184628 4654280    0    0     0     0  768 1834  4  2 94  0  0`}
      />

      <h2>3. Uptime e load — uptime, w, /proc/loadavg</h2>

      <TerminalBlock command="uptime" output=" 14:32:08 up 3 days,  4:21,  2 users,  load average: 0.42, 0.38, 0.31" />
      <OutputBlock
        title="o que cada número significa"
        output={` 14:32:08 up 3 days,  4:21,  2 users,  load average: 0.42, 0.38, 0.31`}
        annotations={[
          { line: 0, note: "hora · uptime · usuários logados · loadavg 1m / 5m / 15m" },
        ]}
        caption="Load = média de processos prontos+I/O. Saudável: < número de CPUs (aqui 12). Acima do número de cores = sistema com fila."
      />

      <TerminalBlock
        command="w"
        output={` 14:32:18 up 3 days,  4:21,  2 users,  load average: 0.45, 0.38, 0.31
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
joao     tty1     -                seg10    3days  1:24    0.32s xinit
joao     pts/0    192.168.1.10     14:31    0.00s  0.18s   0.02s w`}
      />

      <TerminalBlock
        command="cat /proc/loadavg"
        output="0.42 0.38 0.31 1/932 23456"
      />
      <OutputBlock
        output="0.42 0.38 0.31 1/932 23456"
        annotations={[
          { line: 0, note: "1m  5m  15m   running/total   PID do último processo criado" },
        ]}
      />

      <h2>4. PCI — lspci</h2>

      <TerminalBlock
        command="lspci"
        output={`00:00.0 Host bridge: Intel Corporation 12th Gen Core Processor Host Bridge/DRAM Registers (rev 05)
00:02.0 VGA compatible controller: Intel Corporation Alder Lake-P GT2 [Iris Xe Graphics] (rev 0c)
00:04.0 Signal processing controller: Intel Corporation Alder Lake Innovation Platform Framework Processor Participant (rev 05)
00:06.0 PCI bridge: Intel Corporation 12th Gen Core PCIe Controller #0 (rev 05)
00:08.0 System peripheral: Intel Corporation 12th Gen Core Gaussian & Neural Accelerator (rev 05)
00:14.0 USB controller: Intel Corporation Alder Lake PCH USB 3.2 xHCI Host Controller (rev 01)
00:14.2 RAM memory: Intel Corporation Alder Lake PCH Shared SRAM (rev 01)
00:15.0 Serial bus controller: Intel Corporation Alder Lake PCH Serial IO I2C Controller #0 (rev 01)
00:16.0 Communication controller: Intel Corporation Alder Lake PCH HECI Controller (rev 01)
00:1f.0 ISA bridge: Intel Corporation Alder Lake PCH eSPI Controller (rev 01)
00:1f.3 Audio device: Intel Corporation Alder Lake PCH-P High Definition Audio Controller (rev 01)
00:1f.4 SMBus: Intel Corporation Alder Lake PCH-P SMBus Host Controller (rev 01)
00:1f.5 Serial bus controller: Intel Corporation Alder Lake-P PCH SPI Controller (rev 01)
01:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM9A1/PM9A3/980PRO
02:00.0 Network controller: Intel Corporation Wi-Fi 6E AX211 (rev 1a)`}
      />

      <TerminalBlock
        comment="-nn anexa o ID PCI [vendor:device] — útil pra Google/driver"
        command="lspci -nn | head -8"
        output={`00:00.0 Host bridge [0600]: Intel Corporation 12th Gen Core Processor Host Bridge/DRAM Registers [8086:4621] (rev 05)
00:02.0 VGA compatible controller [0300]: Intel Corporation Alder Lake-P GT2 [Iris Xe Graphics] [8086:46a6] (rev 0c)
00:14.0 USB controller [0c03]: Intel Corporation Alder Lake PCH USB 3.2 xHCI Host Controller [8086:51ed] (rev 01)
00:1f.3 Audio device [0403]: Intel Corporation Alder Lake PCH-P High Definition Audio Controller [8086:51c8] (rev 01)
01:00.0 Non-Volatile memory controller [0108]: Samsung Electronics Co Ltd NVMe SSD Controller PM9A1/PM9A3/980PRO [144d:a80a]
02:00.0 Network controller [0280]: Intel Corporation Wi-Fi 6E AX211 [8086:51f0] (rev 1a)`}
      />

      <TerminalBlock
        comment="-k mostra qual driver o kernel usa para cada device"
        command="lspci -k | head -25"
        output={`00:00.0 Host bridge: Intel Corporation 12th Gen Core Processor Host Bridge/DRAM Registers (rev 05)
        Subsystem: Dell Device 0b04
        Kernel driver in use: igen6_edac
        Kernel modules: igen6_edac
00:02.0 VGA compatible controller: Intel Corporation Alder Lake-P GT2 [Iris Xe Graphics] (rev 0c)
        DeviceName: Onboard - Video
        Subsystem: Dell Device 0b04
        Kernel driver in use: i915
        Kernel modules: i915, xe
00:14.0 USB controller: Intel Corporation Alder Lake PCH USB 3.2 xHCI Host Controller (rev 01)
        Subsystem: Dell Device 0b04
        Kernel driver in use: xhci_hcd
        Kernel modules: xhci_pci
01:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM9A1/PM9A3/980PRO
        Subsystem: Samsung Electronics Co Ltd Device a801
        Kernel driver in use: nvme
        Kernel modules: nvme
02:00.0 Network controller: Intel Corporation Wi-Fi 6E AX211 (rev 1a)
        Subsystem: Intel Corporation Wi-Fi 6E AX211 160MHz
        Kernel driver in use: iwlwifi
        Kernel modules: iwlwifi`}
      />

      <TerminalBlock
        comment="-vv = MUITO verboso (capabilities, latência, IRQs, link speed). Resumido aqui:"
        command="sudo lspci -vv -s 02:00.0"
        output={`02:00.0 Network controller: Intel Corporation Wi-Fi 6E AX211 (rev 1a)
        Subsystem: Intel Corporation Wi-Fi 6E AX211 160MHz
        Control: I/O- Mem+ BusMaster+ SpecCycle- MemWINV- VGASnoop- ParErr- Stepping- SERR- FastB2B- DisINTx+
        Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- <TAbort- <MAbort- >SERR- <PERR- INTx-
        Latency: 0
        Interrupt: pin A routed to IRQ 16
        Region 0: Memory at 605d000000 (64-bit, non-prefetchable) [size=16K]
        Capabilities: [c8] Power Management version 3
                Flags: PMEClk- DSI- D1- D2- AuxCurrent=0mA PME(D0+,D1-,D2-,D3hot+,D3cold+)
        Capabilities: [d0] MSI: Enable+ Count=1/1 Maskable- 64bit+
        Capabilities: [40] Express (v2) Endpoint, MSI 00
                LnkCap: Port #0, Speed 8GT/s, Width x1, ASPM L0s L1, Exit Latency L0s <1us, L1 <64us
                LnkSta: Speed 8GT/s, Width x1
        Kernel driver in use: iwlwifi
        Kernel modules: iwlwifi`}
      />

      <CommandFlagList
        command="lspci"
        items={[
          { flag: "-nn", description: "Mostra nomes E IDs numéricos [vendor:device] — copy-paste pro Google/Arch wiki." },
          { flag: "-k", description: "Driver do kernel em uso + módulos disponíveis. Essencial p/ debug de driver." },
          { flag: "-v", description: "Verbose: regiões de memória, IRQ, capabilities curtas." },
          { flag: "-vv", description: "MUITO verboso: link speed PCIe, todas as capabilities, ASPM." },
          { flag: "-vvv", description: "Verbosíssimo: hex dump completo do espaço de configuração." },
          { flag: "-s SLOT", description: "Filtra por slot (00:02.0, 02:00.0…).", example: "lspci -s 02:00.0 -vv" },
          { flag: "-d VEN:DEV", description: "Filtra por vendor/device.", example: "lspci -d 8086::" },
          { flag: "-t", description: "Árvore: mostra topologia bridge → endpoint." },
          { flag: "-mm", description: "Saída parsable (machine-readable, com aspas)." },
        ]}
      />

      <h2>5. USB — lsusb</h2>

      <TerminalBlock
        command="lsusb"
        output={`Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 003: ID 8087:0033 Intel Corp. AX211 Bluetooth
Bus 003 Device 002: ID 0bda:5634 Realtek Semiconductor Corp. Integrated_Webcam_HD
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 004: ID 0781:5567 SanDisk Corp. Cruzer Blade
Bus 001 Device 003: ID 046d:c52b Logitech, Inc. Unifying Receiver
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub`}
      />

      <TerminalBlock
        comment="-t mostra a árvore: hub → device, com velocidade negociada"
        command="lsusb -t"
        output={`/:  Bus 04.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/4p, 5000M
/:  Bus 03.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/12p, 480M
    |__ Port 5: Dev 2, If 0, Class=Video, Driver=uvcvideo, 480M
    |__ Port 5: Dev 2, If 1, Class=Video, Driver=uvcvideo, 480M
    |__ Port 10: Dev 3, If 0, Class=Wireless, Driver=btusb, 12M
    |__ Port 10: Dev 3, If 1, Class=Wireless, Driver=btusb, 12M
/:  Bus 02.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/4p, 5000M
/:  Bus 01.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/16p, 480M
    |__ Port 1: Dev 4, If 0, Class=Mass Storage, Driver=usb-storage, 480M
    |__ Port 3: Dev 3, If 0, Class=Human Interface Device, Driver=usbhid, 12M
    |__ Port 3: Dev 3, If 1, Class=Human Interface Device, Driver=usbhid, 12M`}
      />

      <TerminalBlock
        comment="-v = descritor completo do device. Resumido aqui:"
        command="sudo lsusb -v -d 0781:5567 | head -25"
        output={`Bus 001 Device 004: ID 0781:5567 SanDisk Corp. Cruzer Blade
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.10
  bDeviceClass            0
  bDeviceSubClass         0
  bDeviceProtocol         0
  bMaxPacketSize0        64
  idVendor           0x0781 SanDisk Corp.
  idProduct          0x5567 Cruzer Blade
  bcdDevice            1.27
  iManufacturer           1 SanDisk
  iProduct                2 Cruzer Blade
  iSerial                 3 4C530001230412116220
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength       0x0020
    bNumInterfaces          1
    bConfigurationValue     1
    iConfiguration          0
    bInterfaceProtocol     80
    MaxPower              200mA`}
      />

      <CommandFlagList
        command="lsusb"
        items={[
          { flag: "-t", description: "Árvore: hub raiz → portas → devices, com classe + driver + velocidade." },
          { flag: "-v", description: "Descritor verbose (precisa root pra alguns campos como serial)." },
          { flag: "-d VEN:DEV", description: "Filtra por vendor:product.", example: "lsusb -d 046d:" },
          { flag: "-s BUS:DEV", description: "Filtra por bus/device.", example: "lsusb -s 001:004" },
          { flag: "-D /dev/bus/usb/...", description: "Lê descritor de um device file específico." },
        ]}
      />

      <h2>6. Hardware geral — lshw</h2>

      <TerminalBlock comment="instale primeiro" command="sudo pacman -S lshw" output="..." />

      <TerminalBlock
        command="sudo lshw -short"
        output={`H/W path           Device          Class          Description
==========================================================
                                   system         Latitude 5430 (0B0C)
/0                                 bus            0B0C
/0/0                               memory         64KiB BIOS
/0/8                               memory         16GiB System Memory
/0/8/0                             memory         8GiB SODIMM DDR4 Synchronous 3200 MHz
/0/8/1                             memory         8GiB SODIMM DDR4 Synchronous 3200 MHz
/0/3a                              memory         448KiB L1 cache
/0/3b                              memory         640KiB L1 cache
/0/3c                              memory         9MiB L2 cache
/0/3d                              memory         12MiB L3 cache
/0/3e                              processor      12th Gen Intel(R) Core(TM) i5-1240P
/0/100                             bridge         12th Gen Core Processor Host Bridge
/0/100/2                           display        Alder Lake-P GT2 [Iris Xe Graphics]
/0/100/14         usb1            bus            Alder Lake PCH USB 3.2 xHCI Host Controller
/0/100/14/0       hub2            bus            Linux Foundation 2.0 root hub
/0/100/1f.3                        multimedia     Alder Lake PCH-P High Definition Audio
/0/100/1f.4                        bus            Alder Lake PCH-P SMBus Host Controller
/0/4                               disk           1TB Samsung SSD PM9A1
/0/2              wlp2s0          network         Wi-Fi 6E AX211`}
      />

      <TerminalBlock
        comment="-C class restringe a uma classe de hardware"
        command="sudo lshw -C network"
        output={`  *-network
       description: Wireless interface
       product: Wi-Fi 6E AX211
       vendor: Intel Corporation
       physical id: 0
       bus info: pci@0000:02:00.0
       logical name: wlp2s0
       version: 1a
       serial: a1:b2:c3:d4:e5:f6
       width: 64 bits
       clock: 33MHz
       capabilities: pm msi pciexpress msix bus_master cap_list ethernet physical wireless
       configuration: broadcast=yes driver=iwlwifi driverversion=6.10.5-arch1-1
                      firmware=89.202b401b.0 ip=192.168.1.42 latency=0 link=yes
                      multicast=yes wireless=IEEE 802.11
       resources: irq:16 memory:605d000000-605d003fff`}
      />

      <h2>7. DMI/SMBIOS — dmidecode</h2>

      <AlertBox type="warning" title="dmidecode precisa root">
        Ele lê o SMBIOS direto da memória do firmware. Sem <code>sudo</code> retorna erro de permissão.
        Em containers/VMs sem acesso ao SMBIOS pode falhar com{" "}
        <code>/sys/firmware/dmi/tables/smbios_entry_point: No such file</code>.
      </AlertBox>

      <TerminalBlock
        command="sudo dmidecode -t system"
        output={`# dmidecode 3.6
Getting SMBIOS data from sysfs.
SMBIOS 3.6.0 present.

Handle 0x0001, DMI type 1, 27 bytes
System Information
        Manufacturer: Dell Inc.
        Product Name: Latitude 5430
        Version: Not Specified
        Serial Number: ABC1234
        UUID: 4c4c4544-0042-4310-8043-c4c04f323433
        Wake-up Type: Power Switch
        SKU Number: 0B0C
        Family: Latitude`}
      />

      <TerminalBlock
        command="sudo dmidecode -t bios"
        output={`# dmidecode 3.6
Getting SMBIOS data from sysfs.
SMBIOS 3.6.0 present.

Handle 0x0000, DMI type 0, 26 bytes
BIOS Information
        Vendor: Dell Inc.
        Version: 1.18.0
        Release Date: 06/13/2024
        Address: 0xF0000
        Runtime Size: 64 kB
        ROM Size: 32 MB
        Characteristics:
                PCI is supported
                BIOS is upgradeable
                BIOS shadowing is allowed
                Boot from CD is supported
                Selectable boot is supported
                EDD is supported
                5.25"/1.2 MB floppy services are supported (int 13h)
                3.5"/720 kB floppy services are supported (int 13h)
                3.5"/2.88 MB floppy services are supported (int 13h)
                Print screen service is supported (int 5h)
                8042 keyboard services are supported (int 9h)
                Serial services are supported (int 14h)
                Printer services are supported (int 17h)
                ACPI is supported
                USB legacy is supported
                BIOS boot specification is supported
                Targeted content distribution is supported
                UEFI is supported
        BIOS Revision: 1.18`}
      />

      <TerminalBlock
        command="sudo dmidecode -t memory | head -40"
        output={`# dmidecode 3.6
Getting SMBIOS data from sysfs.
SMBIOS 3.6.0 present.

Handle 0x0007, DMI type 16, 23 bytes
Physical Memory Array
        Location: System Board Or Motherboard
        Use: System Memory
        Error Correction Type: None
        Maximum Capacity: 64 GB
        Number Of Devices: 2

Handle 0x0008, DMI type 17, 92 bytes
Memory Device
        Total Width: 64 bits
        Data Width: 64 bits
        Size: 8 GB
        Form Factor: SODIMM
        Locator: DIMM A
        Bank Locator: BANK 0
        Type: DDR4
        Type Detail: Synchronous
        Speed: 3200 MT/s
        Manufacturer: Samsung
        Serial Number: 12345678
        Part Number: M471A1G44AB0-CWE
        Rank: 1
        Configured Memory Speed: 3200 MT/s

Handle 0x0009, DMI type 17, 92 bytes
Memory Device
        Total Width: 64 bits
        Data Width: 64 bits
        Size: 8 GB
        Form Factor: SODIMM
        Locator: DIMM B
        Bank Locator: BANK 1
        Type: DDR4`}
      />

      <CommandFlagList
        command="dmidecode"
        items={[
          { flag: "-t TYPE", description: "Tipo: bios, system, baseboard, chassis, processor, memory, cache, slot, connector, battery." },
          { flag: "-s KEYWORD", description: "Imprime UM valor.", example: "sudo dmidecode -s system-serial-number" },
          { flag: "-q", description: "Quiet — pula handles, descrições e meta." },
          { flag: "-H HANDLE", description: "Mostra apenas a entrada com aquele handle." },
          { flag: "--dump-bin FILE", description: "Salva tabela SMBIOS bruta para análise offline." },
        ]}
      />

      <h2>8. Sensores — lm_sensors</h2>

      <TerminalBlock comment="instale" command="sudo pacman -S lm_sensors" output="..." />

      <AlertBox type="warning" title="sensors-detect faz perguntas — algumas perigosas">
        O <code>sensors-detect</code> escaneia barramentos I2C/SMBus pra descobrir chips. Algumas
        sondas podem travar o I2C em certos chipsets. Responda com calma e prefira{" "}
        <code>YES</code> só nas sondas marcadas como <em>safe</em>. Se travar: reboot resolve.
      </AlertBox>

      <TerminalBlock
        comment="primeira execução: detectar chips e escrever /etc/conf.d/lm_sensors"
        command="sudo sensors-detect --auto"
        output={`# sensors-detect revision $Revision: 6979 $
This program will help you determine which kernel modules you need
to load to use lm_sensors most effectively.
...
Driver 'coretemp':
  * Chip 'Intel digital thermal sensor' (confidence: 9)

Driver 'nvme':
  * Chip 'NVMe MT0001' (confidence: 9)

Driver 'acpitz':
  * Chip 'ACPI thermal zone' (confidence: 7)

To load everything that is needed, add this to /etc/modules-load.d/lm_sensors.conf:
#----cut here----
# Chip drivers
coretemp
#----cut here----`}
      />

      <TerminalBlock
        command="sensors"
        output={`coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +52.0°C  (high = +100.0°C, crit = +100.0°C)
Core 0:        +51.0°C  (high = +100.0°C, crit = +100.0°C)
Core 1:        +49.0°C  (high = +100.0°C, crit = +100.0°C)
Core 2:        +50.0°C  (high = +100.0°C, crit = +100.0°C)
Core 3:        +48.0°C  (high = +100.0°C, crit = +100.0°C)

acpitz-acpi-0
Adapter: ACPI interface
temp1:        +47.0°C  (crit = +119.0°C)

nvme-pci-0100
Adapter: PCI adapter
Composite:    +42.9°C  (low  = -273.1°C, high = +84.8°C)
                       (crit = +89.8°C)
Sensor 1:     +42.9°C  (low  = -273.1°C, high = +65261.8°C)
Sensor 2:     +49.9°C  (low  = -273.1°C, high = +65261.8°C)

iwlwifi_1-virtual-0
Adapter: Virtual device
temp1:        +51.0°C`}
      />

      <TerminalBlock
        comment="acompanhar em tempo real (refresh 1s)"
        command="watch -n 1 sensors"
      />

      <h2>9. Módulos do kernel — lsmod, modinfo, modprobe</h2>

      <TerminalBlock
        command="lsmod | head -15"
        output={`Module                  Size  Used by
xt_conntrack           16384  4
nf_conntrack          188416  1 xt_conntrack
iptable_filter         16384  1
ip_tables              32768  1 iptable_filter
btrfs                1916928  1
xor                    20480  1 btrfs
raid6_pq              123208  1 btrfs
loop                   40960  0
nls_iso8859_1          16384  1
vfat                   24576  1
fat                   102400  1 vfat
intel_rapl_msr         20480  0
intel_rapl_common      53248  1 intel_rapl_msr
x86_pkg_temp_thermal   20480  0`}
      />

      <TerminalBlock
        comment="quem está usando o módulo nvidia?"
        command="lsmod | grep nvidia"
        output={`nvidia_drm             86016  4
nvidia_modeset       1495040  6 nvidia_drm
nvidia              68243456  336 nvidia_modeset
drm_kms_helper        212992  1 nvidia_drm
drm                   667648  9 drm_kms_helper,nvidia,nvidia_drm`}
      />

      <TerminalBlock
        comment="metadata do módulo (versão, autor, licença, parâmetros)"
        command="modinfo nvidia | head -15"
        output={`filename:       /lib/modules/6.10.5-arch1-1/extramodules/nvidia.ko.zst
alias:          char-major-195-*
version:        555.58.02
supported:      external
license:        NVIDIA
firmware:       nvidia/555.58.02/gsp_tu10x.bin
firmware:       nvidia/555.58.02/gsp_ga10x.bin
srcversion:     12345ABCDEF
alias:          pci:v000010DEd*sv*sd*bc03sc02i00*
depends:        i2c-core,drm,drm_kms_helper
retpoline:      Y
intree:         N
name:           nvidia
vermagic:       6.10.5-arch1-1 SMP preempt mod_unload
parm:           NVreg_OpenRmEnableUnsupportedGpus:int`}
      />

      <TerminalBlock comment="carregar manualmente" command="sudo modprobe nvidia" output="" />
      <TerminalBlock
        comment="remover (falha se em uso — confira lsmod)"
        command="sudo modprobe -r nvidia"
        output={`modprobe: FATAL: Module nvidia is in use.`}
        exitCode={1}
      />

      <CodeBlock title="/etc/modprobe.d/blacklist.conf — bloquear nouveau (driver livre da NVIDIA)" code={`# Impede o nouveau de ser carregado automaticamente
blacklist nouveau
options nouveau modeset=0`} />

      <h2>10. dmesg — buffer de mensagens do kernel</h2>

      <TerminalBlock
        command="dmesg --level=err,warn | head -10"
        output={`[    0.345672] x86/cpu: SGX disabled by BIOS.
[    1.234567] ACPI BIOS Error (bug): Could not resolve symbol [\\_SB.PCI0.LPCB.H_EC.ECRD]
[    2.456789] thermal thermal_zone6: failed to read out thermal zone (-61)
[    3.567890] iwlwifi 0000:02:00.0: Microcode SW error detected.  Restarting 0x2000000.
[    4.678901] iwlwifi 0000:02:00.0: Start IWL Error Log Dump:
[    8.789012] usb 1-3: device descriptor read/64, error -71
[   12.890123] kauditd_printk_skb: 23 callbacks suppressed
[   15.901234] nvme nvme0: I/O 192 QID 8 timeout, aborting`}
      />

      <TerminalBlock
        comment="-T humaniza timestamps; -w segue (follow). Combine pra debug ao vivo:"
        command="sudo dmesg -T -w"
        output={`[Sun Sep  1 14:20:01 2024] usb 1-1.4: new high-speed USB device number 5 using xhci_hcd
[Sun Sep  1 14:20:01 2024] usb 1-1.4: New USB device found, idVendor=0781, idProduct=5567
[Sun Sep  1 14:20:01 2024] usb 1-1.4: Product: Cruzer Blade
[Sun Sep  1 14:20:01 2024] usb-storage 1-1.4:1.0: USB Mass Storage device detected
[Sun Sep  1 14:20:02 2024] scsi host6: usb-storage 1-1.4:1.0
[Sun Sep  1 14:20:03 2024] scsi 6:0:0:0: Direct-Access SanDisk Cruzer Blade 1.27 PQ: 0 ANSI: 6
[Sun Sep  1 14:20:03 2024] sd 6:0:0:0: [sdb] 60553248 512-byte logical blocks: (31.0 GB/29.9 GiB)
^C`}
      />

      <TerminalBlock
        comment="filtrar por facility (kern, user, mail, daemon, auth, syslog)"
        command="sudo dmesg --facility=kern | tail -5"
        output={`[ 8923.456789] wlp2s0: associated with 4c:5d:6e:7f:80:91 (Capability: 0x1431)
[ 8923.567890] wlp2s0: RX AssocResp from 4c:5d:6e:7f:80:91 (capab=0x1431 status=0 aid=4)
[ 8923.678901] wlp2s0: associated
[ 8924.789012] IPv6: ADDRCONF(NETDEV_CHANGE): wlp2s0: link becomes ready
[ 8925.890123] cfg80211: Regulatory domain changed to country: BR`}
      />

      <CommandFlagList
        command="dmesg"
        items={[
          { flag: "-T", description: "Timestamps humanos (em vez de segundos desde boot)." },
          { flag: "-w", description: "Follow — fica aguardando novas mensagens (Ctrl+C sai)." },
          { flag: "-H", description: "Modo humano (paginado + cores, equivale a -T -L --pager)." },
          { flag: "-l", long: "--level=LIST", description: "Filtra por nível (emerg,alert,crit,err,warn,notice,info,debug).", example: "dmesg -l err,warn" },
          { flag: "-f", long: "--facility=LIST", description: "Filtra por facility (kern,user,mail,daemon,auth,syslog,…)." },
          { flag: "-k", description: "Apenas mensagens do kernel (atalho de --facility=kern)." },
          { flag: "-c", description: "Imprime e LIMPA o buffer (precisa root)." },
          { flag: "-C", description: "Apenas LIMPA o buffer." },
          { flag: "--since '5 min ago'", description: "Apenas mensagens recentes (relativo)." },
        ]}
      />

      <h2>11. Bateria e energia (laptop) — acpi, /sys, upower</h2>

      <TerminalBlock comment="instalar acpi" command="sudo pacman -S acpi" output="..." />

      <TerminalBlock
        command="acpi -V"
        output={`Battery 0: Discharging, 67%, 02:34:18 remaining
Battery 0: design capacity 6000 mAh, last full capacity 5421 mAh = 90%
Adapter 0: off-line
Thermal 0: ok, 47.0 degrees C
Thermal 0: trip point 0 switches to mode critical at temperature 119.0 degrees C
Cooling 0: Processor 0 of 10
Cooling 1: Processor 0 of 10
Cooling 2: x86_pkg_temp no state information available
Cooling 3: intel_powerclamp no state information available
Cooling 4: B0D4 no state information available`}
      />

      <TerminalBlock
        comment="o kernel expõe tudo em /sys/class/power_supply/"
        command="cat /sys/class/power_supply/BAT0/capacity"
        output="67"
      />

      <TerminalBlock
        command="ls /sys/class/power_supply/BAT0/"
        output={`alarm           cycle_count           manufacturer  status
capacity        energy_full           model_name    technology
capacity_level  energy_full_design    power         type
charge_full     energy_now            present       uevent
charge_now      hwmon0                serial_number voltage_min_design
current_now    voltage_now`}
      />

      <TerminalBlock
        comment="upower fornece API D-Bus para baterias (usado por GNOME/KDE)"
        command={'upower -i $(upower -e | grep BAT)'}
        output={`  native-path:          BAT0
  vendor:               SMP
  model:                DELL ABC1234
  serial:               5678
  power supply:         yes
  updated:              Sun 01 Sep 2024 02:35:08 PM -03 (12 seconds ago)
  has history:          yes
  has statistics:       yes
  battery
    present:             yes
    rechargeable:        yes
    state:               discharging
    warning-level:       none
    energy:              42.6 Wh
    energy-empty:        0 Wh
    energy-full:         63.2 Wh
    energy-full-design:  70.0 Wh
    energy-rate:         8.123 W
    voltage:             11.4 V
    charge-cycles:       127
    time to empty:       2.6 hours
    percentage:          67%
    capacity:            90.3%
    technology:          lithium-polymer
    icon-name:          'battery-good-symbolic'`}
      />

      <h2>12. GPU — lspci, glxinfo, nvidia-smi</h2>

      <TerminalBlock
        command="lspci | grep -i vga"
        output="00:02.0 VGA compatible controller: Intel Corporation Alder Lake-P GT2 [Iris Xe Graphics] (rev 0c)"
      />

      <TerminalBlock comment="instale mesa-utils para ter glxinfo" command="sudo pacman -S mesa-utils" output="..." />

      <TerminalBlock
        command={'glxinfo | grep "OpenGL renderer"'}
        output="OpenGL renderer string: Mesa Intel(R) Graphics (ADL GT2)"
      />

      <TerminalBlock
        comment="máquina com NVIDIA: nvidia-smi mostra uso, temp, processos"
        command="nvidia-smi"
        output={`Sun Sep  1 14:36:42 2024
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 555.58.02              Driver Version: 555.58.02      CUDA Version: 12.5     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                Persistence-M  | Bus-Id         Disp.A  | Volatile Uncorr. ECC |
| Fan  Temp   Perf         Pwr:Usage/Cap  |          Memory-Usage  | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4070       Off  | 00000000:01:00.0  On   |                  N/A |
|  0%   42C    P8              12W / 200W |    412MiB / 12282MiB   |      2%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      1234      G   /usr/lib/Xorg                                 187MiB |
|    0   N/A  N/A      2341      G   /usr/bin/gnome-shell                          112MiB |
|    0   N/A  N/A      8765      G   firefox                                        96MiB |
+-----------------------------------------------------------------------------------------+`}
      />

      <h2>Resumo prático — colinha de bolso</h2>

      <OutputBlock
        title="O que rodar quando..."
        output={`# CPU
lscpu                          # tudo sobre CPU
nproc                          # quantos lógicos

# Memória
free -h                        # resumo
cat /proc/meminfo | head -20   # detalhe
vmstat 1 5                     # pressão em tempo real

# Carga
uptime                         # load 1m/5m/15m
w                              # quem está logado

# PCI / USB
lspci -nn -k                   # tudo PCI + driver
lspci -t                       # árvore PCI
lsusb -t                       # árvore USB

# Hardware geral
sudo lshw -short               # inventário rápido
sudo lshw -C network           # uma classe

# DMI/SMBIOS (root)
sudo dmidecode -t system       # marca/modelo
sudo dmidecode -t memory       # módulos DDR

# Sensores
sensors                        # CPU/NVMe/ACPI
watch -n 1 sensors             # ao vivo

# Kernel modules
lsmod                          # carregados
modinfo MOD                    # info do módulo
sudo modprobe MOD              # carrega
sudo modprobe -r MOD           # remove

# Kernel log
dmesg --level=err,warn         # só erros
sudo dmesg -T -w               # follow ao vivo

# Bateria/energia
acpi -V                        # resumo
upower -i $(upower -e|grep BAT)# detalhe

# GPU
lspci | grep -i vga
glxinfo | grep "OpenGL renderer"
nvidia-smi                     # se NVIDIA`}
      />
    </PageContainer>
  );
}
