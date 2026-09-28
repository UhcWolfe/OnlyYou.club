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
  UserCheck,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Regulamin i Warunki Korzystania — OnlyYou",
  description:
    "Oficjalny regulamin platformy 18+, zasady publikacji i moderacji treści, weryfikacja wieku, standardy bezpieczeństwa oraz ochrona praw twórców w OnlyYou.",
};

export default function TermsPage() {
  const lastUpdated = "13 września 2026";

  const tableOfContents = [
    { id: "postanowienia-ogolne", num: "§ 1", title: "Postanowienia Ogólne i Definicje" },
    { id: "wymog-pelnoletnosci", num: "§ 2", title: "Kategoryczny Wymóg Pełnoletności (18+) i Weryfikacja Wieku" },
    { id: "zero-tolerance", num: "§ 3", title: "Polityka Zero Tolerancji dla Treści Nielegalnych (Zero Tolerance)" },
    { id: "zasady-dla-tworcow", num: "§ 4", title: "Wymogi i Standardy dla Twórców (Record-Keeping & 2257)" },
    { id: "discord-integration", num: "§ 5", title: "Integracja z Serwerem Discord & Creator Hubs" },
    { id: "wlasnosc-intelektualna", num: "§ 6", title: "Własność Intelektualna i Zakaz Zgrywania Treści" },
    { id: "notice-and-takedown", num: "§ 7", title: "Procedura Zgłaszania Naruszeń (Notice & Takedown / DSA / DMCA)" },
    { id: "zasady-spolecznosci", num: "§ 8", title: "Zasady Społeczności i Zachowania Użytkowników" },
    { id: "platnosci-i-monetyzacja", num: "§ 9", title: "Płatności, Monetyzacja i Odstąpienie od Umowy" },
    { id: "odpowiedzialnosc-platformy", num: "§ 10", title: "Ograniczenie Odpowiedzialności Platformy" },
    { id: "sankcje-i-bany", num: "§ 11", title: "Sankcje, Blokady Kont i Zgłoszenia do Służb" },
    { id: "postanowienia-koncowe", num: "§ 12", title: "Postanowienia Końcowe i Kontakt" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner / Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Regulamin i warunki</span>
      </div>

      {/* Header Section */}
      <div className="relative border border-surface-border bg-gradient-to-br from-surface via-surface-hover/60 to-surface rounded-2xl p-6 sm:p-10 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="border-red-500/40 text-red-400 bg-red-500/10 px-3 py-1 text-xs font-bold gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              Platforma 18+ Tylko dla Pełnoletnich
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 bg-zinc-800/40 px-3 py-1 text-xs font-medium gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              Ostatnia aktualizacja: {lastUpdated}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Regulamin i Warunki Korzystania z Serwisu{" "}
            <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
              OnlyYou
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
            Niniejszy dokument stanowi wiążącą umowę prawną pomiędzy Użytkownikiem a operatorem Serwisu OnlyYou (<span className="text-zinc-100 font-mono text-xs">{siteConfig.domain}</span>). 
            Dostęp do Serwisu oraz publikacja treści dla dorosłych podlegają bezwzględnym regułom bezpieczeństwa, weryfikacji tożsamości, przepisom międzynarodowym oraz polityce absolutnego braku tolerancji (Zero Tolerance) dla treści niedozwolonych.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Weryfikacja tożsamości 18+</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Ban className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Zero tolerancji dla CSAM/bez zgody</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Zakaz pobierania i ripowania</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300">
              <Scale className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <span>Zgodność z DSA & 18 U.S.C. 2257</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sticky Navigation Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-4 sticky top-20 z-20 space-y-4">
          <Card className="p-5 border-surface-border bg-surface/90 backdrop-blur-md">
            <div className="flex items-center gap-2 font-bold text-sm text-zinc-100 mb-4 pb-3 border-b border-surface-border">
              <FileText className="w-4 h-4 text-brand-primary" />
              <span>Spis Treści Regulaminu</span>
            </div>
            <nav className="space-y-1 text-xs">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors group"
                >
                  <span className="font-mono text-[11px] font-bold text-brand-primary group-hover:text-purple-300">
                    {item.num}
                  </span>
                  <span className="truncate">{item.title}</span>
                </a>
              ))}
            </nav>
          </Card>

          {/* Quick Support & Report Box */}
          <Card className="p-5 border-amber-500/20 bg-amber-950/10 text-xs text-zinc-400 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Zgłoszenia Naruszeń</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Jeśli podejrzewasz publikację materiałów bez zgody, nielegalnych lub naruszających prawa autorskie, zgłoś to natychmiast za pomocą przycisku zgłoszenia przy poście lub bezpośrednio do administracji.
            </p>
            <a
              href={siteConfig.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-medium underline underline-offset-2"
            >
              <span>Otwórz ticket w OnlyYou | Club</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </Card>
        </aside>

        {/* Legal Text Content */}
        <main className="lg:col-span-8 space-y-8 text-zinc-300 leading-relaxed text-sm">
          {/* § 1 */}
          <section id="postanowienia-ogolne" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-brand-primary/20 text-brand-primary font-mono font-bold text-xs">
                § 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Postanowienia Ogólne i Definicje
              </h2>
            </div>
            <div className="space-y-3.5 text-zinc-300 text-sm">
              <p>
                1. Niniejszy Regulamin (dalej: <strong className="text-white">„Regulamin”</strong>) określa warunki, prawa i obowiązki osób korzystających z platformy internetowej <strong className="text-white">{siteConfig.name}</strong>, dostępnej pod adresem <span className="text-brand-primary font-mono font-semibold">{siteConfig.domain}</span> (dalej: <strong className="text-white">„Serwis”</strong>), w tym usługi dystrybucji, prezentacji i przeglądania cyfrowych treści dla osób pełnoletnich oraz integracji z serwerami Discord Creator Hubs.
              </p>
              <p>
                2. Właścicielem, operatorem i podmiotem odpowiedzialnym za zarządzanie infrastrukturą techniczną Serwisu jest Usługodawca.
              </p>
              <p>
                3. Serwis ma charakter <strong className="text-red-400">wyłącznie rozrywkowy i przeznaczony jest bezwzględnie i wyłącznie dla osób pełnoletnich (18+)</strong>. Serwis zawiera treści o charakterze erotycznym, pornograficznym, nagość oraz materiały przeznaczone wyłącznie dla dojrzałych odbiorców (treści NSFW – Not Safe For Work).
              </p>
              <p>
                4. Definicje kluczowych pojęć używanych w Regulaminie:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Użytkownik</strong> — każda osoba fizyczna, która ukończyła 18 lat, przeglądająca zawartość Serwisu lub posiadająca zarejestrowane konto zautoryzowane przez OAuth2 Discord.
                </li>
                <li>
                  <strong className="text-zinc-200">Twórca (Creator / Model)</strong> — pełnoletni Użytkownik, który pomyślnie przeszedł procedurę weryfikacji tożsamości i wieku, uzyskał odznakę oraz uprawnienia do samodzielnego publikowania materiałów audiowizualnych w Serwisie.
                </li>
                <li>
                  <strong className="text-zinc-200">Treści dla Dorosłych (NSFW Content)</strong> — fotografie, nagrania wideo, transmisje, teksty, grafiki oraz komentarze przedstawiające nagość, akty seksualne lub erotyczne.
                </li>
                <li>
                  <strong className="text-zinc-200">Discord Creator Hub</strong> — dedykowany, zsynchronizowany kanał na oficjalnym serwerze Discord {siteConfig.discordServerName}, powiązany z kontem Twórcy za pośrednictwem oficjalnego bota {siteConfig.discordAppName}.
                </li>
              </ul>
            </div>
          </section>

          {/* § 2 */}
          <section id="wymog-pelnoletnosci" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-mono font-bold text-xs">
                § 2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Kategoryczny Wymóg Pełnoletności (18+) i Weryfikacja Wieku
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/40 text-red-300 font-medium text-xs leading-relaxed flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>OŚWIADCZENIE O WIEKU:</strong> Wejście na stronę, autoryzacja oraz każdorazowe korzystanie z Serwisu stanowi jednoznaczne i prawnie wiążące oświadczenie Użytkownika pod rygorem odpowiedzialności prawnej, że ma ukończone co najmniej 18 lat (lub wiek pełnoletności przewidziany przez prawo kraju, w którym przebywa) oraz że w świetle lokalnych przepisów posiada pełne prawo do oglądania i nabywania treści erotycznych i pornograficznych.
                </div>
              </div>

              <p>
                1. Osobom poniżej 18. roku życia obowiązuje <strong className="text-red-400 uppercase">całkowity i bezwzględny zakaz</strong> dostępu do Serwisu, przeglądania materiałów, zakładania konta, komentowania oraz aplikowania o profil Twórcy.
              </p>
              <p>
                2. Serwis stosuje mechanizmy bramki wiekowej (Age-Gate) oraz zabezpieczenia autoryzacyjne. Jakiekolwiek próby ominięcia mechanizmów weryfikacji wieku przez osoby małoletnie będą traktowane jako bezprawne naruszenie integralności systemu.
              </p>
              <p>
                3. <strong className="text-white">Weryfikacja Tożsamości Twórców:</strong> Każda osoba ubiegająca się o status Twórcy zobowiązana jest do przejścia rygorystycznej weryfikacji tożsamości prowadzonej przez administrację platformy. Weryfikacja obejmuje przedstawienie ważnego dokumentu tożsamości ze zdjęciem (dowód osobisty / paszport) oraz weryfikację biometryczną („selfie z dokumentem i aktualną datą”). Treści Twórcy, który nie przeszedł pełnej weryfikacji, nie zostaną dopuszczone do publikacji.
              </p>
              <p>
                4. W przypadku powzięcia jakichkolwiek uzasadnionych podejrzeń, że użytkownik lub twórca nie ukończył 18 lat, administracja natychmiastowo i bez uprzedzenia blokuje dostęp do konta, zabezpiecza materiały i podejmuje kroki wyjaśniające.
              </p>
            </div>
          </section>

          {/* § 3 */}
          <section id="zero-tolerance" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 font-mono font-bold text-xs">
                § 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Polityka Zero Tolerancji dla Treści Nielegalnych (Zero Tolerance)
              </h2>
            </div>
            <div className="space-y-4 text-sm">
              <p>
                Serwis OnlyYou stosuje politykę <strong className="text-red-400 uppercase">bezwzględnego braku tolerancji</strong> dla jakichkolwiek form przemocy, nielegalnych praktyk i wykorzystywania. Następujące kategorie treści są surowo zabronione:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-red-900/50">
                  <h3 className="text-red-400 font-bold text-sm mb-1 flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    1. Wykorzystywanie seksualne małoletnich (CSAM / CSAT)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Kategorycznie zabronione jest publikowanie, posiadanie, promowanie, linkowanie lub sugerowanie materiałów przedstawiających osoby małoletnie w kontekście seksualnym, pornografii dziecięcej, materiałów typu loli/shota, fikcyjnych lub generowanych komputerowo przedstawień małoletnich, a także odgrywania ról (role-play) sugerujących niepełnoletność. 
                    <strong className="text-zinc-200 block mt-1">
                      Konsekwencje: Natychmiastowe trwałe zablokowanie konta, usunięcie materiałów, zabezpieczenie cyfrowych śladów (adres IP, Discord ID, dane sprzętowe) oraz natychmiastowe formalne zgłoszenie do NCMEC (National Center for Missing & Exploited Children), Policji oraz organów ścigania właściwej jurysdykcji.
                    </strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h3 className="text-amber-400 font-bold text-sm mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    2. Treści bez zgody (Non-Consensual Sexual Content & Revenge Porn)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Bezwzględny zakaz publikowania jakichkolwiek materiałów intymnych lub wizerunku osób trzecich bez ich wyraźnej, udokumentowanej i pisemnej zgody. Obejmuje to zakaz: nagrań z ukrytych kamer, tzw. zemsty porno (revenge porn), upubliczniania materiałów z prywatnych korespondencji, materiałów deepfake (AI face-swapping z wizerunkiem osób bez ich zgody) oraz szantażu seksualnego (sextortion).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h3 className="text-zinc-200 font-bold text-sm mb-1 flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-400" />
                    3. Przemoc skrajna, zoofilia, nekrofilia i samookaleczenia
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Zabrania się publikowania materiałów przedstawiających: zoofilię (seks ze zwierzętami), nekrofilię, tortury, okaleczanie narządów, przemoc z użyciem niebezpiecznych narzędzi, gwałty, handel ludźmi, odurzenie substancjami uniemożliwiające wyrażenie świadomej zgody oraz jakiekolwiek formy nakłaniania do samobójstwa.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* § 4 */}
          <section id="zasady-dla-tworcow" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-mono font-bold text-xs">
                § 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Wymogi i Standardy dla Twórców (Record-Keeping & 2257)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Każdy Twórca publikujący treści w Serwisie oświadcza, zapewnia i gwarantuje pod pełnym rygorem odpowiedzialności prawnej, że:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>
                  Samodzielnie posiada pełnię autorskich praw majątkowych i osobistych do publikowanych materiałów lub posiada ważną licencję umożliwiającą ich publiczne udostępnianie w celach komercyjnych i promocyjnych.
                </li>
                <li>
                  Wszystkie osoby fizyczne (performerzy / modele) występujące w publikowanych filmach i zdjęciach w chwili powstawania nagrania miały <strong className="text-white">ukończone co najmniej 18 lat</strong>.
                </li>
                <li>
                  Posiada ważną, pisemną i podpisaną zgodę na utrwalanie, publikację i dystrybucję wizerunku każdej z osób występujących w materiałach (zgodnie ze standardem <span className="text-zinc-200 font-semibold">18 U.S.C. § 2257</span> oraz przepisami prawa autorskiego).
                </li>
                <li>
                  Jest w stanie przedstawić kopie dokumentów tożsamości współtwórców oraz oświadczenia o zgodzie na każde żądanie administracji Serwisu w terminie nie dłuższym niż <strong className="text-white">24 godziny</strong> od doręczenia wezwania.
                </li>
              </ul>
              <p>
                2. <strong className="text-white">Zwolnienie z odpowiedzialności (Indemnification):</strong> Twórca przyjmuje na siebie wyłączną odpowiedzialność cywilną, karną i administracyjną za wszelkie roszczenia osób trzecich wynikające z publikacji jego materiałów. Twórca zobowiązuje się chronić, bronić i zwolnić Serwis OnlyYou, jego właścicieli, administratorów i współpracowników z wszelkiej odpowiedzialności finansowej, kosztów procesowych, kar administracyjnych oraz odszkodowań wynikłych z naruszenia niniejszego punktu.
              </p>
            </div>
          </section>

          {/* § 5 */}
          <section id="discord-integration" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-[#5865F2]/20 text-[#7983F5] font-mono font-bold text-xs">
                § 5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Integracja z Serwerem Discord & Creator Hubs
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Dostęp do części funkcji Serwisu, w tym logowanie, synchronizacja statusu Twórcy oraz powiadomienia, realizowany jest poprzez oficjalne API platformy Discord (Discord OAuth2) oraz dedykowanego bota <strong className="text-white">{siteConfig.discordAppName}</strong>.
              </p>
              <p>
                2. Korzystając z Serwisu i serwera <strong className="text-white">{siteConfig.discordServerName}</strong>, Użytkownik i Twórca zobowiązują się do bezwzględnego przestrzegania wytycznych <a href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">Discord Community Guidelines</a> oraz <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline">Terms of Service Discorda</a>.
              </p>
              <p>
                3. Wszelkie kanały Creator Hub na serwerze Discord prezentujące treści dla dorosłych są i muszą pozostać oznaczone jako kanały z ograniczeniem wiekowym (Age-Restricted / NSFW).
              </p>
              <p>
                4. Zablokowanie (ban) konta Użytkownika lub Twórcy na oficjalnym serwerze Discord z powodu rażących naruszeń zasad bezpieczeństwa może skutkować automatyczną i jednoczesną blokadą powiązanego konta na platformie OnlyYou.
              </p>
            </div>
          </section>

          {/* § 6 */}
          <section id="wlasnosc-intelektualna" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                § 6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Własność Intelektualna i Zakaz Zgrywania Treści
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs leading-relaxed font-medium">
                <strong>ŚCISŁY ZAKAZ ZGRYWANIA (ANTI-RIP POLICY):</strong> Wszelkie materiały wideo, zdjęcia, galerie i transmisje publikowane przez Twórców są chronione prawem autorskim. Użytkownik ma prawo wyłącznie do ich osobistego odtwarzania w oknie przeglądarki w ramach Serwisu.
              </div>
              <p>
                1. Użytkownikom surowo zabrania się:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Pobierania, ripowania strumieni (stream ripping), nagrywania ekranu (screen recording) materiałów Twórców.</li>
                <li>Udostępniania, dystrybucji, re-uploadu, publikowania na forach trzecich (m.in. Mega, Telegram, Reddit, serwisy tube) materiałów pochodzących z Serwisu.</li>
                <li>Odsprzedaży kont, dostępów lub tokenów osobom trzecim.</li>
                <li>Wykorzystywania automatycznych skryptów, crawlerów, botów lub narzędzi typu scraper do pobierania bazy danych i mediów Serwisu.</li>
              </ul>
              <p>
                2. Wykrycie naruszenia powyższego zakazu skutkuje natychmiastowym permanentnym banem konta, wpisaniem identyfikatorów na czarną listę oraz przekazaniem danych naruszyciela kancelariom prawnym reprezentującym poszkodowanych Twórców celem dochodzenia odszkodowań cywilnych.
              </p>
              <p>
                3. Twórca publikując materiały w Serwisie udziela OnlyYou niewyłącznej, odwołalnej (wraz z usunięciem treści przez Twórcę), zbywalnej licencji na hosting, transkodowanie (konwersję formatów i rozdzielczości 1080p/720p/480p), buforowanie CDN oraz wyświetlanie materiałów w ramach platformy.
              </p>
            </div>
          </section>

          {/* § 7 */}
          <section id="notice-and-takedown" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-mono font-bold text-xs">
                § 7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Procedura Zgłaszania Naruszeń (Notice & Takedown / DSA / DMCA)
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Zgodnie z Aktem o Usługach Cyfrowych (DSA — Digital Services Act) oraz Digital Millennium Copyright Act (DMCA), Serwis zapewnia szybką i bezpośrednią ścieżkę zgłaszania naruszeń prawa, nielegalnych treści oraz naruszeń praw autorskich.
              </p>
              <p>
                2. Każdy zarejestrowany lub niezarejestrowany użytkownik może zgłosić materiał za pomocą dedykowanego przycisku <strong className="text-white">„Zgłoś materiał”</strong> dostępnego bezpośrednio pod każdym postem lub filmem, bądź drogą mailową na adres wsparcia.
              </p>
              <p>
                3. W przypadku zgłoszeń dotyczących:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li><strong className="text-red-400">Podejrzenia niepełnoletności lub CSAM:</strong> Dostęp do treści jest blokowany natychmiastowo, sprawa trafia do natychmiastowego audytu bezpieczeństwa i zawiadomienia służb.</li>
                <li><strong className="text-amber-400">Braku zgody na wizerunek (Non-consensual):</strong> Treść zostaje prewencyjnie ukryta w ciągu maksymalnie 2 godzin od zgłoszenia do czasu przedstawienia przez Twórcę dokumentów 2257.</li>
                <li><strong className="text-zinc-300">Praw autorskich (DMCA):</strong> Zgłoszenie musi zawierać link do spornego materiału, dowód posiadania praw autorskich oraz podpis właściciela praw. Serwis proceduje zgłoszenia w terminie do 24 godzin.</li>
              </ul>
            </div>
          </section>

          {/* § 8 */}
          <section id="zasady-spolecznosci" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-200 font-mono font-bold text-xs">
                § 8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Zasady Społeczności i Zachowania Użytkowników
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. W relacjach z Twórcami i innymi Użytkownikami w komentarzach, na profilach oraz kanałach Discord obowiązuje kultura osobista i szacunek.
              </p>
              <p>
                2. Kategorycznie zabrania się:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Ujawniania prywatnych danych osobowych Twórców (tzw. doxxing: prawdziwe imiona, nazwiska, adresy zamieszkania, numery telefonów, prywatne profile społecznościowe).</li>
                <li>Nękania, stalkingu, grożenia pobiciem, szantażu emocjonalnego lub finansowego wobec Twórców.</li>
                <li>Spamu, zamieszczania linków afiliacyjnych, złośliwego oprogramowania oraz phishingu.</li>
                <li>Oferowania usług prostytucji, eskortu, spotkań fizycznych za wynagrodzenie oraz handlu substancjami kontrolowanymi.</li>
              </ul>
            </div>
          </section>

          {/* § 9 */}
          <section id="platnosci-i-monetyzacja" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                § 9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Płatności, Monetyzacja i Odstąpienie od Umowy
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Ceny dostępów, subskrypcji lub napiwków podawane w Serwisie są cenami brutto. Transakcje rozliczane są za pośrednictwem certyfikowanych operatorów płatności zewnętrznych.
              </p>
              <p>
                2. <strong className="text-white">Utrata prawa do odstąpienia od umowy:</strong> Z uwagi na charakter oferowanych usług (natychmiastowe udostępnienie treści cyfrowych nieutrwalonych na nośniku materialnym), Użytkownik dokonując zakupu wyraża wyraźną zgodę na natychmiastowe rozpoczęcie świadczenia usługi i przyjmuje do wiadomości, że <strong className="text-amber-300">traci prawo do odstąpienia od umowy</strong> na podstawie art. 38 pkt 13 Ustawy z dnia 30 maja 2014 r. o prawach konsumenta.
              </p>
              <p>
                3. Wszelkie próby bezzasadnego wszczynania procedury chargeback bez wcześniejszego kontaktu ze wsparciem Serwisu będą traktowane jako oszustwo i skutkować będą natychmiastową blokadą konta Użytkownika.
              </p>
            </div>
          </section>

          {/* § 10 */}
          <section id="odpowiedzialnosc-platformy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-200 font-mono font-bold text-xs">
                § 10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Ograniczenie Odpowiedzialności Platformy
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Serwis OnlyYou świadczy usługi hostingu w rozumieniu art. 14 Dyrektywy 2000/31/WE o handlu elektronicznym oraz przepisów Digital Services Act (DSA). Serwis nie jest pierwotnym wydawcą materiałów tworzonych i umieszczanych samodzielnie przez Twórców.
              </p>
              <p>
                2. Usługodawca dokłada najwyższej staranności w celu zapewnienia ciągłego i bezpiecznego funkcjonowania platformy, jednakże usługa świadczona jest w stanie „tak jak jest” (as is). Usługodawca nie gwarantuje braku przerw technicznych wynikających z konserwacji serwerów, awarii łączy internetowych lub zdarzeń siły wyższej.
              </p>
              <p>
                3. W maksymalnym zakresie dozwolonym przez obowiązujące prawo, Usługodawca nie ponosi odpowiedzialności za szkody pośrednie, utracone korzyści ani roszczenia wynikające z niewłaściwego korzystania z Serwisu przez Użytkowników.
              </p>
            </div>
          </section>

          {/* § 11 */}
          <section id="sankcje-i-bany" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-mono font-bold text-xs">
                § 11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Sankcje, Blokady Kont i Zgłoszenia do Służb
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. W razie stwierdzenia naruszenia postanowień niniejszego Regulaminu, administracja OnlyYou zastrzega sobie prawo do zastosowania następujących środków:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>Wystawienia oficjalnego ostrzeżenia (warning) na profilu Użytkownika.</li>
                <li>Natychmiastowego usunięcia kwestionowanych materiałów, zdjęć lub komentarzy.</li>
                <li>Czasowego zawieszenia możliwości dodawania postów lub komentowania.</li>
                <li>Cofnięcia odznaki i uprawnień Twórcy oraz usunięcia powiązanego profilu z wyszukiwarki.</li>
                <li><strong className="text-red-400">Permanentnej blokady (banu):</strong> uniemożliwienia logowania z danego konta Discord, zablokowania powiązanego adresu IP oraz nałożenia blokady na sprzęt (hardware fingerprint).</li>
              </ul>
              <p>
                2. W przypadkach przestępstw ściganych z urzędu (w szczególności materiały z udziałem dzieci, handel ludźmi, groźby karalne, szantaż) administracja bezwzględnie przekazuje pełną dokumentację techniczną właściwym organom ścigania bez obowiązku uprzedniego informowania Użytkownika.
              </p>
            </div>
          </section>

          {/* § 12 */}
          <section id="postanowienia-koncowe" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded bg-brand-primary/20 text-brand-primary font-mono font-bold text-xs">
                § 12
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Postanowienia Końcowe i Kontakt
              </h2>
            </div>
            <div className="space-y-3.5 text-sm">
              <p>
                1. Usługodawca zastrzega sobie prawo do wprowadzania zmian w niniejszym Regulaminie ze względów prawnych, technologicznych lub organizacyjnych. O istotnych zmianach użytkownicy będą informowani poprzez komunikat w Serwisie lub na oficjalnym serwerze Discord.
              </p>
              <p>
                2. W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają powszechnie obowiązujące przepisy prawa, w tym przepisy dotyczące ochrony konsumentów oraz Aktu o Usługach Cyfrowych (DSA).
              </p>
              <p>
                3. Wszelkie pytania, wątpliwości prawne oraz wnioski formalne dotyczące Regulaminu można kierować bezpośrednio do zespołu wsparcia i administracji OnlyYou:
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-surface-border text-xs space-y-1.5 font-mono">
                <p><span className="text-zinc-400">Serwis:</span> <strong className="text-zinc-100">{siteConfig.name} ({siteConfig.domain})</strong></p>
                <p><span className="text-zinc-400">Kontakt wsparcia:</span> <strong className="text-brand-primary">support@{siteConfig.domain}</strong></p>
                <p><span className="text-zinc-400">Tickety Discord:</span> <a href={siteConfig.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-200 underline">{siteConfig.discordServerName} (Sekcja Pomoc / Tickety)</a></p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
