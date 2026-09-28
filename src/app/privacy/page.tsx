import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  KeyRound,
  FileCheck,
  Server,
  UserCheck,
  Clock,
  ExternalLink,
  Cookie,
  AlertTriangle,
  Scale,
  Database,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Informacja o Ochronie Prywatności — OnlyYou",
  description:
    "Szczegółowa informacja o przetwarzaniu danych osobowych (RODO / GDPR), weryfikacji wieku 18+, ochronie tożsamości twórców oraz bezpieczeństwie w serwisie OnlyYou.",
};

export default function PrivacyPage() {
  const lastUpdated = "13 września 2026";

  const tableOfContents = [
    { id: "administrator-danych", num: "§ 1", title: "Administrator Danych i Kontakt (RODO)" },
    { id: "zakres-danych", num: "§ 2", title: "Zakres Przetwarzanych Danych Osobowych" },
    { id: "cele-i-podstawy", num: "§ 3", title: "Cele i Podstawy Prawne Przetwarzania" },
    { id: "weryfikacja-tworcow", num: "§ 4", title: "Bezpieczeństwo Danych Weryfikacyjnych (18+ & 2257)" },
    { id: "ciasteczka-i-sesje", num: "§ 5", title: "Pliki Cookies i Zarządzanie Sesją" },
    { id: "odbiorcy-danych", num: "§ 6", title: "Odbiorcy Danych i Integracja z Discord" },
    { id: "transfer-miedzynarodowy", num: "§ 7", title: "Przekazywanie Danych poza EOG" },
    { id: "okres-przechowywania", num: "§ 8", title: "Okres Przechowywania Danych (Retencja)" },
    { id: "prawa-uzytkownikow", num: "§ 9", title: "Prawa Użytkowników i Realizacja Żądań RODO" },
    { id: "bezpieczenstwo-techniczne", num: "§ 10", title: "Środki Bezpieczeństwa i Ochrona Przed Wyciekiem" },
    { id: "postanowienia-koncowe", num: "§ 11", title: "Aktualizacje Informacji o Prywatności" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Informacja o ochronie prywatności</span>
      </div>

      {/* Header Section */}
      <div className="relative border border-surface-border bg-gradient-to-br from-surface via-surface-hover/60 to-surface rounded-2xl p-6 sm:p-10 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 px-3 py-1 text-xs font-bold gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zgodność z RODO / GDPR & Wymogi 18+
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 bg-zinc-800/40 px-3 py-1 text-xs font-medium gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Ostatnia aktualizacja: {lastUpdated}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Informacja o Ochronie{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Prywatności
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
            Prywatność i bezpieczeństwo danych osobowych na platformie <strong className="text-white">{siteConfig.name}</strong> (<span className="text-zinc-100 font-mono text-xs">{siteConfig.domain}</span>) stanowią fundament naszego działania. Niniejszy dokument precyzyjnie wyjaśnia, jakie dane gromadzimy, w jaki sposób je zabezpieczamy (w tym dokumenty weryfikacji pełnoletności twórców) oraz jakie prawa przysługują użytkownikom zgodnie z RODO (GDPR).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Szyfrowanie danych end-to-end</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <UserCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Dyskrecja tożsamości twórców</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Brak sprzedaży danych</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Scale className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Pełna zgodność z RODO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Navigation Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-4 sticky top-20 z-20 space-y-4">
          <Card className="p-5 border-surface-border bg-surface/90 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-4 pb-3 border-b border-surface-border">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Nawigacja Polityki Prywatności</span>
            </div>
            <nav className="space-y-1 text-xs">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors group"
                >
                  <span className="font-mono text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">
                    {item.num}
                  </span>
                  <span className="truncate">{item.title}</span>
                </a>
              ))}
            </nav>
          </Card>

          {/* Contact Box */}
          <Card className="p-5 border-emerald-500/20 bg-emerald-950/10 text-xs text-zinc-400 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Mail className="w-4 h-4" />
              <span>Inspektor Ochrony Danych</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              W sprawach dotyczących przetwarzania danych osobowych, realizacji praw RODO lub usunięcia konta prosimy o kontakt pod dedykowanym adresem:
            </p>
            <div className="font-mono text-zinc-200 text-xs bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800 break-all">
              privacy@{siteConfig.domain}
            </div>
          </Card>
        </aside>

        {/* Content */}
        <main className="lg:col-span-8 space-y-8 text-zinc-300 leading-relaxed text-sm">
          {/* § 1 */}
          <section id="administrator-danych" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Administrator Danych i Kontakt (RODO)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Administratorem danych osobowych Użytkowników i Twórców serwisu <strong className="text-white">{siteConfig.name}</strong> (<span className="text-emerald-400 font-mono text-xs">{siteConfig.domain}</span>) w rozumieniu Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (dalej: <strong className="text-white">„RODO”</strong>) jest operator Serwisu OnlyYou (dalej: <strong className="text-white">„Administrator”</strong>).
              </p>
              <p>
                2. Wszelkie zapytania, wnioski oraz żądania związane z ochroną prywatności można kierować bezpośrednio do Inspektora / Zespołu Ochrony Danych za pośrednictwem poczty elektronicznej pod adresem: <strong className="text-emerald-400 font-mono">privacy@{siteConfig.domain}</strong> lub poprzez prywatny ticket na oficjalnym serwerze Discord <strong className="text-white">{siteConfig.discordServerName}</strong>.
              </p>
              <p>
                3. Administrator dokłada szczególnej staranności w celu ochrony interesów osób, których dane dotyczą, a w szczególności zapewnia, że zbierane dane są przetwarzane zgodnie z prawem, rzetelnie i w sposób przejrzysty.
              </p>
            </div>
          </section>

          {/* § 2 */}
          <section id="zakres-danych" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Zakres Przetwarzanych Danych Osobowych
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                W ramach funkcjonowania Serwisu Administrator może przetwarzać następujące kategorie danych osobowych:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border">
                  <h3 className="text-zinc-100 font-bold text-sm mb-1.5 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    1. Dane konta i autoryzacji Discord (OAuth2)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Unikalny identyfikator Discord (Discord User ID), nazwa użytkownika (Discord Username), nazwa wyświetlana (Display Name), adres e-mail powiązany z kontem Discord, awatar, baner profilowy oraz identyfikatory ról na serwerze Discord OnlyYou | Club (służące do weryfikacji uprawnień twórcy/administratora).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border">
                  <h3 className="text-zinc-100 font-bold text-sm mb-1.5 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    2. Dane weryfikacji pełnoletności i tożsamości Twórców (18+)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    W przypadku osób ubiegających się o status Twórcy: imię i nazwisko, data urodzenia, obywatelstwo, seria i numer dokumentu tożsamości, skan/fotografia urzędowego dokumentu tożsamości oraz fotografia biometryczna weryfikacyjna („selfie z dokumentem i aktualną datą”). Dane te są ściśle poufne i podlegają rygorystycznym procedurom bezpieczeństwa (patrz § 4).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border">
                  <h3 className="text-zinc-100 font-bold text-sm mb-1.5 flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    3. Dane techniczne, telemetria i logi systemowe
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Adres IP, nagłówki żądania HTTP (User-Agent, referer, system operacyjny, typ przeglądarki), znaczniki czasu logowania i aktywności, identyfikatory sesji oraz logi bezpieczeństwa wykorzystywane do zapobiegania atakom DDoS i nadużyciom.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border">
                  <h3 className="text-zinc-100 font-bold text-sm mb-1.5 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    4. Dane aktywności w Serwisie
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Historia obserwowanych twórców, polubienia postów, dodane komentarze, historia zgłoszeń moderacyjnych oraz opublikowane przez Twórców materiały foto/wideo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* § 3 */}
          <section id="cele-i-podstawy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Cele i Podstawy Prawne Przetwarzania
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Dane osobowe przetwarzane są na podstawie następujących przepisów art. 6 ust. 1 RODO:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Świadczenie usług drogą elektroniczną (art. 6 ust. 1 lit. b RODO):</strong> realizacja umowy o korzystanie z Serwisu, autoryzacja konta, obsługa Creator Hubów, publikacja treści oraz zarządzanie profilem.
                </li>
                <li>
                  <strong className="text-zinc-200">Wypełnienie obowiązków prawnych (art. 6 ust. 1 lit. c RODO):</strong> bezwzględna weryfikacja pełnoletności (18+), archiwizacja dokumentacji weryfikacji wykonawców zgodnie ze standardami przeciwdziałania przestępstwom przeciwko wolności seksualnej i obyczajności (w tym 18 U.S.C. § 2257), procedury przeciwdziałania praniu pieniędzy (AML) oraz wymogi rachunkowo-podatkowe.
                </li>
                <li>
                  <strong className="text-zinc-200">Prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO):</strong> zapewnienie cyberbezpieczeństwa platformy, przeciwdziałanie ripowaniu i kradzieży materiałów twórców, moderacja treści, dochodzenie roszczeń lub obrona przed roszczeniami prawnymi.
                </li>
                <li>
                  <strong className="text-zinc-200">Zgoda Użytkownika (art. 6 ust. 1 lit. a RODO):</strong> w przypadkach dobrowolnego udostępnienia dodatkowych danych profilowych (np. opcjonalne bio, preferencje, linki społecznościowe).
                </li>
              </ul>
            </div>
          </section>

          {/* § 4 */}
          <section id="weryfikacja-tworcow" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                § 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Bezpieczeństwo Danych Weryfikacyjnych Twórców (18+ & 2257)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs leading-relaxed font-medium">
                <strong>ŚCISŁY REŻIM POUFNOŚCI DANYCH TWÓRCÓW:</strong> Dokumenty tożsamości przekazywane podczas weryfikacji twórcy NIE są i NIGDY nie będą publikowane publicznie ani udostępniane innym użytkownikom. Służą wyłącznie potwierdzeniu pełnoletności i legalności publikacji.
              </div>

              <p>
                1. Dane weryfikacyjne twórców (skany dokumentów, selfie z dowodem) są przechowywane w odseparowanym, silnie szyfrowanym repozytorium z wielopoziomową kontrolą dostępu (encryption at rest — AES-256).
              </p>
              <p>
                2. Dostęp do danych weryfikacyjnych posiada wyłącznie ściśle ograniczona liczba upoważnionych administratorów ds. compliance i audytu tożsamości pod rygorem odpowiedzialności za zachowanie tajemnicy.
              </p>
              <p>
                3. Zgodnie z międzynarodowymi standardami bezpieczeństwa platform dla dorosłych oraz przepisami 18 U.S.C. § 2257, dokumentacja potwierdzająca ukończenie 18 lat przez każdego performera musi pozostać zarchiwizowana przez cały okres dostępności materiałów na platformie oraz przez wymagany przepisami okres przedawnienia ewentualnych roszczeń.
              </p>
            </div>
          </section>

          {/* § 5 */}
          <section id="ciasteczka-i-sesje" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
                § 5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Pliki Cookies i Zarządzanie Sesją
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Serwis wykorzystuje niezbędne technicznie pliki cookies (ciasteczka) w celu utrzymania aktywnej sesji Użytkownika po zalogowaniu:
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border font-mono text-xs space-y-1.5">
                <p><span className="text-zinc-400">Nazwa:</span> <strong className="text-zinc-100">onlyyou_session</strong></p>
                <p><span className="text-zinc-400">Typ:</span> <span className="text-emerald-400">Niezbędny (Strictly Necessary)</span></p>
                <p><span className="text-zinc-400">Zawartość:</span> <span className="text-zinc-300">Zminimalizowany token identyfikacyjny sesji (User ID, uprawnienia, odznaki)</span></p>
                <p><span className="text-zinc-400">Zakres domenowy:</span> <span className="text-zinc-300">.{siteConfig.domain}</span></p>
                <p><span className="text-zinc-400">Ważność:</span> <span className="text-zinc-300">30 dni (lub do wylogowania)</span></p>
              </div>
              <p>
                2. <strong className="text-white">Brak zewnętrznych trackerów reklamowych:</strong> Serwis OnlyYou nie sprzedaje danych osobowych Użytkowników brokerom danych ani nie stosuje inwazyjnych trackerów reklamowych podmiotów trzecich śledzących aktywność w celach profilowania marketingowego.
              </p>
            </div>
          </section>

          {/* § 6 */}
          <section id="odbiorcy-danych" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-mono font-bold text-xs">
                § 6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Odbiorcy Danych i Integracja z Discord
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Dane osobowe mogą być przekazywane zaufanym podmiotom przetwarzającym dane w imieniu Administratora:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li><strong className="text-zinc-200">Dostawcy infrastruktury serwerowej i hostingu:</strong> operatorzy centrów danych, serwerów VPS oraz sieci dostarczania treści (CDN) zapewniający bezpieczne przechowywanie danych i streaming.</li>
                <li><strong className="text-zinc-200">Discord Inc.:</strong> w zakresie niezbędnym do realizacji procesu logowania OAuth2, weryfikacji ról na oficjalnym serwerze oraz synchronizacji powiadomień w Creator Hubach.</li>
                <li><strong className="text-zinc-200">Operatorzy płatności:</strong> certyfikowane instytucje płatnicze przetwarzające transakcje (zgodne ze standardem PCI-DSS).</li>
                <li><strong className="text-zinc-200">Organy ścigania i wymiaru sprawiedliwości:</strong> wyłącznie w przypadkach prawomocnych nakazów sądowych, podejrzenia przestępstw z udziałem osób małoletnich (CSAM) lub bezpośredniego zagrożenia życia.</li>
              </ul>
            </div>
          </section>

          {/* § 7 */}
          <section id="transfer-miedzynarodowy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-200 font-mono font-bold text-xs">
                § 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Przekazywanie Danych poza Europejski Obszar Gospodarczy (EOG)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                W związku z wykorzystaniem API platformy Discord Inc. (USA) oraz dostawców technologii chmurowych, dane mogą być przekazywane do państw trzecich poza EOG. W takich przypadkach Administrator zapewnia, że transfer odbywa się w oparciu o odpowiednie zabezpieczenia prawne: decyzje Komisji Europejskiej stwierdzające odpowiedni stopień ochrony (Data Privacy Framework) lub Standardowe Klauzule Umowne (Standard Contractual Clauses — SCC).
              </p>
            </div>
          </section>

          {/* § 8 */}
          <section id="okres-przechowywania" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Okres Przechowywania Danych (Retencja)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Dane konta użytkownika przetwarzane są przez czas posiadania aktywnego profilu w Serwisie lub do momentu zgłoszenia żądania usunięcia konta.
              </p>
              <p>
                2. Dane weryfikacyjne twórców i oświadczenia zgodności (18+ / 2257) są przechowywane przez okres obecności materiałów w Serwisie oraz przez okres przedawnienia roszczeń cywilnych i karnych wynikających z publikacji materiałów dla dorosłych.
              </p>
              <p>
                3. Techniczne logi serwerowe (adresy IP, żądania) przechowywane są przez okres do 90 dni w celach bezpieczeństwa teleinformatycznego, po czym podlegają automatycznej rotacji lub anonimizacji.
              </p>
            </div>
          </section>

          {/* § 9 */}
          <section id="prawa-uzytkownikow" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Prawa Użytkowników i Realizacja Żądań RODO
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Każdej osobie, której dane dotyczą, przysługują następujące prawa wynikające z RODO:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li><strong className="text-zinc-200">Prawo dostępu do danych (art. 15 RODO):</strong> uzyskanie potwierdzenia czy dane są przetwarzane oraz kopii danych.</li>
                <li><strong className="text-zinc-200">Prawo do sprostowania (art. 16 RODO):</strong> poprawienia nieprawidłowych lub niekompletnych danych.</li>
                <li><strong className="text-zinc-200">Prawo do usunięcia danych („prawo do bycia zapomnianym”, art. 17 RODO):</strong> z wyłączeniem sytuacji, gdy dalsze przetwarzanie jest niezbędne do wywiązania się z prawnego obowiązku archiwizacyjnego (np. 18 U.S.C. 2257).</li>
                <li><strong className="text-zinc-200">Prawo do ograniczenia przetwarzania (art. 18 RODO).</strong></li>
                <li><strong className="text-zinc-200">Prawo do przenoszenia danych (art. 20 RODO).</strong></li>
                <li><strong className="text-zinc-200">Prawo do sprzeciwu (art. 21 RODO):</strong> wobec przetwarzania opartego na prawnie uzasadnionym interesie Administratora.</li>
                <li><strong className="text-zinc-200">Prawo wniesienia skargi do organu nadzorczego:</strong> do Prezesa Urzędu Ochrony Danych Osobowych (PUODO, ul. Stawki 2, 00-193 Warszawa) w przypadku uznania, że przetwarzanie narusza przepisy RODO.</li>
              </ul>
              <p>
                W celu realizacji powyższych praw wystarczy przesłać zgłoszenie na adres: <strong className="text-emerald-400 font-mono">privacy@{siteConfig.domain}</strong>. Wniosek zostanie rozpatrzony nie później niż w ciągu 30 dni.
              </p>
            </div>
          </section>

          {/* § 10 */}
          <section id="bezpieczenstwo-techniczne" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Środki Bezpieczeństwa i Ochrona Przed Wyciekiem
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                Administrator stosuje zaawansowane techniczne i organizacyjne środki ochrony danych, w tym:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Szyfrowanie wszelkiej komunikacji protokołem TLS 1.3 / HTTPS z certyfikatami wysokiego bezpieczeństwa.</li>
                <li>Zabezpieczenie przed atakami typu DDoS, brute-force oraz skanowaniem podatności na poziomie zapór sieciowych i WAF.</li>
                <li>Automatyczne obcinanie payloadu ciasteczek sesyjnych w celu zapobiegania atakom typu session hijacking.</li>
                <li>Separację środowisk bazodanowych oraz regularne kopie zapasowe z szyfrowaniem.</li>
              </ul>
            </div>
          </section>

          {/* § 11 */}
          <section id="postanowienia-koncowe" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-200 font-mono font-bold text-xs">
                § 11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Aktualizacje Informacji o Prywatności
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Niniejsza Informacja o Ochronie Prywatności może podlegać okresowym aktualizacjom w celu dostosowania jej do zmian w prawie, rozwoju technologicznym platformy lub rozbudowy funkcji Serwisu.
              </p>
              <p>
                2. Wszelkie zmiany wchodzą w życie z dniem ich opublikowania w Serwisie ze wskazaniem daty ostatniej aktualizacji.
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border text-xs space-y-1.5 font-mono mt-4">
                <p><span className="text-zinc-400">Kontakt ds. prywatności:</span> <strong className="text-emerald-400">privacy@{siteConfig.domain}</strong></p>
                <p><span className="text-zinc-400">Wsparcie ogólne:</span> <strong className="text-zinc-200">support@{siteConfig.domain}</strong></p>
                <p><span className="text-zinc-400">Discord:</span> <a href={siteConfig.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-200 underline">{siteConfig.discordServerName}</a></p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
