import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Usuarios() {
  return (
    <PageContainer
      title="Usuários, Grupos e Permissões de Acesso"
      subtitle="Domine o gerenciamento de usuários e grupos no Linux. Entenda como o sistema controla quem pode fazer o quê."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        O Linux é um sistema multiusuário desde sua concepção. Isso significa que múltiplas pessoas podem usar o mesmo
        computador, cada uma com seu próprio espaço, configurações e permissões. Entender como gerenciar usuários e
        grupos é fundamental para administrar qualquer sistema Linux.
      </p>

      <h2>1. Identificando o Usuário Atual</h2>

      <h3>whoami</h3>
      <p>Mostra o nome do usuário que está executando o comando.</p>
      <CodeBlock code={`whoami
# Saída: joao`} />

      <h3>id</h3>
      <p>Mostra informações detalhadas sobre o usuário: UID, GID e todos os grupos aos quais pertence.</p>
      <CodeBlock code={`id
# uid=1000(joao) gid=1000(joao) grupos=1000(joao),998(wheel),990(video),986(audio)

# Ver informações de outro usuário
id maria

# Mostrar apenas o UID numérico
id -u

# Mostrar apenas o GID numérico
id -g

# Mostrar apenas os grupos
id -G

# Mostrar nomes em vez de números (combinado com -G)
id -Gn`} />

      <h3>w e who</h3>
      <p>Mostram quem está logado no sistema neste momento.</p>
      <CodeBlock code={`# Mostra usuários logados com detalhes (o que estão fazendo, há quanto tempo)
w

# Versão mais simples
who

# Mostra também o runlevel e data do último boot
who -a`} />

      <h2>2. Arquivos Fundamentais do Sistema</h2>

      <h3>/etc/passwd</h3>
      <p>
        Este arquivo contém informações sobre todos os usuários do sistema. Cada linha representa um usuário,
        com campos separados por dois-pontos.
      </p>
      <CodeBlock code={`# Formato de cada linha:
# usuario:x:UID:GID:comentário:diretório_home:shell

# Exemplo real:
joao:x:1000:1000:João Silva:/home/joao:/bin/bash
root:x:0:0:root:/root:/bin/bash
nobody:x:65534:65534:Nobody:/:/usr/bin/nologin`} title="/etc/passwd" />
      <p>Explicação dos campos:</p>
      <ul>
        <li><strong>usuario</strong> - Nome de login</li>
        <li><strong>x</strong> - Indica que a senha está no /etc/shadow</li>
        <li><strong>UID</strong> - User ID numérico (0 = root, 1-999 = sistema, 1000+ = usuários normais)</li>
        <li><strong>GID</strong> - Group ID do grupo primário</li>
        <li><strong>comentário</strong> - Nome completo ou descrição (campo GECOS)</li>
        <li><strong>diretório_home</strong> - Caminho do diretório pessoal</li>
        <li><strong>shell</strong> - Shell padrão do usuário</li>
      </ul>

      <h3>/etc/shadow</h3>
      <p>
        Contém as senhas criptografadas dos usuários. Somente o root pode ler este arquivo.
      </p>
      <CodeBlock code={`# Formato:
# usuario:senha_hash:última_mudança:mín:máx:aviso:inativo:expiração:reservado

# Exemplo:
joao:$6$rounds=656000$salt$hash...:19500:0:99999:7:::

# Ver o conteúdo (precisa de root)
sudo cat /etc/shadow`} title="/etc/shadow" />

      <AlertBox type="danger" title="Nunca edite /etc/shadow manualmente">
        Sempre use os comandos <code>passwd</code>, <code>chage</code> ou <code>usermod</code> para modificar
        informações de senha. Editar manualmente pode corromper o arquivo e impedir logins.
      </AlertBox>

      <h3>/etc/group</h3>
      <p>Define os grupos do sistema e seus membros.</p>
      <CodeBlock code={`# Formato:
# grupo:x:GID:membros

# Exemplos:
wheel:x:998:joao,maria
audio:x:986:joao
video:x:990:joao,maria
docker:x:969:joao

# Ver todos os grupos
cat /etc/group

# Filtrar um grupo específico
grep wheel /etc/group`} title="/etc/group" />

      <h2>3. Criando Usuários - useradd</h2>

      <CodeBlock code={`# Criar usuário com configurações padrão (NÃO cria home, NÃO define shell)
sudo useradd maria

# Criar usuário da forma CORRETA (com home e shell bash)
sudo useradd -m -s /bin/bash maria

# Criar usuário com nome completo (campo GECOS)
sudo useradd -m -s /bin/bash -c "Maria Silva" maria

# Criar usuário e já adicionar a grupos extras
sudo useradd -m -s /bin/bash -G wheel,audio,video maria

# Criar usuário com UID específico
sudo useradd -m -s /bin/bash -u 1500 maria

# Criar usuário com diretório home em local diferente
sudo useradd -m -d /opt/maria -s /bin/bash maria

# Criar usuário de sistema (sem home, sem login - para serviços)
sudo useradd -r -s /usr/bin/nologin servico_app`} />

      <p>Flags mais importantes do useradd:</p>
      <ul>
        <li><code>-m</code> - Cria o diretório home automaticamente</li>
        <li><code>-s</code> - Define o shell padrão</li>
        <li><code>-c</code> - Comentário (nome completo)</li>
        <li><code>-G</code> - Grupos suplementares (separados por vírgula, sem espaços)</li>
        <li><code>-g</code> - Grupo primário</li>
        <li><code>-u</code> - Define o UID manualmente</li>
        <li><code>-d</code> - Define o caminho do diretório home</li>
        <li><code>-r</code> - Cria usuário de sistema (UID abaixo de 1000)</li>
        <li><code>-e</code> - Data de expiração da conta (AAAA-MM-DD)</li>
      </ul>

      <AlertBox type="info" title="useradd vs adduser">
        No Arch Linux, <code>adduser</code> não existe por padrão. Use sempre <code>useradd</code>.
        Em distribuições como Ubuntu/Debian, <code>adduser</code> é um script interativo que facilita o processo.
      </AlertBox>

      <h2>4. Modificando Usuários - usermod</h2>

      <CodeBlock code={`# Adicionar usuário a um grupo EXTRA (sem remover dos grupos atuais)
sudo usermod -aG wheel joao

# CUIDADO: sem o -a, ele SUBSTITUI todos os grupos!
# ERRADO (remove de todos os outros grupos):
sudo usermod -G wheel joao

# CORRETO (adiciona ao grupo wheel mantendo os outros):
sudo usermod -aG wheel joao

# Mudar o nome de login
sudo usermod -l novo_nome nome_antigo

# Mudar o diretório home (e mover os arquivos)
sudo usermod -d /home/novo_home -m joao

# Mudar o shell padrão
sudo usermod -s /bin/zsh joao

# Bloquear uma conta (adiciona ! antes do hash da senha)
sudo usermod -L joao

# Desbloquear uma conta
sudo usermod -U joao

# Definir data de expiração
sudo usermod -e 2025-12-31 joao

# Mudar o comentário (nome completo)
sudo usermod -c "João Pedro Silva" joao`} />

      <AlertBox type="danger" title="Cuidado com usermod -G sem -a">
        O erro mais comum é esquecer o <code>-a</code> ao adicionar um usuário a um grupo.
        Sem o <code>-a</code>, o comando <strong>substitui</strong> todos os grupos suplementares,
        podendo remover o usuário do grupo wheel e perder acesso ao sudo!
      </AlertBox>

      <h2>5. Removendo Usuários - userdel</h2>

      <CodeBlock code={`# Remover usuário (mantém o diretório home e arquivos)
sudo userdel maria

# Remover usuário E seu diretório home
sudo userdel -r maria

# Forçar remoção mesmo se o usuário estiver logado
sudo userdel -f maria

# Remover completamente (home + forçar)
sudo userdel -rf maria`} />

      <AlertBox type="warning" title="Sempre use -r ao remover">
        Se você não usar <code>-r</code>, o diretório home do usuário fica no sistema ocupando espaço
        e com um UID numérico como dono, o que pode causar problemas de segurança.
      </AlertBox>

      <h2>6. Gerenciando Senhas - passwd</h2>

      <CodeBlock code={`# Alterar sua própria senha
passwd

# Alterar a senha de outro usuário (precisa de root)
sudo passwd maria

# Forçar o usuário a trocar a senha no próximo login
sudo passwd -e maria

# Bloquear a conta (desabilitar login)
sudo passwd -l maria

# Desbloquear a conta
sudo passwd -u maria

# Remover a senha de uma conta (login sem senha - NÃO RECOMENDADO)
sudo passwd -d maria

# Ver o status da senha
sudo passwd -S joao
# Saída: joao P 2026-03-15 0 99999 7 -1`} />

      <h3>chage - Política de Senhas</h3>
      <CodeBlock code={`# Ver informações de expiração de senha
sudo chage -l joao

# Forçar troca de senha no próximo login
sudo chage -d 0 joao

# Definir senha para expirar a cada 90 dias
sudo chage -M 90 joao

# Definir dias mínimos entre trocas de senha
sudo chage -m 7 joao

# Definir data de expiração da conta
sudo chage -E 2025-12-31 joao

# Avisar 14 dias antes da senha expirar
sudo chage -W 14 joao`} />

      <h2>7. Gerenciando Grupos</h2>

      <h3>groups</h3>
      <CodeBlock code={`# Ver os grupos do usuário atual
groups

# Ver os grupos de outro usuário
groups maria`} />

      <h3>groupadd</h3>
      <CodeBlock code={`# Criar um novo grupo
sudo groupadd desenvolvedores

# Criar grupo com GID específico
sudo groupadd -g 2000 desenvolvedores

# Criar grupo de sistema
sudo groupadd -r servico_grupo`} />

      <h3>groupmod</h3>
      <CodeBlock code={`# Renomear um grupo
sudo groupmod -n novo_nome nome_antigo

# Mudar o GID de um grupo
sudo groupmod -g 3000 desenvolvedores`} />

      <h3>groupdel</h3>
      <CodeBlock code={`# Remover um grupo
sudo groupdel desenvolvedores`} />

      <h3>gpasswd</h3>
      <CodeBlock code={`# Adicionar usuário a um grupo (alternativa ao usermod -aG)
sudo gpasswd -a joao wheel

# Remover usuário de um grupo
sudo gpasswd -d joao docker

# Definir administradores do grupo
sudo gpasswd -A joao desenvolvedores`} />

      <h2>8. Alternando Entre Usuários - su e sudo</h2>

      <h3>su - Switch User</h3>
      <CodeBlock code={`# Abrir shell como root (precisa da senha do root)
su

# Abrir shell como root COM o ambiente do root (recomendado)
su -

# Trocar para outro usuário
su - maria

# Executar um comando como outro usuário sem abrir shell
su - maria -c "whoami"`} />

      <AlertBox type="info" title="Diferença entre su e su -">
        O <code>su</code> simples troca o usuário mas mantém as variáveis de ambiente do usuário original.
        O <code>su -</code> (com hífen) simula um login completo, carregando o ambiente do novo usuário.
        Sempre prefira <code>su -</code>.
      </AlertBox>

      <h3>sudo - Execute como Root</h3>
      <p>
        O <code>sudo</code> permite executar comandos como root (ou outro usuário) sem precisar da senha do root.
        No Arch Linux, para usar o sudo, o usuário precisa estar no grupo <code>wheel</code>.
      </p>

      <CodeBlock code={`# Executar um comando como root
sudo pacman -Syu

# Editar o arquivo de configuração do sudo
sudo visudo

# Executar comando como outro usuário
sudo -u maria comando

# Abrir um shell de root
sudo -i

# Repetir o último comando com sudo
sudo !!

# Ver os privilégios sudo do usuário atual
sudo -l

# Limpar o cache de senha do sudo (pedir senha novamente)
sudo -k`} />

      <h3>Configurando o sudo - visudo</h3>
      <CodeBlock code={`# SEMPRE edite com visudo (ele valida a sintaxe antes de salvar)
sudo EDITOR=nano visudo

# Linha que permite o grupo wheel usar sudo:
%wheel ALL=(ALL:ALL) ALL

# Permitir sudo sem senha para o grupo wheel:
%wheel ALL=(ALL:ALL) NOPASSWD: ALL

# Permitir apenas comandos específicos sem senha:
joao ALL=(ALL) NOPASSWD: /usr/bin/pacman, /usr/bin/systemctl`} title="/etc/sudoers" />

      <AlertBox type="danger" title="Nunca edite /etc/sudoers diretamente!">
        Sempre use <code>visudo</code> para editar o arquivo sudoers. Ele verifica a sintaxe antes de salvar.
        Um erro de sintaxe nesse arquivo pode impedir qualquer uso do sudo, deixando você trancado fora do sistema.
      </AlertBox>

      <h2>9. Grupos Importantes no Arch Linux</h2>
      <ul>
        <li><strong>wheel</strong> - Permite uso do sudo</li>
        <li><strong>audio</strong> - Acesso direto ao hardware de áudio</li>
        <li><strong>video</strong> - Acesso direto ao hardware de vídeo</li>
        <li><strong>storage</strong> - Acesso a dispositivos de armazenamento removíveis</li>
        <li><strong>network</strong> - Pode alterar configurações de rede via NetworkManager</li>
        <li><strong>docker</strong> - Permite usar Docker sem sudo</li>
        <li><strong>libvirt</strong> - Permite gerenciar máquinas virtuais</li>
        <li><strong>uucp</strong> - Acesso a portas seriais (Arduino, etc.)</li>
        <li><strong>input</strong> - Acesso a dispositivos de entrada</li>
      </ul>

      <h2>10. Receitas Práticas</h2>

      <h3>Criar um novo usuário completo no Arch Linux</h3>
      <CodeBlock code={`# 1. Criar o usuário com home e shell
sudo useradd -m -s /bin/bash -c "Maria Silva" maria

# 2. Definir a senha
sudo passwd maria

# 3. Adicionar aos grupos necessários
sudo usermod -aG wheel,audio,video,storage maria

# 4. Verificar se tudo está correto
id maria
# uid=1001(maria) gid=1001(maria) grupos=1001(maria),998(wheel),986(audio),990(video),987(storage)`} />

      <h3>Listar todos os usuários humanos do sistema</h3>
      <CodeBlock code={`# Usuários com UID >= 1000 (excluindo nobody)
awk -F: '$3 >= 1000 && $3 < 65534 {print $1, $3, $7}' /etc/passwd`} />

      <h3>Ver último login de cada usuário</h3>
      <CodeBlock code={`# Mostra o histórico de logins
last

# Mostra o último login de cada usuário
lastlog

# Mostrar apenas logins recentes
last -n 10`} />

      <h3>Encontrar arquivos de um usuário removido</h3>
      <CodeBlock code={`# Encontrar arquivos sem dono (UID que não existe mais)
sudo find / -nouser -o -nogroup 2>/dev/null`} />

    </PageContainer>
  );
}
