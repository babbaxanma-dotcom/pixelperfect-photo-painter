# Google Ads — Assets + Copy Pack
**AB Bouw Groep · launched 2026-05-19**

Bardh hoeft alles enkel in de Ads UI te uploaden / plakken. Niets meer bedenken.

---

## 1. Image Assets — uploaden

Voor elke campagne (Dakwerken / Gevel / Brand) staan klare afbeeldingen in 3 ratios:

| Map | Wat | Aantal | Hoeveel uploaden in Ads |
|---|---|---|---|
| `dakwerken/landscape/` | 1200×628 (1.91:1) | 9 | minstens **5 stuks** |
| `dakwerken/square/` | 1200×1200 (1:1) | 9 | minstens **5 stuks** |
| `dakwerken/portrait/` | 960×1200 (4:5) | 9 | **3 stuks** (optioneel maar +CTR) |
| `gevel/landscape/` | 1200×628 | 7 | **5 stuks** |
| `gevel/square/` | 1200×1200 | 7 | **5 stuks** |
| `gevel/portrait/` | 960×1200 | 7 | **3 stuks** |
| `brand/*` | algemene brand-foto's voor Performance Max of generieke campagne | 7 | **3-4 stuks per ratio** |

**Hoe uploaden:**
Google Ads → Campagne → tabblad **Assets** → **+ Toevoegen** → **Afbeeldingen** → Upload bestanden → koppel aan ad-groep.

Google rouleert automatisch tussen de varianten en kiest de winnaar op CTR.

---

## 2. Sitelinks (4-6 stuks per campagne)

### Campagne Dakwerken

| Link tekst | Beschrijving 1 (35 tekens) | Beschrijving 2 (35 tekens) | URL |
|---|---|---|---|
| Gratis plaatsbezoek | Eigen dakdekkers ter plaatse | Vaste prijs binnen 1 werkdag | `https://abgroep.be/lp/dakwerken#contact-form` |
| Plat dak EPDM | 20 jaar levensduur | 10 jaar garantie via Federale | `https://abgroep.be/lp/dakwerken#diensten` |
| Pannendak renovatie | Koramic + Eternit | Stormbestendig, BENOR-keurmerk | `https://abgroep.be/lp/dakwerken#diensten` |
| Dakisolatie | Sarking of langs binnen | Mijn VerbouwPremie inbegrepen | `https://abgroep.be/lp/dakwerken#diensten` |
| Onze projecten | 124+ tevreden klanten | Foto's van afgewerkte daken | `https://abgroep.be/realisaties` |
| Bel direct | 0460 20 77 88 | Antwoord binnen 1 werkdag | `tel:+32460207788` |

### Campagne Gevel

| Link tekst | Beschrijving 1 | Beschrijving 2 | URL |
|---|---|---|---|
| Gratis plaatsbezoek | Vakman komt langs en meet op | Vaste prijs vooraf | `https://abgroep.be/lp/gevel#contact-form` |
| Crepi gevelrenovatie | Sto, Marmolit of Cova | 15+ kleuren beschikbaar | `https://abgroep.be/lp/gevel#diensten` |
| ETICS buitenisolatie | Energiezuinig + frisser zomers | Premie tot €4.000 inbegrepen | `https://abgroep.be/lp/gevel#diensten` |
| Steenstrips | Authentieke baksteen-look | Onderhoudsvrij 30+ jaar | `https://abgroep.be/lp/gevel#diensten` |
| Onze projecten | Voor & na-foto's | Echte werven Mechelen/Antwerpen | `https://abgroep.be/realisaties` |
| Bel direct | 0460 20 77 88 | Antwoord binnen 1 werkdag | `tel:+32460207788` |

---

## 3. Callouts (8-10 per campagne, max 25 tekens elk)

Plak deze in als **Callouts asset** — verschijnen als extra benefit-regel onder de ad-tekst.

**Dakwerken + Gevel (deelbaar):**
```
Eigen ploeg uit Willebroek
10 jaar garantie
Erkend aannemer NACE 43.91
Federale Verzekering
124+ tevreden klanten
Gratis plaatsbezoek
Vaste prijs vooraf
Mijn VerbouwPremie inbegrepen
Geen voorschot gevraagd
Antwoord binnen 1 werkdag
```

---

## 4. Structured Snippets (per campagne)

**Header: "Diensten"** — Google laat 3-10 waarden toe.

