import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import { OutputBlock } from "@/components/ui/OutputBlock";

export default function Historia() {
  return (
    <PageContainer
      title="A História do Arch Linux"
      subtitle="De um projeto solo de Judd Vinet em 2002 ao SteamOS — vinte e poucos anos do KISS levado a sério."
      difficulty="iniciante"
      timeToRead="10 min"
      category="Introdução"
    >
      <p>
        Antes de mergulhar nos comandos, vale entender de onde o Arch veio. Diferente de Ubuntu (filho do
        Debian) ou Manjaro (filho do próprio Arch), o Arch Linux foi escrito <em>from scratch</em>,
        guiado por uma filosofia muito clara: simplicidade, modernidade e usuário no controle.
      </p>

      <h2>Quem é você, exatamente?</h2>
      <p>
        Antes de tudo, vamos confirmar em que sistema estamos. Os comandos abaixo funcionam em qualquer
        instalação Arch — eles são a "carteira de identidade" do sistema.
      </p>

      <TerminalBlock
        command="cat /etc/os-release"
        output={`NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=arch
BUILD_ID=rolling
ANSI_COLOR="38;2;23;147;209"
HOME_URL="https://archlinux.org/"
DOCUMENTATION_URL="https://wiki.archlinux.org/"
SUPPORT_URL="https://bbs.archlinux.org/"
BUG_REPORT_URL="https://gitlab.archlinux.org/groups/archlinux/-/issues"
PRIVACY_POLICY_URL="https://terms.archlinux.org/docs/privacy-policy/"
LOGO=archlinux-logo`}
      />

      <OutputBlock
        title="anatomia da resposta"
        output={`NAME="Arch Linux"
PRETTY_NAME="Arch Linux"
ID=arch
BUILD_ID=rolling
ANSI_COLOR="38;2;23;147;209"`}
        annotations={[
          { line: 0, note: "nome usado por scripts" },
          { line: 1, note: "nome formatado p/ humanos" },
          { line: 2, note: "id curto que neofetch/lsb usam" },
          { line: 3, note: "rolling = sem versão fixa" },
          { line: 4, note: "RGB do azul oficial #1793D1" },
        ]}
      />

      <TerminalBlock
        command="uname -a"
        output="Linux archlinux 6.8.7-arch1-1 #1 SMP PREEMPT_DYNAMIC Wed, 17 Apr 2024 15:23:10 +0000 x86_64 GNU/Linux"
        comment="kernel + hostname + arquitetura, tudo em uma linha"
      />

      <OutputBlock
        output={`Linux archlinux 6.8.7-arch1-1 #1 SMP PREEMPT_DYNAMIC Wed, 17 Apr 2024 15:23:10 +0000 x86_64 GNU/Linux`}
        annotations={[
          { line: 0, note: "kernel · host · versão · build · arch" },
        ]}
        caption="O sufixo arch1-1 indica que é o kernel oficial empacotado pela equipe Arch."
      />

      <h2>2002 — Judd Vinet aperta Enter</h2>
      <p>
        Em <strong>11 de março de 2002</strong>, o canadense Judd Vinet lança a primeira ISO oficial:
        <code> Arch Linux 0.1 "Homer"</code>. Vinet era fã de CRUX (uma distro minimalista feita por
        Per Lidén), mas sentia falta de um gerenciador de pacotes capaz de resolver dependências.
      </p>

      <TerminalBlock
        command="pacman --version"
        output={` .--.                  Pacman v6.1.0 - libalpm v14.0.0
/ _.-' .-.  .-.  .-.   Copyright (C) 2006-2024 Pacman Development Team
\\  '-. '-'  '-'  '-'   Copyright (C) 2002-2006 Judd Vinet
 '--'
                       This program may be freely redistributed under
                       the terms of the GNU General Public License.`}
      />

      <AlertBox type="info" title="Pacman herdou de Vinet">
        Repare: o copyright original (2002) leva o nome de Judd Vinet. O <code>pacman</code> foi
        escrito em C por ele mesmo para resolver justamente o problema que o CRUX não resolvia:
        dependências automáticas. Mais de 20 anos depois, ainda é o mesmo programa, evoluído.
      </AlertBox>

      <h2>2007–2020 — A era Aaron Griffin</h2>
      <p>
        Em outubro de 2007, Judd se afasta e <strong>Aaron Griffin</strong> assume. Sob sua liderança,
        o modelo <em>rolling release</em> vira marca registrada do projeto. Em vez de versões com
        números (Ubuntu 22.04, 24.04…), você instala uma vez e atualiza pra sempre.
      </p>

      <TerminalBlock
        command="pacman -Syu"
        output={`{c}::{/} Synchronizing package databases...
 core                  130.5 KiB  2.31 MiB/s 00:00 [############] 100%
 extra                 8.2 MiB    11.4 MiB/s 00:01 [############] 100%
 multilib              182.6 KiB  3.01 MiB/s 00:00 [############] 100%
{c}::{/} Starting full system upgrade...
 there is nothing to do`}
        comment="rolling: dia normal, raramente há grandes saltos"
      />

      <h2>Linha do tempo — momentos marcantes</h2>

      <OutputBlock
        title="cat /var/log/arch-history.log"
        output={`{y}2002-03-11{/}  Arch Linux 0.1 "Homer" — primeira ISO
{y}2003-04-17{/}  Arch 0.5 "Nova" — pacman 2.0, dependências resolvidas
{y}2005-12-13{/}  AUR (Arch User Repository) entra no ar
{y}2007-10-01{/}  Aaron Griffin assume a liderança
{y}2012-10-09{/}  systemd vira init padrão (substitui SysVinit)
{y}2017-02-25{/}  Fim do suporte a i686 — só x86_64
{y}2020-02-24{/}  Levente Polyak vira líder do projeto
{y}2021-04-01{/}  archinstall incluído na ISO oficial
{y}2022-08-15{/}  SteamOS 3.0 (Steam Deck) é baseado em Arch
{y}2024-03-04{/}  Migração do BBS/Wiki para infra própria moderna`}
        annotations={[
          { line: 0, note: "release inicial" },
          { line: 2, note: "AUR vira o maior repo Linux" },
          { line: 4, note: "decisão controversa, hoje padrão" },
          { line: 6, note: "limpeza de código legado" },
          { line: 8, note: "Valve aposta em Arch" },
        ]}
      />

      <h3>2005 — AUR (Arch User Repository)</h3>
      <p>
        A comunidade ganha um lugar onde qualquer pessoa pode publicar receitas (PKGBUILDs) para
        construir software que não está nos repositórios oficiais. Hoje o AUR tem mais de
        <strong> 80.000 pacotes</strong>.
      </p>

      <TerminalBlock
        command="curl -s https://aur.archlinux.org/rpc/?v=5\\&type=info\\&arg[]=yay | jq '.results[0] | {Name,Version,Maintainer,NumVotes}'"
        output={`{
  "Name": "yay",
  "Version": "12.4.2-1",
  "Maintainer": "jguer",
  "NumVotes": 2851
}`}
      />

      <h3>2012 — A polêmica do systemd</h3>
      <p>
        O Arch foi uma das primeiras grandes distros a abandonar o SysVinit em favor do systemd.
        Hoje você confirma o init system com:
      </p>

      <TerminalBlock
        command="ls -l /sbin/init"
        output="lrwxrwxrwx 1 root root 22 Apr 17 15:23 {b}/sbin/init{/} -> {c}../lib/systemd/systemd{/}"
        comment="o símbolo /sbin/init é apenas um atalho para o systemd"
      />

      <h3>2017 — Adeus i686</h3>
      <p>
        Com a queda dos processadores 32-bits, o projeto removeu oficialmente a arquitetura
        <code> i686</code>. Hoje, o Arch é exclusivamente <code>x86_64</code> (existe o projeto
        comunitário <em>Arch Linux 32</em> mantendo i686 separado).
      </p>

      <TerminalBlock
        command="uname -m"
        output="x86_64"
        comment="se aparecer outra coisa, você não está no Arch oficial"
      />

      <h3>2021 — archinstall pra todo mundo</h3>
      <p>
        Por quase 20 anos, instalar Arch significava digitar dezenas de comandos. Em abril de 2021, o
        script <code>archinstall</code> (em Python) passa a vir pré-instalado na ISO oficial.
      </p>

      <TerminalBlock
        prompt="root@archiso ~ # "
        command="archinstall --help"
        output={`usage: archinstall [-h] [--config CONFIG] [--creds CREDS] [--silent]
                   [--dry-run] [--script SCRIPT] [--mountpoint MOUNTPOINT]
                   [--skip-version-check] [--debug]

Arch Linux installer - guided, configurable, scriptable.

options:
  -h, --help              show this help message and exit
  --config CONFIG         JSON file with installer configuration
  --silent                run without any user input (requires --config)
  --dry-run               do not actually install
  --script SCRIPT         alternative profile script (default: guided)`}
      />

      <h2>O ecossistema que nasceu do Arch</h2>

      <AlertBox type="success" title="Filhas e netas do Arch">
        <ul className="mt-2 mb-0">
          <li><strong>Manjaro</strong> — segura pacotes por algumas semanas antes de liberar (mais estável)</li>
          <li><strong>EndeavourOS</strong> — sucessor do Antergos, "Arch puro com instalador gráfico"</li>
          <li><strong>Garuda</strong> — focada em jogos, BTRFS por padrão, visual extravagante</li>
          <li><strong>SteamOS 3.0+</strong> — base do Steam Deck, com Arch e KDE Plasma</li>
          <li><strong>CachyOS</strong> — Arch otimizado com kernel customizado para performance</li>
        </ul>
      </AlertBox>

      <h2>Hoje (2024+)</h2>
      <p>
        A liderança hoje é de <strong>Levente Polyak</strong>, com uma equipe de Trusted Users e
        Package Maintainers totalmente voluntária. A documentação — a famosa <em>ArchWiki</em> — é
        considerada uma das melhores fontes técnicas de Linux do planeta, consultada até por
        usuários de outras distros.
      </p>

      <TerminalBlock
        command="systemd-analyze"
        output={`Startup finished in 1.823s (firmware) + 312ms (loader) + 956ms (kernel) + 1.247s (userspace) = 4.339s
graphical.target reached after 1.244s in userspace.`}
        comment="boot típico em SSD NVMe — Arch é leve por design"
      />

      <p>
        Vinte e poucos anos depois, o Arch continua fiel ao que Vinet escreveu na primeira
        documentação: <em>"a distribution for the competent Linux user"</em>. Não é a mais fácil. É
        a que melhor te ensina o que está acontecendo.
      </p>
    </PageContainer>
  );
}
