import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências e Documentação"
      subtitle="As melhores fontes para aprofundar seu conhecimento em Ubuntu — documentação oficial, comunidades e recursos de aprendizado."
      difficulty="iniciante"
      timeToRead="5 min"
    >
      <p>
        Este guia cobriu os fundamentos do Ubuntu, mas há muito mais para aprender.
        Aqui estão as melhores fontes de referência, organizadas por categoria,
        para você continuar sua jornada.
      </p>

      <h2>Documentação Oficial Ubuntu</h2>
      <ul>
        <li>
          <strong>Ubuntu Documentation</strong>: <code>help.ubuntu.com</code><br/>
          Documentação oficial completa, mantida pela Canonical e pela comunidade Ubuntu.
          Inclui guias de instalação, tutoriais de configuração e referência técnica.
        </li>
        <li>
          <strong>Ubuntu Server Guide</strong>: <code>ubuntu.com/server/docs</code><br/>
          Guia oficial e completo para Ubuntu Server — configuração de serviços, segurança,
          virtualização, containers e muito mais.
        </li>
        <li>
          <strong>Ubuntu Community Help Wiki</strong>: <code>help.ubuntu.com/community</code><br/>
          Wiki mantida pela comunidade com artigos sobre hardware específico, configurações
          avançadas e soluções de problemas comuns.
        </li>
        <li>
          <strong>Canonical Blog</strong>: <code>ubuntu.com/blog</code><br/>
          Notícias oficiais sobre novas versões, features e tecnologias do Ubuntu.
        </li>
      </ul>

      <h2>Comunidades de Suporte</h2>
      <ul>
        <li>
          <strong>Ask Ubuntu</strong>: <code>askubuntu.com</code><br/>
          Site de perguntas e respostas dedicado ao Ubuntu (parte da rede Stack Exchange).
          Tem resposta para praticamente qualquer problema. <strong>Dica</strong>: antes de
          postar uma pergunta, pesquise — provavelmente alguém já teve o mesmo problema.
        </li>
        <li>
          <strong>Ubuntu Forums</strong>: <code>ubuntuforums.org</code><br/>
          Fórum oficial da comunidade Ubuntu. Ativo desde 2004, com milhões de posts.
          Ótimo para problemas complexos e discussões técnicas.
        </li>
        <li>
          <strong>Reddit r/Ubuntu</strong>: <code>reddit.com/r/Ubuntu</code><br/>
          Comunidade ativa com discussões, dicas e ajuda. Menos formal que os fóruns oficiais.
        </li>
        <li>
          <strong>Ubuntu Brasil</strong>: <code>ubuntu-br.org</code><br/>
          Comunidade brasileira oficial do Ubuntu, com fórum e lista de e-mail em português.
        </li>
      </ul>

      <h2>Man Pages — O Manual Integrado</h2>
      <CodeBlock
        title="Usando o sistema de manuais do Linux"
        code={`# O Linux tem documentação integrada para quase todos os comandos
man ls          # Manual completo do ls
man apt         # Manual do APT
man ssh         # Manual do SSH
man bash        # Manual completo do Bash (muito extenso!)
man 5 fstab     # Manual de formato do arquivo /etc/fstab
                # (número 5 = seção de formatos de arquivo)

# Pesquisar em todos os manuais por palavra-chave:
man -k compres  # Lista todos os man pages sobre compressão
apropos firewall

# Ver todas as seções disponíveis para um comando:
man -a password   # Mostra todas as seções que têm "password"

# Alternativa mais amigável: tldr (resumo prático)
sudo apt install tldr
tldr apt        # Exemplos práticos de uso do apt
tldr tar        # Como usar o tar com exemplos reais
tldr ssh        # Exemplos de uso do ssh

# Acessar help embutido dos comandos:
ls --help
apt --help
grep --help`}
      />

      <h2>Recursos para Aprendizado</h2>
      <ul>
        <li>
          <strong>The Linux Command Line (livro)</strong>: <code>linuxcommand.org</code><br/>
          Disponível gratuitamente online. Considerado um dos melhores livros para aprender
          o terminal Linux, escrito por William Shotts. Cobre desde o básico até scripting avançado.
        </li>
        <li>
          <strong>Linux Journey</strong>: <code>linuxjourney.com</code><br/>
          Tutorial interativo gratuito sobre Linux. Cobre desde os fundamentos do terminal
          até redes, processos e mais. Excelente para iniciantes.
        </li>
        <li>
          <strong>OverTheWire Bandit</strong>: <code>overthewire.org/wargames/bandit</code><br/>
          Jogo de desafios práticos para aprender o terminal Linux através de wargames.
          Cada nível ensina um novo conceito.
        </li>
        <li>
          <strong>Explain Shell</strong>: <code>explainshell.com</code><br/>
          Cole qualquer comando e o site explica cada parte. Perfeito para entender comandos
          longos e complexos que você encontra na internet.
        </li>
        <li>
          <strong>Shellcheck</strong>: <code>shellcheck.net</code><br/>
          Verificador estático de scripts Bash. Cole seu script e ele encontra erros e sugere melhorias.
        </li>
      </ul>

      <h2>Comandos de Consulta Rápida</h2>
      <CodeBlock
        title="Consultando informações do sistema"
        code={`# Versão do Ubuntu
lsb_release -a
cat /etc/os-release

# Versão do kernel
uname -r
uname -a      # Tudo: kernel, hostname, arquitetura

# Informações de hardware
lscpu         # CPU
lsmem         # Memória RAM (pode precisar: sudo apt install util-linux)
lspci         # Dispositivos PCI
lsusb         # Dispositivos USB
lsblk         # Discos e partições
sudo lshw -short  # Hardware completo resumido

# Tempo de atividade do sistema
uptime
uptime -p     # Formato legível: "up 3 days, 2 hours"

# Quanta memória está sendo usada
free -h

# Versão de programas
python3 --version
node --version
git --version
docker --version

# Onde está instalado um programa
which python3
type python3

# Changelog de um pacote
apt changelog nginx`}
      />

      <h2>Atalhos e Dicas Finais</h2>
      <AlertBox type="success" title="Dicas de ouro para usuários Ubuntu">
        <ul className="mt-1 mb-0">
          <li><strong>Use Tab</strong> para autocompletar — economiza muito tempo e evita erros de digitação.</li>
          <li><strong>Ctrl+R</strong> para buscar no histórico de comandos — mais rápido do que rolar com ↑.</li>
          <li><strong>man comando</strong> antes de executar algo novo — os manuais são completos e confiáveis.</li>
          <li><strong>Sempre leia o erro inteiro</strong> — a maioria das mensagens de erro explica exatamente o que aconteceu e como corrigir.</li>
          <li><strong>Faça backup antes de mudanças grandes</strong> — <code>sudo cp /etc/arquivo /etc/arquivo.bak</code> antes de editar qualquer config.</li>
          <li><strong>sudo journalctl -b -p err</strong> é seu melhor amigo quando algo não funciona — mostra todos os erros do boot atual.</li>
        </ul>
      </AlertBox>
    </PageContainer>
  );
}
