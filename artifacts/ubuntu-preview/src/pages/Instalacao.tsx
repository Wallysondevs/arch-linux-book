import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Instalacao() {
  return (
    <PageContainer
      title="Guia de Instalação do Ubuntu"
      subtitle="Instalação completa do Ubuntu Desktop e Server — do pen drive bootável até o primeiro login, passo a passo."
      difficulty="iniciante"
      timeToRead="30 min"
    >
      <p>
        Instalar o Ubuntu é um dos processos mais simples no mundo Linux. Diferente do Arch Linux
        (que exige linha de comando pura), o Ubuntu tem um instalador gráfico intuitivo com botões
        grandes e linguagem clara. Este guia cobre Ubuntu 24.04 LTS (Noble Numbat) tanto para
        Desktop quanto para Server.
      </p>

      <h2>Pré-Requisitos</h2>
      <ul>
        <li>Pen drive de pelo menos <strong>4GB</strong> (será formatado)</li>
        <li>Conexão com internet (recomendado durante a instalação)</li>
        <li>PC com boot UEFI ou BIOS legada</li>
        <li>Mínimo: 25GB de disco, 4GB RAM. Recomendado: 50GB+ disco, 8GB RAM</li>
        <li>Backup de todos os dados importantes — a instalação pode apagar dados</li>
      </ul>

      <h2>1. Baixar a ISO</h2>
      <p>
        Acesse <code>ubuntu.com/download</code> e baixe a versão desejada:
      </p>
      <ul>
        <li><strong>Ubuntu Desktop</strong>: Para uso pessoal com interface gráfica. Arquivo ~5GB.</li>
        <li><strong>Ubuntu Server</strong>: Para servidores, sem interface gráfica. Arquivo ~2GB.</li>
        <li><strong>Ubuntu LTS</strong>: Versão de suporte longo (5 anos). Recomendado para todos.</li>
      </ul>
      <AlertBox type="success" title="Verifique o checksum SHA256">
        Após baixar, verifique a integridade do arquivo para garantir que não foi corrompido:
        <code>sha256sum ubuntu-24.04-desktop-amd64.iso</code> e compare com o hash no site oficial.
      </AlertBox>

      <h2>2. Criar o Pen Drive Bootável</h2>

      <h3>No Linux</h3>
      <CodeBlock
        title="Gravar ISO no pen drive (Linux)"
        code={`# Descobrir o dispositivo do pen drive
lsblk
# Identifique pelo tamanho. Exemplo: /dev/sdb (14.5G)

# Desmontar se estiver montado
sudo umount /dev/sdb1

# Gravar a ISO
sudo dd bs=4M if=ubuntu-24.04-desktop-amd64.iso \\
    of=/dev/sdb status=progress oflag=sync

# Alternativa mais rápida com pv:
sudo apt install pv
pv ubuntu-24.04-desktop-amd64.iso | sudo dd bs=4M of=/dev/sdb oflag=sync`}
      />

      <h3>No Windows ou macOS</h3>
      <p>
        Use o <strong>balenaEtcher</strong> (<code>etcher.balena.io</code>) — selecione a ISO,
        selecione o pen drive, clique em Flash. É simples assim.
        Outra opção no Windows é o <strong>Rufus</strong> (<code>rufus.ie</code>).
      </p>

      <h2>3. Dar Boot pelo Pen Drive</h2>
      <p>
        Insira o pen drive, reinicie o computador e entre no menu de boot:
      </p>
      <ul>
        <li><strong>ASUS</strong>: F8 ou ESC</li>
        <li><strong>Acer</strong>: F12</li>
        <li><strong>Dell</strong>: F12</li>
        <li><strong>HP</strong>: F9 ou ESC</li>
        <li><strong>Lenovo</strong>: F12 ou Fn+F12</li>
        <li><strong>MSI</strong>: F11</li>
      </ul>
      <p>
        Se o pen drive não aparecer, desabilite o <strong>Secure Boot</strong> na BIOS/UEFI
        (normalmente em Security → Secure Boot → Disabled).
      </p>

      <h2>4. Instalação do Ubuntu Desktop</h2>

      <h3>Tela de Boas-Vindas</h3>
      <p>
        Após o boot, você pode escolher <strong>"Try Ubuntu"</strong> (testar sem instalar) ou
        <strong>"Install Ubuntu"</strong>. Escolha instalar.
        Selecione o idioma <strong>Português (Brasil)</strong> e clique em "Instalar Ubuntu".
      </p>

      <h3>Configurações Iniciais</h3>
      <CodeBlock
        title="Telas do instalador Ubuntu 24.04"
        code={`Tela 1: Tipo de teclado
  → Português (Brasil) — ABNT2 com Ç
  → Clique em "Identificar Teclado" se não souber o layout

Tela 2: Atualizações e outros programas
  → "Instalação Normal" = inclui navegador, software de escritório, apps de mídia
  → "Instalação Mínima" = apenas o básico (navegador e utilitários)
  ✓ "Baixar atualizações ao instalar o Ubuntu"
  ✓ "Instalar software de terceiros" (drivers proprietários NVIDIA, Wi-Fi, codecs)

Tela 3: Tipo de instalação (MAIS IMPORTANTE)
  → "Apagar disco e instalar o Ubuntu" (mais simples, apaga tudo)
  → "Instalar ao lado do Windows" (dual-boot automático)
  → "Outra opção" (particionamento manual — avançado)

  Opções avançadas (se aparecer):
  ✓ "Usar LVM" — gerenciamento de volumes lógicos (recomendado)
  ✓ "Criptografar disco" — solicita senha a cada boot`}
      />

      <AlertBox type="danger" title="Atenção ao particionamento!">
        A opção "Apagar disco e instalar o Ubuntu" vai apagar <strong>tudo no disco</strong>.
        Se você tem Windows ou outros dados, escolha "Instalar ao lado do Windows" para dual-boot,
        ou faça backup antes de prosseguir.
      </AlertBox>

      <h3>Particionamento Manual (Opção Avançada)</h3>
      <CodeBlock
        title="Esquema de partições recomendado"
        code={`# Para um disco de 250GB com UEFI:

/dev/sda1  →  512MB  →  EFI System Partition  →  fat32  →  /boot/efi
/dev/sda2  →  2GB    →  Linux swap             →  swap
/dev/sda3  →  50GB   →  Raiz do sistema        →  ext4   →  /
/dev/sda4  →  197GB  →  Arquivos pessoais       →  ext4   →  /home

# Ter /home separado é vantajoso: se precisar reinstalar o sistema,
# seus arquivos em /home ficam intactos.

# Para discos menores (ex: 60GB SSD):
/dev/sda1  →  512MB  →  EFI   →  fat32  →  /boot/efi
/dev/sda2  →  2GB    →  swap
/dev/sda3  →  57GB   →  /     →  ext4   →  /`}
      />

      <h3>Informações Pessoais</h3>
      <CodeBlock
        title="Configuração de usuário"
        code={`Nome completo: João Silva
Nome do computador: ubuntu-joao    # sem espaços, preferência por hífens
Nome de usuário: joao              # tudo minúsculo, sem espaços
Senha: ••••••••                   # use uma senha forte

Opções de login:
○ Fazer login automaticamente     # Conveniente mas menos seguro
● Solicitar senha para entrar      # Recomendado`}
      />

      <p>
        A instalação começa e leva entre 10-20 minutos dependendo da velocidade do disco e
        da internet. Ao final, clique em <strong>"Reiniciar"</strong> e remova o pen drive
        quando solicitado.
      </p>

      <h2>5. Instalação do Ubuntu Server</h2>
      <p>
        O Ubuntu Server usa o instalador <strong>Subiquity</strong>, uma interface de texto
        (não gráfica) que funciona em qualquer servidor.
      </p>
      <CodeBlock
        title="Etapas do instalador Ubuntu Server"
        code={`# Tela 1: Idioma
  → Escolha English (o Server é frequentemente gerenciado em inglês)
  → Ou Português do Brasil se preferir

# Tela 2: Tipo de teclado
  → Layout: Portuguese (Brazil)
  → Variant: Portuguese (Brazil, eliminate dead keys) [ABNT2]

# Tela 3: Tipo de instalação
  → Ubuntu Server (padrão)
  → Ubuntu Server (minimized) — para containers e VMs

# Tela 4: Configuração de rede
  → Se cabo ethernet: detecta automaticamente via DHCP
  → Se Wi-Fi: selecione a rede e digite a senha

# Tela 5: Proxy HTTP
  → Deixe em branco se não tiver proxy corporativo

# Tela 6: Mirror do Ubuntu
  → O instalador testa e seleciona o mais rápido automaticamente
  → Pode deixar o padrão

# Tela 7: Armazenamento (Particionamento)
  → "Use entire disk" = usar o disco todo (recomendado)
  → "Use entire disk with LVM" = com gerenciamento de volumes
  → "Custom storage layout" = manual

# Tela 8: Perfil (Usuário)
  → Seu nome, nome do servidor, usuário, senha

# Tela 9: Ubuntu Pro (opcional)
  → Pode pular clicando em "Skip for now"
  → Ubuntu Pro oferece ESM (Extended Security Maintenance)

# Tela 10: Pacotes extras
  ✓ OpenSSH server ← MARQUE ESTE para poder acessar remotamente!
  □ Various snaps (selecione se quiser Docker, etc)

# Instalação começa automaticamente. Ao final: Reboot.`}
      />

      <AlertBox type="warning" title="OpenSSH no Server é essencial!">
        Na instalação do Ubuntu Server, <strong>marque OpenSSH server</strong>. Sem ele, você
        não conseguirá acessar o servidor remotamente via SSH. Se esquecer, instale depois:
        <code>sudo apt install openssh-server</code>
      </AlertBox>

      <h2>6. Primeiras Verificações Após Instalar</h2>
      <CodeBlock
        title="Verificações pós-instalação"
        code={`# Verificar versão do Ubuntu instalada
lsb_release -a
# Distributor ID: Ubuntu
# Description:    Ubuntu 24.04.1 LTS
# Release:        24.04
# Codename:       noble

# Verificar kernel
uname -r
# 6.8.0-31-generic

# Verificar espaço em disco
df -h

# Verificar memória RAM disponível
free -h

# Verificar internet
ping -c 3 google.com

# Atualizar o sistema antes de mais nada
sudo apt update && sudo apt upgrade -y`}
      />
    </PageContainer>
  );
}
