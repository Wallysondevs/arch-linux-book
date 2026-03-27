import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Troubleshooting() {
  return (
    <PageContainer
      title="Troubleshooting Ubuntu"
      subtitle="Diagnosticando e resolvendo problemas comuns — boot, rede, espaço em disco, pacotes corrompidos e muito mais."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Todo sistema Linux vai apresentar problemas em algum momento. A habilidade de
        diagnosticar e resolver esses problemas é o que separa um usuário experiente de um
        iniciante. Este guia cobre os problemas mais comuns no Ubuntu e como resolvê-los.
      </p>

      <h2>Problemas com APT e Pacotes</h2>

      <h3>apt está travado ou corrompido</h3>
      <CodeBlock
        title="Corrigir APT quebrado"
        code={`# Problema 1: "Could not get lock /var/lib/dpkg/lock"
# Outro processo apt está rodando
sudo killall apt apt-get    # Matar instâncias em execução
sudo rm /var/lib/apt/lists/lock
sudo rm /var/lib/dpkg/lock
sudo rm /var/lib/dpkg/lock-frontend
sudo dpkg --configure -a    # Reconfigurar pacotes pendentes

# Problema 2: "dpkg: error processing package"
sudo dpkg --configure -a
sudo apt install -f           # -f = fix-broken (corrigir dependências)
sudo apt update && sudo apt upgrade

# Problema 3: "Package has no installation candidate"
# O pacote não existe no repositório atual. Soluções:
sudo apt update               # Atualizar lista de repositórios
# Verificar se o repositório está habilitado:
cat /etc/apt/sources.list | grep universe
sudo add-apt-repository universe   # Habilitar se necessário

# Problema 4: Dependências conflitantes
sudo apt install -f           # Corrigir automaticamente
sudo apt autoremove           # Remover pacotes conflitantes

# Problema 5: "Hash Sum mismatch"
# Cache do APT corrompido. Limpar e refazer:
sudo rm -rf /var/lib/apt/lists/*
sudo apt update

# Problema 6: PPA removido ou offline
# Ver PPAs instalados:
ls /etc/apt/sources.list.d/
# Remover PPA problemático:
sudo add-apt-repository --remove ppa:nome/ppa`}
      />

      <h2>Problemas de Boot</h2>
      <CodeBlock
        title="O sistema não inicia"
        code={`# Se o GRUB aparece mas o Ubuntu não inicia:

# 1. No menu do GRUB, selecione "Advanced options for Ubuntu"
# 2. Escolha uma versão do kernel mais antiga
# 3. Se funcionar, o kernel mais novo está quebrado

# Para corrigir kernel quebrado (em sessão de recovery):
# No menu GRUB → "Ubuntu, com Linux X.X.X-X-generic (recovery mode)"
# → "root" para terminal root

# Montar sistema de arquivos em modo escrita:
mount -o remount,rw /

# Reinstalar o kernel:
apt install --reinstall linux-generic
update-grub

# Se o GRUB não aparece mais:
# Boot pelo live USB do Ubuntu
# Em "Try Ubuntu":
sudo mount /dev/sda3 /mnt             # Montar partição raiz
sudo mount /dev/sda1 /mnt/boot/efi   # Montar EFI
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys

# Entrar no sistema (chroot):
sudo chroot /mnt

# Reinstalar o GRUB:
grub-install /dev/sda
update-grub
exit
reboot`}
      />

      <h2>Problemas com Espaço em Disco</h2>
      <CodeBlock
        title="Disco cheio — diagnóstico e limpeza"
        code={`# Verificar uso de disco
df -h

# Encontrar os maiores arquivos e diretórios
du -sh /* 2>/dev/null | sort -rh | head -20
du -sh /var/* 2>/dev/null | sort -rh | head -10

# === LIMPEZA DO APT ===
sudo apt autoremove -y     # Remover pacotes desnecessários
sudo apt autoclean         # Limpar cache de versões antigas
sudo apt clean             # Limpar TODO o cache de pacotes

# === LIMPAR LOGS ANTIGOS ===
# Ver tamanho dos logs do journald:
journalctl --disk-usage

# Limpar logs com mais de 7 dias:
sudo journalctl --vacuum-time=7d

# Limpar mantendo máximo 500MB:
sudo journalctl --vacuum-size=500M

# Limpar logs antigos em /var/log:
sudo find /var/log -name "*.log.*.gz" -delete
sudo find /var/log -name "*.log.[0-9]*" -delete

# === SNAPSHOTS E SNAPS ===
# Snaps antigos acumulam versões:
# Ver versões antigas de snaps:
sudo snap list --all | grep disabled

# Remover versões antigas de snaps (script):
sudo snap list --all | awk '/disabled/{print \$1, \$3}' | \\
    while read snapname revision; do
        sudo snap remove "\$snapname" --revision="\$revision"
    done

# === LIMPEZA GERAL ===
# Arquivos de core dump:
sudo rm -f /var/crash/*

# Thumbnails antigos:
rm -rf ~/.cache/thumbnails/*

# Ver uso da home por categoria:
du -sh ~/.*  2>/dev/null | sort -rh | head -20
du -sh ~/.cache/  # O cache costuma ser o maior`}
      />

      <h2>Problemas de Rede</h2>
      <CodeBlock
        title="Diagnosticando problemas de conectividade"
        code={`# Verificar se a interface está UP
ip link show
# Se estiver DOWN:
sudo ip link set enp3s0 up

# Verificar se tem IP
ip addr show

# Obter IP via DHCP manualmente
sudo dhclient enp3s0

# Verificar DNS
cat /etc/resolv.conf
nslookup google.com     # Se falhar, problema de DNS
ping 8.8.8.8            # Se funcionar mas nslookup falhar: problema de DNS

# Reiniciar NetworkManager
sudo systemctl restart NetworkManager

# Ver logs de rede
sudo journalctl -u NetworkManager -n 50

# Wi-Fi não aparece
rfkill list             # Ver se está bloqueado por software
sudo rfkill unblock wifi

# Reinstalar driver Wi-Fi (Broadcom como exemplo):
sudo apt install --reinstall bcmwl-kernel-source
sudo modprobe wl

# Verificar resolução DNS
resolvectl status
sudo systemd-resolve --flush-caches  # Limpar cache DNS`}
      />

      <h2>Problemas com GNOME e Interface Gráfica</h2>
      <CodeBlock
        title="Resolvendo travamentos do desktop"
        code={`# GNOME Shell travou (sessão X11 apenas):
# Alt + F2 → digitar "r" → Enter  (reinicia o Shell sem fechar apps)

# Sessão Wayland travada:
# Ctrl + Alt + F3   (ir para terminal virtual)
# Logar e reiniciar o GNOME:
systemctl restart gdm3   # Reinicia o display manager (desconecta sessão atual!)

# Verificar erros do GNOME:
journalctl -b | grep gnome-shell | tail -30
journalctl -b | grep -i "segfault\|crash" | tail -20

# Resetar GNOME para configurações padrão:
gsettings reset-recursively org.gnome.shell
dconf reset -f /org/gnome/

# Extensão causando crash:
# Desabilitar todas extensões:
gsettings set org.gnome.shell enabled-extensions "[]"
# Reabilitar uma por uma para identificar a problemática

# Driver NVIDIA causando problemas:
# Ver logs do Xorg:
cat /var/log/Xorg.0.log | grep "(EE)"

# Problemas de tela preta no login:
# Ctrl + Alt + F3 → logar → verificar:
ls -la ~/.Xauthority    # Deve existir
ls -la /tmp/.X11-unix/  # Deve ter sockets`}
      />

      <h2>Diagnóstico Geral do Sistema</h2>
      <CodeBlock
        title="Verificação de saúde do sistema"
        code={`# Ver todos os erros do boot atual
journalctl -b -p err

# Serviços com falha
systemctl --failed

# Ver últimas mensagens do kernel (inclui erros de hardware)
dmesg | tail -50
dmesg | grep -i "error\|fail\|warn" | tail -20

# Temperatura do CPU (superaquecimento)
sudo apt install lm-sensors
sensors
sudo apt install s-tui     # Monitor de temperatura gráfico

# Memória: ver se tem erros (requer reboot para testar)
sudo apt install memtest86+
# No GRUB: escolha "Memory test (memtest86+)"

# S.M.A.R.T. do disco (saúde do HD/SSD)
sudo apt install smartmontools
sudo smartctl -a /dev/sda
sudo smartctl -H /dev/sda    # Health status: PASSED ou FAILED

# Verificar filesystem (disco deve estar desmontado!)
sudo fsck -f /dev/sdb1

# Ver log do Ubuntu após um crash:
ls /var/crash/
sudo apport-unpack /var/crash/_usr_bin_xyz.1000.crash /tmp/crash-report/`}
      />

      <h2>Comandos de Socorro Rápido</h2>
      <CodeBlock
        title="SysRq — controle de emergência do kernel"
        code={`# Tecla mágica do Linux: Alt + SysRq (Print Screen) + [tecla]

# Sequência de emergência (sistema completamente travado):
# Alt + SysRq + R  → Recuperar teclado do X
# Alt + SysRq + E  → Matar todos os processos
# Alt + SysRq + I  → Matar TODOS os processos
# Alt + SysRq + S  → Sincronizar discos (salvar dados)
# Alt + SysRq + U  → Remontar FS como somente leitura
# Alt + SysRq + B  → Reiniciar imediatamente
# Mnemônico: "Reisub" = "Raising Elephants Is So Utterly Boring"
# (R, E, I, S, U, B) — a sequência mais segura de reboot de emergência

# Ver se SysRq está habilitado:
cat /proc/sys/kernel/sysrq
# 1 = ativado, 0 = desativado

# Habilitar:
echo 1 | sudo tee /proc/sys/kernel/sysrq`}
      />
    </PageContainer>
  );
}
