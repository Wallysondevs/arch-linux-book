import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Filosofia() {
  return (
    <PageContainer
      title="Filosofia Ubuntu"
      subtitle="'Eu sou porque nós somos' — software livre, comunidade e o modelo único da Canonical que une negócios e código aberto."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <p>
        O Ubuntu nasceu de uma visão filosófica muito específica: que software de qualidade deve ser
        acessível a todos, independente de condição financeira, idioma ou localização geográfica.
        Essa visão ainda guia cada decisão de design e desenvolvimento do Ubuntu.
      </p>

      <h2>O Ubuntu Way: Os Princípios Fundamentais</h2>

      <h3>1. Software Livre e Gratuito Para Todos</h3>
      <p>
        O Ubuntu é e sempre será gratuito para baixar, usar, distribuir e modificar. A Canonical
        acredita que o software livre é um bem público — como estradas e praças — que deve estar
        disponível a todos. Isso é diferente de "freeware": o Ubuntu não é apenas grátis, é
        <strong> livre</strong> (open source), o que significa que você pode ver, estudar e
        modificar o código.
      </p>
      <AlertBox type="info" title="Diferença entre grátis e livre">
        "Grátis" (free as in beer) = sem custo financeiro. "Livre" (free as in freedom) = você tem
        as liberdades de usar, estudar, modificar e redistribuir. O Ubuntu é ambos. Algumas
        distribuições são grátis mas não livres (ex: software proprietário gratuito). O Ubuntu
        é livre E gratuito.
      </AlertBox>

      <h3>2. Ubuntu é Amigável ao Usuário por Princípio</h3>
      <p>
        Enquanto o Arch Linux orgulhosamente declara ser "user-centric" (para usuários avançados),
        o Ubuntu tem como missão explícita ser <strong>user-friendly</strong> — amigável a qualquer
        pessoa, do estudante ao idoso. Isso significa:
      </p>
      <ul>
        <li>Instalador gráfico com botões grandes e linguagem simples</li>
        <li>Hardware detectado automaticamente (Wi-Fi, Bluetooth, impressoras)</li>
        <li>Aplicativos úteis pré-instalados (LibreOffice, Firefox, apps de mídia)</li>
        <li>Atualizações automáticas de segurança configuradas por padrão</li>
        <li>Drivers proprietários (NVIDIA, Wi-Fi) disponíveis com um clique</li>
      </ul>

      <h3>3. Ubuntu para Todas as Pessoas</h3>
      <p>
        O Ubuntu tem um compromisso formal com <strong>acessibilidade</strong>. O sistema inclui:
      </p>
      <ul>
        <li>Leitor de tela Orca (para usuários com deficiência visual)</li>
        <li>Zoom de tela, alto contraste, fontes grandes configuráveis no GNOME</li>
        <li>Tradução em mais de 70 idiomas (incluindo português brasileiro completo)</li>
        <li>Teclado na tela para quem não pode usar teclado físico</li>
      </ul>

      <h3>4. Pragmatismo: Software Proprietário é Bem-vindo</h3>
      <p>
        Ao contrário do Debian (que tem regras muito rígidas sobre software livre) ou do Fedora,
        o Ubuntu adota uma posição pragmática: se o software proprietário melhora a experiência
        do usuário, ele é bem-vindo. Por isso:
      </p>
      <ul>
        <li>Drivers NVIDIA, AMD e de Wi-Fi proprietários podem ser instalados com um clique</li>
        <li>Codecs de mídia (MP3, H.264) podem ser instalados durante a instalação</li>
        <li>O Ubuntu incluía Flash Player e Java da Oracle quando eram relevantes</li>
        <li>A Snap Store oferece aplicativos proprietários como Spotify, Slack, VS Code</li>
      </ul>

      <h3>5. Ciclo de Lançamento Previsível</h3>
      <p>
        Uma das maiores vantagens do Ubuntu é o ciclo de lançamento <strong>previsível e garantido</strong>:
      </p>
      <ul>
        <li><strong>A cada 6 meses</strong>: Nova versão (April e October) com 9 meses de suporte</li>
        <li><strong>A cada 2 anos</strong>: Versão LTS (Long-Term Support) com <strong>5 anos</strong> de suporte gratuito</li>
        <li><strong>Com ESM</strong>: Até <strong>10 anos</strong> de atualizações de segurança para LTS</li>
      </ul>
      <p>
        Isso permite que empresas planejem com anos de antecedência. Um servidor Ubuntu 20.04 LTS
        instalado em 2020 receberá atualizações de segurança até 2025 (grátis) ou 2030 (com ESM).
      </p>

      <h2>A Canonical: Empresa com Missão Open Source</h2>
      <p>
        A Canonical é uma empresa comercial com fins lucrativos, mas com um modelo de negócio
        incomum: o produto principal (Ubuntu) é gratuito, e a empresa ganha dinheiro com:
      </p>
      <ul>
        <li><strong>Ubuntu Pro/ESM</strong>: Suporte estendido e patches de segurança para empresas</li>
        <li><strong>Landscape</strong>: Ferramenta de gerenciamento remoto de frotas de máquinas Ubuntu</li>
        <li><strong>MAAS (Metal as a Service)</strong>: Provisioning de servidores bare-metal em escala</li>
        <li><strong>Juju</strong>: Orquestração de aplicações em nuvem</li>
        <li><strong>Ubuntu Core</strong>: Sistema mínimo para dispositivos IoT (robôs, câmeras, roteadores)</li>
        <li><strong>Suporte Empresarial</strong>: Contratos de suporte 24/7 para grandes empresas</li>
      </ul>

      <AlertBox type="success" title="Ubuntu na Nuvem">
        O Ubuntu é a imagem mais popular em todas as grandes nuvens: Amazon AWS, Google Cloud e
        Microsoft Azure. Mais de 50% das instâncias Linux na AWS rodam Ubuntu. Isso não é acidente
        — é resultado de anos de investimento da Canonical em otimizações para ambiente cloud,
        integração com Kubernetes e suporte empresarial de qualidade.
      </AlertBox>

      <h2>Comunidade e Governança</h2>
      <p>
        O Ubuntu tem uma estrutura de governança transparente:
      </p>
      <ul>
        <li><strong>Community Council</strong>: Governa a comunidade Ubuntu, resolve conflitos e mantém o Código de Conduta</li>
        <li><strong>Technical Board</strong>: Decide questões técnicas e de arquitetura do sistema</li>
        <li><strong>Ubuntu Members</strong>: Contribuidores reconhecidos pela comunidade com acesso a recursos e votação</li>
        <li><strong>MOTU (Masters of the Universe)</strong>: Desenvolvedores que mantêm o repositório Universe</li>
        <li><strong>Ubuntu Developers</strong>: Desenvolvedores com acesso de upload aos repositórios principais</li>
      </ul>
      <p>
        O Código de Conduta do Ubuntu é um dos mais citados no software livre: "Seja solidário,
        seja respeitoso, seja colaborativo, seja pragmático, apoie outros no Ubuntu."
      </p>

      <AlertBox type="warning" title="Ubuntu vs Arch: Filosofias Opostas">
        Enquanto o Arch Linux é minimalista, voltado para usuários avançados que querem construir
        seu sistema peça por peça, o Ubuntu é maximalista no sentido de conforto: ele vem com tudo
        que a maioria dos usuários precisa já configurado. Não há certo ou errado — são filosofias
        diferentes para necessidades diferentes. O Ubuntu é ideal para quem quer <em>usar</em>
        o computador; o Arch é ideal para quem quer <em>entender</em> o computador.
      </AlertBox>
    </PageContainer>
  );
}
