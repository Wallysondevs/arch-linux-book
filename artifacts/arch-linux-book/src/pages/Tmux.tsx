import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Tmux() {
  return (
    <PageContainer
      title="tmux - Multiplexador de Terminal"
      subtitle="Múltiplas janelas, painéis e sessões persistentes em um único terminal. O tmux é essencial para produtividade máxima no terminal e trabalho remoto."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>Por que usar tmux?</h2>
      <p>
        O tmux (terminal multiplexer) permite que você:
      </p>
      <ul>
        <li><strong>Sessões persistentes</strong> — Processos continuam rodando mesmo se a conexão SSH cair</li>
        <li><strong>Múltiplos painéis</strong> — Dividir o terminal em múltiplas áreas horizontais/verticais</li>
        <li><strong>Múltiplas janelas</strong> — Abas dentro de uma sessão tmux</li>
        <li><strong>Detach/Attach</strong> — Desconectar de uma sessão e reconectar mais tarde</li>
        <li><strong>Compartilhar sessões</strong> — Múltiplos usuários vendo o mesmo terminal</li>
      </ul>

      <h2>Instalação</h2>
      <CodeBlock
        title="Instalar tmux"
        code={`sudo pacman -S tmux

# Verificar versão
tmux -V`}
      />

      <h2>Conceitos Fundamentais</h2>
      <p>
        O tmux tem uma hierarquia: <strong>Servidor → Sessão → Janela → Painel</strong>
      </p>
      <ul>
        <li><strong>Servidor</strong> — Processo tmux em background que gerencia tudo</li>
        <li><strong>Sessão</strong> — Conjunto de janelas. Pode ser nomeada. Persiste após desconexão.</li>
        <li><strong>Janela</strong> — Uma "aba" dentro de uma sessão. Cada janela tem um ou mais painéis.</li>
        <li><strong>Painel</strong> — Uma divisão da tela dentro de uma janela.</li>
      </ul>
      <p>
        O <strong>prefixo</strong> é a combinação de teclas que precede todos os atalhos do tmux.
        O padrão é <code>Ctrl+b</code>. Neste guia, usamos a notação <code>Prefix</code> para isso.
      </p>

      <h2>Sessões</h2>
      <CodeBlock
        title="Gerenciar sessões"
        code={`# Criar nova sessão
tmux
tmux new                        # Igual ao acima
tmux new -s nome-da-sessao      # Com nome específico

# Listar sessões ativas
tmux ls
tmux list-sessions

# Reconectar a uma sessão existente
tmux attach
tmux a                          # Abreviação
tmux a -t nome-da-sessao       # Sessão específica
tmux a -t 0                    # Por número

# Dentro do tmux:
# Prefix + d       = Detach (desconectar da sessão)
# Prefix + s       = Selecionar sessão interativamente
# Prefix + $       = Renomear sessão atual

# Matar sessão
tmux kill-session -t nome
tmux kill-server                # Matar TODOS os servidores tmux`}
      />

      <h2>Janelas</h2>
      <CodeBlock
        title="Gerenciar janelas (tabs)"
        code={`# Dentro de uma sessão tmux:
# Prefix + c       = Criar nova janela
# Prefix + &       = Fechar janela atual (pede confirmação)
# Prefix + ,       = Renomear janela atual
# Prefix + n       = Próxima janela
# Prefix + p       = Janela anterior
# Prefix + [0-9]   = Ir para janela por número
# Prefix + w       = Lista de janelas interativa
# Prefix + .       = Mover janela (mudar número)
# Prefix + f       = Buscar janela por nome`}
      />

      <h2>Painéis (Panes)</h2>
      <CodeBlock
        title="Dividir e navegar entre painéis"
        code={`# Dividir painéis:
# Prefix + "       = Dividir horizontalmente (acima/abaixo)
# Prefix + %       = Dividir verticalmente (lado a lado)

# Navegar entre painéis:
# Prefix + setas   = Mover entre painéis
# Prefix + o       = Próximo painel (ciclar)
# Prefix + ;       = Alternar entre dois últimos painéis

# Redimensionar painéis:
# Prefix + Ctrl+setas  = Redimensionar (manter Ctrl)
# Prefix + Alt+setas   = Redimensionar em passos maiores

# Fechar painel:
# exit             = Sair do shell (fecha o painel)
# Prefix + x       = Fechar painel forçado

# Organização de painéis:
# Prefix + Space   = Ciclar entre layouts predefinidos
# Prefix + {       = Mover painel para esquerda
# Prefix + }       = Mover painel para direita
# Prefix + z       = Zoom no painel atual (toggle)
# Prefix + !       = Converter painel em janela separada`}
      />

      <h2>Configuração: ~/.tmux.conf</h2>
      <CodeBlock
        title="Configuração básica do tmux"
        code={`# Mudar prefixo para Ctrl+a (mais ergonômico para muitos)
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Numeração a partir de 1 (mais intuitivo)
set -g base-index 1
setw -g pane-base-index 1
set -g renumber-windows on

# Atalhos para dividir painéis (mais intuitivos)
unbind '"'
unbind %
bind | split-window -h -c "#{pane_current_path}"  # Vertical
bind - split-window -v -c "#{pane_current_path}"  # Horizontal

# Navegar entre painéis com vim keys
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Redimensionar painéis com vim keys
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# Recarregar configuração
bind r source-file ~/.tmux.conf \; display "Configuração recarregada!"

# Mouse support
set -g mouse on

# Modo de cópia estilo vim
setw -g mode-keys vi

# Melhor suporte a cores
set -g default-terminal "tmux-256color"
set -ga terminal-overrides ",xterm-256color:Tc"

# Histórico maior
set -g history-limit 10000

# Sem delay no Escape (importante para Neovim)
set -g escape-time 0

# Atualizar status bar com frequência
set -g status-interval 5`}
      />

      <h2>Modo de Cópia (Copy Mode)</h2>
      <CodeBlock
        title="Selecionar e copiar texto"
        code={`# Entrar em modo de cópia
# Prefix + [     = Entrar em modo de cópia
# Prefix + PageUp = Entrar em modo de cópia e rolar para cima

# No modo de cópia (com mode-keys vi):
# h/j/k/l      = Navegar
# /            = Buscar (para frente)
# ?            = Buscar (para trás)
# n/N          = Próxima/anterior ocorrência
# Space        = Começar seleção
# Enter        = Copiar seleção e sair do modo
# q            = Sair do modo de cópia sem copiar

# Colar texto copiado
# Prefix + ]   = Colar buffer tmux

# Integração com clipboard do sistema
# Em ~/.tmux.conf:
bind -T copy-mode-vi y send -X copy-pipe "xclip -selection clipboard -in"
# Para Wayland:
bind -T copy-mode-vi y send -X copy-pipe "wl-copy"`}
      />

      <h2>Plugins com TPM</h2>
      <CodeBlock
        title="tmux Plugin Manager (TPM)"
        code={`# Instalar TPM
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# Adicionar ao ~/.tmux.conf:
# Lista de plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'     # Configurações sensatas
set -g @plugin 'tmux-plugins/tmux-resurrect'    # Salvar/restaurar sessões
set -g @plugin 'tmux-plugins/tmux-continuum'    # Salvar automaticamente
set -g @plugin 'tmux-plugins/tmux-yank'         # Melhor integração clipboard
set -g @plugin 'catppuccin/tmux'                # Tema visual

# Configurar continuum
set -g @continuum-restore 'on'    # Restaurar automaticamente ao iniciar

# Inicializar TPM (SEMPRE no final do arquivo)
run '~/.tmux/plugins/tpm/tpm'

# Instalar plugins: Prefix + I
# Atualizar plugins: Prefix + U
# Remover plugins não listados: Prefix + Alt + u`}
      />

      <h2>Comandos Úteis para SSH</h2>
      <CodeBlock
        title="tmux com SSH"
        code={`# Conectar via SSH e criar/reconectar sessão tmux
ssh usuario@servidor
tmux new -s trabalho

# Ou em um comando só:
ssh -t usuario@servidor 'tmux new -A -s trabalho'
# -A = reconecta se a sessão já existe
# -t força alocação de TTY

# Script para sempre usar tmux no SSH
# Adicionar ao ~/.bashrc do servidor:
if [[ -z "$TMUX" ]] && [[ -n "$SSH_CONNECTION" ]]; then
    tmux new -A -s ssh-session
fi

# Deixar processo rodando após desconexão SSH
ssh usuario@servidor
tmux new -s backup
# Iniciar backup longo...
backup-script.sh
# Desconectar com Prefix + d (processo continua!)
# Reconectar depois:
ssh usuario@servidor
tmux a -t backup`}
      />
    </PageContainer>
  );
}
