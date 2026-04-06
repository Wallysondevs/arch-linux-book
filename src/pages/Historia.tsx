import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Historia() {
  return (
    <PageContainer 
      title="A História do Arch Linux" 
      subtitle="Como o desejo de manter as coisas simples criou uma das distribuições mais influentes do mundo Linux."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <p>
        Para entender o Arch Linux, precisamos olhar para as suas origens. Diferente de distribuições 
        como Ubuntu (que nasceu do Debian) ou Manjaro (que nasceu do próprio Arch), o Arch Linux 
        foi criado do zero (from scratch), impulsionado por uma filosofia muito específica.
      </p>

      <h2>O Início (2002)</h2>
      <p>
        Em março de 2002, o programador canadense <strong>Judd Vinet</strong> lançou a primeira versão 
        oficial do Arch Linux (versão 0.1, codinome "Homer"). Vinet havia experimentado diversas distribuições 
        existentes, como Slackware, BSD, PLD e CRUX. Ele gostava da elegância e simplicidade do CRUX, mas 
        sentia falta de um gerenciador de pacotes robusto para resolver dependências automaticamente e facilitar 
        as atualizações.
      </p>
      
      <AlertBox type="info" title="A Inspiração CRUX">
        O CRUX é uma distribuição focada em desenvolvedores, conhecida por ser extremamente minimalista. 
        O Arch herdou muito de sua estrutura de pacotes baseada em scripts simples (semelhante ao sistema 
        de ports do BSD), o que evoluiu para o que hoje conhecemos como PKGBUILDs.
      </AlertBox>

      <p>
        Para resolver o problema de gerenciamento de pacotes, Vinet escreveu o <strong>pacman</strong> (Package Manager) em C. 
        O objetivo era ter algo que pudesse instalar pacotes de forma simples, sincronizar com servidores 
        remotos e gerenciar dependências perfeitamente. Nascia ali o coração do Arch Linux.
      </p>

      <h2>A Era Aaron Griffin (2007 - 2020)</h2>
      <p>
        Em 2007, Judd Vinet decidiu se afastar da liderança do projeto por falta de tempo. O bastão foi 
        passado para <strong>Aaron Griffin</strong>, um desenvolvedor americano que já contribuía fortemente para o projeto.
      </p>
      <p>
        Sob a liderança de Griffin, o Arch solidificou seu modelo de <em>Rolling Release</em> (lançamento contínuo). 
        Enquanto distribuições como Ubuntu ou Fedora lançam "grandes versões" a cada 6 meses, o Arch recebe 
        pequenas atualizações diariamente. Instale uma vez, atualize para sempre.
      </p>

      <h2>Momentos Marcantes</h2>
      <ul>
        <li>
          <strong>2006 - Nascimento do AUR (Arch User Repository):</strong> O AUR foi criado para permitir que a comunidade 
          compartilhasse seus próprios pacotes. Hoje é indiscutivelmente o maior e mais abrangente repositório de software 
          do mundo Linux.
        </li>
        <li>
          <strong>2012 - A transição para o systemd:</strong> O Arch Linux foi uma das primeiras grandes distros a 
          adotar o <code>systemd</code> como seu sistema de inicialização padrão, substituindo o antigo SysVinit. 
          Foi uma mudança controversa na época, mas alinhada com a busca por soluções modernas e padronizadas.
        </li>
        <li>
          <strong>2017 - O fim da era 32-bits (i686):</strong> Com a popularização dos processadores de 64 bits, 
          os desenvolvedores anunciaram o fim do suporte à arquitetura i686. O Arch tornou-se exclusivamente x86_64, 
          limpando o código legado.
        </li>
        <li>
          <strong>2021 - Introdução do <code>archinstall</code>:</strong> Historicamente, o Arch só podia ser instalado 
          manualmente via linha de comando. Em 2021, o ISO oficial incluiu o <code>archinstall</code>, um script oficial 
          escrito em Python que guia o usuário por um menu interativo, tornando a instalação muito mais acessível.
        </li>
      </ul>

      <h2>A Comunidade e Derivadas</h2>
      <p>
        A documentação tornou-se outro pilar do projeto. A <strong>ArchWiki</strong> é reconhecida hoje 
        como uma das melhores e mais completas fontes de documentação técnica de Linux na internet, sendo consultada 
        até por usuários de outras distribuições.
      </p>

      <AlertBox type="success" title="O Ecossistema Arch">
        A excelência da base do Arch deu origem a projetos famosos que buscam oferecer a experiência rolling release 
        mas com instalações gráficas amigáveis desde o dia 1:
        <ul className="mt-2 mb-0">
          <li><strong>Manjaro:</strong> Foco em estabilidade (retém pacotes por algumas semanas antes de liberar) e facilidade extrema.</li>
          <li><strong>EndeavourOS:</strong> O sucessor espiritual do Antergos, essencialmente "Arch puro com um instalador gráfico".</li>
          <li><strong>Garuda Linux:</strong> Focado em performance e jogos, com visuais extravagantes e BTRFS por padrão.</li>
          <li><strong>SteamOS (3.0+):</strong> A Valve escolheu o Arch Linux como base para o sistema operacional do Steam Deck!</li>
        </ul>
      </AlertBox>

      <h2>O Presente e o Futuro</h2>
      <p>
        Em fevereiro de 2020, Aaron Griffin passou a liderança para <strong>Levente Polyak</strong>. 
        Hoje, o Arch Linux continua sendo mantido por uma equipe dedicada de desenvolvedores voluntários 
        (Trusted Users) e milhares de contribuidores. Permanece fiel aos seus princípios originais: 
        centrado no usuário, simples (tecnicamente) e sempre atualizado.
      </p>
    </PageContainer>
  );
}
