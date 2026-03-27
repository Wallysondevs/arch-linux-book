import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AmbienteGrafico() {
  return (
    <PageContainer
      title="GNOME & Desktop Ubuntu"
      subtitle="Configurando, personalizando e dominando o GNOME — o ambiente gráfico padrão do Ubuntu."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        O Ubuntu usa o <strong>GNOME</strong> como ambiente gráfico padrão desde o Ubuntu 17.10.
        O GNOME (GNU Network Object Model Environment) é um dos ambientes de desktop mais modernos
        e polidos do Linux, com design limpo e foco em simplicidade. O Ubuntu customiza levemente
        o GNOME vanilla com sua própria estética laranja/roxa.
      </p>

      <h2>GNOME: Conceitos Básicos</h2>

      <h3>Activities Overview</h3>
      <p>
        Pressione a tecla <strong>Super</strong> (tecla Windows) ou clique em "Activities" no
        canto superior esquerdo para abrir o Overview. Aqui você pode:
      </p>
      <ul>
        <li>Ver todas as janelas abertas</li>
        <li>Pesquisar aplicativos digitando diretamente</li>
        <li>Navegar entre workspaces (áreas de trabalho)</li>
        <li>Pesquisar arquivos, configurações e até fazer cálculos</li>
      </ul>

      <h3>Atalhos de Teclado Essenciais</h3>
      <CodeBlock
        title="Atalhos do GNOME mais usados"
        code={`Super                  # Abrir Activities Overview
Super + A              # Ver todos os aplicativos (App Grid)
Super + H              # Minimizar janela atual
Super + D              # Mostrar área de trabalho
Super + F              # Colocar janela em tela cheia
Super + ←/→            # Encaixar janela à esquerda/direita (tile)
Super + ↑/↓            # Maximizar / Restaurar janela
Super + Shift + ←/→    # Mover janela para workspace anterior/próximo
Super + número         # Mudar para workspace específico
Alt + F4               # Fechar janela
Alt + Tab              # Alternar entre aplicativos abertos
Alt + \`               # Alternar entre janelas do mesmo app
Ctrl + Alt + T         # Abrir Terminal (no Ubuntu)
Ctrl + Alt + Del       # Menu de logout/reiniciar/desligar`}
      />

      <h2>Configurações do Sistema</h2>
      <p>
        O aplicativo <strong>Configurações</strong> (Settings) é o painel de controle do Ubuntu.
        Acesse por: Activities → "Configurações" ou clique no menu do canto superior direito → ícone de chave.
      </p>
      <ul>
        <li><strong>Aparência</strong>: Tema claro/escuro, cor de destaque, tamanho de ícones</li>
        <li><strong>Monitores</strong>: Resolução, taxa de atualização, múltiplos monitores</li>
        <li><strong>Teclado</strong>: Atalhos, layout de teclado, idioma de entrada</li>
        <li><strong>Privacidade</strong>: Histórico de arquivos, rastreamento, câmera, microfone</li>
        <li><strong>Energia</strong>: Suspensão, brilho, bateria (notebooks)</li>
        <li><strong>Usuários</strong>: Gerenciar contas de usuário</li>
        <li><strong>Sobre</strong>: Informações do sistema, versão do Ubuntu, número de série do hardware</li>
      </ul>

      <h2>GNOME Tweaks: Personalizações Avançadas</h2>
      <p>
        O <strong>GNOME Tweaks</strong> (anteriormente chamado de GNOME Tweak Tool) expõe configurações
        avançadas que não estão no painel de Configurações padrão.
      </p>
      <CodeBlock
        title="Instalar GNOME Tweaks"
        code={`sudo apt install gnome-tweaks

# Abrir via Activities → "Tweaks" ou:
gnome-tweaks`}
      />
      <p>O que você pode fazer com GNOME Tweaks:</p>
      <ul>
        <li><strong>Fontes</strong>: Mudar fonte do sistema, tamanho, renderização</li>
        <li><strong>Extensões</strong>: Ativar/desativar extensões do GNOME</li>
        <li><strong>Janelas</strong>: Comportamento de maximização, botões da barra de título</li>
        <li><strong>Área de trabalho</strong>: Mostrar ícones na área de trabalho, lixeira</li>
        <li><strong>Barra superior</strong>: Mostrar dia da semana, segundos no relógio</li>
        <li><strong>Inicialização</strong>: Gerenciar aplicativos que iniciam com o sistema</li>
      </ul>

      <h2>Extensões do GNOME</h2>
      <p>
        As extensões do GNOME são pequenos complementos que adicionam funcionalidades ao shell.
        Você pode gerenciá-las pelo site oficial ou pela linha de comando.
      </p>
      <CodeBlock
        title="Gerenciar extensões"
        code={`# Instalar o gerenciador de extensões via GUI
sudo apt install gnome-shell-extensions
sudo apt install gnome-shell-extension-manager

# Ou instalar via snap:
sudo snap install extension-manager

# Extensões populares (instale pelo Extension Manager ou extensions.gnome.org):
# - Dash to Dock: Barra de tarefas fixa como no Windows/macOS
# - Blur my Shell: Efeito de desfoque na barra superior e Dash
# - GSConnect: Integração com smartphone (compartilhar arquivos, notificações)
# - Caffeine: Impede a tela de desligar quando você precisa (ex: vídeos)
# - Grand Theft Focus: Corrige janelas que aparecem em segundo plano
# - AppIndicator: Suporte a ícones de bandeja do sistema

# Listar extensões instaladas via linha de comando:
gnome-extensions list

# Habilitar/desabilitar extensão:
gnome-extensions enable nome-da-extensao@autor
gnome-extensions disable nome-da-extensao@autor`}
      />

      <AlertBox type="info" title="Site de extensões GNOME">
        Visite <code>extensions.gnome.org</code> para descobrir, instalar e gerenciar extensões
        diretamente pelo navegador. Você precisa instalar a extensão do navegador
        "GNOME Shell integration" e ter o <code>chrome-gnome-shell</code> instalado no sistema.
      </AlertBox>

      <h2>Temas Visuais</h2>
      <CodeBlock
        title="Mudar tema GTK e ícones"
        code={`# Instalar coleção de temas populares
sudo apt install gnome-themes-extra
sudo apt install papirus-icon-theme
sudo apt install arc-theme

# Aplicar tema via GNOME Tweaks → Aparência
# Ou via linha de comando com gsettings:

# Mudar tema GTK
gsettings set org.gnome.desktop.interface gtk-theme 'Arc-Dark'

# Mudar tema de ícones
gsettings set org.gnome.desktop.interface icon-theme 'Papirus-Dark'

# Mudar cursor
gsettings set org.gnome.desktop.interface cursor-theme 'DMZ-White'

# Mudar fonte do sistema
gsettings set org.gnome.desktop.interface font-name 'Ubuntu 11'
gsettings set org.gnome.desktop.interface monospace-font-name 'Ubuntu Mono 13'

# Ativar tema escuro (Ubuntu 22.04+)
gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'

# Voltar para tema claro
gsettings set org.gnome.desktop.interface color-scheme 'prefer-light'`}
      />

      <h2>Workspaces (Áreas de Trabalho)</h2>
      <CodeBlock
        title="Configurar workspaces"
        code={`# Ver configuração atual de workspaces
gsettings get org.gnome.mutter dynamic-workspaces
# true = workspaces dinâmicos (criados automaticamente)
# false = número fixo de workspaces

# Fixar número de workspaces (ex: 4)
gsettings set org.gnome.mutter dynamic-workspaces false
gsettings set org.gnome.desktop.wm.preferences num-workspaces 4

# No GNOME Tweaks → Workspaces:
# - Static Workspaces: número fixo
# - Dynamic Workspaces: criados/removidos automaticamente

# Atalhos para workspaces:
# Super + número      → Ir para workspace N
# Super + Shift + número → Mover janela para workspace N
# Ctrl + Alt + ←/→   → Navegar entre workspaces (alternativo)`}
      />

      <h2>Aplicativos Padrão do Ubuntu</h2>
      <p>O Ubuntu 24.04 LTS vem com os seguintes aplicativos pré-instalados:</p>
      <ul>
        <li><strong>Firefox</strong>: Navegador web</li>
        <li><strong>LibreOffice</strong>: Suite de escritório (Writer, Calc, Impress)</li>
        <li><strong>Thunderbird</strong>: Cliente de e-mail</li>
        <li><strong>Nautilus</strong>: Gerenciador de arquivos (Files)</li>
        <li><strong>GNOME Calendar</strong>: Calendário</li>
        <li><strong>GNOME Photos</strong>: Gerenciador de fotos</li>
        <li><strong>Rhythmbox</strong>: Player de música</li>
        <li><strong>Shotwell</strong>: Edição básica de fotos</li>
        <li><strong>GNOME Software</strong>: Loja de aplicativos gráfica</li>
      </ul>

      <h2>Múltiplos Monitores</h2>
      <CodeBlock
        title="Configurar múltiplos monitores"
        code={`# Via interface gráfica:
# Configurações → Monitores

# Via linha de comando (xrandr - para sessões X11):
# Ver monitores disponíveis:
xrandr

# Exemplo de saída:
# Screen 0: minimum 8x8, current 3840x1080
# HDMI-1 connected 1920x1080+0+0
# DP-1 connected 1920x1080+1920+0

# Configurar resolução de um monitor:
xrandr --output HDMI-1 --mode 1920x1080 --rate 60

# Monitor secundário à direita do principal:
xrandr --output HDMI-1 --primary --output DP-1 --right-of HDMI-1

# Espelhar monitores:
xrandr --output DP-1 --same-as HDMI-1

# Para sessões Wayland (Ubuntu 22.04+), use o painel de Configurações
# pois o xrandr tem suporte limitado no Wayland`}
      />

      <AlertBox type="warning" title="X11 vs Wayland">
        O Ubuntu 22.04+ usa <strong>Wayland</strong> como sessão padrão, o que melhora segurança
        e suporte a displays de alta resolução. Alguns aplicativos mais antigos podem não funcionar
        perfeitamente no Wayland. Se precisar, você pode voltar ao X11 na tela de login: clique
        no ícone de engrenagem antes de fazer login e selecione "Ubuntu em Xorg".
      </AlertBox>

      <h2>Desempenho e Recursos</h2>
      <CodeBlock
        title="Verificar uso de recursos do sistema gráfico"
        code={`# Ver uso de memória geral
free -h

# Ver processos do GNOME Shell
ps aux | grep gnome-shell

# Reiniciar o GNOME Shell sem fechar aplicativos (apenas X11):
# Alt + F2 → digitar "r" → Enter

# No Wayland, não é possível reiniciar o Shell sem sair da sessão.
# Faça logout e login novamente.

# Ver uso de GPU (se tiver NVIDIA):
nvidia-smi

# Para AMD e Intel:
sudo apt install intel-gpu-tools
sudo intel_gpu_top`}
      />
    </PageContainer>
  );
}
