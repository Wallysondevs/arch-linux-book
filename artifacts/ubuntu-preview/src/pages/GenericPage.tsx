import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

interface GenericPageProps {
  title: string;
  subtitle?: string;
  difficulty?: "iniciante" | "intermediario" | "avancado";
  timeToRead?: string;
}

export default function GenericPage({ title, subtitle, difficulty = "iniciante", timeToRead = "em breve" }: GenericPageProps) {
  return (
    <PageContainer title={title} subtitle={subtitle} difficulty={difficulty} timeToRead={timeToRead}>
      <AlertBox type="info" title="Seção em desenvolvimento">
        Este módulo está sendo elaborado. O conteúdo completo estará disponível em breve.
        Por enquanto, explore a seção <strong>SSH</strong> que já está disponível com todo o conteúdo.
      </AlertBox>
      <p>
        Este guia cobre Ubuntu 22.04 LTS e Ubuntu 24.04 LTS. Cada seção será estruturada com
        exemplos práticos, blocos de código copiáveis e explicações detalhadas em português.
      </p>
    </PageContainer>
  );
}
