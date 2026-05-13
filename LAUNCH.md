# AB Bouw Group — Launch handboek (60 min naar live)

Dit is de KORTSTE pad naar live met werkende lead-bezorging.
Stap 1-6 = strikt nodig. Stap 7-10 = direct na launch.

---

## 0) Pre-flight check (2 min)

Open een terminal in deze map en run:

```bash
npm install
cp .env.example .env
```

`.env` is nu lokaal, niet in git. We vullen 'm in de volgende stappen.

---

## 1) GHL Inbound Webhook aanmaken (5 min) — KRITIEK

In GoHighLevel subaccount **AB Bouw Groep**:

1. **Automations** → **Workflows** → "Website formulier" (bestaat al)
2. Trigger toevoegen: klik **"Add new trigger"**
3. Type: **Inbound Webhook**
4. Naam: `Website formulier — inbound`
5. **Save** → er verschijnt een **Webhook URL** zoals
   `https://services.leadconnectorhq.com/hooks/<location-id>/webhook-trigger/<workflow-id>`
6. Kopieer die URL.

In `.env`:

```env
VITE_GHL_WEBHOOK_URL=<plak hier de hele URL>
```

### Field mapping in dezelfde workflow

Klik op de trigger → **"Sample Request"** → run de site form 1x (zie stap 6) → GHL ziet de payload.
Map deze body-keys op contact-velden + custom fields:

| Webhook key | GHL veld |
|---|---|
| `firstName` | Contact → First Name |
| `lastName` | Contact → Last Name |
| `email` | Contact → Email |
| `phone` | Contact → Phone |
| `type_werk` | Custom field → Type werk |
| `aanvullende_info` | Custom field → Aanvullende info |
| `adres_project` | Custom field → Adres project |
| `bron_lead` | Custom field → Bron lead |
| `utm_source` | Custom field → Bron lead (suffix) of nieuw veld |

Set workflow op **Publish**.

---

## 2) Web3Forms fallback (3 min) — VEILIGHEIDSNET

Als de GHL webhook ooit faalt, mag een lead niet verloren gaan. Web3Forms stuurt een email-kopie.

1. Ga naar https://web3forms.com
2. Vul `info@abgroep.be` in → klik **Create Access Key**
3. Bevestig de email die je krijgt
4. Kopieer de **Access Key** (32 tekens)

In `.env`:

```env
VITE_WEB3FORMS_KEY=<paste key>
VITE_LEAD_EMAIL_FALLBACK_TO=info@abgroep.be
```

---

## 3) Google Analytics 4 (5 min)

1. https://analytics.google.com → **Admin** → **+ Create Property**
   - Property name: `AB Bouw Group`
   - Tijdzone: Brussels, Valuta: EUR
2. **Data streams** → **Web** → `https://abgroep.be` → naam `Web`
3. Kopieer **Measurement ID** (`G-XXXXXXXXXX`)

In `.env`:

```env
VITE_GA4_ID=G-XXXXXXXXXX
```

---

## 4) Google Ads conversion tracking (8 min)

1. https://ads.google.com → log in op het MCC → kies subaccount **AB Bouw Groep**
2. **Tools & Settings** → **Conversions** → **+ New conversion action** → **Website**
3. Maak 3 conversion-acties:

| Naam | Categorie | Waarde |
|---|---|---|
| `Form submission — Contact` | Submit lead form | 50 EUR |
| `Phone call click` | Phone call lead | 25 EUR |
| `Newsletter signup` | Sign-up | 1 EUR |

4. Bij elke conversion → **"Use Google tag"** → kopieer:
   - **Conversion ID** (begint met `AW-`) → zelfde voor alle 3
   - **Conversion label** (random string) → uniek per actie

In `.env`:

```env
VITE_GADS_ID=AW-XXXXXXXXXX
VITE_GADS_CONVERSION_LABEL_FORM=<label van Form submission>
VITE_GADS_CONVERSION_LABEL_CALL=<label van Phone call click>
VITE_GADS_CONVERSION_LABEL_NEWS=<label van Newsletter signup>
```

5. **Link Google Ads ↔ GA4**: GA4 Admin → **Google Ads links** → koppel het AB Bouw Ads-account.

---

## 5) Hosting + DNS (15 min)

### Aanbeveling: Vercel (gratis, sneller dan Lovable, geen vendor-lock)

1. https://vercel.com → **Add New → Project** → import vanuit GitHub
   (eerst pushen: `git remote add origin <repo>` + `git push -u origin main`)
