import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Kernel() {
  return (
    <PageContainer
      title="Kernel Linux"
      subtitle="O coração do sistema operacional. Entenda o que é o kernel, como ele funciona, suas versões e como gerenciá-lo no Arch Linux."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <h2>O que é o Kernel?</h2>
      <p>
        O kernel é o núcleo do sistema operacional. Ele é o intermediário entre o hardware
        (CPU, memória RAM, discos, placa de rede) e os programas que você executa. Sem o kernel,
        nenhum programa consegue falar com o hardware.
      </p>
      <p>
        O Linux é tecnicamente apenas o kernel. Quando você instala o "Arch Linux", você está
        instalando o kernel Linux + ferramentas GNU (gcc, bash, coreutils) + pacotes adicionais.
        Linus Torvalds criou o kernel Linux em 1991, e ele continua sendo desenvolvido por milhares
        de contribuidores ao redor do mundo.
      </p>

      <h2>Responsabilidades do Kernel</h2>
      <ul>
        <li><strong>Gerenciamento de memória</strong> — Controla qual programa usa qual área da RAM, implementa swap, cuida de memória virtual.</li>
        <li><strong>Agendamento de processos</strong> — Decide qual processo roda na CPU a cada instante (scheduler CFS - Completely Fair Scheduler).</li>
        <li><strong>Drivers de dispositivos</strong> — Interface com teclado, mouse, placa de rede, GPU, USB, etc.</li>
        <li><strong>Sistema de arquivos</strong> — Suporte a ext4, btrfs, xfs, fat32, ntfs, e dezenas de outros.</li>
        <li><strong>Rede</strong> — Implementação da pilha TCP/IP, sockets, firewall (netfilter).</li>
        <li><strong>Chamadas de sistema</strong> — A interface entre programas e o kernel (open, read, write, fork, exec...).</li>
        <li><strong>Segurança</strong> — Controle de acesso, namespaces, cgroups, SELinux/AppArmor.</li>
      </ul>

      <h2>Versões do Kernel no Arch Linux</h2>
      <p>
        O Arch Linux oferece vários kernels no repositório oficial e no AUR:
      </p>

      <h3>linux (mainline)</h3>
      <p>
        O kernel padrão do Arch. Sempre na versão mais recente estável do upstream. Recebe
        atualizações frequentes, às vezes semanais. Ideal para hardware moderno.
      </p>

      <h3>linux-lts (Long Term Support)</h3>
      <p>
        Versão com suporte de longo prazo. Mais conservadora, recebe atualizações de segurança
        por anos. Recomendada para servidores ou quem prefere estabilidade sobre novidade.
      </p>

      <h3>linux-zen</h3>
      <p>
        Kernel otimizado para desktop/jogos. Inclui patches de desempenho, menor latência e
        melhor resposta interativa. Muito popular entre usuários de gaming.
      </p>

      <h3>linux-hardened</h3>
      <p>
        Kernel com patches de segurança adicionais. Desabilita recursos desnecessários e
        adiciona mitigações extras. Ideal para ambientes que priorizam segurança.
      </p>

      <CodeBlock
        title="Gerenciar kernels no Arch"
        code={`# Ver o kernel atual
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
pacman -Ss '^linux$' '^linux-lts$' '^linux-zen$' '^linux-hardened$'`}
      />

      <AlertBox type="info" title="Headers do kernel">
        Os pacotes <code>linux-headers</code>, <code>linux-lts-headers</code>, etc., são necessários
        para compilar módulos do kernel (como drivers proprietários da NVIDIA ou VirtualBox).
        Instale sempre junto com o kernel correspondente.
      </AlertBox>

      <h2>Estrutura do Kernel</h2>

      <h3>Espaço de Kernel vs Espaço de Usuário</h3>
      <p>
        O kernel divide a memória em dois domínios:
      </p>
      <ul>
        <li><strong>Kernel space</strong> — Onde o kernel roda. Acesso total ao hardware. Um bug aqui pode travar o sistema (kernel panic).</li>
        <li><strong>User space</strong> — Onde seus programas rodam. Acesso limitado, protegido. Um bug aqui mata apenas o programa.</li>
      </ul>
      <p>
        A comunicação entre user space e kernel space acontece via <strong>chamadas de sistema (syscalls)</strong>.
        Quando um programa chama <code>open("/etc/passwd", O_RDONLY)</code>, ele está fazendo uma syscall.
      </p>

      <h3>Kernel Monolítico vs Microkernel</h3>
      <p>
        O Linux é um kernel monolítico — tudo roda no mesmo espaço de memória privilegiado.
        Isso é mais rápido (sem comunicação IPC entre componentes), mas um bug em qualquer parte
        pode derrubar o sistema inteiro. Exemplos de microkernels: Minix, QNX, GNU Hurd.
      </p>

      <h2>Informações do Kernel em Execução</h2>
      <CodeBlock
        title="Comandos para inspecionar o kernel"
        code={`# Versão completa do kernel
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
dmesg | grep -i "cpu\|memory\|gpu"

# Versão das ferramentas de espaço de usuário
gcc --version
glibc-version  # ou ldd --version`}
      />

      <h2>O Diretório /proc</h2>
      <p>
        O <code>/proc</code> é um sistema de arquivos virtual (não existe no disco) que o kernel
        popula com informações em tempo real. É uma janela para o interior do kernel.
      </p>
      <CodeBlock
        title="Explorando /proc"
        code={`# Processos em execução (cada número é um PID)
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
cat /proc/modules      # Módulos carregados (igual a lsmod)`}
      />

      <h2>O Diretório /sys</h2>
      <p>
        O <code>/sys</code> (sysfs) é outro sistema de arquivos virtual que expõe a árvore de
        dispositivos e drivers do kernel. É usado por ferramentas como <code>udev</code> para
        gerenciar dispositivos automaticamente.
      </p>
      <CodeBlock
        title="Explorando /sys"
        code={`# Listar dispositivos de bloco
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
cat /sys/class/hwmon/hwmon0/temp1_input  # Temperatura em milissegundos`}
      />

      <h2>Atualizando o Kernel</h2>
      <CodeBlock
        title="Atualizar o kernel no Arch"
        code={`# Atualizar o sistema inteiro (inclui o kernel)
sudo pacman -Syu

# Após a atualização, o novo kernel está em /boot mas ainda não está ativo
# É necessário reiniciar para usar o novo kernel
reboot

# Verificar a versão após reiniciar
uname -r

# Se algo der errado após atualização, o GRUB mantém kernel anterior
# Ao inicializar, selecione "Arch Linux (linux-fallback)" ou
# entre no GRUB avançado e selecione a versão anterior`}
      />

      <AlertBox type="warning" title="Cuidado com atualizações de kernel">
        Após atualizar o kernel, módulos compilados externamente (como o driver NVIDIA ou
        VirtualBox) precisam ser recompilados para a nova versão. O <code>dkms</code> faz isso
        automaticamente. Se você usa DKMS, certifique-se que está instalado: <code>sudo pacman -S dkms</code>.
      </AlertBox>

      <h2>DKMS - Dynamic Kernel Module Support</h2>
      <p>
        O DKMS permite que módulos do kernel sejam recompilados automaticamente quando o kernel
        é atualizado. Essencial se você usa drivers proprietários.
      </p>
      <CodeBlock
        title="Usar DKMS"
        code={`# Instalar DKMS
sudo pacman -S dkms

# Verificar módulos DKMS instalados
dkms status

# Exemplo de saída:
# nvidia, 560.35.03, 6.12.10-arch1-1, x86_64: installed
# virtualbox-host-modules, 7.0.20, 6.12.10-arch1-1, x86_64: installed

# Recompilar um módulo manualmente
dkms autoinstall

# Ver log de compilação de um módulo
cat /var/lib/dkms/nvidia/560.35.03/build/make.log`}
      />

      <h2>Kernel Panic</h2>
      <p>
        Kernel panic é o equivalente Linux ao "tela azul da morte" do Windows. Acontece quando
        o kernel encontra um erro irrecuperável. As causas mais comuns são:
      </p>
      <ul>
        <li>Hardware defeituoso (RAM com defeito, HD corrompido)</li>
        <li>Driver defeituoso causando corrupção de memória</li>
        <li>Módulo do kernel com bug</li>
        <li>Sistema de arquivos root corrompido</li>
        <li>Falta de arquivo init (initramfs corrompido)</li>
      </ul>
      <CodeBlock
        title="Investigar kernel panics"
        code={`# Ver logs do kernel, incluindo panics anteriores
journalctl -k -b -1  # Logs do kernel do boot anterior

# Ver logs de crash (se configurado)
ls /var/crash/

# Testar RAM (rodar durante horas)
# Boote pela ISO do Arch e selecione Memtest86+

# Verificar integridade do sistema de arquivos
sudo fsck /dev/sda1  # Nunca em partição montada!

# Monitorar erros em tempo real
dmesg -w    # Watch mode - exibe novos msgs do kernel em tempo real
dmesg -l err,crit  # Apenas erros críticos`}
      />

      <AlertBox type="success" title="Próximos passos">
        Agora que você entende o kernel, explore o processo de boot completo em
        <strong> Processo de Boot</strong> e depois os <strong>Módulos do Kernel</strong>
        para entender como drivers são carregados.
      </AlertBox>
    </PageContainer>
  );
}
