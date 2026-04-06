import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Git() {
  return (
    <PageContainer
      title="Git no Arch Linux"
      subtitle="Controle de versão essencial para todo desenvolvedor. Do básico ao avançado — branching, rebasing, hooks, worktrees e integração com GitHub/GitLab."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <h2>Instalação e Configuração Inicial</h2>
      <CodeBlock
        title="Instalar e configurar Git"
        code={`# Instalar Git
sudo pacman -S git

# Configuração global obrigatória
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Editor padrão
git config --global core.editor nvim    # Neovim
git config --global core.editor "code --wait"  # VSCode

# Branch padrão
git config --global init.defaultBranch main

# Cores na saída
git config --global color.ui auto

# Alias úteis
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --decorate --all"

# Ver configuração atual
git config --list
cat ~/.gitconfig`}
      />

      <h2>Comandos Essenciais</h2>
      <CodeBlock
        title="Fluxo básico do Git"
        code={`# Iniciar repositório
git init
git init --bare  # Repositório sem working tree (para servidores)

# Clonar repositório
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git nome-local
git clone --depth 1 https://github.com/user/repo.git  # Apenas último commit

# Ver status
git status
git status -s   # Formato curto

# Adicionar ao staging
git add arquivo.txt
git add .              # Todos os arquivos
git add -p             # Interativo (selecionar partes de arquivos)

# Commit
git commit -m "Mensagem do commit"
git commit -am "Adicionar e commitar arquivos rastreados"
git commit --amend     # Modificar último commit

# Ver histórico
git log
git log --oneline
git log --oneline --graph --all
git log -n 10           # Últimos 10 commits
git log --author="Nome" # Commits de um autor
git log --since="1 week ago"`}
      />

      <h2>Branches</h2>
      <CodeBlock
        title="Trabalhar com branches"
        code={`# Listar branches
git branch           # Locais
git branch -r        # Remotas
git branch -a        # Todas

# Criar branch
git branch feature/nova-funcao
git checkout -b feature/nova-funcao    # Criar e mudar
git switch -c feature/nova-funcao      # Moderno (Git 2.23+)

# Mudar de branch
git checkout main
git switch main       # Moderno

# Deletar branch
git branch -d feature/pronta          # Seguro (falha se não mergeada)
git branch -D feature/abandonada      # Forçar

# Renomear
git branch -m nome-antigo nome-novo
git branch -m nome-novo               # Renomear a atual`}
      />

      <h2>Merge e Rebase</h2>
      <CodeBlock
        title="Integrar mudanças"
        code={`# Merge (cria commit de merge)
git checkout main
git merge feature/pronta

# Merge sem fast-forward (sempre cria commit de merge)
git merge --no-ff feature/pronta

# Squash merge (combina commits em um)
git merge --squash feature/pronta
git commit -m "Adicionar nova funcionalidade"

# Rebase (reescreve histórico - mais limpo)
git checkout feature/pronta
git rebase main

# Rebase interativo (reorganizar, squash, editar commits)
git rebase -i HEAD~3        # Últimos 3 commits
git rebase -i main          # Desde o ponto de divergência com main

# Abort em caso de conflito
git rebase --abort
git merge --abort

# Continuar após resolver conflito
git add .
git rebase --continue
git merge --continue`}
      />

      <h2>Repositórios Remotos</h2>
      <CodeBlock
        title="Trabalhar com remotos"
        code={`# Listar remotos
git remote -v

# Adicionar remoto
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# Mudar URL do remoto
git remote set-url origin git@github.com:user/repo.git

# Buscar (sem merge)
git fetch origin
git fetch --all

# Pull (fetch + merge)
git pull origin main
git pull --rebase origin main    # Rebase em vez de merge

# Push
git push origin main
git push -u origin main          # Definir upstream
git push --force-with-lease      # Push forçado seguro
git push origin --delete feature  # Deletar branch remota`}
      />

      <h2>Stash</h2>
      <CodeBlock
        title="Guardar mudanças temporariamente"
        code={`# Guardar mudanças no stash
git stash
git stash push -m "WIP: funcionalidade X"

# Listar stashes
git stash list

# Aplicar stash (mantém no stash)
git stash apply
git stash apply stash@{2}

# Aplicar e remover do stash
git stash pop

# Ver conteúdo de um stash
git stash show -p stash@{0}

# Deletar stash
git stash drop stash@{0}
git stash clear    # Deletar todos`}
      />

      <h2>Autenticação com GitHub via SSH</h2>
      <CodeBlock
        title="Configurar SSH para GitHub/GitLab"
        code={`# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu@email.com"

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub
# Cole no GitHub: Settings → SSH Keys → New SSH Key

# Testar conexão
ssh -T git@github.com
# Hi username! You've successfully authenticated...

# Configurar Git para usar SSH em vez de HTTPS
git remote set-url origin git@github.com:user/repo.git

# ~/.ssh/config para múltiplas contas
Host github-pessoal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_pessoal

Host github-trabalho
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_trabalho

# Usar:
git remote set-url origin git@github-pessoal:user/repo.git`}
      />

      <h2>Git Hooks</h2>
      <CodeBlock
        title="Automatizar com hooks"
        code={`# Hooks ficam em .git/hooks/
ls .git/hooks/

# Exemplo: pre-commit hook (roda antes de cada commit)
# Útil para: lint, testes, formatação

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Rodar lint antes de commitar
echo "Rodando lint..."
eslint src/ --fix
if [ $? -ne 0 ]; then
    echo "Lint falhou! Commit cancelado."
    exit 1
fi
echo "Lint passou!"
EOF

chmod +x .git/hooks/pre-commit

# pre-push: rodar testes antes de push
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
npm test
if [ $? -ne 0 ]; then
    echo "Testes falharam! Push cancelado."
    exit 1
fi
EOF
chmod +x .git/hooks/pre-push

# Para compartilhar hooks com o time, use husky ou lefthook
sudo pacman -S lefthook  # ou via npm: npm install --save-dev husky`}
      />

      <h2>Git Avançado</h2>
      <CodeBlock
        title="Comandos avançados"
        code={`# Cherry-pick (aplicar commit específico)
git cherry-pick abc1234
git cherry-pick main~3..main    # Range de commits

# Bisect (encontrar commit que introduziu bug)
git bisect start
git bisect bad                  # Commit atual é ruim
git bisect good v1.0            # v1.0 estava bom
# Git vai checar commits automaticamente
# Teste e marque:
git bisect good
git bisect bad
# Quando encontrar:
git bisect reset

# Worktrees (múltiplos diretórios do mesmo repo)
git worktree add ../hotfix hotfix-branch
git worktree list
git worktree remove ../hotfix

# Reflog (histórico de todas as ações)
git reflog
# Útil para recuperar commits "perdidos"
git reset --hard HEAD@{2}   # Voltar ao estado 2 ações atrás

# Blame (ver quem escreveu cada linha)
git blame arquivo.py
git blame -L 10,20 arquivo.py  # Apenas linhas 10-20`}
      />
    </PageContainer>
  );
}
