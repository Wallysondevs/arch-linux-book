import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";
import { CommandFlagList } from "@/components/ui/CommandFlag";

export default function Editores() {
  return (
    <PageContainer
      title="Editores de Texto no Terminal"
      subtitle="nano, vim e vi: como editar arquivos sem sair do shell. O nano vem por padrão no pacstrap — saber usá-lo é obrigatório."
      difficulty="iniciante"
      timeToRead="35 min"
    >
      <p>
        Mais cedo ou mais tarde você vai precisar editar <code>/etc/fstab</code>, <code>/etc/pacman.conf</code>{" "}
        ou <code>~/.bashrc</code> direto no terminal — durante uma instalação, dentro de um chroot, em um
        servidor remoto via SSH ou quando o ambiente gráfico simplesmente não sobe. Sem editor, sem
        configuração. Os dois editores que <strong>sempre</strong> estão presentes em um Arch recém-instalado
        são <code>nano</code> (incluído no pacstrap padrão) e <code>vi</code>/<code>vim</code> (vim costuma
        ser instalado junto com base-devel).
      </p>

      <AlertBox type="info" title="Qual editor escolher?">
        <strong>nano</strong> é o "bloco de notas" do terminal — todos os atalhos aparecem na tela, você
        digita texto normalmente e pronto. <strong>vim</strong> é um editor modal extremamente poderoso,
        mas com curva de aprendizado íngreme. Para editar um arquivo de configuração rapidamente,{" "}
        <strong>use nano</strong>. Para programar e administrar sistemas no longo prazo, vale aprender vim.
      </AlertBox>

      <h2>1. <code>nano</code> — o editor amigável</h2>

      <p>
        O nano foi criado em 1999 como um clone livre do Pico (do cliente de e-mail Pine). Sua filosofia é
        a oposta do vim: <em>tudo na tela</em>, sem modos, sem atalhos secretos. As duas barras inferiores
        sempre mostram os comandos disponíveis (o símbolo <code>^</code> significa <kbd>Ctrl</kbd>).
      </p>

      <TerminalBlock
        title="Confirmando que o nano está instalado"
        command="nano --version"
        output={` GNU nano, version 7.2
 (C) 1999-2011, 2013-2024 Free Software Foundation, Inc.
 (C) 2014-2024 the contributors to nano
 Compiled options: --enable-utf8`}
      />

      <TerminalBlock
        comment="se faltar (raro), instale com pacman"
        command="sudo pacman -S nano"
        output={`resolving dependencies...
looking for conflicting packages...

Packages (1) nano-7.2-1

Total Installed Size:  2.16 MiB

:: Proceed with installation? [Y/n] y
:: Processing package changes...
(1/1) installing nano                              [######################] 100%
:: Running post-transaction hooks...
(1/1) Arming ConditionNeedsUpdate...`}
      />

      <h3>1.1. Abrindo, criando e fechando arquivos</h3>

      <TerminalBlock
        comment="abre um arquivo existente (ou cria se não existir)"
        command="nano notas.txt"
      />

      <p>
        Ao executar, sua tela inteira é tomada pelo editor. Algo assim aparece:
      </p>

      <OutputBlock
        title="Layout do nano (tela inteira)"
        annotations={[
          { line: 0, note: "Título: versão + nome do arquivo + 'Modified' à direita" },
          { line: 2, note: "Conteúdo do arquivo, cursor representado por _" },
          { line: 16, note: "Barra de atalhos (^ = Ctrl): G=Help, O=salvar, W=buscar, K=recortar" },
          { line: 17, note: "X=sair, R=abrir outro, \\=substituir, U=colar, /=ir p/ linha" },
        ]}
        output={` GNU nano 7.2                                        notas.txt                                        Modified

Comprar pão
Estudar Arch Linux
Configurar fstab
_











^G Help     ^O Write Out  ^W Where Is   ^K Cut        ^T Execute    ^C Location   M-U Undo
^X Exit     ^R Read File  ^\\ Replace    ^U Paste      ^J Justify    ^/ Go To Line M-E Redo`}
      />

      <h3>1.2. Atalhos essenciais (decore estes 8)</h3>

      <CommandFlagList
        command="nano [arquivo]"
        items={[
          { flag: "Ctrl+O", long: "^O Write Out", description: <>Salva o arquivo. Pergunta o nome se for novo. Pressione <kbd>Enter</kbd> para confirmar.</> },
          { flag: "Ctrl+X", long: "^X Exit", description: <>Sai do nano. Se houver mudanças não salvas, pergunta <code>Save modified buffer? (Y/N)</code>.</> },
          { flag: "Ctrl+W", long: "^W Where Is", description: <>Busca um termo no arquivo. <kbd>Alt+W</kbd> repete a próxima ocorrência.</> },
          { flag: "Ctrl+\\", long: "^\\ Replace", description: <>Buscar e substituir. Pergunta o termo, depois a substituição, depois pede confirmação por ocorrência (Y/N/A).</> },
          { flag: "Ctrl+K", long: "^K Cut", description: <>Recorta a linha inteira (vai pro buffer de cola).</> },
          { flag: "Ctrl+U", long: "^U Paste", description: <>Cola o conteúdo recortado (pode colar várias vezes).</> },
          { flag: "Ctrl+/", long: "^/ Go To Line", description: <>Pula para um número de linha específico.</> },
          { flag: "Alt+U / Alt+E", long: "M-U / M-E Undo/Redo", description: <>Desfazer / refazer a última edição.</> },
          { flag: "Ctrl+G", long: "^G Help", description: <>Mostra a tela de ajuda completa com todos os atalhos.</> },
          { flag: "Ctrl+C", long: "^C Location", description: <>Mostra a posição atual do cursor (linha, coluna, byte).</> },
        ]}
      />

      <h3>1.3. Salvando e saindo (o fluxo mais comum)</h3>

      <p>
        Você editou o arquivo, agora quer salvar e sair. Aperte <kbd>Ctrl+O</kbd>:
      </p>

      <OutputBlock
        annotations={[
          { line: 0, note: "Confirma o nome — pressione Enter para manter" },
          { line: 3, note: "Alt+D salva em formato Windows (CRLF)" },
          { line: 4, note: "Alt+M salva em formato Mac antigo (CR)" },
        ]}
        output={`File Name to Write: notas.txt

^G Help                ^T Browse
^C Cancel              M-D DOS Format    M-A Append    M-B Backup File
                       M-M Mac Format    M-P Prepend   M-S Open S/Replay`}
      />

      <p>
        Pressione <kbd>Enter</kbd> para confirmar. A barra de status mostra:
      </p>

      <OutputBlock output={`[ Wrote 3 lines ]`} />

      <p>
        Agora aperte <kbd>Ctrl+X</kbd> para sair. Se você apertar <kbd>Ctrl+X</kbd> sem ter salvo:
      </p>

      <OutputBlock
        annotations={[
          { line: 0, note: "Pergunta se quer salvar antes de sair" },
          { line: 2, note: "Y = salva e sai" },
          { line: 3, note: "N = DESCARTA mudanças (cuidado!); ^C volta ao editor" },
        ]}
        output={`Save modified buffer? (Answering "No" will DISCARD changes.)

 Y Yes
 N No           ^C Cancel`}
      />

      <h3>1.4. Editando arquivos do sistema com <code>sudo</code></h3>

      <p>
        Para editar <code>/etc/pacman.conf</code>, <code>/etc/fstab</code> ou qualquer arquivo do sistema,
        você precisa de privilégios. Existem <strong>duas formas</strong> e cada uma tem implicações:
      </p>

      <TerminalBlock
        comment="Forma simples: roda nano como root"
        command="sudo nano /etc/pacman.conf"
        output={`[sudo] password for joao:`}
      />

      <TerminalBlock
        comment="Forma segura (recomendada): cria cópia em /tmp, abre como você, depois move com privilégio"
        command="sudo EDITOR=nano -e /etc/pacman.conf"
      />

      <p>
        Ou ainda melhor, use o <code>sudoedit</code> (apelido <code>sudo -e</code>), que respeita seu{" "}
        <code>$EDITOR</code> e nunca executa o editor inteiro como root:
      </p>

      <TerminalBlock
        command="export EDITOR=nano"
        output=""
      />

      <TerminalBlock
        command="sudoedit /etc/fstab"
        output={`[sudo] password for joao:`}
        comment="abre o nano normalmente; ao salvar, sudoedit substitui o original"
      />

      <AlertBox type="warning" title="Por que sudoedit é mais seguro?">
        Quando você roda <code>sudo nano arquivo</code>, o nano inteiro executa como root. Se o seu{" "}
        <code>~/.nanorc</code> tiver alguma extensão maliciosa, ela ganha root. Já o <code>sudoedit</code>{" "}
        roda o editor como <strong>seu usuário</strong> (lendo seu nanorc) sobre uma cópia em <code>/tmp</code>;
        só a operação final de gravar usa root.
      </AlertBox>

      <h3>1.5. Configurando o nano (~/.nanorc)</h3>

      <p>
        Por padrão o nano é minimalista. Adicione um <code>~/.nanorc</code> para ligar números de linha,
        syntax highlighting e quebra de linha sensata:
      </p>

      <TerminalBlock
        command="nano ~/.nanorc"
        comment="conteúdo recomendado para edição confortável"
      />

      <TerminalBlock
        title="~/.nanorc — configuração recomendada"
        command="cat ~/.nanorc"
        output={`# Mostrar números de linha à esquerda
set linenumbers

# Destaque do cursor na coluna atual
set cursorpos
set constantshow

# Tabs como 4 espaços
set tabsize 4
set tabstospaces

# Quebrar linhas longas em palavras (não no meio)
set softwrap
set atblanks

# Não criar arquivo~ de backup
unset backup

# Cor da barra de título (Arch teal)
set titlecolor brightwhite,blue

# Habilitar syntax highlighting para todos os arquivos comuns
include "/usr/share/nano/*.nanorc"
include "/usr/share/nano-syntax-highlighting/*.nanorc"  # AUR: extra-syntax`}
      />

      <TerminalBlock
        comment="syntax highlighting extra para mais linguagens (opcional, via AUR)"
        command="yay -S nano-syntax-highlighting"
      />

      <p>
        Para ver todas as opções disponíveis:
      </p>

      <TerminalBlock
        command="man nanorc | head -40"
        output={`NANORC(5)                         File Formats Manual                         NANORC(5)

NAME
       nanorc - GNU nano's configuration file

DESCRIPTION
       The nanorc files contain the default settings for nano, a small and friendly
       text editor.  During startup, if --rcfile is not given, nano will read two
       files: first the system-wide settings, from /etc/nanorc, and then the
       user-specific settings, either from ~/.nanorc or from $XDG_CONFIG_HOME/nano/nanorc.

OPTIONS
       set autoindent
              Automatically indent a newly created line to the same number of tabs
              and/or spaces as the previous line (or as the next line if the previous
              line is the beginning of a paragraph).

       set linenumbers
              Display line numbers to the left of the text area.

       set mouse
              Enable mouse support, if available for your system.`}
      />

      <h3>1.6. Flags úteis na linha de comando</h3>

      <CommandFlagList
        command="nano [opções] arquivo"
        items={[
          { flag: "+N", description: <>Abre o arquivo já posicionado na linha N.</>, example: "nano +120 /etc/pacman.conf" },
          { flag: "-l", long: "--linenumbers", description: <>Mostra números de linha (sem precisar do .nanorc).</>, example: "nano -l script.sh" },
          { flag: "-w", long: "--nowrap", description: <>Desabilita quebra automática (útil pra editar fstab/conf onde uma linha = uma entrada).</>, example: "nano -w /etc/fstab" },
          { flag: "-S", long: "--softwrap", description: <>Quebra visual sem inserir \\n no arquivo.</> },
          { flag: "-Y", long: "--syntax=NOME", description: <>Força destaque de sintaxe específico.</>, example: "nano -Y python script.py" },
          { flag: "-B", long: "--backup", description: <>Cria <code>arquivo~</code> antes de sobrescrever.</> },
          { flag: "-i", long: "--autoindent", description: <>Indentação automática igual à linha anterior.</> },
          { flag: "-m", long: "--mouse", description: <>Habilita o mouse para posicionar o cursor / selecionar.</> },
          { flag: "-T N", long: "--tabsize=N", description: <>Define largura do TAB (geralmente 2, 4 ou 8).</>, example: "nano -T 2 file.yml" },
          { flag: "-r N", long: "--fill=N", description: <>Largura máxima de linha (quebra em N colunas).</> },
          { flag: "-v", long: "--view", description: <>Modo somente-leitura (não permite edição).</> },
        ]}
      />

      <h3>1.7. Selecionar, recortar e colar entre arquivos</h3>

      <p>
        O nano também tem seleção de texto (modo de marcação):
      </p>

      <OutputBlock
        title="Fluxo: copiar bloco e colar em outro arquivo"
        annotations={[
          { line: 1, note: "Alt+A (ou Ctrl+6) inicia a seleção a partir do cursor" },
          { line: 3, note: "Alt+6 sem Shift copia (use Ctrl+K para recortar)" },
          { line: 6, note: "Ctrl+U cola onde estiver o cursor (pode colar várias vezes)" },
        ]}
        output={`1. Posicione o cursor no início do trecho
2. Alt+A             — começa seleção
3. Mova com setas    — destaca conforme avança
4. Alt+6             — copia (sem remover)
5. Ctrl+X → Y → Enter — sai (com aviso de salvar)
6. nano outro.txt    — abre o destino
7. Ctrl+U            — cola o trecho copiado`}
      />

      <h3>1.8. Erros comuns e como resolver</h3>

      <TerminalBlock
        comment="Tentando salvar arquivo do sistema sem privilégio"
        command="nano /etc/hostname"
        exitCode={1}
        output={`[ Error writing /etc/hostname: Permission denied ]
[ File '/etc/hostname' is unwritable ]`}
      />

      <TerminalBlock
        comment="Solução: abra com sudoedit"
        command="sudoedit /etc/hostname"
      />

      <TerminalBlock
        comment="Tela 'Buffer is unwritable' ao editar dentro de um chroot sem TTY"
        command="nano /etc/fstab"
        output={`[ Buffer is too small for the requested action ]`}
      />

      <p>Solução: redefina <code>TERM</code> antes de abrir o nano:</p>

      <TerminalBlock command="export TERM=xterm-256color" output="" />

      <h2>2. <code>vi</code> e <code>vim</code> — sobrevivência mínima</h2>

      <p>
        Mesmo que você prefira nano, vai cair em situações onde só existe vim/vi: dentro de um initramfs,
        em um servidor minimalista, ou ao rodar <code>visudo</code>/<code>crontab -e</code> com{" "}
        <code>$EDITOR</code> não definido. Saber <strong>entrar, escrever uma linha, salvar e sair</strong>{" "}
        é literalmente o suficiente para 90% dos casos.
      </p>

      <TerminalBlock
        command="vim --version | head -3"
        output={`VIM - Vi IMproved 9.1 (2024 Jan 02, compiled Apr 12 2024 04:17:42)
Included patches: 1-348
Compiled by Arch Linux`}
      />

      <h3>2.1. O conceito de modos (a parte que confunde)</h3>

      <p>
        Diferente do nano, o vim tem <strong>modos</strong> — a mesma tecla faz coisas diferentes em cada modo:
      </p>

      <OutputBlock
        annotations={[
          { line: 2, note: "Modo padrão: setas e hjkl movem, dd apaga linha, yy copia" },
          { line: 4, note: "Modo de digitação: tecla i abre, ESC volta" },
          { line: 8, note: "Seleção: tecla v abre, setas estendem, y copia, d corta" },
          { line: 10, note: "Comandos ex: : abre, :w salva, :q sai, :wq salva e sai" },
        ]}
        output={`MODOS DO VIM
============
NORMAL   ←─── (você sempre começa aqui)
  ↓ i / a / o
INSERT   ───→ (digite normalmente; ESC volta para NORMAL)
  ↑ ESC
NORMAL
  ↓ v / V / Ctrl+v
VISUAL   ───→ (seleção; ESC volta)
  ↓ :
COMMAND  ───→ (:w salva, :q sai)`}
      />

      <h3>2.2. O fluxo mínimo: editar e sair</h3>

      <CommandFlagList
        command="vim arquivo"
        items={[
          { flag: "i", description: <>Entra em INSERT mode (você pode digitar texto normalmente).</> },
          { flag: "ESC", description: <>Volta para NORMAL mode (parar de digitar).</> },
          { flag: ":w", description: <>Salva o arquivo (em NORMAL mode).</>, example: ":w" },
          { flag: ":q", description: <>Sai do vim (sem salvar). Erro se houver mudanças não salvas.</>, example: ":q" },
          { flag: ":wq", description: <>Salva E sai. Atalho clássico.</>, example: ":wq" },
          { flag: ":q!", description: <>Sai DESCARTANDO mudanças. Use quando bagunçou tudo.</>, example: ":q!" },
          { flag: ":x", description: <>Igual a :wq mas só salva se houve mudança.</> },
          { flag: "ZZ", description: <>Em NORMAL mode: salva e sai (sem digitar :).</> },
        ]}
      />

      <TerminalBlock
        comment="exemplo prático: criar um script com vim"
        command="vim hello.sh"
      />

      <OutputBlock
        title="Sequência de teclas dentro do vim"
        output={`i                          ← entra em INSERT mode
#!/bin/bash               ← agora você pode digitar
echo "Hello, Arch!"
ESC                        ← volta para NORMAL mode
:wq ENTER                  ← salva e sai`}
      />

      <TerminalBlock
        comment="confirma que salvou"
        command="cat hello.sh"
        output={`#!/bin/bash
echo "Hello, Arch!"`}
      />

      <h3>2.3. Movimentação no NORMAL mode</h3>

      <CommandFlagList
        command="vim — teclas de movimento (NORMAL mode)"
        items={[
          { flag: "h j k l", description: <>Esquerda, baixo, cima, direita (clássico do vi). As setas também funcionam.</> },
          { flag: "w", description: <>Próxima palavra. <code>b</code> = palavra anterior. <code>e</code> = fim da palavra.</> },
          { flag: "0", description: <>Início da linha. <code>$</code> = fim da linha. <code>^</code> = primeiro caractere não-branco.</> },
          { flag: "gg", description: <>Início do arquivo. <code>G</code> = fim do arquivo. <code>5G</code> = linha 5.</> },
          { flag: "/texto", description: <>Busca para frente. <code>?texto</code> = busca para trás. <code>n</code> = próxima, <code>N</code> = anterior.</> },
          { flag: "u", description: <>Desfaz. <code>Ctrl+r</code> = refaz.</> },
          { flag: "dd", description: <>Apaga (e copia) a linha inteira.</> },
          { flag: "yy", description: <>Copia (yank) a linha. <code>p</code> cola depois, <code>P</code> cola antes.</> },
          { flag: "x", description: <>Apaga o caractere sob o cursor.</> },
          { flag: ":N", description: <>Pula para a linha N.</>, example: ":42" },
        ]}
      />

      <h3>2.4. Configurando o vim (~/.vimrc)</h3>

      <TerminalBlock
        title="~/.vimrc mínimo recomendado"
        command="cat ~/.vimrc"
        output={`" Sintaxe e cores
syntax on
colorscheme habamax

" Números de linha (absoluto + relativo = híbrido)
set number
set relativenumber

" Indentação
set tabstop=4
set shiftwidth=4
set expandtab
set autoindent
set smartindent

" Busca
set ignorecase
set smartcase
set incsearch
set hlsearch

" Interface
set cursorline
set showmatch
set ruler
set wildmenu

" Sem arquivos .swp espalhados
set noswapfile
set nobackup`}
      />

      <h2>3. Comparação direta: nano vs vim</h2>

      <OutputBlock
        title="Tabela de decisão"
        output={`┌─────────────────────────────┬───────────────┬───────────────┐
│ Tarefa                      │ nano          │ vim           │
├─────────────────────────────┼───────────────┼───────────────┤
│ Editar 5 linhas de fstab    │ ★★★★★         │ ★★★           │
│ Programar Python/Rust       │ ★★            │ ★★★★★         │
│ Curva de aprendizado        │ 5 minutos     │ semanas       │
│ Sempre instalado            │ Sim (pacstrap)│ Quase sempre  │
│ Atalhos visíveis na tela    │ Sim           │ Não           │
│ Modos                       │ Não           │ Sim (4)       │
│ Macros e regex              │ Limitado      │ Avançado      │
│ Recomendado para iniciante  │ ✓             │ —             │
│ Recomendado para sysadmin   │ ✓ (rápido)    │ ✓ (poder)     │
└─────────────────────────────┴───────────────┴───────────────┘`}
      />

      <h2>4. Definindo seu editor padrão (<code>$EDITOR</code>)</h2>

      <p>
        Vários comandos do sistema (<code>visudo</code>, <code>crontab -e</code>, <code>git commit</code>,{" "}
        <code>systemctl edit</code>) abrem <strong>algum</strong> editor — qual? O que estiver em{" "}
        <code>$EDITOR</code> ou <code>$VISUAL</code>. Se você não definir, costuma cair no vi por padrão
        (susto garantido para iniciantes).
      </p>

      <TerminalBlock
        comment="ver editor atual"
        command='echo "EDITOR=$EDITOR  VISUAL=$VISUAL"'
        output={`EDITOR=  VISUAL=`}
      />

      <TerminalBlock
        comment="defina nano como padrão (adicione no ~/.bashrc para persistir)"
        command={`cat >> ~/.bashrc << 'EOF'
export EDITOR=nano
export VISUAL=nano
EOF`}
      />

      <TerminalBlock
        comment="aplique na sessão atual"
        command="source ~/.bashrc && echo $EDITOR"
        output={`nano`}
      />

      <TerminalBlock
        comment="agora visudo abrirá no nano"
        command="sudo visudo"
        output={`[sudo] password for joao:
 GNU nano 7.2                /etc/sudoers.tmp                Modified

#
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
#
...`}
      />

      <AlertBox type="danger" title="Editou /etc/sudoers errado e travou o sudo?">
        Se um <code>sudoers</code> mal-formado bloquear o sudo, você pode reverter com{" "}
        <code>pkexec visudo</code> (se tiver polkit) ou rebootando em modo single-user e editando como
        root. Por isso <strong>SEMPRE</strong> use <code>visudo</code> (não <code>nano /etc/sudoers</code>{" "}
        direto): ele valida a sintaxe antes de salvar.
      </AlertBox>

      <h2>5. Resumo prático — colinha de bolso</h2>

      <OutputBlock
        title="O que você precisa lembrar amanhã"
        output={`# nano — fluxo padrão
nano arquivo              # abrir
(digite)                  # editar normalmente
Ctrl+O Enter              # salvar
Ctrl+X                    # sair

# nano — privilégios
sudoedit /etc/fstab       # editar arquivo do sistema (forma segura)
sudo nano /etc/pacman.conf# alternativa rápida (menos segura)

# vim — sobrevivência mínima
vim arquivo               # abrir
i                         # entrar em INSERT
(digite)                  # editar
ESC                       # voltar para NORMAL
:wq                       # salvar e sair
:q!                       # sair SEM salvar

# definir editor padrão (no ~/.bashrc)
export EDITOR=nano
export VISUAL=nano`}
      />
    </PageContainer>
  );
}
