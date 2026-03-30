import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências e Recursos"
      subtitle="Links úteis, comunidades e materiais de estudo para continuar aprendendo sobre Arch Linux e Linux em geral."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <h2>Documentação Oficial</h2>

      <h3>ArchWiki</h3>
      <p>
        A <a href="https://wiki.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ArchWiki</a> é
        considerada a melhor documentação de qualquer distribuição Linux. Mesmo usuários de outras
        distros consultam a ArchWiki regularmente. Algumas páginas essenciais:
      </p>
      <ul>
        <li><a href="https://wiki.archlinux.org/title/Installation_guide" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Installation Guide</a> — Guia oficial de instalação</li>
        <li><a href="https://wiki.archlinux.org/title/General_recommendations" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">General Recommendations</a> — O que fazer pós-instalação</li>
        <li><a href="https://wiki.archlinux.org/title/List_of_applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">List of Applications</a> — Catálogo de aplicações por categoria</li>
        <li><a href="https://wiki.archlinux.org/title/Pacman" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pacman</a> — Tudo sobre o gerenciador de pacotes</li>
        <li><a href="https://wiki.archlinux.org/title/Arch_User_Repository" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AUR</a> — Guia completo do Arch User Repository</li>
        <li><a href="https://wiki.archlinux.org/title/System_maintenance" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">System Maintenance</a> — Manutenção do sistema</li>
        <li><a href="https://wiki.archlinux.org/title/Security" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Security</a> — Guia de segurança</li>
      </ul>

      <h3>Outros Recursos Oficiais</h3>
      <ul>
        <li><a href="https://archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">archlinux.org</a> — Site oficial</li>
        <li><a href="https://aur.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aur.archlinux.org</a> — Arch User Repository</li>
        <li><a href="https://security.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">security.archlinux.org</a> — Advisories de segurança</li>
        <li><a href="https://bugs.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">bugs.archlinux.org</a> — Bug tracker</li>
        <li><a href="https://archlinux.org/packages/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">archlinux.org/packages</a> — Busca de pacotes oficiais</li>
      </ul>

      <h2>Comunidades</h2>

      <h3>Fóruns e Discussões</h3>
      <ul>
        <li><a href="https://bbs.archlinux.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Arch Linux Forums</a> — Fórum oficial (inglês)</li>
        <li><a href="https://www.reddit.com/r/archlinux/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">r/archlinux</a> — Subreddit do Arch Linux</li>
        <li><a href="https://www.reddit.com/r/linux4noobs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">r/linux4noobs</a> — Comunidade para iniciantes</li>
        <li><a href="https://www.reddit.com/r/unixporn/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">r/unixporn</a> — Customizações visuais do Linux</li>
      </ul>

      <h3>IRC e Chat</h3>
      <ul>
        <li><code>#archlinux</code> no Libera.Chat — Canal IRC oficial</li>
        <li><code>#archlinux-br</code> no Libera.Chat — Canal IRC brasileiro</li>
        <li>Grupos no Telegram: Arch Linux Brasil, Linux Brasil</li>
        <li>Discord: Arch Linux, Linux Brasil</li>
      </ul>

      <AlertBox type="info" title="Etiqueta ao pedir ajuda">
        Ao pedir ajuda nos fóruns ou IRC, sempre informe: qual é o problema exato,
        quais mensagens de erro aparecem, o que você já tentou, e a saída de comandos
        relevantes (como <code>journalctl -b -p err</code>). Perguntas vagas como
        "não funciona" raramente recebem ajuda útil.
      </AlertBox>

      <h2>Canais no YouTube (Brasil)</h2>
      <ul>
        <li><strong>Diolinux</strong> — Um dos maiores canais de Linux no Brasil, com tutoriais e reviews</li>
        <li><strong>Slackjeff</strong> — Conteúdo sobre Linux, shell script e customizações</li>
        <li><strong>LinuxTips</strong> — Foco em DevOps e infraestrutura Linux</li>
        <li><strong>Débxp / Fábio Akita</strong> — Conteúdo técnico de alto nível sobre tecnologia</li>
        <li><strong>Toca do Tux</strong> — Tutoriais de Linux para iniciantes</li>
        <li><strong>Terminal Root</strong> — C++, Linux e desenvolvimento</li>
      </ul>

      <h2>Canais no YouTube (Internacional)</h2>
      <ul>
        <li><strong>DistroTube (DT)</strong> — Window managers, Arch Linux, filosofia Linux</li>
        <li><strong>Luke Smith</strong> — Minimalismo, Linux, privacidade</li>
        <li><strong>Chris Titus Tech</strong> — Tutoriais Linux práticos e scripts</li>
        <li><strong>The Linux Experiment</strong> — Notícias e análises do mundo Linux</li>
        <li><strong>Mental Outlaw</strong> — Segurança, privacidade e Linux</li>
        <li><strong>Learn Linux TV</strong> — Tutoriais detalhados para servidores</li>
      </ul>

      <h2>Livros e Materiais de Estudo</h2>

      <h3>Livros Gratuitos Online</h3>
      <ul>
        <li><a href="https://linuxcommand.org/tlcl.php" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">The Linux Command Line</a> — Por William Shotts (inglês, gratuito)</li>
        <li><a href="https://tldp.org/LDP/abs/html/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Advanced Bash-Scripting Guide</a> — Guia avançado de Bash (inglês, gratuito)</li>
        <li><a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bash Reference Manual</a> — Manual oficial do GNU Bash</li>
      </ul>

      <h3>Livros Recomendados</h3>
      <ul>
        <li><strong>How Linux Works</strong> — Brian Ward (excelente para entender o sistema por dentro)</li>
        <li><strong>Linux Bible</strong> — Christopher Negus (referência completa)</li>
        <li><strong>UNIX and Linux System Administration Handbook</strong> — Evi Nemeth et al.</li>
        <li><strong>The Linux Programming Interface</strong> — Michael Kerrisk (avançado)</li>
      </ul>

      <h2>Ferramentas Úteis Online</h2>
      <ul>
        <li><a href="https://explainshell.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ExplainShell</a> — Cole um comando e veja a explicação de cada parte</li>
        <li><a href="https://www.shellcheck.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ShellCheck</a> — Verificador de scripts shell online</li>
        <li><a href="https://crontab.guru/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Crontab Guru</a> — Editor visual de expressões cron</li>
        <li><a href="https://regex101.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Regex101</a> — Testador de expressões regulares</li>
        <li><a href="https://cheat.sh/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cheat.sh</a> — Cheat sheets no terminal (<code>curl cheat.sh/tar</code>)</li>
        <li><a href="https://tldr.sh/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">tldr</a> — Páginas man simplificadas (<code>sudo pacman -S tldr</code>)</li>
      </ul>

      <h2>Páginas man no Terminal</h2>
      <p>
        Não subestime as páginas man! Elas são a documentação mais completa e precisa disponível,
        diretamente no seu terminal:
      </p>
      <ul>
        <li><code>man comando</code> — Ver o manual completo de qualquer comando</li>
        <li><code>man -k palavra</code> — Buscar comandos por palavra-chave</li>
        <li><code>comando --help</code> — Ajuda rápida do próprio comando</li>
        <li><code>info comando</code> — Documentação estendida (GNU)</li>
      </ul>

      <h2>Distribuições Baseadas no Arch</h2>
      <p>
        Se você quer a experiência do Arch com uma instalação mais fácil, considere estas distribuições
        baseadas no Arch Linux:
      </p>
      <ul>
        <li><strong>EndeavourOS</strong> — A mais próxima do Arch puro, com instalador gráfico. Mantém os repositórios oficiais do Arch.</li>
        <li><strong>Manjaro</strong> — Popular, mas com repositórios próprios (pode ter incompatibilidades com o AUR).</li>
        <li><strong>ArcoLinux</strong> — Focada em ensinar Arch Linux, com múltiplas ISOs para diferentes níveis.</li>
        <li><strong>Garuda Linux</strong> — Focada em gaming e performance, visual moderno.</li>
        <li><strong>CachyOS</strong> — Otimizada para performance com kernels customizados.</li>
      </ul>

      <AlertBox type="warning" title="Arch puro vs derivadas">
        Distribuições baseadas no Arch podem ter configurações e repositórios diferentes do Arch puro.
        Se você usa uma derivada e pede ajuda nos fóruns do Arch, mencione isso — as soluções podem
        ser diferentes.
      </AlertBox>

      <h2>Certificações Linux</h2>
      <p>
        Se você quer formalizar seus conhecimentos, considere estas certificações:
      </p>
      <ul>
        <li><strong>LPI Linux Essentials</strong> — Certificação introdutória, ótimo ponto de partida</li>
        <li><strong>LPIC-1</strong> — Administrador Linux nível 1 (muito reconhecida)</li>
        <li><strong>LPIC-2</strong> — Administrador Linux nível 2 (avançada)</li>
        <li><strong>CompTIA Linux+</strong> — Certificação reconhecida internacionalmente</li>
        <li><strong>RHCSA</strong> — Red Hat Certified System Administrator (prática, muito valorizada)</li>
      </ul>

      <AlertBox type="success" title="Continue aprendendo!">
        O Arch Linux é uma jornada de aprendizado contínuo. Cada problema que você resolver
        vai te ensinar mais sobre como o Linux funciona por dentro. Não tenha medo de quebrar
        coisas — é assim que se aprende. Apenas mantenha backups!
      </AlertBox>
    </PageContainer>
  );
}
