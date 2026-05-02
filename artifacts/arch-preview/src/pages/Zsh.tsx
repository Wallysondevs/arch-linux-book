import { PageContainer } from "@/components/layout/PageContainer";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Zsh() {
  return (
    <PageContainer
      title="Zsh + Oh My Zsh + Powerlevel10k"
      subtitle="Trocando o bash pelo zsh no Arch: instalação, plugins essenciais (autosuggestions, syntax-highlighting), tema p10k e como deixar o prompt verdadeiramente útil."
      difficulty="intermediario"
      timeToRead="35 min"
      category="Shell"
    >
      <p>
        O <strong>Z shell</strong> (<code>zsh</code>) é um superset do bash: aceita 99% da
        sintaxe bash mas adiciona globbing avançado, parameter expansion mais rica,
        completions inteligentes e — o que mais converte usuários — um ecossistema de
        plugins e temas chamado <em>Oh My Zsh</em> (e o framework alternativo{" "}
        <em>Zinit</em>) com prompts como <em>Powerlevel10k</em> e <em>Starship</em>.
      </p>

      <AlertBox type="info" title="Vai dar trabalho?">
        Não. No Arch são 4 comandos: <code>pacman -S zsh</code>, <code>chsh -s</code>,
        instalar o oh-my-zsh, adicionar 2 plugins. Em &lt;10 min você tem um shell com
        sugestão histórica em cinza, syntax-highlight em tempo real e prompt contextual.
      </AlertBox>

      <h2>1. Instalação no Arch</h2>

      <TerminalBlock
        command="sudo pacman -S zsh zsh-completions"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (2) zsh-5.9-7  zsh-completions-0.35.0-1

Total Installed Size:  9.42 MiB

:: Proceed with installation? [Y/n] y
(2/2) installing zsh-completions                   [##########] 100%
:: Running post-transaction hooks...
(1/1) Arming ConditionNeedsUpdate...`}
      />

      <TerminalBlock
        comment="confirma versão"
        command="zsh --version"
        output={`zsh 5.9 (x86_64-pc-linux-gnu)`}
      />

      <h2>2. Tornando o zsh seu shell padrão</h2>

      <TerminalBlock
        comment="ver shells disponíveis"
        command="cat /etc/shells"
        output={`# Pathnames of valid login shells.
/bin/sh
/bin/bash
/usr/bin/bash
/bin/zsh
/usr/bin/zsh`}
      />

      <TerminalBlock
        comment="trocar (vai pedir sua senha)"
        command="chsh -s /usr/bin/zsh"
        output={`Senha: 
Shell alterado.`}
      />

      <TerminalBlock
        comment="confirma a mudança em /etc/passwd"
        command={`getent passwd "$USER" | cut -d: -f7`}
        output={`/usr/bin/zsh`}
      />

      <AlertBox type="warning" title="A mudança vale no PRÓXIMO login">
        O <code>chsh</code> só altera o shell que será iniciado no próximo login (TTY,
        SSH, login gráfico). Para testar agora, digite <code>zsh</code> e Enter — você cai
        num zsh imediatamente.
      </AlertBox>

      <TerminalBlock
        comment="primeira execução do zsh — ele oferece o assistente de configuração"
        command="zsh"
        output={`This is the Z Shell configuration function for new users,
zsh-newuser-install.

(q)  Quit and do nothing.  The function will be run again next time.

(0)  Exit, creating the file ~/.zshrc

(1)  Continue to the main menu.

--- Type one of the keys in parentheses ---`}
      />

      <p>Aperte <kbd>q</kbd> — vamos usar o oh-my-zsh, ele cria o <code>.zshrc</code> melhor.</p>

      <h2>3. Instalando Oh My Zsh</h2>

      <TerminalBlock
        comment="precisa de git e curl (já no base-devel)"
        command={`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`}
        output={`Cloning Oh My Zsh...
remote: Enumerating objects: 1421, done.
Receiving objects: 100% (1421/1421), 2.84 MiB | 10.00 MiB/s, done.
Resolving deltas: 100% (834/834), done.

Looking for an existing zsh config...
Using the Oh My Zsh template file and adding it to ~/.zshrc.

         __                                     __
  ____  / /_     ____ ___  __  __   ____  _____/ /_
 / __ \\/ __ \\   / __ \`__ \\/ / / /  /_  / / ___/ __ \\
/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /
\\____/_/ /_/  /_/ /_/ /_/\\__, /    /___/____/_/ /_/
                        /____/                       ....is now installed!`}
      />

      <h3>Estrutura de arquivos resultante</h3>

      <OutputBlock
        title="~/ depois da instalação"
        output={`~/.zshrc                       sua configuração principal
~/.oh-my-zsh/                  framework
├── oh-my-zsh.sh               carregador
├── lib/                       funções utilitárias
├── plugins/                   ~300 plugins built-in
│   ├── git/
│   ├── archlinux/             ⭐ específico para Arch
│   ├── docker/
│   ├── kubectl/
│   └── ...
├── themes/                    ~150 temas
│   ├── robbyrussell.zsh-theme (default)
│   ├── agnoster.zsh-theme
│   └── ...
└── custom/                    SUAS customizações
    ├── plugins/               plugins extras (clonar aqui)
    ├── themes/                temas extras
    └── *.zsh                  scripts próprios`}
      />

      <h2>4. Plugins essenciais (instale ESTES dois)</h2>

      <p>
        Os dois plugins que mais transformam a experiência <strong>não vêm</strong> com
        o oh-my-zsh por padrão (mas estão no AUR e oficialmente nos repos do Arch):
      </p>

      <TerminalBlock
        comment="instala via pacote oficial — caminho mais limpo no Arch"
        command="sudo pacman -S zsh-autosuggestions zsh-syntax-highlighting"
        output={`Packages (2) zsh-autosuggestions-0.7.1-2  zsh-syntax-highlighting-0.8.0-1

Total Installed Size:  0.31 MiB`}
      />

      <CodeBlock
        title="trecho do ~/.zshrc — adicione no final ou edite a linha 'plugins=()'"
        language="bash"
        code={`plugins=(
    git              # aliases gco, gp, gst, etc.
    archlinux        # paus, paur, paclean, paorph...
    sudo             # ESC ESC: prefixa o comando anterior com sudo
    history          # h, hsi (search interactive)
    extract          # extract qualquer.zip|tar|7z
    docker
    docker-compose
    z                # cd inteligente baseado em frecency
    colored-man-pages
)

# autosuggestions e syntax-highlighting via pacotes do Arch
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh`}
      />

      <TerminalBlock
        comment="recarrega"
        command="exec zsh"
        output={``}
      />

      <h3>O que cada plugin faz</h3>

      <CommandFlagList
        command="plugins recomendados"
        items={[
          { flag: "git", description: "Centenas de aliases git: gst, gco, gcm, gp, gpl, glog, gd, etc." },
          { flag: "archlinux", description: "Aliases pacman: paus (update), pain (install), paserep (search remoto), parlu (lista órfãs)..." },
          { flag: "sudo", description: "Aperte ESC duas vezes para colocar 'sudo ' na frente do comando anterior. Sanidade pura." },
          { flag: "z", description: "Aprende seus diretórios mais visitados. Digite 'z proj' e ele cd pro caminho mais provável." },
          { flag: "extract", description: "extract arquivo.tar.gz funciona pra qualquer formato (tar, 7z, zip, rar...)." },
          { flag: "colored-man-pages", description: "Coloriza o output do man (azul para flags, amarelo para títulos)." },
          { flag: "zsh-autosuggestions", description: "Sugere o resto da linha em CINZA com base no histórico. → aceita." },
          { flag: "zsh-syntax-highlighting", description: "Comandos válidos em verde, inválidos em vermelho ENQUANTO você digita." },
        ]}
      />

      <h2>5. Powerlevel10k — o tema com prompt rico</h2>

      <TerminalBlock
        comment="instala via pacman (vem no extra)"
        command="sudo pacman -S zsh-theme-powerlevel10k"
        output={`Packages (1)  zsh-theme-powerlevel10k-1.20.0-1

Total Installed Size:  3.42 MiB`}
      />

      <CodeBlock
        title="ativar — em ~/.zshrc, comente ZSH_THEME e adicione o source"
        language="bash"
        code={`# ZSH_THEME="robbyrussell"   # comente o default
source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme`}
      />

      <TerminalBlock
        command="exec zsh"
        output={``}
      />

      <p>
        Ao iniciar pela primeira vez, o p10k roda um <strong>wizard interativo</strong>:
      </p>

      <OutputBlock
        title="p10k configure — perguntas que fará"
        output={`This is Powerlevel10k configuration wizard.

  Does this look like a diamond (rotated square)?  ⟦ ◇ ⟧
  Yes / No

  Does this look like a lock?                       ⟦ ⏿ ⟧
  Yes / No

  Does this look like Debian logo?                  ⟦ ⌬ ⟧

  ...

  Prompt Style?  (1) Lean  (2) Classic  (3) Rainbow  (4) Pure
  Character Set?  (1) Unicode  (2) ASCII
  Prompt Colors?  (1) 8 colors  (2) 256 colors
  Show current time?  (1) No  (2) 24-hour  (3) 12-hour
  Prompt Separators?  ▶ ❯ → ...
  Prompt Heads?  same
  Prompt Tails?  same
  Prompt Height?  (1) one line  (2) two lines
  Prompt Connection?  ─
  Prompt Frame?  Sharp / Rounded / Disabled
  Prompt Spacing?  Compact / Sparse
  Icons?  Few / Many / Fluent
  Prompt Flow?  Concise / Fluent
  Enable Transient Prompt?  Yes (recommended) / No
  Instant Prompt Mode?  Verbose / Quiet / Off`}
      />

      <p>
        Após responder, ele salva tudo em <code>~/.p10k.zsh</code>. Para reabrir o wizard
        depois: <code>p10k configure</code>.
      </p>

      <AlertBox type="info" title="Precisa de fonte com ícones (Nerd Fonts)">
        Os ícones bonitos (git, kubectl, ramo) requerem uma fonte "patched" como Meslo,
        FiraCode Nerd Font, JetBrainsMono Nerd Font. Instale via{" "}
        <code>sudo pacman -S ttf-meslo-nerd</code> ou{" "}
        <code>yay -S nerd-fonts-fira-code</code>, e configure no seu emulador de terminal.
      </AlertBox>

      <h3>Como o prompt fica</h3>

      <OutputBlock
        title="prompt p10k típico em projeto git"
        output={`╭─  ~/projetos/api    main !2 ?1  ⬢ v22.10  py 3.12  k8s prod                14:32:08
╰─❯ pacman -Q | wc -l
1247
╭─  ~/projetos/api    main !2 ?1                                                  14:32:14
╰─❯`}
      />

      <h2>6. Configurações úteis no ~/.zshrc</h2>

      <CodeBlock
        title="histórico generoso e busca interativa"
        language="bash"
        code={`# === Histórico ===
HISTFILE=~/.zsh_history
HISTSIZE=50000
SAVEHIST=50000

setopt EXTENDED_HISTORY        # grava timestamp
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_IGNORE_SPACE       # comando começando com espaço NÃO grava
setopt HIST_FIND_NO_DUPS
setopt HIST_SAVE_NO_DUPS
setopt SHARE_HISTORY           # compartilha entre janelas em tempo real
setopt INC_APPEND_HISTORY

# busca incremental no histórico com ↑/↓ levando em conta o que já digitou
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down`}
      />

      <CodeBlock
        title="completions ricas"
        language="bash"
        code={`# Carrega o sistema de completions
autoload -Uz compinit && compinit

# Case-insensitive
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'

# Cores no menu de completions
zstyle ':completion:*' list-colors "\${(s.:.)LS_COLORS}"

# Menu interativo (selecionar com setas)
zstyle ':completion:*' menu select

# Descrição agrupada
zstyle ':completion:*:descriptions' format '%F{yellow}-- %d --%f'
zstyle ':completion:*' group-name ''`}
      />

      <CodeBlock
        title="aliases para Arch"
        language="bash"
        code={`# pacman
alias pacs='pacman -Ss'
alias pacS='sudo pacman -S'
alias pacU='sudo pacman -Syu'
alias pacR='sudo pacman -Rns'
alias paclean='sudo pacman -Sc'

# yay
alias yays='yay -Ss'
alias yayS='yay -S'
alias yayU='yay -Syu'

# systemd
alias sc='sudo systemctl'
alias scu='systemctl --user'

# git extras
alias gst='git status -sb'
alias glog='git log --oneline --graph --decorate --all -30'`}
      />

      <h2>7. Globbing avançado do zsh</h2>

      <TerminalBlock
        comment="recursivo nativo (sem precisar de **)"
        command="ls **/*.tsx | head -3"
        output={`src/components/Header.tsx
src/components/ui/Button.tsx
src/pages/Home.tsx`}
      />

      <TerminalBlock
        comment="qualifiers — flags entre parênteses no final"
        command="ls -lh **/*(.L+1)"
        output={`-rw-r--r-- 1 joao joao 2.1M Mar 24 10:14 backups/db.dump
-rw-r--r-- 1 joao joao 1.8M Mar 25 09:22 logs/app.log`}
      />

      <OutputBlock
        title="qualifiers comuns"
        output={`(.)         só arquivos regulares
(/)         só diretórios
(@)         só links simbólicos
(L+1)       maiores que 1MB
(L-1k)      menores que 1KB
(mh-24)     modificados nas últimas 24h
(om)        ordenado por modificação (decrescente)
(N)         null glob: silencia se não casar (em vez de erro)`}
      />

      <h2>8. Alternativas modernas — Starship e Zinit</h2>

      <p>
        Se Oh My Zsh ficar lento ou pesado para você (ele <em>source</em> dezenas de
        scripts), considere:
      </p>

      <CommandFlagList
        command="alternativas"
        items={[
          { flag: "Starship", description: "Prompt cross-shell escrito em Rust. Funciona em bash/zsh/fish/powershell. Configurável via TOML único.", example: "sudo pacman -S starship" },
          { flag: "Zinit", description: "Gerenciador de plugins zsh ULTRA rápido com lazy loading. Substitui o oh-my-zsh.", example: "yay -S zinit-bin-git" },
          { flag: "Antidote", description: "Outro gerenciador de plugins, sucessor do Antibody." },
          { flag: "Pure", description: "Prompt minimalista de uma linha que fica famoso entre devs." },
        ]}
      />

      <CodeBlock
        title="Starship em ~/.zshrc — 1 linha"
        language="bash"
        code={`eval "$(starship init zsh)"`}
      />

      <h2>9. Voltando para o bash (se precisar)</h2>

      <TerminalBlock
        command="chsh -s /bin/bash"
        output={`Senha: 
Shell alterado.`}
      />

      <p>Logout/login e você está de volta no bash. Seus arquivos <code>~/.zshrc</code> e <code>~/.oh-my-zsh</code> continuam ali — pode voltar quando quiser.</p>

      <h2>10. Cola visual</h2>

      <OutputBlock
        title="checklist do zsh ideal no Arch"
        output={`✓ sudo pacman -S zsh zsh-completions zsh-autosuggestions zsh-syntax-highlighting
✓ chsh -s /usr/bin/zsh
✓ sh -c "$(curl ...ohmyzsh/install.sh)"
✓ sudo pacman -S zsh-theme-powerlevel10k
✓ sudo pacman -S ttf-meslo-nerd
✓ Editar ~/.zshrc:
    plugins=(git archlinux sudo z extract docker colored-man-pages)
    source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
    source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
    source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme
✓ p10k configure
✓ exec zsh — pronto`}
      />

      <AlertBox type="success" title="Resultado">
        Histórico gigante, autosuggestions, syntax highlight, prompt mostrando branch git
        e ambiente — tudo nativo. O salto em produtividade vs bash padrão é considerável,
        e a curva de aprendizado é ~30 minutos.
      </AlertBox>
    </PageContainer>
  );
}
