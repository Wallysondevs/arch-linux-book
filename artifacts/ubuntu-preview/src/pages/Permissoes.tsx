import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Permissoes() {
  return (
    <PageContainer
      title="Permissões de Arquivos"
      subtitle="chmod, chown, umask — entendendo e gerenciando o sistema de permissões do Linux de forma completa e segura."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        O sistema de permissões do Linux é um dos seus recursos mais poderosos e importantes
        para segurança. Ele controla quem pode ler, escrever e executar cada arquivo ou
        diretório. Entender permissões é essencial para administrar qualquer sistema Linux.
      </p>

      <h2>Lendo Permissões</h2>
      <CodeBlock
        title="Interpretando a saída do ls -l"
        code={`ls -l /home/joao/
# -l = long format (formato longo) — mostra permissões, dono, tamanho e data

# Saída:
# -rw-r--r--  1 joao joao  3524 mar 27 10:00 .bashrc
# drwxr-xr-x  2 joao joao  4096 mar 27 09:00 Downloads
# -rwxr-xr-x  1 joao joao   420 mar 26 15:00 script.sh
# lrwxrwxrwx  1 joao joao    12 mar 25 10:00 link -> /etc/arquivo

# === ESTRUTURA DOS 10 PRIMEIROS CARACTERES ===
# [tipo][user: 3 chars][group: 3 chars][others: 3 chars]
#  -       rw-             r--             r--

# TIPO DE ARQUIVO (1º caractere):
# -  = arquivo regular (arquivo de texto, executável, imagem, etc.)
# d  = directory (diretório/pasta)
# l  = link simbólico (atalho que aponta para outro arquivo)
# c  = dispositivo de caractere (ex: /dev/tty — terminal)
# b  = dispositivo de bloco (ex: /dev/sda — disco rígido)

# PERMISSÕES (para cada grupo de 3 caracteres):
# r = read  (leitura)    = valor 4
# w = write (escrita)    = valor 2
# x = execute (execução) = valor 1
# - = sem permissão      = valor 0

# EXEMPLOS DE COMBINAÇÕES:
# rw-  = leitura + escrita (sem execução)    = 4+2+0 = 6
# r-x  = leitura + execução (sem escrita)    = 4+0+1 = 5
# rwx  = leitura + escrita + execução (tudo) = 4+2+1 = 7
# r--  = somente leitura                     = 4+0+0 = 4
# ---  = sem nenhuma permissão               = 0+0+0 = 0`}
      />

      <h2>chmod — Mudar Permissões</h2>

      <h3>Modo Numérico (Octal)</h3>
      <CodeBlock
        title="chmod com números octais"
        code={`# Formato: chmod [user][group][others] arquivo
# Cada número = soma das permissões: r=4, w=2, x=1

# PERMISSÕES MAIS COMUNS:
chmod 644 arquivo.txt   # -rw-r--r--  (arquivos comuns: dono lê/escreve, outros só leem)
chmod 755 script.sh     # -rwxr-xr-x  (scripts: dono executa, outros podem executar também)
chmod 600 chave.pem     # -rw-------  (arquivos privados: só o dono acessa — ex: chaves SSH)
chmod 700 .ssh/         # drwx------  (diretório privado: só o dono entra)
chmod 777 /tmp/         # drwxrwxrwx  (qualquer um pode tudo — EVITAR em produção!)

# COMO CALCULAR MANUALMENTE:
# 7 = rwx = 4+2+1 (leitura + escrita + execução)
# 6 = rw- = 4+2+0 (leitura + escrita)
# 5 = r-x = 4+0+1 (leitura + execução)
# 4 = r-- = 4+0+0 (somente leitura)
# 0 = --- = 0+0+0 (nenhuma permissão)

# LEITURA DO chmod 755:
# 7 (user/dono)  = rwx = pode ler, escrever E executar
# 5 (group)      = r-x = pode ler e executar (mas NÃO escrever)
# 5 (others)     = r-x = pode ler e executar (mas NÃO escrever)

# -R = Recursive (recursivo) — aplica em TODOS os arquivos e subpastas dentro do diretório
chmod -R 755 /var/www/html/
# Sem -R, apenas o diretório raiz receberia a permissão.`}
      />

      <h3>Modo Simbólico (mais legível para iniciantes)</h3>
      <CodeBlock
        title="chmod com símbolos — mais fácil de entender"
        code={`# Formato: chmod [quem][operação][permissão] arquivo

# QUEM:
# u = user (dono do arquivo)
# g = group (grupo do arquivo)
# o = others (todos os outros usuários)
# a = all (todos: u + g + o ao mesmo tempo)

# OPERAÇÃO:
# + = adicionar essa permissão (sem remover as existentes)
# - = remover essa permissão (sem mudar as outras)
# = = definir EXATAMENTE essas permissões (apaga as antigas)

# PERMISSÃO: r (leitura), w (escrita), x (execução)

# Exemplos práticos:

# Dar permissão de execução ao DONO do arquivo
chmod u+x script.sh
# u = user/dono, + = adicionar, x = execução

# Remover permissão de escrita do GRUPO e de OUTROS
chmod go-w arquivo.txt
# g = group, o = others, - = remover, w = escrita

# Dar permissão de leitura a TODOS
chmod a+r arquivo.txt
# a = all (todos: dono, grupo e outros)

# Definir EXATAMENTE as permissões do grupo como "somente leitura"
chmod g=r arquivo.txt
# = define exatamente: grupo terá r, mas NÃO terá w nem x

# Remover execução de TODOS (dono, grupo e outros)
chmod a-x arquivo.txt

# Múltiplas operações de uma vez (separadas por vírgula)
chmod u+x,g-w,o-r arquivo.txt
# dono ganha execução, grupo perde escrita, outros perdem leitura

# -R = Recursive (recursivo) — aplicar em toda a árvore de diretórios
chmod -R 755 /var/www/html/

# Aplicar APENAS em arquivos (não em diretórios):
find /var/www -type f -exec chmod 644 {} \;
# -type f = apenas arquivos (f = file)
# -exec = executar chmod 644 para cada arquivo encontrado
# {} = onde o nome do arquivo atual será inserido
# \; = fim do comando do -exec

# Aplicar APENAS em diretórios:
find /var/www -type d -exec chmod 755 {} \;
# -type d = apenas diretórios (d = directory)`}
      />

      <AlertBox type="warning" title="Permissões em diretórios são diferentes!">
        Para <strong>diretórios</strong>, as letras têm significados diferentes dos arquivos:
        <ul className="mt-1 mb-0">
          <li><strong>r</strong> = listar o conteúdo do diretório (<code>ls</code>)</li>
          <li><strong>w</strong> = criar, renomear ou deletar arquivos DENTRO do diretório</li>
          <li><strong>x</strong> = entrar no diretório (<code>cd</code>) e acessar seus conteúdos</li>
        </ul>
        Um diretório com <code>r--</code> permite ver a lista mas não entrar. Com <code>--x</code>
        você pode entrar mas não ver a lista. Na prática sempre use <code>r-x</code> (5) ou <code>rwx</code> (7) para diretórios.
      </AlertBox>

      <h2>chown — Mudar Dono e Grupo</h2>
      <CodeBlock
        title="Mudando a propriedade de arquivos"
        code={`# Mudar o DONO de um arquivo
sudo chown maria arquivo.txt
# sudo necessário pois apenas root pode mudar o dono de arquivos

# Mudar DONO e GRUPO ao mesmo tempo (formato: dono:grupo)
sudo chown maria:www-data arquivo.txt
# Dono passa a ser "maria", grupo passa a ser "www-data"

# Mudar APENAS o grupo (deixar dois pontos antes do grupo)
sudo chown :www-data arquivo.txt
# Equivalente a: sudo chgrp www-data arquivo.txt

# -R = Recursive (recursivo) — aplicar em todos os arquivos do diretório
sudo chown -R www-data:www-data /var/www/html/
# Muito usado para servidores web: todos os arquivos do site
# pertencem ao usuário do servidor web (www-data)

# -v = verbose (verboso) — mostrar o que está sendo alterado
sudo chown -Rv www-data:www-data /var/www/html/

# EXEMPLO PRÁTICO para servidor web:
# 1. Atribuir arquivos ao servidor web:
sudo chown -R www-data:www-data /var/www/meu-site/

# 2. Mas o desenvolvedor também precisa editar:
#    Adicione o usuário ao grupo www-data:
sudo usermod -aG www-data joao
# usermod = modificar usuário
# -a = append (adicionar ao grupo, sem remover de outros grupos)
# -G = Groups (lista de grupos suplementares)

# 3. Dar permissão de escrita ao grupo:
chmod -R g+w /var/www/meu-site/

# 4. Para que as novas permissões de grupo funcionem:
#    O usuário precisa fazer logout e login novamente.`}
      />

      <h2>Permissões Especiais</h2>
      <CodeBlock
        title="SUID, SGID e Sticky Bit explicados"
        code={`# === SUID (Set User ID) ===
# Quando ativo em um executável, ele roda com a identidade do DONO do arquivo,
# não do usuário que o executou.

# Exemplo clássico: /usr/bin/passwd
ls -la /usr/bin/passwd
# -rwsr-xr-x 1 root root 68208 /usr/bin/passwd
#     ^ s = SUID ativo (o x virou s)

# Quando VOCÊ executa "passwd", ele roda como ROOT temporariamente
# porque precisa escrever em /etc/shadow (arquivo acessível só pelo root)

chmod u+s script.sh   # Ativar SUID via modo simbólico
chmod 4755 script.sh  # Ativar SUID via octal (o 4 na frente ativa o SUID)
# 4 = SUID | 2 = SGID | 1 = Sticky Bit

# === SGID (Set Group ID) ===
# Em executáveis: roda com o grupo do arquivo, não do usuário atual.
# Em DIRETÓRIOS: novos arquivos herdam o grupo do diretório (não o do criador).

chmod g+s projeto/     # Ativar SGID via simbólico
chmod 2755 projeto/    # Ativar SGID via octal (2 na frente)

# Útil para projetos colaborativos:
# Se o diretório /opt/projeto tem grupo "equipe" e SGID ativo,
# todo arquivo criado dentro terá grupo "equipe" automaticamente.

# === STICKY BIT ===
# Em diretórios: apenas o DONO do arquivo pode deletar seus próprios arquivos,
# mesmo que outros tenham permissão de escrita no diretório.

ls -la /tmp/
# drwxrwxrwt ← o t final = sticky bit ativo (o x virou t)
#          ^

# Qualquer usuário pode criar arquivos em /tmp,
# mas cada um só pode deletar os próprios arquivos.

chmod +t /compartilhado/    # Ativar sticky bit via simbólico
chmod 1777 /compartilhado/  # Ativar sticky bit via octal (1 na frente)

# Ver todos os bits especiais:
stat -c %a arquivo
# -c = format (usar formato personalizado)
# %a = exibir permissões em octal (ex: 4755 = SUID + 755)`}
      />

      <h2>umask — Permissões Padrão para Novos Arquivos</h2>
      <CodeBlock
        title="Como o umask define permissões padrão"
        code={`# Ver o umask atual do usuário
umask
# 0022   ← o padrão do Ubuntu

# Como funciona o umask:
# Novos ARQUIVOS começam com permissão máxima 666 (rw-rw-rw-)
# Novos DIRETÓRIOS começam com permissão máxima 777 (rwxrwxrwx)
# O umask SUBTRAI essas permissões:

# Com umask 022:
# Arquivos:    666 - 022 = 644 (rw-r--r--)
# Diretórios:  777 - 022 = 755 (rwxr-xr-x)

# Verificar na prática:
touch novo-arquivo.txt   # Cria com 644
mkdir novo-diretorio/    # Cria com 755
ls -la

# Mudar o umask para a sessão atual:
umask 027
# Arquivos:    666 - 027 = 640 (rw-r-----)  ← outros sem acesso!
# Diretórios:  777 - 027 = 750 (rwxr-x---)

# Configurar umask permanentemente para seu usuário:
echo "umask 022" >> ~/.bashrc
# >> = append (adicionar ao final do arquivo sem apagar o conteúdo)
# ~/.bashrc é executado a cada abertura de terminal`}
      />

      <h2>ACL — Controle de Acesso Avançado</h2>
      <p>
        O sistema padrão do Linux só permite definir permissões para três entidades: dono, grupo
        e outros. A ACL (Access Control List) permite dar permissões específicas para qualquer
        usuário ou grupo, indo além dessa limitação.
      </p>
      <CodeBlock
        title="ACL: permissões granulares por usuário"
        code={`# Instalar ferramentas de ACL
sudo apt install acl

# setfacl = set file ACL (definir ACL de arquivo)
# -m = modify (modificar/adicionar uma entrada na ACL)
# u:maria:rw = user:maria:permissões (dar à maria leitura e escrita)
setfacl -m u:maria:rw arquivo.txt

# Dar permissão a um GRUPO específico
setfacl -m g:desenvolvedores:rw /var/www/meu-site/
# g = group (grupo), diferente do u = user (usuário)

# -R = Recursive (recursivo) — aplicar em todo o diretório
setfacl -R -m u:maria:rwx /var/www/meu-site/

# getfacl = get file ACL (ver as ACLs de um arquivo)
getfacl arquivo.txt
# Saída:
# file: arquivo.txt
# owner: joao
# group: joao
# user::rw-           ← permissões do dono (modo padrão)
# user:maria:rw-      ← ACL extra: maria tem rw
# group::r--          ← permissões do grupo (modo padrão)
# mask::rw-           ← permissão máxima efetiva para grupo e ACLs
# other::r--          ← permissões de outros (modo padrão)

# -x = remove (remover uma entrada específica da ACL)
setfacl -x u:maria arquivo.txt

# -b = remove all (remover TODAS as ACLs do arquivo)
setfacl -b arquivo.txt

# Quando ACL está ativa, ls -l mostra um "+" ao final das permissões:
# -rw-rw-r--+  joao joao  arquivo.txt
#            ^ + = este arquivo tem ACLs adicionais`}
      />
    </PageContainer>
  );
}
