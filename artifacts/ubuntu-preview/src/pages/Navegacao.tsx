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

      <h2>pwd — Onde Estou?</h2>
      <CodeBlock
        title="Print Working Directory"
        code={`pwd
# /home/joao

# O "~" no prompt representa seu diretório home
# joao@ubuntu:~$       ← você está em /home/joao
# joao@ubuntu:~$ cd /etc
# joao@ubuntu:/etc$    ← você está em /etc`}
      />

      <h2>ls — Listar Conteúdo</h2>
      <CodeBlock
        title="Listando arquivos e diretórios"
        code={`# Listar o diretório atual
ls

# Listar com detalhes (permissões, tamanho, data)
ls -l

# Listar incluindo arquivos ocultos (começam com .)
ls -a

# Combinação mais usada: detalhes + ocultos + legível
ls -lah

# Saída de ls -lah:
# total 44K
# drwxr-x--- 12 joao joao 4,0K mar 27 10:00 .
# drwxr-xr-x  3 root root 4,0K mar 26 09:15 ..
# -rw-r--r--  1 joao joao  220 mar 26 09:15 .bash_logout
# -rw-r--r--  1 joao joao 3,5K mar 26 09:15 .bashrc
# drwxr-xr-x  2 joao joao 4,0K mar 27 09:00 Downloads
# drwxr-xr-x  2 joao joao 4,0K mar 27 08:00 Documents
# ^           ^ ^    ^    ^    ^              ^
# permissões  links  user  group tamanho data  nome

# Listar um diretório específico
ls /etc
ls -la /var/log

# Listar ordenado por tamanho (maior primeiro)
ls -lhS

# Listar ordenado por data de modificação (mais recente primeiro)
ls -lht

# Listar com ícones de tipo de arquivo
ls -F
# / = diretório
# * = executável
# @ = link simbólico

# Listar recursivamente (todos os subdiretórios)
ls -R`}
      />

      <h2>cd — Mudar de Diretório</h2>
      <CodeBlock
        title="Navegando pelos diretórios"
        code={`# Ir para o diretório home do usuário atual (~)
cd
cd ~
cd /home/joao

# Ir para um diretório específico (caminho absoluto)
cd /etc
cd /var/log
cd /usr/local/bin

# Ir para um subdiretório (caminho relativo)
cd Downloads
cd Documents/Projetos

# Voltar um nível (diretório pai)
cd ..

# Voltar dois níveis
cd ../..

# Voltar para o diretório anterior (histórico)
cd -
# /etc  ← mostra para onde voltou

# Atalhos úteis:
cd ~/Downloads    # Pasta Downloads do seu usuário
cd ~joao          # Pasta home do usuário "joao"

# Dica: use TAB para autocompletar nomes de diretórios!
cd /etc/ssh/  # Digite "cd /etc/ss" e aperte Tab`}
      />

      <h2>find — Encontrar Arquivos</h2>
      <CodeBlock
        title="Buscando arquivos no sistema"
        code={`# Encontrar por nome (exato)
find /home -name "arquivo.txt"

# Encontrar por nome (com curinga)
find /home -name "*.pdf"
find /home -name "*.log"

# Busca sem diferenciar maiúsculas/minúsculas
find /home -iname "foto*.jpg"

# Encontrar apenas diretórios
find /etc -type d

# Encontrar apenas arquivos regulares
find /var/log -type f

# Encontrar arquivos modificados nas últimas 24 horas
find /home -mtime -1

# Encontrar arquivos maiores que 100MB
find /var -size +100M

# Encontrar arquivos menores que 1KB
find /tmp -size -1k

# Encontrar e executar um comando em cada resultado
find /home -name "*.log" -exec rm {} \;

# Encontrar arquivos de um usuário específico
find / -user joao

# Encontrar arquivos com permissão específica
find /etc -perm 644

# Buscar em múltiplos diretórios
find /var/log /tmp -name "*.log"

# Excluir um diretório da busca:
find / -name "*.conf" -not -path "*/proc/*"`}
      />

      <h2>tree — Visualizar em Árvore</h2>
      <CodeBlock
        title="Visualização em formato de árvore"
        code={`# Instalar (não vem por padrão)
sudo apt install tree

# Ver estrutura do diretório atual
tree

# Ver apenas 2 níveis de profundidade
tree -L 2

# Ver arquivos ocultos também
tree -a

# Ver com tamanhos dos arquivos
tree -sh

# Ver apenas diretórios (sem arquivos)
tree -d

# Ver um diretório específico
tree /etc/ssh

# Exemplo de saída:
# /etc/ssh
# ├── moduli
# ├── ssh_config
# ├── ssh_config.d
# │   └── 50-systemd-user.conf
# ├── sshd_config
# └── sshd_config.d
#     └── 50-cloud-init.conf`}
      />

      <h2>which e whereis — Localizar Programas</h2>
      <CodeBlock
        title="Encontrar onde estão os executáveis"
        code={`# Encontrar o caminho completo de um comando
which python3
# /usr/bin/python3

which git
# /usr/bin/git

# Encontrar também o manual e código-fonte
whereis python3
# python3: /usr/bin/python3 /usr/lib/python3 /usr/share/man/man1/python3.1.gz

# Ver tipo de um comando
type ls
# ls is aliased to 'ls --color=auto'   ← alias

type cd
# cd is a shell builtin               ← comando interno do shell

type which
# which is /usr/bin/which              ← executável externo`}
      />

      <h2>Caminhos Absolutos vs Relativos</h2>
      <AlertBox type="info" title="Entendendo caminhos">
        <ul className="mt-1 mb-0">
          <li><strong>Caminho absoluto</strong>: Começa com <code>/</code>. Ex: <code>/home/joao/Downloads</code>. Funciona de qualquer lugar.</li>
          <li><strong>Caminho relativo</strong>: Não começa com <code>/</code>. Ex: <code>Downloads</code> ou <code>../etc</code>. Relativo ao diretório atual.</li>
          <li><code>.</code> = diretório atual</li>
          <li><code>..</code> = diretório pai (um nível acima)</li>
          <li><code>~</code> = diretório home do usuário atual</li>
        </ul>
      </AlertBox>

      <h2>Atalhos de Teclado no Terminal</h2>
      <CodeBlock
        title="Aumentar a produtividade no terminal"
        code={`Ctrl + C      # Cancelar o comando em execução
Ctrl + Z      # Pausar processo (coloca em background)
Ctrl + D      # Fechar o terminal (ou encerrar entrada de texto)
Ctrl + L      # Limpar a tela (equivale ao comando "clear")
Ctrl + A      # Ir para o início da linha
Ctrl + E      # Ir para o fim da linha
Ctrl + U      # Apagar tudo antes do cursor
Ctrl + K      # Apagar tudo depois do cursor
Ctrl + W      # Apagar a palavra anterior
Ctrl + R      # Pesquisar no histórico de comandos
Alt + .       # Inserir o último argumento do comando anterior
Tab           # Autocompletar nome de arquivo/diretório/comando
Tab Tab       # Mostrar todas as possibilidades de autocomplete
↑ / ↓         # Navegar pelo histórico de comandos`}
      />

      <h2>História de Comandos</h2>
      <CodeBlock
        title="Reutilizando comandos anteriores"
        code={`# Ver histórico completo de comandos
history

# Ver os últimos 20 comandos
history 20

# Executar o comando de número 42 do histórico
!42

# Executar o último comando que começou com "apt"
!apt

# Repetir o último comando
!!

# Pesquisar no histórico (Ctrl+R):
# Pressione Ctrl+R e comece a digitar
# (reverse-i-search)\`apt': sudo apt update

# Limpar histórico
history -c`}
      />
    </PageContainer>
  );
}
