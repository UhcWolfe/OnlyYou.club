import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  Ban,
  Fingerprint,
  Gavel,
  Zap,
  Clock,
  ExternalLink,
  Mail,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ochrona Praw Autorskich i Polityka Przeciwdziałania Piractwu — OnlyYou",
  description:
    "Rygorystyczna polityka ochrony praw twórców przed ripowaniem, wyciekami i nielegalnym rozpowszechnianiem materiałów. Procedura DMCA, forensic watermarking i odpowiedzialność karna.",
};

export default function CopyrightPage() {
  const lastUpdated = "13 września 2026";

  const tableOfContents = [
    { id: "wlasnosc-i-prawa", num: "§ 1", title: "Prawa Autorskie Twórców i Własność Intelektualna" },
    { id: "zakaz-zgrywania-i-wyciekow", num: "§ 2", title: "Bezwzględny Zakaz Zgrywania, Ripowania i Leaków" },
    { id: "ochrona-technologiczna", num: "§ 3", title: "Zabezpieczenia DRM i Znakowanie Cyfrowe (Forensic Watermark)" },
    { id: "odpowiedzialnosc-karna-i-cywilna", num: "§ 4", title: "Odpowiedzialność Karna (do 5 lat) i Cywilna za Kradzież" },
    { id: "procedura-dmca", num: "§ 5", title: "Procedura DMCA & Takedown dla Serwisów Zewnętrznych" },
    { id: "wsparcie-prawne", num: "§ 6", title: "Wsparcie Prawne dla Poszkodowanych Twórców" },
    { id: "zglaszanie-wyciekow", num: "§ 7", title: "Zgłaszanie Nielegalnych Mirrorów i Wycieków" },
    { id: "sankcje-platformy", num: "§ 8", title: "Sankcje Systemowe i Czarna Lista Piratów" },
    { id: "kontakt-dmca", num: "§ 9", title: "Dane Kontaktowe Oficjalnego Agenta DMCA" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Ochrona praw autorskich & DMCA</span>
      </div>

      {/* Header Section */}
      <div className="relative border border-surface-border bg-gradient-to-br from-surface via-surface-hover/60 to-surface rounded-2xl p-6 sm:p-10 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="border-red-500/40 text-red-400 bg-red-500/10 px-3 py-1 text-xs font-bold gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Ochrona Twórców Przed Piractwem & Wyciekami
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 bg-zinc-800/40 px-3 py-1 text-xs font-medium gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Ostatnia aktualizacja: {lastUpdated}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ochrona Praw Autorskich &{" "}
            <span className="bg-gradient-to-r from-red-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              Anti-Piracy Policy
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
            Platforma <strong className="text-white">{siteConfig.name}</strong> (<span className="text-zinc-100 font-mono text-xs">{siteConfig.domain}</span>) prowadzi bezkompromisową walkę z nieautoryzowanym pobieraniem, ripowaniem, publikowaniem wycieków (leaków) oraz redystrybucją materiałów wideo i zdjęć naszych Twórców. Wszelkie materiały podlegają ochronie prawno-karnej w oparciu o prawo polskie, unijne oraz międzynarodowe (DMCA / WIPO).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Ban className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Zakaz ripowania i nagrywania</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Fingerprint className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Identyfikacja cyfrowa leaków</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Gavel className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Kary do 5 lat pozbawienia wolności</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>Błyskawiczne takedowny DMCA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Navigation Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-4 sticky top-20 z-20 space-y-4">
          <Card className="p-5 border-surface-border bg-surface/90 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-4 pb-3 border-b border-surface-border">
              <Scale className="w-4 h-4 text-red-400" />
              <span>Spis Zasad Ochrony Praw</span>
            </div>
            <nav className="space-y-1 text-xs">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors group"
                >
                  <span className="font-mono text-[11px] font-bold text-red-400 group-hover:text-rose-300">
                    {item.num}
                  </span>
                  <span className="truncate">{item.title}</span>
                </a>
              ))}
            </nav>
          </Card>

          {/* Dedicated DMCA Action Box */}
          <Card className="p-5 border-red-500/20 bg-red-950/10 text-xs text-zinc-400 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <Mail className="w-4 h-4" />
              <span>Oficjalny Agent DMCA</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Widzisz nielegalny wyciek, re-upload lub mirror materiałów twórcy OnlyYou na Telegramie, Mega, Reddicie lub pirackim hostingu? Prześlij link bezpośrednio do naszego zespołu antypirackiego:
            </p>
            <div className="font-mono text-zinc-200 text-xs bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800 break-all">
              dmca@{siteConfig.domain}
            </div>
            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 font-medium underline underline-offset-2 mt-1"
            >
              <span>Zgłoś wyciek w tickecie Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </Card>
        </aside>

        {/* Content */}
        <main className="lg:col-span-8 space-y-8 text-zinc-300 leading-relaxed text-sm">
          {/* § 1 */}
          <section id="wlasnosc-i-prawa" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-mono font-bold text-xs">
                § 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Prawa Autorskie Twórców i Własność Intelektualna
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Wszelkie materiały audiowizualne, fotografie, nagrania wideo, transmisje, miniatury, grafiki, opisy oraz znaki towarowe publikowane w Serwisie <strong className="text-white">{siteConfig.name}</strong> podlegają bezwzględnej ochronie prawno-autorskiej na mocy:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Ustawy z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych (Dz.U. z 2022 r. poz. 2509 z późn. zm.).</li>
                <li>Dyrektywy Parlamentu Europejskiego i Rady (UE) 2019/790 w sprawie prawa autorskiego na jednolitym rynku cyfrowym.</li>
                <li>Digital Millennium Copyright Act (DMCA, 17 U.S.C. § 512).</li>
                <li>Konwencji Berneńskiej o ochronie dzieł literackich i artystycznych oraz traktatów Światowej Organizacji Własności Intelektualnej (WIPO).</li>
              </ul>
              <p>
                2. <strong className="text-white">Wyłączność praw Twórcy:</strong> Autorskie prawa osobiste i majątkowe do poszczególnych filmów i zdjęć przysługują wyłącznie Twórcy, który dany materiał stworzył i opublikował. Serwis OnlyYou nie jest właścicielem praw majątkowych do dzieł twórców, a jedynie posiada ograniczoną, niewyłączną licencję na ich hosting i bezpieczną dystrybucję w ramach Serwisu.
              </p>
              <p>
                3. Użytkownik przeglądający lub nabywający dostęp do materiałów otrzymuje wyłącznie ograniczoną, osobistą, odwołalną i niewyłączną licencję na odtwarzanie strumieniowe materiału w oknie przeglądarki w czasie rzeczywistym. Zakup dostępu <strong className="text-red-400">NIE oznacza</strong> przeniesienia praw autorskich, prawa do pobrania na dysk ani prawa do dalszego rozpowszechniania.
              </p>
            </div>
          </section>

          {/* § 2 */}
          <section id="zakaz-zgrywania-i-wyciekow" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 font-mono font-bold text-xs">
                § 2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Bezwzględny Zakaz Zgrywania, Ripowania i Leaków
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-red-300 text-xs leading-relaxed font-semibold">
                KATEGORYCZNY ZAKAZ DYSTRYBUCJI POZA SERWISEM (ZERO-LEAK POLICY): Jakakolwiek próba pobrania, przechwycenia, nagrania ekranu lub udostępnienia płatnych lub bezpłatnych materiałów Twórców na zewnętrznych platformach jest przestępstwem ściganym z urzędu i na wniosek poszkodowanego.
              </div>

              <p>
                Użytkownikom bezwzględnie zabrania się podejmowania następujących działań:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Zgrywanie strumieni (Stream Ripping):</strong> używania oprogramowania do przechwytywania strumieni HLS/MP4, wtyczek przeglądarkowych do pobierania wideo, skryptów automatycznych, scraperów lub komend typu ffmpeg/curl do pobierania segmentów wideo.
                </li>
                <li>
                  <strong className="text-zinc-200">Nagrywanie ekranu (Screen Recording):</strong> rejestrowania obrazu za pomocą oprogramowania rejestrującego (OBS, Shadowplay, Bandicam, rejestratory systemowe, kamery zewnętrzne) w celu dalszej dystrybucji.
                </li>
                <li>
                  <strong className="text-zinc-200">Udostępnianie wycieków (Leaking):</strong> publikowania lub linkowania materiałów twórców na kanałach/grupach Telegram, Discord, WhatsApp, serwerach chmurowych (Mega.nz, Google Drive, DropBox), forach typu Reddit, Wykop, tablicach 4chan/8kun, forach warezowych oraz portalach tube osób trzecich.
                </li>
                <li>
                  <strong className="text-zinc-200">Odsprzedaż i handel dostępami:</strong> udostępniania loginów, tokenów sesyjnych, ciasteczek lub odsprzedaży kont w celu umożliwienia osobom trzecim bezpłatnego lub odpłatnego dostępu do materiałów.
                </li>
              </ul>
            </div>
          </section>

          {/* § 3 */}
          <section id="ochrona-technologiczna" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                § 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Zabezpieczenia DRM i Znakowanie Cyfrowe (Forensic Watermark)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Serwis OnlyYou stosuje zaawansowane środki ochrony technologicznej w rozumieniu art. 118[1] Ustawy o prawie autorskim:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border">
                  <h3 className="text-zinc-100 font-bold text-sm mb-1 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-amber-400" />
                    Niewidoczne Znaki Wodne (Forensic Watermarking)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Strumienie wideo mogą zawierać unikalne, niewidoczne gołym okiem cyfrowe znaczniki (steganograficzne fingerprinty) powiązane bezpośrednio z ID konta Użytkownika, znacznikiem czasu odtwarzania oraz adresem IP. W razie pojawienia się materiału w sieci, Administrator jest w stanie bezspornie ustalić, z jakiego konta dokonano ripowania lub nagrania.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border">
                  <h3 className="text-zinc-100 font-bold text-sm mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Ochrona Przed Obejściem Zabezpieczeń
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Usuwanie znaków wodnych, modyfikacja metadanych wideo, usuwanie informacji o zarządzaniu prawami autorskimi (RMI) oraz próby dekodowania zabezpieczonych strumieni stanowią bezpośrednie naruszenie prawa i podlegają odrębnej odpowiedzialności karnej.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* § 4 */}
          <section id="odpowiedzialnosc-karna-i-cywilna" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-mono font-bold text-xs">
                § 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Odpowiedzialność Karna (do 5 lat) i Cywilna za Kradzież
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Osoby dopuszczające się kradzieży, ripowania i publikacji cudzych materiałów ponoszą pełną odpowiedzialność prawną:
              </p>

              <div className="p-4 rounded-xl bg-zinc-900 border border-rose-900/40 space-y-2">
                <h3 className="text-rose-400 font-bold text-sm flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Odpowiedzialność Karna (Prawo Polskie i Międzynarodowe)
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400 leading-relaxed">
                  <li>
                    <strong className="text-zinc-200">Art. 116 ust. 1 Ustawy o prawie autorskim:</strong> „Kto bez uprawnienia albo wbrew jego warunkom rozpowszechnia cudzy utwór [...] podlega grzywnie, karze ograniczenia wolności albo pozbawienia wolności do lat 2”.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Art. 116 ust. 2:</strong> Jeżeli sprawca dopuszcza się czynu w celu osiągnięcia korzyści majątkowej, podlega karze pozbawienia wolności <strong className="text-red-400">do lat 3</strong>.
                  </li>
                  <li>
                    <strong className="text-zinc-200">Art. 116 ust. 3:</strong> Jeżeli sprawca uczynił sobie z popełniania przestępstwa stałe źródło dochodu (np. płatne kanały VIP z leakami na Telegramie), podlega karze pozbawienia wolności <strong className="text-red-400">od 6 miesięcy do lat 5</strong>.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border space-y-2">
                <h3 className="text-amber-400 font-bold text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Odpowiedzialność Cywilna i Odszkodowania Finansowe
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Na podstawie art. 79 Ustawy o prawie autorskim poszkodowany Twórca oraz OnlyYou mogą żądać od naruszyciela naprawienia wyrządzonej szkody poprzez zapłatę sumy pieniężnej w wysokości odpowiadającej <strong className="text-zinc-200">dwukrotności, a w przypadku zawinionego naruszenia trzykrotności stosownego wynagrodzenia</strong>, a także wydania uzyskanych korzyści oraz pokrycia kosztów zastępstwa procesowego i obsługi kancelarii prawnych.
                </p>
              </div>
            </div>
          </section>

          {/* § 5 */}
          <section id="procedura-dmca" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-yellow-500/20 text-yellow-400 font-mono font-bold text-xs">
                § 5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Procedura DMCA & Takedown dla Serwisów Zewnętrznych
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. OnlyYou niezwłocznie wystawia i egzekwuje formalne wezwania do usunięcia naruszeń (DMCA Takedown Notices na mocy 17 U.S.C. § 512(c) oraz zgłoszenia w trybie DSA) wobec wszelkich zewnętrznych hostingów, dostawców CDN (m.in. Cloudflare), wyszukiwarek (Google De-indexing) oraz administratorów forów i kanałów pirackich.
              </p>
              <p>
                2. Aby zgłoszenie DMCA było prawnie wiążące, musi zawierać:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                <li>Identyfikację dzieła podlegającego ochronie autorskiej (link do oryginalnego profilu/posta w OnlyYou).</li>
                <li>Dokładny bezpośredni adres URL materiału naruszającego prawa (np. link do pliku na hostingu pirackim).</li>
                <li>Dane kontaktowe zgłaszającego (imię, nazwisko, adres e-mail).</li>
                <li>Oświadczenie o działaniu w dobrej wierze, że wykorzystanie materiału nie zostało autoryzowane przez właściciela praw.</li>
                <li>Oświadczenie pod rygorem odpowiedzialności za fałszywe zeznania (perjury), że podane informacje są prawdziwe.</li>
              </ul>
            </div>
          </section>

          {/* § 6 */}
          <section id="wsparcie-prawne" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-mono font-bold text-xs">
                § 6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Wsparcie Prawne dla Poszkodowanych Twórców
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. OnlyYou staje bezwarunkowo po stronie Twórców. W przypadku wykrycia wycieku treści któregokolwiek ze zweryfikowanych twórców, nasz zespół antypiracki zapewnia:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Automatyczne wysłanie wezwań DMCA do serwisów hostujących nielegalne kopie.</li>
                <li>Usunięcie linków do materiałów z wyników wyszukiwania Google i Bing (Lumen Database / Chilling Effects).</li>
                <li>Zabezpieczenie pakietu dowodowego (logi IP, fingerprint cyfrowy rippera, znaczniki czasu zakupu/wyświetlenia).</li>
                <li>Przekazanie dokumentacji kancelariom prawnym specjalizującym się w prawie autorskim i ściganiu piractwa treści dla dorosłych.</li>
              </ul>
            </div>
          </section>

          {/* § 7 */}
          <section id="zglaszanie-wyciekow" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-xs">
                § 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Zgłaszanie Nielegalnych Mirrorów i Wycieków
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Zarówno Twórcy, jak i członkowie społeczności mogą zgłaszać odnalezione wycieki i nielegalne kopie materiałów:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border space-y-1.5">
                  <span className="text-white font-bold block">1. Zgłoszenie mailowe DMCA</span>
                  <p className="text-zinc-400">Prześlij linki do pirackiego hostingu oraz link do profilu twórcy na:</p>
                  <span className="font-mono text-red-400 block font-bold">dmca@{siteConfig.domain}</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border space-y-1.5">
                  <span className="text-white font-bold block">2. Discord Support Ticket</span>
                  <p className="text-zinc-400">Otwórz ticket w kategorii „Anti-Piracy / DMCA” na oficjalnym serwerze:</p>
                  <a href={siteConfig.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-zinc-200 underline block">
                    {siteConfig.discordServerName}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* § 8 */}
          <section id="sankcje-platformy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 font-mono font-bold text-xs">
                § 8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Sankcje Systemowe i Czarna Lista Piratów
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Wobec każdego użytkownika, w stosunku do którego wykazano próbę lub fakt ripowania, nagrywania lub redystrybucji materiałów, stosowane są bezwzględne sankcje:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li><strong className="text-red-400">Permanentny Ban Konta:</strong> bezpowrotne zablokowanie profilu, unieważnienie sesji i usunięcie uprawnień.</li>
                <li><strong className="text-red-400">Ban na Discordzie:</strong> natychmiastowe wyrzucenie i permanentny ban na oficjalnym serwerze OnlyYou | Club.</li>
                <li><strong className="text-red-400">Czarna Lista (Global Blacklist):</strong> zablokowanie adresu IP, fingerprintu sprzętowego oraz danych płatniczych przed możliwością ponownej rejestracji.</li>
                <li><strong className="text-red-400">Pozew i Zawiadomienie Prokuratury:</strong> przekazanie zgromadzonych dowodów organom ścigania i wszczęcie procedury windykacji roszczeń odszkodowawczych.</li>
              </ul>
            </div>
          </section>

          {/* § 9 */}
          <section id="kontakt-dmca" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-200 font-mono font-bold text-xs">
                § 9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Dane Kontaktowe Oficjalnego Agenta DMCA
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Wszelkie formalne zawiadomienia DMCA, żądania usunięcia treści, zapytania prawne oraz korespondencję adwokacką należy kierować do wyznaczonego Agenta ds. Praw Autorskich:
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border text-xs space-y-1.5 font-mono">
                <p><span className="text-zinc-400">Podmiot:</span> <strong className="text-zinc-100">{siteConfig.name} Legal & Anti-Piracy Department</strong></p>
                <p><span className="text-zinc-400">Dedykowany e-mail DMCA:</span> <strong className="text-red-400">dmca@{siteConfig.domain}</strong></p>
                <p><span className="text-zinc-400">Wsparcie prawne platformy:</span> <strong className="text-zinc-200">legal@{siteConfig.domain}</strong></p>
                <p><span className="text-zinc-400">Czas reakcji:</span> <span className="text-emerald-400 font-semibold">Do 24 godzin (zgłoszenia priorytetowe dotyczące leaków — natychmiast)</span></p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
