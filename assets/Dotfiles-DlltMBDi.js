import{j as i}from"./ui-K-J8Jkwj.js";import{P as e}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return i.jsxs(e,{title:"Dotfiles & Gerenciamento de Config",subtitle:"Organize, versionize e sincronize suas configurações do sistema. Aprenda a usar GNU Stow, chezmoi e Git para manter seus dotfiles em ordem.",difficulty:"intermediario",timeToRead:"18 min",children:[i.jsx("h2",{children:"O que são Dotfiles?"}),i.jsxs("p",{children:["No Linux, arquivos de configuração geralmente começam com ponto (",i.jsx("code",{children:"."}),'), tornando-os ocultos por padrão. Por isso são chamados de "dotfiles". Exemplos:',i.jsx("code",{children:"~/.bashrc"}),", ",i.jsx("code",{children:"~/.config/nvim/init.lua"}),", ",i.jsx("code",{children:"~/.gitconfig"}),"."]}),i.jsx("p",{children:"Gerenciar dotfiles com Git permite que você:"}),i.jsxs("ul",{children:[i.jsx("li",{children:"Sincronize configurações entre múltiplos computadores"}),i.jsx("li",{children:"Restaure configurações rapidamente em um sistema novo"}),i.jsx("li",{children:"Tenha histórico de mudanças com Git"}),i.jsx("li",{children:"Compartilhe suas configs com a comunidade"}),i.jsx("li",{children:"Faça backup automático em um repositório GitHub/GitLab"})]}),i.jsx("h2",{children:"Método 1: GNU Stow"}),i.jsxs("p",{children:["O ",i.jsx("code",{children:"stow"})," cria links simbólicos de um diretório central para o home. É a abordagem mais simples e mais usada."]}),i.jsx(o,{title:"Configurar dotfiles com GNU Stow",code:`# Instalar stow
sudo pacman -S stow

# Criar diretório de dotfiles
mkdir -p ~/dotfiles

# Estrutura recomendada:
# ~/dotfiles/
# ├── bash/
# │   └── .bashrc
# ├── nvim/
# │   └── .config/nvim/init.lua
# ├── git/
# │   └── .gitconfig
# └── tmux/
#     └── .tmux.conf

# Migrar .bashrc para o repositório
mv ~/.bashrc ~/dotfiles/bash/.bashrc

# Criar link simbólico com stow
cd ~/dotfiles
stow bash     # Cria link: ~/.bashrc -> ~/dotfiles/bash/.bashrc

# Verificar
ls -la ~ | grep bashrc
# .bashrc -> /home/user/dotfiles/bash/.bashrc

# Aplicar múltiplos pacotes
stow bash nvim git tmux

# Remover links (unstow)
stow -D bash

# Simular sem criar links (dry-run)
stow -n bash`}),i.jsx(o,{title:"Estrutura completa de dotfiles com stow",code:`# Exemplo de estrutura mais completa:
~/dotfiles/
├── bash/
│   ├── .bashrc
│   ├── .bash_profile
│   └── .bash_aliases
├── zsh/
│   ├── .zshrc
│   └── .zsh_history  (opcional, não versionar)
├── git/
│   └── .gitconfig
├── nvim/
│   └── .config/
│       └── nvim/
│           ├── init.lua
│           └── lua/
├── tmux/
│   └── .tmux.conf
├── alacritty/
│   └── .config/
│       └── alacritty/
│           └── alacritty.toml
├── i3/
│   └── .config/
│       └── i3/
│           └── config
└── scripts/
    └── .local/
        └── bin/
            └── meu-script.sh

# Aplicar tudo de uma vez
cd ~/dotfiles
stow */     # Aplica todos os diretórios`}),i.jsx("h2",{children:"Método 2: Repositório Git Bare"}),i.jsx("p",{children:"Técnica elegante que usa o home directory como worktree diretamente, sem links simbólicos."}),i.jsx(o,{title:"Git bare para dotfiles",code:`# Inicializar repositório bare
git init --bare $HOME/.dotfiles

# Criar alias para gerenciar
echo "alias dotfiles='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'" >> ~/.bashrc
source ~/.bashrc

# Ocultar arquivos não rastreados (para não poluir 'git status')
dotfiles config --local status.showUntrackedFiles no

# Adicionar arquivos
dotfiles add ~/.bashrc
dotfiles add ~/.gitconfig
dotfiles add ~/.config/nvim/init.lua
dotfiles commit -m "Adicionar configurações iniciais"

# Conectar ao GitHub
dotfiles remote add origin https://github.com/usuario/dotfiles.git
dotfiles push -u origin main

# Em um sistema novo, restaurar dotfiles:
git clone --bare https://github.com/usuario/dotfiles.git $HOME/.dotfiles
alias dotfiles='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'
dotfiles checkout

# Se houver conflitos (arquivos que já existem):
mkdir -p .config-backup
dotfiles checkout 2>&1 | grep -E "s+." | awk {'print $1'} | xargs -I{} mv {} .config-backup/{}`}),i.jsx("h2",{children:"Método 3: chezmoi"}),i.jsx("p",{children:"Ferramenta dedicada a gerenciar dotfiles com recursos avançados: templates, secrets, diferenças entre máquinas, etc."}),i.jsx(o,{title:"Usar chezmoi",code:`# Instalar chezmoi
sudo pacman -S chezmoi

# Inicializar
chezmoi init

# Adicionar um arquivo
chezmoi add ~/.bashrc

# Editar via chezmoi
chezmoi edit ~/.bashrc

# Ver diferenças
chezmoi diff

# Aplicar mudanças
chezmoi apply

# Conectar ao GitHub
chezmoi init --apply https://github.com/usuario/dotfiles.git

# Sincronizar em outra máquina
chezmoi update`}),i.jsx("h2",{children:"Versionando com Git"}),i.jsx(o,{title:"Configurar repositório Git para dotfiles",code:`# Entrar no diretório de dotfiles
cd ~/dotfiles

# Inicializar Git
git init
git branch -M main

# .gitignore para dotfiles
cat > .gitignore << 'EOF'
*.swp
*~
.DS_Store
*.local    # Arquivos locais que não devem ser sincronizados
secrets/   # Secrets e senhas
EOF

# Primeiro commit
git add .
git commit -m "Configurações iniciais do sistema Arch Linux"

# Conectar ao GitHub
git remote add origin https://github.com/usuario/dotfiles.git
git push -u origin main`}),i.jsx("h2",{children:"Configurações Essenciais para Versionar"}),i.jsx(o,{title:"Arquivos importantes para versionar",code:`# Shell
~/.bashrc
~/.bash_profile
~/.bash_aliases
~/.zshrc

# Editor
~/.config/nvim/
~/.vimrc

# Terminal
~/.config/alacritty/
~/.config/kitty/
~/.tmux.conf

# Git
~/.gitconfig
~/.gitignore_global

# Ferramentas de desenvolvimento
~/.config/starship.toml   # Prompt
~/.config/htop/           # Monitor
~/.config/ranger/         # File manager

# Window Manager (se usar tiling WM)
~/.config/i3/
~/.config/sway/
~/.config/hypr/

# Temas e aparência
~/.config/gtk-3.0/
~/.config/gtk-4.0/
~/.Xresources
~/.xinitrc`}),i.jsxs(s,{type:"warning",title:"Nunca versione secrets",children:["Jamais adicione arquivos com senhas, tokens de API ou chaves SSH ao repositório público. Use ",i.jsx("code",{children:".gitignore"})," para excluir esses arquivos, ou use o chezmoi com suporte a secrets criptografados."]}),i.jsx("h2",{children:"Script de Bootstrap"}),i.jsx(o,{title:"Script para configurar novo sistema",code:`#!/bin/bash
# bootstrap.sh - Configurar novo Arch Linux com seus dotfiles

set -e

echo "=== Instalando dependências ==="
sudo pacman -S --needed git stow zsh neovim tmux

echo "=== Clonando dotfiles ==="
git clone https://github.com/usuario/dotfiles.git ~/dotfiles

echo "=== Aplicando configurações ==="
cd ~/dotfiles
stow bash zsh nvim tmux git

echo "=== Configurando Zsh como shell padrão ==="
chsh -s /bin/zsh

echo "=== Pronto! Reinicie o terminal ==="

# Tornar executável e usar:
# chmod +x bootstrap.sh
# ./bootstrap.sh`}),i.jsx("h2",{children:"Sincronizando entre Máquinas"}),i.jsx(o,{title:"Fluxo de trabalho diário",code:`# Ao modificar uma configuração
nvim ~/.config/nvim/init.lua

# As mudanças já estão no diretório dotfiles (via link simbólico)
cd ~/dotfiles
git status
git add .config/nvim/init.lua
git commit -m "nvim: adicionar plugin telescope"
git push

# Em outra máquina
cd ~/dotfiles
git pull
# Os links simbólicos já apontam para os arquivos atualizados`})]})}export{u as default};
