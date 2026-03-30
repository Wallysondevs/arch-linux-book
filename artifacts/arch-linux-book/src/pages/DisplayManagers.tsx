import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DisplayManagers() {
  return (
    <PageContainer
      title="Display Managers"
      subtitle="GDM, SDDM, LightDM e outros. Configure a tela de login gráfica do seu Arch Linux e entenda como os display managers funcionam."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <h2>O que é um Display Manager?</h2>
      <p>
        Um Display Manager (DM) é o programa responsável pela tela de login gráfica. Ele
        exibe o formulário de usuário/senha, carrega a sessão selecionada (GNOME, KDE, i3, etc.)
        e gerencia múltiplas sessões simultâneas.
      </p>
      <p>
        O DM fica em loop: exibe o login, autentica o usuário, inicia a sessão gráfica,
        e quando o usuário faz logout, volta para a tela de login.
      </p>

      <h2>GDM (GNOME Display Manager)</h2>
      <p>
        DM padrão do GNOME. Integra-se profundamente com o GNOME Shell, mas pode ser usado
        com outros ambientes.
      </p>
      <CodeBlock
        title="Instalar e configurar GDM"
        code={`# Instalar GDM
sudo pacman -S gdm

# Habilitar GDM para iniciar automaticamente com o sistema
sudo systemctl enable gdm

# Iniciar GDM agora (sem reiniciar)
sudo systemctl start gdm

# Ver status
sudo systemctl status gdm

# Configuração via gsettings (quando logado em GNOME)
gsettings set org.gnome.login-screen disable-user-list true  # Ocultar lista de usuários
gsettings set org.gnome.login-screen banner-message-enable true
gsettings set org.gnome.login-screen banner-message-text "Bem-vindo!"

# Configuração do GDM
# Arquivo: /etc/gdm/custom.conf
sudo nano /etc/gdm/custom.conf`}
      />
      <CodeBlock
        title="/etc/gdm/custom.conf"
        code={`[daemon]
# AutomaticLoginEnable = True
# AutomaticLogin = nome_usuario
# Desabilitar Wayland (usar X11)
# WaylandEnable=false

[security]
# AllowRoot = false

[xdmcp]

[chooser]

[debug]
# Enable=true`}
      />

      <h2>SDDM (Simple Desktop Display Manager)</h2>
      <p>
        DM padrão do KDE Plasma e LXQt. Moderno, usa QML para temas, suporta Wayland.
      </p>
      <CodeBlock
        title="Instalar e configurar SDDM"
        code={`# Instalar SDDM
sudo pacman -S sddm

# Habilitar
sudo systemctl enable sddm

# Configurar
sudo mkdir -p /etc/sddm.conf.d/
sudo nano /etc/sddm.conf.d/sddm.conf`}
      />
      <CodeBlock
        title="/etc/sddm.conf.d/sddm.conf"
        code={`[Autologin]
# Login automático
# User=usuario
# Session=plasma

[General]
HaltCommand=/usr/bin/systemctl poweroff
RebootCommand=/usr/bin/systemctl reboot

[Theme]
Current=breeze    # Tema padrão KDE
# Temas disponíveis: ls /usr/share/sddm/themes/

[Users]
MaximumUid=60000
MinimumUid=1000
HideUsers=

[X11]
MinimumVT=7
ServerArguments=-nolisten tcp`}
      />
      <CodeBlock
        title="Instalar temas do SDDM"
        code={`# Temas disponíveis no AUR
yay -S sddm-theme-catppuccin
yay -S sddm-theme-sugar-dark

# Temas da comunidade
ls /usr/share/sddm/themes/

# Definir tema
sudo sddm --example-config > /etc/sddm.conf
# Editar Theme.Current no arquivo`}
      />

      <h2>LightDM</h2>
      <p>
        Display manager leve e flexível. Usa "greeters" (módulos de interface) intercambiáveis.
        Bom para ambientes leves como XFCE, LXDE, Openbox.
      </p>
      <CodeBlock
        title="Instalar e configurar LightDM"
        code={`# Instalar LightDM e um greeter
sudo pacman -S lightdm

# Greeters disponíveis:
sudo pacman -S lightdm-gtk-greeter         # GTK simples
sudo pacman -S lightdm-webkit2-greeter     # WebKit (temas HTML/CSS)
yay -S lightdm-slick-greeter              # Moderno e bonito

# Habilitar
sudo systemctl enable lightdm

# Configurar o greeter padrão
sudo nano /etc/lightdm/lightdm.conf`}
      />
      <CodeBlock
        title="/etc/lightdm/lightdm.conf"
        code={`[Seat:*]
greeter-session=lightdm-gtk-greeter    # Qual greeter usar
# greeter-session=lightdm-slick-greeter

# Login automático
# autologin-user=usuario
# autologin-user-timeout=0

# Sessão padrão
# user-session=xfce
# user-session=i3`}
      />

      <h2>ly (Display Manager Minimalista)</h2>
      <p>
        Display manager que roda no TTY, sem interface gráfica separada. Muito leve e rápido.
        Popular entre usuários de tiling window managers.
      </p>
      <CodeBlock
        title="Instalar e usar ly"
        code={`# Disponível no AUR
yay -S ly

# Habilitar
sudo systemctl enable ly
sudo systemctl disable gdm sddm lightdm  # Desabilitar outros DMs

# Configuração
sudo nano /etc/ly/config.ini`}
      />

      <h2>Sem Display Manager (startx)</h2>
      <p>
        Você pode iniciar o ambiente gráfico manualmente sem nenhum DM, usando o <code>startx</code>.
        Muito popular entre usuários de i3, dwm e outros tiling WMs.
      </p>
      <CodeBlock
        title="Usar startx em vez de DM"
        code={`# Instalar xorg-xinit
sudo pacman -S xorg-xinit

# Criar arquivo .xinitrc
nano ~/.xinitrc

# Conteúdo do .xinitrc para iniciar i3:
#!/bin/sh
exec i3

# Para XFCE:
#!/bin/sh
exec startxfce4

# Para KDE:
#!/bin/sh
exec startplasma-x11

# Iniciar manualmente
startx

# Iniciar automaticamente no login (via .bash_profile)
nano ~/.bash_profile
# Adicionar ao final:
if [ -z "$DISPLAY" ] && [ "$XDG_VTNR" = 1 ]; then
  exec startx
fi`}
      />

      <h2>Sessões Disponíveis</h2>
      <CodeBlock
        title="Gerenciar sessões"
        code={`# Listar sessões disponíveis para X11
ls /usr/share/xsessions/

# Listar sessões para Wayland
ls /usr/share/wayland-sessions/

# Conteúdo de um arquivo .desktop de sessão
cat /usr/share/xsessions/plasma.desktop
# [Desktop Entry]
# Name=Plasma (X11)
# Exec=startplasma-x11
# ...

# Verificar qual sessão está ativa
echo $XDG_SESSION_TYPE    # x11 ou wayland
echo $XDG_CURRENT_DESKTOP # KDE, GNOME, i3, etc.`}
      />

      <AlertBox type="info" title="Apenas um DM por vez">
        Habilite apenas um display manager por vez com <code>systemctl enable</code>.
        Se mais de um estiver habilitado, haverá conflito. Para trocar de DM,
        desabilite o atual antes de habilitar o novo.
      </AlertBox>
    </PageContainer>
  );
}
