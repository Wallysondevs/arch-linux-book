import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BootProcess() {
  return (
    <PageContainer
      title="Processo de Boot"
      subtitle="Da pressão do botão de ligar até o prompt de login. Entenda cada etapa do boot no Arch Linux com UEFI, GRUB e systemd."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <h2>Visão Geral do Boot</h2>
      <p>
        Quando você liga o computador, uma sequência precisa de eventos acontece antes de você
        ver o prompt de login. Entender essa sequência é essencial para diagnosticar problemas
        de boot e configurar o sistema corretamente.
      </p>
      <p>
        A sequência completa em um sistema moderno com UEFI é:
      </p>
      <ol>
        <li><strong>Power-on</strong> — CPU executa código da ROM/Flash (firmware UEFI)</li>
        <li><strong>UEFI POST</strong> — Power-On Self Test, verifica hardware básico</li>
        <li><strong>UEFI Boot Manager</strong> — Identifica e carrega o bootloader</li>
        <li><strong>Bootloader (GRUB/systemd-boot)</strong> — Carrega o kernel e initramfs</li>
        <li><strong>Kernel</strong> — Inicializa hardware, monta o initramfs</li>
        <li><strong>initramfs</strong> — Ambiente temporário para preparar o sistema real</li>
        <li><strong>Root filesystem</strong> — Sistema de arquivos real é montado</li>
        <li><strong>systemd (PID 1)</strong> — Gerencia inicialização dos serviços</li>
        <li><strong>Login</strong> — Getty ou display manager aparece</li>
      </ol>

      <h2>Etapa 1: Firmware UEFI</h2>
      <p>
        UEFI (Unified Extensible Firmware Interface) substituiu o BIOS legado na maioria dos
        computadores fabricados após 2012. É o primeiro software que roda ao ligar o PC.
      </p>
      <ul>
        <li>Armazenado em chip flash na placa-mãe</li>
        <li>Roda em modo 64-bit (diferente do BIOS que era 16-bit)</li>
        <li>Suporta discos GPT maiores que 2TB</li>
        <li>Tem seu próprio shell e gerenciador de boot</li>
        <li>Pode inicializar diretamente sem bootloader (EFISTUB)</li>
      </ul>
      <CodeBlock
        title="Gerenciar entradas UEFI via efibootmgr"
        code={`# Listar entradas de boot UEFI
efibootmgr

# Saída típica:
# BootCurrent: 0002
# Timeout: 1 seconds
# BootOrder: 0002,0000,0001
# Boot0000* Windows Boot Manager    HD(1,GPT,...)
# Boot0001* UEFI: USB Drive         HD(2,GPT,...)
# Boot0002* Arch Linux              HD(1,GPT,...)/File(\EFI\GRUB\grubx64.efi)

# Criar nova entrada de boot
efibootmgr --create --disk /dev/sda --part 1 --label "Arch Linux" --loader '\EFI\GRUB\grubx64.efi'

# Remover entrada de boot
efibootmgr --delete-bootnum --bootnum 0003

# Definir ordem de boot
efibootmgr --bootorder 0002,0001,0000

# Ativar/desativar entrada
efibootmgr --active --bootnum 0002
efibootmgr --inactive --bootnum 0001

# Próximo boot (uma vez só)
efibootmgr --bootnext 0001`}
      />

      <h2>Partição EFI (ESP)</h2>
      <p>
        A ESP (EFI System Partition) é onde o UEFI procura os bootloaders. Deve ser formatada
        como FAT32 e montada em <code>/boot</code> ou <code>/boot/efi</code>.
      </p>
      <CodeBlock
        title="Configurar a partição EFI"
        code={`# Ver partições e identificar a ESP
lsblk -f
# nvme0n1p1  vfat  FAT32  ESP   ...  /boot

# A ESP geralmente é identificada pelo tipo GPT:
# gdisk: EF00 (EFI System)
# fdisk: EFI System

# Montar a ESP manualmente
mount /dev/nvme0n1p1 /boot

# Ver conteúdo típico da ESP
ls /boot/EFI/
# BOOT/  Arch/  Microsoft/  grub/

ls /boot/EFI/grub/
# grubx64.efi

# Verificar tipo da partição
blkid /dev/nvme0n1p1
# ... TYPE="vfat" PARTLABEL="EFI system partition" ...`}
      />

      <h2>Etapa 2: GRUB (Bootloader)</h2>
      <p>
        O GRUB (Grand Unified Bootloader) é o bootloader mais popular no Arch Linux. Ele:
      </p>
      <ul>
        <li>Apresenta um menu para escolher o sistema operacional</li>
        <li>Carrega o kernel e o initramfs na memória RAM</li>
        <li>Passa parâmetros de boot ao kernel</li>
        <li>Suporta múltiplos SO (Windows, outras distros)</li>
      </ul>

      <h3>Configuração do GRUB</h3>
      <CodeBlock
        title="Gerenciar o GRUB"
        code={`# Instalar GRUB (se não estiver instalado)
sudo pacman -S grub efibootmgr

# Instalar GRUB na ESP (para UEFI)
sudo grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB

# Gerar o arquivo de configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Ver o arquivo gerado
cat /boot/grub/grub.cfg | head -50

# Configuração principal do GRUB
sudo nano /etc/default/grub`}
      />

      <CodeBlock
        title="/etc/default/grub - Configurações importantes"
        code={`# Tempo de espera no menu (segundos)
GRUB_TIMEOUT=5

# Entrada padrão (0 = primeira, saved = última escolhida)
GRUB_DEFAULT=0
# ou: GRUB_DEFAULT=saved com GRUB_SAVEDEFAULT=true

# Parâmetros passados ao kernel
GRUB_CMDLINE_LINUX_DEFAULT="quiet loglevel=3"
# quiet = menos mensagens de boot
# loglevel=3 = apenas erros
# nomodeset = desabilitar KMS (útil para problemas de vídeo)
# resume=/dev/sdaX = partição de swap para hibernação
# nvidia-drm.modeset=1 = para NVIDIA com Wayland
# iommu=on = para passthrough de GPU em VMs

# Parâmetros para todos os boots (incluindo recovery)
GRUB_CMDLINE_LINUX=""

# Resolução do menu GRUB
GRUB_GFXMODE=1920x1080,auto
GRUB_GFXPAYLOAD_LINUX=keep

# Salvar última escolha
GRUB_SAVEDEFAULT=true
GRUB_DEFAULT=saved

# APÓS EDITAR: regenerar configuração
# sudo grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <AlertBox type="info" title="Sempre regenerar após editar">
        Após qualquer mudança em <code>/etc/default/grub</code>, execute
        <code>sudo grub-mkconfig -o /boot/grub/grub.cfg</code> para aplicar as mudanças.
        O arquivo <code>grub.cfg</code> é gerado automaticamente e não deve ser editado diretamente.
      </AlertBox>

      <h2>systemd-boot (Alternativa ao GRUB)</h2>
      <p>
        O systemd-boot é um bootloader minimalista incluído no systemd. Mais simples que o GRUB,
        mas suporta apenas sistemas UEFI e funciona melhor quando a ESP é montada em <code>/boot</code>.
      </p>
      <CodeBlock
        title="Instalar e configurar systemd-boot"
        code={`# Instalar systemd-boot na ESP
sudo bootctl install

# Verificar instalação
bootctl status

# Localização dos arquivos
ls /boot/loader/          # Configuração principal
ls /boot/loader/entries/  # Entradas de boot

# Criar entrada para Arch Linux
sudo nano /boot/loader/entries/arch.conf`}
      />
      <CodeBlock
        title="/boot/loader/entries/arch.conf"
        code={`title   Arch Linux
linux   /vmlinuz-linux
initrd  /amd-ucode.img    # ou intel-ucode.img
initrd  /initramfs-linux.img
options root=PARTUUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx rw quiet loglevel=3

# Para encontrar o PARTUUID da partição root:
# blkid /dev/nvme0n1p3 | grep PARTUUID`}
      />
      <CodeBlock
        title="/boot/loader/loader.conf - Configuração principal"
        code={`default arch.conf
timeout 5
console-mode max
editor no    # Desabilitar edição de parâmetros no boot (mais seguro)`}
      />
      <CodeBlock
        title="Gerenciar systemd-boot"
        code={`# Ver status
bootctl status

# Atualizar o bootloader
bootctl update

# Listar entradas de boot
bootctl list

# Definir próximo boot
bootctl set-oneshot arch-fallback.conf`}
      />

      <h2>Microcode (Intel/AMD)</h2>
      <p>
        Microcode são atualizações de firmware para a CPU que corrigem bugs e vulnerabilidades.
        Devem ser carregados o mais cedo possível no boot, antes do kernel inicializar a CPU.
      </p>
      <CodeBlock
        title="Instalar e configurar microcode"
        code={`# Para CPU Intel
sudo pacman -S intel-ucode

# Para CPU AMD
sudo pacman -S amd-ucode

# Verificar qual CPU você tem
lscpu | grep "Model name"
cat /proc/cpuinfo | grep "model name" | head -1

# Para GRUB: apenas regenerar a configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg
# O GRUB detecta automaticamente e adiciona o microcode

# Para systemd-boot: adicionar linha initrd no .conf
# initrd /intel-ucode.img   (antes do initramfs)
# initrd /initramfs-linux.img

# Verificar se o microcode está sendo carregado
dmesg | grep -i microcode
# microcode: Current revision: 0x0000000f
# microcode: Updated early: 0x00000010`}
      />

      <h2>Etapas 5-7: Kernel e initramfs</h2>
      <p>
        Após o bootloader, o kernel é carregado na RAM e começa a execução. Ele:
      </p>
      <ol>
        <li>Descomprime a si mesmo (o kernel é armazenado comprimido)</li>
        <li>Inicializa hardware básico (CPU, memória, barramento PCI)</li>
        <li>Monta o initramfs como sistema de arquivos temporário</li>
        <li>Executa <code>/init</code> dentro do initramfs (que é o systemd no Arch)</li>
        <li>O initramfs carrega módulos necessários e monta o sistema real</li>
        <li>O sistema real é montado em <code>/</code></li>
        <li>O initramfs passa o controle para o systemd do sistema real</li>
      </ol>

      <h2>Etapa 8: systemd (PID 1)</h2>
      <p>
        O systemd é o primeiro processo no espaço de usuário (PID 1). Ele é responsável por
        inicializar todos os outros serviços do sistema.
      </p>
      <CodeBlock
        title="Visualizar o processo de boot do systemd"
        code={`# Análise de tempo de boot
systemd-analyze

# Saída:
# Startup finished in 1.234s (firmware) + 3.567s (loader) + 1.890s (kernel) + 8.123s (userspace) = 14.814s
# graphical.target reached after 8.045s in userspace.

# Ver qual serviço está atrasando o boot
systemd-analyze blame

# Gráfico SVG do boot (abre no navegador)
systemd-analyze plot > boot.svg && xdg-open boot.svg

# Ver a cadeia crítica do boot
systemd-analyze critical-chain

# Ver log completo do boot atual
journalctl -b

# Ver log do boot anterior
journalctl -b -1

# Ver apenas mensagens de erro do boot
journalctl -b -p err`}
      />

      <h2>Recuperação de Boot Quebrado</h2>
      <p>
        Se o sistema não consegue bootar, você pode usar a ISO do Arch para entrar em
        chroot e reparar o sistema.
      </p>
      <CodeBlock
        title="Recuperar sistema via chroot"
        code={`# Boot pela ISO do Arch Linux
# Conectar na internet
iwctl station wlan0 connect "MinhaRede"

# Montar o sistema instalado
mount /dev/nvme0n1p3 /mnt        # partição root
mount /dev/nvme0n1p1 /mnt/boot   # partição ESP (EFI)
# Se tiver /home separado:
mount /dev/nvme0n1p4 /mnt/home

# Montar sistemas virtuais necessários
arch-chroot /mnt    # Isso cuida de montar proc, sys, dev automaticamente

# Agora você está dentro do sistema instalado
# Reparar problemas:

# Regenerar initramfs
mkinitcpio -P

# Reinstalar/reconfigurar GRUB
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Ou reinstalar systemd-boot
bootctl install

# Sair do chroot
exit

# Desmontar e reiniciar
umount -R /mnt
reboot`}
      />

      <AlertBox type="warning" title="Fallback initramfs">
        O Arch sempre gera dois initramfs: o normal e um <strong>fallback</strong>.
        O fallback inclui todos os módulos disponíveis, sendo muito maior mas mais compatível.
        Se o sistema normal não boota, tente o fallback no menu do GRUB.
      </AlertBox>

      <h2>Secure Boot</h2>
      <p>
        O Secure Boot é uma funcionalidade UEFI que verifica assinaturas digitais dos bootloaders
        antes de carregá-los. Por padrão, o Arch Linux não tem suporte a Secure Boot,
        mas é possível configurar.
      </p>
      <CodeBlock
        title="Lidar com Secure Boot"
        code={`# Verificar status do Secure Boot
bootctl status | grep "Secure Boot"
# ou
mokutil --sb-state

# Opção 1: Desabilitar Secure Boot (mais fácil)
# Entre na UEFI/BIOS e procure por "Secure Boot" e desabilite

# Opção 2: Usar shim (mantém Secure Boot)
sudo pacman -S shim-signed

# Opção 3: Assinar seu próprio bootloader (avançado)
# Requer criar chaves MOK (Machine Owner Keys)
sudo pacman -S sbsigntools efitools
# Processo complexo, ver wiki.archlinux.org/Secure_Boot`}
      />
    </PageContainer>
  );
}
