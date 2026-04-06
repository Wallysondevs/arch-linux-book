import{j as e}from"./ui-K-J8Jkwj.js";import{P as r}from"./PageContainer-tnnsMrcC.js";import{C as o}from"./CodeBlock-DEDRw1y6.js";import{A as s}from"./AlertBox-D1nNvzza.js";import"./router-CFQymoZQ.js";import"./index-De_u_y1v.js";import"./vendor-bfizL-CB.js";import"./syntax-C0AEetN3.js";function u(){return e.jsxs(r,{title:"Kernel Linux",subtitle:"O coração do sistema operacional. Entenda o que é o kernel, como ele funciona, suas versões e como gerenciá-lo no Arch Linux.",difficulty:"intermediario",timeToRead:"20 min",children:[e.jsx("h2",{children:"O que é o Kernel?"}),e.jsx("p",{children:"O kernel é o núcleo do sistema operacional. Ele é o intermediário entre o hardware (CPU, memória RAM, discos, placa de rede) e os programas que você executa. Sem o kernel, nenhum programa consegue falar com o hardware."}),e.jsx("p",{children:'O Linux é tecnicamente apenas o kernel. Quando você instala o "Arch Linux", você está instalando o kernel Linux + ferramentas GNU (gcc, bash, coreutils) + pacotes adicionais. Linus Torvalds criou o kernel Linux em 1991, e ele continua sendo desenvolvido por milhares de contribuidores ao redor do mundo.'}),e.jsx("h2",{children:"Responsabilidades do Kernel"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Gerenciamento de memória"})," — Controla qual programa usa qual área da RAM, implementa swap, cuida de memória virtual."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Agendamento de processos"})," — Decide qual processo roda na CPU a cada instante (scheduler CFS - Completely Fair Scheduler)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Drivers de dispositivos"})," — Interface com teclado, mouse, placa de rede, GPU, USB, etc."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sistema de arquivos"})," — Suporte a ext4, btrfs, xfs, fat32, ntfs, e dezenas de outros."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Rede"})," — Implementação da pilha TCP/IP, sockets, firewall (netfilter)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Chamadas de sistema"})," — A interface entre programas e o kernel (open, read, write, fork, exec...)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Segurança"})," — Controle de acesso, namespaces, cgroups, SELinux/AppArmor."]})]}),e.jsx("h2",{children:"Versões do Kernel no Arch Linux"}),e.jsx("p",{children:"O Arch Linux oferece vários kernels no repositório oficial e no AUR:"}),e.jsx("h3",{children:"linux (mainline)"}),e.jsx("p",{children:"O kernel padrão do Arch. Sempre na versão mais recente estável do upstream. Recebe atualizações frequentes, às vezes semanais. Ideal para hardware moderno."}),e.jsx("h3",{children:"linux-lts (Long Term Support)"}),e.jsx("p",{children:"Versão com suporte de longo prazo. Mais conservadora, recebe atualizações de segurança por anos. Recomendada para servidores ou quem prefere estabilidade sobre novidade."}),e.jsx("h3",{children:"linux-zen"}),e.jsx("p",{children:"Kernel otimizado para desktop/jogos. Inclui patches de desempenho, menor latência e melhor resposta interativa. Muito popular entre usuários de gaming."}),e.jsx("h3",{children:"linux-hardened"}),e.jsx("p",{children:"Kernel com patches de segurança adicionais. Desabilita recursos desnecessários e adiciona mitigações extras. Ideal para ambientes que priorizam segurança."}),e.jsx(o,{title:"Gerenciar kernels no Arch",code:`# Ver o kernel atual
uname -r

# Exemplo de saída:
# 6.12.10-arch1-1

# Instalar kernel LTS como alternativa
sudo pacman -S linux-lts linux-lts-headers

# Instalar kernel Zen (otimizado para desktop/gaming)
sudo pacman -S linux-zen linux-zen-headers

# Instalar kernel hardened
sudo pacman -S linux-hardened linux-hardened-headers

# Listar todos os kernels instalados
ls /boot/vmlinuz-linux*
# /boot/vmlinuz-linux
# /boot/vmlinuz-linux-lts
# /boot/vmlinuz-linux-zen

# Ver kernels disponíveis no repositório
pacman -Ss '^linux$' '^linux-lts$' '^linux-zen$' '^linux-hardened$'`}),e.jsxs(s,{type:"info",title:"Headers do kernel",children:["Os pacotes ",e.jsx("code",{children:"linux-headers"}),", ",e.jsx("code",{children:"linux-lts-headers"}),", etc., são necessários para compilar módulos do kernel (como drivers proprietários da NVIDIA ou VirtualBox). Instale sempre junto com o kernel correspondente."]}),e.jsx("h2",{children:"Estrutura do Kernel"}),e.jsx("h3",{children:"Espaço de Kernel vs Espaço de Usuário"}),e.jsx("p",{children:"O kernel divide a memória em dois domínios:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Kernel space"})," — Onde o kernel roda. Acesso total ao hardware. Um bug aqui pode travar o sistema (kernel panic)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"User space"})," — Onde seus programas rodam. Acesso limitado, protegido. Um bug aqui mata apenas o programa."]})]}),e.jsxs("p",{children:["A comunicação entre user space e kernel space acontece via ",e.jsx("strong",{children:"chamadas de sistema (syscalls)"}),". Quando um programa chama ",e.jsx("code",{children:'open("/etc/passwd", O_RDONLY)'}),", ele está fazendo uma syscall."]}),e.jsx("h3",{children:"Kernel Monolítico vs Microkernel"}),e.jsx("p",{children:"O Linux é um kernel monolítico — tudo roda no mesmo espaço de memória privilegiado. Isso é mais rápido (sem comunicação IPC entre componentes), mas um bug em qualquer parte pode derrubar o sistema inteiro. Exemplos de microkernels: Minix, QNX, GNU Hurd."}),e.jsx("h2",{children:"Informações do Kernel em Execução"}),e.jsx(o,{title:"Comandos para inspecionar o kernel",code:`# Versão completa do kernel
uname -r        # 6.12.10-arch1-1
uname -a        # Completo: kernel, hostname, data, arquitetura

