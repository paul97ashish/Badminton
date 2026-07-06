import { notFound, redirect } from "next/navigation";
import { getSport } from "@/lib/sports";
import { todayDateString } from "@/lib/format";

export default async function SportIndexPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport: sportSlug } = await params;
  if (!getSport(sportSlug)) notFound();
  redirect(`/programs/${sportSlug}/${todayDateString()}`);
}
