import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Historia() {
  return (
    <PageContainer
      title="A História do Ubuntu"
      subtitle="De um sonho sul-africano ao Linux mais popular do mundo — a trajetória do Ubuntu, do lançamento em 2004 até hoje."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Ubuntu. A palavra vem de um conceito filosófico africano que se traduz aproximadamente como
        <em>"Eu sou porque nós somos"</em> ou <em>"Humanidade para os outros"</em>. Em 2004, um
        bilionário sul-africano decidiu que esse nome seria o ideal para um novo sistema operacional
        Linux — gratuito, bonito, fácil de usar, e construído sobre os ombros de décadas de trabalho
        comunitário do software livre.
      </p>

      <h2>O Começo: Mark Shuttleworth e a Canonical (2004)</h2>
      <p>
        <strong>Mark Shuttleworth</strong>, cofundador da empresa de segurança digital Thawte (vendida para
        a VeriSign por 575 milhões de dólares em 1999), financiou de seu próprio bolso o projeto Ubuntu.
        Em 2002, ele viajou para o espaço como o segundo turista espacial da história a bordo de um foguete
        russo Soyuz — um detalhe que diz muito sobre sua personalidade visionária.
      </p>
      <p>
        Em 2004, Shuttleworth fundou a <strong>Canonical Ltd.</strong>, com sede em Londres, e reuniu
        um time de desenvolvedores de todo o mundo com um objetivo claro: criar uma distribuição Linux
        baseada no Debian que fosse simples de instalar, usar e manter — e que lançasse novas versões
        a cada seis meses, com suporte de longo prazo (LTS) a cada dois anos.
      </p>

      <AlertBox type="info" title="A base: Debian">
        O Ubuntu é construído sobre o <strong>Debian</strong>, uma das distribuições Linux mais antigas
        e respeitadas (criada em 1993). O Ubuntu herdou o formato de pacotes <code>.deb</code> e o
        gerenciador APT, mas adicionou um ciclo de lançamento previsível, uma equipe profissional de
        suporte e um foco intenso na experiência do usuário.
      </AlertBox>

      <h2>O Primeiro Lançamento: Ubuntu 4.10 "Warty Warthog" (2004)</h2>
      <p>
        Em 20 de outubro de 2004, o Ubuntu 4.10 foi lançado. O número da versão segue o padrão
        <strong>Ano.Mês</strong>, então 4.10 significa outubro de 2004. O codinome "Warty Warthog"
        (Javali Verrugoso) inaugurou a tradição de codinomes com animais em ordem alfabética.
      </p>
      <p>
        A proposta era ousada: qualquer pessoa no mundo podia solicitar CDs físicos do Ubuntu
        gratuitamente pelo correio, através do programa <strong>ShipIt</strong>. A Canonical enviou
        milhões de CDs para mais de 100 países — um investimento massivo para popularizar o Linux.
      </p>

      <h2>A Tradição dos Codinomes</h2>
      <p>
        Cada versão do Ubuntu recebe um codinome com duas palavras começando com a mesma letra do
        alfabeto, sendo um adjetivo e um animal. A sequência é sempre em ordem alfabética:
      </p>
      <ul>
        <li><strong>4.10</strong> — Warty Warthog (W de... começando no W para dar margem)</li>
        <li><strong>5.04</strong> — Hoary Hedgehog</li>
        <li><strong>6.06 LTS</strong> — Dapper Drake (primeiro LTS com 3 anos de suporte)</li>
        <li><strong>8.04 LTS</strong> — Hardy Heron</li>
        <li><strong>10.04 LTS</strong> — Lucid Lynx</li>
        <li><strong>12.04 LTS</strong> — Precise Pangolin</li>
        <li><strong>14.04 LTS</strong> — Trusty Tahr</li>
        <li><strong>16.04 LTS</strong> — Xenial Xerus</li>
        <li><strong>18.04 LTS</strong> — Bionic Beaver</li>
        <li><strong>20.04 LTS</strong> — Focal Fossa</li>
        <li><strong>22.04 LTS</strong> — Jammy Jellyfish</li>
        <li><strong>24.04 LTS</strong> — Noble Numbat</li>
      </ul>

      <h2>Marcos Históricos</h2>
      <ul>
        <li>
          <strong>2006 — Ubuntu 6.06 LTS (Dapper Drake):</strong> Primeiro lançamento LTS com 3 anos de
          suporte para desktop e 5 para servidor. Estabeleceu o Ubuntu como opção séria para empresas.
        </li>
        <li>
          <strong>2010 — Unity:</strong> A Canonical lançou a interface Unity, um ambiente gráfico
          exclusivo desenvolvido para o Ubuntu, substituindo o GNOME 2. Foi controverso mas trouxe
          inovações importantes como a HUD (Head-Up Display) e o Dash.
        </li>
        <li>
          <strong>2013 — Ubuntu para Tablets e Celulares:</strong> A Canonical tentou entrar no mercado
          mobile com o Ubuntu Touch. O projeto foi descontinuado em 2017, mas a comunidade o mantém
          vivo no projeto UBports.
        </li>
        <li>
          <strong>2017 — Retorno ao GNOME:</strong> O Ubuntu 17.10 abandonou o Unity e voltou ao GNOME
          como ambiente padrão. Uma mudança histórica que reconheceu a força da comunidade GNOME e
          permitiu maior padronização com outras distribuições.
        </li>
        <li>
          <strong>2018 — Ubuntu 18.04 LTS (Bionic Beaver):</strong> Um dos lançamentos LTS mais
          importantes, com suporte de 10 anos para servidores via ESM (Extended Security Maintenance).
          Adotado massivamente por empresas ao redor do mundo.
        </li>
        <li>
          <strong>2022 — Ubuntu 22.04 LTS (Jammy Jellyfish):</strong> Trouxe o GNOME 42, Wayland como
          sessão padrão, e melhorias significativas de desempenho.
        </li>
        <li>
          <strong>2024 — Ubuntu 24.04 LTS (Noble Numbat):</strong> GNOME 46, kernel Linux 6.8, melhorias
          de segurança com AppArmor 4, e suporte até 2029 (ou 2034 com ESM).
        </li>
      </ul>

      <AlertBox type="success" title="O Ecossistema Ubuntu">
        A popularidade do Ubuntu deu origem a toda uma família de distribuições "sabores" (flavours)
        oficiais e derivadas:
        <ul className="mt-2 mb-0">
          <li><strong>Kubuntu:</strong> Ubuntu com KDE Plasma em vez de GNOME</li>
          <li><strong>Xubuntu:</strong> Ubuntu com XFCE — leve e ideal para PCs antigos</li>
          <li><strong>Ubuntu MATE:</strong> Ubuntu com MATE (fork do GNOME 2) — clássico e familiar</li>
          <li><strong>Ubuntu Studio:</strong> Ubuntu para produção criativa (áudio, vídeo, gráficos)</li>
          <li><strong>Linux Mint:</strong> Derivada muito popular focada em facilidade de uso extrema</li>
          <li><strong>Pop!_OS:</strong> Desenvolvida pela System76, focada em desenvolvedores e gamers</li>
          <li><strong>elementary OS:</strong> Visual inspirado no macOS, foco em elegância</li>
        </ul>
      </AlertBox>

      <h2>O Ubuntu Hoje</h2>
      <p>
        Em 2025, o Ubuntu é instalado em mais de <strong>40 milhões de computadores</strong>, é o
        sistema operacional Linux mais popular do mundo e lidera o mercado de servidores em nuvem
        (Amazon AWS, Google Cloud, Microsoft Azure). É a distribuição recomendada por padrão na maioria
        dos tutoriais de programação, containers Docker e guias de DevOps.
      </p>
      <p>
        A Canonical, agora com mais de 700 funcionários em todo o mundo, continua financiando o
        desenvolvimento com suporte empresarial, Kubernetes gerenciado (MicroK8s), Ubuntu Core para
        dispositivos IoT, e muito mais. O Ubuntu permanece gratuito e de código aberto para todos.
      </p>
    </PageContainer>
  );
}
