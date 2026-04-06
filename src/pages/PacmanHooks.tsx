import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PacmanHooks() {
  return (
    <PageContainer
      title="Pacman Hooks"
      subtitle="Automatize tarefas com hooks do pacman: execute scripts antes ou depois de instalar, atualizar ou remover pacotes."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <h2>O que são Pacman Hooks?</h2>
      <p>
        Pacman hooks (ganchos) são scripts que executam automaticamente antes ou depois de operações do pacman.
        Eles permitem automatizar tarefas como limpar cache, atualizar o GRUB, 
        reconstruir o initramfs, ou qualquer ação personalizada.
      </p>

      <h2>Onde ficam os Hooks?</h2>

      <CodeBlock
        title="Diretórios de hooks"
        code={`# Hooks do sistema (pacotes instalados colocam hooks aqui)
ls /usr/share/libalpm/hooks/

# Hooks personalizados do usuário (prioridade sobre /usr)
ls /etc/pacman.d/hooks/
# Se não existir:
sudo mkdir -p /etc/pacman.d/hooks`}
      />

      <h2>Estrutura de um Hook</h2>

      <CodeBlock
        title="Anatomia de um pacman hook"
        code={`# /etc/pacman.d/hooks/nome-do-hook.hook

[Trigger]
Type = Package           # Package ou File
Operation = Install       # Install, Upgrade, Remove
Target = linux            # Nome do pacote ou padrão de arquivo

[Action]
Description = Descrição do que o hook faz
When = PostTransaction    # PreTransaction ou PostTransaction
Exec = /usr/bin/comando   # Comando a executar
Depends = pacote          # Dependências do hook (opcional)
NeedsTargets             # Recebe lista de targets via stdin (opcional)
AbortOnFail              # Abortar transação se falhar (opcional, apenas Pre)`}
      />

      <h2>Exemplos Práticos</h2>

      <h3>Limpar Cache do Pacman</h3>
      <CodeBlock
        title="Hook para limpar cache automaticamente"
        code={`# /etc/pacman.d/hooks/clean-cache.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Limpando cache do pacman (mantendo 3 versões)...
When = PostTransaction
Exec = /usr/bin/paccache -rk3
Depends = pacman-contrib`}
      />

      <h3>Atualizar GRUB</h3>
      <CodeBlock
        title="Hook para atualizar GRUB ao mudar kernel"
        code={`# /etc/pacman.d/hooks/grub-update.hook
[Trigger]
Type = Package
Operation = Install
Operation = Upgrade
Operation = Remove
Target = linux
Target = linux-lts
Target = linux-zen

[Action]
Description = Atualizando configuração do GRUB...
When = PostTransaction
Exec = /usr/bin/grub-mkconfig -o /boot/grub/grub.cfg
Depends = grub`}
      />

      <h3>Backup da Lista de Pacotes</h3>
      <CodeBlock
        title="Hook para salvar lista de pacotes após cada operação"
        code={`# /etc/pacman.d/hooks/backup-pkglist.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Salvando lista de pacotes instalados...
When = PostTransaction
Exec = /bin/sh -c 'pacman -Qqe > /home/usuario/backup/pkglist.txt && pacman -Qqem > /home/usuario/backup/aurlist.txt'`}
      />

      <h3>Notificação de Atualizações do Kernel</h3>
      <CodeBlock
        title="Hook para lembrar de reiniciar após atualizar kernel"
        code={`# /etc/pacman.d/hooks/kernel-reboot-notify.hook
[Trigger]
Type = Package
Operation = Upgrade
Target = linux
Target = linux-lts
Target = linux-zen

[Action]
Description = >>> KERNEL ATUALIZADO! Reinicie o computador para usar o novo kernel. <<<
When = PostTransaction
Exec = /usr/bin/echo "Reinicie com: sudo reboot"`}
      />

      <h3>Atualizar fontes após instalação</h3>
      <CodeBlock
        title="Hook para atualizar cache de fontes"
        code={`# /etc/pacman.d/hooks/font-cache.hook
[Trigger]
Type = File
Operation = Install
Operation = Upgrade
Operation = Remove
Target = usr/share/fonts/*

[Action]
Description = Atualizando cache de fontes...
When = PostTransaction
Exec = /usr/bin/fc-cache -f`}
      />

      <h3>Reconstruir mkinitcpio</h3>
      <CodeBlock
        title="Hook para reconstruir initramfs (já existe por padrão)"
        code={`# Este hook já vem com o pacote 'mkinitcpio'
# /usr/share/libalpm/hooks/90-mkinitcpio-install.hook
# Reconstrui automaticamente ao atualizar o kernel

# Se precisar de um hook personalizado:
# /etc/pacman.d/hooks/custom-mkinitcpio.hook
[Trigger]
Type = File
Operation = Install
Operation = Upgrade
Target = usr/lib/modules/*/vmlinuz
Target = usr/lib/initcpio/*

[Action]
Description = Reconstruindo initramfs personalizado...
When = PostTransaction
Exec = /usr/bin/mkinitcpio -P
Depends = mkinitcpio`}
      />

      <h3>Snapshot Btrfs antes de atualizar</h3>
      <CodeBlock
        title="Hook para criar snapshot Btrfs antes de atualizações"
        code={`# /etc/pacman.d/hooks/btrfs-snapshot.hook
[Trigger]
Operation = Install
Operation = Upgrade
Operation = Remove
Type = Package
Target = *

[Action]
Description = Criando snapshot Btrfs pré-atualização...
When = PreTransaction
Exec = /usr/bin/btrfs subvolume snapshot / /.snapshots/pre-pacman
AbortOnFail`}
      />

      <h2>Hook com Script Personalizado</h2>

      <CodeBlock
        title="Usar script externo como hook"
        code={`# 1. Criar o script
sudo tee /usr/local/bin/pacman-hook-custom.sh << 'SCRIPT'
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M)
LOG="/var/log/pacman-hooks.log"

echo "=== Hook executado em $DATE ===" >> "$LOG"

# Ler targets do stdin se NeedsTargets estiver definido
while read -r target; do
    echo "  Pacote: $target" >> "$LOG"
done

echo "" >> "$LOG"
SCRIPT

sudo chmod +x /usr/local/bin/pacman-hook-custom.sh

# 2. Criar o hook
sudo tee /etc/pacman.d/hooks/custom-log.hook << 'EOF'
[Trigger]
Operation = Upgrade
Type = Package
Target = *

[Action]
Description = Logando pacotes atualizados...
When = PostTransaction
Exec = /usr/local/bin/pacman-hook-custom.sh
NeedsTargets
EOF`}
      />

      <h2>Listando e Verificando Hooks</h2>

      <CodeBlock
        title="Gerenciar hooks"
        code={`# Listar todos os hooks ativos
ls /usr/share/libalpm/hooks/ /etc/pacman.d/hooks/ 2>/dev/null

# Ver conteúdo de um hook
cat /usr/share/libalpm/hooks/30-systemd-update.hook

# Desabilitar um hook do sistema (criando override vazio)
sudo ln -s /dev/null /etc/pacman.d/hooks/nome-do-hook.hook

# Ver log do pacman (que mostra execução de hooks)
cat /var/log/pacman.log | tail -50`}
      />

      <AlertBox type="info" title="Dica: pacman-contrib">
        O pacote <code>pacman-contrib</code> inclui ferramentas úteis como <code>paccache</code> (limpar cache),
        <code>pacdiff</code> (gerenciar .pacnew), <code>rankmirrors</code>, e vários hooks úteis.
        <br/><br/>
        <code>sudo pacman -S pacman-contrib</code>
      </AlertBox>
    </PageContainer>
  );
}
