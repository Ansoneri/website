#!/usr/bin/env python3
"""Build the English home page (en/index.html) from the Latvian index.html.

    python3 tools/build_en.py

How it works
- TABLE below holds exact Latvian substrings of index.html and their English text. They are applied
  longest first (a stable sort by length), so a short entry never clobbers part of a longer one.
  Every entry replaces all of its occurrences. Where a short word means different things in
  different places, the entry carries its context (">Plāns<", '"Plāns"').
- If an entry is no longer found when its turn comes, the build stops with a non-zero exit and lists
  those entries: someone changed the Latvian copy, so the English needs the same change.
- Relative URLs are rewritten for the /en/ folder (assets/... -> ../assets/..., profils.html ->
  ../profils.html?lang=en). External links stay as they are.
- Afterwards the output is scanned for Latvian left in what a visitor sees or hears (text, alt,
  aria-label, title, placeholder, meta content, data-t/data-d and JS string literals). CSS and code
  comments are not scanned. Leftovers are printed with their line numbers and the exit code is 1.

Rules for the English (see CLAUDE.md): Kristers's voice, "you" and "I", short hyphens (never em
dashes), no exclamation marks, no emoji, no psychologist/therapy words, never "PhD" as a title.
"""
import html
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "index.html")
OUT = os.path.join(ROOT, "en", "index.html")

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">'

