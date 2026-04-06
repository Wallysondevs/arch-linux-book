import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Plymouth() {
  return (
    <PageContainer
      title="Plymouth: Tela de Boot"
      subtitle="Configure uma tela de boot bonita com animação, temas e transição suave para o login no Arch Linux."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>O que é Plymouth?</h2>
      <p>
        O <strong>Plymouth</strong> é o sistema de splash screen do Linux. Ele mostra uma tela de boot 
        bonita com animação enquanto o sistema carrega, substituindo as mensagens de texto técnicas.
        Fornece uma transição visual suave do boot até a tela de login.
      </p>

      <h2>Instalação</h2>

      <CodeBlock
        title="Instalar e configurar Plymouth"
        code={`# Instalar Plymouth
sudo pacman -S plymouth

# Adicionar hook ao mkinitcpio
sudo vim /etc/mkinitcpio.conf
# Adicionar "plymouth" após "base" e "udev" nos HOOKS:
# HOOKS=(base udev plymouth ... filesystems ...)
# Se usar encrypt: substituir "encrypt" por "plymouth-encrypt"

# Reconstruir initramfs
sudo mkinitcpio -P`}
      />

      <h2>Configuração do Bootloader</h2>

      <CodeBlock
        title="Configurar kernel para Plymouth"
        code={`# GRUB: editar /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash loglevel=3 rd.udev.log_priority=3 vt.global_cursor_default=0"

# Regenerar
sudo grub-mkconfig -o /boot/grub/grub.cfg

# systemd-boot: editar entrada
options ... quiet splash loglevel=3 rd.udev.log_priority=3 vt.global_cursor_default=0

# Parâmetros explicados:
# quiet        — reduzir mensagens de boot
# splash       — habilitar Plymouth
# loglevel=3   — só mostrar erros
# rd.udev.log_priority=3 — reduzir logs do udev
# vt.global_cursor_default=0 — esconder cursor piscante`}
      />

      <h2>Temas</h2>

      <CodeBlock
        title="Gerenciar temas do Plymouth"
        code={`# Listar temas instalados
plymouth-set-default-theme --list

# Ver tema atual
plymouth-set-default-theme

# Mudar tema
sudo plymouth-set-default-theme -R bgrt
# -R reconstrui o initramfs automaticamente

# Temas incluídos:
# bgrt       — Logo do fabricante (do UEFI)
# fade-in    — Fade simples com estrelas
# glow       — Logo com brilho
# script     — Logo Arch com spinner
# solar      — Efeito solar
# spinner    — Spinner animado
# text       — Apenas texto
# tribar     — Barras coloridas

# Instalar temas extras do AUR
yay -S plymouth-theme-arch-charge
yay -S plymouth-theme-monoarch

# Após instalar tema novo
sudo plymouth-set-default-theme -R nome-do-tema`}
      />

      <h2>Integração com Display Manager</h2>

      <CodeBlock
        title="Transição suave para o login"
        code={`# Para SDDM
sudo systemctl disable sddm
sudo systemctl enable sddm-plymouth

# Para GDM
sudo systemctl disable gdm
sudo systemctl enable gdm-plymouth

# Para LightDM
sudo systemctl disable lightdm
sudo systemctl enable lightdm-plymouth

# Isso faz o Plymouth fazer uma transição suave
# para a tela de login em vez de piscar`}
      />

      <h2>Testando sem Reiniciar</h2>

      <CodeBlock
        title="Testar tema do Plymouth"
        code={`# Testar em modo texto (dentro do desktop)
sudo plymouthd
sudo plymouth --show-splash
# Esperar alguns segundos
sudo plymouth --quit

# Definir duração do teste
sudo plymouthd; sudo plymouth --show-splash; sleep 5; sudo plymouth --quit`}
      />

      <h2>Criando Tema Personalizado</h2>

      <CodeBlock
        title="Estrutura de um tema Plymouth"
        code={`# Temas ficam em /usr/share/plymouth/themes/
# Cada tema tem:
# ├── nome-do-tema.plymouth  # Arquivo de definição
# ├── nome-do-tema.script    # Script de animação
# └── imagens/               # Imagens do tema

# Exemplo de arquivo .plymouth
# /usr/share/plymouth/themes/meu-tema/meu-tema.plymouth
[Plymouth Theme]
Name=Meu Tema
Description=Tema personalizado para Arch
ModuleName=script

[script]
ImageDir=/usr/share/plymouth/themes/meu-tema
ScriptFile=/usr/share/plymouth/themes/meu-tema/meu-tema.script`}
      />

      <AlertBox type="info" title="Plymouth e tempo de boot">
        O Plymouth adiciona uma fração de segundo ao boot. Em SSDs/NVMe modernos, 
        o boot pode ser tão rápido que a animação mal aparece. Nesse caso, você pode 
        adicionar <code>plymouth.force-splash-screen</code> aos parâmetros do kernel 
        para garantir que a animação seja exibida.
      </AlertBox>
    </PageContainer>
  );
}
