import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function KVM() {
  return (
    <PageContainer
      title="KVM, QEMU & libvirt"
      subtitle="Virtualização nativa do Linux no Arch — instalando QEMU/KVM, libvirt, virt-manager e criando VMs com performance bare-metal."
      difficulty="avancado"
      timeToRead="40 min"
      category="Virtualização"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com CPU que suporte virtualização (VT-x/AMD-V) — verifique com <code>egrep -c "(vmx|svm)" /proc/cpuinfo</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>KVM</strong> — Kernel-based Virtual Machine — hypervisor tipo 1 embutido no kernel Linux.
      </p>
      <p>
        <strong>QEMU</strong> — emulador que combina com o KVM para fornecer hardware virtual à VM.
      </p>
      <p>
        <strong>libvirt</strong> — API de alto nível para gerenciar VMs.
      </p>
      <p>
        <strong>virt-manager</strong> — GUI para libvirt.
      </p>
      <p>
        <strong>virsh</strong> — CLI do libvirt — para automação e servidores.
      </p>

      <p>
        <strong>KVM</strong> (Kernel-based Virtual Machine) é o hypervisor type-1 embutido no
        kernel Linux. Ele transforma o kernel em hypervisor usando as extensões{" "}
        <code>VT-x</code> (Intel) ou <code>AMD-V</code> (AMD). <strong>QEMU</strong> emula o
        hardware (CPU, disco, rede) e usa o KVM como acelerador. <strong>libvirt</strong> é a
        camada de gerenciamento (API, daemon, CLI <code>virsh</code>) e <code>virt-manager</code>{" "}
        é a GUI mais popular.
      </p>

      <AlertBox type="info" title="Stack completa">
        <code>kernel (KVM)</code> → <code>qemu</code> → <code>libvirtd</code> →{" "}
        <code>virsh / virt-manager / boxes</code>. Você não precisa entender cada camada para
        usar — mas vale saber a hierarquia ao debuggar.
      </AlertBox>

      <h2>1. Verificar suporte a virtualização</h2>

      <TerminalBlock
        comment="precisa ser > 0 — significa que VT-x/AMD-V está habilitado na BIOS/UEFI"
        command="LC_ALL=C lscpu | grep Virtualization"
        output={`Virtualization:                  VT-x`}
      />

      <TerminalBlock
        command="grep -E 'svm|vmx' /proc/cpuinfo | head -1"
        output={`flags : fpu vme de pse tsc msr pae mce cx8 apic sep ... vmx ... aes avx2 ...`}
      />

      <TerminalBlock
        comment="módulos do kernel já carregados? (kvm + kvm_intel ou kvm_amd)"
        command="lsmod | grep kvm"
        output={`kvm_intel             401408  6
kvm                  1257472  1 kvm_intel
irqbypass              12288  3 kvm`}
      />

      <p>
        Se <code>vmx</code>/<code>svm</code> não aparecer, entre na BIOS/UEFI e habilite
        <em> Intel Virtualization Technology</em> ou <em>SVM Mode</em>.
      </p>

      <h2>2. Instalação no Arch</h2>

      <TerminalBlock
        comment="stack completa: QEMU + libvirt + virt-manager + utilitários de rede/imagem"
        command="sudo pacman -S qemu-full libvirt virt-manager virt-viewer dnsmasq bridge-utils openbsd-netcat ebtables iptables-nft edk2-ovmf swtpm"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (28) ... qemu-full-9.1.0-1  libvirt-1:10.7.0-3  virt-manager-4.1.0-2
                  edk2-ovmf-202405-1  swtpm-0.9.0-1  dnsmasq-2.90-2  ...

Total Installed Size:   847.32 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <OutputBlock
        title="o que cada pacote faz"
        output={`qemu-full           emulador (todas arquiteturas: x86, arm, riscv, ...)
libvirt             daemon de gerenciamento + API
virt-manager        GUI gtk para criar/gerenciar VMs
virt-viewer         só o visualizador SPICE/VNC (sem GUI de gerência)
dnsmasq             DHCP/DNS para a rede default das VMs
bridge-utils        utilitários para bridges
ebtables/iptables   firewalling necessário p/ NAT do libvirt
openbsd-netcat      socat-like usado p/ migrações
edk2-ovmf           firmware UEFI para VMs (boot em modo UEFI)
swtpm               TPM emulado (necessário p/ Win11)`}
      />

      <h2>3. Habilitar libvirtd e adicionar usuário</h2>

      <TerminalBlock
        command="sudo systemctl enable --now libvirtd.service"
        output={`Created symlink /etc/systemd/system/multi-user.target.wants/libvirtd.service → /usr/lib/systemd/system/libvirtd.service.`}
      />

      <TerminalBlock
        command="sudo systemctl status libvirtd --no-pager"
        output={`{g}● libvirtd.service{/} - libvirt legacy monolithic daemon
     Loaded: loaded (/usr/lib/systemd/system/libvirtd.service; {g}enabled{/}; preset: disabled)
     Active: {g}active (running){/} since Wed 2026-03-20 15:14:42 -03; 8s ago
TriggeredBy: ● libvirtd.socket
       Docs: man:libvirtd(8)
   Main PID: 2147 (libvirtd)
      Tasks: 21 (limit: 32768)
     Memory: 28.4M
        CPU: 184ms`}
      />

      <TerminalBlock
        comment="libvirt = sem sudo p/ rede default; kvm = acesso direto a /dev/kvm"
        command="sudo usermod -aG libvirt,kvm $USER"
        output=""
      />

      <TerminalBlock
        comment="reabra a sessão ou:"
        command="newgrp libvirt"
        output=""
      />

      <h2>4. virsh — CLI oficial do libvirt</h2>

      <CommandFlagList
        command="virsh"
        items={[
          { flag: "list", description: "VMs em execução. --all inclui as paradas.", example: "virsh list --all" },
          { flag: "start NOME", description: "Inicia VM." },
          { flag: "shutdown NOME", description: "Desligamento gracioso (ACPI)." },
          { flag: "destroy NOME", description: "Força desligamento (puxa o cabo)." },
          { flag: "reboot NOME", description: "Reinicia." },
          { flag: "console NOME", description: "Conecta ao console serial. Saída: Ctrl+]." },
          { flag: "edit NOME", description: "Edita o XML da VM (recarrega ao salvar)." },
          { flag: "dumpxml NOME", description: "Imprime XML da VM (backup/migração)." },
          { flag: "define ARQ.xml", description: "Cria VM a partir de XML." },
          { flag: "undefine NOME", description: "Remove definição (não apaga disco). --remove-all-storage também apaga." },
          { flag: "snapshot-create-as", description: "Cria snapshot.", example: "virsh snapshot-create-as vm1 antes-update" },
          { flag: "net-list / net-start", description: "Gerencia redes virtuais." },
          { flag: "pool-list / vol-list", description: "Gerencia storage pools." },
        ]}
      />

      <TerminalBlock
        command="virsh list --all"
        output={` Id   Name        State
----------------------------------
 1    arch-test   running
 -    win11       shut off
 -    debian12    shut off`}
      />

      <TerminalBlock
        command="virsh net-list --all"
        output={` Name      State    Autostart   Persistent
--------------------------------------------
 default   active   yes         yes`}
      />

      <h2>5. Criando uma VM com virt-install</h2>

      <p>
        A forma scriptável de criar VMs. Cria o XML, aloca disco, anexa ISO e dá boot:
      </p>

      <TerminalBlock
        comment="prepare diretório para imagens"
        command="sudo mkdir -p /var/lib/libvirt/images && cd /var/lib/libvirt/images"
        output=""
      />

      <TerminalBlock
        comment="baixe a ISO do Arch (exemplo)"
        command="sudo curl -O https://mirror.rackspace.com/archlinux/iso/latest/archlinux-x86_64.iso"
        output={`  % Total    % Received % Xferd  Average Speed
100  872M  100  872M    0     0  18.4M      0  0:00:47  0:00:47 --:--:-- 19.2M`}
      />

      <TerminalBlock
        comment="cria VM 'arch-vm' com 4 GiB RAM, 2 vCPU, disco qcow2 de 30 GiB"
        command={`sudo virt-install \\
  --name arch-vm \\
  --memory 4096 \\
  --vcpus 2 \\
  --cpu host-passthrough \\
  --disk size=30,format=qcow2,bus=virtio \\
  --network network=default,model=virtio \\
  --graphics spice \\
  --video qxl \\
  --osinfo archlinux \\
  --cdrom /var/lib/libvirt/images/archlinux-x86_64.iso`}
        output={`Starting install...
Allocating 'arch-vm.qcow2'                                        |  30 GB  00:00:01
Creating domain...                                                                    0 B  00:00:00
Domain is still running. Installation may be in progress.
Waiting for the installation to complete.`}
      />

      <h3>virt-install — flags principais</h3>

      <CommandFlagList
        command="virt-install"
        items={[
          { flag: "--name", description: "Nome da VM (também nome do XML)." },
          { flag: "--memory M", description: "RAM em MiB.", example: "--memory 8192" },
          { flag: "--vcpus N", description: "Número de vCPUs (cores virtuais)." },
          { flag: "--cpu host-passthrough", description: "Passa CPU do host (melhor performance, sem migração)." },
          { flag: "--disk", description: "Cria/anexa disco. Formato qcow2 suporta snapshots, growing.", example: "--disk path=/var/lib/libvirt/images/x.qcow2,size=20" },
          { flag: "--network", description: "Rede. default=NAT; bridge=br0 para bridge.", example: "--network bridge=br0" },
          { flag: "--graphics", description: "spice (recomendado), vnc ou none.", example: "--graphics spice,listen=0.0.0.0" },
          { flag: "--cdrom", description: "ISO para boot inicial." },
          { flag: "--osinfo", description: "Tipo de SO (otimiza defaults). Liste: virt-install --osinfo list." },
          { flag: "--boot uefi", description: "Boot UEFI (precisa edk2-ovmf)." },
          { flag: "--tpm emulator,model=tpm-crb,version=2.0", description: "TPM emulado (Win11)." },
          { flag: "--noautoconsole", description: "Não abre console — útil em scripts." },
        ]}
      />

      <h2>6. virt-manager — a GUI</h2>

      <TerminalBlock
        comment="abre a GUI; ela conecta-se a qemu:///system por padrão"
        command="virt-manager &"
        output=""
      />

      <p>
        Na GUI: <strong>File → New Virtual Machine</strong> → escolha "Local install media"
        (ISO) → aponte para a ISO → defina RAM e CPU → defina tamanho do disco → na última tela
        marque <em>"Customize configuration before install"</em> para ajustar firmware (UEFI),
        chipset (Q35), display (Spice/QXL) e CPU (host-passthrough) antes de bootar.
      </p>

      <h2>7. Discos qcow2 — qemu-img</h2>

      <CommandFlagList
        command="qemu-img"
        items={[
          { flag: "create", description: "Cria imagem.", example: "qemu-img create -f qcow2 disk.qcow2 30G" },
          { flag: "info", description: "Mostra metadados (formato, tamanho virtual/real, snapshots)." },
          { flag: "convert", description: "Converte formato (raw↔qcow2↔vmdk↔vdi).", example: "qemu-img convert -O qcow2 disk.vmdk disk.qcow2" },
          { flag: "resize", description: "Aumenta o disco virtual (+10G).", example: "qemu-img resize disk.qcow2 +10G" },
          { flag: "snapshot -c/-d/-l", description: "Snapshots internos." },
        ]}
      />

      <TerminalBlock
        command="sudo qemu-img info /var/lib/libvirt/images/arch-vm.qcow2"
        output={`image: /var/lib/libvirt/images/arch-vm.qcow2
file format: qcow2
virtual size: 30 GiB (32212254720 bytes)
disk size: 8.42 GiB
cluster_size: 65536
Format specific information:
    compat: 1.1
    compression type: zlib
    lazy refcounts: false
    refcount bits: 16
    corrupt: false
    extended l2: false`}
      />

      <h2>8. Snapshots</h2>

      <TerminalBlock
        command="virsh snapshot-create-as arch-vm 'antes-pacman-Syu' 'antes da atualização'"
        output={`Domain snapshot antes-pacman-Syu created`}
      />

      <TerminalBlock
        command="virsh snapshot-list arch-vm"
        output={` Name                Creation Time               State
-----------------------------------------------------------
 antes-pacman-Syu    2026-03-20 16:08:42 -0300   running`}
      />

      <TerminalBlock
        comment="reverte VM ao snapshot"
        command="virsh snapshot-revert arch-vm antes-pacman-Syu"
        output=""
      />

      <h2>9. Rede default vs bridge</h2>

      <p>
        A rede <code>default</code> do libvirt cria <code>virbr0</code> com NAT — VMs vêem o
        host e a internet, mas o resto da LAN <strong>não</strong> vê as VMs. Para que sua VM
        receba IP da sua rede como uma máquina física, configure uma <strong>bridge</strong>:
      </p>

      <CodeBlock
        title="/etc/systemd/network/30-bridge.netdev"
        code={`[NetDev]
Name=br0
Kind=bridge`}
      />

      <CodeBlock
        title="/etc/systemd/network/40-eth.network (eno1 vira slave)"
        code={`[Match]
Name=eno1

[Network]
Bridge=br0`}
      />

      <CodeBlock
        title="/etc/systemd/network/50-bridge.network (IP vai pra br0)"
        code={`[Match]
Name=br0

[Network]
DHCP=yes`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now systemd-networkd && networkctl status br0"
        output={`● 5: br0
                     Link File: /usr/lib/systemd/network/99-default.link
                  Network File: /etc/systemd/network/50-bridge.network
                          Type: bridge
                         State: routable (configured)
                       Address: 192.168.1.42 on br0
                       Gateway: 192.168.1.1`}
      />

      <p>Agora crie a VM com <code>--network bridge=br0,model=virtio</code>.</p>

      <h2>10. Performance — virtio, hugepages, CPU pinning</h2>

      <AlertBox type="success" title="Receita para VMs rápidas">
        <strong>Sempre</strong> use drivers <code>virtio</code> (disco + rede), CPU{" "}
        <code>host-passthrough</code>, e ative cache <code>none</code> + IO <code>native</code>{" "}
        no disco para databases. Para gaming/desktop com GPU passthrough, considere{" "}
        <strong>hugepages</strong> e <strong>CPU pinning</strong>.
      </AlertBox>

      <CodeBlock
        title="ajustes finos no XML (virsh edit NOME)"
        language="xml"
        code={`<cpu mode='host-passthrough' check='none' migratable='on'>
  <topology sockets='1' dies='1' cores='4' threads='2'/>
</cpu>
<cputune>
  <vcpupin vcpu='0' cpuset='2'/>
  <vcpupin vcpu='1' cpuset='3'/>
  <vcpupin vcpu='2' cpuset='4'/>
  <vcpupin vcpu='3' cpuset='5'/>
</cputune>
<memoryBacking>
  <hugepages/>
</memoryBacking>
<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2' cache='none' io='native' discard='unmap'/>
</disk>
<interface type='bridge'>
  <source bridge='br0'/>
  <model type='virtio'/>
</interface>`}
      />

      <h2>11. Console serial (sem GUI)</h2>

      <TerminalBlock
        comment="dentro da VM Arch (uma vez): habilite ttyS0"
        command="sudo systemctl enable --now serial-getty@ttyS0.service"
        output=""
      />

      <TerminalBlock
        command="virsh console arch-vm"
        output={`Connected to domain 'arch-vm'
Escape character is ^] (Ctrl + ])

Arch Linux 6.12.1-arch1-1 (ttyS0)

archlinux login:`}
      />

      <h2>12. Cola visual</h2>

      <OutputBlock
        title="comandos do dia-a-dia com KVM/libvirt"
        output={`virsh list --all                  todas as VMs
virsh start NOME                  liga
virsh shutdown NOME               desliga (ACPI)
virsh destroy NOME                força desligamento
virsh console NOME                console serial (saída: Ctrl+])
virsh edit NOME                   edita XML da VM
virsh dumpxml NOME > backup.xml   backup definição
virsh snapshot-create-as NOME X   cria snapshot
virsh snapshot-revert NOME X      reverte
virt-install --name X ...         cria nova VM (script)
virt-manager                      GUI completa
virt-viewer NOME                  só o visualizador
qemu-img info disk.qcow2          info do disco
qemu-img resize disk.qcow2 +10G   aumenta disco
sudo systemctl status libvirtd    estado do daemon`}
      />
    </PageContainer>
  );
}
