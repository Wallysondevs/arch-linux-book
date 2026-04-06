import{j as o}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as e}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function l(){return o.jsxs(r,{title:"Usuários, Grupos e Permissões de Acesso",subtitle:"Domine o gerenciamento de usuários e grupos no Linux. Entenda como o sistema controla quem pode fazer o quê.",difficulty:"intermediario",timeToRead:"25 min",children:[o.jsx("p",{children:"O Linux é um sistema multiusuário desde sua concepção. Isso significa que múltiplas pessoas podem usar o mesmo computador, cada uma com seu próprio espaço, configurações e permissões. Entender como gerenciar usuários e grupos é fundamental para administrar qualquer sistema Linux."}),o.jsx("h2",{children:"1. Identificando o Usuário Atual"}),o.jsx("h3",{children:"whoami"}),o.jsx("p",{children:"Mostra o nome do usuário que está executando o comando."}),o.jsx(e,{code:`whoami
# Saída: joao`}),o.jsx("h3",{children:"id"}),o.jsx("p",{children:"Mostra informações detalhadas sobre o usuário: UID, GID e todos os grupos aos quais pertence."}),o.jsx(e,{code:`id
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
id -Gn`}),o.jsx("h3",{children:"w e who"}),o.jsx("p",{children:"Mostram quem está logado no sistema neste momento."}),o.jsx(e,{code:`# Mostra usuários logados com detalhes (o que estão fazendo, há quanto tempo)
w

# Versão mais simples
who

# Mostra também o runlevel e data do último boot
who -a`}),o.jsx("h2",{children:"2. Arquivos Fundamentais do Sistema"}),o.jsx("h3",{children:"/etc/passwd"}),o.jsx("p",{children:"Este arquivo contém informações sobre todos os usuários do sistema. Cada linha representa um usuário, com campos separados por dois-pontos."}),o.jsx(e,{code:`# Formato de cada linha:
# usuario:x:UID:GID:comentário:diretório_home:shell

# Exemplo real:
joao:x:1000:1000:João Silva:/home/joao:/bin/bash
root:x:0:0:root:/root:/bin/bash
nobody:x:65534:65534:Nobody:/:/usr/bin/nologin`,title:"/etc/passwd"}),o.jsx("p",{children:"Explicação dos campos:"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"usuario"})," - Nome de login"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"x"})," - Indica que a senha está no /etc/shadow"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"UID"})," - User ID numérico (0 = root, 1-999 = sistema, 1000+ = usuários normais)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"GID"})," - Group ID do grupo primário"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"comentário"})," - Nome completo ou descrição (campo GECOS)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"diretório_home"})," - Caminho do diretório pessoal"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"shell"})," - Shell padrão do usuário"]})]}),o.jsx("h3",{children:"/etc/shadow"}),o.jsx("p",{children:"Contém as senhas criptografadas dos usuários. Somente o root pode ler este arquivo."}),o.jsx(e,{code:`# Formato:
# usuario:senha_hash:última_mudança:mín:máx:aviso:inativo:expiração:reservado

# Exemplo:
joao:$6$rounds=656000$salt$hash...:19500:0:99999:7:::

# Ver o conteúdo (precisa de root)
sudo cat /etc/shadow`,title:"/etc/shadow"}),o.jsxs(s,{type:"danger",title:"Nunca edite /etc/shadow manualmente",children:["Sempre use os comandos ",o.jsx("code",{children:"passwd"}),", ",o.jsx("code",{children:"chage"})," ou ",o.jsx("code",{children:"usermod"})," para modificar informações de senha. Editar manualmente pode corromper o arquivo e impedir logins."]}),o.jsx("h3",{children:"/etc/group"}),o.jsx("p",{children:"Define os grupos do sistema e seus membros."}),o.jsx(e,{code:`# Formato:
# grupo:x:GID:membros

# Exemplos:
wheel:x:998:joao,maria
audio:x:986:joao
video:x:990:joao,maria
docker:x:969:joao

# Ver todos os grupos
cat /etc/group

# Filtrar um grupo específico
grep wheel /etc/group`,title:"/etc/group"}),o.jsx("h2",{children:"3. Criando Usuários - useradd"}),o.jsx(e,{code:`# Criar usuário com configurações padrão (NÃO cria home, NÃO define shell)
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
sudo useradd -r -s /usr/bin/nologin servico_app`}),o.jsx("p",{children:"Flags mais importantes do useradd:"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("code",{children:"-m"})," - Cria o diretório home automaticamente"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-s"})," - Define o shell padrão"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-c"})," - Comentário (nome completo)"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-G"})," - Grupos suplementares (separados por vírgula, sem espaços)"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-g"})," - Grupo primário"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-u"})," - Define o UID manualmente"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-d"})," - Define o caminho do diretório home"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-r"})," - Cria usuário de sistema (UID abaixo de 1000)"]}),o.jsxs("li",{children:[o.jsx("code",{children:"-e"})," - Data de expiração da conta (AAAA-MM-DD)"]})]}),o.jsxs(s,{type:"info",title:"useradd vs adduser",children:["No Arch Linux, ",o.jsx("code",{children:"adduser"})," não existe por padrão. Use sempre ",o.jsx("code",{children:"useradd"}),". Em distribuições como Ubuntu/Debian, ",o.jsx("code",{children:"adduser"})," é um script interativo que facilita o processo."]}),o.jsx("h2",{children:"4. Modificando Usuários - usermod"}),o.jsx(e,{code:`# Adicionar usuário a um grupo EXTRA (sem remover dos grupos atuais)
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
sudo usermod -c "João Pedro Silva" joao`}),o.jsxs(s,{type:"danger",title:"Cuidado com usermod -G sem -a",children:["O erro mais comum é esquecer o ",o.jsx("code",{children:"-a"})," ao adicionar um usuário a um grupo. Sem o ",o.jsx("code",{children:"-a"}),", o comando ",o.jsx("strong",{children:"substitui"})," todos os grupos suplementares, podendo remover o usuário do grupo wheel e perder acesso ao sudo!"]}),o.jsx("h2",{children:"5. Removendo Usuários - userdel"}),o.jsx(e,{code:`# Remover usuário (mantém o diretório home e arquivos)
sudo userdel maria