# (Latvian exact substring, English). Order here is by page section; the build sorts by length.
TABLE = [
    # ---- head ----
    ('<html lang="lv">', '<html lang="en">'),
    ("Kristers Ansons - fitnesa un mentālās veiktspējas treneris", "Kristers Ansons - fitness and mental performance coach"),
    ("Personīgs fitnesa un mentālās veiktspējas treneris Rīgā un tiešsaistē. IRONMAN, HYROX un sporta zinātne vienā metodē. Sāc ar bezmaksas profilu.",
     "Personal fitness and mental performance coach in Riga and online. IRONMAN, HYROX and sport science in one method. Start with a free profile."),
    ('<link rel="canonical" href="https://ansoneri.com/">', '<link rel="canonical" href="https://ansoneri.com/en/">'),
    ('<meta property="og:locale" content="lv_LV">', '<meta property="og:locale" content="en_GB">\n<meta property="og:locale:alternate" content="lv_LV">'),
    ('<meta property="og:url" content="https://ansoneri.com/">', '<meta property="og:url" content="https://ansoneri.com/en/">'),

    # ---- header ----
    ('aria-label="Galvenā navigācija"', 'aria-label="Main navigation"'),
    ('aria-label="Kristers Ansons - sākums"', 'aria-label="Kristers Ansons - home"'),
    ('<a href="#elites-fitness">Veiktspēja</a>', '<a href="#elites-fitness">Performance</a>'),
    ('<a href="#tavs-profils">Profils</a>', '<a href="#tavs-profils">Profile</a>'),
    ('<a href="#pieredze">Metode</a>', '<a href="#pieredze">Method</a>'),
    ('<a href="#darbs">Sadarbība</a>', '<a href="#darbs">Process</a>'),
    ('<a href="#mentor">Piedāvājums</a>', '<a href="#mentor">Offer</a>'),
    (">Klienti<", ">Clients<"),
    ("Sākt sadarbību", "Work with me"),
    ('<a class="nav__lang" href="en/" hreflang="en" lang="en" aria-label="English">EN</a>',
     '<a class="nav__lang" href="../" hreflang="lv" lang="lv" aria-label="Latviski">LV</a>'),

    # ---- hero ----
    ('aria-label="Kristers treniņā"', 'aria-label="Kristers training"'),
    ("Fitnesa un mentālās veiktspējas treneris", "Fitness and mental performance coach"),
    ("Cik tālu tu esi<br>no savas<br>labākās formas?", "How far are you<br>from your<br>best shape?"),
    ("Uzzini zemāk - 5 jautājumi, 1 minūte", "Find out below - 5 questions, 1 min"),

    # ---- performance map ----
    ('aria-label="Pilna veiktspēja"', 'aria-label="Full performance"'),
    ("<b>Augstākā līmeņa fitness nav tikai izskats.</b> Tas ir daudzu īpašību un rīcību kopums, kurā <em>ķermenis un prāts</em> strādā tev par labu.",
     "<b>Top-level fitness is not just about looks.</b> It is a whole set of qualities and habits, where <em>body and mind</em> work in your favour."),
    ("<strong>Pilna<br>veiktspēja</strong>", "<strong>Full<br>performance</strong>"),
    ("Ķermenis, kas spēj", "A capable body"),
    ("Tu vari skriet, lēkt, nest un celt bez bailēm savainoties. Kāpnes, kalni un sacensības ir prieks, nevis pārbaudījums.",
     "You can run, jump, carry and lift without fear of getting hurt. Stairs, hills and races are a joy, not a test."),
    (">Spēks<", ">Strength<"),
    ("Enerģija visu dienu", "Energy all day"),
    ("Tu pamosties izgulējies, pēcpusdienā nesabrūc, un ēdiens dod spēku, nevis vainas sajūtu.",
     "You wake up rested, you don't crash in the afternoon, and food gives you energy, not guilt."),
    (">Enerģija<", ">Energy<"),
    ("Ātri atjaunojies", "You recover fast"),
    ("Pēc smagas nedēļas tu atjaunojies dažās dienās. Miegs ir dziļš, un sāpes nav ikdiena.",
     "After a hard week you recover in a few days. Your sleep is deep, and pain is not part of every day."),
    (">Atjaunošanās<", ">Recovery<"),
    ("Miers spiedienā", "Calm under pressure"),
    ("Kad kļūst grūti, tu paliec mierīgs un domā skaidri. Stress tevi nevada.",
     "When it gets hard, you stay calm and think clearly. Stress does not run you."),
    (">Miers<", ">Calm<"),
    ("Tu zini, kur esi", "You know where you stand"),
    ("Tu zini savu spēku, izturību un to, kas jāuzlabo tālāk. Progresu redzi skaitļos, nevis min.",
     "You know your strength, your endurance and what to improve next. You see progress in numbers, not guesses."),
    (">Skaidrība<", ">Clarity<"),
    ("Tu zini, uz ko ej", "You know where you are going"),
    ("Tev ir mērķis un ritms, ko noturi arī tad, kad motivācija pazūd.",
     "You have a goal and a rhythm you keep even when motivation fades."),
    (">Virziens<", ">Direction<"),
    ("Cilvēki ap tevi", "People around you"),
    ("Tev apkārt ir cilvēki, kas iet tajā pašā virzienā un velk tevi uz augšu.",
     "You are surrounded by people who are heading the same way and pull you up."),
    (">Cilvēki<", ">People<"),

    # ---- quick profile ----
    ('aria-label="Tavs profils"', 'aria-label="Your profile"'),
    ("Noskaidro savu potenciālu.", "Find out your potential."),
    ("Atbildi godīgi, un profils parādīs, <em>cik daudz veiktspējas tu vēl atstāj neizmantotas</em> un ar ko sākt.",
     "Answer honestly, and the profile will show <em>how much performance you are still leaving unused</em> and where to start."),
    ("5 jautājumi · 1 minūte · bez reģistrācijas", "5 questions · 1 minute · no sign-up"),
    ('aria-label="Ātrais profils"', 'aria-label="Quick profile"'),
    ("Cik regulārs ir tavs treniņu plāns?<small>Pēdējā mēneša laikā</small>", "How regular is your training?<small>Over the last month</small>"),
    ("<span>1 · Bez plāna</span><span>5 · Ik nedēļu pēc plāna</span>", "<span>1 · No plan</span><span>5 · Every week, to a plan</span>"),
    ("Cik stipri stress ietekmē tavu dzīvi?<small>Darbs, ģimene, nauda, viss kopā</small>", "How much does stress affect your life?<small>Work, family, money, all of it</small>"),
    ("<span>1 · Gandrīz nemaz</span><span>5 · Ļoti stipri</span>", "<span>1 · Hardly at all</span><span>5 · Very much</span>"),
    ("Cik kvalitatīvi tu guli?<small>Vai pamosties atpūties?</small>", "How well do you sleep?<small>Do you wake up rested?</small>"),
    ("<span>1 · Slikti</span><span>5 · Izcili</span>", "<span>1 · Poorly</span><span>5 · Very well</span>"),
    ("Cik motivēts tu esi trenēties?<small>Šobrīd, ne ideālajā nedēļā</small>", "How motivated are you to train?<small>Right now, not in an ideal week</small>"),
    ("<span>1 · Nav motivācijas</span><span>5 · Pilnīgi</span>", "<span>1 · No motivation</span><span>5 · Fully</span>"),
    ("Kā tu vērtē savu veselību kopumā?<small>Tava paša vērtējums</small>", "How would you rate your health overall?<small>Your own rating</small>"),
    ("<span>1 · Slikta</span><span>5 · Izcila</span>", "<span>1 · Poor</span><span>5 · Excellent</span>"),
    ("Tava ātrā atbilde", "Your quick result"),
    ("Visvairāk vari iegūt šeit", "Your biggest gain is here"),
    ("Tava stiprā puse", "Your strong side"),
    ("Gribi vairāk?", "Want more?"),
    ("Pilnais profils", "Full profile"),
    ("10 minūtes · detalizēta atskaite ar tavām prioritātēm", "10 minutes · a detailed report with your priorities"),
    ("Vēlies sakārtot šīs lietas?", "Want to sort this out?"),
    ('rel="noopener">Sazināmies</a><small>Atstāj kontaktus, es sazināšos</small>', 'rel="noopener">Let\'s talk</a><small>Leave your contacts and I will get back to you</small>'),
    ("Iegūsti pilno profilu", "Get the full profile"),
    ("Trenera atgriezeniskā saite pēc tavām atbildēm, nevis medicīnisks vai psiholoģisks novērtējums.",
     "A coach's feedback on your answers, not a medical or psychological assessment."),
    # quick profile script: the five keys are also the bar labels, so they change everywhere at once
    ('"Treniņi"', '"Training"'),
    ('"Miers"', '"Calm"'),
    ("Miers: [", "Calm: ["),
    ('"Miegs"', '"Sleep"'),
    ("Miegs: [", "Sleep: ["),
    ('"Motivācija"', '"Motivation"'),
    ('"Veselība"', '"Health"'),
    ("Plāns, kas iederas tavā nedēļā. Regulāri 3 treniņi dod vairāk nekā perfekts plāns, ko neizpildi.",
     "A plan that fits your week. 3 regular sessions give you more than a perfect plan you don't follow."),
    ("Stresa slodze. Plānam jāpielāgojas smagām nedēļām, un atjaunošanās rituāli jāieliek kalendārā.",
     "Stress load. Your plan has to adapt to hard weeks, and recovery rituals go into your calendar."),
    ("Miegs. Tas nosaka, cik daudz no treniņa ķermenis spēj pārvērst progresā. Sāc ar regulāru gulētiešanas laiku.",
     "Sleep. It decides how much of your training your body can turn into progress. Start with a regular bedtime."),
    ("Iemesls trenēties. Mērķis, kas ir tavs, un mazi, izmērāmi soļi, kas rāda progresu.",
     "A reason to train. A goal that is yours, and small, measurable steps that show progress."),
    ("Veselības pamats. Pirms slodzes kāpināšanas jāsaprot, kas tevi ierobežo.",
     "Your health comes first. Before we raise the load, we need to understand what limits you."),
    ("Regularitāte. Tu jau proti noturēt ritmu.", "Consistency. You already know how to keep a rhythm."),
    ("Stresa noturība. Tev ir rezerve slodzes kāpināšanai.", "Stress resilience. You have room to raise the load."),
    ("Miegs. Atjaunošanās pamats jau strādā.", "Sleep. The base of your recovery already works."),
    ("Motivācija. Dzinējs jau ir, vajag virzienu.", "Motivation. The drive is there, it needs a direction."),
    ("Veselība. Labs sākumpunkts progresam.", "Health. A good starting point for progress."),
    ("Vispirms veselība", "Health first"),
    ("Pirms plāna jāsaprot, kas tevi ierobežo. Novērtējums sāksies ar sarunu par veselību, un, ja vajag, ar ārsta vai fizioterapeita pārbaudi.",
     "Before the plan, we need to understand what limits you. The assessment starts with a conversation about your health and, if needed, a check with a doctor or physiotherapist."),
    ("Gatavs nākamajam līmenim", "Ready for the next level"),
    ("Pamats ir stabils. Nākamais progress nāks no testiem un precīza plāna, nevis no vairāk darba.",
     "Your base is solid. The next progress will come from testing and a precise plan, not from more work."),
    ("Augsta slodze, maza rezerve", "High load, little reserve"),
    ("Tu trenējies regulāri, bet atjaunošanās neiet līdzi. Risks ir stagnācija vai pārslodze, nevis slinkums.",
     "You train regularly, but your recovery is not keeping up. The risk is stagnation or overload, not laziness."),
    ("Motivācija bez sistēmas", "Motivation without a system"),
    ("Gribēšanas pietiek. Trūkst plāna, kas iederas nedēļā un rāda progresu.",
     "The will is there. What is missing is a plan that fits your week and shows progress."),
    ("Sistēma bez dzirksteles", "A system without a spark"),
    ("Ritms ir, bet dzinējs sāk izdegt. Vajag mērķi, kas ir tavs, un redzamu progresu.",
     "The rhythm is there, but the drive is starting to burn out. You need a goal that is yours and progress you can see."),
    ('"Restarts"', '"Restart"'),
    ("Labākais sākums ir mazs un regulārs. Pirmās 4 nedēļas būvējam ieradumu, ne rekordus.",
     "The best start is small and regular. In the first 4 weeks we build a habit, not records."),
    ("Pamats bez atjaunošanās", "A base without recovery"),
    ("Miegs ir vājākais posms. Bez tā treniņš dod mazāk, nekā varētu.",
     "Sleep is the weakest link. Without it, training gives you less than it could."),
    ("Augsta spriedze", "High tension"),
    ("Stress ēd to pašu rezervi, ko treniņš. Plānam jābūt elastīgam.",
     "Stress eats into the same reserve as training. Your plan has to be flexible."),
    ("Sistēma bez pamata", "A system without a base"),
    ("Viss pārējais ir vietā. Trūkst regulāra treniņu ritma.",
     "Everything else is in place. What is missing is a regular training rhythm."),
    ("Dzinējs gaida dzirksteli", "The engine is waiting for a spark"),
    ("Pirmais solis ir atrast iemeslu, kas ir tavs, nevis kāda cita.",
     "The first step is to find a reason that is yours, not someone else's."),
    ("Pirms slodzes kāpināšanas jāsaprot, kas tevi ierobežo.", "Before we raise the load, we need to understand what limits you."),
    ("Testi. Tie parādīs, kur ir nākamie 5 %.", "Tests. They will show where your next 5% is."),
    ("Vēl nav. Tas ir labs sākumpunkts, ne spriedums.", "Not yet. That is a good starting point, not a verdict."),

    # ---- second question ----
    ("Pro atlēta rezultāti bez pro atlēta grafika.", "Pro athlete results without a pro athlete schedule."),
    ("Fitnesa sistēma, kas ietaupīs laiku.", "A fitness system that saves you time."),

    # ---- how my method came about ----
    ("Kā tapusi mana metode", "How my method was built"),
    ("Izglītība, sports un darbs ar cilvēkiem.", "Education, sport and working with people."),
    ('alt="Kristers izlaidumā Rīgas Stradiņa universitātē"', 'alt="Kristers at his graduation, Riga Stradins University"'),
    ('alt="Kristers skrien sacensībās kopā ar draugu"', 'alt="Kristers running a race with a friend"'),
    ('<h3 class="ds__t">Izglītība</h3>', '<h3 class="ds__t">Education</h3>'),
    ("<p class=\"ds__l\">sporta zinātnē</p>", "<p class=\"ds__l\">in sport science</p>"),
    ("Psiholoģiskā sagatavošana.", "Mental preparation."),
    ("Riteņbraukšanas treneris, sporta skolotājs.", "Cycling coach, PE teacher."),
    ("jaunais pētnieks", "junior researcher"),
    ("Ceļš uz doktorantūru.", "On the path to a doctorate."),
    (">Pētniecība<", ">Research<"),
    ("starptautiski projekti", "international projects"),
    ("Sport-IE: Latvija, Lietuva, Taivāna.", "Sport-IE: Latvia, Lithuania, Taiwan."),
    ('alt="Kristers ar paceltām rokām uzvar kritēriju Rīgas velomaratonā 2024"', 'alt="Kristers, arms raised, wins the criterium at the Riga cycling marathon 2024"'),
    ('alt="Kristers uz HYROX Riga pjedestāla"', 'alt="Kristers on the HYROX Riga podium"'),
    ('alt="Kristers finišē IRONMAN Tallinn"', 'alt="Kristers finishing IRONMAN Tallinn"'),
    ('<h3 class="ds__t">Sports</h3>', '<h3 class="ds__t">Sport</h3>'),
    (">Riteņbraukšana<", ">Cycling<"),
    ("6 gadi profesionāli", "6 years as a professional"),
    ("2018-2024 · LČ kritērijā 1. vieta, 2024", "2018-2024 · Latvian criterium champion, 2024"),
    ("finiša laiks 1:12", "finish time 1:12"),
    ("Rīga 2026, Men Pro", "Riga 2026, Men Pro"),
    ("finiša laiks 10:50", "finish time 10:50"),
    ("Tallina 2026", "Tallinn 2026"),
    ("funkcionalitāte, muskuļi, lokanība", "function, muscle, mobility"),
    ('alt="Kristers ar klientu sporta zālē"', 'alt="Kristers with a client in the gym"'),
    ('alt="Kristers ar klientu āra treniņā"', 'alt="Kristers with a client at an outdoor session"'),
    ('alt="Kristers ar klientu"', 'alt="Kristers with a client"'),
    ('<p class="ds__l">klienti</p>', '<p class="ds__l">clients</p>'),
    (">Starptautiski<", ">International<"),
    ("Rīga, Indija, Nīderlande", "Riga, India, the Netherlands"),
    (">Individuāli<", ">Individual<"),
    ("personīga pieeja, 1:1 treniņi", "a personal approach, 1:1 sessions"),
    ("1 reize", "1 session"),
    ('"12 ned."', '"12 weeks"'),
    ('"Gadi"', '"Years"'),
    ('"1 - Gadi"', '"1 - Years"'),
    ("sadarbības ilgums", "how long we work together"),
    ("No vienas konsultācijas līdz vairākiem gadiem", "From one consultation to several years"),

    # ---- how we work ----
    ("Kā mēs strādājam", "How we work"),
    ("Četri soļi, kas atkārtojas, līdz sasniedz savu formu.", "Four steps that repeat until you reach your shape."),
    (">Novērtējums<", ">Assessment<"),
    ('"Novērtējums"', '"Assessment"'),
    (">Plāns<", ">Plan<"),
    ('"Plāns"', '"Plan"'),
    (">Darbs kopā<", ">Working together<"),
    ('"Darbs kopā"', '"Working together"'),
    (">Pielāgošana<", ">Adjusting<"),
    ('"Pielāgošana"', '"Adjusting"'),
    ("1.-2. nedēļa", "Weeks 1-2"),
    ("1. nedēļa", "Week 1"),
    ("Katru nedēļu", "Every week"),
    ("Ik 4 nedēļas", "Every 4 weeks"),
    ("Saruna, pilnais profils un testi. Sākam ar faktiem, nevis minējumiem.",
     "A conversation, the full profile and tests. We start with facts, not guesses."),
    ("Pēc 4. soļa cikls sākas no jauna, ar jaunu mērķi.", "After step 4 the cycle starts again, with a new goal."),
    ('alt="Kristers vēro klienta testu laboratorijā"', 'alt="Kristers watching a client\'s test in the lab"'),
    ("Saruna par mērķi un tavu īsto nedēļu", "A conversation about your goal and your real week"),
    ("Spēka, izturības un ķermeņa sastāva testi", "Strength, endurance and body composition tests"),
    ("Miegs, stress un motivācija", "Sleep, stress and motivation"),
    ("Es uzbūvēju plānu, kas iederas tavā dzīvē, nevis otrādi.", "I build a plan that fits your life, not the other way round."),
    ('alt="Kristers pie darba galda sastāda klienta plānu"', 'alt="Kristers at his desk, writing a client\'s plan"'),
    ("Treniņi pa dienām", "Training day by day"),
    ("Uzturs un atjaunošanās", "Nutrition and recovery"),
    ("Mentālie rīki grūtajām dienām", "Mental tools for the hard days"),
    ("Tu dari, es esmu blakus. Ja nedēļa neiet, plāns mainās tajā pašā nedēļā.",
     "You do the work, I am right beside you. If the week does not go to plan, the plan changes that same week."),
    ("Iknedēļas atskaite, 5 minūtes", "A weekly check-in, 5 minutes"),
    ("Saziņa darba dienās", "Contact on weekdays"),
    ("Es laicīgi pamanu, kad tev nesanāk", "I notice early when things are not working"),
    ("Mērām atkārtoti, un nākamo bloku veidojam no rezultātiem.", "We measure again and build the next block from the results."),
    ('alt="Darba galds, pie kura pārskatu rezultātus un pielāgoju plānu"', 'alt="The desk where I review results and adjust the plan"'),
    ("Atkārtoti testi", "Retests"),
    ("Pārskats: kas strādā un kas tālāk", "Review: what works and what comes next"),
    ("Pārskats: kas strādā", "Review: what works"),
    ("Nākamais mērķis", "The next goal"),
    ("<h3>Novērtē</h3>", "<h3>Assess</h3>"),
    ("<h3>Plāno</h3>", "<h3>Plan</h3>"),
    ("<h3>Dari</h3>", "<h3>Do</h3>"),
    ("<h3>Pielāgo</h3>", "<h3>Adjust</h3>"),
    # the older method section (hidden on the page, kept one-to-one)
    ("Četri soļi līdz izmērāmam progresam.", "Four steps to measurable progress."),
    ("Novērtējums: saruna, analīze, testi", "Assessment: conversation, analysis, tests"),
    ("Pilnais profils un pieteikums", "The full profile and application"),
    ("Es uzbūvēju tavu plānu", "I build your plan"),
    ("Treniņi pa nedēļām un dienām", "Training week by week, day by day"),
    ("Miegs un dienas ritms", "Sleep and daily rhythm"),
    ("Mentālās veiktspējas rīki", "Mental performance tools"),
    ('alt="Kristers skrien IRONMAN Tallinn finiša taisnē"', 'alt="Kristers on the final straight at IRONMAN Tallinn"'),
    ("Tu izpildi, es mentorēju", "You do the work, I mentor"),
    ("Mentālās veiktspējas atbalsts", "Mental performance support"),
    ("Palīdzība smagās nedēļās", "Help in hard weeks"),
    ('alt="Kristers šķērso IRONMAN Tallinn finiša līniju"', 'alt="Kristers crossing the IRONMAN Tallinn finish line"'),
    ("Testējam, pārbaudām, pielāgojam", "We test, check and adjust"),
    ("Plāna korekcija tajā pašā nedēļā", "Plan changes the same week"),
    ("Kontrolpunkti ik 4 nedēļas", "Checkpoints every 4 weeks"),

    # ---- offer ----
    ("<h2 class=\"sect\">Piedāvājums</h2>", "<h2 class=\"sect\">Offer</h2>"),
    ("No pirmā soļa līdz pilnai sistēmai.", "From the first step to the full system."),
    ('aria-label="Patstāvīgais plāns vai mentorship"', 'aria-label="Self-guided plan or mentorship"'),
    ("<h3>Patstāvīgais plāns</h3>", "<h3>Self-guided plan</h3>"),
    ("<small>vienreiz</small>", "<small>one-off</small>"),
    ("Sākuma plāns patstāvīgai lietošanai. Es to izveidoju, tu seko pats.",
     "A starting plan to use on your own. I build it, you follow it yourself."),
    ("Sākuma saruna un tavs profils", "A first conversation and your profile"),
    ("Treniņu plāns un uztura vadlīnijas", "Training plan and nutrition guidelines"),
    ("Ja dzīvē kaut kas mainās, plāns jāveido no jauna", "If something changes in your life, the plan has to be made again"),
    ("Pasūtīt plānu", "Order the plan"),
    ("Ātrākais rezultāts", "Fastest results"),
    ('<p class="o-per">mēnesī</p>', '<p class="o-per">per month</p>'),
    ("Personīgi veidots plāns, ko realizējam kopā. Es esmu blakus katru nedēļu, un viss nepieciešamais ir iekļauts.",
     "A personally built plan that we carry out together. I am with you every week, and everything you need is included."),
    ("4 konsultācijas mēnesī", "4 consultations a month"),
    ("Plāns pielāgots katru nedēļu", "Plan adjusted every week"),
    ("Iknedēļas atskaite: es laicīgi pamanu, kad tev nesanāk", "Weekly check-in: I notice early when things are not working"),
    ("Regulāra testēšana un progresa salīdzināšana", "Regular testing and progress comparison"),
    ("Treniņu, uztura un dzīvesveida plāns", "Training, nutrition and lifestyle plan"),
    ("Vērtīgi uzziņas materiāli, kas paliek tev", "Valuable reference materials that stay with you"),
    ("Pieteikties", "Apply"),
    ("vai sāc ar bezmaksas profilu", "or start with the free profile"),
    (">Konsultācija<", ">Consultation<"),
    ("<small>stundā</small>", "<small>per hour</small>"),
    ("Viena saruna par tavu jautājumu.", "One conversation about your question."),
    ("Klātienē Rīgā vai tiešsaistē", "In person in Riga or online"),
    ("Atbildes uz taviem jautājumiem", "Answers to your questions"),
    ("Skaidrs nākamais solis", "A clear next step"),
    ("Pieteikt konsultāciju", "Book a consultation"),
    # comparison
    ("Ko izvēlēties?", "Which one to choose?"),
    ('rowheader">Cena<', 'rowheader">Price<'),
    ("<span>50 € stundā</span><span>150 € vienreiz</span><span>300 € mēnesī</span>",
     "<span>50 € per hour</span><span>150 € one-off</span><span>300 € per month</span>"),
    ("Konsultāciju skaits", "Consultations"),
    ("<span>1 sākumā</span><span>4 mēnesī</span>", "<span>1 at the start</span><span>4 a month</span>"),
    ("Ko saņem", "What you get"),
    ("Atbildes un nākamo soli", "Answers and the next step"),
    ("Treniņu plānu un uztura vadlīnijas", "A training plan and nutrition guidelines"),
    ("Plānu, uzturu, atjaunošanos un visus materiālus", "Plan, nutrition, recovery and all materials"),
    ("Kad dzīve mainās", "When life changes"),
    ("Jauna konsultācija", "A new consultation"),
    ("Plāns jāveido no jauna", "The plan has to be made again"),
    ("Pielāgoju tajā pašā nedēļā", "I adjust it the same week"),
    ("Kas pamana, ja nesanāk", "Who notices when things slip"),
    ("<span>Tu pats</span><span>Tu pats</span><span>Es</span>", "<span>You</span><span>You</span><span>Me</span>"),
    ("Progresa mērījumi", "Progress measurements"),
    ("<span>Sākumā</span><span>Regulāri</span>", "<span>At the start</span><span>Regularly</span>"),
    ('rowheader">Der, ja<', 'rowheader">Right for you if<'),
    ("Ir viens konkrēts jautājums", "You have one specific question"),
    ("Proti noturēt ritmu pats", "You can keep the rhythm yourself"),
    ("Gribi treneri blakus un plānu, kas mainās līdz ar tevi", "You want a coach beside you and a plan that changes with you"),
    ("Pētījumā tie, kas trenējās ar treneri blakus, kāpināja slodzi ātrāk un ieguva vairāk spēka nekā tie, kas to pašu programmu pildīja paši (",
     "In a study, people who trained with a coach beside them raised their load faster and gained more strength than those who did the same programme on their own ("),
    ("Mazzetti u.c., 2000", "Mazzetti et al., 2000"),

    # ---- third question ----
    ("Vai tu lepojies ar to, kā izskaties, jūties un funkcionē?", "Are you proud of how you look, feel and function?"),
    ('<span class="qa">Vai tu lepojies ar to,</span>', '<span class="qa">Are you proud of</span>'),
    ('<span class="qb">kā izskaties, jūties un funkcionē?</span>', '<span class="qb">how you look, feel and function?</span>'),

    # ---- closing ----
    ("Tavs fitness ir tavu pēdējo 1000 izvēļu summa.", "Your fitness is the sum of your last 1000 choices."),
    ("Nākamās var būt gudrākas. Sāc ar profilu, un pirmajā sarunā atradīsim, kas tev dos visvairāk.",
     "The next ones can be smarter. Start with the profile, and in our first conversation we will find what gives you the most."),
    ("Sākt pieteikumu", "Start your application"),
    ("Profils bez maksas · konsultācija 50 €", "The profile is free · consultation 50 €"),
    ("Ansoneri principi - uzzīmēti laboratorijā, pārbaudīti laukumā", "Ansoneri principles - drawn in the lab, tested in the field"),

    # ---- footer ----
    ("Privātuma politika", "Privacy policy"),
    ("© 2026 Ansoneri · Rīga", "© 2026 Ansoneri · Riga"),
]

