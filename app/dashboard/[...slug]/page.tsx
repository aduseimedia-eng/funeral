import { DashboardApp } from "@/components/dashboard/dashboard-app";
import { dashboardRoutes } from "@/lib/routes";
import { Role } from "@/lib/types";
export function generateStaticParams() {
  return (Object.keys(dashboardRoutes) as Role[]).flatMap((role) =>
    dashboardRoutes[role].map((section) => ({
      slug: section ? [role, section] : [role],
    })),
  );
}
export const dynamicParams = false;
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <DashboardApp role={slug[0] as Role} section={slug[1] || ""} />;
}
