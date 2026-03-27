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

# Saída:
# -rw-r--r--  1 joao joao  3524 mar 27 10:00 .bashrc
# drwxr-xr-x  2 joao joao  4096 mar 27 09:00 Downloads
# -rwxr-xr-x  1 joao joao   420 mar 26 15:00 script.sh
# lrwxrwxrwx  1 joao joao    12 mar 25 10:00 link -> /etc/arquivo

# Estrutura dos 10 primeiros caracteres:
# [tipo][user][group][others]
# -  rw-  r--  r--

# Tipo de arquivo:
# -  = arquivo regular
# d  = diretório
# l  = link simbólico
# c  = dispositivo de caractere (/dev/tty)
# b  = dispositivo de bloco (/dev/sda)

# Para cada grupo (user, group, others):
# r = read  (leitura)    = 4
# w = write (escrita)    = 2
# x = execute (execução) = 1
# - = sem permissão      = 0

# Exemplos:
# rw-  = leitura + escrita (sem execução) = 6
# r-x  = leitura + execução (sem escrita) = 5
# rwx  = tudo liberado                    = 7
# r--  = somente leitura                  = 4
# ---  = nenhuma permissão                = 0`}
      />

      <h2>chmod — Mudar Permissões</h2>

      <h3>Modo Numérico (Octal)</h3>
      <CodeBlock
        title="chmod com números octais"
        code={`# Formato: chmod [user][group][others] arquivo

# Permissões comuns:
chmod 644 arquivo.txt   # -rw-r--r--  (arquivos comuns)
chmod 755 script.sh     # -rwxr-xr-x  (scripts executáveis)
chmod 600 chave.pem     # -rw-------  (arquivos privados/chaves)
chmod 700 .ssh/         # drwx------  (diretórios privados)
chmod 777 /tmp/         # drwxrwxrwx  (qualquer um pode tudo - evitar!)

# Como calcular:
# 7 = rwx = 4+2+1
# 6 = rw- = 4+2+0
# 5 = r-x = 4+0+1
# 4 = r-- = 4+0+0
# 0 = --- = 0+0+0

# chmod 755 arquivo:
# 7 (user)   = rwx = dono pode ler, escrever e executar
# 5 (group)  = r-x = grupo pode ler e executar
# 5 (others) = r-x = outros podem ler e executar`}
      />

      <h3>Modo Simbólico</h3>
      <CodeBlock
        title="chmod com símbolos (mais legível)"
        code={`# Formato: chmod [quem][operação][permissão] arquivo
# Quem:    u=user, g=group, o=others, a=all (todos)
# Operação: + (adicionar), - (remover), = (definir exatamente)
# Permissão: r, w, x

# Dar permissão de execução ao dono
chmod u+x script.sh

# Remover permissão de escrita do grupo e outros
chmod go-w arquivo.txt

# Dar leitura a todos
chmod a+r arquivo.txt

# Definir exatamente as permissões do grupo
chmod g=r arquivo.txt   # grupo só pode ler

# Remover execução de todos
chmod a-x arquivo.txt

# Múltiplas permissões de uma vez
chmod u+x,g-w,o-r arquivo.txt

# Aplicar recursivamente em diretório
chmod -R 755 /var/www/html/

# Aplicar APENAS em arquivos (não em diretórios):
find /var/www -type f -exec chmod 644 {} \;

# Aplicar APENAS em diretórios:
find /var/www -type d -exec chmod 755 {} \;`}
      />

      <AlertBox type="warning" title="Permissões em diretórios são diferentes">
        Para diretórios, as permissões têm significados diferentes:
        <ul className="mt-1 mb-0">
          <li><strong>r</strong> = listar o conteúdo do diretório (<code>ls</code>)</li>
          <li><strong>w</strong> = criar, renomear ou deletar arquivos DENTRO do diretório</li>
          <li><strong>x</strong> = entrar no diretório (<code>cd</code>) e acessar seus conteúdos</li>
        </ul>
        Um diretório com <code>r--</code> permite ver a lista mas não entrar. Com <code>--x</code>
        você pode entrar mas não ver a lista. Geralmente você precisa de ambos: <code>r-x</code>.
      </AlertBox>

      <h2>chown — Mudar Dono e Grupo</h2>
      <CodeBlock
        title="Mudando a propriedade de arquivos"
        code={`# Mudar o dono de um arquivo
sudo chown maria arquivo.txt

# Mudar dono E grupo ao mesmo tempo
sudo chown maria:www-data arquivo.txt

# Mudar apenas o grupo
sudo chown :www-data arquivo.txt
# Equivalente: chgrp www-data arquivo.txt

# Aplicar recursivamente
sudo chown -R www-data:www-data /var/www/html/

# Exemplo prático para servidor web:
# Arquivos do site devem pertencer ao nginx/apache:
sudo chown -R www-data:www-data /var/www/meu-site/

# Mas o desenvolvedor também precisa editar:
# Adicione o usuário ao grupo www-data:
sudo usermod -aG www-data joao
# Defina permissão de grupo para escrita:
chmod -R g+w /var/www/meu-site/`}
      />

      <h2>Permissões Especiais</h2>
      <CodeBlock
        title="SUID, SGID e Sticky Bit"
        code={`# SUID (Set User ID) — executar como o dono do arquivo
# Exemplo clássico: /usr/bin/passwd
ls -la /usr/bin/passwd
# -rwsr-xr-x 1 root root 68208 /usr/bin/passwd
#     ^ s = SUID ativado

# Quando você executa passwd, ele roda como ROOT (não como você)
# porque precisa escrever em /etc/shadow (somente root pode)

chmod u+s script.sh  # Ativar SUID
chmod 4755 script.sh  # Ativar SUID via octal (4 na frente)

# SGID (Set Group ID) — executar com o grupo do arquivo
chmod g+s diretorio/
chmod 2755 diretorio/
# Quando ativado em diretório: todos os arquivos criados
# herdam o grupo do diretório (útil para projetos colaborativos)

# Sticky Bit — apenas o dono pode deletar seus próprios arquivos
ls -la /tmp/
# drwxrwxrwt  ← 't' = sticky bit
#          ^ t

chmod +t /compartilhado/
chmod 1777 /compartilhado/
# Útil em diretórios compartilhados: qualquer um cria arquivos,
# mas só o dono (ou root) pode deletar o arquivo

# Ver permissões especiais:
stat -c %a arquivo  # Mostra em octal (ex: 4755 = SUID + 755)`}
      />

      <h2>umask — Permissões Padrão</h2>
      <CodeBlock
        title="Configurando permissões padrão com umask"
        code={`# Ver o umask atual
umask
# 0022

# Como funciona:
# Novos arquivos começam com 666 (rw-rw-rw-)
# Novos diretórios começam com 777 (rwxrwxrwx)
# O umask SUBTRAI essas permissões:
# 666 - 022 = 644 (rw-r--r--) para arquivos
# 777 - 022 = 755 (rwxr-xr-x) para diretórios

# umask 027: sem permissões para "others"
umask 027
# Arquivos: 666 - 027 = 640 (rw-r-----)
# Diretórios: 777 - 027 = 750 (rwxr-x---)

# Configurar umask permanentemente (adicionar ao ~/.bashrc):
echo "umask 022" >> ~/.bashrc`}
      />

      <h2>ACL — Controle de Acesso Avançado</h2>
      <CodeBlock
        title="Permissões além de user/group/others"
        code={`# Instalar ferramentas de ACL
sudo apt install acl

# Dar permissão específica a um usuário em um arquivo
setfacl -m u:maria:rw arquivo.txt

# Dar permissão a um grupo específico
setfacl -m g:desenvolvedores:rw /var/www/meu-site/

# Ver as ACLs de um arquivo
getfacl arquivo.txt

# Remover uma ACL específica
setfacl -x u:maria arquivo.txt

# Remover todas as ACLs
setfacl -b arquivo.txt

# Aplicar recursivamente
setfacl -R -m u:maria:rwx /var/www/meu-site/

# Quando ACL está ativa, ls -l mostra um "+" ao final:
# -rw-rw-r--+  joao joao  arquivo.txt`}
      />
    </PageContainer>
  );
}