# Text that may keep Latvian (proper names with diacritics, etc.). Exact strings, checked after translation.
ALLOW = set()

LV_CHARS = re.compile("[āčēģīķļņšūžĀČĒĢĪĶĻŅŠŪŽ]")
# Common Latvian words without diacritics, to catch leftovers the character check cannot see.
LV_WORDS = re.compile(r"(?<![\w#.-])(un|ar|tu|tev|tevi|tavs|tava|tavu|tavas|kas|ir|nav|vai|bez|uz|lai|kad|ja|pats|pirmais|solis|profils|klienti|klientu|metode|gadi|reize|cena|miers|miegs|restarts|virziens|starptautiski|testi|saruna|treneris|sadarbība)(?![\w-])", re.I)
# Attributes whose values are read or heard by visitors
TEXT_ATTRS = {"alt", "aria-label", "title", "placeholder", "content", "data-t", "data-d", "label"}


def translate(src):
    order = sorted(range(len(TABLE)), key=lambda i: -len(TABLE[i][0]))  # stable: longest first
    out, missing = src, []
    for i in order:
        lv, en = TABLE[i]
        if lv not in out:
            missing.append(lv)
            continue
        out = out.replace(lv, en)
    return out, missing


def rel(url):
    """Rewrite one relative URL for a page that lives one folder down (/en/)."""
    u = url.strip()
    if not u or re.match(r"^(?:[a-z][a-z0-9+.-]*:|//|/|#|\.\./)", u, re.I):
        return url
    if u.startswith("profils.html"):
        rest = u[len("profils.html"):]
        hash_ = ""
        if "#" in rest:
            rest, hash_ = rest.split("#", 1)
            hash_ = "#" + hash_
        q = re.sub(r"lang=\w+", "lang=en", rest) if "lang=" in rest else rest + ("&" if rest.startswith("?") else "?") + "lang=en"
        return "../profils.html" + q + hash_
    return "../" + u


