"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  Crown,
  Video,
  Lock,
  Scale,
  Ban,
  MessageSquare,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

interface FaqItem {
  id: string;
  category: "general" | "creators" | "safety" | "copyright" | "account";
  question: string;
  answer: string | React.ReactNode;
  tags: string[];
}

export const FaqContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "what-is-onlyyou": true,
    "how-to-become-creator": true,
  });

  const categories = [
    { id: "all", label: "Wszystkie pytania", icon: HelpCircle },
    { id: "general", label: "Ogólne o platformie", icon: Sparkles },
    { id: "creators", label: "Dla Twórców (18+)", icon: Crown },
    { id: "safety", label: "Bezpieczeństwo & Moderacja", icon: ShieldCheck },
    { id: "copyright", label: "Prawa autorskie & Leaki", icon: Scale },
    { id: "account", label: "Konto & Prywatność", icon: Lock },
  ];

  const faqItems: FaqItem[] = [
    // --- OGÓLNE ---
    {
      id: "what-is-onlyyou",
      category: "general",
      question: "Czym jest platforma OnlyYou i jak działa?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong>OnlyYou</strong> to nowoczesna, niezależna platforma społecznościowo-multimedialna dla pełnoletnich twórców (18+), zintegrowana w czasie rzeczywistym z Discordem.
          </p>
          <p>
            Platforma łączy wygodne przeglądanie filmów i zdjęć w wysokiej jakości (1080p, 720p, 480p) na stronie internetowej z dedykowanymi <strong>Discord Creator Hubs</strong> na naszym oficjalnym serwerze {siteConfig.discordServerName}.
          </p>
        </div>
      ),
      tags: ["onlyyou", "ogólne", "co to jest", "działanie", "discord"],
    },
    {
      id: "is-it-free",
      category: "general",
      question: "Czy korzystanie z OnlyYou i przeglądanie materiałów jest darmowe?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Tak!</strong> Przeglądanie serwisu, odkrywanie twórców, polubienia oraz dołączenie do społeczności Discord jest całkowicie bezpłatne.
          </p>
          <p>
            Twórcy mogą publikować zarówno materiały ogólnodostępne dla zweryfikowanych użytkowników 18+, jak i oferować ekskluzywne korzyści dla wspierających w swoich Creator Hubach na Discordzie.
          </p>
        </div>
      ),
      tags: ["darmowe", "cena", "opłaty", "koszt"],
    },
    {
      id: "age-requirement",
      category: "general",
      question: "Czy muszę mieć ukończone 18 lat, aby korzystać z OnlyYou?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong className="text-red-400">BEZWZGLĘDNIE TAK.</strong> OnlyYou to platforma wyłącznie dla osób pełnoletnich.
          </p>
          <p>
            Serwis zawiera materiały przeznaczone wyłącznie dla dorosłych (treści NSFW, erotyka, nagość). Wszyscy użytkownicy muszą potwierdzić pełnoletność (bramka Age-Gate), a osoby poniżej 18. roku życia podlegają bezwzględnemu zakazowi korzystania z platformy.
          </p>
        </div>
      ),
      tags: ["18+", "pełnoletność", "wiek", "dorosły", "bramka"],
    },
    {
      id: "how-login-works",
      category: "general",
      question: "Dlaczego logowanie odbywa się przez Discord?",
      answer: (
        <div className="space-y-2">
          <p>
            Wykorzystujemy bezpieczny protokół <strong>Discord OAuth2</strong>. Zapewnia to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Brak konieczności tworzenia kolejnego hasła — logujesz się 1 kliknięciem.</li>
            <li>Błyskawiczną synchronizację odznak, ról twórcy oraz dostępu do prywatnych Creator Hubów.</li>
            <li>Wysokie bezpieczeństwo — Twoje hasło do Discorda nigdy nie trafia na nasze serwery.</li>
          </ul>
        </div>
      ),
      tags: ["login", "discord", "logowanie", "bezpieczeństwo", "oauth"],
    },

    // --- DLA TWÓRCÓW ---
    {
      id: "how-to-become-creator",
      category: "creators",
      question: "Jak dołączyć do Programu Twórców i publikować filmy?",
      answer: (
        <div className="space-y-2">
          <p>
            Dołączenie do grona twórców odbywa się w kilku prostych i bezpiecznych krokach:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-zinc-400">
            <li>Dołącz do naszego oficjalnego serwera Discord <strong>{siteConfig.discordServerName}</strong>.</li>
            <li>Otwórz prywatny ticket weryfikacyjny (kategoria <em>Weryfikacja Twórcy 18+</em>).</li>
            <li>Przejdź prostą weryfikację wieku i tożsamości z administracją.</li>
            <li>Odbierz rangę Twórcy na Discordzie — natychmiast odblokuje ona Twój Panel Twórcy na stronie oraz stworzy Twój oficjalny Creator Hub!</li>
          </ol>
          <div className="pt-2">
            <Link href="/creator-program" className="inline-flex items-center gap-1.5 text-brand-primary hover:underline font-semibold text-xs">
              <span>Zobacz szczegóły w Programie Twórców</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ),
      tags: ["twórca", "zostań twórcą", "weryfikacja", "publikacja", "creator"],
    },
    {
      id: "creator-id-verification-privacy",
      category: "creators",
      question: "Kto widzi moje dokumenty tożsamości przesłane do weryfikacji twórcy?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Nikt poza upoważnioną administracją ds. compliance.</strong> Twoje dokumenty są objęte klauzulą najwyższej poufności.
          </p>
          <p>
            Służą one wyłącznie wypełnieniu wymogów prawnych (potwierdzenie, że twórca jest osobą pełnoletnią 18+ i dobrowolnie publikuje swój wizerunek). Dokumenty są szyfrowane (AES-256) i <strong>nigdy nie zostaną upublicznione ani udostępnione osobom trzecim</strong>.
          </p>
        </div>
      ),
      tags: ["weryfikacja", "dowód", "prywatność", "dokumenty", "bezpieczeństwo"],
    },
    {
      id: "what-is-creator-hub",
      category: "creators",
      question: "Czym jest dedykowany Creator Hub na Discordzie?",
      answer: (
        <div className="space-y-2">
          <p>
            To Twój własny, automatycznie wygenerowany kanał w kategorii <strong>💙 Twórcy</strong> na serwerze Discord.
          </p>
          <p>
            Bot <strong>{siteConfig.discordAppName}</strong> automatycznie publikuje na nim powiadomienia, gdy dodasz nowy film lub zdjęcie na stronie, a Ty masz bezpośredni kontakt ze swoimi fanami i społecznością.
          </p>
        </div>
      ),
      tags: ["creator hub", "kanał", "discord", "bot", "powiadomienia"],
    },
    {
      id: "video-formats-and-quality",
      category: "creators",
      question: "Jakie formaty i rozdzielczości wideo wspiera platforma?",
      answer: (
        <div className="space-y-2">
          <p>
            Wspieramy nowoczesne formaty <strong>MP4, WebM i MOV</strong>.
          </p>
          <p>
            Nasz system automatycznie transkoduje każdy przesłany materiał do wielu jakości (Full HD 1080p, 720p, 480p), dzięki czemu Twoje filmy ładują się błyskawicznie na smartfonach, tabletach i komputerach.
          </p>
        </div>
      ),
      tags: ["wideo", "format", "jakość", "1080p", "mp4"],
    },

    // --- BEZPIECZEŃSTWO & MODERACJA ---
    {
      id: "zero-tolerance-policy",
      category: "safety",
      question: "Jakie treści są kategorycznie ZABRONIONE na OnlyYou?",
      answer: (
        <div className="space-y-2">
          <p>
            Stosujemy bezwzględną politykę <strong>Zero Tolerancji</strong>. Kategorycznie zabronione są:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-red-400">CSAM / CSAT:</strong> jakiekolwiek materiały z udziałem osób małoletnich (natychmiastowy ban i zawiadomienie organów ścigania / NCMEC).</li>
            <li><strong className="text-amber-400">Treści bez zgody (Non-Consensual):</strong> nagrania z ukrytej kamery, revenge porn, deepfake AI, szantaż intymny.</li>
            <li><strong className="text-zinc-200">Przemoc skrajna:</strong> zoofilia, nekrofilia, tortury, samookaleczenia, handel ludźmi.</li>
            <li><strong className="text-zinc-200">Doxxing:</strong> ujawnianie prawdziwych danych osobowych, adresów czy prywatnych kont twórców.</li>
          </ul>
        </div>
      ),
      tags: ["zakazy", "nielegalne", "moderacja", "csam", "regulamin"],
    },
    {
      id: "how-to-report-content",
      category: "safety",
      question: "Jak mogę zgłosić materiał naruszający zasady lub prawa autorskie?",
      answer: (
        <div className="space-y-2">
          <p>
            Zgłoszenia możesz dokonać na dwa sposoby:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>Kliknij ikonę flagi / przycisk <strong>„Zgłoś”</strong> znajdujący się bezpośrednio pod każdym filmem lub postem na stronie.</li>
            <li>Napisz bezpośrednio do zespołu moderacji na adres <strong>support@{siteConfig.domain}</strong> lub w tickecie na Discordzie.</li>
          </ul>
          <p className="text-xs text-emerald-400 font-semibold pt-1">
            Zgłoszenia dotyczące podejrzenia braku zgody lub niepełnoletności są rozpatrywane priorytetowo (do 2 godzin).
          </p>
        </div>
      ),
      tags: ["zgłoszenie", "raport", "naruszenie", "pomoc", "moderacja"],
    },

    // --- PRAWA AUTORSKIE & LEAKI ---
    {
      id: "can-i-download-videos",
      category: "copyright",
      question: "Czy wolno pobierać lub nagrywać filmy twórców z OnlyYou?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong className="text-red-400">BEZWZGLĘDNIE NIE.</strong> Wszelkie materiały wideo i zdjęcia są chronione prawem autorskim.
          </p>
          <p>
            Użytkownik ma prawo wyłącznie do ich osobistego odtwarzania w oknie przeglądarki na stronie. Ripowanie, używanie wtyczek pobierających, nagrywanie ekranu (OBS) oraz wyciąganie plików ze strumienia jest surowo zabronione.
          </p>
        </div>
      ),
      tags: ["pobieranie", "ripowanie", "screen recording", "prawa autorskie", "download"],
    },
    {
      id: "how-leaks-are-handled",
      category: "copyright",
      question: "Co grozi za udostępnianie filmów twórców poza serwisem (leaki na Telegramie, Mega itp.)?",
      answer: (
        <div className="space-y-2">
          <p>
            Osoby odpowiedzialne za wycieki ponoszą surowe konsekwencje:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong className="text-white">Identyfikacja:</strong> Strumienie wideo zawierają niewidoczne znaki wodne (forensic watermarking), które pozwalają ustalić dokładne konto rippera.</li>
            <li><strong className="text-red-400">Odpowiedzialność karna:</strong> Art. 116 Prawa autorskiego przewiduje karę pozbawienia wolności do 3 lub 5 lat za nielegalne rozpowszechnianie cudzych utworów.</li>
            <li><strong className="text-amber-400">Odszkodowania cywilne:</strong> Roszczenia odszkodowawcze (wielokrotność wartości licencji) dochodzone na drodze sądowej.</li>
            <li><strong className="text-zinc-200">Takedowny DMCA:</strong> Natychmiastowe usuwanie linków z Google, Mega, Telegrama i hosterów.</li>
          </ul>
        </div>
      ),
      tags: ["leaki", "telegram", "kara", "więzienie", "dmca", "watermark"],
    },

    // --- KONTO & DANE ---
    {
      id: "how-to-delete-account",
      category: "account",
      question: "Jak mogę usunąć swoje konto lub zaktualizować dane profilu?",
      answer: (
        <div className="space-y-2">
          <p>
            W każdej chwili możesz edytować swoje bio, nazwę wyświetlaną oraz zdjęcia w zakładce <strong>Ustawienia</strong> lub w Panelu Twórcy.
          </p>
          <p>
            Aby całkowicie usunąć konto i powiązane dane z bazy Serwisu, wystarczy przesłać prośbę na adres <strong>privacy@{siteConfig.domain}</strong> lub otworzyć ticket na serwerze Discord. Twoje konto zostanie trwale skasowane zgodnie z RODO.
          </p>
        </div>
      ),
      tags: ["usunięcie", "konto", "profil", "edycja", "rodo"],
    },
    {
      id: "do-you-sell-data",
      category: "account",
      question: "Czy OnlyYou sprzedaje dane użytkowników podmiotom trzecim?",
      answer: (
        <div className="space-y-2">
          <p>
            <strong className="text-emerald-400">NIGDY.</strong> Nie sprzedajemy, nie wynajmujemy ani nie przekazujemy danych naszych użytkowników żadnym zewnętrznym brokerom danych ani agencjom marketingowym.
          </p>
          <p>
            Twoje dane są wykorzystywane wyłącznie w celu zapewnienia prawidłowego działania Serwisu, weryfikacji pełnoletności i bezpieczeństwa platformy.
          </p>
        </div>
      ),
      tags: ["sprzedaż danych", "bezpieczeństwo", "prywatność", "brokerzy"],
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      if (!searchQuery.trim()) return matchesCategory;

      const query = searchQuery.toLowerCase();
      const matchesText =
        item.question.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesText;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Strona główna
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Często zadawane pytania (FAQ)</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-brand-primary text-xs font-semibold mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Centrum Pomocy & FAQ OnlyYou</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Często zadawane{" "}
          <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-pink-500 bg-clip-text text-transparent">
            pytania
          </span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Wszystko, co musisz wiedzieć o funkcjonowaniu OnlyYou, programie twórców, weryfikacji wieku 18+, ochronie przed leakami oraz bezpieczeństwie konta.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Wyszukaj pytanie lub słowo kluczowe (np. weryfikacja, 18+, leaki, creator hub)..."
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface hover:bg-surface-hover focus:bg-surface border border-surface-border focus:border-brand-primary text-sm text-zinc-100 placeholder:text-zinc-500 transition-all outline-none shadow-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded bg-zinc-800"
          >
            Wyczyść
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                  : "bg-surface hover:bg-surface-hover text-zinc-400 hover:text-zinc-200 border border-surface-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ Items Accordion */}
      <div className="space-y-3 mb-14">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isOpen = Boolean(openItems[item.id]);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-surface-border bg-surface transition-colors overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-surface-hover/50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-zinc-100">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center bg-zinc-800/80 border border-zinc-700/50 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-brand-primary/20 border-brand-primary/40 text-brand-primary" : "text-zinc-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-zinc-300 border-t border-surface-border/60 pt-4 leading-relaxed bg-surface/50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border text-zinc-400 space-y-3">
            <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="font-semibold text-zinc-300">Nie znaleziono pytań pasujących do „{searchQuery}”</p>
            <p className="text-xs text-zinc-500">Spróbuj wpisać inne hasło lub zresetować filtry.</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 text-xs"
            >
              Pokaż wszystkie pytania
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Help CTA Card */}
      <div className="relative border border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 via-surface to-surface rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider justify-center sm:justify-start">
            <MessageSquare className="w-4 h-4" />
            <span>Potrzebujesz dodatkowej pomocy?</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Nasz zespół wsparcia i administracji czeka na Discordzie!
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Nie znalazłeś odpowiedzi na swoje pytanie? Dołącz do serwera <strong>{siteConfig.discordServerName}</strong> i otwórz prywatny ticket na kanale wsparcia. Odpowiadamy codziennie!
          </p>
        </div>

        <a
          href={siteConfig.discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Button variant="discord" size="lg" className="gap-2 font-bold shadow-xl">
            <MessageSquare className="w-4 h-4" />
            <span>Dołącz do Discorda i Zapytaj</span>
          </Button>
        </a>
      </div>
    </div>
  );
};
