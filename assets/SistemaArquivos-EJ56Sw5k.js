import{j as e}from"./ui-K-J8Jkwj.js";import{P as a}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(a,{title:"Sistema de Arquivos do Linux (FHS)",subtitle:"Entenda a Filesystem Hierarchy Standard: a organização lógica de todos os diretórios do Linux e o que cada um armazena.",difficulty:"intermediario",timeToRead:"25 min",children:[e.jsxs("p",{children:["No Linux, tudo é organizado a partir de um único ponto: a raiz ",e.jsx("code",{children:"/"}),". Não existem letras de unidade como C: ou D: do Windows. Tudo — discos, pendrives, partições, dispositivos — é montado como parte de uma única árvore hierárquica."]}),e.jsxs("p",{children:["Essa organização segue um padrão chamado ",e.jsx("strong",{children:"FHS"})," (Filesystem Hierarchy Standard), que define onde cada tipo de arquivo deve ficar. Entender essa estrutura é essencial para administrar um sistema Linux com confiança."]}),e.jsx(o,{title:"Visão geral da árvore de diretórios",code:`/
├── bin       # Binários essenciais do sistema
├── boot      # Arquivos do bootloader e kernel
├── dev       # Dispositivos de hardware
├── etc       # Arquivos de configuração
├── home      # Diretórios dos usuários
├── lib       # Bibliotecas compartilhadas
├── media     # Mídias removíveis montadas automaticamente
├── mnt       # Ponto de montagem temporário
├── opt       # Softwares de terceiros
├── proc      # Informações de processos (virtual)
├── root      # Home do superusuário
├── run       # Dados de runtime
├── sbin      # Binários de administração do sistema
├── srv       # Dados de serviços
├── sys       # Informações do kernel (virtual)
├── tmp       # Arquivos temporários
├── usr       # Programas e dados do usuário (read-only)
└── var       # Dados variáveis (logs, cache, spool)`}),e.jsx("h2",{children:"/ — A Raiz (Root)"}),e.jsx("p",{children:"O diretório raiz é o topo absoluto da hierarquia. Todo caminho no Linux começa aqui. Ele é como o tronco de uma árvore — todos os outros diretórios são galhos."}),e.jsxs(s,{type:"danger",title:"Nunca mexa na raiz sem necessidade",children:["Não crie arquivos soltos em ",e.jsx("code",{children:"/"}),". Não delete nada em ",e.jsx("code",{children:"/"})," sem saber exatamente o que está fazendo. Um ",e.jsx("code",{children:"rm -rf /"})," (mesmo acidental) pode destruir todo o sistema operacional."]}),e.jsx("h2",{children:"/bin — Binários Essenciais"}),e.jsxs("p",{children:["Contém os programas (binários) essenciais para o funcionamento básico do sistema, disponíveis para todos os usuários. No Arch Linux moderno, ",e.jsx("code",{children:"/bin"})," é um link simbólico para ",e.jsx("code",{children:"/usr/bin"}),"."]}),e.jsx(o,{title:"Exemplos de arquivos em /bin",code:`ls /bin/bash      # O shell Bash
ls /bin/ls        # O comando ls
ls /bin/cp        # O comando cp
ls /bin/cat       # O comando cat
ls /bin/mount     # Comando de montagem

# Verificar que /bin é um link para /usr/bin
ls -la /bin
# lrwxrwxrwx 1 root root 7 jan  1 00:00 /bin -> usr/bin`}),e.jsx("h2",{children:"/boot — Arquivos de Boot"}),e.jsx("p",{children:"Contém tudo que é necessário para inicializar o sistema: o kernel Linux, a imagem initramfs e a configuração do bootloader (GRUB, systemd-boot, etc)."}),e.jsx(o,{title:"Conteúdo típico de /boot",code:`ls /boot/
# vmlinuz-linux          # O kernel Linux compilado
# initramfs-linux.img    # Imagem initramfs (sistema de arquivos inicial)
# initramfs-linux-fallback.img  # Imagem de fallback
# grub/                  # Configuração do GRUB (se usado)
# loader/                # Configuração do systemd-boot (se usado)
# EFI/                   # Partição EFI (em sistemas UEFI)`}),e.jsxs(s,{type:"danger",title:"Zona crítica!",children:["Deletar arquivos de ",e.jsx("code",{children:"/boot"})," pode tornar seu sistema impossível de inicializar. Só mexa aqui se souber exatamente o que está fazendo — e sempre tenha um pendrive de recuperação por perto."]}),e.jsx("h2",{children:"/dev — Dispositivos"}),e.jsxs("p",{children:["No Linux, dispositivos de hardware são representados como arquivos. O diretório ",e.jsx("code",{children:"/dev"}),"contém esses arquivos especiais de dispositivo. É um filesystem virtual mantido pelo kernel."]}),e.jsx(o,{title:"Dispositivos importantes em /dev",code:`# Discos e partições
/dev/sda         # Primeiro disco SATA/SCSI
/dev/sda1        # Primeira partição do primeiro disco
/dev/nvme0n1     # Primeiro disco NVMe
/dev/nvme0n1p1   # Primeira partição do NVMe

# Dispositivos especiais
/dev/null        # "Buraco negro" — tudo que você escreve aqui desaparece
/dev/zero        # Fonte infinita de zeros
/dev/urandom     # Fonte de dados aleatórios
/dev/tty         # Terminal atual

# Exemplos de uso
echo "descartável" > /dev/null    # Descartar saída
dd if=/dev/zero of=arquivo bs=1M count=100  # Criar arquivo de 100MB com zeros
cat /dev/urandom | head -c 32 | base64      # Gerar string aleatória`}),e.jsx("h2",{children:"/etc — Configuração do Sistema"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"/etc"})," (Editable Text Configuration) armazena praticamente todos os arquivos de configuração do sistema. É provavelmente o diretório mais importante para administradores de sistema."]}),e.jsx(o,{title:"Arquivos de configuração essenciais",code:`/etc/pacman.conf        # Configuração do pacman
/etc/pacman.d/mirrorlist  # Lista de mirrors do pacman
/etc/fstab              # Tabela de montagem de partições
/etc/hostname           # Nome do computador
/etc/hosts              # Mapeamento local de nomes para IPs
/etc/locale.conf        # Configuração de idioma
/etc/localtime          # Fuso horário (link simbólico)
/etc/passwd             # Informações de contas de usuários
/etc/shadow             # Senhas criptografadas dos usuários
/etc/group              # Definição de grupos
/etc/sudoers            # Configuração de permissões sudo
/etc/resolv.conf        # Configuração de DNS
/etc/systemd/           # Configurações do systemd
/etc/X11/               # Configuração do Xorg
/etc/mkinitcpio.conf    # Configuração do initramfs`}),e.jsxs(s,{type:"warning",title:"Sempre faça backup antes de editar",children:["Antes de editar qualquer arquivo em ",e.jsx("code",{children:"/etc"}),", faça uma cópia de segurança:",e.jsx("code",{children:"sudo cp /etc/pacman.conf /etc/pacman.conf.bak"}),". Se algo der errado, você pode restaurar facilmente."]}),e.jsx("h2",{children:"/home — Diretórios dos Usuários"}),e.jsxs("p",{children:["Cada usuário do sistema tem seu próprio diretório dentro de ",e.jsx("code",{children:"/home"}),". É aqui que ficam seus documentos, downloads, configurações pessoais de programas, etc."]}),e.jsx(o,{title:"Estrutura típica de /home",code:`/home/
├── usuario/
│   ├── .bashrc          # Configuração do Bash
│   ├── .config/         # Configurações de aplicativos (padrão XDG)
│   │   ├── i3/          # Config do i3wm
│   │   ├── nvim/        # Config do Neovim
│   │   └── gtk-3.0/     # Config do GTK
│   ├── .local/          # Dados e binários locais do usuário
│   │   ├── bin/         # Scripts pessoais
│   │   └── share/       # Dados de aplicativos
│   ├── .ssh/            # Chaves SSH
│   ├── Documentos/
│   ├── Downloads/
│   ├── Imagens/
│   ├── Música/
│   └── Vídeos/
└── outro-usuario/`}),e.jsxs(s,{type:"info",title:"Arquivos ocultos (dot files)",children:["No Linux, qualquer arquivo que começa com ponto (",e.jsx("code",{children:"."}),") é oculto. A maioria das configurações pessoais fica em arquivos ocultos no seu home. Use ",e.jsx("code",{children:"ls -a"})," para vê-los."]}),e.jsx("h2",{children:"/lib — Bibliotecas Compartilhadas"}),e.jsxs("p",{children:["Contém as bibliotecas compartilhadas (.so — Shared Objects) necessárias para os binários em ",e.jsx("code",{children:"/bin"})," e ",e.jsx("code",{children:"/sbin"})," funcionarem. É o equivalente às DLLs do Windows. No Arch moderno, ",e.jsx("code",{children:"/lib"})," é um link para ",e.jsx("code",{children:"/usr/lib"}),"."]}),e.jsx(o,{title:"Verificando bibliotecas",code:`# Ver de quais bibliotecas um programa depende
ldd /usr/bin/bash

# Listar bibliotecas do sistema
ls /usr/lib/*.so* | head -20`}),e.jsx("h2",{children:"/media — Mídias Removíveis"}),e.jsx("p",{children:"Ponto de montagem automática para dispositivos removíveis como pendrives, CDs, DVDs e HDs externos. Ambientes de desktop (GNOME, KDE) montam dispositivos USB aqui automaticamente."}),e.jsx(o,{title:"Exemplo de uso",code:`# Quando você insere um pendrive, ele aparece como:
ls /media/usuario/NOME_DO_PENDRIVE/

# Se estiver sem ambiente gráfico, monte manualmente em /mnt
sudo mount /dev/sdb1 /mnt`}),e.jsx("h2",{children:"/mnt — Montagem Temporária"}),e.jsx("p",{children:"Ponto de montagem para sistemas de arquivos montados temporariamente pelo administrador. Use esse diretório quando precisar montar uma partição manualmente para manutenção, recuperação ou acesso temporário."}),e.jsx(o,{title:"Uso típico de /mnt",code:`# Montar uma partição para recuperação
sudo mount /dev/sda2 /mnt

# Montar um compartilhamento de rede
sudo mount -t nfs servidor:/export /mnt

# Montar imagem ISO
sudo mount -o loop imagem.iso /mnt

# Desmontar quando terminar
sudo umount /mnt`}),e.jsx("h2",{children:"/opt — Software Opcional"}),e.jsx("p",{children:"Diretório para software de terceiros que não segue a estrutura padrão do sistema de pacotes. Programas como Google Chrome, Zoom, Discord e Spotify costumam instalar aqui quando não são empacotados nativamente."}),e.jsx(o,{title:"Exemplos em /opt",code:`ls /opt/
# google/
# visual-studio-code/
# discord/
# containerd/`}),e.jsx("h2",{children:"/proc — Sistema de Arquivos Virtual de Processos"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"/proc"})," não existe no disco — é um filesystem virtual criado pelo kernel em tempo real. Ele expõe informações sobre processos em execução e o estado do sistema."]}),e.jsx(o,{title:"Informações úteis em /proc",code:`# Informações da CPU
cat /proc/cpuinfo

# Informações da memória
cat /proc/meminfo

# Versão do kernel
cat /proc/version

# Tempo que o sistema está ligado
cat /proc/uptime

# Linha de comando do kernel (parâmetros de boot)
cat /proc/cmdline

# Informações sobre um processo específico (PID 1 = systemd)
ls /proc/1/
cat /proc/1/cmdline
cat /proc/1/status`}),e.jsx("h2",{children:"/root — Home do Root"}),e.jsxs("p",{children:["O diretório home do superusuário (root). Diferente dos outros usuários que ficam em ",e.jsx("code",{children:"/home/usuario"}),", o root tem seu home separado em ",e.jsx("code",{children:"/root"}),". Isso garante que o root possa acessar seus arquivos mesmo se ",e.jsx("code",{children:"/home"}),"estiver em uma partição separada que não montou."]}),e.jsxs(s,{type:"warning",title:"Não confunda / com /root",children:[e.jsx("code",{children:"/"})," é a raiz do sistema (diretório pai de tudo).",e.jsx("code",{children:"/root"})," é o diretório home do usuário root. São coisas completamente diferentes."]}),e.jsx("h2",{children:"/run — Dados de Runtime"}),e.jsx("p",{children:"Armazena dados voláteis de tempo de execução desde o último boot. É montado como tmpfs (na RAM) e é limpo a cada reinicialização. Programas como systemd, udev e NetworkManager guardam PIDs e sockets aqui."}),e.jsx("h2",{children:"/sbin — Binários de Administração"}),e.jsxs("p",{children:["Contém binários de administração do sistema — programas que normalmente só o root precisa executar. No Arch moderno, é um link para ",e.jsx("code",{children:"/usr/bin"}),"."]}),e.jsx(o,{title:"Exemplos de programas em /sbin",code:`# Exemplos históricos de /sbin (agora todos em /usr/bin)
fdisk        # Particionamento de disco
mkfs         # Criar sistema de arquivos
iptables     # Firewall
reboot       # Reiniciar
shutdown     # Desligar
ip           # Configuração de rede`}),e.jsx("h2",{children:"/srv — Dados de Serviços"}),e.jsx("p",{children:"Destinado a dados servidos pelo sistema — por exemplo, arquivos de um servidor web, servidor FTP, repositórios Git servidos via HTTP."}),e.jsx(o,{title:"Exemplos de uso de /srv",code:`# Servidor web
/srv/http/         # Arquivos servidos pelo Apache/Nginx
/srv/http/index.html

# Servidor FTP
/srv/ftp/          # Arquivos do FTP`}),e.jsx("h2",{children:"/sys — Informações do Kernel (Virtual)"}),e.jsxs("p",{children:["Assim como ",e.jsx("code",{children:"/proc"}),", o ",e.jsx("code",{children:"/sys"})," é um filesystem virtual. Ele expõe informações sobre dispositivos, drivers e módulos do kernel de forma organizada."]}),e.jsx(o,{title:"Exemplos úteis em /sys",code:`# Ajustar brilho da tela (em notebooks)
cat /sys/class/backlight/*/brightness
echo 100 | sudo tee /sys/class/backlight/*/brightness

# Ver informações de bateria
cat /sys/class/power_supply/BAT0/capacity

# Verificar se o sistema é UEFI
ls /sys/firmware/efi   # Se existir, é UEFI`}),e.jsx("h2",{children:"/tmp — Arquivos Temporários"}),e.jsx("p",{children:"Diretório para arquivos temporários. Qualquer usuário pode escrever aqui. O conteúdo é limpo automaticamente a cada reinicialização (montado como tmpfs no Arch)."}),e.jsx(o,{title:"Uso típico de /tmp",code:`# Criar arquivo temporário
echo "teste" > /tmp/meu-arquivo-temp.txt

# Scripts costumam usar /tmp para processamento intermediário
sort arquivo.csv > /tmp/arquivo-ordenado.csv

# Verificar tamanho do /tmp
df -h /tmp`}),e.jsxs(s,{type:"warning",title:"Não guarde nada importante em /tmp",children:["Tudo em ",e.jsx("code",{children:"/tmp"})," é apagado na reinicialização. Nunca guarde trabalhos, projetos ou qualquer coisa que você não possa perder aqui."]}),e.jsx("h2",{children:"/usr — Hierarquia Secundária (a maior do sistema)"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"/usr"})," (Unix System Resources) contém a maior parte dos programas, bibliotecas e dados do sistema. No Arch Linux moderno, quase tudo está aqui."]}),e.jsx(o,{title:"Estrutura de /usr",code:`/usr/
├── bin/          # Binários de todos os programas instalados
├── include/     # Headers C/C++ para compilação
├── lib/         # Bibliotecas compartilhadas
├── lib32/       # Bibliotecas 32-bit (multilib, para jogos/Wine)
├── local/       # Programas compilados manualmente
│   ├── bin/
│   ├── lib/
│   └── share/
├── share/       # Dados compartilhados independentes de arquitetura
│   ├── applications/   # Arquivos .desktop (ícones do menu)
│   ├── fonts/          # Fontes do sistema
│   ├── icons/          # Ícones de temas
│   ├── man/            # Páginas de manual (man pages)
│   └── doc/            # Documentação
└── src/         # Código-fonte (ex: código do kernel)`}),e.jsx("h2",{children:"/var — Dados Variáveis"}),e.jsx("p",{children:"Contém dados que mudam constantemente durante a operação do sistema: logs, cache de pacotes, filas de email, bancos de dados."}),e.jsx(o,{title:"Subdiretórios importantes de /var",code:`/var/
├── cache/
│   └── pacman/
│       └── pkg/       # Cache de pacotes baixados pelo pacman (pode ficar ENORME)
├── log/
│   ├── pacman.log     # Log de todas as operações do pacman
│   └── journal/       # Logs do systemd-journald
├── lib/
│   └── pacman/
│       └── local/     # Banco de dados dos pacotes instalados
├── mail/              # Caixas de email local
├── spool/             # Filas de tarefas (impressão, cron)
└── tmp/               # Temporários que persistem entre reboots`}),e.jsx(o,{title:"Comandos úteis para inspecionar /var",code:`# Ver quanto espaço o cache do pacman está usando
du -sh /var/cache/pacman/pkg/

# Ver os últimos logs do pacman
tail -50 /var/log/pacman.log

# Ver logs do sistema
sudo journalctl -xe

# Limpar cache do pacman (manter apenas a última versão)
sudo pacman -Sc`}),e.jsxs(s,{type:"info",title:"Dica de manutenção",children:["O diretório ",e.jsx("code",{children:"/var/cache/pacman/pkg/"})," pode crescer para dezenas de gigabytes com o tempo. Faça limpeza periódica com ",e.jsx("code",{children:"sudo pacman -Sc"})," ou use o utilitário ",e.jsx("code",{children:"paccache"})," do pacote ",e.jsx("code",{children:"pacman-contrib"})," para manter apenas as 3 últimas versões de cada pacote."]}),e.jsx("h2",{children:"Resumo Visual Rápido"}),e.jsx(o,{title:"Mapa mental da hierarquia",code:`/ (raiz)
│
├── Configuração:    /etc
├── Usuários:        /home, /root
├── Programas:       /usr/bin (antes /bin e /sbin)
├── Bibliotecas:     /usr/lib (antes /lib)
├── Boot:            /boot
├── Dispositivos:    /dev
├── Virtuais:        /proc, /sys, /run
├── Temporários:     /tmp
├── Dados variáveis: /var (logs, cache)
├── Montagem:        /mnt (manual), /media (auto)
├── Terceiros:       /opt
└── Serviços:        /srv`}),e.jsxs(s,{type:"success",title:"Regra geral",children:["Se você quer editar configurações, vá em ",e.jsx("code",{children:"/etc"}),". Se quer ver logs, vá em ",e.jsx("code",{children:"/var/log"}),". Se quer encontrar um programa, ele está em",e.jsx("code",{children:"/usr/bin"}),". Se quer ver seus arquivos, vá em ",e.jsx("code",{children:"/home"}),". Com o tempo, essa organização se torna intuitiva."]})]})}export{u as default};
