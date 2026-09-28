import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Odkrywaj — Polskie Porno, Kategorie 18+, Filmy i Twórczynie",
  description:
    "Przeglądaj darmowe filmy erotyczne i porno, setki kategorii (anal, fetysze, duże cycki, cosplay, trójkąty) i tysiące profili twórczyń w serwisie OnlyYou.",
  keywords: [
    "odkrywaj porno",
    "kategorie porno",
    "polskie porno",
    "filmy 18+",
    "darmowe porno",
    "erotyka",
    "modelki 18+",
    "zdjęcia nsfw"
  ],
  alternates: {
    canonical: `https://${siteConfig.domain}/explore`,
  },
  openGraph: {
    title: "Odkrywaj — Filmy 18+, Zdjęcia i Kategorie | OnlyYou",
    description:
      "Najlepsze polskie i zagraniczne materiały 18+, filmy wideo oraz zdjęcia od niezależnych twórczyń.",
    url: `https://${siteConfig.domain}/explore`,
    siteName: siteConfig.name,
    images: ["/logo.png"],
  },
  other: {
    rating: "RTA-5042-1996-1400-1577-RTA",
    "RATING": "adult",
    "Age-Rating": "18+",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
