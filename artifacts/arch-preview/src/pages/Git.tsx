import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Git() {
  return (
    <PageContainer
      title="Git no Arch Linux"
      subtitle="Controle de versão distribuído: instalação, configuração, fluxo diário e operações avançadas. Do init ao rebase, passando por GPG signing e workflow profissional."
      difficulty="intermediario"
      timeToRead="40 min"
      category="Dev & DevOps"
    >
      <p>
        O <code>git</code> é a ferramenta universal de controle de versão hoje — quase todo projeto
        de software (incluindo o próprio Arch, AUR e o kernel Linux) vive em um repositório git.
        No Arch ele está no repositório <code>extra</code> e costuma vir junto com{" "}
        <code>base-devel</code> (necessário para compilar pacotes do AUR), então provavelmente já
        está instalado.
      </p>

      <AlertBox type="info" title="Por que git no Arch?">
        Além do óbvio (versionar código), você precisa de git para clonar PKGBUILDs do AUR{" "}
        (<code>git clone https://aur.archlinux.org/pkg.git</code>), seguir <code>dotfiles</code> em
        repositórios Git, contribuir com a Wiki e até atualizar o <code>linux</code> a partir do
        upstream. É infraestrutura.
      </AlertBox>

      <h2>1. Instalação e versão</h2>

      <TerminalBlock
        comment="git já costuma estar presente; confirme"
        command="git --version"
        output="git version 2.47.1"
      />

      <TerminalBlock
        comment="se faltar"
        command="sudo pacman -S git"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) git-2.47.1-1

Total Installed Size:  25.42 MiB

:: Proceed with installation? [Y/n] y
(1/1) installing git                               [######################] 100%`}
      />

      <TerminalBlock
        comment="pacotes complementares populares"
        command="sudo pacman -S git-lfs tig gitui openssh"
        output={`Packages (4) git-lfs-3.6.1-1  tig-2.5.12-1  gitui-0.27.0-1  openssh-9.9p1-1

Total Installed Size:  18.93 MiB`}
      />

      <h2>2. Configuração inicial — quem é você?</h2>

      <p>
        Antes do primeiro commit, configure nome, e-mail e algumas preferências sãs. Tudo isso fica
        em <code>~/.gitconfig</code> (escopo <code>--global</code>) ou em
        <code> .git/config</code> dentro de cada repo (escopo <code>--local</code>, o default).
      </p>

      <TerminalBlock
        command={`git config --global user.name "João Arch"
git config --global user.email "joao@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.editor "nvim"
git config --global color.ui auto`}
      />

      <TerminalBlock
        comment="ver tudo o que está configurado"
        command="git config --global --list"
        output={`user.name=João Arch
user.email=joao@example.com
init.defaultBranch=main
pull.rebase=false
core.editor=nvim
color.ui=auto`}
      />

      <TerminalBlock
        comment="onde cada valor foi definido"
        command="git config --list --show-origin | head -8"
        output={`file:/etc/gitconfig         init.defaultbranch=main
file:/home/user/.gitconfig  user.name=João Arch
file:/home/user/.gitconfig  user.email=joao@example.com
file:/home/user/.gitconfig  init.defaultbranch=main
file:/home/user/.gitconfig  pull.rebase=false
file:/home/user/.gitconfig  core.editor=nvim
file:/home/user/.gitconfig  color.ui=auto`}
      />

      <CodeBlock
        title="~/.gitconfig recomendado"
        language="ini"
        code={`[user]
    name = João Arch
    email = joao@example.com
    signingkey = 0xABCDEF1234567890

[init]
    defaultBranch = main

[core]
    editor = nvim
    autocrlf = input
    excludesFile = ~/.gitignore_global

[color]
    ui = auto

[pull]
    rebase = false
    ff = only

[push]
    default = simple
    autoSetupRemote = true

[fetch]
    prune = true

[merge]
    conflictStyle = zdiff3

[rerere]
    enabled = true

[commit]
    gpgsign = true

[alias]
    s = status -sb
    co = checkout
    br = branch
    ci = commit
    lg = log --graph --pretty=format:'%C(yellow)%h%Creset %C(cyan)%an%Creset %s %C(green)(%cr)%Creset %C(red)%d%Creset' --abbrev-commit
    last = log -1 HEAD --stat
    unstage = reset HEAD --
    amend = commit --amend --no-edit`}
      />

      <h2>3. Criando e clonando repositórios</h2>

      <h3>git init — começar do zero</h3>

      <TerminalBlock
        command="mkdir meu-projeto && cd meu-projeto"
      />

      <TerminalBlock
        command="git init"
        output={`hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint:
hint:   git config --global init.defaultBranch <name>
hint:
Initialized empty Git repository in /home/user/meu-projeto/.git/`}
      />

      <TerminalBlock
        comment="se você já configurou init.defaultBranch=main, sai limpo"
        command="git init"
        output="Initialized empty Git repository in /home/user/meu-projeto/.git/"
      />

      <h3>git clone — copiar de um remote</h3>

      <TerminalBlock
        comment="clonando um PKGBUILD do AUR (caso clássico no Arch)"
        command="git clone https://aur.archlinux.org/yay.git"
        output={`Cloning into 'yay'...
remote: Enumerating objects: 12, done.
remote: Counting objects: 100% (12/12), done.
remote: Compressing objects: 100% (10/10), done.
remote: Total 12 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (12/12), 8.42 KiB | 8.42 MiB/s, done.`}
      />

      <TerminalBlock
        comment="clone via SSH"
        command="git clone git@github.com:torvalds/linux.git"
        output={`Cloning into 'linux'...
remote: Enumerating objects: 9512384, done.
remote: Counting objects: 100% (12384/12384), done.
remote: Compressing objects: 100% (3214/3214), done.
remote: Total 9512384 (delta 9437), reused 12384 (delta 9437), pack-reused 9499948
Receiving objects: 100% (9512384/9512384), 4.21 GiB | 18.21 MiB/s, done.
Resolving deltas: 100% (8127345/8127345), done.
Updating files: 100% (84321/84321), done.`}
      />

      <CommandFlagList
        command="git clone"
        items={[
          { flag: "--depth N", description: "Clone raso (shallow): pega só os últimos N commits. Excelente para CI ou repos enormes.", example: "git clone --depth 1 https://aur.archlinux.org/linux-zen.git" },
          { flag: "--branch B", description: "Checkout direto numa branch ou tag.", example: "git clone --branch v6.12 https://github.com/torvalds/linux.git" },
          { flag: "--single-branch", description: "Não baixa o histórico das outras branches." },
          { flag: "--recurse-submodules", description: "Clona junto os submódulos." },
          { flag: "--bare", description: "Clone sem working tree (útil para servidores)." },
          { flag: "-o NOME", description: "Define nome do remote (default: origin).", example: "git clone -o upstream https://..." },
        ]}
      />

      <h2>4. O fluxo diário — add, commit, push</h2>

      <h3>git status — leitura obrigatória</h3>

      <TerminalBlock
        command="git status"
        output={`On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        {g}new file:   src/utils.ts{/}

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        {y}modified:   README.md{/}

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        {r}notas.txt{/}

no changes added to commit (use "git add" and/or "git commit -a")`}
      />

      <TerminalBlock
        comment="versão curta — ótimo pra alias 'gs'"
        command="git status -sb"
        output={`## main...origin/main
A  src/utils.ts
 M README.md
?? notas.txt`}
      />

      <OutputBlock
        title="anatomia do git status -sb"
        annotations={[
          { line: 0, note: "branch atual + relação com upstream" },
          { line: 1, note: "A=adicionado (staged); coluna 1 = index" },
          { line: 2, note: "M na coluna 2 = modificado (não staged)" },
          { line: 3, note: "?? = arquivo desconhecido (não rastreado)" },
        ]}
        output={`## main...origin/main
A  src/utils.ts
 M README.md
?? notas.txt`}
      />

      <h3>git add — preparando commits</h3>

      <CommandFlagList
        command="git add"
        items={[
          { flag: "<arquivo>", description: "Adiciona arquivo específico ao index.", example: "git add src/main.ts" },
          { flag: "-A", long: "--all", description: "Adiciona TUDO: novos, modificados e removidos." },
          { flag: ".", description: "Adiciona tudo no diretório atual e abaixo (não inclui removidos no git antigo)." },
          { flag: "-u", long: "--update", description: "Só atualiza arquivos JÁ rastreados (ignora novos)." },
          { flag: "-p", long: "--patch", description: "Modo interativo: revisa cada hunk e decide.", example: "git add -p src/" },
          { flag: "-n", long: "--dry-run", description: "Mostra o que seria adicionado, sem fazer nada." },
        ]}
      />

      <TerminalBlock
        comment="add interativo — perfeito pra commits atômicos"
        command="git add -p"
        output={`diff --git a/src/utils.ts b/src/utils.ts
index a1b2c3d..e4f5g6h 100644
--- a/src/utils.ts
+++ b/src/utils.ts
@@ -10,3 +10,7 @@ export function add(a: number, b: number) {
   return a + b
 }
+
+export function mul(a: number, b: number) {
+  return a * b
+}
(1/1) Stage this hunk [y,n,q,a,d,e,?]?`}
      />

      <h3>git commit — gravando o snapshot</h3>

      <TerminalBlock
        command={`git commit -m "feat: adiciona função mul"`}
        output={`[main 8a3f2c1] feat: adiciona função mul
 1 file changed, 4 insertions(+)`}
      />

      <TerminalBlock
        comment="abre o $EDITOR para escrever mensagem multilinha"
        command="git commit"
      />

      <TerminalBlock
        comment="amend: corrige a mensagem do último commit (NUNCA em commits já pushados)"
        command={`git commit --amend -m "feat(utils): adiciona função mul com docs"`}
        output={`[main 8a3f2c1] feat(utils): adiciona função mul com docs
 Date: Wed Mar 26 14:32:18 2026 -0300
 1 file changed, 4 insertions(+)`}
      />

      <TerminalBlock
        comment="atalho: -a faz add+commit nos arquivos JÁ rastreados"
        command={`git commit -am "fix: trata divisão por zero"`}
        output={`[main b2c4d8e] fix: trata divisão por zero
 1 file changed, 3 insertions(+), 1 deletion(-)`}
      />

      <AlertBox type="info" title="Conventional Commits">
        Adote o padrão <code>tipo(escopo): descrição</code> — <code>feat</code>, <code>fix</code>,
        <code> docs</code>, <code>style</code>, <code>refactor</code>, <code>test</code>,
        <code> chore</code>. Permite gerar changelog automático, semver e leitura rápida do{" "}
        <code>git log</code>.
      </AlertBox>

      <h3>git push — enviando para o remote</h3>

      <TerminalBlock
        command="git push"
        output={`Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 12 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 412 bytes | 412.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), completed with 1 local object.
To github.com:joao/meu-projeto.git
   a1b2c3d..8a3f2c1  main -> main`}
      />

      <TerminalBlock
        comment="primeiro push de uma branch nova"
        command="git push -u origin feature/nova-tela"
        output={`Enumerating objects: 12, done.
...
remote: Create a pull request for 'feature/nova-tela' on GitHub by visiting:
remote:      https://github.com/joao/meu-projeto/pull/new/feature/nova-tela
To github.com:joao/meu-projeto.git
 * [new branch]      feature/nova-tela -> feature/nova-tela
branch 'feature/nova-tela' set up to track 'origin/feature/nova-tela'.`}
      />

      <h2>5. Inspeção: log, diff, show, blame</h2>

      <TerminalBlock
        command="git log --oneline -5"
        output={`{y}8a3f2c1{/} (HEAD -> main, origin/main) feat(utils): adiciona função mul
{y}b2c4d8e{/} fix: trata divisão por zero
{y}71f9d24{/} docs: atualiza README
{y}3c5b921{/} refactor: extrai helpers para src/lib
{y}d8a712b{/} chore: configura prettier`}
      />

      <TerminalBlock
        comment="log gráfico — gosto pessoal mas vicia"
        command={`git log --graph --oneline --all --decorate -8`}
        output={`* {y}8a3f2c1{/} {b}(HEAD -> main, origin/main){/} feat(utils): adiciona função mul
* {y}b2c4d8e{/} fix: trata divisão por zero
| * {y}f4e7c91{/} {b}(feature/nova-tela){/} feat: tela de configurações
| * {y}9b3a814{/} wip: layout inicial
|/
* {y}71f9d24{/} docs: atualiza README
* {y}3c5b921{/} refactor: extrai helpers para src/lib`}
      />

      <CommandFlagList
        command="git log"
        items={[
          { flag: "--oneline", description: "Uma linha por commit (hash curto + título)." },
          { flag: "--graph", description: "Desenha as linhas de branch/merge em ASCII." },
          { flag: "--all", description: "Inclui TODAS as branches (não só HEAD)." },
          { flag: "--decorate", description: "Mostra refs (branches, tags) ao lado dos commits." },
          { flag: "-p", description: "Inclui o diff de cada commit." },
          { flag: "--stat", description: "Resumo de arquivos alterados + linhas +/-." },
          { flag: "--author=NOME", description: "Filtra por autor.", example: "git log --author=joao" },
          { flag: "--since / --until", description: "Janela temporal.", example: "git log --since='2 weeks ago'" },
          { flag: "--grep=PAT", description: "Busca em mensagens de commit.", example: "git log --grep=fix" },
          { flag: "-S STRING", description: "Pickaxe: commits que adicionaram/removeram STRING.", example: "git log -S 'function login'" },
          { flag: "-- ARQUIVO", description: "Histórico de um arquivo específico.", example: "git log -- src/utils.ts" },
        ]}
      />

      <TerminalBlock
        command="git diff"
        output={`diff --git a/src/main.ts b/src/main.ts
index a1b2c3d..e4f5g6h 100644
--- a/src/main.ts
+++ b/src/main.ts
@@ -10,7 +10,7 @@ async function main() {
   const cfg = await loadConfig()
   {r}-  console.log(cfg){/}
   {g}+  logger.info(cfg){/}

   server.listen(cfg.port)
 }`}
      />

      <TerminalBlock
        comment="diff entre commits"
        command="git diff HEAD~3..HEAD --stat"
        output={` README.md         |  18 ++--
 src/utils.ts      |  42 +++++++++
 src/lib/logger.ts |  31 ++++---
 3 files changed, 73 insertions(+), 18 deletions(-)`}
      />

      <TerminalBlock
        comment="quem modificou cada linha (e quando)"
        command="git blame -L 1,5 src/main.ts"
        output={`{y}3c5b921 (joao 2026-03-22 18:24:11 -0300 1){/} import { Server } from "./server"
{y}3c5b921 (joao 2026-03-22 18:24:11 -0300 2){/} import { loadConfig } from "./config"
{y}71f9d24 (maria 2026-03-23 09:14:02 -0300 3){/} import { logger } from "./lib/logger"
{y}3c5b921 (joao 2026-03-22 18:24:11 -0300 4){/}
{y}3c5b921 (joao 2026-03-22 18:24:11 -0300 5){/} async function main() {`}
      />

      <h2>6. Branches: criando, trocando, removendo</h2>

      <TerminalBlock
        command="git branch"
        output={`* {g}main{/}
  feature/nova-tela
  hotfix/login`}
      />

      <TerminalBlock
        comment="criar e mudar (jeito moderno)"
        command="git switch -c feature/dark-mode"
        output="Switched to a new branch 'feature/dark-mode'"
      />

      <TerminalBlock
        comment="o jeito antigo ainda funciona"
        command="git checkout -b feature/dark-mode"
        output="Switched to a new branch 'feature/dark-mode'"
      />

      <TerminalBlock
        comment="voltar pra main"
        command="git switch main"
        output="Switched to branch 'main'"
      />

      <TerminalBlock
        comment="apagar branch local (já mergeada)"
        command="git branch -d feature/dark-mode"
        output="Deleted branch feature/dark-mode (was 8a3f2c1)."
      />

      <TerminalBlock
        comment="forçar exclusão (não mergeada)"
        command="git branch -D feature/wip"
        output="Deleted branch feature/wip (was 9b3a814)."
      />

      <TerminalBlock
        comment="apagar branch remota"
        command="git push origin --delete feature/wip"
        output={`To github.com:joao/meu-projeto.git
 - [deleted]         feature/wip`}
      />

      <h2>7. Merge vs Rebase</h2>

      <h3>git merge — junta histórico preservado</h3>

      <TerminalBlock
        command="git switch main && git merge feature/dark-mode"
        output={`Updating 8a3f2c1..f4e7c91
Fast-forward
 src/styles/theme.ts | 42 ++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 42 insertions(+)
 create mode 100644 src/styles/theme.ts`}
      />

      <TerminalBlock
        comment="merge com commit de merge explícito (mantém histórico de branch)"
        command="git merge --no-ff feature/dark-mode"
        output={`Merge made by the 'ort' strategy.
 src/styles/theme.ts | 42 ++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 42 insertions(+)`}
      />

      <h3>git rebase — reescreve por cima</h3>

      <TerminalBlock
        command="git switch feature/dark-mode && git rebase main"
        output={`Successfully rebased and updated refs/heads/feature/dark-mode.`}
      />

      <TerminalBlock
        comment="rebase interativo: edita os últimos N commits (squash, reword, drop...)"
        command="git rebase -i HEAD~3"
        output={`pick b2c4d8e fix: trata divisão por zero
pick 71f9d24 docs: atualiza README
pick 8a3f2c1 feat(utils): adiciona função mul

# Rebase 3c5b921..8a3f2c1 onto 3c5b921 (3 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, meld into previous
# f, fixup = like squash, discard message
# d, drop = remove commit`}
      />

      <AlertBox type="danger" title="A regra de ouro do rebase">
        <strong>NUNCA rebase commits já pushados</strong> em uma branch compartilhada — você reescreve
        o histórico e força quem clonou a usar <code>--force-with-lease</code> para atualizar. Use
        rebase só na sua branch local antes do primeiro push.
      </AlertBox>

      <h3>Resolvendo conflitos</h3>

      <TerminalBlock
        command="git merge feature/login"
        output={`Auto-merging src/auth.ts
CONFLICT (content): Merge conflict in src/auth.ts
Automatic merge failed; fix conflicts and then commit the result.`}
      />

      <OutputBlock
        title="marcadores de conflito no arquivo"
        output={`function login(user, pass) {
<<<<<<< HEAD
    return apiV2.authenticate(user, pass)
||||||| 3c5b921
    return api.login(user, pass)
=======
    return api.authenticate({ user, pass })
>>>>>>> feature/login
}`}
        annotations={[
          { line: 1, note: "<<<< versão atual (sua, em main)" },
          { line: 3, note: "||| ancestral comum (com conflictStyle=zdiff3)" },
          { line: 5, note: "==== separador" },
          { line: 7, note: ">>>> versão da branch que está vindo" },
        ]}
      />

      <TerminalBlock
        comment="depois de editar e remover marcadores"
        command="git add src/auth.ts && git commit"
        output={`[main e7f9c34] Merge branch 'feature/login'`}
      />

      <TerminalBlock
        comment="abortar merge no meio"
        command="git merge --abort"
      />

      <h2>8. Remotes — origin, upstream, fork workflow</h2>

      <TerminalBlock
        command="git remote -v"
        output={`origin    git@github.com:joao/meu-projeto.git (fetch)
origin    git@github.com:joao/meu-projeto.git (push)`}
      />

      <TerminalBlock
        comment="adicionar upstream (caso clássico de fork)"
        command="git remote add upstream https://github.com/empresa/meu-projeto.git"
      />

      <TerminalBlock
        command="git remote -v"
        output={`origin      git@github.com:joao/meu-projeto.git (fetch)
origin      git@github.com:joao/meu-projeto.git (push)
upstream    https://github.com/empresa/meu-projeto.git (fetch)
upstream    https://github.com/empresa/meu-projeto.git (push)`}
      />

      <TerminalBlock
        comment="puxar mudanças do upstream e atualizar a main local"
        command="git fetch upstream && git switch main && git merge upstream/main"
        output={`From https://github.com/empresa/meu-projeto
 * [new branch]      main       -> upstream/main
 * [new branch]      release    -> upstream/release
Updating 8a3f2c1..14ab9c2
Fast-forward
 src/api.ts | 18 ++++++++++++++++++
 1 file changed, 18 insertions(+)`}
      />

      <h2>9. Stash — guardando mudanças temporárias</h2>

      <TerminalBlock
        comment="você está mexendo em algo, mas precisa trocar de branch URGENTE"
        command="git stash push -m 'wip: refatorando login'"
        output={`Saved working directory and index state On main: wip: refatorando login`}
      />

      <TerminalBlock
        command="git stash list"
        output={`stash@{0}: On main: wip: refatorando login
stash@{1}: WIP on feature/x: 71f9d24 docs`}
      />

      <TerminalBlock
        comment="aplicar o último stash e mantê-lo na lista"
        command="git stash apply"
      />

      <TerminalBlock
        comment="aplicar e remover"
        command="git stash pop"
        output={`On branch main
Changes not staged for commit:
        modified:   src/login.ts
Dropped refs/stash@{0} (a3b2f81...)`}
      />

      <h2>10. Desfazendo coisas</h2>

      <CommandFlagList
        command="git — desfazer com segurança"
        items={[
          { flag: "git restore <arq>", description: "Descarta mudanças não-staged em arq.", example: "git restore src/main.ts" },
          { flag: "git restore --staged <arq>", description: "Tira do index (\"unstage\"), mantém modificações." },
          { flag: "git reset <arq>", description: "Mesma coisa que --staged (versão antiga)." },
          { flag: "git reset --soft HEAD~1", description: "Desfaz último commit, mantém mudanças staged." },
          { flag: "git reset --mixed HEAD~1", description: "Desfaz commit e tira do index (default)." },
          { flag: "git reset --hard HEAD~1", description: "DESTRÓI o último commit + mudanças. Cuidado.", example: "git reset --hard HEAD~1" },
          { flag: "git revert <hash>", description: "Cria um NOVO commit desfazendo. Seguro em main.", example: "git revert 8a3f2c1" },
          { flag: "git reflog", description: "Histórico de TODOS os movimentos do HEAD — sua rede de segurança." },
        ]}
      />

      <TerminalBlock
        command="git reflog"
        output={`8a3f2c1 (HEAD -> main) HEAD@{0}: commit: feat: adiciona mul
b2c4d8e HEAD@{1}: commit: fix: divisão por zero
71f9d24 HEAD@{2}: pull: Fast-forward
3c5b921 HEAD@{3}: reset: moving to HEAD~1
9c1ab87 HEAD@{4}: commit: experiência maluca`}
      />

      <TerminalBlock
        comment="ressuscitar um commit 'perdido' após reset --hard"
        command="git reset --hard 9c1ab87"
        output="HEAD is now at 9c1ab87 experiência maluca"
      />

      <AlertBox type="success" title="reflog é a sua rede de segurança">
        Quase nada está realmente perdido por 90 dias. Antes de declarar luto sobre um commit
        sumido, rode <code>git reflog</code>.
      </AlertBox>

      <h2>11. .gitignore</h2>

      <CodeBlock
        title=".gitignore típico de projeto Node"
        language="gitignore"
        code={`# Build
dist/
build/
*.tsbuildinfo

# Dependências
node_modules/
.pnpm-store/

# Logs
*.log
npm-debug.log*

# Editor
.vscode/
.idea/
*.swp

# Sistema
.DS_Store
Thumbs.db

# Env
.env
.env.local
.env.*.local

# Cache
.cache/
.parcel-cache/

# Coverage
coverage/
*.lcov`}
      />

      <TerminalBlock
        comment="gitignore global (vale para TODOS os repos)"
        command="git config --global core.excludesFile ~/.gitignore_global"
      />

      <TerminalBlock
        comment="checa se um arquivo está sendo ignorado e por qual regra"
        command="git check-ignore -v node_modules/foo/index.js"
        output=".gitignore:6:node_modules/  node_modules/foo/index.js"
      />

      <h2>12. Tags — marcando releases</h2>

      <TerminalBlock
        command="git tag v1.0.0"
      />

      <TerminalBlock
        comment="tag anotada (preferível: tem autor, data, mensagem)"
        command={`git tag -a v1.0.0 -m "Release inicial"`}
      />

      <TerminalBlock
        command="git tag -l"
        output={`v0.9.0
v0.9.1
v1.0.0`}
      />

      <TerminalBlock
        comment="empurrar uma tag específica"
        command="git push origin v1.0.0"
        output={`To github.com:joao/meu-projeto.git
 * [new tag]         v1.0.0 -> v1.0.0`}
      />

      <TerminalBlock
        comment="empurrar TODAS as tags"
        command="git push origin --tags"
      />

      <h2>13. SSH para GitHub/GitLab/AUR</h2>

      <TerminalBlock
        command={`ssh-keygen -t ed25519 -C "joao@example.com"`}
        output={`Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/user/.ssh/id_ed25519
Your public key has been saved in /home/user/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:AbC123dEfG456hIjK789lMnO012pQrS345tU678vWx joao@example.com`}
      />

      <TerminalBlock
        command="cat ~/.ssh/id_ed25519.pub"
        output="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPx... joao@example.com"
      />

      <TerminalBlock
        comment="testar conexão (cole a chave pública no GitHub primeiro)"
        command="ssh -T git@github.com"
        output={`Hi joao! You've successfully authenticated, but GitHub does not provide shell access.`}
      />

      <CodeBlock
        title="~/.ssh/config — múltiplas contas"
        code={`Host github-pessoal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

Host github-trabalho
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes

Host aur.archlinux.org
    IdentityFile ~/.ssh/aur
    User aur`}
      />

      <h2>14. Commits assinados com GPG</h2>

      <TerminalBlock
        comment="gerar uma chave GPG"
        command="gpg --full-generate-key"
        output={`Please select what kind of key you want:
   (1) RSA and RSA
   (9) ECC (sign and encrypt) *default*
Your selection? 9
Please select which elliptic curve you want:
   (1) Curve 25519 *default*
Real name: João Arch
Email address: joao@example.com
gpg: key 0xABCDEF1234567890 marked as ultimately trusted
public and secret key created and signed.`}
      />

      <TerminalBlock
        command="gpg --list-secret-keys --keyid-format=long"
        output={`/home/user/.gnupg/pubring.kbx
sec   ed25519/{y}ABCDEF1234567890{/} 2026-03-26 [SC]
      F8A14D2E0C7B91234567890ABCDEF1234567890A
uid                 [ ultimate ] João Arch <joao@example.com>
ssb   cv25519/12345678ABCDEF90 2026-03-26 [E]`}
      />

      <TerminalBlock
        command={`git config --global user.signingkey ABCDEF1234567890
git config --global commit.gpgsign true`}
      />

      <TerminalBlock
        comment="exportar a chave pública para colar no GitHub"
        command="gpg --armor --export ABCDEF1234567890"
        output={`-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZgC1KhYJKwYBBAHaRw8BAQdA...
=Xa1b
-----END PGP PUBLIC KEY BLOCK-----`}
      />

      <TerminalBlock
        comment="commit assinado fica com 'gpg: Good signature' em git log --show-signature"
        command="git log --show-signature -1"
        output={`commit 8a3f2c1...
gpg: Signature made Wed 26 Mar 2026 14:32:18 -03
gpg:                using EDDSA key F8A14D2E0C7B91234567890ABCDEF1234567890A
gpg: Good signature from "João Arch <joao@example.com>" [ultimate]
Author: João Arch <joao@example.com>
Date:   Wed Mar 26 14:32:18 2026 -0300

    feat(utils): adiciona função mul`}
      />

      <h2>15. Workflow profissional — feature branches + PRs</h2>

      <CodeBlock
        title="fluxo típico de uma feature"
        code={`# 1. Atualizar main local
git switch main
git pull --ff-only

# 2. Criar branch da feature
git switch -c feat/exportar-csv

# 3. Trabalhar com commits pequenos
git add -p
git commit -m "feat(export): adiciona conversor CSV"

git add -p
git commit -m "test(export): cobre casos com aspas"

# 4. Manter atualizada com main (rebase)
git fetch origin
git rebase origin/main

# 5. Push e PR
git push -u origin feat/exportar-csv
# ... abre PR no GitHub/GitLab ...

# 6. Após aprovação: squash & merge na main
# 7. Localmente, limpar
git switch main
git pull --ff-only
git branch -d feat/exportar-csv
git remote prune origin`}
      />

      <h2>16. Aliases poderosos</h2>

      <CodeBlock
        title="adicione ao [alias] do ~/.gitconfig"
        language="ini"
        code={`[alias]
    s = status -sb
    co = checkout
    sw = switch
    br = branch
    ci = commit
    ca = commit --amend --no-edit
    unstage = reset HEAD --
    last = log -1 HEAD --stat

    # log bonito
    lg = log --graph --pretty=format:'%C(yellow)%h%Creset %C(cyan)%an%Creset %s %C(green)(%cr)%Creset %C(red)%d%Creset' --abbrev-commit

    # push seguro após rebase
    pf = push --force-with-lease

    # listar branches por uso recente
    recent = "!git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:short) %(refname:short)' | head -10"

    # mostra arquivos modificados no último commit
    files = show --pretty='' --name-only

    # qual branch cada hash veio?
    track = "!f() { git branch -a --contains $1; }; f"`}
      />

      <h2>17. Resumo prático — comandos do dia-a-dia</h2>

      <OutputBlock
        title="cola de bolso"
        output={`# começar
git init
git clone <url>

# fluxo diário
git status -sb
git add -p
git commit -m "tipo(escopo): mensagem"
git push

# branches
git switch -c feature/x
git switch main
git branch -d feature/x

# atualizar
git fetch
git pull --ff-only
git rebase origin/main

# inspeção
git log --oneline --graph --all
git diff
git blame arquivo

# desfazer
git restore arq                  # descartar mudanças
git restore --staged arq         # tirar do index
git reset --soft HEAD~1          # desfaz commit, mantém mudanças
git revert <hash>                # cria commit reverso
git reflog                       # SOS

# stash
git stash push -m "msg"
git stash pop

# tags
git tag -a v1.0.0 -m "release"
git push --tags`}
      />
    </PageContainer>
  );
}
