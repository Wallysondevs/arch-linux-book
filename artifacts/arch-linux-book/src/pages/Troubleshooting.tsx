import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Troubleshooting() {
  return (
    <PageContainer
      title="Troubleshooting"
      subtitle="Guia de resolução de problemas comuns no Arch Linux. Aprenda a diagnosticar e corrigir os erros mais frequentes."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <h2>Filosofia de Troubleshooting</h2>
      <p>
        Resolver problemas no Arch Linux segue uma metodologia simples:
      </p>
      <ol>
        <li><strong>Ler a mensagem de erro</strong> — Parece óbvio, mas muita gente ignora</li>
        <li><strong>Verificar os logs</strong> — <code>journalctl</code> é seu melhor amigo</li>
        <li><strong>Pesquisar no ArchWiki</strong> — Provavelmente alguém já teve o mesmo problema</li>
        <li><strong>Pesquisar nos fóruns</strong> — Arch Forums e Reddit</li>
        <li><strong>Isolar o problema</strong> — O que mudou desde a última vez que funcionava?</li>
      </ol>

      <h2>Tela Preta após Instalação</h2>
      <AlertBox type="danger" title="Problema muito comum">
        A tela preta geralmente é causada por drivers de vídeo incorretos ou ausentes.
      </AlertBox>

      <CodeBlock
        title="Diagnóstico e solução"
        code={`# 1. Tente trocar para um TTY (Ctrl+Alt+F2 até F6)
# Se funcionar, o problema é no ambiente gráfico

# 2. Verificar logs do Xorg
cat /var/log/Xorg.0.log | grep "(EE)"

# 3. Verificar logs do Wayland/compositor
journalctl -b --user -u sway
journalctl -b | grep -i "wayland\\|sway\\|hyprland"

# Para NVIDIA:
# Instalar driver proprietário
sudo pacman -S nvidia nvidia-utils

# Adicionar módulos ao initramfs
# Edite /etc/mkinitcpio.conf
# MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)
sudo mkinitcpio -P

# Adicionar kernel parameter
# Edite /boot/loader/entries/arch.conf (ou GRUB)
# Adicione: nvidia-drm.modeset=1

# Para Intel:
sudo pacman -S mesa intel-media-driver

# Para AMD:
sudo pacman -S mesa xf86-video-amdgpu vulkan-radeon`}
      />

      <h2>Sistema Não Inicia (Boot Quebrado)</h2>
      <CodeBlock
        title="Rescue via USB de instalação"
        code={`# 1. Inicialize pelo USB de instalação do Arch

# 2. Montar o sistema
mount /dev/sdaX /mnt          # Partição root
mount /dev/sdaY /mnt/boot     # Partição boot (se separada)

# 3. Entrar no sistema via arch-chroot
arch-chroot /mnt

# 4. Agora você pode:
# - Reinstalar pacotes
# - Corrigir configurações
# - Regenerar initramfs
# - Reinstalar bootloader

# 5. Sair e reiniciar
exit
umount -R /mnt
reboot`}
      />

      <h3>Regenerar Initramfs</h3>
      <CodeBlock
        title="Rebuild do initramfs"
        code={`# Dentro do arch-chroot:
mkinitcpio -P

# Se o erro for sobre presets:
ls /etc/mkinitcpio.d/
# Deve haver arquivos .preset para cada kernel instalado

# Reinstalar kernel (regenera tudo)
pacman -S linux`}
      />

      <h3>Reinstalar GRUB</h3>
      <CodeBlock
        title="Reinstalar bootloader GRUB"
        code={`# Dentro do arch-chroot:

# Para BIOS/MBR:
grub-install --target=i386-pc /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg

# Para UEFI:
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg`}
      />

      <h3>Reinstalar systemd-boot</h3>
      <CodeBlock
        title="Reinstalar systemd-boot"
        code={`# Dentro do arch-chroot:
bootctl install

# Verificar/editar a entrada
nano /boot/loader/entries/arch.conf

# Conteúdo deve ser algo como:
# title   Arch Linux
# linux   /vmlinuz-linux
# initrd  /initramfs-linux.img
# options root=/dev/sdaX rw`}
      />

      <h2>Problemas com o Pacman</h2>

      <h3>Database Lock</h3>
      <CodeBlock
        title="Erro: unable to lock database"
        code={`# Erro: "unable to lock database"
# Isso acontece quando outra instância do pacman está rodando
# ou quando ele foi interrompido abruptamente

# 1. Verificar se outro pacman está rodando
ps aux | grep pacman

# 2. Se não há outro pacman, remover o lock
sudo rm /var/lib/pacman/db.lck

# 3. Tentar novamente
sudo pacman -Syu`}
      />

      <AlertBox type="warning" title="Não remova o lock cegamente">
        Só remova o arquivo de lock se tiver CERTEZA de que nenhum outro processo do pacman está rodando.
        Se houver outro pacman atualizando, remover o lock pode corromper o banco de dados.
      </AlertBox>

      <h3>Problemas com Chaves (PGP/GPG)</h3>
      <CodeBlock
        title="Erros de chaves e assinaturas"
        code={`# Erro: "invalid or corrupted package (PGP signature)"

# 1. Atualizar o keyring
sudo pacman -S archlinux-keyring

# 2. Se não funcionar, reinicializar completamente
sudo pacman-key --init
sudo pacman-key --populate archlinux

# 3. Se ainda não funcionar
sudo rm -rf /etc/pacman.d/gnupg
sudo pacman-key --init
sudo pacman-key --populate archlinux

# 4. Último recurso: desabilitar verificação temporariamente
# Edite /etc/pacman.conf e mude SigLevel para:
# SigLevel = Never
# INSTALE O PACOTE PROBLEMÁTICO
# DEPOIS VOLTE SigLevel ao valor original!`}
      />

      <h3>Conflitos de Dependência</h3>
      <CodeBlock
        title="Resolver conflitos"
        code={`# Erro: "conflicting dependencies"

# 1. Tentar atualizar tudo primeiro
sudo pacman -Syu

# 2. Se um pacote conflita com outro
sudo pacman -Rdd pacote-conflitante  # Remove sem verificar deps
sudo pacman -S pacote-desejado

# 3. Forçar instalação (ÚLTIMO RECURSO)
sudo pacman -S --overwrite '*' pacote

# 4. Se o banco de dados está corrompido
sudo pacman -Syyu   # Forçar atualização do banco de dados

# Verificar integridade do banco de dados
sudo pacman -Dk`}
      />

      <h3>Pacotes Parcialmente Instalados</h3>
      <CodeBlock
        title="Pacman interrompido durante atualização"
        code={`# Se o pacman foi interrompido no meio de uma atualização:

# 1. Tentar continuar a atualização
sudo pacman -Syu

# 2. Se pacotes estão quebrados
sudo pacman -S pacote-quebrado --overwrite '*'

# 3. Reinstalar todos os pacotes
sudo pacman -Qqn | sudo pacman -S -

# 4. Verificar arquivos modificados
sudo pacman -Qkk 2>&1 | grep -v "0 altered"

# 5. Verificar dependências quebradas
sudo pacman -Dk`}
      />

      <h2>Kernel Panic</h2>
      <CodeBlock
        title="Recuperando de kernel panic"
        code={`# 1. Boot pelo USB de instalação
# 2. arch-chroot no sistema

# 3. Instalar kernel LTS como fallback
pacman -S linux-lts linux-lts-headers

# 4. Regenerar initramfs
mkinitcpio -P

# 5. Atualizar bootloader para incluir kernel LTS
grub-mkconfig -o /boot/grub/grub.cfg
# ou adicionar entrada no systemd-boot

# 6. No próximo boot, escolher o kernel LTS

# Prevenção: sempre tenha o kernel LTS instalado como backup
sudo pacman -S linux-lts linux-lts-headers`}
      />

      <AlertBox type="success" title="Dica: Sempre tenha um kernel de backup">
        Instale o <code>linux-lts</code> junto com o <code>linux</code>. Se uma atualização do kernel
        quebrar algo, você pode escolher o LTS no boot e ter um sistema funcional para corrigir.
      </AlertBox>

      <h2>Problemas de Display/Driver</h2>
      <CodeBlock
        title="Diagnóstico de vídeo"
        code={`# Verificar qual driver está em uso
lspci -k | grep -A 3 VGA

# Ver logs do Xorg
cat /var/log/Xorg.0.log | grep -E "\\(EE\\)|\\(WW\\)"

# Verificar se o módulo nvidia está carregado
lsmod | grep nvidia

# Verificar se mesa (OpenGL) está funcionando
glxinfo | grep "OpenGL renderer"

# Para Wayland, verificar variáveis de sessão
echo $XDG_SESSION_TYPE    # Deve mostrar "wayland" ou "x11"

# Se NVIDIA + Wayland não funciona:
# Adicionar ao kernel parameters:
# nvidia-drm.modeset=1
# e ao /etc/environment:
# GBM_BACKEND=nvidia-drm
# __GLX_VENDOR_LIBRARY_NAME=nvidia`}
      />

      <h2>Problemas de Áudio</h2>
      <CodeBlock
        title="Diagnóstico de áudio"
        code={`# Verificar se PipeWire está rodando
systemctl --user status pipewire pipewire-pulse wireplumber

# Reiniciar o áudio
systemctl --user restart pipewire pipewire-pulse wireplumber

# Verificar dispositivos de áudio
wpctl status

# Ajustar volume
wpctl set-volume @DEFAULT_AUDIO_SINK@ 50%

# Verificar se o dispositivo não está mutado
wpctl set-mute @DEFAULT_AUDIO_SINK@ 0

# Testar áudio
speaker-test -c 2

# Se PulseAudio está conflitando
# Remover PulseAudio e instalar PipeWire
sudo pacman -Rns pulseaudio
sudo pacman -S pipewire pipewire-pulse wireplumber`}
      />

      <h2>Problemas de Rede</h2>
      <CodeBlock
        title="Diagnóstico de rede"
        code={`# Verificar se NetworkManager está rodando
systemctl status NetworkManager

# Verificar interfaces
ip link show

# Reiniciar NetworkManager
sudo systemctl restart NetworkManager

# DNS não funciona
# Verificar /etc/resolv.conf
cat /etc/resolv.conf

# Definir DNS manualmente
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Wi-Fi não conecta
nmcli device wifi rescan
nmcli device wifi list
nmcli device wifi connect "Rede" password "Senha"

# Verificar se o firmware do Wi-Fi está instalado
dmesg | grep -i firmware
# Se faltar firmware: sudo pacman -S linux-firmware`}
      />

      <h2>Ferramentas de Diagnóstico Geral</h2>
      <CodeBlock
        title="Comandos úteis para diagnóstico"
        code={`# Logs do boot atual
journalctl -b

# Logs com erros
journalctl -b -p err

# Serviços que falharam
systemctl --failed

# Informações de hardware
lspci          # Dispositivos PCI
lsusb          # Dispositivos USB
lscpu          # Informações da CPU
free -h        # Memória
df -h          # Espaço em disco

# Verificar o que mudou recentemente
# Últimos pacotes instalados/atualizados
grep -E "installed|upgraded" /var/log/pacman.log | tail -30

# Verificar espaço em disco
df -h
du -sh /var/cache/pacman/pkg/  # Cache do pacman

# Temperatura e sensores
sensors    # Instalar: sudo pacman -S lm_sensors && sudo sensors-detect`}
      />

      <AlertBox type="info" title="A ArchWiki é sua melhor amiga">
        A maioria dos problemas já foi documentada na ArchWiki. Antes de perguntar em fóruns,
        pesquise em <code>wiki.archlinux.org</code>. A wiki é considerada a melhor documentação
        de qualquer distribuição Linux.
      </AlertBox>
    </PageContainer>
  );
}
