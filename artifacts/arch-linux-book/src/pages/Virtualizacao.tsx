import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Virtualizacao() {
  return (
    <PageContainer
      title="Virtualização com KVM/QEMU"
      subtitle="Crie e gerencie máquinas virtuais de alta performance no Arch Linux com KVM, QEMU e libvirt. Rode Windows, outras distros e ambientes de teste isolados."
      difficulty="avancado"
      timeToRead="22 min"
    >
      <h2>KVM e QEMU</h2>
      <p>
        O KVM (Kernel-based Virtual Machine) é um módulo do kernel Linux que transforma o
        Linux em um hypervisor. O QEMU é o emulador que usa o KVM como backend para
        virtualização de hardware acelerada.
      </p>
      <p>
        Juntos, oferecem performance quase nativa para máquinas virtuais — muito melhor
        que o VirtualBox para uso geral.
      </p>

      <h2>Verificar Suporte a Virtualização</h2>
      <CodeBlock
        title="Verificar se o hardware suporta KVM"
        code={`# Verificar suporte a virtualização na CPU
grep -E "(vmx|svm)" /proc/cpuinfo | head -1
# vmx = Intel VT-x
# svm = AMD-V

# Verificar módulos do kernel
lsmod | grep kvm
# kvm_intel    ou  kvm_amd
# kvm

# Se não aparecer, carregar manualmente:
sudo modprobe kvm
sudo modprobe kvm_intel    # Intel
sudo modprobe kvm_amd      # AMD

# Verificar grupos de dispositivos
ls -l /dev/kvm
# crw-rw---- 1 root kvm 10, 232 ...

# Adicionar usuário ao grupo kvm
sudo usermod -aG kvm $USER`}
      />

      <h2>Instalar KVM/QEMU e libvirt</h2>
      <CodeBlock
        title="Instalação completa"
        code={`# Instalar pacotes necessários
sudo pacman -S \
    qemu-full \         # QEMU completo (all targets)
    libvirt \           # API de virtualização
    virt-manager \      # Interface gráfica (recomendado para iniciantes)
    dnsmasq \           # DNS/DHCP para rede virtual
    iptables-nft \      # Firewall para rede virtual
    bridge-utils \      # Bridges de rede

# Habilitar e iniciar libvirt
sudo systemctl enable --now libvirtd

# Adicionar usuário aos grupos necessários
sudo usermod -aG libvirt $USER
sudo usermod -aG kvm $USER

# Verificar instalação
virsh --version
virt-manager --version`}
      />

      <h2>Criar VM com virt-manager (GUI)</h2>
      <p>
        O virt-manager é a interface gráfica mais completa para gerenciar VMs com KVM/QEMU.
      </p>
      <CodeBlock
        title="Usar o virt-manager"
        code={`# Abrir virt-manager
virt-manager

# Na interface:
# 1. Clique em "Criar nova máquina virtual"
# 2. Escolha a mídia de instalação (ISO)
# 3. Configure RAM e CPUs
# 4. Crie ou selecione um disco virtual
# 5. Configure rede (NAT padrão)
# 6. Inicie a instalação

# Dicas:
# - Compartilhamento de área de transferência: instale "spice-guest-tools" na VM
# - Pastas compartilhadas: use virtiofs (no virt-manager → Hardware → Filesystem)
# - 3D acelerado: vídeo QXL + spice`}
      />

      <h2>Criar VM via Linha de Comando</h2>
      <CodeBlock
        title="virt-install - Criar VM via CLI"
        code={`# Criar VM com Ubuntu Server
virt-install \
    --name ubuntu-server \
    --ram 4096 \
    --vcpus 2 \
    --disk path=/var/lib/libvirt/images/ubuntu.qcow2,size=40 \
    --os-variant ubuntu24.04 \
    --network network=default \
    --graphics spice \
    --cdrom /home/user/Downloads/ubuntu-24.04-server.iso \
    --boot cdrom,hd

# Criar VM com Windows 10
virt-install \
    --name windows10 \
    --ram 8192 \
    --vcpus 4 \
    --cpu host-passthrough \
    --disk path=/var/lib/libvirt/images/win10.qcow2,size=100,bus=virtio \
    --disk /home/user/Downloads/virtio-win.iso,device=cdrom \
    --os-variant win10 \
    --network network=default,model=virtio \
    --graphics spice \
    --cdrom /home/user/Downloads/Win10.iso`}
      />

      <h2>Gerenciar VMs com virsh</h2>
      <CodeBlock
        title="virsh - CLI para libvirt"
        code={`# Listar VMs
virsh list           # VMs em execução
virsh list --all     # Todas as VMs

# Iniciar/parar VM
virsh start ubuntu-server
virsh shutdown ubuntu-server    # Shutdown gracioso
virsh destroy ubuntu-server     # Forçar desligamento (como tirar o cabo)
virsh reboot ubuntu-server

# Suspender e retomar (como hibernação)
virsh suspend ubuntu-server
virsh resume ubuntu-server

# Conectar ao console
virsh console ubuntu-server    # Serial console
virt-viewer ubuntu-server      # GUI SPICE/VNC

# Informações
virsh dominfo ubuntu-server
virsh domstats ubuntu-server   # Estatísticas em tempo real
virsh vcpuinfo ubuntu-server

# Snapshots
virsh snapshot-create-as ubuntu-server snap1 "Antes da atualização"
virsh snapshot-list ubuntu-server
virsh snapshot-revert ubuntu-server snap1
virsh snapshot-delete ubuntu-server snap1

# Clonar VM
virt-clone --original ubuntu-server --name ubuntu-clone --auto-clone`}
      />

      <h2>GPU Passthrough (Para Gaming/Workstation)</h2>
      <AlertBox type="warning" title="GPU Passthrough é complexo">
        GPU Passthrough permite passar uma GPU física para uma VM, obtendo performance nativa.
        É útil para rodar jogos Windows em uma VM com performance máxima. Requer IOMMU habilitado,
        dois GPUs (ou iGPU + dGPU), e configuração cuidadosa.
      </AlertBox>
      <CodeBlock
        title="Habilitar IOMMU para GPU Passthrough"
        code={`# 1. Habilitar IOMMU no GRUB
sudo nano /etc/default/grub

# Intel:
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on iommu=pt"
# AMD:
GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"

sudo grub-mkconfig -o /boot/grub/grub.cfg
reboot

# 2. Verificar grupos IOMMU
#!/bin/bash
for d in /sys/kernel/iommu_groups/*/devices/*; do
    n=\${d#*/iommu_groups/*}; n=\${n%%/*}
    printf 'IOMMU Group %s ' "$n"
    lspci -nns "\${d##*/}"
done

# 3. Identificar IDs da GPU
lspci -nn | grep -i nvidia
# 01:00.0 VGA compatible controller [0300]: NVIDIA Corporation [10de:2204]
# 01:00.1 Audio device [0403]: NVIDIA Corporation [10de:1aef]

# 4. Isolar GPU com vfio-pci
echo "options vfio-pci ids=10de:2204,10de:1aef" | sudo tee /etc/modprobe.d/vfio.conf

# 5. Adicionar módulos ao initramfs
# Em /etc/mkinitcpio.conf:
# MODULES=(vfio_pci vfio vfio_iommu_type1)
sudo mkinitcpio -P`}
      />
    </PageContainer>
  );
}
