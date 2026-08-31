/**
 * Bilingual copy for the whole site.
 *
 * `en` is the source of truth: its shape defines the `Dictionary` type, and
 * `sr` is typed against it, so a missing or misspelled key in Serbian is a
 * compile error rather than an `undefined` rendered to a visitor.
 *
 * Headline arrays are length-sensitive. The hero type scale is measured against
 * the longest token in each array (see tailwind.config.ts), and Serbian words
 * run longer than their English equivalents — "aplikacije" against "apps". The
 * Serbian headlines below are written short on purpose rather than translated
 * literally, so both languages fit the same measured column.
 */

export type Locale = 'en' | 'sr';

export const LOCALES: Locale[] = ['en', 'sr'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  sr: 'SR',
};

/** BCP-47 tags for the <html lang> attribute. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en',
  sr: 'sr-Latn',
};

const en = {
  nav: {
    work: 'Work',
    process: 'Process',
    about: 'About',
    contact: 'Contact',
    cta: 'Start a project',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguage: 'Switch language',
  },

  hero: {
    available: 'Available for work',
    location: 'Novi Sad, RS',
    independent: 'Independent',
    /** Desktop headline, one entry per line. */
    linesDesktop: ['Crafting', 'Modern', 'High-Performance', 'Web Applications'],
    /** Phone headline — shorter tokens so the type can stay large. */
    linesMobile: ['Modern', 'Web Apps', 'Built to', 'Perform'],
    /** Full sentence for the visually-hidden h1. */
    headline: 'Crafting Modern High-Performance Web Applications',
    leadMobile:
      'I build fast, accessible sites that hold up on real devices. Everything below is live — tap any project and use it yourself.',
    leadDesktop:
      'I build fast, accessible interfaces that hold up on real devices. Everything below is live. Click any project and use it yourself.',
    ctaPrimary: 'Try a live demo',
    ctaSecondary: 'Start a project',
    buildsCount: 'Four live builds',
    scrollToWork: 'Scroll to work',
    scrollShort: 'Work',
  },

  proof: {
    heading: 'At a glance',
    stats: [
      'Live interactive demos',
      'Keyboard navigable',
      'WCAG contrast, measured',
      'Typical reply time',
    ],
  },

  work: {
    eyebrow: 'Selected work',
    titleLead: 'Four builds you can',
    titleMid: 'actually',
    titleAccent: 'use',
    lead: 'Each one is a complete, working site — not a mockup. Open any of them and the whole thing is interactive: filters filter, carts total up, forms validate. Switch between desktop, tablet and phone to see how the layout holds.',
    launch: 'Launch live demo',
    launchAria: 'Launch the {title} live demo — {tagline}',
  },

  demos: {
    saas: { sector: 'B2B SaaS', tagline: 'SaaS product landing' },
    restaurant: { sector: 'Hospitality', tagline: 'Restaurant & reservations' },
    ecommerce: { sector: 'Retail', tagline: 'E-commerce storefront' },
    agency: { sector: 'Creative', tagline: 'Creative studio' },
  },

  overlay: {
    deviceGroup: 'Preview at device size',
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
    newTab: 'New tab',
    newTabAria: 'Open demo in a new tab',
    close: 'Close demo',
    hintMobile: 'Real site — tap and scroll inside it',
    hintDesktop:
      'This is the real site running in a frame — click, scroll and type in it. Press Esc to close.',
    loading: 'Loading {title} demo…',
  },

  process: {
    eyebrow: 'How it works',
    titleLead: 'A process built to',
    titleMid: 'remove',
    titleAccent: 'surprises',
    lead: 'Fixed scope, visible progress, and nothing hidden until a big reveal at the end. You watch the site come together as it is built.',
    steps: [
      {
        title: 'Conversation',
        body: 'We talk about what the site needs to do — not what it should look like. Goals, audience, and what actually counts as success.',
        meta: 'Day 1',
      },
      {
        title: 'Structure',
        body: 'Sitemap, content hierarchy and a design direction you sign off on before a single component gets built.',
        meta: 'Days 2–4',
      },
      {
        title: 'Build',
        body: 'Design and development happen together, in the browser, on real devices. You get a live staging link from day one.',
        meta: 'Weeks 1–3',
      },
      {
        title: 'Launch',
        body: 'Performance and accessibility pass, analytics wired, deployed. Then a handover so you can run it yourself.',
        meta: 'Week 4',
      },
    ],
  },

  about: {
    eyebrow: 'About',
    titleLead: 'I build the web the way',
    titleMid: 'it was',
    titleAccent: 'supposed',
    titleTail: 'to work',
    lead: 'Fast, accessible, and pleasant to use on whatever device someone happens to be holding.',
    statement: 'Most sites look fine in a screenshot and fall apart in the hand.',
    body1:
      'I care about the part that comes after the screenshot — how fast it loads on a mid-range phone, whether you can tab through it, whether the animation still feels good the tenth time you see it.',
    body2:
      'I work with founders and small teams who need a site that does a job — not a template with a logo dropped into it. The four demos above are mine, built from scratch, and they are the honest sample of how I work.',
    codeComment: '// ships with every build, not as an upsell',
    traits: [
      {
        label: 'Performance first',
        value:
          'Transform-only animation, route-level code splitting, images optimised at build time.',
      },
      {
        label: 'Accessible by default',
        value: 'Not a retrofit. Contrast, focus order and semantics land in the first commit.',
      },
      {
        label: 'Built to hand over',
        value: 'Clean structure and real documentation, so you are never locked in to me.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    titleLead: 'Tell me what',
    titleMid: "you're",
    titleAccent: 'building',
    lead: 'A few quick questions so I can give you a useful answer instead of a generic one. I reply to everything, usually within a day.',
    directLabel: 'Direct',
    directBody: 'Skip the form entirely. Same inbox, same reply time.',
    nextLabel: 'What happens next',
    nextSteps: [
      'I read it properly and reply within a day.',
      'If it looks like a fit, a short call — no pitch deck.',
      'A fixed quote and timeline before anything starts.',
    ],
    elsewhereLabel: 'Elsewhere',
  },

  form: {
    stepOf: 'Step {current} of {total}',
    progressLabel: 'Form progress',
    legends: ['What do you need?', 'Tell me about it', 'How do I reach you?'],
    projectTypeLabel: 'What kind of project?',
    budgetLabel: 'Rough budget',
    timelineLabel: 'Timeline',
    projectTypes: ['Marketing site', 'Web app', 'E-commerce', 'Redesign', 'Something else'],
    budgets: ['Under €500', '€500 – €1,200', '€1,200 – €2,500', '€2,500+', 'Not sure yet'],
    // Stored in sentence case; the chips apply `uppercase` in CSS. Keeping the
    // source readable means the same strings can be reused in the email body
    // and the review step without shouting.
    timelines: ['ASAP', '1–2 weeks', '3–4 weeks', '1+ month', 'Just exploring'],
    messageLabel: 'What are you trying to build?',
    messageHelp: "What the site is for, who it's for, and anything you already know you want.",
    messagePlaceholder:
      "We're launching a booking tool for small clinics and need a marketing site that explains it clearly…",
    nameLabel: 'Your name',
    emailLabel: 'Email',
    reviewProject: 'Project',
    reviewBudget: 'Budget',
    reviewTimeline: 'Timeline',
    back: 'Back',
    continue: 'Continue',
    send: 'Send message',
    sending: 'Sending…',
    takesAMinute: 'Takes about a minute.',
    sentTitle: 'Message sent',
    sentBody: "Thanks {name} — I'll get back to you at {email}, usually within a day.",
    sendAnother: 'Send another',
    errorSummary: '{count} things need your attention',
    errors: {
      projectType: 'Pick the option closest to your project.',
      budget: 'Choose a range — an estimate is fine.',
      timeline: 'Let me know roughly when you need this.',
      messageEmpty: 'Add a few lines about what you have in mind.',
      messageShort: 'A little more detail helps — {n} more characters.',
      name: 'Enter your name so I know who I am replying to.',
      emailEmpty: 'Enter an email address so I can reply.',
      emailInvalid: 'That does not look like a valid email — check for a typo.',
    },
    failGeneric: 'The message could not be delivered right now.',
    failNetwork: 'Could not reach the server — check your connection.',
    failSuffix: 'Email me directly at',
  },

  footer: {
    email: 'Email',
    backToTop: 'Back to top',
    note: 'The demos are real builds, not templates',
  },

  a11y: {
    skipToContent: 'Skip to content',
  },
};
// Deliberately no `as const` above. It would infer every value as a string
// *literal* type, so `Dictionary` would demand Serbian say "Work" rather than
// any string — every translation becomes a type error. Widening to `string`
// still catches the failure that matters: a missing or misspelled key.

/** Serbian must match the English shape exactly. */
export type Dictionary = typeof en;

const sr: Dictionary = {
  nav: {
    work: 'Radovi',
    process: 'Proces',
    about: 'O meni',
    contact: 'Kontakt',
    cta: 'Započni projekat',
    openMenu: 'Otvori meni',
    closeMenu: 'Zatvori meni',
    switchLanguage: 'Promeni jezik',
  },

  hero: {
    available: 'Dostupan za nove projekte',
    location: 'Novi Sad, RS',
    independent: 'Samostalno',
    // "visokih performansi" would be 19 characters on one line and overflow the
    // measured column, so the desktop headline is split differently in Serbian.
    linesDesktop: ['Moderni', 'veb sajtovi', 'visokih', 'performansi'],
    // Phone: max 7 characters per line, same rule as the English variant.
    linesMobile: ['Moderni', 'brzi', 'sajtovi'],
    headline: 'Moderni veb sajtovi visokih performansi',
    leadMobile:
      'Pravim brze i pristupačne sajtove koji rade na stvarnim uređajima. Sve ispod je uživo — dodirnite bilo koji projekat i probajte ga sami.',
    leadDesktop:
      'Pravim brze i pristupačne interfejse koji rade na stvarnim uređajima. Sve ispod je uživo. Kliknite na bilo koji projekat i probajte ga sami.',
    ctaPrimary: 'Probaj demo uživo',
    ctaSecondary: 'Započni projekat',
    buildsCount: 'Četiri sajta uživo',
    scrollToWork: 'Pređi na radove',
    scrollShort: 'Radovi',
  },

  proof: {
    heading: 'Ukratko',
    stats: [
      'Interaktivnih demoa uživo',
      'Dostupno sa tastature',
      'WCAG kontrast, izmeren',
      'Uobičajeno vreme odgovora',
    ],
  },

  work: {
    eyebrow: 'Izabrani radovi',
    titleLead: 'Pogledajte kako',
    titleMid: 'vaš budući sajt',
    titleAccent: 'može da izgleda',
    lead: 'Svaki od ovih primera je potpuno funkcionalan sajt, a ne statična slika. Isprobajte interaktivne elemente — filtere, korpu i forme — i prebacujte između računara i telefona da vidite kako se dizajn prilagođava.',
    launch: 'Pokreni demo',
    launchAria: 'Pokreni demo za {title} — {tagline}',
  },

  demos: {
    saas: { sector: 'B2B SaaS', tagline: 'Landing za SaaS proizvod' },
    restaurant: { sector: 'Ugostiteljstvo', tagline: 'Restoran i rezervacije' },
    ecommerce: { sector: 'Maloprodaja', tagline: 'Online prodavnica' },
    agency: { sector: 'Kreativa', tagline: 'Kreativni studio' },
  },

  overlay: {
    deviceGroup: 'Prikaz po veličini uređaja',
    desktop: 'Računar',
    tablet: 'Tablet',
    mobile: 'Telefon',
    newTab: 'Novi tab',
    newTabAria: 'Otvori demo u novom tabu',
    close: 'Zatvori demo',
    hintMobile: 'Pravi sajt — dodirujte i skrolujte unutar njega',
    hintDesktop:
      'Ovo je pravi sajt koji radi u okviru — kliknite, skrolujte i kucajte u njemu. Pritisnite Esc za zatvaranje.',
    loading: 'Učitavanje demoa {title}…',
  },

  process: {
    eyebrow: 'Kako to ide',
    titleLead: 'Proces napravljen da',
    titleMid: 'ukloni',
    titleAccent: 'iznenađenja',
    lead: 'Jasan obim, vidljiv napredak i ništa skriveno do velikog otkrivanja na kraju. Gledate kako sajt nastaje dok se gradi.',
    steps: [
      {
        title: 'Razgovor',
        body: 'Pričamo o tome šta sajt treba da radi — ne kako treba da izgleda. Ciljevi, publika i šta se zaista računa kao uspeh.',
        meta: '1. dan',
      },
      {
        title: 'Struktura',
        body: 'Mapa sajta, hijerarhija sadržaja i pravac dizajna koji odobravate pre nego što se izradi ijedna komponenta.',
        meta: '2–4. dan',
      },
      {
        title: 'Izrada',
        body: 'Dizajn i razvoj teku zajedno, u pregledaču, na stvarnim uređajima. Link za pregled uživo dobijate od prvog dana.',
        meta: '1–3. nedelja',
      },
      {
        title: 'Lansiranje',
        body: 'Provera brzine i pristupačnosti, analitika povezana, sajt objavljen. Zatim primopredaja da možete sami da ga vodite.',
        meta: '4. nedelja',
      },
    ],
  },

  about: {
    eyebrow: 'O meni',
    titleLead: 'Pravim veb onako kako',
    titleMid: 'je i',
    titleAccent: 'trebalo',
    titleTail: 'da radi',
    lead: 'Brzo, pristupačno i prijatno za korišćenje na bilo kom uređaju koji je nekome pri ruci.',
    statement: 'Većina sajtova izgleda dobro na slici, a raspada se u ruci.',
    body1:
      'Stalo mi je do onoga što dolazi posle vašeg zahteva — koliko brzo se učitava na prosečnom telefonu, možete li da prođete kroz njega tasterom Tab, da li animacija i deseti put deluje dobro.',
    body2:
      'Radim sa osnivačima i malim timovima kojima treba sajt koji obavlja posao — a ne šablon sa ubačenim logotipom. Četiri demoa iznad su moja, napravljena od nule, i pošten su uzorak toga kako radim.',
    codeComment: '// dolazi uz svaki sajt, ne kao dodatna usluga',
    traits: [
      {
        label: 'Brzina na prvom mestu',
        value:
          'Animacija samo preko transformacija, deljenje koda po rutama, slike optimizovane pri izradi.',
      },
      {
        label: 'Pristupačnost podrazumevano',
        value:
          'Nije naknadna popravka. Kontrast, redosled fokusa i semantika ulaze u prvi commit.',
      },
      {
        label: 'Napravljeno za predaju',
        value: 'Čista struktura i prava dokumentacija, tako da nikada ne zavisite od mene.',
      },
    ],
  },

  contact: {
    eyebrow: 'Kontakt',
    titleLead: 'Recite mi šta',
    titleMid: 'to',
    titleAccent: 'gradite',
    lead: 'Nekoliko kratkih pitanja da bih mogao da vam dam koristan odgovor umesto uopštenog. Odgovaram na sve, obično u roku od jednog dana.',
    directLabel: 'Direktno',
    directBody: 'Preskočite formu u potpunosti. Isto sanduče, isto vreme odgovora.',
    nextLabel: 'Šta sledi',
    nextSteps: [
      'Pažljivo pročitam i odgovorim u roku od jednog dana.',
      'Ako deluje kao dobar spoj, kratak poziv — bez prezentacija.',
      'Fiksna ponuda i rokovi pre nego što bilo šta počne.',
    ],
    elsewhereLabel: 'Drugde',
  },

  form: {
    stepOf: 'Korak {current} od {total}',
    progressLabel: 'Napredak forme',
    legends: ['Šta vam treba?', 'Recite mi više', 'Kako da vas kontaktiram?'],
    projectTypeLabel: 'Kakav projekat?',
    budgetLabel: 'Okvirni budžet',
    timelineLabel: 'Rokovi',
    projectTypes: ['Prezentacioni sajt', 'Veb aplikacija', 'Online prodavnica', 'Redizajn', 'Nešto drugo'],
    // Serbian number convention: dot as the thousands separator, € after the
    // amount. The English list above uses the comma/prefix form instead.
    budgets: ['Do 500 €', '500 € – 1.200 €', '1.200 € – 2.500 €', 'Preko 2.500 €', 'Još ne znam'],
    timelines: ['Što pre', '1–2 nedelje', '3–4 nedelje', 'Preko mesec dana', 'Samo istražujem'],
    messageLabel: 'Šta pokušavate da napravite?',
    messageHelp: 'Čemu sajt služi, kome je namenjen i šta već znate da želite.',
    messagePlaceholder:
      'Lansiramo alat za zakazivanje za male klinike i treba nam sajt koji to jasno objašnjava…',
    nameLabel: 'Vaše ime',
    emailLabel: 'Email',
    reviewProject: 'Projekat',
    reviewBudget: 'Budžet',
    reviewTimeline: 'Rokovi',
    back: 'Nazad',
    continue: 'Dalje',
    send: 'Pošalji poruku',
    sending: 'Slanje…',
    takesAMinute: 'Traje oko minut.',
    sentTitle: 'Poruka poslata',
    sentBody: 'Hvala {name} — javljam se na {email}, obično u roku od jednog dana.',
    sendAnother: 'Pošalji još jednu',
    errorSummary: 'Potrebno je ispraviti {count} stvari',
    errors: {
      projectType: 'Izaberite opciju koja najbolje opisuje vaš projekat.',
      budget: 'Izaberite okvir — procena je sasvim u redu.',
      timeline: 'Recite mi otprilike kada vam ovo treba.',
      messageEmpty: 'Napišite nekoliko rečenica o tome šta imate na umu.',
      messageShort: 'Malo više detalja pomaže — još {n} karaktera.',
      name: 'Unesite ime da znam kome odgovaram.',
      emailEmpty: 'Unesite email adresu da bih mogao da odgovorim.',
      emailInvalid: 'Ovo ne izgleda kao ispravna email adresa — proverite grešku u kucanju.',
    },
    failGeneric: 'Poruka trenutno ne može da se isporuči.',
    failNetwork: 'Server nije dostupan — proverite internet konekciju.',
    failSuffix: 'Pišite mi direktno na',
  },

  footer: {
    email: 'Email',
    backToTop: 'Nazad na vrh',
    note: 'Demoi su pravi sajtovi, ne šabloni',
  },

  a11y: {
    skipToContent: 'Pređi na sadržaj',
  },
};

export const translations: Record<Locale, Dictionary> = { en, sr };

/** Fills {placeholders} in a string: t('stepOf', { current: 1, total: 3 }). */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}
