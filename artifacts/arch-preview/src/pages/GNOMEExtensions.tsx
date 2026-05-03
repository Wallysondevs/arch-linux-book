import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function GNOMEExtensions() {
  return (
    <PageContainer
      title="Extensões do GNOME Shell"
      subtitle="Instalar pelo CLI ou via browser, gerenciar com gnome-extensions, configurar com gnome-tweaks e Extension Manager. As mais úteis."
      difficulty="iniciante"
      timeToRead="25 min"
      category="Desktop"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch com GNOME instalado (<code>sudo pacman -S gnome</code>). Pacote auxiliar: <code>gnome-shell-extensions</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>Extension</strong> — plugin JavaScript que estende o GNOME Shell.
      </p>
      <p>
        <strong>extensions.gnome.org</strong> — site oficial — instala via toggle no navegador (precisa <code>gnome-browser-connector</code>).
      </p>
      <p>
        <strong>Extension Manager</strong> — app gráfico recomendado: <code>extension-manager</code> (no AUR/extras).
      </p>
      <p>
        <strong>Compatibilidade</strong> — extensões podem quebrar a cada release do GNOME — sempre cheque a versão.
      </p>

      <p>
        O GNOME Shell é deliberadamente minimalista. <strong>Extensões</strong> são pequenos JS+CSS que
        injetam funcionalidades: tray icons, dock estilo macOS, monitor de sistema, controles de mídia,
        atalhos de janela. No Arch, o ecossistema é totalmente CLI-friendly.
      </p>

      <AlertBox type="info" title="Extensões podem QUEBRAR após upgrade do GNOME">
        Toda nova versão major (45 → 46 → 47 → 48...) muda APIs. Uma extensão que funcionava no
        GNOME 47 pode não carregar no 48 até o autor atualizar. Sempre confira a coluna "GNOME version"
        no <code>extensions.gnome.org</code>.
      </AlertBox>

      <h2>1. Pré-requisitos</h2>

      <TerminalBlock
        command="sudo pacman -S gnome-shell-extensions gnome-tweaks gnome-browser-connector"
        output={`Packages (4) gnome-shell-extensions-47-2  gnome-tweaks-47.1-1  gnome-browser-connector-43-1  python-requests-2.32.3-1

Total Installed Size:  6.21 MiB`}
      />

      <p>
        <code>gnome-shell-extensions</code> traz um pacote curado de extensões oficiais
        (<em>auto-move-windows</em>, <em>workspace-indicator</em>, <em>user-themes</em>...).
      </p>

      <h2>2. Verificar a versão do GNOME Shell</h2>

      <TerminalBlock
        command="gnome-shell --version"
        output={`GNOME Shell 47.2`}
      />

      <h2>3. CLI: gnome-extensions</h2>

      <CommandFlagList
        command="gnome-extensions"
        items={[
          { flag: "list", description: "Lista todas as extensões instaladas (UUIDs).", example: "gnome-extensions list" },
          { flag: "list --enabled", description: "Apenas as ativas." },
          { flag: "list --disabled", description: "Apenas as desativadas." },
          { flag: "info UUID", description: "Detalhes (versão, autor, descrição).", example: "gnome-extensions info user-theme@gnome-shell-extensions.gcampax.github.com" },
          { flag: "show UUID", description: "Igual ao info (mais legível)." },
          { flag: "enable UUID", description: "Liga a extensão.", example: "gnome-extensions enable user-theme@..." },
          { flag: "disable UUID", description: "Desliga." },
          { flag: "reset UUID", description: "Reseta configurações da extensão." },
          { flag: "uninstall UUID", description: "Remove (apenas extensões instaladas pelo usuário)." },
          { flag: "install ZIP", description: "Instala manualmente de um zip baixado." },
          { flag: "prefs UUID", description: "Abre o painel de preferências." },
          { flag: "create", description: "Esqueleto de uma nova extensão (devs)." },
        ]}
      />

      <TerminalBlock
        command="gnome-extensions list"
        output={`workspace-indicator@gnome-shell-extensions.gcampax.github.com
user-theme@gnome-shell-extensions.gcampax.github.com
appindicatorsupport@rgcjonas.gmail.com
dash-to-dock@micxgx.gmail.com
clipboard-indicator@tudmotu.com
blur-my-shell@aunetx
caffeine@patapon.info
gsconnect@andyholmes.github.io
just-perfection-desktop@just-perfection
forge@jmmaranan.com
tiling-assistant@leleat-on-github
weatheroclock@CleoMenezesJr.github.io`}
      />

      <TerminalBlock
        command="gnome-extensions info dash-to-dock@micxgx.gmail.com"
        output={`UUID: dash-to-dock@micxgx.gmail.com
Name: Dash to Dock
Description: A dock for the GNOME Shell. This extension moves the dash out of the overview transforming it in a dock for an easier launching of applications and a faster switching between windows and desktops.
Path: /home/user/.local/share/gnome-shell/extensions/dash-to-dock@micxgx.gmail.com
URL: https://micheleg.github.io/dash-to-dock/
Original author: micxgx@gmail.com
Version: 96
Session Mode: user
State: ACTIVE
Enabled: Yes`}
      />

      <TerminalBlock command="gnome-extensions enable caffeine@patapon.info" />

      <TerminalBlock command="gnome-extensions disable caffeine@patapon.info" />

      <h2>4. Instalar via browser (extensions.gnome.org)</h2>

      <p>
        Após instalar <code>gnome-browser-connector</code>, vá ao site
        <a href="https://extensions.gnome.org"> extensions.gnome.org</a>. A primeira visita pede para
        instalar o <em>browser extension</em>:
      </p>

      <OutputBlock
        title="Firefox"
        output={`addons.mozilla.org → procure "GNOME Shell integration"
                  → Add to Firefox → permitir nativeMessaging`}
      />

      <OutputBlock
        title="Chromium / Brave / Vivaldi"
        output={`chromewebstore.google.com → "GNOME Shell integration" → Adicionar`}
      />

      <p>
        Depois disso, em qualquer página de extensão aparece um <strong>toggle ON/OFF</strong> que
        instala em 1 clique no <code>~/.local/share/gnome-shell/extensions/</code>.
      </p>

      <h2>5. Extension Manager (alternativa GUI moderna)</h2>

      <TerminalBlock
        command="sudo pacman -S extension-manager"
        output={`Packages (1) extension-manager-0.6.2-1`}
      />

      <p>
        Aplicativo Flatpak/oficial que <strong>busca, instala, atualiza e configura</strong> extensões
        sem precisar de browser. UI muito melhor que <code>gnome-tweaks</code>.
      </p>

      <h2>6. Instalar manualmente de um ZIP</h2>

      <TerminalBlock
        comment="baixe da página da extensão (botão 'Download' embaixo das versões)"
        command="cd ~/Downloads && ls *.shell-extension.zip"
        output="dash-to-dock@micxgx.gmail.com.v96.shell-extension.zip"
      />

      <TerminalBlock
        command="gnome-extensions install dash-to-dock@micxgx.gmail.com.v96.shell-extension.zip --force"
        output={`Extension dash-to-dock@micxgx.gmail.com installed.`}
      />

      <TerminalBlock
        comment="GNOME precisa de reload para aparecer (Wayland: relogar; X11: Alt+F2 r Enter)"
        command="gnome-extensions enable dash-to-dock@micxgx.gmail.com"
      />

      <h2>7. Onde ficam os arquivos</h2>

      <OutputBlock
        title="dois locais"
        output={`/usr/share/gnome-shell/extensions/      sistema (do pacote gnome-shell-extensions)
~/.local/share/gnome-shell/extensions/  usuário (instalações via browser/zip)

cada extensão é uma pasta com:
  metadata.json   nome, UUID, versão, GNOME suportado
  extension.js    código que injeta no shell
  prefs.js        UI de preferências (opcional)
  stylesheet.css  CSS extra (opcional)
  schemas/        gsettings schemas`}
      />

      <h2>8. Ler/alterar configs via gsettings</h2>

      <TerminalBlock
        comment="lista de extensões habilitadas no shell"
        command="gsettings get org.gnome.shell enabled-extensions"
        output={`['user-theme@gnome-shell-extensions.gcampax.github.com', 'appindicatorsupport@rgcjonas.gmail.com', 'dash-to-dock@micxgx.gmail.com', 'caffeine@patapon.info']`}
      />

      <TerminalBlock
        comment="adicionar via CLI sem GUI"
        command={`gsettings set org.gnome.shell enabled-extensions "['user-theme@gnome-shell-extensions.gcampax.github.com','dash-to-dock@micxgx.gmail.com','caffeine@patapon.info']"`}
      />

      <TerminalBlock
        comment="config específica do dash-to-dock"
        command="gsettings list-keys org.gnome.shell.extensions.dash-to-dock | head -10"
        output={`apply-custom-theme
autohide
background-color
background-opacity
custom-background-color
dock-fixed
dock-position
extend-height
height-fraction
icon-size-fixed`}
      />

      <TerminalBlock
        command="gsettings set org.gnome.shell.extensions.dash-to-dock dock-position 'BOTTOM'"
      />

      <TerminalBlock
        command="gsettings set org.gnome.shell.extensions.dash-to-dock dash-max-icon-size 48"
      />

      <h2>9. As extensões mais úteis (opinião popular 2026)</h2>

      <OutputBlock
        title="top 12 da comunidade"
        output={`AppIndicator and KStatusNotifierItem Support     tray icons (Telegram, Discord, etc)
Dash to Dock                                     dock fixo estilo macOS
Blur my Shell                                    blur transparente nos panels
Caffeine                                         inibe suspend/auto-lock
Clipboard Indicator                              histórico de clipboard
Just Perfection                                  liga/desliga TUDO do shell granularmente
Forge                                            tiling automático i3-like
Tiling Assistant                                 snap de janelas estilo Win11
GSConnect                                        KDE Connect para Android
User Themes                                      permite carregar Shell themes
Vitals                                           CPU/RAM/temp na top bar
Sound Output Device Chooser                      trocar saída de áudio rápido`}
      />

      <h2>10. Atualizando extensões</h2>

      <TerminalBlock
        comment="GNOME notifica automaticamente, mas você pode forçar"
        command="gnome-extensions list | xargs -L1 gnome-extensions info | grep -E 'UUID|State'"
        output={`UUID: dash-to-dock@micxgx.gmail.com
State: ACTIVE
UUID: caffeine@patapon.info
State: OUT_OF_DATE`}
      />

      <p>
        Extensões com <code>OUT_OF_DATE</code> não funcionam até o autor publicar versão compatível
        com seu GNOME. Use o <strong>Extension Manager</strong> para "Update available".
      </p>

      <h2>11. gnome-tweaks — ainda útil para o resto</h2>

      <TerminalBlock command="gnome-tweaks &" />

      <p>
        <code>gnome-tweaks</code> foi reduzido (configs de extensão saíram para o app oficial), mas
        ainda gerencia: temas GTK, fontes, comportamento do touchpad, posição dos botões da janela
        (close à esquerda?), startup applications, hot corners, etc.
      </p>

      <h2>12. Recarregar o GNOME Shell</h2>

      <OutputBlock
        title="dois jeitos"
        output={`X11 (sessão clássica)        Alt+F2  →  digite  r  →  Enter (recarrega in-place)
Wayland                       precisa relogar (logout/login)
                              ou  killall -3 gnome-shell  (faz hard restart, pode crashar)`}
      />

      <AlertBox type="warning" title="Use Wayland? Faça logout">
        Wayland não permite restart in-place do shell por design (motivos de segurança). Logout +
        login leva 5 segundos e é o caminho seguro.
      </AlertBox>

      <h2>13. Debugar uma extensão quebrada</h2>

      <TerminalBlock
        command="journalctl --user -f -t gnome-shell"
        output={`Mar 26 16:08:14 archlinux gnome-shell[2143]: JS ERROR: Extension caffeine@patapon.info: TypeError: ExtensionUtils.getCurrentExtension is not a function
                                                  enable@/home/user/.local/share/gnome-shell/extensions/caffeine@patapon.info/extension.js:42`}
      />

      <p>
        Esse padrão (<code>is not a function</code>) é o jeito clássico de descobrir que a extensão
        usa API antiga e não foi atualizada. Soluções:
      </p>

      <OutputBlock
        output={`1. Verificar versão do autor em extensions.gnome.org
2. Procurar fork no GitHub
3. Desabilitar e esperar atualização
4. Editar manualmente (devs experientes)`}
      />

      <h2>14. Fazendo backup do conjunto de extensões</h2>

      <TerminalBlock
        comment="exportar lista habilitada + suas configs"
        command="dconf dump /org/gnome/shell/extensions/ > extensoes-backup.dconf"
      />

      <TerminalBlock
        comment="restaurar em outra máquina"
        command="dconf load /org/gnome/shell/extensions/ < extensoes-backup.dconf"
      />

      <h2>15. Resumo prático</h2>

      <OutputBlock
        title="comandos essenciais"
        output={`sudo pacman -S gnome-shell-extensions gnome-tweaks extension-manager gnome-browser-connector

gnome-extensions list                       todas
gnome-extensions list --enabled             só ativas
gnome-extensions enable UUID                ligar
gnome-extensions disable UUID               desligar
gnome-extensions install pacote.zip         instalar zip
gnome-extensions prefs UUID                 abrir prefs
gnome-extensions info UUID                  detalhes

gnome-shell --version                       versão atual
journalctl --user -f -t gnome-shell         logs em tempo real
dconf dump /org/gnome/shell/extensions/     backup`}
      />

      <AlertBox type="success" title="Combo ideal de produtividade">
        Dash to Dock (BOTTOM, autohide off) + Blur my Shell + AppIndicator + Caffeine + Clipboard
        Indicator + Just Perfection (esconder activities/calendar/etc) = um GNOME que parece feito
        sob medida.
      </AlertBox>
    </PageContainer>
  );
}