# Remover usuário E seu diretório home
sudo userdel -r maria

# Forçar remoção mesmo se o usuário estiver logado
sudo userdel -f maria

# Remover completamente (home + forçar)
sudo userdel -rf maria`}),o.jsxs(s,{type:"warning",title:"Sempre use -r ao remover",children:["Se você não usar ",o.jsx("code",{children:"-r"}),", o diretório home do usuário fica no sistema ocupando espaço e com um UID numérico como dono, o que pode causar problemas de segurança."]}),o.jsx("h2",{children:"6. Gerenciando Senhas - passwd"}),o.jsx(e,{code:`# Alterar sua própria senha
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
# Saída: joao P 2026-03-15 0 99999 7 -1`}),o.jsx("h3",{children:"chage - Política de Senhas"}),o.jsx(e,{code:`# Ver informações de expiração de senha
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
sudo chage -W 14 joao`}),o.jsx("h2",{children:"7. Gerenciando Grupos"}),o.jsx("h3",{children:"groups"}),o.jsx(e,{code:`# Ver os grupos do usuário atual
groups

# Ver os grupos de outro usuário
groups maria`}),o.jsx("h3",{children:"groupadd"}),o.jsx(e,{code:`# Criar um novo grupo
sudo groupadd desenvolvedores

# Criar grupo com GID específico
sudo groupadd -g 2000 desenvolvedores

# Criar grupo de sistema
sudo groupadd -r servico_grupo`}),o.jsx("h3",{children:"groupmod"}),o.jsx(e,{code:`# Renomear um grupo
sudo groupmod -n novo_nome nome_antigo

# Mudar o GID de um grupo
sudo groupmod -g 3000 desenvolvedores`}),o.jsx("h3",{children:"groupdel"}),o.jsx(e,{code:`# Remover um grupo
sudo groupdel desenvolvedores`}),o.jsx("h3",{children:"gpasswd"}),o.jsx(e,{code:`# Adicionar usuário a um grupo (alternativa ao usermod -aG)
sudo gpasswd -a joao wheel

# Remover usuário de um grupo
sudo gpasswd -d joao docker

# Definir administradores do grupo
sudo gpasswd -A joao desenvolvedores`}),o.jsx("h2",{children:"8. Alternando Entre Usuários - su e sudo"}),o.jsx("h3",{children:"su - Switch User"}),o.jsx(e,{code:`# Abrir shell como root (precisa da senha do root)
su