# Informações detalhadas do sistema
cat /proc/version
# Linux version 6.12.10-arch1-1 (linux@archlinux) ...

# Arquitetura
uname -m        # x86_64

# Tempo desde o boot
cat /proc/uptime    # segundos.decimais
uptime              # Formato legível

# Memória do sistema (vista pelo kernel)
cat /proc/meminfo | head -20

# CPUs disponíveis para o kernel
cat /proc/cpuinfo | grep "model name" | head -1
nproc           # Quantidade de cores/threads

# Versão do kernel e compilador usado
cat /proc/version

# Parâmetros passados ao kernel no boot
cat /proc/cmdline

# Informações de hardware
dmesg | head -50    # Log do kernel desde o boot
dmesg | grep -i "cpu|memory|gpu"

# Versão das ferramentas de espaço de usuário
gcc --version
glibc-version  # ou ldd --version`}),e.jsx("h2",{children:"O Diretório /proc"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"/proc"})," é um sistema de arquivos virtual (não existe no disco) que o kernel popula com informações em tempo real. É uma janela para o interior do kernel."]}),e.jsx(o,{title:"Explorando /proc",code:`# Processos em execução (cada número é um PID)
ls /proc/ | grep '^[0-9]' | head -10

# Informações de um processo específico
ls /proc/1/          # Processo init/systemd (PID 1)
cat /proc/1/status   # Status do processo
cat /proc/1/cmdline  # Linha de comando usada para iniciá-lo
cat /proc/1/maps     # Mapeamentos de memória

# Estatísticas do sistema
cat /proc/stat       # Estatísticas da CPU
cat /proc/diskstats  # Estatísticas de disco
cat /proc/net/dev    # Estatísticas de rede

# Parâmetros do kernel (sysctl)
cat /proc/sys/kernel/hostname     # Nome do host
cat /proc/sys/vm/swappiness       # Agressividade do swap (0-100)
cat /proc/sys/net/ipv4/ip_forward # IP forwarding (0 ou 1)

# Capacidades do sistema
cat /proc/filesystems  # Sistemas de arquivos suportados
cat /proc/modules      # Módulos carregados (igual a lsmod)`}),e.jsx("h2",{children:"O Diretório /sys"}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"/sys"})," (sysfs) é outro sistema de arquivos virtual que expõe a árvore de dispositivos e drivers do kernel. É usado por ferramentas como ",e.jsx("code",{children:"udev"})," para gerenciar dispositivos automaticamente."]}),e.jsx(o,{title:"Explorando /sys",code:`# Listar dispositivos de bloco
ls /sys/block/
# nvme0n1  sda  sdb  sr0

