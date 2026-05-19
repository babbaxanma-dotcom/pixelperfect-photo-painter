# Google Ads — AB Bouw Groep · DURAL-SPEC SETUP
**Launched 2026-05-19**

Doel: ads er laten uitzien zoals Dural Bouwgroep (referentie-screenshots: `duralvb1-3.PNG`). De 5 dingen die zij hebben en wij niet — fix-pad hieronder.

---

## DURAL-DECONSTRUCT — wat zij doen dat wij gaan kopiëren

| Dural-feature | Hun screenshot | Hoe wij dit krijgen |
|---|---|---|
| Stadnaam in headline ("Dakwerken Olen", "Mechelen", "Willebroek") | `{LOCATION(City)}` template OF per-stad ad-groups | **§ 3 hieronder** |
| ★★★★★ 4,9 (992 reviews) | Aggregator (Trustpilot/Feefo) — geen Google reviews | **§ 8** — start direct, sterren komen na ~3 mnd |
| Logo + business name bovenaan | Business asset (verplicht 2026) | **§ 4** |
| "Dakdekker · Adres · Geopend · Sluit om 20:00" | Location asset (GBP gekoppeld) | **§ 5** |
| Big sitelinks met description | Sitelinks met Description 1+2 ingevuld | **§ 6** |
| 1-2 grote foto's rechts | Image asset (al gegenereerd in deze map) | **§ 2** |

---

## 1. STRATEGISCHE STRUCTUUR — campagnes + ad-groups

**KIES NIET zomaar 1 campagne per dienst.** Maak per dienst een campagne met **per stad een ad-group** — dat is wat Dural doet, en dat is de enige manier om elke ad-headline matchend te krijgen met de zoekstad.

### Campagne 1: Dakwerken
| Ad group | Keywords (phrase + exact) | Final URL |
|---|---|---|
| Dakwerken-Mechelen | `"dakwerker mechelen"`, `[dakwerker mechelen]`, `"dakwerken mechelen"`, `[dakwerken mechelen]` | `/lokaal/dakwerker-mechelen` |
| Dakwerken-Antwerpen | `"dakwerker antwerpen"`, `[dakwerker antwerpen]`, `"dakwerken antwerpen"`, ... | `/lokaal/dakwerker-antwerpen` |
| Dakwerken-Willebroek | `"dakwerker willebroek"`, ... | `/lokaal/dakwerker-willebroek` |
| Dakwerken-Lier | ... | `/lokaal/dakwerker-lier` |
| Dakwerken-Bornem | ... | `/lokaal/dakwerker-bornem` |
| Dakwerken-Sint-Niklaas | ... | `/lokaal/dakwerker-sint-niklaas` |
| Dakwerken-Boom | ... | `/lokaal/dakwerker-boom` |
| Dakwerken-Puurs | ... | `/lokaal/dakwerker-puurs` |
| **Dakwerken-Generic** (fallback) | `"dakwerker"`, `"dakwerken offerte"`, `"plat dak EPDM"`, `"pannendak vernieuwen"`, `"dakisolatie premie"` | `/lp/dakwerken` |

### Campagne 2: Gevelrenovatie — zelfde structuur
Per stad een ad-group → URL `/lokaal/gevelrenovatie-{stad}`. Plus 1 generic ad-group → `/lp/gevel`.

**Voordeel deze structuur:**
- Each ad headline matched aan zoekstad → wat Dural doet
- Landing page = stad-specifiek → hogere Quality Score → lagere CPC
- Conversion-rate omhoog (relevantie effect)

---

## 2. IMAGE ASSETS (1.91:1 landscape + 1:1 square)

Geen extra werk: 27 dakwerken + 21 gevel + 21 brand foto's al gegenereerd in:
- `google-ads-assets/dakwerken/{landscape,square,portrait}/`
- `google-ads-assets/gevel/{landscape,square,portrait}/`
- `google-ads-assets/brand/{landscape,square,portrait}/`

**Upload per campagne:** min 5 landscape + 5 square + 2-3 portrait. Google rouleert + kiest winnaar.

**Hoe:** Google Ads → Campagne → tabblad **Assets** → **+** → **Afbeeldingen** → upload + koppel aan ad-group (of campaign-level).

---

## 3. RESPONSIVE SEARCH ADS — Headlines + Descriptions per ad-group

### Format voor STAD-specifieke ad-groups (Dakwerken-Mechelen, -Antwerpen, etc.)

Vervang `{STAD}` met de stadnaam in elke ad-group. Of gebruik `{LOCATION(City):Mechelen}` om Google automatisch user's stad te laten invullen, met "Mechelen" als fallback.

