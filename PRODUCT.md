# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite (vanilla JS) + GSAP ScrollTrigger + Lenis, static build with relative base, deployed to GitHub Pages from a new repo (APXWeb/saint-tropez-experience). Chosen by the user on 2026-10-13. No backend, no 3D.

## Users

- Primary: people in São Paulo's Zona Norte (and visitors) deciding whether to go to the shop, and what to expect there: what is in the vitrine, what the salão looks like, where it is and when it is open.
- Secondary: the Saint Tropez owners, who will evaluate this as an unsolicited APX Web proposal for their digital presence. Their only current channel is Instagram; their domain confeitariasainttropez.com.br shows an old maintenance page.

## Product Purpose

A brand site for Saint Tropez Confeitaria that makes people want to visit in person, and makes the practical facts (address, hours, house rules) impossible to miss. Success: a visitor understands it is a confeitaria, sees the real products and the real salão, and can open the exact Google Maps place in one tap.

## Positioning

What a neighbouring padaria cannot copy: the actual building and salão (white geometric facade, turquoise canopy, glass-and-white-arch covered salão with palms, white rattan chairs), the turquoise Piaggio-style cake cart and tricycle, the turquoise palm-tree badge and brown script wordmark, gold filigree packaging. The house calls itself "Um novo conceito em confeitaria".

## Operating Context

In-person only. Official Instagram bio (checked 2026-10-13): "Um novo conceito em confeitaria / ATENDIMENTO PRESENCIAL. 6:00 às 22:00 / NÃO FAZEMOS RESERVAS / NÃO FAZEMOS ENTREGAS". Instagram highlights: Clientes, Adega, Bolos e doces, Cafés, Ilha de frios, Localização.

## Capabilities and Constraints

- Verified on the Google Business profile (2026-10-13): R. Piracema, 221, Santa Teresinha, São Paulo, SP, 02460-040; hours dom-qui 06:00-22:00, sex-sáb 06:00-23:00; no phone listed; website field points to Instagram; 4,6 stars from 6.342 reviews; Maps CID 42194893093639372; coords -23.4911958, -46.6372651.
- Divergences: the old APX proposal, the company registry (CNPJ), Waze and BaresSP list nº 211. The site shows 221 (Google) but the address is NOT definitively validated until the house confirms. Hours match the user's survey of 2026-10-13; the Instagram bio says only "6:00 às 22:00".
- Internal reference (src/data/internal.js, never rendered): opening year 2020 (press) vs CNPJ 2019; customer parking per one listing (free/valet unknown); 21 item names from user-submitted historic menus, not current, prices not recorded.
- No reservations, no delivery, no phone orders: never add forms, order flows, WhatsApp or phone CTAs. One user-approved exception (2026-10-14): the `#reserva` section is a reservation DEMO modelled on the Famiglia Mancini proposal, to present to the house. It must stay labelled as a preview that says the house does not take reservations today, and it sends to the APX Web provisional WhatsApp in `site.booking` until the house gives its own channel. Remove the demo label only when the house confirms it takes reservations.
- Unconfirmed, do not publish: founding year, parking, "Côte d'Azur" inspiration, "artesanal", own-brand claims, product names from directories or historic menus, any price.

## Brand Commitments

- Name: Saint Tropez Confeitaria. Instagram @sainttropezconfeitaria.
- Turquoise palm badge, script "Saint Tropez" wordmark with spaced "confeitaria", turquoise + white, gold ornament on packaging. Only low-res logo files exist (256 px badge, 356 px lockup); do not redraw or fake the script wordmark.
- APX Web copy conventions: no em dashes in visible text; never invent client facts.

## Evidence on Hand

30 real photos from the house's Instagram (watermarked with their badge, top-left), ~1170 px square-ish, one 1920 px salão wide shot; in `assets-src/` (copied from the old proposal repo APXWeb/saint-tropez-confeitaria and its git history). Subjects: facade (2), exterior at night, covered salão (3), cake cart, tricycle, pastry/bread vitrines (3), croissants (2), cakes (3), plated sweets, fruit cup, salgados (3), sandwiches (2), lunch plates (4). No coffee, wine, adega or frios photos exist even though those are confirmed highlights. No testimonials, prices, or menu.

## Product Principles

1. Real over generic: every image is the house's own, every fact traceable to Google or Instagram.
2. Visiting is the goal: location and hours are never more than one tap away.
3. The building is part of the product: the salão gets as much stage as the cakes.
4. Say less, verify more: missing facts are omitted, not approximated.

## Accessibility & Inclusion

WCAG 2.1 AA contrast, full keyboard use, visible focus, prefers-reduced-motion respected, alt text on every photo.
