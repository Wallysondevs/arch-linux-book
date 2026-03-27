import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Disco() {
  return (
    <PageContainer
      title="Discos e Partições"
      subtitle="lsblk, fdisk, parted, mkfs, mount, df — gerenciando discos, partições e sistemas de arquivos no Ubuntu."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Gerenciar discos e partições é uma habilidade essencial para administrar servidores
        Ubuntu — seja expandindo volumes em nuvem, adicionando discos de dados ou configurando
        um NAS. Este guia cobre as ferramentas essenciais para trabalhar com armazenamento.
      </p>

      <h2>Visualizando Discos</h2>
      <CodeBlock
        title="Ver discos, partições e montagens"
        code={`# Visão geral de todos os discos e partições
lsblk

# Saída:
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
# sda      8:0    0 476.9G  0 disk
# ├─sda1   8:1    0   512M  0 part /boot/efi
# ├─sda2   8:2    0     2G  0 part [SWAP]
# └─sda3   8:3    0 474.4G  0 part /
# sdb      8:16   0 931.5G  0 disk    ← Novo disco não particionado
# sr0     11:0    1  1024M  0 rom

# Ver com sistema de arquivos
lsblk -f

# Ver detalhes de partições com fdisk
sudo fdisk -l
sudo fdisk -l /dev/sda  # Apenas um disco específico

# Ver uso de espaço em disco dos sistemas montados
df -h
# Saída:
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda3       467G   45G  399G  10% /
# /dev/sda1       511M  6.1M  505M   2% /boot/efi
# tmpfs           7.8G  2.3M  7.8G   1% /tmp

# Ver uso de espaço de um diretório específico
du -sh /home/joao/
du -sh /var/log/
du -sh /var/cache/apt/

# Ver os maiores diretórios (top 10):
du -h /var/ | sort -rh | head -10`}
      />

      <h2>Particionamento com fdisk</h2>
      <AlertBox type="danger" title="Cuidado ao particionar discos!">
        Operações de particionamento podem causar perda permanente de dados. Sempre faça
        backup antes. Certifique-se de que está operando no disco correto — confirme com
        <code>lsblk</code> e <code>fdisk -l</code> antes de qualquer operação.
      </AlertBox>
      <CodeBlock
        title="Particionando um disco com fdisk"
        code={`# Abrir fdisk em um disco (NÃO na partição! Use /dev/sdb, não /dev/sdb1)
sudo fdisk /dev/sdb

# Comandos dentro do fdisk:
# m → Ajuda (lista todos os comandos)
# p → Mostrar tabela de partições atual
# n → Nova partição
# d → Deletar partição
# t → Mudar tipo da partição
# w → Salvar e sair (escreve no disco!)
# q → Sair SEM salvar

# Exemplo: Criar nova tabela GPT e partição:
# 1. Abrir fdisk:
sudo fdisk /dev/sdb

# 2. Criar nova tabela GPT (apaga tudo):
# Command: g   ← criar tabela GPT

# 3. Criar nova partição:
# Command: n   ← nova partição
# Partition number (1-128): 1
# First sector: Enter   ← aceitar padrão (início do disco)
# Last sector: +100G    ← tamanho de 100GB

# 4. Ver o resultado:
# Command: p

# 5. Salvar:
# Command: w`}
      />

      <h2>Formatando Partições</h2>
      <CodeBlock
        title="Criar sistemas de arquivos (formatar)"
        code={`# Formatar como ext4 (padrão Linux, o mais usado)
sudo mkfs.ext4 /dev/sdb1

# Formatar como ext4 com label (nome) para fácil identificação
sudo mkfs.ext4 -L "dados" /dev/sdb1

# Formatar como XFS (bom para arquivos grandes, servidores)
sudo mkfs.xfs /dev/sdb1

# Formatar como Btrfs (moderno, suporta snapshots)
sudo mkfs.btrfs /dev/sdb1

# Formatar como FAT32 (compatibilidade com Windows, pen drives)
sudo mkfs.vfat -F32 /dev/sdb1

# Formatar como exFAT (melhor para pen drives modernos)
sudo apt install exfatprogs
sudo mkfs.exfat /dev/sdb1

# Formatar como NTFS (leitura/escrita com Windows)
sudo apt install ntfs-3g
sudo mkfs.ntfs /dev/sdb1

# Criar área de swap
sudo mkswap /dev/sdb2
sudo swapon /dev/sdb2    # Ativar imediatamente`}
      />

      <h2>Montando e Desmontando</h2>
      <CodeBlock
        title="Montar sistemas de arquivos"
        code={`# Criar ponto de montagem
sudo mkdir -p /mnt/dados
sudo mkdir -p /media/externo

# Montar um disco
sudo mount /dev/sdb1 /mnt/dados

# Montar com opções específicas
sudo mount -o ro /dev/sdb1 /mnt/dados        # somente leitura
sudo mount -o noexec /dev/sdb1 /mnt/dados    # sem executar programas
sudo mount -o nosuid /dev/sdb1 /mnt/dados    # sem SUID

# Montar pen drive exFAT
sudo mount -t exfat /dev/sdb1 /media/pendrive

# Montar imagem ISO
sudo mount -o loop ubuntu.iso /mnt/iso

# Ver o que está montado
mount | column -t
findmnt                    # Visual mais moderno

# Desmontar
sudo umount /mnt/dados
sudo umount /dev/sdb1     # Equivalente

# Desmontar forçado (cuidado!)
sudo umount -f /mnt/dados`}
      />

      <h2>/etc/fstab — Montagem Automática no Boot</h2>
      <CodeBlock
        title="Configurar montagem automática"
        code={`# Ver configuração atual
cat /etc/fstab

# Formato do fstab:
# DISPOSITIVO  PONTO_MOUNT  TIPO  OPÇÕES  DUMP  PASS

# Encontrar o UUID do disco para usar no fstab
blkid /dev/sdb1
# /dev/sdb1: UUID="a1b2c3d4-..." TYPE="ext4"

# Exemplo de entradas no fstab:
# Disco de dados montado em /mnt/dados
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890  /mnt/dados  ext4  defaults,nofail  0  2

# Pen drive USB (montagem opcional, não travar boot se ausente)
UUID=1234-ABCD  /mnt/pendrive  vfat  defaults,nofail,uid=1000,gid=1000  0  0

# Swap
UUID=...  none  swap  sw  0  0

# Opções comuns:
# defaults  = opções padrão (rw, auto, exec, suid)
# nofail    = não travar o boot se o dispositivo não estiver presente
# noatime   = não atualizar tempo de acesso (melhora performance)
# ro        = somente leitura

# Testar o fstab sem reiniciar
sudo mount -a    # Monta todos os itens do fstab
# Se não der erro, o fstab está correto`}
      />

      <h2>LVM — Logical Volume Manager</h2>
      <CodeBlock
        title="Gerenciamento de volumes lógicos"
        code={`# LVM permite redimensionar volumes sem reformatar
# Estrutura: Physical Volumes → Volume Groups → Logical Volumes

# Instalar LVM
sudo apt install lvm2

# Verificar se LVM está em uso
sudo pvdisplay    # Physical Volumes
sudo vgdisplay    # Volume Groups
sudo lvdisplay    # Logical Volumes

# Ver estrutura simplificada
sudo lsblk

# Exemplo: Expandir volume root quando adicionar espaço no disco

# 1. Ver estado atual
sudo lvdisplay /dev/ubuntu-vg/ubuntu-lv

# 2. Expandir o Physical Volume (após expandir o disco na nuvem/VM)
sudo pvresize /dev/sda3

# 3. Expandir o Logical Volume
sudo lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv

# 4. Expandir o sistema de arquivos ext4
sudo resize2fs /dev/ubuntu-vg/ubuntu-lv

# 5. Verificar o resultado
df -h /`}
      />

      <h2>Verificar e Reparar Sistemas de Arquivos</h2>
      <CodeBlock
        title="fsck — verificação e reparo"
        code={`# IMPORTANTE: O disco deve estar DESMONTADO para ser verificado!

# Verificar sistema de arquivos ext4
sudo fsck /dev/sdb1

# Verificar e corrigir automaticamente sem perguntas
sudo fsck -y /dev/sdb1

# Verificar ext4 com verificação de blocos ruins
sudo fsck -c /dev/sdb1

# Para verificar a partição raiz (/), é preciso fazer no boot
# Força verificação no próximo boot:
sudo touch /forcefsck
# Ou:
sudo tune2fs -C 1 /dev/sda3

# Ver informações de um sistema de arquivos ext4
sudo tune2fs -l /dev/sda3 | grep -E "volume|mount|errors"

# Ver SMART do disco (saúde do HD/SSD)
sudo apt install smartmontools
sudo smartctl -a /dev/sda`}
      />
    </PageContainer>
  );
}
