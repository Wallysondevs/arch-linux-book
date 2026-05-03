import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function VSCode() {
  return (
    <PageContainer
      title="Visual Studio Code"
      subtitle="O editor mais usado no mundo, no Arch: code (open-source) vs visual-studio-code-bin (proprietário). Instalação, extensões, settings.json e atalhos que valem a pena decorar."
      difficulty="iniciante"
      timeToRead="30 min"
      category="Dev & DevOps"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Arch Desktop. Pacote oficial Microsoft via AUR (<code>visual-studio-code-bin</code>); livre: <code>code</code> (open-source) ou <code>vscodium-bin</code>.
      </AlertBox>

      <h2>Glossário rápido</h2>
      <p>
        <strong>VS Code</strong> — editor da Microsoft, baseado em Electron. Versão "oss" tem licença MIT.
      </p>
      <p>
        <strong>VSCodium</strong> — rebuild sem telemetria Microsoft.
      </p>
      <p>
        <strong>Extensions</strong> — plugins. Marketplace integrado (Codium usa OpenVSX).
      </p>
      <p>
        <strong>Remote SSH</strong> — editar arquivos em servidor remoto como se fossem locais.
      </p>
      <p>
        <strong>settings.json</strong> — config em JSON — sincroniza com sua conta.
      </p>

      <p>
        O VS Code (ou simplesmente <em>Code</em>) virou o editor padrão de boa parte da indústria.
        No Arch existem <strong>duas variantes principais</strong> e elas confundem muita gente —
        nem todo "VS Code" é o mesmo binário, nem todas as extensões funcionam em ambos.
      </p>

      <AlertBox type="info" title="code (Code - OSS) vs visual-studio-code-bin">
        <strong>code</strong> (no repositório <code>extra</code>) é o <em>Code - OSS</em>: a build
        100% open-source feita pelo próprio projeto Arch a partir do repositório do MS. Marketplace
        oficial bloqueado, telemetria removida, alguns binários proprietários (debugger C# da MS,
        Pylance, Live Share) <strong>não funcionam</strong>. <br />
        <strong>visual-studio-code-bin</strong> (AUR) é o pacote <em>oficial da Microsoft</em>:
        marketplace completo, todas as extensões, telemetria embutida (desligável).
      </AlertBox>

      <h2>1. Instalação</h2>

      <h3>Opção A — code (open-source, repositório oficial)</h3>

      <TerminalBlock
        command="sudo pacman -S code"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) code-1.96.4-1

Total Installed Size:  389.42 MiB

:: Proceed with installation? [Y/n] y
(1/1) installing code                              [######################] 100%
:: Running post-transaction hooks...
(1/2) Arming ConditionNeedsUpdate...
(2/2) Updating icon theme caches...`}
      />

      <TerminalBlock
        command="code --version"
        output={`1.96.4
cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba
x64`}
      />

      <h3>Opção B — visual-studio-code-bin (AUR, oficial MS)</h3>

      <TerminalBlock
        command="yay -S visual-studio-code-bin"
        output={`:: Resolving dependencies...
:: Calculating conflicts...
:: Calculating inner conflicts...

Aur (1)                              Old Version  New Version  Make Only
aur/visual-studio-code-bin           -            1.96.4-1     No

:: Proceed with installation? [Y/n] y
:: Downloading PKGBUILDs...
 -> Downloading visual-studio-code-bin-1.96.4-1.tar.gz...
 -> Validating source files with sha512sums...
==> Making package: visual-studio-code-bin 1.96.4-1
...
checking keys in keyring                           [######################] 100%
(1/1) installing visual-studio-code-bin            [######################] 100%`}
      />

      <TerminalBlock
        command="code --version"
        output={`1.96.4
cd4ee3b1c348a13bafd8f9ad8060705f6d4b9cba
x64`}
      />

      <AlertBox type="warning" title="Não instale os dois ao mesmo tempo">
        Ambos os pacotes provêm o binário <code>code</code> e vão conflitar (e o ícone da
        área de trabalho será o último que instalou). Escolha um. Se quiser trocar, remova o
        anterior antes: <code>sudo pacman -Rns code</code>.
      </AlertBox>

      <h3>Outras variantes</h3>

      <CommandFlagList
        command="pacote (origem)"
        items={[
          { flag: "code", description: "Code - OSS, repo oficial extra. 100% MIT, marketplace OSS Open VSX." },
          { flag: "visual-studio-code-bin", description: "Build oficial da MS (AUR). Marketplace MS completo, telemetria opcional." },
          { flag: "vscodium-bin", description: "Fork do VS Code com telemetria removida, marketplace Open VSX. Alternativa popular." },
          { flag: "code-insiders-bin", description: "Canal Insiders (preview diário) da MS, pelo AUR. Convive com o stable." },
          { flag: "code-marketplace", description: "Patch (AUR) que aponta o code OSS para o marketplace MS — uso questionável legalmente." },
        ]}
      />

      <h2>2. Primeira execução — onde tudo fica</h2>

      <TerminalBlock command="code ." comment="abre o diretório atual no VS Code" />

      <OutputBlock
        title="caminhos importantes do VS Code no Arch"
        output={`~/.config/Code/User/settings.json    settings global do usuário
~/.config/Code/User/keybindings.json atalhos personalizados
~/.config/Code/User/snippets/        snippets customizados
~/.vscode/extensions/                 extensões instaladas
~/.vscode/argv.json                   flags do binário (telemetria off etc.)
.vscode/settings.json (no projeto)    settings por workspace
.vscode/launch.json                   configurações de debug
.vscode/tasks.json                    tarefas (build, run...)`}
        annotations={[
          { line: 0, note: "se for visual-studio-code-bin: ~/.config/Code/" },
          { line: 1, note: "para code-oss puro: ~/.config/Code - OSS/" },
        ]}
      />

      <h2>3. Linha de comando — code &lt;tudo&gt;</h2>

      <CommandFlagList
        command="code"
        items={[
          { flag: "<path>", description: "Abre arquivo ou diretório.", example: "code . " },
          { flag: "-r", long: "--reuse-window", description: "Abre na janela já aberta em vez de criar nova." },
          { flag: "-n", long: "--new-window", description: "Força nova janela." },
          { flag: "-g", long: "--goto FILE:LINE[:COL]", description: "Abre em linha específica.", example: "code -g src/main.ts:42:8" },
          { flag: "-d", long: "--diff F1 F2", description: "Abre na visão de diff dos dois arquivos." },
          { flag: "-w", long: "--wait", description: "Bloqueia o terminal até a janela fechar (ideal para git/hg como editor).", example: "GIT_EDITOR='code -w'" },
          { flag: "--list-extensions", description: "Lista todas as extensões instaladas." },
          { flag: "--install-extension ID", description: "Instala extensão pelo ID.", example: "code --install-extension dbaeumer.vscode-eslint" },
          { flag: "--uninstall-extension ID", description: "Remove extensão." },
          { flag: "--disable-extensions", description: "Inicia sem extensões (útil pra debugar lentidão)." },
          { flag: "--profile NAME", description: "Usa um perfil específico (perfis isolam extensões + settings).", example: "code --profile rust" },
          { flag: "--user-data-dir DIR", description: "Define onde fica a config (útil pra ambientes isolados/teste)." },
          { flag: "--verbose", description: "Logs detalhados no stdout/stderr." },
        ]}
      />

      <h3>Exemplos do dia-a-dia</h3>

      <TerminalBlock
        comment="git como editor de commit usando o VS Code"
        command={`git config --global core.editor "code -w"`}
      />

      <TerminalBlock
        comment="diff de dois arquivos"
        command="code -d src/old.ts src/new.ts"
      />

      <TerminalBlock
        comment="abrir em uma linha específica (clicável de tracebacks)"
        command="code -g src/main.ts:88:12"
      />

      <h2>4. Atalhos essenciais (decore esses)</h2>

      <OutputBlock
        title="atalhos universais (Linux / Wayland)"
        output={`────── Navegação ──────
Ctrl+P              quick open (arquivo por nome)
Ctrl+Shift+P        Command Palette (TUDO está aqui)
Ctrl+Shift+E        explorer (árvore de arquivos)
Ctrl+Shift+F        busca global
Ctrl+Shift+G        source control (git)
Ctrl+Shift+D        debug
Ctrl+Shift+X        extensões
Ctrl+\\              split editor
Ctrl+1/2/3          foca grupo de editor 1/2/3
Ctrl+Tab            ciclo entre arquivos abertos
Ctrl+B              toggle sidebar

────── Edição ──────
Ctrl+/              comentar linha
Shift+Alt+↓ / ↑     duplicar linha p/ baixo/cima
Alt+↓ / ↑           mover linha
Ctrl+D              próxima ocorrência da seleção (multicursor)
Ctrl+Shift+L        TODAS ocorrências (multicursor)
Alt+click           adicionar cursor
Ctrl+Alt+↓ / ↑      cursor extra na linha de baixo/cima
Ctrl+Shift+K        deletar linha
Ctrl+Enter          nova linha abaixo (sem mover cursor pra fim)
Ctrl+Shift+Enter    nova linha acima

────── Refactor & nav ──────
F2                  renomear símbolo (em todo workspace)
F12                 ir para definição
Alt+F12             peek definition (popup)
Shift+F12           ver TODOS os usos
Ctrl+T              buscar símbolo no workspace
Ctrl+Shift+O        símbolos no arquivo atual

────── Terminal ──────
Ctrl+\`              toggle terminal integrado
Ctrl+Shift+\`        novo terminal
Ctrl+Shift+5        split do terminal`}
      />

      <h2>5. settings.json — sua configuração persistente</h2>

      <p>
        Quase tudo no VS Code é configurável por JSON. Acesse com{" "}
        <kbd>Ctrl+Shift+P</kbd> → "Preferences: Open User Settings (JSON)".
      </p>

      <CodeBlock
        title="~/.config/Code/User/settings.json — base sólida"
        language="json"
        code={`{
  // Editor
  "editor.fontFamily": "'JetBrainsMono Nerd Font', 'Fira Code', monospace",
  "editor.fontSize": 14,
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": true,
  "editor.rulers": [80, 120],
  "editor.wordWrap": "off",
  "editor.minimap.enabled": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.suggestSelection": "first",
  "editor.cursorBlinking": "smooth",
  "editor.smoothScrolling": true,
  "editor.linkedEditing": true,

  // Workbench / UI
  "workbench.colorTheme": "Default Dark Modern",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",
  "workbench.tree.indent": 16,
  "workbench.editor.enablePreview": false,
  "workbench.activityBar.location": "default",

  // Files
  "files.autoSave": "onFocusChange",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/.DS_Store": true,
    "**/dist": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/objects/**": true,
    "**/dist/**": true
  },

  // Terminal
  "terminal.integrated.fontFamily": "'JetBrainsMono Nerd Font'",
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.defaultProfile.linux": "zsh",
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.scrollback": 5000,
  "terminal.integrated.gpuAcceleration": "on",

  // Git
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "git.fetchOnPull": true,

  // Telemetria (no Code - OSS já é off)
  "telemetry.telemetryLevel": "off",
  "update.mode": "manual",

  // Linguagens específicas
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.tabSize": 4
  },
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": { "comments": "off", "strings": "off", "other": "off" }
  }
}`}
      />

      <h2>6. Extensões via CLI</h2>

      <TerminalBlock
        command="code --install-extension dbaeumer.vscode-eslint"
        output={`Installing extensions...
Installing extension 'dbaeumer.vscode-eslint' v3.0.10...
Extension 'dbaeumer.vscode-eslint' v3.0.10 was successfully installed.`}
      />

      <TerminalBlock
        comment="bulk install de uma lista (sincroniza máquinas)"
        command={`xargs -L1 code --install-extension < extensions.txt`}
      />

      <TerminalBlock
        command="code --list-extensions"
        output={`asvetliakov.vscode-neovim
dbaeumer.vscode-eslint
eamodio.gitlens
esbenp.prettier-vscode
github.copilot
golang.go
ms-azuretools.vscode-docker
ms-python.python
PKief.material-icon-theme
rust-lang.rust-analyzer
streetsidesoftware.code-spell-checker
yzhang.markdown-all-in-one`}
      />

      <TerminalBlock
        comment="exporta a lista atual pra outro PC"
        command={`code --list-extensions > ~/dotfiles/vscode-extensions.txt`}
      />

      <CommandFlagList
        command="extensões essenciais (escolha a dedo)"
        items={[
          { flag: "esbenp.prettier-vscode", description: "Formatação automática de JS/TS/JSON/CSS." },
          { flag: "dbaeumer.vscode-eslint", description: "Lint para JS/TS." },
          { flag: "eamodio.gitlens", description: "Git supercharged: blame inline, history rich, etc." },
          { flag: "ms-python.python + ms-python.vscode-pylance", description: "Python full (Pylance só funciona no MS bin)." },
          { flag: "rust-lang.rust-analyzer", description: "LSP de Rust de altíssimo nível." },
          { flag: "golang.go", description: "Suporte completo a Go." },
          { flag: "ms-azuretools.vscode-docker", description: "Gerencia containers/imagens dentro do editor." },
          { flag: "streetsidesoftware.code-spell-checker", description: "Verificador ortográfico (pt-br via extensão extra)." },
          { flag: "PKief.material-icon-theme", description: "Ícones bonitos por tipo de arquivo." },
          { flag: "asvetliakov.vscode-neovim", description: "Embute o Neovim de verdade dentro do VS Code." },
        ]}
      />

      <h2>7. Terminal integrado</h2>

      <TerminalBlock
        comment="dentro do terminal embutido (Ctrl+\\`)"
        command="echo $TERM_PROGRAM"
        output="vscode"
      />

      <p>
        O terminal integrado herda seu shell padrão (definido em <code>chsh</code>). Para forçar
        outro shell por workspace, edite o <code>settings.json</code>:
      </p>

      <CodeBlock
        language="json"
        code={`"terminal.integrated.profiles.linux": {
  "zsh": { "path": "zsh" },
  "bash": { "path": "bash", "args": ["-l"] },
  "fish": { "path": "fish" }
},
"terminal.integrated.defaultProfile.linux": "zsh"`}
      />

      <h2>8. Tasks &amp; Launch — automação dentro do projeto</h2>

      <CodeBlock
        title=".vscode/tasks.json"
        language="json"
        code={`{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "pnpm run build",
      "group": { "kind": "build", "isDefault": true },
      "problemMatcher": ["$tsc"],
      "presentation": { "panel": "dedicated", "clear": true }
    },
    {
      "label": "test:watch",
      "type": "shell",
      "command": "pnpm test --watch",
      "isBackground": true,
      "presentation": { "panel": "dedicated" }
    }
  ]
}`}
      />

      <CodeBlock
        title=".vscode/launch.json — debug Node + Chrome"
        language="json"
        code={`{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Node: server",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "tsx",
      "args": ["\${workspaceFolder}/src/server.ts"],
      "envFile": "\${workspaceFolder}/.env",
      "console": "integratedTerminal"
    },
    {
      "name": "Chrome: vite dev",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "\${workspaceFolder}/src"
    }
  ]
}`}
      />

      <h2>9. Snippets — texto repetitivo automatizado</h2>

      <p>
        <kbd>Ctrl+Shift+P</kbd> → "Snippets: Configure Snippets" → escolha a linguagem.
      </p>

      <CodeBlock
        title="~/.config/Code/User/snippets/typescript.json"
        language="json"
        code={`{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "interface $1Props {",
      "  $2",
      "}",
      "",
      "export function $1({ $3 }: $1Props) {",
      "  return (",
      "    <div>$0</div>",
      "  )",
      "}"
    ],
    "description": "React functional component with TS"
  }
}`}
      />

      <h2>10. Dev Containers e Remote-SSH</h2>

      <p>
        Duas killer features (só funcionam no <code>visual-studio-code-bin</code>; o OSS não tem o
        Server proprietário):
      </p>

      <CommandFlagList
        command="ms-vscode-remote.* (extensões pack)"
        items={[
          { flag: "Remote - SSH", description: "Edita arquivos em uma máquina remota como se fossem locais. Instala um Code Server lá via SSH e conecta." },
          { flag: "Dev Containers", description: "Abre o projeto dentro de um container Docker definido em .devcontainer/devcontainer.json." },
          { flag: "WSL", description: "(Windows-only) Edita dentro do WSL." },
        ]}
      />

      <CodeBlock
        title=".devcontainer/devcontainer.json"
        language="json"
        code={`{
  "name": "Node 20 + pnpm",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",
  "features": {
    "ghcr.io/devcontainers-contrib/features/pnpm:2": {}
  },
  "postCreateCommand": "pnpm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "forwardPorts": [3000, 5173]
}`}
      />

      <h2>11. Settings Sync</h2>

      <p>
        O VS Code (binário oficial) tem sync nativo via conta GitHub/Microsoft.{" "}
        <kbd>Ctrl+Shift+P</kbd> → "Settings Sync: Turn On". Sincroniza settings, atalhos, snippets,
        extensões e UI state. No Code - OSS, use a extensão{" "}
        <code>shan.code-settings-sync</code> ou versione o <code>~/.config/Code/User/</code> em um
        repositório git de dotfiles.
      </p>

      <h2>12. Performance e troubleshooting</h2>

      <TerminalBlock
        comment="abre sem extensões — debug de lentidão"
        command="code --disable-extensions"
      />

      <TerminalBlock
        comment="medindo o tempo gasto por extensão"
        command="code --status"
        output={`Version:          Code 1.96.4
OS Version:       Linux x64 6.12.1-arch1-1
CPUs:             12 × 12th Gen Intel(R) Core(TM) i5-1240P
Memory (System):  15.50GB (6.42GB free)
Process Info:
CPU %  Mem MB    PID  Process
   2     142    3217  code main
   1      89    3218     extensionHost (ms-python.python)
   0      54    3219     extensionHost (rust-lang.rust-analyzer)
   3     124    3220     window (project.code-workspace)`}
      />

      <TerminalBlock
        comment="faltando extensões? cache corrompido? reset suave"
        command={`rm -rf ~/.config/Code/CachedExtensions ~/.config/Code/Cache`}
      />

      <AlertBox type="warning" title="VS Code travando no Wayland?">
        Se a janela ficar com renderização estranha em Wayland puro, force o Electron a rodar em
        modo nativo: edite <code>~/.config/Code/argv.json</code> e adicione
        <code> "enable-features": "WaylandWindowDecorations,UseOzonePlatform"</code> ou inicie com
        <code> code --enable-features=UseOzonePlatform --ozone-platform=wayland</code>.
      </AlertBox>

      <h2>13. Resumo</h2>

      <OutputBlock
        title="cola de bolso VS Code no Arch"
        output={`# instalar (escolha 1)
sudo pacman -S code                          # OSS
yay -S visual-studio-code-bin                # MS oficial

# uso básico
code .                          # abre cwd
code -g arquivo:linha           # ir direto pra linha
code -d a b                     # diff
code --install-extension ID
code --list-extensions

# arquivos importantes
~/.config/Code/User/settings.json
~/.config/Code/User/keybindings.json
.vscode/{settings,launch,tasks}.json (por projeto)

# atalhos top
Ctrl+P             quick open
Ctrl+Shift+P       command palette
Ctrl+\`             terminal
F12 / Shift+F12    definição / refs
Ctrl+D / Ctrl+L    multicursor
F2                 renomear símbolo`}
      />
    </PageContainer>
  );
}
