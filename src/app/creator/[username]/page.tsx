import { redirect } from "next/navigation";

interface CreatorPageProps {
  params: { username: string };
}

export default function CreatorPage({ params }: CreatorPageProps) {
  redirect(`/${encodeURIComponent(params.username)}`);
}