# Informações de um disco
cat /sys/block/sda/size          # Tamanho em blocos de 512 bytes
cat /sys/block/sda/queue/rotational   # 1=HDD, 0=SSD
cat /sys/block/sda/device/vendor # Fabricante

# Informações de CPU
ls /sys/devices/system/cpu/
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor  # Governador de frequência

# Controle de brilho da tela
ls /sys/class/backlight/
echo 500 > /sys/class/backlight/intel_backlight/brightness  # Ajustar brilho

# Listar todos os dispositivos PCI
ls /sys/bus/pci/devices/

# Informações de temperatura (hwmon)
cat /sys/class/hwmon/hwmon0/temp1_input  # Temperatura em milissegundos`}),e.jsx("h2",{children:"Atualizando o Kernel"}),e.jsx(o,{title:"Atualizar o kernel no Arch",code:`# Atualizar o sistema inteiro (inclui o kernel)
sudo pacman -Syu

# Após a atualização, o novo kernel está em /boot mas ainda não está ativo
# É necessário reiniciar para usar o novo kernel
reboot

# Verificar a versão após reiniciar
uname -r

# Se algo der errado após atualização, o GRUB mantém kernel anterior
# Ao inicializar, selecione "Arch Linux (linux-fallback)" ou
# entre no GRUB avançado e selecione a versão anterior`}),e.jsxs(s,{type:"warning",title:"Cuidado com atualizações de kernel",children:["Após atualizar o kernel, módulos compilados externamente (como o driver NVIDIA ou VirtualBox) precisam ser recompilados para a nova versão. O ",e.jsx("code",{children:"dkms"})," faz isso automaticamente. Se você usa DKMS, certifique-se que está instalado: ",e.jsx("code",{children:"sudo pacman -S dkms"}),"."]}),e.jsx("h2",{children:"DKMS - Dynamic Kernel Module Support"}),e.jsx("p",{children:"O DKMS permite que módulos do kernel sejam recompilados automaticamente quando o kernel é atualizado. Essencial se você usa drivers proprietários."}),e.jsx(o,{title:"Usar DKMS",code:`# Instalar DKMS
sudo pacman -S dkms

# Verificar módulos DKMS instalados
dkms status

# Exemplo de saída:
# nvidia, 560.35.03, 6.12.10-arch1-1, x86_64: installed
# virtualbox-host-modules, 7.0.20, 6.12.10-arch1-1, x86_64: installed

# Recompilar um módulo manualmente
dkms autoinstall

# Ver log de compilação de um módulo
cat /var/lib/dkms/nvidia/560.35.03/build/make.log`}),e.jsx("h2",{children:"Kernel Panic"}),e.jsx("p",{children:'Kernel panic é o equivalente Linux ao "tela azul da morte" do Windows. Acontece quando o kernel encontra um erro irrecuperável. As causas mais comuns são:'}),e.jsxs("ul",{children:[e.jsx("li",{children:"Hardware defeituoso (RAM com defeito, HD corrompido)"}),e.jsx("li",{children:"Driver defeituoso causando corrupção de memória"}),e.jsx("li",{children:"Módulo do kernel com bug"}),e.jsx("li",{children:"Sistema de arquivos root corrompido"}),e.jsx("li",{children:"Falta de arquivo init (initramfs corrompido)"})]}),e.jsx(o,{title:"Investigar kernel panics",code:`# Ver logs do kernel, incluindo panics anteriores
journalctl -k -b -1  # Logs do kernel do boot anterior

# Ver logs de crash (se configurado)
ls /var/crash/

# Testar RAM (rodar durante horas)
# Boote pela ISO do Arch e selecione Memtest86+

# Verificar integridade do sistema de arquivos
sudo fsck /dev/sda1  # Nunca em partição montada!

# Monitorar erros em tempo real
dmesg -w    # Watch mode - exibe novos msgs do kernel em tempo real
dmesg -l err,crit  # Apenas erros críticos`}),e.jsxs(s,{type:"success",title:"Próximos passos",children:["Agora que você entende o kernel, explore o processo de boot completo em",e.jsx("strong",{children:" Processo de Boot"})," e depois os ",e.jsx("strong",{children:"Módulos do Kernel"}),"para entender como drivers são carregados."]})]})}export{u as default};
