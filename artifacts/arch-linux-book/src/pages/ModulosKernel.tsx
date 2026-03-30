import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ModulosKernel() {
  return (
    <PageContainer
      title="Módulos do Kernel"
      subtitle="Entenda como drivers e extensões são carregados no kernel do Linux. Gerencie módulos, resolva conflitos e configure carregamento automático."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <h2>O que são Módulos?</h2>
      <p>
        Módulos do kernel são partes de código que podem ser carregadas e descarregadas
        dinamicamente no kernel em execução, sem necessidade de reinicializar o sistema.
        São usados principalmente para implementar drivers de dispositivos.
      </p>
      <p>
        Antes dos módulos, todo driver precisava ser compilado dentro do kernel (monolítico puro).
        Com módulos, o kernel base fica menor e drivers são carregados conforme necessário.
      </p>

      <h2>Comandos Básicos</h2>
      <CodeBlock
        title="Gerenciamento de módulos"
        code={`# Listar todos os módulos carregados
lsmod

# Saída:
# Module                  Size  Used by
# nvidia_drm            114688  4
# nvidia_modeset       1548288  1 nvidia_drm
# nvidia              56705024  143 nvidia_modeset
# drm_kms_helper        270336  1 nvidia_drm
# drm                   671744  5 nvidia_drm,drm_kms_helper

# Informações sobre um módulo específico
modinfo nvidia
modinfo bluetooth
modinfo ext4

# Saída do modinfo:
# filename:  /lib/modules/6.12.10-arch1-1/kernel/drivers/gpu/drm/nvidia.ko.zst
# license:   GPL
# depends:   drm,drm_kms_helper
# vermagic:  6.12.10-arch1-1 SMP preempt mod_unload modversions

# Carregar um módulo manualmente
sudo modprobe nome_do_modulo

# Carregar com parâmetros
sudo modprobe iwlwifi 11n_disable=1

# Descarregar um módulo
sudo modprobe -r nome_do_modulo   # Remove o módulo e suas dependências
sudo rmmod nome_do_modulo         # Remove apenas o módulo específico`}
      />

      <h2>Onde Ficam os Módulos</h2>
      <CodeBlock
        title="Localização dos módulos"
        code={`# Módulos ficam em:
ls /lib/modules/$(uname -r)/

# Estrutura:
# /lib/modules/6.12.10-arch1-1/
# ├── kernel/          ← Módulos organizados por categoria
# │   ├── drivers/
# │   │   ├── net/     ← Drivers de rede
# │   │   ├── gpu/     ← Drivers de vídeo
# │   │   ├── usb/     ← Drivers USB
# │   │   └── ...
# │   ├── fs/          ← Sistemas de arquivos
# │   └── sound/       ← Drivers de áudio
# ├── modules.dep      ← Dependências entre módulos
# ├── modules.alias    ← Aliases (para detecção automática)
# └── modules.builtin  ← Módulos compilados dentro do kernel

# Encontrar onde está um módulo específico
modinfo -n bluetooth    # Caminho completo do arquivo .ko.zst

# Listar módulos de uma categoria
ls /lib/modules/$(uname -r)/kernel/drivers/net/wireless/`}
      />

      <h2>Carregamento Automático de Módulos</h2>
      <p>
        O <code>udev</code> detecta hardware e carrega módulos automaticamente. Mas às vezes
        você precisa forçar o carregamento de um módulo específico na inicialização.
      </p>
      <CodeBlock
        title="Configurar carregamento automático"
        code={`# Adicionar módulo para carregar na inicialização
echo "modulo_nome" | sudo tee /etc/modules-load.d/meu-modulo.conf

# Exemplo: carregar módulo loop com parâmetros
# Arquivo: /etc/modules-load.d/loop.conf
# Conteúdo: loop

# Para módulos com parâmetros, use modprobe.d
sudo nano /etc/modprobe.d/meu-modulo.conf

# Conteúdo do arquivo:
# options nome_modulo parametro=valor

# Exemplos reais:
# Desabilitar WiFi N (para compatibilidade)
# options iwlwifi 11n_disable=1

# Configurar tamanho máximo de dispositivos loop
# options loop max_loop=64

# Verificar configurações existentes
ls /etc/modprobe.d/
cat /etc/modprobe.d/*.conf`}
      />

      <h2>Bloqueando Módulos (Blacklist)</h2>
      <p>
        Às vezes você quer impedir que um módulo seja carregado automaticamente — por exemplo,
        quando há conflito entre dois drivers.
      </p>
      <CodeBlock
        title="Bloquear módulos com blacklist"
        code={`# Criar arquivo de blacklist
sudo nano /etc/modprobe.d/blacklist.conf

# Conteúdo do arquivo:
# blacklist nome_modulo

# Exemplos comuns:

# Bloquear módulo Nouveau (driver open-source NVIDIA)
# quando usando driver proprietário
blacklist nouveau

# Bloquear PC speaker (bip irritante)
blacklist pcspkr
blacklist snd_pcsp

# Bloquear webcam (privacidade)
blacklist uvcvideo

# Verificar se o módulo está na blacklist
cat /etc/modprobe.d/blacklist.conf

# Ver módulos que o kernel tentou carregar e falhou/bloqueou
journalctl -k | grep -i "module\|blacklist"

# Importante: após adicionar à blacklist, regenerar initramfs
sudo mkinitcpio -P`}
      />

      <AlertBox type="warning" title="Regenerar initramfs">
        Após modificar <code>/etc/modprobe.d/</code> ou <code>/etc/modules-load.d/</code>,
        regenere o initramfs com <code>sudo mkinitcpio -P</code> para que as mudanças
        sejam efetivas desde o início do boot.
      </AlertBox>

      <h2>Parâmetros de Módulos</h2>
      <CodeBlock
        title="Configurar parâmetros de módulos"
        code={`# Ver parâmetros disponíveis de um módulo
modinfo -p nome_modulo

# Exemplo: parâmetros do módulo iwlwifi
modinfo -p iwlwifi

# Saída:
# 11n_disable:Disable 11n functionality (int)
# power_save:Enable radio power saving mode (int)
# uapsd_disable:Disable U-APSD functionality (int)
# ...

# Ver parâmetros ativos de um módulo carregado
cat /sys/module/nome_modulo/parameters/nome_parametro

# Exemplo:
cat /sys/module/iwlwifi/parameters/11n_disable

# Definir parâmetros persistentemente
sudo nano /etc/modprobe.d/iwlwifi.conf
# options iwlwifi 11n_disable=1 power_save=0

# Definir temporariamente (só para sessão atual)
sudo modprobe -r iwlwifi    # Descarregar
sudo modprobe iwlwifi 11n_disable=1  # Recarregar com parâmetro`}
      />

      <h2>Módulos do Kernel vs Módulos DKMS</h2>
      <p>
        Existem dois tipos de módulos:
      </p>
      <ul>
        <li><strong>In-tree modules</strong> — Fazem parte do kernel, sempre compatíveis, ficam em <code>/lib/modules/</code>.</li>
        <li><strong>Out-of-tree modules (DKMS)</strong> — Desenvolvidos fora do kernel, precisam ser recompilados para cada versão. Ex: driver NVIDIA proprietário, ZFS, VirtualBox.</li>
      </ul>
      <CodeBlock
        title="Trabalhar com DKMS"
        code={`# Instalar DKMS
sudo pacman -S dkms

# Verificar módulos DKMS instalados
dkms status

# Saída:
# nvidia, 560.35.03, 6.12.10-arch1-1, x86_64: installed
# vboxhost, 7.0.20, 6.12.10-arch1-1, x86_64: installed

# Instalar um módulo DKMS manualmente
dkms add -m nome_modulo -v versao
dkms build -m nome_modulo -v versao -k $(uname -r)
dkms install -m nome_modulo -v versao -k $(uname -r)

# Reinstalar todos os módulos DKMS para o kernel atual
dkms autoinstall

# Ver log de compilação
cat /var/lib/dkms/nvidia/560.35.03/build/make.log

# Remover módulo DKMS
dkms remove nome_modulo/versao --all`}
      />

      <h2>Diagnóstico de Problemas</h2>
      <CodeBlock
        title="Diagnosticar problemas com módulos"
        code={`# Ver todos os eventos de hardware detectados pelo udev
udevadm monitor

# Ver dispositivos e seus módulos associados
lspci -k    # Dispositivos PCI e seus drivers
lsusb -v    # Dispositivos USB e seus drivers

# Exemplo de saída do lspci -k:
# 01:00.0 VGA compatible controller: NVIDIA Corporation ...
#     Subsystem: ...
#     Kernel driver in use: nvidia
#     Kernel modules: nouveau, nvidia_drm, nvidia

# Ver por que um módulo não está carregando
sudo modprobe -v nome_modulo    # Verbose

# Verificar erros relacionados a módulos
journalctl -k | grep -E "error|fail|insmod|modprobe" | tail -20

# Ver mensagens do kernel em tempo real
dmesg -w

# Verificar dependências de um módulo
modprobe --show-depends nome_modulo`}
      />

      <h2>Casos Práticos</h2>
      <h3>Driver de Rede sem Fio</h3>
      <CodeBlock
        title="Diagnosticar driver WiFi"
        code={`# Ver interface de rede e seu módulo
ip link    # Listar interfaces
# wlan0: <BROADCAST,MULTICAST> ...

# Ver qual módulo está sendo usado
lspci -k | grep -A 3 "Network\|Wireless"
# Kernel driver in use: iwlwifi

# Ver detalhes do módulo WiFi
modinfo iwlwifi

# Recarregar módulo WiFi com problema
sudo modprobe -r iwlwifi
sudo modprobe iwlwifi

# Ver firmware necessário
modinfo iwlwifi | grep firmware
# firmware: iwlwifi-*.ucode

# Instalar firmware
sudo pacman -S linux-firmware`}
      />

      <h3>Módulos de Sistema de Arquivos</h3>
      <CodeBlock
        title="Módulos de sistemas de arquivos"
        code={`# Ver sistemas de arquivos suportados
cat /proc/filesystems

# Verificar se módulo está disponível
modinfo btrfs
modinfo ext4
modinfo xfs
modinfo f2fs

# Carregar suporte a um FS específico
sudo modprobe btrfs
sudo modprobe ntfs3    # NTFS com suporte de escrita (kernel 5.15+)

# Para NTFS mais completo (AUR):
# sudo pacman -S ntfs-3g   (FUSE-based, mais lento mas mais compatível)

# Montar NTFS com ntfs3 (nativo)
sudo mount -t ntfs3 /dev/sdb1 /mnt/windows`}
      />
    </PageContainer>
  );
}