# Abrir shell como root COM o ambiente do root (recomendado)
su -

# Trocar para outro usuário
su - maria

# Executar um comando como outro usuário sem abrir shell
su - maria -c "whoami"`}),o.jsxs(s,{type:"info",title:"Diferença entre su e su -",children:["O ",o.jsx("code",{children:"su"})," simples troca o usuário mas mantém as variáveis de ambiente do usuário original. O ",o.jsx("code",{children:"su -"})," (com hífen) simula um login completo, carregando o ambiente do novo usuário. Sempre prefira ",o.jsx("code",{children:"su -"}),"."]}),o.jsx("h3",{children:"sudo - Execute como Root"}),o.jsxs("p",{children:["O ",o.jsx("code",{children:"sudo"})," permite executar comandos como root (ou outro usuário) sem precisar da senha do root. No Arch Linux, para usar o sudo, o usuário precisa estar no grupo ",o.jsx("code",{children:"wheel"}),"."]}),o.jsx(e,{code:`# Executar um comando como root
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
sudo -k`}),o.jsx("h3",{children:"Configurando o sudo - visudo"}),o.jsx(e,{code:`# SEMPRE edite com visudo (ele valida a sintaxe antes de salvar)
sudo EDITOR=nano visudo

# Linha que permite o grupo wheel usar sudo:
%wheel ALL=(ALL:ALL) ALL

# Permitir sudo sem senha para o grupo wheel:
%wheel ALL=(ALL:ALL) NOPASSWD: ALL

# Permitir apenas comandos específicos sem senha:
joao ALL=(ALL) NOPASSWD: /usr/bin/pacman, /usr/bin/systemctl`,title:"/etc/sudoers"}),o.jsxs(s,{type:"danger",title:"Nunca edite /etc/sudoers diretamente!",children:["Sempre use ",o.jsx("code",{children:"visudo"})," para editar o arquivo sudoers. Ele verifica a sintaxe antes de salvar. Um erro de sintaxe nesse arquivo pode impedir qualquer uso do sudo, deixando você trancado fora do sistema."]}),o.jsx("h2",{children:"9. Grupos Importantes no Arch Linux"}),o.jsxs("ul",{children:[o.jsxs("li",{children:[o.jsx("strong",{children:"wheel"})," - Permite uso do sudo"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"audio"})," - Acesso direto ao hardware de áudio"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"video"})," - Acesso direto ao hardware de vídeo"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"storage"})," - Acesso a dispositivos de armazenamento removíveis"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"network"})," - Pode alterar configurações de rede via NetworkManager"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"docker"})," - Permite usar Docker sem sudo"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"libvirt"})," - Permite gerenciar máquinas virtuais"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"uucp"})," - Acesso a portas seriais (Arduino, etc.)"]}),o.jsxs("li",{children:[o.jsx("strong",{children:"input"})," - Acesso a dispositivos de entrada"]})]}),o.jsx("h2",{children:"10. Receitas Práticas"}),o.jsx("h3",{children:"Criar um novo usuário completo no Arch Linux"}),o.jsx(e,{code:`# 1. Criar o usuário com home e shell
sudo useradd -m -s /bin/bash -c "Maria Silva" maria

# 2. Definir a senha
sudo passwd maria

# 3. Adicionar aos grupos necessários
sudo usermod -aG wheel,audio,video,storage maria

# 4. Verificar se tudo está correto
id maria
# uid=1001(maria) gid=1001(maria) grupos=1001(maria),998(wheel),986(audio),990(video),987(storage)`}),o.jsx("h3",{children:"Listar todos os usuários humanos do sistema"}),o.jsx(e,{code:`# Usuários com UID >= 1000 (excluindo nobody)
awk -F: '$3 >= 1000 && $3 < 65534 {print $1, $3, $7}' /etc/passwd`}),o.jsx("h3",{children:"Ver último login de cada usuário"}),o.jsx(e,{code:`# Mostra o histórico de logins
last

# Mostra o último login de cada usuário
lastlog

# Mostrar apenas logins recentes
last -n 10`}),o.jsx("h3",{children:"Encontrar arquivos de um usuário removido"}),o.jsx(e,{code:`# Encontrar arquivos sem dono (UID que não existe mais)
sudo find / -nouser -o -nogroup 2>/dev/null`})]})}export{l as default};
