import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SistemaArquivos() {
  return (
    <PageContainer
      title="Sistema de Arquivos do Linux (FHS)"
      subtitle="Entenda a Filesystem Hierarchy Standard: a organização lógica de todos os diretórios do Linux e o que cada um armazena."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        No Linux, tudo é organizado a partir de um único ponto: a raiz <code>/</code>.
        Não existem letras de unidade como C: ou D: do Windows. Tudo — discos, pendrives,
        partições, dispositivos — é montado como parte de uma única árvore hierárquica.
      </p>
      <p>
        Essa organização segue um padrão chamado <strong>FHS</strong> (Filesystem Hierarchy Standard),
        que define onde cada tipo de arquivo deve ficar. Entender essa estrutura é essencial para
        administrar um sistema Linux com confiança.
      </p>

      <CodeBlock
        title="Visão geral da árvore de diretórios"
        code={`/
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
└── var       # Dados variáveis (logs, cache, spool)`}
      />

      <h2>/ — A Raiz (Root)</h2>
      <p>
        O diretório raiz é o topo absoluto da hierarquia. Todo caminho no Linux começa aqui.
        Ele é como o tronco de uma árvore — todos os outros diretórios são galhos.
      </p>
      <AlertBox type="danger" title="Nunca mexa na raiz sem necessidade">
        Não crie arquivos soltos em <code>/</code>. Não delete nada em <code>/</code> sem
        saber exatamente o que está fazendo. Um <code>rm -rf /</code> (mesmo acidental)
        pode destruir todo o sistema operacional.
      </AlertBox>

      <h2>/bin — Binários Essenciais</h2>
      <p>
        Contém os programas (binários) essenciais para o funcionamento básico do sistema,
        disponíveis para todos os usuários. No Arch Linux moderno, <code>/bin</code> é um
        link simbólico para <code>/usr/bin</code>.
      </p>
      <CodeBlock
        title="Exemplos de arquivos em /bin"
        code={`ls /bin/bash      # O shell Bash
ls /bin/ls        # O comando ls
ls /bin/cp        # O comando cp
ls /bin/cat       # O comando cat
ls /bin/mount     # Comando de montagem

# Verificar que /bin é um link para /usr/bin
ls -la /bin
# lrwxrwxrwx 1 root root 7 jan  1 00:00 /bin -> usr/bin`}
      />

      <h2>/boot — Arquivos de Boot</h2>
      <p>
        Contém tudo que é necessário para inicializar o sistema: o kernel Linux, a imagem
        initramfs e a configuração do bootloader (GRUB, systemd-boot, etc).
      </p>
      <CodeBlock
        title="Conteúdo típico de /boot"
        code={`ls /boot/
# vmlinuz-linux          # O kernel Linux compilado
# initramfs-linux.img    # Imagem initramfs (sistema de arquivos inicial)
# initramfs-linux-fallback.img  # Imagem de fallback
# grub/                  # Configuração do GRUB (se usado)
# loader/                # Configuração do systemd-boot (se usado)
# EFI/                   # Partição EFI (em sistemas UEFI)`}
      />
      <AlertBox type="danger" title="Zona crítica!">
        Deletar arquivos de <code>/boot</code> pode tornar seu sistema impossível de inicializar.
        Só mexa aqui se souber exatamente o que está fazendo — e sempre tenha um pendrive de
        recuperação por perto.
      </AlertBox>

      <h2>/dev — Dispositivos</h2>
      <p>
        No Linux, dispositivos de hardware são representados como arquivos. O diretório <code>/dev</code>
        contém esses arquivos especiais de dispositivo. É um filesystem virtual mantido pelo kernel.
      </p>
      <CodeBlock
        title="Dispositivos importantes em /dev"
        code={`# Discos e partições
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
cat /dev/urandom | head -c 32 | base64      # Gerar string aleatória`}
      />

      <h2>/etc — Configuração do Sistema</h2>
      <p>
        O <code>/etc</code> (Editable Text Configuration) armazena praticamente todos os
        arquivos de configuração do sistema. É provavelmente o diretório mais importante
        para administradores de sistema.
      </p>
      <CodeBlock
        title="Arquivos de configuração essenciais"
        code={`/etc/pacman.conf        # Configuração do pacman
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
/etc/mkinitcpio.conf    # Configuração do initramfs`}
      />
      <AlertBox type="warning" title="Sempre faça backup antes de editar">
        Antes de editar qualquer arquivo em <code>/etc</code>, faça uma cópia de segurança:
        <code>sudo cp /etc/pacman.conf /etc/pacman.conf.bak</code>. Se algo der errado,
        você pode restaurar facilmente.
      </AlertBox>

      <h2>/home — Diretórios dos Usuários</h2>
      <p>
        Cada usuário do sistema tem seu próprio diretório dentro de <code>/home</code>.
        É aqui que ficam seus documentos, downloads, configurações pessoais de programas, etc.
      </p>
      <CodeBlock
        title="Estrutura típica de /home"
        code={`/home/
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
└── outro-usuario/`}
      />
      <AlertBox type="info" title="Arquivos ocultos (dot files)">
        No Linux, qualquer arquivo que começa com ponto (<code>.</code>) é oculto.
        A maioria das configurações pessoais fica em arquivos ocultos no seu home.
        Use <code>ls -a</code> para vê-los.
      </AlertBox>

      <h2>/lib — Bibliotecas Compartilhadas</h2>
      <p>
        Contém as bibliotecas compartilhadas (.so — Shared Objects) necessárias para os
        binários em <code>/bin</code> e <code>/sbin</code> funcionarem. É o equivalente às
        DLLs do Windows. No Arch moderno, <code>/lib</code> é um link para <code>/usr/lib</code>.
      </p>
      <CodeBlock
        title="Verificando bibliotecas"
        code={`# Ver de quais bibliotecas um programa depende
ldd /usr/bin/bash

# Listar bibliotecas do sistema
ls /usr/lib/*.so* | head -20`}
      />

      <h2>/media — Mídias Removíveis</h2>
      <p>
        Ponto de montagem automática para dispositivos removíveis como pendrives, CDs, DVDs
        e HDs externos. Ambientes de desktop (GNOME, KDE) montam dispositivos USB aqui
        automaticamente.
      </p>
      <CodeBlock
        title="Exemplo de uso"
        code={`# Quando você insere um pendrive, ele aparece como:
ls /media/usuario/NOME_DO_PENDRIVE/

# Se estiver sem ambiente gráfico, monte manualmente em /mnt
sudo mount /dev/sdb1 /mnt`}
      />

      <h2>/mnt — Montagem Temporária</h2>
      <p>
        Ponto de montagem para sistemas de arquivos montados temporariamente pelo administrador.
        Use esse diretório quando precisar montar uma partição manualmente para manutenção,
        recuperação ou acesso temporário.
      </p>
      <CodeBlock
        title="Uso típico de /mnt"
        code={`# Montar uma partição para recuperação
sudo mount /dev/sda2 /mnt

# Montar um compartilhamento de rede
sudo mount -t nfs servidor:/export /mnt

# Montar imagem ISO
sudo mount -o loop imagem.iso /mnt

# Desmontar quando terminar
sudo umount /mnt`}
      />

      <h2>/opt — Software Opcional</h2>
      <p>
        Diretório para software de terceiros que não segue a estrutura padrão do sistema de pacotes.
        Programas como Google Chrome, Zoom, Discord e Spotify costumam instalar aqui quando não
        são empacotados nativamente.
      </p>
      <CodeBlock
        title="Exemplos em /opt"
        code={`ls /opt/
# google/
# visual-studio-code/
# discord/
# containerd/`}
      />

      <h2>/proc — Sistema de Arquivos Virtual de Processos</h2>
      <p>
        O <code>/proc</code> não existe no disco — é um filesystem virtual criado pelo kernel
        em tempo real. Ele expõe informações sobre processos em execução e o estado do sistema.
      </p>
      <CodeBlock
        title="Informações úteis em /proc"
        code={`# Informações da CPU
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
cat /proc/1/status`}
      />

      <h2>/root — Home do Root</h2>
      <p>
        O diretório home do superusuário (root). Diferente dos outros usuários que ficam
        em <code>/home/usuario</code>, o root tem seu home separado em <code>/root</code>.
        Isso garante que o root possa acessar seus arquivos mesmo se <code>/home</code>
        estiver em uma partição separada que não montou.
      </p>
      <AlertBox type="warning" title="Não confunda / com /root">
        <code>/</code> é a raiz do sistema (diretório pai de tudo).
        <code>/root</code> é o diretório home do usuário root. São coisas completamente diferentes.
      </AlertBox>

      <h2>/run — Dados de Runtime</h2>
      <p>
        Armazena dados voláteis de tempo de execução desde o último boot. É montado como
        tmpfs (na RAM) e é limpo a cada reinicialização. Programas como systemd, udev e
        NetworkManager guardam PIDs e sockets aqui.
      </p>

      <h2>/sbin — Binários de Administração</h2>
      <p>
        Contém binários de administração do sistema — programas que normalmente só o root
        precisa executar. No Arch moderno, é um link para <code>/usr/bin</code>.
      </p>
      <CodeBlock
        title="Exemplos de programas em /sbin"
        code={`# Exemplos históricos de /sbin (agora todos em /usr/bin)
fdisk        # Particionamento de disco
mkfs         # Criar sistema de arquivos
iptables     # Firewall
reboot       # Reiniciar
shutdown     # Desligar
ip           # Configuração de rede`}
      />

      <h2>/srv — Dados de Serviços</h2>
      <p>
        Destinado a dados servidos pelo sistema — por exemplo, arquivos de um servidor web,
        servidor FTP, repositórios Git servidos via HTTP.
      </p>
      <CodeBlock
        title="Exemplos de uso de /srv"
        code={`# Servidor web
/srv/http/         # Arquivos servidos pelo Apache/Nginx
/srv/http/index.html

# Servidor FTP
/srv/ftp/          # Arquivos do FTP`}
      />

      <h2>/sys — Informações do Kernel (Virtual)</h2>
      <p>
        Assim como <code>/proc</code>, o <code>/sys</code> é um filesystem virtual.
        Ele expõe informações sobre dispositivos, drivers e módulos do kernel de
        forma organizada.
      </p>
      <CodeBlock
        title="Exemplos úteis em /sys"
        code={`# Ajustar brilho da tela (em notebooks)
cat /sys/class/backlight/*/brightness
echo 100 | sudo tee /sys/class/backlight/*/brightness

# Ver informações de bateria
cat /sys/class/power_supply/BAT0/capacity

# Verificar se o sistema é UEFI
ls /sys/firmware/efi   # Se existir, é UEFI`}
      />

      <h2>/tmp — Arquivos Temporários</h2>
      <p>
        Diretório para arquivos temporários. Qualquer usuário pode escrever aqui.
        O conteúdo é limpo automaticamente a cada reinicialização (montado como tmpfs no Arch).
      </p>
      <CodeBlock
        title="Uso típico de /tmp"
        code={`# Criar arquivo temporário
echo "teste" > /tmp/meu-arquivo-temp.txt

# Scripts costumam usar /tmp para processamento intermediário
sort arquivo.csv > /tmp/arquivo-ordenado.csv

# Verificar tamanho do /tmp
df -h /tmp`}
      />
      <AlertBox type="warning" title="Não guarde nada importante em /tmp">
        Tudo em <code>/tmp</code> é apagado na reinicialização. Nunca guarde
        trabalhos, projetos ou qualquer coisa que você não possa perder aqui.
      </AlertBox>

      <h2>/usr — Hierarquia Secundária (a maior do sistema)</h2>
      <p>
        O <code>/usr</code> (Unix System Resources) contém a maior parte dos programas,
        bibliotecas e dados do sistema. No Arch Linux moderno, quase tudo está aqui.
      </p>
      <CodeBlock
        title="Estrutura de /usr"
        code={`/usr/
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
└── src/         # Código-fonte (ex: código do kernel)`}
      />

      <h2>/var — Dados Variáveis</h2>
      <p>
        Contém dados que mudam constantemente durante a operação do sistema: logs,
        cache de pacotes, filas de email, bancos de dados.
      </p>
      <CodeBlock
        title="Subdiretórios importantes de /var"
        code={`/var/
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
└── tmp/               # Temporários que persistem entre reboots`}
      />

      <CodeBlock
        title="Comandos úteis para inspecionar /var"
        code={`# Ver quanto espaço o cache do pacman está usando
du -sh /var/cache/pacman/pkg/

# Ver os últimos logs do pacman
tail -50 /var/log/pacman.log

# Ver logs do sistema
sudo journalctl -xe

# Limpar cache do pacman (manter apenas a última versão)
sudo pacman -Sc`}
      />

      <AlertBox type="info" title="Dica de manutenção">
        O diretório <code>/var/cache/pacman/pkg/</code> pode crescer para dezenas de gigabytes
        com o tempo. Faça limpeza periódica com <code>sudo pacman -Sc</code> ou use o
        utilitário <code>paccache</code> do pacote <code>pacman-contrib</code> para manter
        apenas as 3 últimas versões de cada pacote.
      </AlertBox>

      <h2>Resumo Visual Rápido</h2>
      <CodeBlock
        title="Mapa mental da hierarquia"
        code={`/ (raiz)
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
└── Serviços:        /srv`}
      />

      <AlertBox type="success" title="Regra geral">
        Se você quer editar configurações, vá em <code>/etc</code>. Se quer ver logs,
        vá em <code>/var/log</code>. Se quer encontrar um programa, ele está em
        <code>/usr/bin</code>. Se quer ver seus arquivos, vá em <code>/home</code>.
        Com o tempo, essa organização se torna intuitiva.
      </AlertBox>
    </PageContainer>
  );
}