2. Framework: Vite (auto-detect via `vercel.json`)
3. **Environment Variables** → klik "Add" voor **elke** `VITE_*` key uit `.env`
4. **Deploy** → wacht ~30s → klaar
5. **Settings → Domains** → voeg `abgroep.be` en `www.abgroep.be` toe
6. Vercel toont nu DNS-records:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com.
```

7. Log in bij je registrar (Combell / Versio / etc) → vervang/voeg deze records toe
8. Wacht 5-30 min op DNS-propagatie

### Alternatief: Netlify

`netlify.toml` staat klaar. Drag-and-drop de `dist/` map op Netlify of koppel GitHub.
DNS: A `75.2.60.5` + CNAME `<site>.netlify.app`.

---

## 6) End-to-end test (10 min) — ZE MOETEN NIET SKIPPEN

Met de site live op een (test) URL:

1. **Contact form test**
   - Open `/contact`
   - Vul met dummy data, gebruik email `test+contact@abgroep.be`
   - Verstuur → moet "Bedankt voor je offerte" tonen
   - Check in GHL **Conversations / Contacts** → contact verschijnt + workflow "Website formulier" triggert
   - Check inbox `info@abgroep.be` → Web3Forms backup-email arriveert

2. **Newsletter form test**
   - Homepage → scroll naar "Nieuwsbrief"
   - Vul `test+news@abgroep.be` → submit
   - Check GHL contact + tag `welcomed`

3. **Phone click test**
   - Klik op een `tel:` link
   - Google Ads Conversions tab → na ~30 min staat er een conversion

4. **GA4 realtime**
   - GA4 → Reports → Realtime → bezoek de site → moet jouw bezoek zien

5. **Ads UTM test**
   - Open `https://abgroep.be/?utm_source=test&utm_medium=test&utm_campaign=launch`
   - Vul contact form in
   - Check GHL → contact heeft `bron_lead: ads:test` + alle UTM-velden

---

## 7) Twilio koppelen (na launch, 15 min)

In GHL:
1. **Settings → Phone numbers → Add Number**
2. Account: gebruik `mohammed.daoudi+twilio@getnorvo.com` Twilio account (zie context)
3. Kies een BE-nummer (+32)
4. Activeer A2P 10DLC niet nodig voor BE
5. Test: stuur SMS naar het nummer → moet binnenkomen in GHL Conversations
6. Test: "Gemiste Oproep Opvolging" workflow → bel het nummer, hang op zonder antwoorden → moet auto-SMS sturen

---

## 8) Google Business Profile (na launch, 20 min)

Per Norvo context: **1 hoofd-GBP + aparte profielen per divisie**.

Start met:
- AB Bouw Groep (hoofd)
- AB Dakwerken (aparte vestiging, prioriteit voor ads)

Beide op zelfde adres Industrieweg 14, 2830 Willebroek. Google staat dit toe bij duidelijk verschillende diensten.

---

## 9) Bardh onboarden (30 min, vandaag of morgen)

Norvo onboarding checklist (sectie 11 van context):

- [ ] GHL app op zijn GSM laten installeren
- [ ] Inloggen tonen
- [ ] Pipeline stages doorlopen (Lead → Gecontacteerd → Bezoek gepland → ...)
- [ ] Manueel een lead toevoegen
- [ ] Conversations tab demonstreren
- [ ] Kalender — afspraak inplannen
- [ ] Hem op "Hoofdgebruiker" zetten voor de AB Bouw subaccount

---

## 10) Wat al staat (voor de zekerheid)

- ✅ 17 GHL workflows gepubliceerd
- ✅ 11 custom fields + 23 tags
- ✅ Pipeline (13 stages)
- ✅ Kalender klaar
- ✅ Website: 15 pagina's, mobile responsive, SEO baseline
- ✅ JSON-LD voor `GeneralContractor` (lokale rich-snippet)
- ✅ Robots + sitemap (`abgroep.be`)
- ✅ Security headers (HSTS, X-Frame, Referrer-Policy)
- ✅ UTM capture in localStorage + meegestuurd naar GHL
- ✅ Tel: clicks automatisch tracked als conversion
- ✅ SPA history pushState → GA4 page_view per route

---

## Bij problemen

- **GHL form ontvangt niets**: open browser console op de site → form indienen → kijk naar `[lead] GHL submit failed` log. Vaakste oorzaak: webhook URL typo of workflow niet Published.
- **Geen Ads conversion na klik**: Google Ads heeft tot 3u delay. Gebruik **Google Tag Assistant** Chrome extensie om gtag en conversions live te verifiëren.
- **DNS werkt niet na 30 min**: check `https://dnschecker.org/#A/abgroep.be` — als records nog oud staan, registrar TTL stond op 24u. Refresh forceren via registrar paneel.

---

_Vragen tijdens launch → Tarik direct bellen._
