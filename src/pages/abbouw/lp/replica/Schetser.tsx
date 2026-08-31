import { useEffect, useRef, useState } from 'react';
import { IcPijl } from './Iconen';

import betonlook from '@/assets/schetser/tegels-betonlook.jpg';
import antraciet from '@/assets/schetser/tegels-antraciet.jpg';
import marmerlook from '@/assets/schetser/tegels-marmerlook.jpg';
import zandsteen from '@/assets/schetser/tegels-zandsteen.jpg';

/**
 * De badkamerschetser.
 *
 * De bezoeker maakt een foto van zijn eigen badkamer, kiest een afwerking en
 * krijgt binnen enkele ogenblikken een ontwerp terug. Het rekenwerk gebeurt
 * niet hier: de foto gaat naar /api/schets, die hem doorgeeft aan de agent op
 * de pc van AB. Daar wordt de prompt gebouwd en laat Artlist het beeld maken.
 *
 * Vóór de eerste foto staat er een voorbeeldbadkamer waarop de vier
 * afwerkingen al te zien zijn. Dat kost per bezoeker niets en laat meteen zien
 * wat de knop doet — anders moet iemand eerst zijn badkamer fotograferen om te
 * ontdekken of het de moeite is.
 */
type Sleutel = 'tegels' | 'meubel' | 'kranen' | 'opstelling';
type Keuze = { sleutel: string; naam: string; onder: string };
type As = { sleutel: Sleutel; vraag: string; keuzes: Keuze[] };

/** De voorbeeldbeelden horen bij de tegelkeuzes van de eerste as. */
const VOORBEELD: Record<string, string> = {
  betonlook, antraciet, marmerlook, zandsteen,
};

const ASSEN: As[] = [
  {
    sleutel: 'tegels', vraag: 'Tegels',
    keuzes: [
      { sleutel: 'betonlook', naam: 'Betonlook grijs', onder: 'rustig en tijdloos' },
      { sleutel: 'antraciet', naam: 'Antraciet', onder: 'donker en strak' },
      { sleutel: 'marmerlook', naam: 'Marmerlook wit', onder: 'licht en ruim' },
      { sleutel: 'zandsteen', naam: 'Beige zandsteen', onder: 'warm van toon' },
    ],
  },
  {
    sleutel: 'meubel', vraag: 'Meubel',
    keuzes: [
      { sleutel: 'eiken', naam: 'Eiken', onder: 'warm hout' },
      { sleutel: 'wit', naam: 'Mat wit', onder: 'licht en sober' },
      { sleutel: 'antraciet', naam: 'Antraciet', onder: 'donker accent' },
      { sleutel: 'walnoot', naam: 'Walnoot', onder: 'dieper van kleur' },
    ],
  },
  {
    sleutel: 'kranen', vraag: 'Kranen en douchewand',
    keuzes: [
      { sleutel: 'zwart', naam: 'Mat zwart', onder: 'strak en modern' },
      { sleutel: 'chroom', naam: 'Chroom', onder: 'klassiek' },
      { sleutel: 'goud', naam: 'Geborsteld goud', onder: 'warm accent' },
      { sleutel: 'rvs', naam: 'RVS', onder: 'sober' },
    ],
  },
  {
    sleutel: 'opstelling', vraag: 'Opstelling',
    keuzes: [
      { sleutel: 'houden', naam: 'Indeling houden', onder: 'alles blijft staan' },
      { sleutel: 'inloopdouche', naam: 'Inloopdouche', onder: 'bad eruit' },
      { sleutel: 'bad', naam: 'Bad', onder: 'ligbad terug' },
      { sleutel: 'beide', naam: 'Bad en douche', onder: 'als het past' },
    ],
  },
];

/** Verkleint een foto in de browser: sneller op 4G en genoeg voor het model. */
async function verklein(bestand: File): Promise<string> {
  const beeld = await createImageBitmap(bestand, { imageOrientation: 'from-image' });
  const schaal = Math.min(1, 1400 / Math.max(beeld.width, beeld.height));
  const doek = document.createElement('canvas');
  doek.width = Math.round(beeld.width * schaal);
  doek.height = Math.round(beeld.height * schaal);
  doek.getContext('2d')!.drawImage(beeld, 0, 0, doek.width, doek.height);
  return doek.toDataURL('image/jpeg', 0.82);
}

