import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function Filosofia() {
  return (
    <PageContainer
      title="A Filosofia Arch (The Arch Way)"
      subtitle="Cinco princípios — simplicidade, modernidade, pragmatismo, foco no usuário e versatilidade — demonstrados em terminais reais."
      difficulty="iniciante"
      timeToRead="8 min"
      category="Introdução"
    >
      <p>
        "The Arch Way" não é marketing — é uma decisão técnica que se sente em cada arquivo do
        sistema. Vamos provar isso comparando arquivos e comandos reais.
      </p>

      <h2>1. Simplicidade — KISS levado a sério</h2>
      <p>
        O Arch entrega o software <strong>como o autor original o escreveu</strong>. Sem patches
        pesados, sem ferramentas gráficas exclusivas que escondem arquivos. Compare o
        <code> /etc/pacman.conf </code> do Arch com o <code>/etc/apt/sources.list.d/</code> do
        Ubuntu (cheio de fragmentos auto-gerados):
      </p>

      <TerminalBlock
        command="head -25 /etc/pacman.conf"
        output={`#
# /etc/pacman.conf
#
# See the pacman.conf(5) manpage for option and repository directives

#
# GENERAL OPTIONS
#
[options]
HoldPkg     = pacman glibc
Architecture = auto
CheckSpace
ParallelDownloads = 5
Color
ILoveCandy
SigLevel    = Required DatabaseOptional
LocalFileSigLevel = Optional

#
# REPOSITORIES
#
[core]
Include = /etc/pacman.d/mirrorlist

[extra]
Include = /etc/pacman.d/mirrorlist`}
      />

      <OutputBlock
        title="o arquivo INTEIRO de configuração — só isso"
        output={`[options]
[core]
[extra]
[multilib]
# fim. nada escondido em /etc/pacman.conf.d/`}
        annotations={[
          { line: 0, note: "comportamento global" },
          { line: 1, note: "repo principal" },
          { line: 4, note: "sem fragmentação" },
        ]}
      />

      <p>
        Comparativamente, num Ubuntu padrão você encontra:
      </p>

      <TerminalBlock
        prompt="ubuntu$ "
        command="ls /etc/apt/sources.list.d/ | wc -l && find /etc/apt -name '*.conf*' | wc -l"
        output={`9
14`}
        comment="apt espalha config em ~14 arquivos diferentes"
      />

      <AlertBox type="warning" title="Simplicidade ≠ Facilidade">
        Cuidado: "simples" no Arch significa <strong>arquitetura clara</strong>, não <em>botões grandes
        e bonitos</em>. Você vai precisar editar arquivos de texto. Em troca, você sempre saberá
        onde a configuração mora.
      </AlertBox>

      <h2>2. Modernidade — Bleeding Edge</h2>
      <p>
        Arch é <em>rolling release</em> — não existem versões. O kernel mais recente do site oficial
        do kernel.org costuma estar no Arch <strong>em poucos dias</strong>.
      </p>

      <TerminalBlock
        command="pacman -Si linux | grep -E 'Name|Version|Build'"
        output={`Name            : linux
Version         : 6.8.7.arch1-1
Build Date      : Wed 17 Apr 2024 15:23:10`}
      />

      <TerminalBlock
        command="curl -s https://www.kernel.org/finger_banner | head -3"
        output={`The latest stable version of the Linux kernel is:        6.8.7
The latest mainline version of the Linux kernel is:      6.9-rc4
The latest stable 6.8 version of the Linux kernel is:    6.8.7`}
        comment="o que o kernel.org publica HOJE chega no Arch nesta semana"
      />

      <h2>3. Pragmatismo — funcionou, entrou</h2>
      <p>
        Diferente do Debian ou Fedora, o Arch não tem ideologia rígida sobre software proprietário.
        Drivers da NVIDIA, firmware fechado, codecs — tudo está nos repositórios oficiais.
      </p>

      <TerminalBlock
        command="pacman -Ss nvidia | head -8"
        output={`{c}extra/nvidia 550.67-12 (nvidia){/}
    NVIDIA drivers for linux
{c}extra/nvidia-utils 550.67-2 (nvidia){/}
    NVIDIA drivers utilities
{c}extra/nvidia-settings 550.67-1 (nvidia){/}
    Tool for configuring the NVIDIA graphics driver
{c}extra/opencl-nvidia 550.67-2 (nvidia){/}
    OpenCL implemention for NVIDIA`}
        comment="driver proprietário — a um pacman -S de distância"
      />

      <h2>4. User-centric — o sistema é seu</h2>
      <p>
        "User-friendly" é tentar agradar a todos. "User-centric" é assumir que o usuário é capaz de
        ler documentação e tomar decisões. Por isso, na primeira inicialização do Arch, você tem
        apenas isto:
      </p>

      <TerminalBlock
        prompt=""
        command=""
        lines={[
          { type: "output", text: `Arch Linux 6.8.7-arch1-1 (tty1)\n\narchlinux login: _` }
        ]}
      />

      <p>
        Sem assistente. Sem "Bem-vindo!". Você decide o que instalar, com qual init system
        (sim, dá pra trocar o systemd), qual shell, qual desktop. O ArchWiki é parte do contrato:
      </p>

      <TerminalBlock
        command="pacman -Qi arch-wiki-docs | head -8"
        output={`Name            : arch-wiki-docs
Version         : 20240315-1
Description     : Pages from Arch Wiki optimized for offline browsing
Architecture    : any
URL             : https://gitlab.archlinux.org/archlinux/arch-wiki-docs
Licenses        : FDL-1.3-or-later
Groups          : None
Provides        : None`}
        comment="a wiki INTEIRA, pra ler offline"
      />

      <h2>5. Versatilidade — uma base, mil propósitos</h2>
      <p>
        A instalação base do Arch tem ~570 pacotes e ocupa cerca de 2 GB. A partir dali, o sistema
        pode virar um servidor minimalista ou uma estação de gaming AAA.
      </p>

      <TerminalBlock
        command="pacman -Qg base | wc -l"
        output="11"
        comment="o grupo 'base' tem só 11 pacotes essenciais"
      />

      <TerminalBlock
        command="pacman -Qg base"
        output={`base bash
base bzip2
base coreutils
base file
base filesystem
base findutils
base gawk
base gcc-libs
base gettext
base glibc
base grep`}
      />

      <OutputBlock
        title="anatomia do mínimo absoluto"
        output={`bash         interpretador de comandos
bzip2        descompactação
coreutils    ls, cp, mv, rm, cat, etc.
file         identifica tipo de arquivo
filesystem   estrutura de diretórios (FHS)
findutils    find, xargs
gawk         processamento de texto
gcc-libs     bibliotecas C compartilhadas
gettext      i18n (traduções)
glibc        a libc do GNU
grep         busca em texto`}
        annotations={[
          { line: 4, note: "/, /etc, /usr, /var..." },
          { line: 9, note: "coração de qualquer Linux" },
        ]}
      />

      <AlertBox type="info" title="Resumo prático">
        Quer um SO que pensa por você e esconde os detalhes? Use Ubuntu, Fedora ou Mint — são
        excelentes. Quer entender o Linux por dentro, ter controle total e ler menos changelogs
        e mais commits? Bem-vindo. <code>pacman -Syu</code> e siga.
      </AlertBox>
    </PageContainer>
  );
}
