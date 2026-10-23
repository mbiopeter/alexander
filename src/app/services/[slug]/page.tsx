import { notFound } from "next/navigation";
import { getService, services } from "@/data/services";
import { makeMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";

type ServicePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return makeMetadata(
    service.title,
    service.summary,
    `/services/${service.slug}/`,
  );
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