### Dakwerken
```
Pannendak
Natuurleien
Plat dak EPDM
Bitumen / roofing
Dakisolatie
Sarking
Zinkwerk
Dakgoten
Velux dakvensters
Lekkage herstel
```

### Gevel
```
Crepi
ETICS buitenisolatie
Steenstrips
Sierpleister
Gevelreiniging
Gevelherstel
Voegwerk
Bezetting
```

**Header: "Werkgebied"** (extra snippet, optioneel — versterkt lokale relevantie):
```
Mechelen
Antwerpen
Lier
Bornem
Willebroek
Sint-Niklaas
Boom
Puurs
```

---

## 5. Call asset

| Veld | Waarde |
|---|---|
| Telefoonnummer | `+32 460 20 77 88` |
| Land | België |
| Beschikbaar | Ma-Vr 08:00-18:00, Za 09:00-13:00 |
| Call-reporting | AAN (zo zien we welke ads bellen genereren) |

**Belangrijk:** call-reporting via Google werkt apart van de Twilio-tracking. Beide AAN — Google ziet de ad-attributie, Twilio ziet het gesprek-transcript. Geen conflict.

---

## 6. Location asset

Koppel je Google Business Profile (AB Bouw Groep, August van Landeghemstraat 65, 2830 Willebroek) aan dit Ads-account.

**Hoe:** Google Ads → Tools → **Linked accounts** → **Business Profile** → koppel via dezelfde Google-account waarop GBP staat.

Resultaat: adres + map-pin verschijnt onder ads, ads worden ook in Google Maps getoond, lokale targeting wordt 30-40% relevanter.

---

## 7. Lead form extension (optioneel — sterke conversion-boost)

Direct in de SERP een mini-form aanbieden, zonder dat user naar je site moet. Google verzamelt naam/telefoon/email en die komen via webhook naar GHL.

**Setup:**
1. Ads → Assets → **+ Toevoegen** → **Lead form**
2. **Form name:** "Gratis dakinspectie" / "Gratis gevel-offerte"
3. **CTA:** "Vraag offerte aan"
4. **Headline:** "Plan uw gratis plaatsbezoek — vakman langs binnen 5 werkdagen"
5. **Description:** "Vrijblijvend advies, vaste prijs vooraf, eigen ploeg. 10 jaar garantie."
6. **Questions:** voornaam, achternaam, email, telefoon, postcode
7. **Webhook URL:** dezelfde GHL-webhook als de site-forms — `services.leadconnectorhq.com/hooks/86MhhNXcdg4sbqD689x4/webhook-trigger/c8ad7682-de0a-4d5d-a867-61ca44a25ecc`
8. **Privacy policy URL:** `https://abgroep.be/privacy`

Verwachte impact: +20-40% leads voor dezelfde ad-spend, vooral op mobile.

---

## 8. Seller ratings (sterren onder ad) — LANGE TERMIJN

**Vereisten Google:** 100+ reviews afgelopen 12 maanden, minimum 3.5★ gemiddeld, via een **goedgekeurde aggregator** (Google reviews tellen NIET mee voor de ster-extension).

**Aanbevolen aggregator voor BE:** Trustpilot Free tier.

**Stappen:**
1. Trustpilot account aanmaken op `business.trustpilot.com` voor abgroep.be
2. Import-flow: invite je 30-40 oudste klanten via email (Trustpilot stuurt automatisch een reviewverzoek)
3. Stuur elke nieuwe afgewerkte werf een Trustpilot-uitnodiging — meeste klanten reageren binnen een week
4. Na ~3-4 maanden hebt je 100+ reviews → Google trekt automatisch de ster-data binnen
5. Sterren verschijnen binnen 2-3 weken onder je ads (3-6% CTR-boost gemiddeld)

---

## 9. Headlines + Descriptions — kant-en-klaar

### Campagne Dakwerken — Responsive Search Ad

**Headlines (max 30 tekens, 15 invullen):**
```
Dakwerker Mechelen
Plat dak EPDM offerte
Pannendak vernieuwen
Gratis dakinspectie
Eigen dakdekkers — geen onderaannemers
10 jaar garantie op dakwerk
Mijn VerbouwPremie inbegrepen
Vaste prijs vooraf
Antwoord binnen 1 werkdag
Erkend aannemer Willebroek
124+ tevreden klanten
Dakisolatie + premie
Lekkage of stormschade?
Zink + dakgoten vernieuwen
Bel 0460 20 77 88
```

