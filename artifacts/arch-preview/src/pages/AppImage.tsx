import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function AppImage() {
  return (
    <PageContainer
      title="AppImage — aplicativos portáteis"
      subtitle="Como executar, integrar ao menu e atualizar arquivos .AppImage no Arch — o formato 'Linux portable' sem instalação."
      difficulty="iniciante"
      timeToRead="20 min"
      category="Pacotes Universais"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Desktop. Não exige <code>sudo</code> — basta marcar como executável. Pode precisar de <code>fuse2</code> instalado.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>AppImage</strong> — formato portátil: app + dependências em um único arquivo executável (sem instalar).
      </p>
      <p>
        <strong>FUSE</strong> — sistema de arquivos em userspace que o AppImage usa para se montar em runtime.
      </p>
      <p>
        <strong>AppImageLauncher</strong> — utilitário (no AUR) que integra AppImages ao menu de aplicativos.
      </p>
      <p>
        <strong>Sandbox</strong> — AppImage <em>não</em> isola por padrão (diferente de Snap/Flatpak). É só empacotamento.
      </p>

      <p>
        <strong>AppImage</strong> é um formato que empacota aplicativo + dependências em um
        único arquivo executável. Não precisa de root, não precisa instalar — basta dar
        permissão de execução e rodar. Funciona em <em>qualquer</em> distro Linux moderna.
        Ideal para programas que você quer ter em uma versão específica sem mexer no
        gerenciador de pacotes.
      </p>

      <AlertBox type="info" title="Diferente de pacman/AUR/Flatpak">
        AppImage <strong>não instala</strong> — é um arquivo único que monta um filesystem
        squashfs em <code>/tmp/.mount_*</code> e executa. Para "desinstalar" basta apagar.
        Trade-off: cada AppImage carrega suas próprias libs (ocupa mais disco que pacman).
      </AlertBox>

      <h2>1. Anatomia de um AppImage</h2>

      <OutputBlock
        title="o que tem dentro"
        output={`MeuApp.AppImage
├── ELF header (executável Linux x86_64)
├── runtime (monta o squashfs)
└── squashfs comprimido
    ├── AppRun           (entrypoint)
    ├── meuapp.desktop   (metadados, ícone)
    ├── meuapp.png       (ícone)
    └── usr/
        ├── bin/meuapp
        ├── lib/         (libs próprias)
        └── share/`}
      />

      <h2>2. Pré-requisito no Arch — FUSE</h2>

      <p>
        AppImages v1 e v2 montam squashfs via FUSE. No Arch atual ainda usamos{" "}
        <code>fuse2</code> para retrocompatibilidade. Instale uma vez:
      </p>

      <TerminalBlock
        command="sudo pacman -S fuse2"
        output={`Packages (1) fuse2-2.9.9-5
Total Installed Size:  0.13 MiB
:: Proceed with installation? [Y/n] y`}
      />

      <TerminalBlock
        comment="(opcional) AppImages mais recentes podem usar fuse3"
        command="sudo pacman -S fuse3"
        output={`Packages (1) fuse3-3.16.2-3
Total Installed Size:  0.36 MiB`}
      />

      <h2>3. Baixando e executando o primeiro .AppImage</h2>

      <TerminalBlock
        comment="exemplo: OBS Studio AppImage da release oficial no GitHub"
        command="curl -LO https://github.com/SomeProject/SomeApp/releases/download/v3.2/SomeApp-x86_64.AppImage"
        output={`  % Total    % Received % Xferd  Average Speed   Time
100  142M  100  142M    0     0  18.4M      0  0:00:07  0:00:07 --:--:-- 19.2M`}
      />

      <TerminalBlock
        comment="dê permissão de execução"
        command="chmod +x SomeApp-x86_64.AppImage"
        output=""
      />

      <TerminalBlock
        comment="rode!"
        command="./SomeApp-x86_64.AppImage"
        output={`(abre a GUI do aplicativo)`}
      />

      <h2>4. Parâmetros internos (--appimage-*)</h2>

      <p>
        Todo AppImage aceita flags reservadas começando com <code>--appimage-</code>:
      </p>

      <CommandFlagList
        command="./SomeApp.AppImage"
        items={[
          { flag: "--appimage-help", description: "Lista todas as flags disponíveis." },
          { flag: "--appimage-version", description: "Versão do runtime AppImage." },
          { flag: "--appimage-extract", description: "Extrai o conteúdo em ./squashfs-root/ (útil para inspecionar/patchar).", example: "./app.AppImage --appimage-extract" },
          { flag: "--appimage-extract-and-run", description: "Útil quando FUSE não está disponível (containers, sandboxes)." },
          { flag: "--appimage-mount", description: "Monta sem executar; retorna o path. Bom para scripts." },
          { flag: "--appimage-offset", description: "Mostra offset onde começa o squashfs (debug)." },
          { flag: "--appimage-signature", description: "Imprime assinatura GPG embutida (se houver)." },
          { flag: "--appimage-updateinformation", description: "Imprime info de update embutida (zsync URL)." },
        ]}
      />

      <TerminalBlock
        command="./SomeApp-x86_64.AppImage --appimage-extract"
        output={`squashfs-root/.DirIcon
squashfs-root/AppRun
squashfs-root/SomeApp.desktop
squashfs-root/SomeApp.png
squashfs-root/usr/bin/SomeApp
squashfs-root/usr/lib/libQt5Core.so.5
... (centenas de arquivos)`}
      />

      <h2>5. Organizando seus AppImages</h2>

      <p>
        Recomendação: crie <code>~/Applications</code> (ou <code>~/.local/bin/AppImages</code>)
        e coloque todos lá:
      </p>

      <TerminalBlock
        command="mkdir -p ~/Applications && mv ~/Downloads/*.AppImage ~/Applications/ && ls ~/Applications"
        output={`Joplin-3.0.13.AppImage
KeePassXC-2.7.9-x86_64.AppImage
OBS-Studio-30.2.2-Linux-x86_64.AppImage
balenaEtcher-1.19.21-x64.AppImage`}
      />

      <h2>6. Integração com menu — appimaged (AUR) ou AppImageLauncher</h2>

      <p>
        Por padrão, um AppImage não aparece no menu do GNOME/KDE — é só um executável solto.
        Para integração automática (ícones no menu, mimetypes, atualizações), use uma destas:
      </p>

      <h3>Opção A — appimaged (daemon, recomendado)</h3>

      <TerminalBlock
        command="yay -S appimaged"
        output={`:: Synchronizing package databases...
:: Resolving dependencies...
:: Calculating conflicts...
==> Making package: appimaged 1.0.5-2 (Wed 20 Mar 2026)
==> Checking runtime dependencies...
==> Building dependencies...
==> Starting build()...
==> Tidying install...
==> Creating package "appimaged"...
==> Finished making: appimaged 1.0.5-2`}
      />

      <TerminalBlock
        command="systemctl --user enable --now appimaged.service"
        output={`Created symlink /home/user/.config/systemd/user/default.target.wants/appimaged.service → /usr/lib/systemd/user/appimaged.service.`}
      />

      <p>
        O daemon monitora <code>~/Applications</code>, <code>~/Downloads</code>, <code>/Applications</code>{" "}
        e <code>/opt</code>. Toda vez que um AppImage aparece, ele cria um <code>.desktop</code>{" "}
        em <code>~/.local/share/applications/</code> e extrai o ícone — o app aparece no menu
        em segundos.
      </p>

      <h3>Opção B — AppImageLauncher (GUI)</h3>

      <TerminalBlock
        command="yay -S appimagelauncher"
        output={`==> Building dependencies...
==> Starting build()...
==> Finished making: appimagelauncher 2.2.0-2`}
      />

      <p>
        Após instalado, dar duplo-clique em qualquer .AppImage abre uma janela perguntando
        "Integrate and run?" — se você aceitar, ele move o arquivo para uma pasta padrão e
        cria entrada de menu.
      </p>

      <h2>7. Atualizando AppImages</h2>

      <p>
        Muitos AppImages embutem informação de update (zsync). A ferramenta{" "}
        <code>AppImageUpdate</code> baixa apenas as partes que mudaram (delta).
      </p>

      <TerminalBlock
        command="yay -S appimageupdate"
        output={`==> Finished making: appimageupdate 2.0.0-1`}
      />

      <TerminalBlock
        command="AppImageUpdate ~/Applications/Joplin-3.0.13.AppImage"
        output={`Update available! New version: 3.0.14
Downloading delta: 4.2 MB / 184 MB (97% saved)
[#####################################] 100%
Verifying signature... OK
Renaming Joplin-3.0.13.AppImage → Joplin-3.0.14.AppImage`}
      />

      <h2>8. Criando um .desktop manualmente</h2>

      <p>
        Se preferir não usar appimaged, crie o <code>.desktop</code> à mão. Exemplo para o
        Joplin:
      </p>

      <CodeBlock
        title="~/.local/share/applications/joplin.desktop"
        code={`[Desktop Entry]
Type=Application
Name=Joplin
Comment=Note taking
Exec=/home/user/Applications/Joplin-3.0.14.AppImage %U
Icon=/home/user/.local/share/icons/joplin.png
Categories=Office;TextEditor;
Terminal=false
StartupNotify=true
MimeType=text/x-markdown;`}
      />

      <TerminalBlock
        comment="extrai o ícone do AppImage"
        command={`./Joplin-3.0.14.AppImage --appimage-extract '*.png' && \\
cp squashfs-root/joplin.png ~/.local/share/icons/`}
        output=""
      />

      <TerminalBlock
        comment="atualiza o cache para o app aparecer no menu"
        command="update-desktop-database ~/.local/share/applications/"
        output=""
      />

      <h2>9. Verificando assinaturas</h2>

      <TerminalBlock
        comment="muitos AppImages incluem assinatura GPG"
        command="./KeePassXC-2.7.9-x86_64.AppImage --appimage-signature"
        output={`-----BEGIN PGP SIGNATURE-----
iQIzBAABCgAdFiEEpqpLDJX...
=A8b3
-----END PGP SIGNATURE-----`}
      />

      <h2>10. Quando NÃO usar AppImage</h2>

      <AlertBox type="warning" title="Trade-offs">
        <strong>Bom para:</strong> aplicativos sem pacote oficial, versões específicas/legacy,
        testar betas sem mexer no sistema, USB stick portátil.
        <br />
        <strong>Ruim para:</strong> aplicativos do core do sistema, ferramentas que precisam
        de integração profunda (ex: shells, drivers), atualizações automáticas em massa
        (use pacman/AUR).
      </AlertBox>

      <h2>11. Desinstalando</h2>

      <TerminalBlock
        comment="é só apagar"
        command={`rm ~/Applications/SomeApp-x86_64.AppImage \\
   ~/.local/share/applications/SomeApp.desktop \\
   ~/.local/share/icons/SomeApp.png`}
        output=""
      />

      <TerminalBlock
        comment="se usou appimaged, ele detecta e remove o .desktop sozinho"
        command="rm ~/Applications/SomeApp-x86_64.AppImage"
        output=""
      />

      <h2>12. Cola visual</h2>

      <OutputBlock
        title="fluxo padrão com AppImage"
        output={`# baixar
curl -LO https://...releases/.../app.AppImage

# permissão
chmod +x app.AppImage

# rodar
./app.AppImage

# extrair (debug)
./app.AppImage --appimage-extract

# integrar no menu (uma vez)
yay -S appimaged
systemctl --user enable --now appimaged

# atualizar (delta)
AppImageUpdate ~/Applications/app.AppImage

# remover
rm ~/Applications/app.AppImage`}
      />
    </PageContainer>
  );
}
