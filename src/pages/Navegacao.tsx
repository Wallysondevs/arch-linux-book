import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Navegacao() {
  return (
    <PageContainer
      title="Navegação no Terminal"
      subtitle="Domine os comandos essenciais para se mover pelo sistema de arquivos do Linux: cd, ls, pwd, tree, find e locate."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <p>
        Navegar pelo sistema de arquivos é a habilidade mais fundamental que você precisa dominar no Linux.
        Diferente de um gerenciador de arquivos gráfico, no terminal você se move entre diretórios usando
        comandos de texto. Pode parecer intimidador no começo, mas rapidamente se torna muito mais rápido
        e poderoso do que clicar em pastas.
      </p>

      <h2>1. pwd — Onde eu estou?</h2>
      <p>
        O comando <code>pwd</code> (Print Working Directory) mostra o caminho absoluto do diretório
        em que você está neste momento. É o primeiro comando que você deve aprender — ele é seu GPS no terminal.
      </p>

      <CodeBlock
        title="Exibir o diretório atual"
        code={`pwd
# Saída: /home/usuario`}
      />

      <h3>Flags importantes do pwd</h3>
      <CodeBlock
        title="pwd -L vs pwd -P"
        code={`# -L (padrão): Mostra o caminho lógico (segue links simbólicos)
pwd -L

# -P: Mostra o caminho físico real (resolve links simbólicos)
pwd -P

# Exemplo prático:
# Se /home/usuario/projetos é um link simbólico para /mnt/ssd/projetos
cd /home/usuario/projetos
pwd -L   # /home/usuario/projetos  (caminho do link)
pwd -P   # /mnt/ssd/projetos      (caminho real no disco)`}
      />

      <AlertBox type="info" title="Quando usar pwd -P?">
        Use <code>pwd -P</code> quando precisar saber onde os arquivos realmente estão no disco,
        por exemplo ao verificar pontos de montagem ou debugar problemas de espaço em disco.
      </AlertBox>

      <h2>2. cd — Mudando de diretório</h2>
      <p>
        O comando <code>cd</code> (Change Directory) é como você se move entre pastas.
        Ele aceita caminhos absolutos (começando com <code>/</code>) e caminhos relativos
        (a partir de onde você está).
      </p>

      <h3>Caminhos absolutos vs relativos</h3>
      <CodeBlock
        title="Entendendo caminhos"
        code={`# Caminho ABSOLUTO: Começa sempre com /
# É como dar o endereço completo de uma casa
cd /etc/pacman.d
cd /home/usuario/Documentos
cd /var/log

# Caminho RELATIVO: Parte do diretório atual
# É como dar direções a partir de onde você está
cd Documentos        # entra na pasta Documentos (dentro do diretório atual)
cd projetos/web      # entra em projetos, depois em web
cd ../               # volta um nível (diretório pai)`}
      />

      <h3>Atalhos essenciais do cd</h3>
      <CodeBlock
        title="Atalhos que vão salvar seu tempo"
        code={`# Ir para o diretório home do usuário (3 formas)
cd
cd ~
cd $HOME

# Voltar ao diretório anterior (como o botão "voltar" do navegador)
cd -
# Exemplo:
cd /etc          # vai para /etc
cd /var/log      # vai para /var/log
cd -             # volta para /etc
cd -             # volta para /var/log

# Subir um nível (diretório pai)
cd ..

# Subir dois níveis
cd ../..

# Subir um nível e entrar em outro diretório
cd ../outro-diretorio

# Ir para o home de outro usuário
cd ~root         # vai para /root
cd ~joao         # vai para /home/joao`}
      />

      <AlertBox type="warning" title="O que NÃO fazer com cd">
        <ul>
          <li>Não tente <code>cd</code> para um arquivo — cd só funciona com diretórios.</li>
          <li>Não confunda <code>cd /home</code> (absoluto) com <code>cd home</code> (relativo).</li>
          <li>Não esqueça que nomes com espaço precisam de aspas: <code>cd "Meus Documentos"</code> ou escape: <code>cd Meus\ Documentos</code>.</li>
        </ul>
      </AlertBox>

      <h2>3. ls — Listando arquivos e diretórios</h2>
      <p>
        O <code>ls</code> (List) é provavelmente o comando que você mais vai usar no dia a dia.
        Ele lista o conteúdo de diretórios. Sozinho já é útil, mas com flags se torna extremamente poderoso.
      </p>

      <h3>Uso básico</h3>
      <CodeBlock
        title="ls simples"
        code={`# Listar conteúdo do diretório atual
ls

# Listar conteúdo de um diretório específico
ls /etc
ls ~/Documentos

# Listar múltiplos diretórios
ls /etc /var /tmp`}
      />

      <h3>Flags essenciais do ls</h3>
      <CodeBlock
        title="As flags que você PRECISA saber"
        code={`# -l: Formato longo (detalhes completos)
# Mostra permissões, dono, grupo, tamanho, data e nome
ls -l
# drwxr-xr-x  2 usuario usuario 4096 jan 15 10:30 Documentos
# -rw-r--r--  1 usuario usuario  234 jan 14 09:15 notas.txt

# -a: Mostra arquivos ocultos (começam com .)
ls -a
# .  ..  .bashrc  .config  Documentos  notas.txt

# -la: Combinação mais usada — detalhes + ocultos
ls -la

# -lh: Formato longo com tamanhos legíveis (K, M, G em vez de bytes)
ls -lh
# -rw-r--r--  1 usuario usuario 2.3M jan 14 09:15 video.mp4
# -rw-r--r--  1 usuario usuario  234 jan 14 09:15 notas.txt

# -R: Recursivo — lista subdiretórios também
ls -R
ls -lR /etc/pacman.d

# -S: Ordena por tamanho (maior primeiro)
ls -lhS

# -t: Ordena por data de modificação (mais recente primeiro)
ls -lt

# --color=auto: Habilita cores (diretórios em azul, executáveis em verde, etc)
ls --color=auto`}
      />

      <h3>Combinando flags como um profissional</h3>
      <CodeBlock
        title="Combinações úteis no dia a dia"
        code={`# Ver tudo com detalhes e tamanhos legíveis (a mais usada de todas)
ls -lah

# Os 10 maiores arquivos do diretório
ls -lhS | head -10

# Arquivos modificados recentemente com detalhes
ls -lht

# Listar apenas diretórios
ls -d */

# Listar apenas arquivos .conf
ls -la *.conf

# Contar quantos arquivos existem no diretório
ls -1 | wc -l

# Listar com indicadores de tipo (/ para diretórios, * para executáveis)
ls -F`}
      />

      <AlertBox type="danger" title="O que NÃO fazer com ls">
        <ul>
          <li>Nunca use <code>ls</code> em scripts para processar nomes de arquivos — use <code>find</code> ou globs. Nomes com espaços ou caracteres especiais quebram o parsing do ls.</li>
          <li>Não confie cegamente em <code>ls</code> sem <code>-a</code> — arquivos ocultos podem estar ocupando espaço sem você ver.</li>
        </ul>
      </AlertBox>

      <h2>4. tree — Visualização em árvore</h2>
      <p>
        O <code>tree</code> mostra a estrutura de diretórios de forma visual, como uma árvore.
        É excelente para entender a organização de um projeto.
      </p>

      <CodeBlock
        title="Instalando o tree (não vem instalado por padrão)"
        code={`sudo pacman -S tree`}
      />

      <CodeBlock
        title="Usando o tree"
        code={`# Mostrar árvore do diretório atual
tree

# Limitar a profundidade (muito útil para diretórios grandes)
tree -L 1    # apenas 1 nível
tree -L 2    # até 2 níveis
tree -L 3    # até 3 níveis

# Mostrar apenas diretórios (sem arquivos)
tree -d

# Mostrar diretórios até 2 níveis
tree -d -L 2

# Mostrar tamanho dos arquivos
tree -h

# Mostrar arquivos ocultos
tree -a

# Ignorar certos padrões
tree -I "node_modules|.git|__pycache__"

# Mostrar com cores (padrão no Arch)
tree -C

# Combinação útil para documentar estrutura de projeto
tree -L 3 -I "node_modules|.git" --dirsfirst`}
      />

      <AlertBox type="success" title="Dica profissional">
        Use <code>tree -L 2 --dirsfirst</code> na raiz de qualquer projeto novo para entender
        rapidamente como ele está organizado. É muito mais rápido do que navegar pasta por pasta.
      </AlertBox>

      <h2>5. find — Busca poderosa de arquivos</h2>
      <p>
        O <code>find</code> é o canivete suíço para buscar arquivos. Ele percorre toda a árvore de
        diretórios e pode filtrar por nome, tipo, tamanho, data, permissões e muito mais.
        Diferente do <code>ls</code>, ele busca recursivamente por padrão.
      </p>

      <h3>Sintaxe básica</h3>
      <CodeBlock
        title="Estrutura do find"
        code={`# Sintaxe: find [onde-buscar] [critérios] [ação]
find /home/usuario -name "*.txt"
#     ^^^^^^^^^^^^  ^^^^^^^^^^^^^
#     onde buscar    critério`}
      />

      <h3>Busca por nome</h3>
      <CodeBlock
        title="Encontrando arquivos por nome"
        code={`# Buscar por nome exato (case sensitive)
find /etc -name "pacman.conf"

# Buscar ignorando maiúsculas/minúsculas
find /home -iname "readme.md"

# Buscar com wildcard (padrão glob)
find . -name "*.log"
find . -name "*.txt"
find /etc -name "*.conf"

# Buscar arquivos que começam com um prefixo
find . -name "config*"`}
      />

      <h3>Busca por tipo</h3>
      <CodeBlock
        title="Filtrando por tipo de arquivo"
        code={`# -type f: apenas arquivos regulares
find /var/log -type f -name "*.log"

# -type d: apenas diretórios
find /home -type d -name "projetos"

# -type l: apenas links simbólicos
find /usr/bin -type l

# Combinar: encontrar diretórios vazios
find . -type d -empty

# Encontrar arquivos vazios
find . -type f -empty`}
      />

      <h3>Busca por tamanho</h3>
      <CodeBlock
        title="Filtrando por tamanho"
        code={`# Arquivos maiores que 100MB
find / -type f -size +100M

# Arquivos menores que 1KB
find . -type f -size -1k

# Arquivos de exatamente 0 bytes (vazios)
find . -type f -size 0

# Arquivos entre 10MB e 100MB
find . -type f -size +10M -size -100M

# Unidades: c (bytes), k (kilobytes), M (megabytes), G (gigabytes)`}
      />

      <h3>Busca por data de modificação</h3>
      <CodeBlock
        title="Filtrando por tempo"
        code={`# Arquivos modificados nos últimos 7 dias
find . -type f -mtime -7

# Arquivos modificados há mais de 30 dias
find . -type f -mtime +30

# Arquivos modificados nas últimas 2 horas
find . -type f -mmin -120

# Arquivos acessados nos últimos 3 dias
find . -type f -atime -3`}
      />

      <h3>Executando ações com -exec</h3>
      <CodeBlock
        title="O poder do -exec"
        code={`# Deletar todos os arquivos .tmp
find /tmp -type f -name "*.tmp" -exec rm {} \\;

# Mudar permissões de todos os scripts
find . -type f -name "*.sh" -exec chmod +x {} \\;

# Listar detalhes de arquivos grandes
find / -type f -size +500M -exec ls -lh {} \\;

# Buscar conteúdo dentro de arquivos encontrados
find . -name "*.conf" -exec grep -l "password" {} \\;

# Usando + em vez de \\; (mais eficiente, passa múltiplos arquivos de uma vez)
find . -name "*.log" -exec rm {} +`}
      />

      <AlertBox type="danger" title="Cuidado com find + rm">
        Sempre teste seu comando <code>find</code> SEM o <code>-exec rm</code> primeiro para ver
        quais arquivos serão encontrados. Um critério errado pode deletar arquivos importantes.
        Use <code>find ... -exec rm -i</code> para confirmar cada exclusão.
      </AlertBox>

      <h2>6. locate — Busca instantânea</h2>
      <p>
        O <code>locate</code> é muito mais rápido que o <code>find</code> porque ele não percorre
        o sistema de arquivos em tempo real — ele consulta um banco de dados indexado. A desvantagem
        é que o banco precisa ser atualizado periodicamente.
      </p>

      <CodeBlock
        title="Instalando o locate no Arch"
        code={`# O locate faz parte do pacote mlocate (ou plocate, mais moderno)
sudo pacman -S plocate

# Criar o banco de dados pela primeira vez (OBRIGATÓRIO antes do primeiro uso)
sudo updatedb`}
      />

      <CodeBlock
        title="Usando o locate"
        code={`# Busca simples
locate pacman.conf

# Ignorar maiúsculas/minúsculas
locate -i readme

# Limitar número de resultados
locate -l 10 "*.conf"

# Contar quantos resultados existem
locate -c ".log"

# Mostrar apenas arquivos que ainda existem (verificar no disco)
locate -e "bashrc"

# Usar regex
locate -r "/etc/.*\\.conf$"`}
      />

      <AlertBox type="warning" title="O banco de dados fica desatualizado!">
        O <code>locate</code> não encontra arquivos criados depois do último <code>updatedb</code>.
        Se você criou um arquivo agora e quer encontrá-lo, rode <code>sudo updatedb</code> primeiro
        ou use <code>find</code> que busca em tempo real.
      </AlertBox>

      <CodeBlock
        title="Automatizando a atualização do banco"
        code={`# O plocate já inclui um timer do systemd que roda updatedb diariamente
# Verificar se está ativo:
systemctl status plocate-updatedb.timer

# Habilitar (se não estiver):
sudo systemctl enable --now plocate-updatedb.timer`}
      />

      <h2>Tabela de Referência Rápida</h2>
      <CodeBlock
        title="Resumo dos comandos de navegação"
        code={`# NAVEGAÇÃO
pwd                  # Onde estou?
cd /caminho          # Ir para caminho absoluto
cd pasta             # Entrar em pasta (relativo)
cd ..                # Subir um nível
cd ~                 # Ir para home
cd -                 # Voltar ao diretório anterior

# LISTAGEM
ls                   # Listar arquivos
ls -lah              # Listagem completa (a mais usada)
ls -lhS              # Ordenar por tamanho
ls -lt               # Ordenar por data
tree -L 2            # Árvore até 2 níveis

# BUSCA
find . -name "*.txt"           # Buscar por nome
find . -type f -size +100M     # Buscar por tamanho
find . -mtime -7               # Modificados nos últimos 7 dias
locate arquivo                 # Busca rápida no banco de dados`}
      />

      <h2>7. Localizar Comandos e Programas</h2>
      <p>
        Às vezes você quer saber onde um programa está instalado no sistema, ou se ele existe.
        Existem três comandos para isso:
      </p>
      <CodeBlock
        title="which, whereis e type"
        code={`# === which ===
# Mostra o caminho do executável que será rodado quando você digitar o comando

which pacman
# /usr/bin/pacman

which python
# /usr/bin/python

which firefox
# /usr/bin/firefox

# Se o comando não existe:
which programa_inexistente
# (nenhuma saída, código de saída 1)

# === whereis ===
# Mostra a localização do binário, código-fonte e manual

whereis pacman
# pacman: /usr/bin/pacman /etc/pacman.conf /etc/pacman.d /usr/share/man/man8/pacman.8.gz

whereis bash
# bash: /usr/bin/bash /usr/share/man/man1/bash.1.gz

# Mostra:
# 1. Onde está o executável (/usr/bin/bash)
# 2. Onde está o manual (/usr/share/man/...)

# === type ===
# Mostra o que um comando é (built-in, alias, função, programa externo)

type cd
# cd is a shell builtin              ← Comando embutido no bash

type ls
# ls is aliased to 'ls --color=auto' ← É um alias

type pacman
# pacman is /usr/bin/pacman           ← Programa externo

type for
# for is a shell keyword              ← Palavra reservada do bash`}
      />

      <AlertBox type="success" title="Próximos passos">
        Agora que você sabe navegar pelo terminal, o próximo passo é entender a estrutura do sistema
        de arquivos do Linux — onde cada coisa fica e por quê. Veja a página sobre o
        Sistema de Arquivos (FHS) para continuar sua jornada.
      </AlertBox>
    </PageContainer>
  );
}