**Descriptions (max 90 tekens, 4 invullen):**
```
Eigen dakdekkers, 10 jaar garantie via Federale Verzekering. Vraag gratis plaatsbezoek aan.
Plat dak EPDM, pannen of leien — vakman komt langs en meet op. Vaste prijs binnen 1 werkdag.
Mijn VerbouwPremie inbegrepen in de offerte. Wij regelen het dossier voor u.
Erkend dakwerker in Mechelen, Antwerpen, Lier en omstreken. 124+ tevreden klanten.
```

**Final URL:** `https://abgroep.be/lp/dakwerken`

---

### Campagne Gevel — Responsive Search Ad

**Headlines:**
```
Gevelrenovatie Mechelen
Crepi op uw gevel
ETICS buitenisolatie
Steenstrips gevel
Gratis gevel-offerte
Eigen vakmensen — geen onderaannemers
10 jaar garantie op gevelwerk
Mijn VerbouwPremie inbegrepen
Vaste prijs vooraf
Antwoord binnen 1 werkdag
Erkend aannemer Willebroek
124+ tevreden klanten
Sto, Marmolit of Cova
Sierpleister marmorino
Bel 0460 20 77 88
```

**Descriptions:**
```
Crepi, ETICS, steenstrips of sierpleister. Eigen ploeg, 10 jaar garantie. Gratis offerte.
Buitenisolatie + crepi = warmer huis + nieuwe look. Premie tot €4.000 mogelijk.
Vakman komt langs voor metingen + kleuradvies. Vaste prijs binnen 1 werkdag.
Erkend gevelrenovatie-aannemer in Mechelen, Antwerpen, Lier en omstreken.
```

**Final URL:** `https://abgroep.be/lp/gevel`

---

## 10. Bid-strategy + Budget — aanbeveling

| Setting | Waarde | Waarom |
|---|---|---|
| Bid strategy | **Maximize Clicks** (cap CPC €1.80) | Eerste 2 weken — leer welke kw's converteren. Daarna naar Maximize Conversions met tCPA. |
| Budget | **€20-30/dag** per campagne | Bij €1.50-2.00 CPC = 10-15 clicks/dag = 1-2 leads/dag |
| Match types | **Phrase + Exact** alleen | Geen Broad — verspilt budget aan irrelevante zoekopdrachten |
| Negative keywords | "gratis", "doe het zelf", "tweedehands", "huren", "verhuur", "cursus", "opleiding", "vacature", "jobs" | Blokkeer non-buyer intent |
| Locaties | Mechelen, Antwerpen, Lier, Bornem, Willebroek, Sint-Niklaas, Boom, Puurs — **+15km radius elk** | Concentreer op werkgebied AB Bouw |
| Ad rotation | **Optimize** | Google kiest beste ad-variant |
| Schedule | Ma-Vr 07:00-21:00, Za 09:00-17:00 — uit op zondag | Geen verspilling op zondag |

---

## 11. Conversion tracking — verifieer dat dit aan staat

| Conversion | Source | Status |
|---|---|---|
| **Form submit** (alle leadforms) | GA4 event `generate_lead` → geïmporteerd in Ads | ✅ live |
| **Phone call from ad** | Google call-asset reporting | Activeren bij call asset setup |
| **Phone call from website** | Twilio number swap → GHL call-log | ✅ live |
| **Lead form direct** (extension) | Webhook naar GHL | Activeren bij lead-form setup |

In Ads → Tools → **Conversions** zou je minstens deze 4 moeten zien staan.

---

## Volgorde van uitvoering (1 uur werk totaal)

1. **Image assets uploaden** (15 min) — grootste visuele jump
2. **Sitelinks** (10 min) — extra real estate onder ad
3. **Callouts** (5 min) — copy-paste lijst
4. **Structured snippets** (5 min) — copy-paste lijst
5. **Call asset** (5 min) — nummer + uren
6. **Location asset** (5 min) — GBP linken
7. **Lead form extension** (10 min) — extra conversion-path
8. **Trustpilot setup starten** (5 min nu, daarna gewoon klanten inviten) — sterren komen later

Wat NIET vandaag, gewoon plannen:
- Seller ratings ster-extension → komt vanzelf zodra Trustpilot 100+ reviews heeft
