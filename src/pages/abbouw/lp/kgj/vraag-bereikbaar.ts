/**
 * De laatste klikvraag van de aanvraagkaart, direct vóór het contactscherm, op elk pad van elke landingspagina met de kaart
 * (/lp/dakwerken, /lp/dakwerken/asbest, /lp/totaalrenovatie, /lp/aannemer-renovatiewerken).
 *
 * 16 nov 2026 (opdracht Mohammed, staal, alleen lokaal): "Wanneer bent u het best bereikbaar?" met "Overdag", "Na 17 uur" en
 * "Maakt niet uit", in de stijl van "Wanneer wilt u starten?". Het antwoord reist mee zoals de andere: in de samenvatting op het
 * contactscherm en in aanvullende_info ("Bereikbaar: Overdag").
 *
 * Eigen bestand zonder beelden: inhoud.ts (dak) en inhoud-totaalrenovatie.ts gebruiken dezelfde vraag zonder elkaars foto's mee te laden.
 */
import type { Vraag } from './inhoud';

export const BEREIKBAAR_VRAAG: Vraag = {
  sleutel: 'Bereikbaar', vraag: 'Wanneer bent u het best bereikbaar?', metSleutel: true,
  keuzes: [
    { label: 'Overdag', icoon: 'overdag' }, { label: 'Na 17 uur', icoon: 'avond' }, { label: 'Maakt niet uit', icoon: 'midden' },
  ],
};
