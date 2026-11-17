# Audit Hallmark: Nikba Design System

Data: 17 noiembrie 2026. Skill: [nutlope/hallmark](https://github.com/nutlope/hallmark), v2.0.0, commit `04977e15f3dfd6ee4b74c887dac3eb52665d6c92`.

Am auditat catalogul web și landingul, apoi am reparat defectele confirmate. Am păstrat sistemul vizual existent; nu am transformat documentația într-o pagină promoțională nouă. Raportul consemnează auditul înainte de pregătirea release-ului 1.1.1.

## Pre-flight

- Sistem blocat: `DESIGN.md:5`, Nikba Liquid Glass, calm și precis.
- Font: Onest, cu fallback de sistem, `DESIGN.md:48` și `src/tokens/foundations.json:8`.
- Paletă: Frost, Mist și Graphite, mapări semantice, `DESIGN.md:15` și `src/tokens/foundations.json:78`.
- Spațiere și containere: scară de 4px, container de 1280px, `DESIGN.md:66`.
- Mișcare: L2 și preferință pentru mișcare redusă, `DESIGN.md:7`, `src/foundations/motion.css:1`.
- Implementare: Vite, HTML multipagină, CSS și JavaScript fără framework; `package.json:98`, `vite.playground.config.js`.
- Material real: componentele executabile ale bibliotecii, sursele Swift/Kotlin și documentația existentă. Public dedus: dezvoltatori care instalează biblioteca și caută exemple de integrare.
- Păstrate: font, teme, tokenuri, rute, API-uri, formulare și conținut tehnic.
- Introduse: navigare statică, CSS disponibil fără modulul JS, corecții responsive și test automat de reziliență.

## Constatări și reparații

| Problemă confirmată | Reparație |
| --- | --- |
| Navigarea era construită numai în browser | Vite livrează navigarea completă și destinația curentă în HTML, în development și build. Logo-ul original este încorporat, fără dependență de JS. |
| Stilurile și secțiunile reveal depindeau de JavaScript | Stylesheet explicit pe toate cele 35 de pagini; conținut vizibil implicit. |
| Descărcările native ieșeau din viewport la lățimi intermediare | Rând flexibil, etichete mai scurte și controale încadrate în container. Toate cele cinci fișiere rezolvă către surse reale. |
| Panoul mobil de aspect acoperea conținutul | Disclosure nativ „Appearance”, închis implicit pe mobil, operabil cu tastatura. |
| Hero prea înalt și acțiuni greu de urmărit | Spațiere redusă, acțiuni grupate și un singur flux de lectură. Titlul, descrierea și acțiunea primară încap la 1280×800. |
| Culori de cod pentru Graphite aplicate și pe fundal deschis | Selector de temă corect și culori mutate în blocuri de tokenuri. |
| Contrast insuficient în etichete și jurnalul de evenimente | Roluri de text mai lizibile; starea Stable nu mai folosește verdele la limita contrastului. |
| Focusul selectorului folosea o umbră animată | Contur instant, inclusiv pentru eroare; eliminarea tranziției umbrei. |
| Chip și Checkbox animau dimensiuni | Animații limitate la opacitate și transformare. |
| Paginare și bare de cod ieșite din spațiul disponibil | Încadrare pe rânduri și bare de copiere flexibile. |
| Search Filter se baza numai pe lățimea ferestrei | Adaptare prin container queries la lățimea reală a componentei. |
| Grile cu minimum implicit prea mare | `minmax(0, 1fr)` pentru coloanele relevante. |
| Exemplul de layout avea etichete înghesuite pe telefon | Două coloane explicite în specimenul mobil, fără schimbarea comportamentului public `.nds-grid`. |
| Etichete decorative, săgeți textuale și fundaluri ambientale | Etichete mutate după titlu, metadate fără capitale spațiate, eliminarea ornamentelor redundante. Faptele sunt păstrate. |

## Verificare

- `npm run verify`: build bibliotecă și catalog, suita completă, consumatorul pachetului și pack dry-run — trecute.
- `npm run test:catalog-resilience`: 35 de rute × 8 lățimi (320, 375, 390, 414, 768, 1024, 1280, 1920), controale neclippate, navigare și stiluri fără JavaScript pe toate paginile, teme, glass, surse native, fold, mișcare redusă și focus — trecute.
- `npm run test:cross-browser`: Chromium, Firefox și WebKit — trecut.
- `npm run test:browser`: șase capturi — trecut. Referințele vizuale au fost actualizate după inspecția schimbărilor intenționate; pragurile și aserțiunile existente nu au fost relaxate.
- Build GitHub Pages și `npm run test:pages`: toate cele 35 de pagini — trecute.
- Revizie independentă Hallmark, în context nou: un defect de layout mobil, reparat și recapturat. Captura este `review/fixed-layout-home-phone-part.png`.
- Sursele native executabile nu au fost modificate; auditul nu pretinde testare nouă în simulatoare iOS/Android.

## Interpretarea rezultatului Hallmark

Rezultat brut inițial: **326 FAIL, 111 REFLEX, 77 WARN**. Rezultat brut final: **23 FAIL, 0 REFLEX, 38 WARN, 68 NOTE**. Scanarea finală vede și CSS-ul bibliotecii prin stylesheet-ul explicit; cifrele inițiale și finale nu reprezintă un scor vizual direct comparabil.

Nu raportez „Hallmark 100% pass”. Cele 23 de alerte rămase sunt inventariate în `assessments.json`:

| Gate | Număr | Interpretare |
| --- | ---: | --- |
| 19 | 3 | Intervalele numerice și numele tehnic al variantei Card „Elevated”, nu copy promoțional. |
| 54 | 10 | Etichete din specimenele componentelor publice, inclusiv Card eyebrow. |
| 39a | 3 | Analiza locală nu urmărește atributul `disabled` al controlului și cursorul părintelui când verifică pseudo-elementul/fratele vizual. |
| 63 | 1 | Exemplu tehnic cu valorile platformei MCP. |
| 67 | 6 | Rolul public Label și etichete scurte permise explicit de specificația Nikba. |

Acestea sunt limite de analiză sau reguli de stil pentru landing aflate în conflict cu materialul demonstrativ și `DESIGN.md`, care are prioritate în Hallmark. Nu le-am mascat prin modificarea linterului și nu am eliminat API-uri documentate pentru a obține un scor artificial.

Cele 38 de avertismente au evaluări individuale în `assessments.json`. Principalele categorii: culori moștenite semantic; indicator de selecție evaluat în starea greșită; dimensiuni și iconuri demonstrate intenționat; greutățile Onest documentate; consistența suprafețelor; tabele scrollabile cu prima coloană fixată; schimbarea separatoarelor din titluri și încorporarea aceluiași logo. Documentația amplă este păstrată deoarece utilizatorul a cerut toate informațiile în landing.

## Păstrarea conținutului

Comparația automată confirmă **155/155 linkuri, 19/19 câmpuri, 3/3 handlers și 1/1 figuri**. Din 55 de titluri, 50 sunt identice textual; celelalte cinci sunt titlul de instalare reformulat și patru schimbări de separator, fără pierderea informațiilor despre platforme. Logo-ul este același fișier SVG, livrat acum inline ca imagine.

Listele schimbărilor inițiale de etichete și punctuație sunt în `copy-changes.json` și `punctuation-changes.json`; formulările finale se văd în diff. Fișierele mari de captură nu sunt incluse în Git. Comparația locală este `compare.html`, iar constatările brute sunt în `findings.txt`.
