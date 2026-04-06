import{j as o}from"./ui-K-J8Jkwj.js";import{P as s}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as r}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return o.jsxs(s,{title:"Permissões de Arquivos e Diretórios",subtitle:"Entenda o sistema de permissões rwx, chmod, chown, bits especiais (SUID, SGID, sticky bit) e ACLs.",difficulty:"intermediario",timeToRead:"25 min",children:[o.jsx("p",{children:"O sistema de permissões do Linux é o mecanismo fundamental de segurança. Cada arquivo e diretório tem um dono, um grupo associado e três conjuntos de permissões que controlam quem pode ler, escrever e executar."}),o.jsx("h2",{children:"1. Entendendo a Saída do ls -l"}),o.jsx(e,{code:`ls -l

# Saída:
# -rwxr-xr-- 1 joao desenvolvedores 4096 Jan 15 10:30 script.sh
# drwxr-x--- 2 joao joao           4096 Jan 15 10:30 documentos/
# lrwxrwxrwx 1 root root             11 Jan 15 10:30 link -> /usr/bin/vim`}),o.jsx("p",{children:"Decompondo a primeira coluna caractere por caractere:"}),o.jsx(e,{code:`# -  rwx  r-x  r--
# │  │││  │││  │││
# │  │││  │││  └┴┴── Outros (other): r-- = pode ler, não pode escrever, não pode executar
# │  │││  └┴┴─────── Grupo (group):  r-x = pode ler, não pode escrever, pode executar
# │  └┴┴──────────── Dono (user):    rwx = pode ler, escrever e executar
# └────────────────── Tipo: - = arquivo, d = diretório, l = link simbólico

# Significado de cada letra:
# r (read)    = Leitura
# w (write)   = Escrita
# x (execute) = Execução
# - (nada)    = Permissão negada`}),o.jsx("p",{children:"Significado das permissões para arquivos vs diretórios:"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"r (read)"})," - Arquivo: pode ver o conteúdo. Diretório: pode listar o conteúdo (ls)."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"w (write)"})," - Arquivo: pode modificar. Diretório: pode criar/deletar arquivos dentro."]}),o.jsxs("li",{children:[o.jsx("strong",{children:"x (execute)"})," - Arquivo: pode executar como programa. Diretório: pode entrar (cd)."]})]}),o.jsxs(r,{type:"info",title:"Diretório sem x mas com r",children:["Se um diretório tem permissão ",o.jsx("code",{children:"r--"}),", você pode listar os nomes dos arquivos, mas não pode entrar nele (cd), ver detalhes dos arquivos ou abrir nenhum deles. Para acessar o conteúdo de um diretório, você PRECISA de ",o.jsx("code",{children:"x"}),"."]}),o.jsx("h2",{children:"2. Representação Numérica (Octal)"}),o.jsx(e,{code:`# Cada permissão tem um valor numérico:
# r = 4
# w = 2
# x = 1
# - = 0

# Some os valores para cada grupo (dono, grupo, outros):
# rwx = 4+2+1 = 7
# r-x = 4+0+1 = 5
# r-- = 4+0+0 = 4
# rw- = 4+2+0 = 6
# --- = 0+0+0 = 0

# Exemplos comuns:
# 755 = rwxr-xr-x  (dono: tudo, grupo/outros: ler e executar)
# 644 = rw-r--r--  (dono: ler/escrever, grupo/outros: apenas ler)
# 700 = rwx------  (dono: tudo, grupo/outros: nada)
# 600 = rw-------  (dono: ler/escrever, grupo/outros: nada)
# 777 = rwxrwxrwx  (todos podem tudo - EVITE!)
# 000 = ---------  (ninguém pode nada)`}),o.jsx("h2",{children:"3. chmod - Mudar Permissões"}),o.jsx("h3",{children:"Modo Numérico (Octal)"}),o.jsx(e,{code:`# Dar permissão total ao dono, leitura+execução para grupo e outros
chmod 755 script.sh

# Arquivo privado (só o dono lê e escreve)
chmod 600 chave_privada.pem

# Tornar executável (dono: tudo, grupo/outros: ler+executar)
chmod 755 meu_programa

# Diretório com acesso restrito ao dono
chmod 700 ~/secreto

# Arquivo legível por todos
chmod 644 documento.txt

# Aplicar recursivamente a todos os arquivos e subdiretórios
chmod -R 755 /var/www/html`}),o.jsx("h3",{children:"Modo Simbólico"}),o.jsx(e,{code:`# Sintaxe: chmod [quem][operação][permissão] arquivo
# Quem: u (user/dono), g (group), o (others), a (all)
# Operação: + (adicionar), - (remover), = (definir exatamente)
# Permissão: r, w, x

# Adicionar permissão de execução para o dono
chmod u+x script.sh

# Remover permissão de escrita do grupo e outros
chmod go-w arquivo.txt

# Adicionar leitura para todos
chmod a+r documento.txt

# Definir permissões exatas para o dono
chmod u=rwx script.sh

# Remover todas as permissões dos outros
chmod o= secreto.txt

# Adicionar execução para todos
chmod +x script.sh

# Remover execução de todos
chmod -x programa

# Combinações
chmod u+x,g-w,o-rwx arquivo

# Recursivo com modo simbólico
chmod -R g+rX diretorio/
# Note o X maiúsculo: dá x apenas para diretórios, não para arquivos`}),o.jsxs(r,{type:"warning",title:"chmod -R 777 é SEMPRE errado",children:["Nunca use ",o.jsx("code",{children:"chmod -R 777"}),". Isso dá permissão total a todos em todos os arquivos, criando uma enorme falha de segurança. Se você sentiu necessidade de usar 777, provavelmente o problema é de ownership (chown), não de permissões."]}),o.jsx("h3",{children:"chmod com X maiúsculo"}),o.jsx(e,{code:`# O X maiúsculo é inteligente: dá x apenas para diretórios
# Muito útil para corrigir permissões recursivamente

# Problema: chmod -R 755 dá x em TODOS os arquivos (indesejado)
# Solução: usar dois comandos ou o X maiúsculo

# Abordagem com X maiúsculo:
chmod -R u=rwX,go=rX /var/www/html

# Abordagem com find (mais precisa):
# Diretórios: 755
find /var/www/html -type d -exec chmod 755 {} ;
# Arquivos: 644
find /var/www/html -type f -exec chmod 644 {} ;`}),o.jsx("h2",{children:"4. chown - Mudar Dono e Grupo"}),o.jsx(e,{code:`# Mudar o dono de um arquivo
sudo chown maria arquivo.txt

# Mudar dono e grupo
sudo chown maria:desenvolvedores arquivo.txt

# Mudar apenas o grupo (note os dois-pontos antes)
sudo chown :desenvolvedores arquivo.txt

# Recursivo (todos os arquivos e subdiretórios)
sudo chown -R joao:joao /home/joao

# Copiar ownership de outro arquivo
sudo chown --reference=modelo.txt alvo.txt

# Mudar dono de link simbólico (não do alvo)
sudo chown -h joao link_simbolico`}),o.jsx("h2",{children:"5. chgrp - Mudar Apenas o Grupo"}),o.jsx(e,{code:`# Mudar o grupo de um arquivo
sudo chgrp desenvolvedores projeto/

# Recursivo
sudo chgrp -R www-data /var/www/html

# É equivalente a:
sudo chown :www-data /var/www/html`}),o.jsx("h2",{children:"6. umask - Permissões Padrão"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"umask"})," define quais permissões são REMOVIDAS ao criar novos arquivos e diretórios. É como uma máscara que bloqueia certas permissões."]}),o.jsx(e,{code:`# Ver a umask atual
umask
# 0022

# Como funciona:
# Permissão máxima para arquivos:  666 (nunca cria arquivo com x)
# Permissão máxima para diretórios: 777
# umask: 022
# 
# Arquivo novo:  666 - 022 = 644 (rw-r--r--)
# Diretório novo: 777 - 022 = 755 (rwxr-xr-x)

# Definir umask mais restritiva
umask 077
# Arquivo novo:  666 - 077 = 600 (rw-------)
# Diretório novo: 777 - 077 = 700 (rwx------)

# Definir umask permissiva (NÃO recomendado)
umask 000
# Arquivo novo:  666 - 000 = 666 (rw-rw-rw-)
# Diretório novo: 777 - 000 = 777 (rwxrwxrwx)

# Ver umask em formato simbólico
umask -S
# u=rwx,g=rx,o=rx

# Para tornar permanente, adicione ao ~/.bashrc:
# umask 027`}),o.jsx("h2",{children:"7. Bits Especiais: SUID, SGID e Sticky Bit"}),o.jsx("h3",{children:"SUID (Set User ID) - Bit 4000"}),o.jsxs("p",{children:["Quando um arquivo tem SUID ativado, ele é executado com as permissões do ",o.jsx("strong",{children:"dono do arquivo"}),", não do usuário que o executou. É por isso que o ",o.jsx("code",{children:"passwd"})," funciona: qualquer usuário pode mudar sua senha, mas o arquivo /etc/shadow pertence ao root."]}),o.jsx(e,{code:`# Ver SUID em ação
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root 68208 Jan 15 /usr/bin/passwd
#    ^
#    s = SUID ativo (x do dono vira s)

# Ativar SUID
sudo chmod u+s programa
sudo chmod 4755 programa

# Remover SUID
sudo chmod u-s programa

# Encontrar todos os arquivos com SUID no sistema
sudo find / -perm -4000 -type f 2>/dev/null`}),o.jsx(r,{type:"danger",title:"SUID é um risco de segurança",children:"Um programa com SUID roda como root quando qualquer usuário o executa. Se o programa tiver uma vulnerabilidade, um atacante pode obter acesso root. Nunca coloque SUID em scripts shell — apenas em binários compilados e auditados."}),o.jsx("h3",{children:"SGID (Set Group ID) - Bit 2000"}),o.jsx("p",{children:"Em arquivos: executa com as permissões do grupo do arquivo. Em diretórios: novos arquivos criados dentro herdam o grupo do diretório (muito útil para equipes)."}),o.jsx(e,{code:`# Em diretórios (uso mais comum):
# Criar diretório de projeto compartilhado
sudo mkdir /projetos/webapp
sudo chown :desenvolvedores /projetos/webapp
sudo chmod 2775 /projetos/webapp

# Agora, qualquer arquivo criado dentro terá o grupo "desenvolvedores"
# independente de quem criou

# Verificar SGID
ls -ld /projetos/webapp
# drwxrwsr-x 2 root desenvolvedores 4096 Jan 15 /projetos/webapp
#       ^
#       s = SGID ativo (x do grupo vira s)

# Ativar SGID
sudo chmod g+s diretorio/
sudo chmod 2755 diretorio/

# Remover SGID
sudo chmod g-s diretorio/

# Encontrar arquivos com SGID
sudo find / -perm -2000 -type f 2>/dev/null`}),o.jsx("h3",{children:"Sticky Bit - Bit 1000"}),o.jsxs("p",{children:["Em diretórios com sticky bit, os arquivos só podem ser deletados pelo seu dono (ou pelo root), mesmo que outros tenham permissão de escrita no diretório. Exemplo clássico: ",o.jsx("code",{children:"/tmp"}),"."]}),o.jsx(e,{code:`# Ver o sticky bit no /tmp
ls -ld /tmp
# drwxrwxrwt 15 root root 4096 Jan 15 /tmp
#          ^
#          t = sticky bit ativo (x dos outros vira t)

# Todos podem criar arquivos no /tmp
# Mas cada usuário só pode deletar SEUS PRÓPRIOS arquivos

# Ativar sticky bit
sudo chmod +t diretorio/
sudo chmod 1777 diretorio/

# Remover sticky bit
sudo chmod -t diretorio/

# Exemplo prático: diretório compartilhado com sticky bit
sudo mkdir /compartilhado
sudo chmod 1777 /compartilhado`}),o.jsx("h2",{children:"8. ACLs (Access Control Lists)"}),o.jsx("p",{children:"As ACLs permitem definir permissões mais granulares do que o sistema rwx tradicional. Com ACLs, você pode dar permissões específicas para usuários e grupos individuais."}),o.jsx(e,{code:`# Instalar ferramentas de ACL (geralmente já vem instalado)
sudo pacman -S acl`}),o.jsx("h3",{children:"getfacl - Ver ACLs"}),o.jsx(e,{code:`# Ver ACLs de um arquivo
getfacl arquivo.txt

# Saída:
# # file: arquivo.txt
# # owner: joao
# # group: joao
# user::rw-
# group::r--
# other::r--

# Arquivo com ACLs extras mostra um + no ls -l
ls -l arquivo.txt
# -rw-r--r--+ 1 joao joao 4096 Jan 15 arquivo.txt
#           ^
#           + indica ACLs extras`}),o.jsx("h3",{children:"setfacl - Definir ACLs"}),o.jsx(e,{code:`# Dar permissão de leitura+escrita para um usuário específico
setfacl -m u:maria:rw arquivo.txt

# Dar permissão para um grupo específico
setfacl -m g:designers:r arquivo.txt

# Remover ACL de um usuário
setfacl -x u:maria arquivo.txt

# Remover TODAS as ACLs extras
setfacl -b arquivo.txt

# Aplicar recursivamente
setfacl -R -m u:maria:rwx diretorio/

# Definir ACL padrão para diretório (novos arquivos herdarão)
setfacl -d -m u:maria:rw diretorio/

# Ver ACL padrão do diretório
getfacl diretorio/

# Copiar ACLs de um arquivo para outro
getfacl fonte.txt | setfacl --set-file=- destino.txt`}),o.jsx(r,{type:"info",title:"Quando usar ACLs?",children:"Use ACLs quando o sistema básico rwx não é suficiente. Por exemplo: você quer que Maria tenha acesso de escrita a um arquivo, mas ela não está no grupo dono do arquivo e você não quer mudar o grupo. ACLs resolvem esse tipo de situação sem bagunçar as permissões existentes."}),o.jsx("h2",{children:"9. Receitas Práticas"}),o.jsx("h3",{children:"Configurar diretório de projeto para equipe"}),o.jsx(e,{code:`# Criar grupo e diretório
sudo groupadd projeto-web
sudo mkdir -p /projetos/web
sudo chown root:projeto-web /projetos/web

# SGID para novos arquivos herdarem o grupo
sudo chmod 2775 /projetos/web

# Adicionar membros ao grupo
sudo usermod -aG projeto-web joao
sudo usermod -aG projeto-web maria

# Agora ambos podem criar e editar arquivos no diretório
# e todos os novos arquivos terão o grupo projeto-web`}),o.jsx("h3",{children:"Proteger chave SSH"}),o.jsx(e,{code:`# O SSH exige permissões restritivas
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/known_hosts`}),o.jsx("h3",{children:"Encontrar arquivos com permissões perigosas"}),o.jsx(e,{code:`# Arquivos com permissão 777 (todos podem tudo)
sudo find / -perm 777 -type f 2>/dev/null

# Arquivos com SUID (executam como root)
sudo find / -perm -4000 -type f 2>/dev/null

# Arquivos graváveis por todos (world-writable)
sudo find / -perm -o+w -type f -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null

# Diretórios sem sticky bit que são world-writable
sudo find / -perm -o+w -type d -not -perm -1000 2>/dev/null`}),o.jsx("h2",{children:"10. O que NÃO fazer"}),o.jsx(r,{type:"danger",title:"Erros fatais com permissões",children:o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"chmod -R 777 /"})," — destrói toda a segurança do sistema. Muitos programas (como SSH) se recusam a funcionar com permissões frouxas"]}),o.jsxs("li",{children:[o.jsx("code",{children:"chown -R root:root /home"})," — tira a propriedade dos diretórios home de todos os usuários"]}),o.jsx("li",{children:"Colocar SUID em shell scripts — qualquer um pode explorar para obter root"}),o.jsxs("li",{children:[o.jsx("code",{children:"chmod 666"})," em executáveis — remove a permissão de execução"]}),o.jsxs("li",{children:["Ignorar permissões incorretas em ",o.jsx("code",{children:"~/.ssh"})," — o SSH se recusa a funcionar"]}),o.jsxs("li",{children:["Usar ",o.jsx("code",{children:"sudo chmod"})," sem pensar duas vezes — uma vez feito, pode ser difícil desfazer"]})]})}),o.jsx("h2",{children:"11. Atributos Especiais de Arquivos (chattr / lsattr)"}),o.jsxs("p",{children:["Além das permissões rwx, o Linux tem ",o.jsx("strong",{children:"atributos especiais"})," de arquivos que adicionam uma camada extra de proteção. Eles são controlados pelos comandos",o.jsx("code",{children:"chattr"})," (change attribute) e ",o.jsx("code",{children:"lsattr"})," (list attributes)."]}),o.jsx(e,{title:"chattr e lsattr",code:`# === TORNAR ARQUIVO IMUTÁVEL ===
# O atributo +i impede QUALQUER alteração, mesmo pelo root!
# Não pode ser editado, renomeado, deletado ou linkado.

sudo chattr +i arquivo_importante.conf
# Agora:
rm arquivo_importante.conf
# rm: cannot remove 'arquivo_importante.conf': Operation not permitted
# Nem o root consegue deletar!

# Remover o atributo imutável
sudo chattr -i arquivo_importante.conf

# === APENAS ADICIONAR (APPEND ONLY) ===
# O atributo +a permite apenas ADICIONAR conteúdo ao arquivo
# Não permite editar ou deletar o conteúdo existente
# Perfeito para arquivos de log

sudo chattr +a /var/log/meu_log.txt
echo "nova entrada" >> /var/log/meu_log.txt   # OK - adicionar funciona
echo "novo conteudo" > /var/log/meu_log.txt    # ERRO - sobrescrever não funciona

# === VER ATRIBUTOS ===
lsattr arquivo_importante.conf
# ----i--------e-- arquivo_importante.conf
# O "i" indica que é imutável

lsattr /etc/
# Lista atributos de todos os arquivos em /etc/

# === OUTROS ATRIBUTOS ÚTEIS ===
# +i  = Imutável (nada pode alterar)
# +a  = Append only (só adicionar)
# +c  = Comprimir automaticamente
# +s  = Deletar com segurança (sobrescrever com zeros)
# +u  = Undeletable (permite recuperação após deletar)

# Adicionar múltiplos atributos
sudo chattr +ia arquivo.txt

# Ver atributos recursivamente
lsattr -R /etc/`}),o.jsx(r,{type:"warning",title:"Cuidado com chattr +i",children:o.jsxs("p",{children:["Se você tornar um arquivo de configuração imutável e depois esquecer, vai ficar confuso quando tentar editar e não conseguir. Antes de editar arquivos protegidos, verifique com ",o.jsx("code",{children:"lsattr"})," se tem atributos especiais."]})}),o.jsx("h2",{children:"12. Referências"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx("a",{href:"https://wiki.archlinux.org/title/File_permissions_and_attributes",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - File Permissions and Attributes"})}),o.jsx("li",{children:o.jsx("a",{href:"https://wiki.archlinux.org/title/Access_Control_Lists",target:"_blank",rel:"noopener noreferrer",children:"ArchWiki - Access Control Lists"})}),o.jsxs("li",{children:[o.jsx("code",{children:"man chmod"}),", ",o.jsx("code",{children:"man chown"}),", ",o.jsx("code",{children:"man umask"})]}),o.jsxs("li",{children:[o.jsx("code",{children:"man setfacl"}),", ",o.jsx("code",{children:"man getfacl"})]})]})]})}export{l as default};
