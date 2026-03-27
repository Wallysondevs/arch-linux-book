import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Usuarios() {
  return (
    <PageContainer
      title="Usuários e Grupos"
      subtitle="Criando e gerenciando usuários, grupos e privilégios sudo no Ubuntu — a base da administração de sistemas."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        O Linux é um sistema multiusuário. Entender como criar, modificar e gerenciar usuários e
        grupos é fundamental tanto para uso pessoal quanto para administrar servidores Ubuntu.
        O Ubuntu tem algumas diferenças em relação a outras distribuições — principalmente
        o uso do <strong>sudo</strong> ao invés de habilitar o login root diretamente.
      </p>

      <h2>O Sistema de Usuários no Ubuntu</h2>
      <AlertBox type="info" title="Ubuntu e o usuário root">
        Por padrão, o Ubuntu <strong>desabilita o login direto como root</strong>. Em vez disso,
        o primeiro usuário criado durante a instalação recebe privilégios sudo completos.
        Para executar comandos como root, use <code>sudo</code> antes do comando. Para abrir
        um shell root temporário: <code>sudo -i</code> ou <code>sudo su</code>.
      </AlertBox>

      <h2>Identificando Usuários</h2>
      <CodeBlock
        title="Comandos para identificar usuários"
        code={`# Quem sou eu?
whoami
# joao

# Informações detalhadas: UID, GID e grupos
id
# uid=1000(joao) gid=1000(joao) grupos=1000(joao),4(adm),24(cdrom),27(sudo),46(plugdev)

# Ver informações de outro usuário
id maria

# Quem está logado no sistema agora?
who
w          # Versão mais detalhada (mostra o que cada um está fazendo)
last       # Histórico de logins`}
      />

      <h2>Arquivos Fundamentais</h2>
      <CodeBlock
        title="Os arquivos de usuários do sistema"
        code={`# /etc/passwd — informações de todos os usuários
cat /etc/passwd | head -5
# root:x:0:0:root:/root:/bin/bash
# daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
# joao:x:1000:1000:João Silva,,,:/home/joao:/bin/bash

# Formato: usuario:x:UID:GID:GECOS:home:shell
# UID 0      = root
# UID 1-999  = usuários de sistema/serviços
# UID 1000+  = usuários normais

# /etc/shadow — senhas criptografadas (apenas root pode ler)
sudo cat /etc/shadow | grep joao

# /etc/group — definição dos grupos
cat /etc/group | grep sudo
# sudo:x:27:joao,maria  ← usuários no grupo sudo

# Ver grupos do usuário atual
groups
# joao adm cdrom sudo dip plugdev lpadmin sambashare`}
      />

      <h2>Criando Usuários</h2>

      <h3>adduser (Método Recomendado no Ubuntu)</h3>
      <CodeBlock
        title="Criar usuário com adduser (interativo)"
        code={`# adduser é mais amigável que useradd no Ubuntu
sudo adduser maria

# Saída interativa:
# Adding user 'maria' ...
# New password: ****
# Retype new password: ****
# passwd: password updated successfully
# Changing the user information for maria
# Enter the new value, or press ENTER for the default
#         Full Name []: Maria Silva
#         Room Number []:
#         Work Phone []:
#         Home Phone []:
#         Other []:
# Is the information correct? [Y/n] Y

# adduser automaticamente:
# - Cria o diretório /home/maria
# - Copia arquivos padrão de /etc/skel
# - Define o shell como /bin/bash
# - Cria um grupo "maria"`}
      />

      <h3>useradd (Modo Script — Mais Controle)</h3>
      <CodeBlock
        title="Criar usuário com useradd"
        code={`# Criar usuário da forma correta (com home e shell)
sudo useradd -m -s /bin/bash -c "Maria Silva" maria

# Flags importantes:
# -m = criar diretório home
# -s = definir shell padrão
# -c = comentário (nome completo)
# -G = grupos suplementares
# -u = UID específico

# Criar usuário e já adicionar a grupos extras
sudo useradd -m -s /bin/bash -G sudo,docker,www-data maria

# Definir senha após criar o usuário:
sudo passwd maria

# Criar usuário de sistema (para serviços — sem home, sem login)
sudo useradd -r -s /usr/sbin/nologin meu-servico`}
      />

      <h2>Modificando Usuários</h2>
      <CodeBlock
        title="Modificar usuários existentes"
        code={`# Mudar senha de um usuário
sudo passwd maria

# Forçar mudança de senha no próximo login
sudo passwd -e maria

# Bloquear login de um usuário (sem deletar)
sudo passwd -l maria

# Desbloquear login
sudo passwd -u maria

# Mudar o shell padrão
sudo usermod -s /bin/zsh maria
sudo usermod -s /bin/bash maria

# Mudar o nome completo (GECOS)
sudo usermod -c "Maria Oliveira Silva" maria

# Mudar o diretório home
sudo usermod -d /novo/home/maria -m maria  # -m move os arquivos

# Mudar o nome de login (renomear usuário)
sudo usermod -l maria-nova maria

# Adicionar usuário a um grupo
sudo usermod -aG docker maria    # -a = append (não remove outros grupos)
sudo usermod -aG sudo maria      # Dar privilégios sudo

# Remover usuário de um grupo (via gpasswd)
sudo gpasswd -d maria docker`}
      />

      <h2>Removendo Usuários</h2>
      <CodeBlock
        title="Remover usuários"
        code={`# Remover usuário (mantém o diretório home)
sudo deluser maria

# Remover usuário E o diretório home
sudo deluser --remove-home maria

# Remover usuário, home E arquivos do usuário em outros locais
sudo deluser --remove-all-files maria

# Ou usando userdel (mais básico):
sudo userdel maria        # Mantém home
sudo userdel -r maria     # Remove home também`}
      />

      <h2>Grupos</h2>
      <CodeBlock
        title="Gerenciando grupos"
        code={`# Criar um novo grupo
sudo groupadd desenvolvedores

# Criar grupo com GID específico
sudo groupadd -g 1500 desenvolvedores

# Adicionar usuário a um grupo
sudo usermod -aG desenvolvedores joao
sudo usermod -aG desenvolvedores maria
# Ou:
sudo gpasswd -a joao desenvolvedores

# Remover usuário de um grupo
sudo gpasswd -d joao desenvolvedores

# Definir administradores do grupo
sudo gpasswd -A joao desenvolvedores  # joao pode gerenciar o grupo

# Ver membros de um grupo
getent group docker
cat /etc/group | grep desenvolvedores

# Mudar o grupo primário temporariamente na sessão atual
newgrp docker   # Você vira membro ativo do grupo docker até sair

# Remover grupo
sudo groupdel desenvolvedores

# Renomear grupo
sudo groupmod -n novo-nome desenvolvedores`}
      />

      <AlertBox type="warning" title="Efetividade de novos grupos">
        Quando você adiciona um usuário a um novo grupo com <code>usermod -aG</code>, a mudança
        só é efetiva na <strong>próxima vez que o usuário fizer login</strong>. Para aplicar
        imediatamente na sessão atual, use <code>newgrp nome-do-grupo</code> ou faça logout/login.
      </AlertBox>

      <h2>Sudo — Privilégios de Administrador</h2>
      <CodeBlock
        title="Configurando e usando o sudo"
        code={`# Executar comando como root
sudo apt update

# Executar como outro usuário específico
sudo -u www-data php artisan migrate

# Abrir shell root temporário (expire com exit):
sudo -i
sudo su
sudo -s

# Ver o que você tem permissão para executar com sudo
sudo -l

# Editar o arquivo sudoers com segurança (NUNCA edite direto!)
sudo visudo

# Conteúdo padrão do /etc/sudoers:
# root    ALL=(ALL:ALL) ALL
# %sudo   ALL=(ALL:ALL) ALL   ← Grupo sudo tem acesso total

# Dar sudo a um usuário:
# Método 1: Adicionar ao grupo sudo (RECOMENDADO)
sudo usermod -aG sudo maria

# Método 2: Adicionar entrada no sudoers
sudo visudo
# Adicionar linha: maria ALL=(ALL:ALL) ALL

# Permitir comando sem senha (ex: para scripts de automação):
# No sudoers:
# deploy ALL=(ALL:ALL) NOPASSWD: /usr/bin/systemctl restart nginx

# Criar arquivo de configuração sudo separado (melhor prática):
sudo visudo -f /etc/sudoers.d/maria
# Conteúdo: maria ALL=(ALL:ALL) ALL`}
      />

      <h2>Grupos Importantes do Ubuntu</h2>
      <CodeBlock
        title="Grupos especiais que você precisa conhecer"
        code={`sudo        # Acesso completo de administrador (sudo)
adm         # Ler logs do sistema em /var/log
cdrom       # Acessar drive de CD/DVD
sudo        # Privilégios sudo
plugdev     # Montar dispositivos plug-and-play (USB, etc)
www-data    # Grupo do servidor web (Apache/Nginx)
docker      # Usar Docker sem sudo
lpadmin     # Gerenciar impressoras
sambashare  # Compartilhamento de arquivos Samba
dialout     # Acessar portas seriais (Arduino, modem)
video       # Acesso direto ao hardware de vídeo
audio       # Acesso ao hardware de áudio

# Ver todos os grupos disponíveis no sistema:
cat /etc/group | cut -d: -f1 | sort

# Ver a quais grupos você pertence:
groups $(whoami)`}
      />
    </PageContainer>
  );
}