def rewrite_urls(s):
    s = re.sub(r'(\b(?:src|href|poster)=)(["\'])(.*?)\2', lambda m: m.group(1) + m.group(2) + rel(m.group(3)) + m.group(2), s)
    s = re.sub(r'(\bsrcset=)(["\'])(.*?)\2',
               lambda m: m.group(1) + m.group(2) + ", ".join(
                   " ".join([rel(p.split()[0])] + p.split()[1:]) for p in m.group(3).split(",") if p.strip()) + m.group(2), s)
    s = re.sub(r'url\((["\']?)([^)"\']*)\1\)', lambda m: "url(" + m.group(1) + rel(m.group(2)) + m.group(1) + ")", s)
    return s


def js_strings(code):
    """Yield (offset, text) for string literals in JS, skipping comments."""
    i, n = 0, len(code)
    while i < n:
        c = code[i]
        if code.startswith("//", i):
            j = code.find("\n", i); i = n if j < 0 else j
        elif code.startswith("/*", i):
            j = code.find("*/", i + 2); i = n if j < 0 else j + 2
        elif c in "\"'`":
            j = i + 1
            while j < n and code[j] != c:
                j += 2 if code[j] == "\\" else 1
            yield i, code[i + 1:j]
            i = j + 1
        else:
            i += 1


