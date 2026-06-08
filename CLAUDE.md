# AB Bouw Groep — werkregels voor Claude in deze repo

Dit bestand wordt elke sessie automatisch ingeladen. Het bevat de niet-onderhandelbare
checks die geld of leads beschermen. Draai ze; sla ze niet over.

## Vóór je pusht of advies geeft: `npm run verify`
`verify` = `typecheck` + `check:ads` + `test`. Allemaal groen vóór een push naar `main`
of vóór je een ads-/lead-wijziging als "klaar" presenteert.
> Lovable deployt automatisch bij push naar `main`. CI (`.github/workflows/ci.yml`) geeft
> achteraf rood/groen, maar kan de deploy niet tegenhouden. Het echte hek is `npm run verify`
> lokaal, vóór de push.

## Google Ads negatives — de duurste foutsoort
`ads/negatives.txt` = de gedeelde negative-zoekwoordenlijst. **Voeg nooit een negative toe
zonder `npm run check:ads` te draaien.** De guard (`scripts/check-ads-negatives.cjs`) grondt
zich op de live dienst-catalogus (Dakwerken/Gevel/Diensten/Construct/LP's) en faalt als een
negative een eigen dienst of een Vlaamse werkgebied-stad blokkeert.

Kernregel (omgekeerde bewijslast): een term gaat er pas op als BEWEZEN is dat geen AB-klant
die een dienst zoekt hem ooit typt. Een phrase/broad-negative is alleen veilig als hij
minstens één versmallend token bevat (concurrent-/persoonsnaam of info/job/B2B-woord).
Puur dienstwoord ("fakro", "pur", "opbouw") of eigen stad ("dakwerken gent") = FOUT.
Waarom dit zo gevaarlijk is: blokkeert permanent + onzichtbaar (geblokkeerde queries staan
niet in het zoektermenrapport) + telt x2 campagnes (dak én gevel). Concurrent-merknamen
mógen als negative (Ben Heath #5: exclude competitor brands, tenzij je actief op hen bidt).

## Lead-pijplijn — mag nooit stil breken
`src/lib/leads.ts`: GHL-webhook én Web3Forms-backup vuren ALTIJD parallel; een telefoon-only
lead mag NOOIT geblokkeerd worden. `src/lib/leads.test.ts` bewaakt dit — raak die garanties
niet aan zonder de test mee te updaten. Conversie (`fireConversion`) vuurt enkel bij
geslaagde bezorging.

## Funnel-analytics
`trackFormStart` (tracking.ts) vuurt bij de eerste focus van een LP-formulier; `fireConversion`
bij submit. In GA4 = form_start vs generate_lead = de drop-off binnen het formulier.

## Stijl
Geen losse README/playbook-`.md` voor Mohammed (hij leest chat, niet docs). Commit scripts/tests,
geen prozadocumenten. Dit bestand is de uitzondering: het is voor Claude, niet voor Mohammed.
