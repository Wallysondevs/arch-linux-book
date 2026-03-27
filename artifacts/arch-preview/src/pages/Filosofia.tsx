import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Filosofia() {
  return (
    <PageContainer 
      title="A Filosofia Arch (The Arch Way)" 
      subtitle="Compreender os princípios orientadores do Arch Linux é essencial para decidir se esta é a distribuição certa para você."
      difficulty="iniciante"
      timeToRead="6 min"
    >
      <p>
        O Arch Linux não é apenas um conjunto de softwares, é um estado de espírito. 
        A distribuição é governada por cinco princípios fundamentais conhecidos coletivamente como <strong>"The Arch Way"</strong>.
      </p>

      <h2>1. Simplicidade (KISS - Keep It Simple, Stupid)</h2>
      <p>
        O Arch define simplicidade como <strong>ausência de adições, modificações e complicações desnecessárias</strong>.
        Ele entrega o software exatamente como os desenvolvedores originais o criaram (upstream). 
      </p>
      <ul>
        <li>Não há ferramentas de configuração gráficas exclusivas da distribuição que escondam os arquivos de texto reais.</li>
        <li>Não há patches pesados aplicados aos softwares; o GNOME no Arch é o GNOME puro, o KDE é o KDE puro.</li>
        <li>Arquivos de configuração são mantidos limpos e legíveis em texto puro.</li>
      </ul>
      <AlertBox type="warning" title="Simplicidade Técnica, não Simplicidade de Uso">
        Cuidado com a palavra "simples". No mundo Arch, simples significa que a arquitetura do sistema 
        é fácil de entender para quem lê o código. Não significa que o sistema tem botões grandes e brilhantes para o usuário final clicar.
      </AlertBox>

      <h2>2. Modernidade (Bleeding Edge)</h2>
      <p>
        O Arch Linux foca em manter as versões mais recentes dos softwares disponíveis assim que possível.
      </p>
      <ul>
        <li>É uma distribuição <strong>Rolling Release</strong> (atualização contínua).</li>
        <li>Não existem "Versões" (como Ubuntu 22.04, 24.04). O seu sistema está sempre na última versão disponível mundialmente.</li>
        <li>Novos kernels, novos drivers e novos ambientes gráficos chegam aos usuários em questão de dias (ou horas) após o lançamento oficial.</li>
      </ul>

      <h2>3. Pragmatismo</h2>
      <p>
        Os desenvolvedores e usuários do Arch são pragmáticos. Eles escolhem a solução que funciona melhor, 
        ao invés de se prenderem cegamente a ideologias.
      </p>
      <p>
        Diferente do Debian ou do Fedora, que têm regras extremamente rígidas sobre software proprietário, 
        o Arch permite que repositórios oficiais contenham pacotes binários de código fechado (closed-source) 
        se a comunidade precisar deles. A funcionalidade e a utilidade prática superam o purismo ideológico.
      </p>

      <h2>4. Centralização no Usuário (User-Centric)</h2>
      <p>
        Muitas distribuições tentam ser <em>user-friendly</em> (amigáveis ao usuário). 
        O Arch tenta ser <strong>user-centric</strong> (centrado no usuário).
      </p>
      <ul>
        <li>A distribuição tem a intenção de preencher as necessidades de quem contribui para ela, ao invés de tentar agradar às massas.</li>
        <li>Espera-se que o usuário assuma a responsabilidade por seu próprio sistema. O sistema é do usuário (<em>Do-It-Yourself - DIY</em>).</li>
        <li>Você constrói o sistema peça por peça durante a instalação, escolhendo exatamente o que quer. Se algo quebrar, você sabe como consertar, pois foi você quem montou.</li>
      </ul>

      <h2>5. Versatilidade</h2>
      <p>
        O Arch não impõe um ambiente de desktop, um navegador web ou um editor de texto padrão. 
        Ao instalar a base, você tem apenas uma tela preta com um terminal.
        A partir dali, o Arch pode se tornar um servidor web levíssimo, uma estação de trabalho robusta para programação, 
        ou uma máquina monstra focada em jogos AAA. Ele é exatamente o que você faz dele.
      </p>

      <AlertBox type="info" title="Resumo da Ópera">
        Se você quer que um sistema operacional pense por você e esconda os detalhes, o Arch não é para você.
        Se você quer entender como o Linux funciona por baixo dos panos, ter total controle e ter acesso ao software 
        mais recente minutos após seu lançamento, você encontrou seu lar.
      </AlertBox>
    </PageContainer>
  );
}