def bad(text):
    t = html.unescape(text).strip()
    if not t or t in ALLOW:
        return False
    return bool(LV_CHARS.search(t) or LV_WORDS.search(t))


class Scan(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.hits = [], []

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0]
        for k, v in attrs:
            if v is not None and k in TEXT_ATTRS and bad(v):
                self.hits.append((line, f'{tag}[{k}]', v))
        if tag in ("script", "style"):
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()

    def handle_data(self, data):
        line = self.getpos()[0]
        if self.stack and self.stack[-1] == "style":
            return
        if self.stack and self.stack[-1] == "script":
            for off, s in js_strings(data):
                if bad(s):
                    self.hits.append((line + data.count("\n", 0, off), "script string", s))
            return
        if bad(data):
            self.hits.append((line, "text", data.strip()))


def main():
    src = open(SRC, encoding="utf-8").read()
    out, missing = translate(src)
    if missing:
        print(f"build_en: {len(missing)} table entr{'y is' if len(missing) == 1 else 'ies are'} no longer found in index.html "
              "(the Latvian copy changed - update TABLE in tools/build_en.py):", file=sys.stderr)
        for lv in missing:
            print("  - " + lv, file=sys.stderr)
        sys.exit(2)
    out = rewrite_urls(out)
    if "—" in out:
        print("build_en: the English contains an em dash; use a short hyphen", file=sys.stderr)
        sys.exit(2)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="") as f:
        f.write(out)

    scan = Scan()
    scan.feed(out)
    if scan.hits:
        print(f"build_en: wrote en/index.html, but {len(scan.hits)} Latvian leftover(s) remain:", file=sys.stderr)
        for line, where, s in scan.hits:
            print(f"  en/index.html:{line}  {where}: {s[:160]}", file=sys.stderr)
        sys.exit(1)
    print(f"build_en: wrote en/index.html ({len(TABLE)} entries applied, no Latvian left)")


if __name__ == "__main__":
    main()