**Headlines (15 invullen, max 30 tekens):**
```
Dakwerker {STAD}
Dakwerken {STAD} — offerte
Plat dak EPDM {STAD}
Pannendak {STAD}
Gratis dakinspectie {STAD}
Eigen dakdekkers uit regio
10 jaar garantie op dakwerk
Mijn VerbouwPremie inbegrepen
Vaste prijs vooraf
Antwoord binnen 1 werkdag
Erkend aannemer NACE 43.91
124+ tevreden klanten
Dakisolatie + premie
Lekkage of stormschade?
Bel direct: 0460 20 77 88
```

**Descriptions (4 invullen, max 90 tekens):**
```
Eigen dakdekkers in {STAD} en omstreken. 10 jaar garantie via Federale Verzekering.
Plat dak EPDM, pannen of leien — vakman komt langs, vaste prijs binnen 1 werkdag.
Mijn VerbouwPremie inbegrepen. Wij regelen het premiedossier voor u.
Erkend dakwerker uit Willebroek. 124+ tevreden klanten. Gratis plaatsbezoek.
```

**Path 1:** `dakwerker` · **Path 2:** `{stad-slug}` (vb. `mechelen`)

### Format voor GENERIC ad-group (Dakwerken-Generic, fallback)

**Headlines:**
```
Dakwerker Vlaanderen
Plat dak EPDM offerte
Pannendak vernieuwen
Gratis dakinspectie
Eigen dakdekkers
10 jaar garantie op dakwerk
Mijn VerbouwPremie inbegrepen
Vaste prijs binnen 1 werkdag
Erkend aannemer Willebroek
124+ tevreden klanten
Dakisolatie + premie
Lekkage of stormschade?
Antwoord binnen 1 werkdag
Bel 0460 20 77 88
Antwerpen · Mechelen · Lier
```

**Final URL:** `https://abgroep.be/lp/dakwerken`

### Gevel — STAD-specifiek

**Headlines (vervang `{STAD}`):**
```
Gevelrenovatie {STAD}
Crepi op gevel {STAD}
ETICS-isolatie {STAD}
Steenstrips {STAD}
Gratis gevel-offerte
Eigen vakmensen uit regio
10 jaar garantie
Mijn VerbouwPremie inbegrepen
Vaste prijs vooraf
Antwoord binnen 1 werkdag
Erkend aannemer NACE 43.99
124+ tevreden klanten
Sto, Marmolit of Cova
Sierpleister marmorino
Bel: 0460 20 77 88
```

**Descriptions:**
```
Eigen vakmensen in {STAD}. 10 jaar garantie via Federale Verzekering. Gratis offerte.
Buitenisolatie + crepi = warmer huis + nieuwe gevel. Premie tot €4.000 mogelijk.
Vakman komt langs voor metingen + kleuradvies. Vaste prijs binnen 1 werkdag.
Erkend gevelrenovatie-aannemer uit Willebroek. 124+ tevreden klanten.
```

---

## 4. BUSINESS ASSET — logo + name (verplicht 2026)

Zonder dit toont je ad geen logo bovenaan. Dural heeft het, jij moet het ook.

**Setup:**
1. Google Ads → **Account-level** → **Asset library** → **+** → **Logo**
2. Upload `src/assets/home/logo.png` (verifieer min 128×128, square)
3. Vul **Business name** in: `AB Bouw Groep`
4. Wacht 1-3 werkdagen op Google's review/approval

---

## 5. LOCATION ASSET — adres + uren onder ad

Dural toont "Dakdekker · Sluizenstraat 55 · Geopend · Sluit om 20:00". Wij willen "Dakdekker · August van Landeghemstraat 65 · Geopend · Sluit om 18:00".

**Voorwaarden:**
- GBP **moet verified** zijn (voucher per post is gangbaar in BE, duurt 5-14 dagen)
- Business hours moeten ingevuld zijn
- GBP categorie moet "Dakdekker" / "Bouwbedrijf" / "Aannemer" zijn

**Setup:**
1. Google Ads → **Tools** → **Linked accounts** → **Business Profile**
2. Koppel via dezelfde Google-account waarop GBP staat
3. In de campaign → Assets → **+** → **Locations** → selecteer "AB Bouw Groep"

**Bonus:** zodra GBP verified is en gekoppeld, krijg je ook gratis vermelding in Google Maps voor je ad-keywords.

---

## 6. SITELINKS — expanded format (zoals Dural)

