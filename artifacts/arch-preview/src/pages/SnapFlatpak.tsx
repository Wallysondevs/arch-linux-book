import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function SnapFlatpak() {
  return (
    <PageContainer
      title="Snap & Flatpak no Arch"
      subtitle="Pacotes universais sandboxed: instalando snapd via AUR, configurando Flatpak (oficial), Flathub e Flatseal."
      difficulty="iniciante"
      timeToRead="25 min"
      category="Pacotes Universais"
    >
      <p>
        Além de <code>pacman</code> e do AUR, o Arch suporta dois formatos universais que
        rodam o mesmo binário em qualquer distro Linux: <strong>Flatpak</strong> (apoiado
        pelo freedesktop.org, KDE, GNOME, Red Hat) e <strong>Snap</strong> (formato da
        Canonical/Ubuntu). Ambos sandbox a aplicação, embutem dependências e atualizam
        independentemente do sistema base.
      </p>

      <AlertBox type="info" title="No Arch, prefira Flatpak">
        Flatpak é integrado/oficial e está em <code>extra</code>. Snap precisa do AUR
        (snapd) e historicamente tem mais atrito (auto-mount em loops, AppArmor opcional).
        Para a maioria dos casos, Flatpak + Flathub cobre tudo o que Snap oferece.
      </AlertBox>

      <h2>1. Flatpak — instalação</h2>

      <TerminalBlock
        command="sudo pacman -S flatpak"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (12) appstream-1.0.4-1  bubblewrap-0.10.0-1  fuse2-2.9.9-5
              ostree-2024.8-1  xdg-dbus-proxy-0.1.6-1  flatpak-1.14.10-1 ...

Total Installed Size:  62.4 MiB

:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        command="flatpak --version"
        output={`Flatpak 1.14.10`}
      />

      <h3>Adicionar o Flathub (repositório principal)</h3>

      <TerminalBlock
        comment="--user instala só pro seu usuário; sem --user vai para o sistema (precisa sudo)"
        command="flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo"
        output=""
      />

      <TerminalBlock
        command="flatpak remotes"
        output={`Name    Options
flathub user`}
      />

      <h2>2. Buscando e instalando aplicativos</h2>

      <TerminalBlock
        command="flatpak search firefox"
        output={`Name      Description                    Application ID                    Version       Branch  Remotes
Firefox   Fast, Private & Safe Web ...   org.mozilla.firefox              132.0.2       stable  flathub
Firefox…  Firefox Developer Edition      org.mozilla.firefox.DeveloperE…  133.0b9       beta    flathub`}
      />

      <TerminalBlock
        command="flatpak install --user flathub org.mozilla.firefox"
        output={`Looking for matches…
Required runtime for org.mozilla.firefox/x86_64/stable (runtime/org.freedesktop.Platform/x86_64/24.08) found in remote flathub
Do you want to install it? [Y/n]: y

org.mozilla.firefox permissions:
    ipc, network, pulseaudio, wayland, x11, devices=all, file access [1], dbus access [2]

        ID                                            Branch         Op
 1.     org.freedesktop.Platform.GL.default           24.08          i
 2.     org.freedesktop.Platform.openh264             2.4.1          i
 3.     org.freedesktop.Platform                      24.08          i
 4.     org.mozilla.firefox.Locale                    stable         i
 5.     org.mozilla.firefox                           stable         i

Proceed with these changes to the user installation? [Y/n]: y

Installing 5/5... org.mozilla.firefox stable from flathub      [#####################] 100%

Installation complete.`}
      />

      <TerminalBlock
        command="flatpak run org.mozilla.firefox"
        output="(abre o Firefox)"
      />

      <h3>Outros exemplos populares</h3>

      <TerminalBlock
        command={`flatpak install --user flathub \\
  com.spotify.Client \\
  org.videolan.VLC \\
  com.discordapp.Discord \\
  org.libreoffice.LibreOffice \\
  com.obsproject.Studio`}
        output={`(...resumo de runtimes e permissões para cada app...)
Installing 8/8... com.spotify.Client          [#####################] 100%
Installation complete.`}
      />

      <h2>3. Comandos do Flatpak</h2>

      <CommandFlagList
        command="flatpak"
        items={[
          { flag: "search NOME", description: "Procura nos remotos configurados." },
          { flag: "install REMOTO APP", description: "Instala. --user para usuário, sem --user para sistema.", example: "flatpak install flathub org.gimp.GIMP" },
          { flag: "list", description: "Lista instalados. --app esconde runtimes." },
          { flag: "run APP", description: "Executa. Aceita args extra após o nome." },
          { flag: "update", description: "Atualiza tudo. APP_ID restringe a um app." },
          { flag: "uninstall APP", description: "Remove. --unused remove runtimes órfãos." },
          { flag: "info APP", description: "Versão, runtime, tamanho, permissões." },
          { flag: "remote-list", description: "Mostra remotos configurados." },
          { flag: "override", description: "Ajusta permissões de um app.", example: "flatpak override --user --filesystem=home org.gimp.GIMP" },
          { flag: "permissions", description: "Mostra permissões atuais (XDG portals)." },
          { flag: "kill APP", description: "Mata processos de um app." },
        ]}
      />

      <TerminalBlock
        command="flatpak list --app"
        output={`Name                Application ID                Version    Branch    Installation
Firefox             org.mozilla.firefox           132.0.2    stable    user
Spotify             com.spotify.Client            1.2.45     stable    user
Discord             com.discordapp.Discord        0.0.69     stable    user
VLC media player    org.videolan.VLC              3.0.21     stable    user
LibreOffice         org.libreoffice.LibreOffice   24.8.2.1   stable    user
OBS Studio          com.obsproject.Studio         30.2.2     stable    user`}
      />

      <TerminalBlock
        command="flatpak update"
        output={`Looking for updates…

        ID                                Branch  Op  Remote   Download
 1.     org.freedesktop.Platform.GL.def…  24.08   u   flathub  < 162.4 MB (partial)
 2.     org.mozilla.firefox               stable  u   flathub  < 84.2 MB (partial)

Proceed with these changes to the user installation? [Y/n]: y

Updating 2/2... org.mozilla.firefox stable from flathub        [#####################] 100%

Updates complete.`}
      />

      <TerminalBlock
        command="flatpak uninstall --user --unused"
        output={`        ID                                                   Branch    Op
 1.     org.freedesktop.Platform.openh264                    2.4.1     r

Uninstall complete.
Cleared 28.4 MB of disk space.`}
      />

      <h2>4. Permissões — Flatseal</h2>

      <p>
        Flatpaks rodam em sandbox (bubblewrap). Quando um app pede acesso a webcam, mic ou
        diretórios, o sistema mostra um portal XDG. Para ajustar permissões em massa, use{" "}
        <strong>Flatseal</strong>:
      </p>

      <TerminalBlock
        command="flatpak install --user flathub com.github.tchx84.Flatseal"
        output={`(instala...)
Installation complete.`}
      />

      <TerminalBlock
        command="flatpak run com.github.tchx84.Flatseal"
        output={`(abre GUI do Flatseal — lista cada app e permite editar permissões)`}
      />

      <h3>Override por linha de comando</h3>

      <TerminalBlock
        comment="dar acesso ao ~/Documentos para o LibreOffice"
        command="flatpak override --user --filesystem=~/Documentos org.libreoffice.LibreOffice"
        output=""
      />

      <TerminalBlock
        comment="bloquear acesso à rede do GIMP (paranóia)"
        command="flatpak override --user --unshare=network org.gimp.GIMP"
        output=""
      />

      <TerminalBlock
        comment="ver permissões efetivas"
        command="flatpak info --show-permissions org.libreoffice.LibreOffice"
        output={`[Context]
shared=ipc;
sockets=x11;wayland;pulseaudio;
devices=dri;
filesystems=xdg-download;xdg-documents;xdg-pictures;~/Documentos;`}
      />

      <h2>5. Snap — instalação no Arch</h2>

      <p>
        Snap não está nos repositórios oficiais; é instalado via AUR (<code>snapd</code>).
        Use <code>yay</code> ou <code>paru</code>:
      </p>

      <TerminalBlock
        command="yay -S snapd"
        output={`:: Synchronizing package databases...
:: Resolving dependencies...
==> Making package: snapd 2.65.3-1 (...)
==> Checking runtime dependencies...
==> Building...
==> Finished making: snapd 2.65.3-1
:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        command="sudo systemctl enable --now snapd.socket"
        output={`Created symlink /etc/systemd/system/sockets.target.wants/snapd.socket → /usr/lib/systemd/system/snapd.socket.`}
      />

      <TerminalBlock
        comment="link clássico p/ snaps que precisam de acesso 'classic' (ex: VS Code)"
        command="sudo ln -s /var/lib/snapd/snap /snap"
        output=""
      />

      <TerminalBlock
        comment="reinicie ou faça logout para o $PATH ser atualizado"
        command="snap version"
        output={`snap    2.65.3
snapd   2.65.3
series  16
arch    amd64
kernel  6.12.1-arch1-1`}
      />

      <h2>6. Comandos do Snap</h2>

      <CommandFlagList
        command="snap"
        items={[
          { flag: "find NOME", description: "Busca na Snap Store." },
          { flag: "install NOME", description: "Instala. --classic para apps que precisam de acesso total.", example: "sudo snap install code --classic" },
          { flag: "list", description: "Snaps instalados." },
          { flag: "info NOME", description: "Detalhes (canais, versões, descrição)." },
          { flag: "refresh", description: "Atualiza tudo. NOME atualiza só um." },
          { flag: "remove NOME", description: "Desinstala.", example: "sudo snap remove --purge spotify" },
          { flag: "switch --channel=X NOME", description: "Muda canal (stable/candidate/beta/edge)." },
          { flag: "revert NOME", description: "Volta para a versão anterior." },
          { flag: "changes", description: "Histórico de operações." },
        ]}
      />

      <TerminalBlock
        command="sudo snap install spotify"
        output={`spotify 1.2.45.454 from Spotify✓ installed`}
      />

      <TerminalBlock
        command="snap list"
        output={`Name      Version          Rev    Tracking         Publisher    Notes
core22    20240612         1564   latest/stable    canonical✓   base
gnome-42  0+git.510626c    202    latest/stable    canonical✓   -
spotify   1.2.45.454       77     latest/stable    spotify✓     -`}
      />

      <h2>7. Snap vs Flatpak vs Pacman/AUR — quando usar cada um?</h2>

      <OutputBlock
        title="Tabela de decisão"
        output={`┌──────────────────────────┬──────────┬──────────┬──────────────┐
│ Caso                     │ pacman   │ Flatpak  │ Snap         │
├──────────────────────────┼──────────┼──────────┼──────────────┤
│ ferramentas CLI          │ ✓✓✓      │ não      │ não          │
│ libs e drivers do sistema│ ✓✓✓      │ não      │ não          │
│ apps gráficos comuns     │ ✓✓ (AUR) │ ✓✓✓      │ ✓            │
│ apps proprietários       │ AUR      │ Flathub  │ Snap Store   │
│ versões antigas/cong.    │ não      │ branches │ channels     │
│ sandbox por padrão       │ não      │ ✓✓✓      │ ✓✓✓ (AppArmor│
│                          │          │          │ no Arch é off│
│                          │          │          │ por padrão)  │
│ atualizações auto        │ não      │ opcional │ ✓ (forçado)  │
│ tamanho em disco         │ menor    │ médio    │ maior        │
└──────────────────────────┴──────────┴──────────┴──────────────┘`}
      />

      <AlertBox type="warning" title="Atualizações automáticas do snap">
        Por padrão o <code>snapd</code> atualiza snaps automaticamente em background. Para
        adiar:{" "}
        <code>sudo snap set system refresh.hold=$(date --iso-8601=seconds -d '+30 days')</code>.
        Flatpak nunca atualiza sozinho — você roda <code>flatpak update</code> quando quer.
      </AlertBox>

      <h2>8. Onde os arquivos ficam</h2>

      <OutputBlock
        title="paths importantes"
        output={`Flatpak (system):    /var/lib/flatpak/
Flatpak (user):      ~/.local/share/flatpak/
Dados de apps:       ~/.var/app/<APP_ID>/
                      ├── config/
                      ├── data/
                      └── cache/

Snap:                /var/lib/snapd/snaps/   (squashfs)
                     /snap/<nome>/current/   (mount point)
Dados de apps:       ~/snap/<nome>/`}
      />

      <h2>9. Cola visual</h2>

      <OutputBlock
        title="comandos do dia-a-dia"
        output={`# Flatpak
flatpak search NOME
flatpak install --user flathub APP.ID
flatpak run APP.ID
flatpak update
flatpak uninstall APP.ID
flatpak uninstall --unused
flatpak override --user --filesystem=home APP.ID

# Snap
snap find NOME
sudo snap install NOME --classic
snap list
sudo snap refresh
sudo snap remove --purge NOME

# diagnóstico
flatpak info APP.ID
flatpak list --app
journalctl --user -u xdg-desktop-portal -f
sudo journalctl -u snapd`}
      />
    </PageContainer>
  );
}
