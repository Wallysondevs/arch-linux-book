import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Bootloaders() {
  return (
    <PageContainer
      title="Bootloaders: GRUB & systemd-boot"
      subtitle="Entenda os bootloaders do Linux, como configurar GRUB e systemd-boot, e como gerenciar múltiplos sistemas operacionais."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <h2>O que é um Bootloader?</h2>
      <p>
        O bootloader (carregador de inicialização) é o primeiro software que roda quando você liga o computador.
        Ele é responsável por carregar o kernel do Linux na memória e iniciar o sistema operacional.
        No Arch Linux, os dois bootloaders mais populares são o <strong>GRUB</strong> e o <strong>systemd-boot</strong>.
      </p>

      <AlertBox type="info" title="GRUB vs systemd-boot">
        O <strong>GRUB</strong> é mais poderoso e suporta BIOS e UEFI, mas é mais complexo.
        O <strong>systemd-boot</strong> (antigo gummiboot) é mais simples, mais rápido e integrado ao systemd, mas só funciona em UEFI.
        Para instalações modernas com UEFI, o systemd-boot é geralmente preferido pela comunidade Arch.
      </AlertBox>

      <h2>GRUB (Grand Unified Bootloader)</h2>

      <h3>Instalação do GRUB em UEFI</h3>
      <CodeBlock
        title="Instalar GRUB em sistema UEFI"
        code={`# Instalar pacotes necessários
sudo pacman -S grub efibootmgr

# Instalar o GRUB na partição EFI
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB

# Gerar o arquivo de configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <h3>Instalação do GRUB em BIOS/MBR (Legacy)</h3>
      <CodeBlock
        title="Instalar GRUB em sistema BIOS"
        code={`# Instalar GRUB
sudo pacman -S grub

# Instalar no disco (NÃO na partição!)
sudo grub-install --target=i386-pc /dev/sda

# Gerar configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <AlertBox type="danger" title="Cuidado com grub-install">
        Em BIOS/MBR, instale no disco (<code>/dev/sda</code>), NÃO na partição (<code>/dev/sda1</code>).
        Instalar na partição pode tornar o sistema não-inicializável.
      </AlertBox>

      <h3>Configuração do GRUB</h3>
      <p>
        O arquivo principal de configuração é <code>/etc/default/grub</code>. Após qualquer alteração,
        você precisa regenerar o <code>grub.cfg</code>.
      </p>

      <CodeBlock
        title="Configurações úteis do /etc/default/grub"
        code={`# Tempo de espera no menu (em segundos)
GRUB_TIMEOUT=5

# Sistema padrão para iniciar (0 = primeiro da lista)
GRUB_DEFAULT=0

# Lembrar a última escolha do usuário
GRUB_DEFAULT=saved
GRUB_SAVEDEFAULT=true

# Parâmetros do kernel
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet"

# Resolução do console
GRUB_GFXMODE=1920x1080

# Desativar submenu (mostra tudo na lista principal)
GRUB_DISABLE_SUBMENU=y

# Habilitar detecção de outros SOs (precisa do os-prober)
GRUB_DISABLE_OS_PROBER=false`}
      />

      <CodeBlock
        title="Regenerar configuração após mudanças"
        code="sudo grub-mkconfig -o /boot/grub/grub.cfg"
      />

      <h3>Dual-Boot com Windows</h3>
      <CodeBlock
        title="Configurar dual-boot com Windows"
        code={`# Instalar os-prober para detectar Windows
sudo pacman -S os-prober

# Montar a partição do Windows (se não estiver montada)
sudo mount /dev/sda3 /mnt/windows

# Habilitar os-prober no GRUB
sudo vim /etc/default/grub
# Adicionar: GRUB_DISABLE_OS_PROBER=false

# Regenerar configuração
sudo grub-mkconfig -o /boot/grub/grub.cfg

# O Windows deve aparecer como opção no menu do GRUB`}
      />

      <h3>Temas do GRUB</h3>
      <CodeBlock
        title="Instalar um tema no GRUB"
        code={`# Exemplo: instalar tema do AUR
yay -S grub-theme-vimix

# Configurar o tema em /etc/default/grub
GRUB_THEME="/usr/share/grub/themes/Vimix/theme.txt"

# Regenerar
sudo grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <h2>systemd-boot</h2>
      <p>
        O systemd-boot é um bootloader UEFI simples e rápido, integrado ao systemd.
        Ele é a escolha preferida para instalações modernas do Arch Linux.
      </p>

      <h3>Instalação do systemd-boot</h3>
      <CodeBlock
        title="Instalar systemd-boot"
        code={`# A partição EFI deve estar montada em /boot
# (ou /efi, mas /boot é mais simples)

# Instalar
sudo bootctl install

# Verificar status
bootctl status`}
      />

      <h3>Configuração de Entradas</h3>
      <CodeBlock
        title="Configurar o loader principal"
        code={`# Editar /boot/loader/loader.conf
sudo vim /boot/loader/loader.conf

# Conteúdo:
default arch.conf
timeout 3
console-mode max
editor  no`}
      />

      <CodeBlock
        title="Criar entrada para o Arch Linux"
        code={`# Criar /boot/loader/entries/arch.conf
sudo vim /boot/loader/entries/arch.conf

# Conteúdo para partição ext4/xfs:
title   Arch Linux
linux   /vmlinuz-linux
initrd  /initramfs-linux.img
options root=UUID=XXXX-XXXX-XXXX rw quiet loglevel=3

# Para descobrir o UUID:
blkid /dev/sda2`}
      />

      <CodeBlock
        title="Entrada para kernel LTS (fallback)"
        code={`# Criar /boot/loader/entries/arch-lts.conf
title   Arch Linux (LTS)
linux   /vmlinuz-linux-lts
initrd  /initramfs-linux-lts.img
options root=UUID=XXXX-XXXX-XXXX rw quiet`}
      />

      <CodeBlock
        title="Entrada com Btrfs e LUKS"
        code={`# /boot/loader/entries/arch.conf
title   Arch Linux
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options rd.luks.name=UUID-DO-LUKS=cryptroot root=/dev/mapper/cryptroot rootflags=subvol=@ rw quiet`}
      />

      <h3>Atualização Automática</h3>
      <CodeBlock
        title="Configurar atualização automática do systemd-boot"
        code={`# O pacman hook do systemd-boot atualiza automaticamente
# Verificar se o hook existe
ls /usr/lib/systemd/boot/

# Habilitar atualização automática
sudo systemctl enable systemd-boot-update.service

# Atualizar manualmente
sudo bootctl update`}
      />

      <h2>Microcode (Intel/AMD)</h2>
      <p>
        Microcodes são atualizações de firmware para o processador. 
        Carregá-los no boot corrige bugs e vulnerabilidades de hardware.
      </p>

      <CodeBlock
        title="Instalar e configurar microcode"
        code={`# Intel
sudo pacman -S intel-ucode

# AMD
sudo pacman -S amd-ucode

# Para GRUB: regenerar configuração (detecta automaticamente)
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Para systemd-boot: adicionar na entrada ANTES do initramfs
# initrd  /intel-ucode.img    (ou /amd-ucode.img)
# initrd  /initramfs-linux.img`}
      />

      <h2>Recuperação de Boot</h2>

      <CodeBlock
        title="Recuperar GRUB quebrado usando Live USB"
        code={`# 1. Bootar pelo Live USB do Arch

# 2. Montar as partições
mount /dev/sda2 /mnt          # partição root
mount /dev/sda1 /mnt/boot/efi # partição EFI (se UEFI)

# 3. Entrar no chroot
arch-chroot /mnt

# 4. Reinstalar GRUB
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# 5. Sair e reiniciar
exit
umount -R /mnt
reboot`}
      />

      <AlertBox type="info" title="Qual bootloader escolher?">
        <strong>systemd-boot</strong>: se você usa apenas UEFI, quer simplicidade e velocidade. Ideal para single-boot ou dual-boot simples.
        <br/><br/>
        <strong>GRUB</strong>: se precisa de BIOS/Legacy, quer temas visuais, precisa de criptografia complexa ou tem muitos SOs para gerenciar.
      </AlertBox>
    </PageContainer>
  );
}