Dural's "Dakwerken in Olen" / "Platte Daken" / "Over ons" / "Gratis offerte" sitelinks gebruiken de **expanded** vorm (met Description 1 + 2 onder de link-tekst). Niet de korte comma-vorm. Dit is een aanvinkje in de Ads UI: vul Description 1 + 2 in, en Google toont automatisch de expanded versie wanneer er ruimte is.

### Campagne Dakwerken — 6 sitelinks

| # | Link tekst (25) | Description 1 (35) | Description 2 (35) | URL |
|---|---|---|---|---|
| 1 | Dakwerken in uw regio | AB Bouw Groep — eigen dakdekkers | Vraag uw gratis dakinspectie aan | `/lp/dakwerken#contact-form` |
| 2 | Platte Daken | EPDM 20j levensduur, BENOR | 10 jaar garantie Federale Verz. | `/lp/dakwerken#diensten` |
| 3 | Pannendak renovatie | Koramic — stormbestendig | BENOR-keurmerk + 10j garantie | `/lp/dakwerken#diensten` |
| 4 | Dakisolatie | Sarking of langs binnen | Mijn VerbouwPremie inbegrepen | `/lp/dakwerken#diensten` |
| 5 | Realisaties | 124+ afgewerkte daken | Foto's en klantenervaringen | `/realisaties` |
| 6 | Gratis offerte | Vakman komt langs binnen 5d | Vaste prijs vooraf — antwoord 1d | `/lp/dakwerken#contact-form` |

### Campagne Gevel — 6 sitelinks

| # | Link tekst | Description 1 | Description 2 | URL |
|---|---|---|---|---|
| 1 | Gevelrenovatie in uw regio | AB Bouw Groep — eigen vakmensen | Vraag uw gratis offerte aan | `/lp/gevel#contact-form` |
| 2 | Crepi | Sto, Marmolit of Cova | 15+ kleuren — 10j garantie | `/lp/gevel#diensten` |
| 3 | ETICS-buitenisolatie | Warmer huis + nieuwe gevel | Premie tot €4.000 mogelijk | `/lp/gevel#diensten` |
| 4 | Steenstrips | Authentieke baksteen-look | Onderhoudsvrij 30+ jaar | `/lp/gevel#diensten` |
| 5 | Realisaties | Voor & na-foto's gevels | Echte werven uit de regio | `/realisaties` |
| 6 | Gratis offerte | Vakman komt langs binnen 5d | Vaste prijs vooraf — antwoord 1d | `/lp/gevel#contact-form` |

---

## 7. CALLOUTS — 10 stuks (Dural-stijl korte benefits)

```
Eigen ploeg uit Willebroek
10 jaar garantie
Erkend aannemer
Federale Verzekering
124+ tevreden klanten
Gratis plaatsbezoek
Vaste prijs vooraf
Mijn VerbouwPremie inbegrepen
Geen voorschot gevraagd
Antwoord binnen 1 werkdag
```

---

## 8. STRUCTURED SNIPPETS — diensten + werkgebied

### Header "Diensten" — Dakwerken
```
Pannendak, Natuurleien, Plat dak EPDM, Bitumen, Dakisolatie, Sarking, Zinkwerk, Velux, Lekkage herstel
```

### Header "Diensten" — Gevel
```
Crepi, ETICS isolatie, Steenstrips, Sierpleister, Gevelreiniging, Gevelherstel, Voegwerk
```

### Header "Werkgebied" (beide campagnes)
```
Mechelen, Antwerpen, Lier, Bornem, Willebroek, Sint-Niklaas, Boom, Puurs
```

---

## 9. CALL ASSET

| Veld | Waarde |
|---|---|
| Nummer | `+32 460 20 77 88` |
| Land | België |
| Uren | Ma-Vr 08:00-18:00, Za 09:00-13:00, Zo gesloten |
| Call-reporting | AAN |

---

## 10. LEAD FORM EXTENSION

Direct in de SERP een form openen — geen klik naar site nodig.

**Setup:**
1. Ads → Assets → **+** → **Lead form**
2. **Headline:** "Plan uw gratis plaatsbezoek"
3. **Description:** "Vrijblijvend advies, vaste prijs vooraf, eigen ploeg. 10 jaar garantie."
4. **CTA:** "Vraag offerte aan"
5. **Questions:** voornaam, achternaam, email, telefoon, postcode
6. **Webhook URL:** dezelfde GHL-webhook als de site-forms — `https://services.leadconnectorhq.com/hooks/86MhhNXcdg4sbqD689x4/webhook-trigger/c8ad7682-de0a-4d5d-a867-61ca44a25ecc`
7. **Privacy policy URL:** `https://abgroep.be/privacy`

Verwacht: +20-40% leads voor dezelfde spend, vooral mobile.

---

