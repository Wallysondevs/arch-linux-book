import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Navegacao() {
  return (
    <PageContainer
      title="Navegação no Terminal"
      subtitle="Movendo-se pelo sistema de arquivos com ls, cd, pwd, find, tree e muito mais — o básico que você vai usar todos os dias."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        O terminal pode parecer intimidador no começo, mas a navegação pelo sistema de arquivos
        do Linux segue uma lógica simples e consistente. Com poucos comandos, você se moverá
        pelo sistema com mais velocidade do que com qualquer interface gráfica.
      </p>

      <AlertBox type="info" title="Como ler os comandos deste guia">
        Ao longo deste guia, você verá letras após um <code>-</code> (traço). Essas são as
        <strong> flags</strong> — opções que mudam o comportamento de um comando.
        Exemplo: <code>ls -l</code> — o <code>ls</code> é o comando, o <code>-l</code> é a flag
        que pede a listagem detalhada. Flags curtas (uma letra) usam <code>-</code>.
        Flags longas (palavra) usam <code>--</code> (dois traços), ex: <code>--help</code>.
        Múltiplas flags curtas podem ser combinadas: <code>-lah</code> = <code>-l -a -h</code>.
      </AlertBox>

      <h2>pwd — Onde Estou?</h2>
      <CodeBlock
        title="Print Working Directory — mostrar o diretório atual"
        code={`pwd
# /home/joao
# pwd = Print Working Directory (imprimir o diretório de trabalho atual)

# O "~" no prompt representa seu diretório home (/home/seu-usuario)
# joao@ubuntu:~$       ← você está em /home/joao  (o ~ é atalho para home)
# joao@ubuntu:~$ cd /etc
# joao@ubuntu:/etc$    ← você está em /etc`}
      />

      <h2>ls — Listar Conteúdo do Diretório</h2>
      <CodeBlock
        title="Todas as flags do ls explicadas"
        code={`# Listar o diretório atual (apenas nomes)
ls

# -l = long format (formato longo com detalhes)
# Mostra: permissões, links, dono, grupo, tamanho, data e nome
ls -l

# -a = all (todos os arquivos)
# Inclui arquivos ocultos (os que começam com . como .bashrc, .ssh)
ls -a

# -h = human readable (legível por humanos)
# Mostra tamanhos em KB, MB, GB em vez de bytes brutos (ex: 4,0K em vez de 4096)
ls -h

# -S = Sort by Size (ordenar por tamanho, maior primeiro)
ls -S

# -t = sort by Time (ordenar por data de modificação, mais recente primeiro)
ls -t

# -r = reverse (inverter a ordem da listagem)
ls -r

# -R = Recursive (listar recursivamente todos os subdiretórios)
ls -R

# === COMBINAÇÕES MAIS USADAS ===

# -la = detalhes + arquivos ocultos (muito comum)
ls -la

# -lah = detalhes + ocultos + tamanhos legíveis (a combinação mais popular)
ls -lah

# Saída de ls -lah:
# total 44K
# drwxr-x--- 12 joao joao 4,0K mar 27 10:00 .
# drwxr-xr-x  3 root root 4,0K mar 26 09:15 ..
# -rw-r--r--  1 joao joao  220 mar 26 09:15 .bash_logout
# -rw-r--r--  1 joao joao 3,5K mar 26 09:15 .bashrc
# drwxr-xr-x  2 joao joao 4,0K mar 27 09:00 Downloads
# ^           ^ ^    ^    ^    ^              ^
# permissões  links  user  group tamanho data  nome

# -lhS = detalhes + legível + ordenado por tamanho (para encontrar arquivos grandes)
ls -lhS

# -lht = detalhes + legível + ordenado por data (mais recente primeiro)
ls -lht

# Listar um diretório específico (sem precisar navegar até lá)
ls /etc
ls -la /var/log

# -F = classify (classificar com símbolos no final do nome)
# / = diretório  |  * = executável  |  @ = link simbólico
ls -F`}
      />

      <h2>cd — Mudar de Diretório</h2>
      <CodeBlock
        title="Navegando pelos diretórios"
        code={`# Ir para o diretório home do usuário atual
cd         # sem argumentos = vai para home
cd ~       # ~ é o atalho para /home/seu-usuario
cd /home/joao  # o caminho completo (absoluto)

# Ir para um diretório usando caminho absoluto (começa com /)
cd /etc
cd /var/log
cd /usr/local/bin

# Ir para um subdiretório usando caminho relativo (sem /)
# Relativo = em relação ao diretório atual
cd Downloads               # pasta Downloads dentro do diretório atual
cd Documents/Projetos      # subpasta dentro de Documents

# Voltar um nível (ir para o diretório pai)
cd ..       # .. = diretório pai (um nível acima)

# Voltar dois níveis
cd ../..    # pai do pai

# Voltar para o diretório em que você estava antes (histórico de um passo)
cd -        # muito útil para alternar entre dois diretórios

# Exemplo de uso do cd -:
cd /etc/ssh    # vai para /etc/ssh
cd /var/log    # vai para /var/log
cd -           # volta para /etc/ssh   ← prático!

# Dica essencial: use Tab para autocompletar!
# Digite "cd /etc/ss" e pressione Tab → completa para "cd /etc/ssh/"
# Se houver mais de uma opção, pressione Tab duas vezes para ver todas.`}
      />

      <h2>find — Encontrar Arquivos e Diretórios</h2>
      <CodeBlock
        title="find: busca com flags explicadas"
        code={`# Estrutura: find [onde buscar] [critérios] [ação]

# -name = filtrar por nome exato (sensível a maiúsculas/minúsculas)
find /home -name "arquivo.txt"

# -iname = filtrar por nome (insensível a maiúsculas/minúsculas)
# i = case insensitive
find /home -iname "foto*.jpg"

# -name com curinga * (qualquer sequência de caracteres)
find /home -name "*.pdf"     # todos os arquivos .pdf

# -type = filtrar pelo tipo
# -type f = file (arquivos regulares)
# -type d = directory (diretórios)
# -type l = link (links simbólicos)
find /etc -type f            # apenas arquivos
find /etc -type d            # apenas diretórios

# -mtime = modified time (tempo de modificação)
# -mtime -1 = modificados nas ÚLTIMAS 24 horas (o - significa "menos de")
# -mtime +7 = modificados há MAIS de 7 dias (o + significa "mais de")
find /home -mtime -1         # modificados hoje
find /var/log -mtime +30     # logs com mais de 30 dias

# -size = filtrar por tamanho
# + = maior que   |   - = menor que
# c = bytes | k = kilobytes | M = megabytes | G = gigabytes
find /var -size +100M        # arquivos maiores que 100MB
find /tmp -size -1k          # arquivos menores que 1KB

# -user = filtrar por dono do arquivo
find / -user joao            # todos os arquivos do usuário joao

# -exec = executar um comando para cada resultado
# {} = onde o nome do arquivo encontrado será inserido
# \; = marca o fim do comando que será executado
find /home -name "*.log" -exec rm {} \;
# Para cada .log encontrado, executa: rm [nome-do-arquivo]

# -not = inverter critério (encontrar o oposto)
find /etc -name "*.conf" -not -name "*.bak"
# Arquivos .conf que NÃO sejam .bak`}
      />

      <h2>tree — Visualizar em Árvore</h2>
      <CodeBlock
        title="tree: visualização hierárquica"
        code={`# Instalar (não vem por padrão):
sudo apt install tree

# Ver estrutura do diretório atual
tree

# -L = Level (nível máximo de profundidade)
tree -L 2    # ver apenas 2 níveis de subdiretórios

# -a = all (incluir arquivos ocultos que começam com .)
tree -a

# -s = size (mostrar tamanho dos arquivos)
# -h = human readable (tamanhos em KB, MB — combinado com -s)
tree -sh

# -d = directories only (mostrar apenas diretórios, sem arquivos)
tree -d

# Ver um diretório específico
tree /etc/ssh

# Saída:
# /etc/ssh
# ├── moduli
# ├── ssh_config
# ├── ssh_config.d
# │   └── 50-systemd-user.conf
# └── sshd_config`}
      />

      <h2>which e whereis — Localizar Programas</h2>
      <CodeBlock
        title="Encontrar onde estão os executáveis"
        code={`# which = mostra o caminho completo de um comando no PATH
which python3
# /usr/bin/python3

which git
# /usr/bin/git

# whereis = localiza o binário, o manual e o código-fonte de um comando
whereis python3
# python3: /usr/bin/python3 /usr/lib/python3 /usr/share/man/man1/python3.1.gz
#           ^executável       ^bibliotecas     ^manual

# type = mostra como o shell interpreta um comando
type ls
# ls is aliased to 'ls --color=auto'   ← é um alias (apelido)

type cd
# cd is a shell builtin               ← comando interno do próprio shell

type which
# which is /usr/bin/which              ← é um executável externo`}
      />

      <h2>Caminhos Absolutos vs Relativos</h2>
      <AlertBox type="info" title="Entendendo caminhos — conceito fundamental">
        <ul className="mt-1 mb-0">
          <li><strong>Caminho absoluto</strong>: Começa com <code>/</code>. Ex: <code>/home/joao/Downloads</code>. Funciona de qualquer lugar no sistema.</li>
          <li><strong>Caminho relativo</strong>: Não começa com <code>/</code>. Ex: <code>Downloads</code> ou <code>../etc</code>. É relativo ao diretório em que você está agora.</li>
          <li><code>.</code> (ponto simples) = o diretório atual</li>
          <li><code>..</code> (dois pontos) = diretório pai (um nível acima)</li>
          <li><code>~</code> (til) = diretório home do usuário atual (<code>/home/seu-usuario</code>)</li>
        </ul>
      </AlertBox>

      <h2>Atalhos de Teclado no Terminal</h2>
      <CodeBlock
        title="Atalhos essenciais para produtividade"
        code={`Ctrl + C      # Cancelar/interromper o comando em execução
Ctrl + Z      # Pausar processo e mandá-lo para background
Ctrl + D      # Fechar o terminal (ou encerrar entrada de texto com EOF)
Ctrl + L      # Limpar a tela (equivale ao comando "clear")
Ctrl + A      # Mover cursor para o INÍCIO da linha
Ctrl + E      # Mover cursor para o FIM da linha
Ctrl + U      # Apagar tudo ANTES do cursor (do início até o cursor)
Ctrl + K      # Apagar tudo DEPOIS do cursor (do cursor até o fim)
Ctrl + W      # Apagar a palavra anterior (antes do cursor)
Ctrl + R      # Pesquisar no histórico de comandos (reverse search)
Alt + .       # Inserir o último ARGUMENTO do comando anterior
Tab           # Autocompletar nome de arquivo, diretório ou comando
Tab Tab       # Mostrar TODAS as possibilidades de autocomplete
↑ / ↓         # Navegar pelo histórico de comandos`}
      />

      <h2>Histórico de Comandos</h2>
      <CodeBlock
        title="Reutilizando comandos do histórico"
        code={`# Ver histórico completo de comandos
history
# Mostra uma lista numerada de todos os comandos anteriores

# Ver apenas os últimos N comandos
history 20    # Ver os últimos 20

# Executar o comando de número específico do histórico
!42           # Executa exatamente o que estava na linha 42 do history

# Executar o último comando que COMEÇOU com "apt"
!apt

# Repetir o último comando executado
!!

# Pesquisar no histórico interativamente (muito útil!):
# Pressione Ctrl+R e comece a digitar qualquer parte do comando
# (reverse-i-search)\`apt': sudo apt update
# Continue pressionando Ctrl+R para ver resultados anteriores

# Limpar o histórico (apaga todos os comandos salvos)
history -c`}
      />
    </PageContainer>
  );
}
