import{j as e}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as a}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(s,{title:"Navegação no Terminal",subtitle:"Domine os comandos essenciais para se mover pelo sistema de arquivos do Linux: cd, ls, pwd, tree, find e locate.",difficulty:"iniciante",timeToRead:"25 min",children:[e.jsx("p",{children:"Navegar pelo sistema de arquivos é a habilidade mais fundamental que você precisa dominar no Linux. Diferente de um gerenciador de arquivos gráfico, no terminal você se move entre diretórios usando comandos de texto. Pode parecer intimidador no começo, mas rapidamente se torna muito mais rápido e poderoso do que clicar em pastas."}),e.jsx("h2",{children:"1. pwd — Onde eu estou?"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"pwd"})," (Print Working Directory) mostra o caminho absoluto do diretório em que você está neste momento. É o primeiro comando que você deve aprender — ele é seu GPS no terminal."]}),e.jsx(o,{title:"Exibir o diretório atual",code:`pwd
# Saída: /home/usuario`}),e.jsx("h3",{children:"Flags importantes do pwd"}),e.jsx(o,{title:"pwd -L vs pwd -P",code:`# -L (padrão): Mostra o caminho lógico (segue links simbólicos)
pwd -L

# -P: Mostra o caminho físico real (resolve links simbólicos)
pwd -P

# Exemplo prático:
# Se /home/usuario/projetos é um link simbólico para /mnt/ssd/projetos
cd /home/usuario/projetos
pwd -L   # /home/usuario/projetos  (caminho do link)
pwd -P   # /mnt/ssd/projetos      (caminho real no disco)`}),e.jsxs(a,{type:"info",title:"Quando usar pwd -P?",children:["Use ",e.jsx("code",{children:"pwd -P"})," quando precisar saber onde os arquivos realmente estão no disco, por exemplo ao verificar pontos de montagem ou debugar problemas de espaço em disco."]}),e.jsx("h2",{children:"2. cd — Mudando de diretório"}),e.jsxs("p",{children:["O comando ",e.jsx("code",{children:"cd"})," (Change Directory) é como você se move entre pastas. Ele aceita caminhos absolutos (começando com ",e.jsx("code",{children:"/"}),") e caminhos relativos (a partir de onde você está)."]}),e.jsx("h3",{children:"Caminhos absolutos vs relativos"}),e.jsx(o,{title:"Entendendo caminhos",code:`# Caminho ABSOLUTO: Começa sempre com /
# É como dar o endereço completo de uma casa
cd /etc/pacman.d
cd /home/usuario/Documentos
cd /var/log

# Caminho RELATIVO: Parte do diretório atual
# É como dar direções a partir de onde você está
cd Documentos        # entra na pasta Documentos (dentro do diretório atual)
cd projetos/web      # entra em projetos, depois em web
cd ../               # volta um nível (diretório pai)`}),e.jsx("h3",{children:"Atalhos essenciais do cd"}),e.jsx(o,{title:"Atalhos que vão salvar seu tempo",code:`# Ir para o diretório home do usuário (3 formas)
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
cd ~joao         # vai para /home/joao`}),e.jsx(a,{type:"warning",title:"O que NÃO fazer com cd",children:e.jsxs("ul",{children:[e.jsxs("li",{children:["Não tente ",e.jsx("code",{children:"cd"})," para um arquivo — cd só funciona com diretórios."]}),e.jsxs("li",{children:["Não confunda ",e.jsx("code",{children:"cd /home"})," (absoluto) com ",e.jsx("code",{children:"cd home"})," (relativo)."]}),e.jsxs("li",{children:["Não esqueça que nomes com espaço precisam de aspas: ",e.jsx("code",{children:'cd "Meus Documentos"'})," ou escape: ",e.jsx("code",{children:"cd Meus\\ Documentos"}),"."]})]})}),e.jsx("h2",{children:"3. ls — Listando arquivos e diretórios"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"ls"})," (List) é provavelmente o comando que você mais vai usar no dia a dia. Ele lista o conteúdo de diretórios. Sozinho já é útil, mas com flags se torna extremamente poderoso."]}),e.jsx("h3",{children:"Uso básico"}),e.jsx(o,{title:"ls simples",code:`# Listar conteúdo do diretório atual
ls

# Listar conteúdo de um diretório específico
ls /etc
ls ~/Documentos

# Listar múltiplos diretórios
ls /etc /var /tmp`}),e.jsx("h3",{children:"Flags essenciais do ls"}),e.jsx(o,{title:"As flags que você PRECISA saber",code:`# -l: Formato longo (detalhes completos)
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
ls --color=auto`}),e.jsx("h3",{children:"Combinando flags como um profissional"}),e.jsx(o,{title:"Combinações úteis no dia a dia",code:`# Ver tudo com detalhes e tamanhos legíveis (a mais usada de todas)
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
ls -F`}),e.jsx(a,{type:"danger",title:"O que NÃO fazer com ls",children:e.jsxs("ul",{children:[e.jsxs("li",{children:["Nunca use ",e.jsx("code",{children:"ls"})," em scripts para processar nomes de arquivos — use ",e.jsx("code",{children:"find"})," ou globs. Nomes com espaços ou caracteres especiais quebram o parsing do ls."]}),e.jsxs("li",{children:["Não confie cegamente em ",e.jsx("code",{children:"ls"})," sem ",e.jsx("code",{children:"-a"})," — arquivos ocultos podem estar ocupando espaço sem você ver."]})]})}),e.jsx("h2",{children:"4. tree — Visualização em árvore"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"tree"})," mostra a estrutura de diretórios de forma visual, como uma árvore. É excelente para entender a organização de um projeto."]}),e.jsx(o,{title:"Instalando o tree (não vem instalado por padrão)",code:"sudo pacman -S tree"}),e.jsx(o,{title:"Usando o tree",code:`# Mostrar árvore do diretório atual
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
tree -L 3 -I "node_modules|.git" --dirsfirst`}),e.jsxs(a,{type:"success",title:"Dica profissional",children:["Use ",e.jsx("code",{children:"tree -L 2 --dirsfirst"})," na raiz de qualquer projeto novo para entender rapidamente como ele está organizado. É muito mais rápido do que navegar pasta por pasta."]}),e.jsx("h2",{children:"5. find — Busca poderosa de arquivos"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"find"})," é o canivete suíço para buscar arquivos. Ele percorre toda a árvore de diretórios e pode filtrar por nome, tipo, tamanho, data, permissões e muito mais. Diferente do ",e.jsx("code",{children:"ls"}),", ele busca recursivamente por padrão."]}),e.jsx("h3",{children:"Sintaxe básica"}),e.jsx(o,{title:"Estrutura do find",code:`# Sintaxe: find [onde-buscar] [critérios] [ação]
find /home/usuario -name "*.txt"
#     ^^^^^^^^^^^^  ^^^^^^^^^^^^^
#     onde buscar    critério`}),e.jsx("h3",{children:"Busca por nome"}),e.jsx(o,{title:"Encontrando arquivos por nome",code:`# Buscar por nome exato (case sensitive)
find /etc -name "pacman.conf"

# Buscar ignorando maiúsculas/minúsculas
find /home -iname "readme.md"

# Buscar com wildcard (padrão glob)
find . -name "*.log"
find . -name "*.txt"
find /etc -name "*.conf"

# Buscar arquivos que começam com um prefixo
find . -name "config*"`}),e.jsx("h3",{children:"Busca por tipo"}),e.jsx(o,{title:"Filtrando por tipo de arquivo",code:`# -type f: apenas arquivos regulares
find /var/log -type f -name "*.log"

# -type d: apenas diretórios
find /home -type d -name "projetos"

# -type l: apenas links simbólicos
find /usr/bin -type l

# Combinar: encontrar diretórios vazios
find . -type d -empty

# Encontrar arquivos vazios
find . -type f -empty`}),e.jsx("h3",{children:"Busca por tamanho"}),e.jsx(o,{title:"Filtrando por tamanho",code:`# Arquivos maiores que 100MB
find / -type f -size +100M

# Arquivos menores que 1KB
find . -type f -size -1k

# Arquivos de exatamente 0 bytes (vazios)
find . -type f -size 0

# Arquivos entre 10MB e 100MB
find . -type f -size +10M -size -100M

# Unidades: c (bytes), k (kilobytes), M (megabytes), G (gigabytes)`}),e.jsx("h3",{children:"Busca por data de modificação"}),e.jsx(o,{title:"Filtrando por tempo",code:`# Arquivos modificados nos últimos 7 dias
find . -type f -mtime -7

# Arquivos modificados há mais de 30 dias
find . -type f -mtime +30

# Arquivos modificados nas últimas 2 horas
find . -type f -mmin -120

# Arquivos acessados nos últimos 3 dias
find . -type f -atime -3`}),e.jsx("h3",{children:"Executando ações com -exec"}),e.jsx(o,{title:"O poder do -exec",code:`# Deletar todos os arquivos .tmp
find /tmp -type f -name "*.tmp" -exec rm {} \\;

# Mudar permissões de todos os scripts
find . -type f -name "*.sh" -exec chmod +x {} \\;

# Listar detalhes de arquivos grandes
find / -type f -size +500M -exec ls -lh {} \\;

# Buscar conteúdo dentro de arquivos encontrados
find . -name "*.conf" -exec grep -l "password" {} \\;

# Usando + em vez de \\; (mais eficiente, passa múltiplos arquivos de uma vez)
find . -name "*.log" -exec rm {} +`}),e.jsxs(a,{type:"danger",title:"Cuidado com find + rm",children:["Sempre teste seu comando ",e.jsx("code",{children:"find"})," SEM o ",e.jsx("code",{children:"-exec rm"})," primeiro para ver quais arquivos serão encontrados. Um critério errado pode deletar arquivos importantes. Use ",e.jsx("code",{children:"find ... -exec rm -i"})," para confirmar cada exclusão."]}),e.jsx("h2",{children:"6. locate — Busca instantânea"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"locate"})," é muito mais rápido que o ",e.jsx("code",{children:"find"})," porque ele não percorre o sistema de arquivos em tempo real — ele consulta um banco de dados indexado. A desvantagem é que o banco precisa ser atualizado periodicamente."]}),e.jsx(o,{title:"Instalando o locate no Arch",code:`# O locate faz parte do pacote mlocate (ou plocate, mais moderno)
sudo pacman -S plocate

# Criar o banco de dados pela primeira vez (OBRIGATÓRIO antes do primeiro uso)
sudo updatedb`}),e.jsx(o,{title:"Usando o locate",code:`# Busca simples
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
locate -r "/etc/.*\\.conf$"`}),e.jsxs(a,{type:"warning",title:"O banco de dados fica desatualizado!",children:["O ",e.jsx("code",{children:"locate"})," não encontra arquivos criados depois do último ",e.jsx("code",{children:"updatedb"}),". Se você criou um arquivo agora e quer encontrá-lo, rode ",e.jsx("code",{children:"sudo updatedb"})," primeiro ou use ",e.jsx("code",{children:"find"})," que busca em tempo real."]}),e.jsx(o,{title:"Automatizando a atualização do banco",code:`# O plocate já inclui um timer do systemd que roda updatedb diariamente
# Verificar se está ativo:
systemctl status plocate-updatedb.timer

# Habilitar (se não estiver):
sudo systemctl enable --now plocate-updatedb.timer`}),e.jsx("h2",{children:"Tabela de Referência Rápida"}),e.jsx(o,{title:"Resumo dos comandos de navegação",code:`# NAVEGAÇÃO
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
locate arquivo                 # Busca rápida no banco de dados`}),e.jsx("h2",{children:"7. Localizar Comandos e Programas"}),e.jsx("p",{children:"Às vezes você quer saber onde um programa está instalado no sistema, ou se ele existe. Existem três comandos para isso:"}),e.jsx(o,{title:"which, whereis e type",code:`# === which ===
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
# for is a shell keyword              ← Palavra reservada do bash`}),e.jsx(a,{type:"success",title:"Próximos passos",children:"Agora que você sabe navegar pelo terminal, o próximo passo é entender a estrutura do sistema de arquivos do Linux — onde cada coisa fica e por quê. Veja a página sobre o Sistema de Arquivos (FHS) para continuar sua jornada."})]})}export{u as default};