## 11. SELLER RATINGS (★★★★★) — Dural's 992-reviews aanpak kopiëren

Dural heeft 992 reviews op aggregator. Dat is een meerjarige investering. AB Bouw begint op 0 — fixen we als volgt:

**Start nu (15 min):**
1. **Trustpilot Free** account → `business.trustpilot.com` → claim `abgroep.be`
2. Eerste batch invite: alle bestaande tevreden klanten (Bardh heeft contacts) via Trustpilot's email-invite tool — automatische sequence
3. Trustpilot widget op `/realisaties` + bedankt-pagina installeren

**Doorlopend (per werf):**
- Elke afgewerkte werf → Trustpilot email-invite ~2 dagen na oplevering
- Templated SMS-follow-up als email geen reactie geeft

**Tijdlijn:** met 1-2 nieuwe reviews/week = ~50-80 reviews na 1 jaar. Sterren-extension activeert vanaf 100+ reviews (kan ~14 maanden duren). Net niet 992 zoals Dural, maar binnen 2 jaar wel ergens 200-300 = visueel net zo sterk.

---

## 12. BID-STRATEGY + BUDGET

| Setting | Waarde | Waarom |
|---|---|---|
| Bid strategy | **Maximize Clicks** (cap CPC €1.80) eerste 2 weken | Conversion-data verzamelen, dan switchen naar Maximize Conversions met tCPA €25-35 |
| Budget | **€20-30/dag per campagne** | Dak + Gevel = €40-60/dag totaal. Bij €1.50-2.00 CPC = 10-15 clicks/dag = 1-2 leads/dag |
| Match types | **Phrase + Exact** alleen | Broad verspilt budget |
| Negative kw's (account-level) | `gratis`, `doe het zelf`, `tweedehands`, `huren`, `verhuur`, `cursus`, `opleiding`, `vacature`, `jobs`, `wikipedia`, `forum` | |
| Locaties (per ad-group) | **Stad + 15km radius** (vb. Mechelen-ad-group → enkel Mechelen + 15km) | Concentreer impressions waar je kan leveren |
| Ad rotation | **Optimize for clicks** | Google kiest beste variant |
| Schedule | Ma-Vr 07:00-21:00, Za 09:00-17:00, Zo uit | Geen verspilling buiten werkdagen |
| Devices | Geen exclusies | Laat Google leren |
| Audiences | "Renovatie" + "Huiseigenaren 30-65 BE" (observation, niet targeting) | Zien welke segmenten converteren, later bid-adjusten |

---

## 13. CONVERSION TRACKING — verifieer

| Conversion | Source | Status |
|---|---|---|
| Form submit (alle leadforms) | GA4 event `generate_lead` → geïmporteerd in Ads | ✅ live |
| Phone call from ad | Google call-asset reporting | Activeren bij call asset setup |
| Phone call from website | Twilio number swap → GHL call-log | ✅ live |
| Lead form direct (extension) | Webhook naar GHL | Activeren bij lead-form setup |

In Ads → Tools → **Conversions**: alle 4 moeten zichtbaar zijn, status "Recording conversions".

---

## VOLGORDE VAN UITVOERING (~90 min)

1. **Business asset** (logo + name) — 5 min, eerst doen, kost 1-3d approval
2. **GBP koppelen** als Location asset — 5 min, vereist verified GBP
3. **Image assets uploaden** — 15 min (per campagne 5 landscape + 5 square)
4. **Ad-groups per stad maken** — 30 min (8 dakwerken + 8 gevel = 16 ad-groups)
5. **Sitelinks (expanded)** — 10 min, copy uit § 6
6. **Callouts + Structured snippets** — 5 min, copy uit § 7 + 8
7. **Call asset** — 5 min
8. **Lead form extension** — 10 min, webhook al klaar
9. **Bid + budget + negatives** — 5 min uit § 12
10. **Trustpilot starten** — 15 min, sterren komen 6-14 maanden later

---

## CHECK NA 7 DAGEN

- **CTR ad groups** — verwacht >5% op stad-specifieke ad-groups (Dural-niveau), >3% op generic
- **Quality Score** — moet 7+ zijn op stad-specifieke ad-groups (Lokale LP-relevantie)
- **Conversion rate** — verwacht 4-8% op LP, 2-4% op /lokaal/* (LP heeft betere conversion-flow)
- **Cost per lead** — moet onder €30 zakken zodra Max Conversions actief is

Als CTR onder 3% blijft op een ad-group → ad-copy A/B test (varieer headline 1 + description 1).
Als CPL boven €40 zit na 2 weken → keyword negatives uitbreiden + match-type verkleinen.