export default function Schetser() {
  const [keuzes, setKeuzes] = useState<Record<Sleutel, string>>({
    tegels: 'betonlook', meubel: 'eiken', kranen: 'zwart', opstelling: 'houden',
  });
  const [eigenFoto, setEigenFoto] = useState<string | null>(null);
  const [materiaal, setMateriaal] = useState<string | null>(null);
  const [ontwerp, setOntwerp] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const camera = useRef<HTMLInputElement>(null);
  const galerij = useRef<HTMLInputElement>(null);
  const staal = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Object.values(VOORBEELD).forEach((b) => { const i = new Image(); i.src = b; });
  }, []);

  const neemFoto = async (e: React.ChangeEvent<HTMLInputElement>, waar: 'foto' | 'staal') => {
    const bestand = e.target.files?.[0];
    e.target.value = '';
    if (!bestand) return;
    setFout(null);
    try {
      const klein = await verklein(bestand);
      if (waar === 'foto') { setEigenFoto(klein); setOntwerp(null); } else setMateriaal(klein);
    } catch {
      setFout('Die foto konden we niet lezen. Maak er een met de knop hierboven.');
    }
  };

  const ontwerpen = async () => {
    if (!eigenFoto || bezig) return;
    setBezig(true);
    setFout(null);
    try {
      const res = await fetch('/api/schets', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ foto: eigenFoto, keuzes, eigenMateriaal: materiaal }),
      });
      const gegevens = await res.json();
      if (!res.ok) setFout(gegevens.fout || 'Het ontwerpen lukte niet. Probeer het opnieuw.');
      else setOntwerp(gegevens.beeld);
    } catch {
      setFout('Geen verbinding. Probeer het zo nog eens.');
    } finally {
      setBezig(false);
    }
  };

  const teTonen = ontwerp ?? eigenFoto ?? VOORBEELD[keuzes.tegels];

  return (
    <section className="pc-schets" id="schetser">
      <div className="pc-vat pc-midden">
        <h2 className="pc-h2--midden">Zie uw badkamer<br />in een nieuwe afwerking</h2>
        <p className="pc-schets-sub">
          <strong>Gratis ontwerp, in enkele ogenblikken.</strong> Maak een foto van uw badkamer,
          kies een afwerking en u ziet meteen hoe het kan worden.
        </p>
      </div>

      <div className="pc-vat">
        <figure className="pc-schets-beeld">
          <img src={teTonen} alt={ontwerp ? 'Ontwerp van uw badkamer' : eigenFoto ? 'Uw badkamer' : 'Voorbeeldbadkamer'} />
          {bezig && (
            <div className="pc-schets-bezig">
              <span className="pc-schets-balk"><i /></span>
              Wij ontwerpen uw badkamer…
            </div>
          )}
          <figcaption>{ontwerp ? 'Uw ontwerp' : eigenFoto ? 'Uw foto' : 'Voorbeeldbadkamer'}</figcaption>
        </figure>

        <div className="pc-schets-opname">
          <button type="button" className="pc-knop pc-knop--accent" onClick={() => camera.current?.click()}>
            Maak een foto<IcPijl />
          </button>
          <button type="button" className="pc-knop pc-knop--rand" onClick={() => galerij.current?.click()}>
            Foto toevoegen<IcPijl />
          </button>
          {/* capture opent de camera-app; zonder dat kenmerk komt de bezoeker in
              zijn fotomap terecht. Beide knoppen staan er, want niet iedereen
              staat in de badkamer als hij dit leest. */}
          <input ref={camera} type="file" accept="image/*" capture="environment"
            hidden onChange={(e) => neemFoto(e, 'foto')} />
          <input ref={galerij} type="file" accept="image/*"
            hidden onChange={(e) => neemFoto(e, 'foto')} />
        </div>

        {ASSEN.map((as) => (
          <div className="pc-schets-as" key={as.sleutel}>
            <h3>{as.vraag}</h3>
            <div className="pc-schets-keuzes" role="group" aria-label={as.vraag}>
              {as.keuzes.map((k) => (
                <button key={k.sleutel} type="button"
                  className={keuzes[as.sleutel] === k.sleutel ? 'is-aan' : undefined}
                  aria-pressed={keuzes[as.sleutel] === k.sleutel}
                  onClick={() => setKeuzes((v) => ({ ...v, [as.sleutel]: k.sleutel }))}>
                  {as.sleutel === 'tegels' && (
                    <span className="pc-schets-staal" aria-hidden="true"
                      style={{ backgroundImage: `url(${VOORBEELD[k.sleutel]})` }} />
                  )}
                  <strong>{k.naam}</strong>
                  <span>{k.onder}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pc-schets-eigen">
          <p>
            Staat uw materiaal er niet bij? Voeg er een foto van toe — uit de winkel of van
            een webpagina. Wij ontwerpen ermee.
          </p>
          <button type="button" className="pc-knop pc-knop--rand" onClick={() => staal.current?.click()}>
            {materiaal ? 'Ander materiaal kiezen' : 'Eigen materiaal toevoegen'}<IcPijl />
          </button>
          <input ref={staal} type="file" accept="image/*" hidden onChange={(e) => neemFoto(e, 'staal')} />
          {materiaal && <img className="pc-schets-mini" src={materiaal} alt="Uw gekozen materiaal" />}
        </div>

        {fout && <p className="pc-schets-fout">{fout}</p>}

        <div className="pc-schets-doen">
          <button type="button" className="pc-knop pc-knop--accent" disabled={!eigenFoto || bezig}
            onClick={ontwerpen}>
            {bezig ? 'Bezig…' : 'Ontwerp mijn badkamer'}<IcPijl />
          </button>
          {!eigenFoto && <span>Maak eerst een foto van uw badkamer.</span>}
        </div>

        <div className="pc-schets-voet">
          <p>
            <strong>Dit is een schets, geen offerte.</strong> Zo kan de afwerking eruitzien.
            Wat er achter de muur nodig is, zien we op het plaatsbezoek.
          </p>
          <a className="pc-knop pc-knop--accent" href="#contact">
            Plan gratis plaatsbezoek<IcPijl />
          </a>
        </div>
      </div>
    </section>
  );
}
