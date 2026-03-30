import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function GenericPage({ title, description }: { title: string, description: string }) {
  return (
    <PageContainer 
      title={title} 
      subtitle={description}
      difficulty="intermediario"
      timeToRead="5 min"
    >
      <p>
        Esta seção do livro digital detalha as práticas recomendadas e ferramentas associadas a <strong>{title.toLowerCase()}</strong> 
        no contexto do Arch Linux.
      </p>
      
      <h2>Conceitos Essenciais</h2>
      <p>
        No ambiente Unix-like e especificamente no Arch, os arquivos de configuração costumam residir 
        em <code>/etc</code>, enquanto dados de variáveis ficam em <code>/var</code> e binários do sistema em <code>/usr/bin</code>.
      </p>

      <h2>Comandos Úteis</h2>
      <CodeBlock code={`# Verificar status de serviços comuns
systemctl status nome-do-servico

# Buscar nos logs em tempo real
journalctl -f -u nome-do-servico`} />

      <h2>Boas Práticas</h2>
      <ul>
        <li>Sempre consulte a <a href="https://wiki.archlinux.org/" className="text-primary hover:underline">ArchWiki</a> antes de realizar mudanças drásticas.</li>
        <li>Faça backup de arquivos de configuração em <code>/etc</code> antes de editá-los.</li>
        <li>Evite compilar ferramentas como <code>root</code> (usar o AUR como usuário normal via <code>makepkg</code> ou <code>yay</code>/<code>paru</code>).</li>
      </ul>
    </PageContainer>
  );
}
