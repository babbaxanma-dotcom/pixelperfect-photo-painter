/**
 * Homepage van abgroep.be in de stijl van bfbouw.be (spec/bf-stijl.md §7).
 * Volgorde: kop, hero, over-split, cijferband, diensten, zekerheid, inspectieband,
 * traject, uitgevoerd werk + voor/na, vragen, plaatsblok, voet + zwevende belknop.
 * Alle tekst komt uit inhoud.ts (HOME_BF), met de bron per blok.
 */
import { useMemo } from 'react';
import BfPagina from './BfPagina';
import { pagina } from './schil';
import { hero, overSplit, cijferband, dienstenSlider, zekerheid, inspectieBand, traject, realisatieRail, voorNa, faq, plaatsBlok } from './blokken';
import { HOME_BF as H } from './inhoud';

export function homeHtml() {
  const inhoud = [
    hero({ kop: H.hero.kop, tekst: H.hero.tekst, knop: H.hero.knop, dias: H.hero.dias, verder: '#over' }),
    overSplit({ id: 'over', kop: H.over.kop, alineas: H.over.alineas, knop: H.over.knop, google: true, foto: H.over.foto }),
    cijferband({ label: 'AB Bouw Groep in cijfers', tegels: H.cijfers }),
    dienstenSlider({ id: 'diensten', kop: H.diensten.kop, tekst: H.diensten.tekst, knop: H.diensten.knop, banner: H.diensten.banner, kaarten: H.diensten.kaarten }),
    zekerheid({ kop: H.zekerheid.kop, lede: H.zekerheid.lede, kaarten: H.zekerheid.kaarten, huis: H.zekerheid.huis, inzet: H.zekerheid.inzet }),
    inspectieBand({ kop: H.inspectie.kop, tekst: H.inspectie.tekst, knop: H.inspectie.knop, heeftPlaats: true }),
    traject({ id: 'werkwijze', kop: H.werkwijze.kop, knop: H.werkwijze.knop, foto: H.werkwijze.foto, stappen: H.werkwijze.stappen }),
    realisatieRail({ id: 'realisaties', kop: H.werk.kop, fotos: H.werk.fotos, na: voorNa(H.werk.voorNa) }),
    faq({ id: 'vragen', kop: H.faq.kop, vragen: H.faq.vragen }),
    plaatsBlok({ pagina: 'home', bron: 'landing_page', kop: H.contact.kop, tekst: H.contact.tekst, knopKies: H.contact.knopKies }),
  ].join('\n');
  return pagina({ actief: '', heeftPlaats: true, inhoud, voettekst: H.voet });
}

export default function HomeBf() {
  const html = useMemo(homeHtml, []);
  return <BfPagina html={html} titel={H.titel} omschrijving={H.omschrijving} pad="/" bron="home" />;
}
