---
name: Saint Tropez Confeitaria
description: The facade on Rua Piracema as a page. White pyramid relief under a moving sun, a turquoise canopy, cocoa lettering.
colors:
  turquoise-canopy: "#0cb1ad"
  turquoise-lit: "#19c2bd"
  turquoise-fascia: "#08807c"
  turquoise-ink: "#066b68"
  cocoa-lettering: "#2a1a14"
  cocoa-soft: "#4e3a31"
  seal-gold: "#b8924a"
  relief-wall: "#eef0ec"
  relief-lit: "#f8f9f6"
  relief-shade: "#d6dcd7"
  night-wall: "#0c1f21"
  night-panel: "#12302f"
  night-floor: "#081617"
  night-ink: "#e9f1ef"
  night-muted: "#a7bdb9"
typography:
  display:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(2.5rem, 1.5rem + 4.2vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Gloock, 'Times New Roman', serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.8vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "'Figtree Variable', Figtree, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)"
    fontWeight: 450
    lineHeight: 1.55
  body:
    fontFamily: "'Figtree Variable', Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 450
    lineHeight: 1.6
  label:
    fontFamily: "'Figtree Variable', Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  control:
    fontFamily: "'Figtree Variable', Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.005em"
rounded:
  hairline: "2px"
  control: "3px"
  pill: "999px"
  circle: "50%"
  arch: "50% 50% 0 0 / 40% 40% 0 0"
spacing:
  s1: "0.5rem"
  s2: "0.75rem"
  s3: "1rem"
  s4: "1.5rem"
  s5: "2rem"
  s6: "3rem"
  s7: "4.5rem"
  s8: "7rem"
  s9: "10rem"
  gutter: "clamp(16px, 4vw, 56px)"
  max: "1440px"
components:
  button-canopy:
    backgroundColor: "{colors.turquoise-canopy}"
    textColor: "{colors.cocoa-lettering}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.45rem calc(0.85rem + 4px)"
    height: "52px"
  button-canopy-hover:
    backgroundColor: "{colors.turquoise-lit}"
    textColor: "{colors.cocoa-lettering}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.cocoa-lettering}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.45rem"
    height: "52px"
  button-line-hover:
    backgroundColor: "{colors.cocoa-lettering}"
    textColor: "{colors.relief-lit}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.night-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1.45rem"
    height: "52px"
  shelf-tab:
    backgroundColor: "transparent"
    textColor: "{colors.cocoa-lettering}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.75rem 0.5rem 1rem"
    height: "44px"
  shelf-tab-active:
    backgroundColor: "{colors.cocoa-lettering}"
    textColor: "{colors.turquoise-lit}"
  status-plaque:
    backgroundColor: "{colors.relief-lit}"
    textColor: "{colors.cocoa-lettering}"
    padding: "1rem 1.5rem 1rem 1rem"
  map-load:
    backgroundColor: "{colors.night-panel}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.control}"
    padding: "0.9rem 1.1rem"
    height: "72px"
  icon-button-round:
    backgroundColor: "{colors.relief-lit}"
    textColor: "{colors.cocoa-lettering}"
    rounded: "{rounded.circle}"
    size: "56px"
---

# Design System: Saint Tropez Confeitaria

## Overview

**Creative North Star: "The Facade on Rua Piracema"**

The page is the building. Its ground is the shop's white wall of diamond pyramids, drawn live on a fixed canvas and lit by a sun that crosses it as the visitor scrolls, from a grazing dawn light at the top to night at the address block. Everything else is set into that wall the way the real facade carries its fittings: a turquoise canopy for the main action, cocoa lettering for every word, photographs framed as windows (arch-topped, square, or plain), and a thin gold ring around the seal.

Density is low and theatrical. Sections are separated by changes of material rather than by rules: the lit wall (hero, salão frames, casa, Instagram), the turquoise field of the vitrine, the full-bleed salão photograph revealed through a widening arch, and the night wall of the visit block and footer. Type is large and quiet; the serif speaks in one weight only, and the sans does the practical work.

Motion is about light and openings, not about bouncing content: the sun's position, clip-path reveals that open from the bottom like a shutter, images settling from a slight zoom, and a pinned horizontal shelf for the vitrine on desktop. Every motion path has a still equivalent under reduced motion, and the page renders fully without JavaScript.

**Key Characteristics:**
- A live, sun-lit relief canvas as the page ground; no flat day background.
- Turquoise used as fields and the canopy button, with cocoa type on it.
- Photos as windows set into the wall, with cocoa-tinted cast shadows.
- Gloock at 400 for all display and heading type; Figtree for UI and body.
- Day-to-night progression down the page, ending on the night wall.

## Colors

A cool white wall, one saturated turquoise, a dark cocoa for every letter, a night teal for evening, and gold used as a thread.

### Primary
- **Canopy Turquoise** (turquoise-canopy): the shop's canopy and seal color. Fills the vitrine section, the primary "Como chegar" button, the open-status dot, the mobile menu, the Instagram highlight rings and the header while it crosses the vitrine.
- **Lit Turquoise** (turquoise-lit): hover state of the canopy button; turquoise accent text on dark grounds (today's row in the hours table, footer column headings, lightbox category, map affordance).
- **Fascia Turquoise** (turquoise-fascia): the thickness of the canopy, drawn as the 4px inset bottom edge of the canopy button; also the backing color behind vitrine photos while they load.
- **Legible Turquoise** (turquoise-ink): the only turquoise allowed as text on the white wall (brand "confeitaria" line, form accent and caret color).

### Secondary
- **Cocoa Lettering** (cocoa-lettering): all primary text, outlines of line buttons and shelf tabs, focus rings on light grounds, scrollbar thumb partner. It is also the text color on turquoise.
- **Soft Cocoa** (cocoa-soft): lead paragraphs, captions, addresses and other secondary text on the wall.

### Tertiary
- **Seal Gold** (seal-gold): a 1px hairline ring around the round seal (header and footer), the 1px left edge of the hero status plaque, and the closed-state status dot. Nothing else.

### Neutral
- **Relief Wall** (relief-wall): page background and base tone of the canvas relief.
- **Lit Relief** (relief-lit): the sunlit face of a pyramid; window frames and mats, the status plaque, round icon buttons, the scrolled header (at 94% opacity), text on cocoa buttons.
- **Shaded Relief** (relief-shade): the shadow face of a pyramid; fascia edge of the inverted canopy button inside the turquoise menu.
- **Night Wall** (night-wall): the visit block, painted with the same relief tile lit from below at night.
- **Night Panel** (night-panel): raised panels on the night wall (the map loader).
- **Night Floor** (night-floor): the footer, one step darker than the night wall, and the matching inner ring of the footer seal.
- **Night Ink** (night-ink): primary text on all dark grounds, and the lightbox.
- **Night Muted** (night-muted): secondary text, hours values and notes on dark grounds.

### Named Rules
**The Canopy Rule.** Full turquoise is a field or a canopy, never text on the white wall. On white, turquoise text is Legible Turquoise; on turquoise, text is cocoa.

**The Gold Thread Rule.** Gold is a 1px line or a status dot. It is never a fill, a text color, or a button.

**The Day to Night Rule.** The page moves from lit wall to turquoise to night. Night colors belong to the visit block, the footer, the salão overlay and the lightbox; they do not appear above the visit block as accents.

## Typography

**Display Font:** Gloock (with 'Times New Roman', serif)
**Body Font:** Figtree Variable (with Figtree, system-ui, sans-serif)

**Character:** Gloock is the shop sign: a high-contrast serif used only at weight 400, set tight (-0.015em to -0.025em) and balanced. Figtree is the counter staff: warm, clear, set at a slightly heavy 450 for body and 600 to 650 for anything you press or scan.

### Hierarchy
- **Display** (400, clamp(2.75rem, 1.6rem + 4.8vw, 6rem), 0.95): the hero line only, max 11ch, revealed line by line.
- **Headline** (400, clamp(2.5rem, 1.5rem + 4.2vw, 5.25rem), 0.98): section titles. The street name in the visit block and the Instagram handle use larger one-line variants of the same role.
- **Title** (400, clamp(1.9rem, 1.4rem + 1.8vw, 2.75rem), 1): shelf names in the vitrine (up to 4rem on the pinned desktop rail). Gloock at clamp(1.6rem, 1.15rem + 1.5vw, 2.4rem) also sets the house-rules list and the "also in the house" list, as lettering rather than bullets.
- **Lead** (450, clamp(1.0625rem, 1rem + 0.35vw, 1.25rem), 1.5 to 1.6): the paragraph under a heading, 40 to 52ch.
- **Body** (450, 1.0625rem, 1.6; 1rem under 760px): running text.
- **Label** (600, 0.875rem, 1.4): captions, status, notes, footer column headings.
- **Control** (650, 1rem, 1.2): buttons, nav links (600, 0.975rem), tabs.

### Named Rules
**The One Weight Rule.** Gloock is set at 400 only. Emphasis in display type comes from size and position, never from bold or italic.

**The Sign and Counter Rule.** Gloock never sets a button, a label or a form value (the large links of the mobile menu are its one clickable use); Figtree never sets a section title.

## Layout

A 12-column grid (column gap 1.5rem) inside a 1440px container with a fluid gutter (clamp(16px, 4vw, 56px)). Compositions are asymmetric: the hero copy holds columns 1 to 7 and the windows 8 to 12; the salão frames stagger across the grid with negative and positive vertical offsets; the Instagram strip drops alternate tiles by 3rem. Sections breathe with large vertical padding from the spacing scale (4.5rem, 7rem, 10rem), and the header is fixed at 76px (64px under 760px).

Breakpoints in use: 1180px (header status hides), 1023px/1024px with a 620px height floor (vitrine switches between a pinned horizontal rail and per-shelf horizontal snap scrolling), 960px (single column, mobile menu), 860px (footer to two columns), 760px (tighter header and body size), 520px (full-width buttons, static captions). Horizontal scrollers bleed to the screen edge by cancelling the gutter and re-padding inside.

## Elevation & Depth

Depth is physical: things set into the wall cast cocoa-tinted shadows onto it, and the wall itself is lit by a sun whose angle and color change with scroll. Shadows are long and soft with large negative spread, so they read as light falling below an object, not as a glow around it. Dark grounds use pure black shadows instead of cocoa.

### Shadow Vocabulary
- **Window shadow** (`box-shadow: 0 34px 60px -34px rgba(42, 26, 20, 0.45), 0 10px 22px -16px rgba(42, 26, 20, 0.3)`): every photo window and frame on the lit wall.
- **Window reveal** (`box-shadow: inset 0 0 0 10px #f8f9f6, inset 0 14px 24px -10px rgba(42, 26, 20, 0.35)`): the white mat and soffit shadow inside an arch window.
- **Canopy** (`box-shadow: inset 0 -4px 0 #08807c, 0 14px 24px -18px rgba(8, 64, 62, 0.8)`): the primary button; it lifts 2px on hover and presses 2px on active, with the fascia thinning to 2px.
- **Plaque** (`box-shadow: 0 1px 0 rgba(42, 26, 20, 0.08), 0 18px 34px -26px rgba(42, 26, 20, 0.45)`): the hero status plaque.
- **Shelf piece** (`box-shadow: 0 30px 50px -36px rgba(20, 40, 38, 0.9)`): vitrine photos on turquoise.
- **Night window** (`box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.7)`): photos on the night wall and in the lightbox.

### Named Rules
**The Cast Light Rule.** A shadow means an object is set into or standing off the wall. Text, flat panels and section backgrounds carry no shadow; ring and inset shadows draw outlines and edges, not elevation.

## Shapes

Photographs are windows: arch-topped (radius 50% 50% 0 0 / 40% 40% 0 0) for the salão, the facade and the night entrance; square with a 10px white mat for the overlapping hero window; plain rectangles for documentary frames and vitrine pieces (2px). The same arch silhouette is the clip-path that opens onto the full-screen salão. Controls are nearly square (3px). Pills (999px) are reserved for shelf tabs, their counts and the lightbox close. Circles are for the seal, the Instagram highlight rings and round icon buttons (zoom, lightbox arrows). Lines are 1.5px for outlines and section underlines, 1px for table and list dividers.

## Components

### Buttons
Character: a canopy you can press.
- **Shape:** nearly square corners (3px), min height 52px, icon after the label with a 0.65rem gap.
- **Canopy (primary):** turquoise fill, cocoa text, 4px fascia edge at the bottom, soft teal cast shadow. Hover: lit turquoise, lifts 2px, icon rises 2px. Active: presses down 2px. Inside the turquoise mobile menu it inverts to a lit-relief fill with a shaded-relief fascia.
- **Line (secondary on light):** transparent with a 1.5px cocoa inset outline. Hover: fills cocoa, text turns lit relief, arrow slides 4px right.
- **Ghost (secondary on night):** night-ink text with a 1.5px outline at 45% night-ink. Hover: outline goes solid with an 8% wash.
- **Arrow link:** inline 650-weight underlined link (1.5px) with a trailing arrow that slides 4px on hover.
- **Focus:** 2px solid outline offset 3px, cocoa on light and turquoise grounds, lit turquoise on night and lightbox.

### Chips
- **Shelf tabs:** pill, 1.5px cocoa inset outline, label plus a cocoa count bubble with tabular numerals. Hover and current: fill cocoa, label lit turquoise, count inverts to turquoise on cocoa.

### Cards / Containers
- **Status plaque:** lit-relief panel with a 1px gold left edge and the plaque shadow; carries the live open status and address.
- **Map loader:** night-panel block (3px), 1.5px night-ink outline at 22%, pin icon and "load map" affordance in lit turquoise; outline turns lit turquoise on hover. The map iframe loads only on request.

### Navigation
- **Header:** transparent over the hero, then lit relief at 94% with a 1px cocoa hairline once scrolled; follows the material under it (turquoise over the vitrine, night over the visit block). Seal (44px, gold hairline ring) plus Gloock name and the spaced lowercase "confeitaria" from the brand lockup.
- **Links:** Figtree 600, 0.975rem, with a 1.5px underline that draws in from the left on hover and for the current section.
- **Mobile:** a turquoise sheet that drops from the top via clip-path, links in Gloock at clamp(2.4rem, 11vw, 3.6rem) rising in a short stagger, address and canopy button in the foot.

### Live Status
A 9px dot plus a 600-weight line: turquoise with a slow expanding ring when open, gold when closed. Appears in the header, the hero plaque and the visit block.

### Signature: Relief and Windows
- **Relief canvas:** a fixed canvas of diamond pyramids (88x76 tile) shaded per light change; scroll moves the sun from a grazing dawn to an overhead flat light and back, then the visit block uses the same tile lit from below at night.
- **Windows:** arch and square frames with a white mat; images reveal from the bottom via clip-path and settle from a 1.14 to 1.18 zoom.
- **Vitrine pieces:** photos on turquoise with a passing glass glint and a round zoom button on hover or focus, opening a full-screen lightbox.

## Do's and Don'ts

### Do:
- **Do** let the relief canvas be the ground of every day section, and wash it with a soft lit-relief radial behind long copy so the pattern never competes with words.
- **Do** set every photograph as a window: arch, matted square, or plain rectangle, with the window shadow on the lit wall.
- **Do** keep the primary action a canopy button: turquoise, cocoa text, 4px fascia, 3px corners.
- **Do** set headings in Gloock 400 with negative tracking and `text-wrap: balance`, and everything interactive in Figtree 600 to 650.
- **Do** carry the day-to-night order: wall, turquoise, salão, night.
- **Do** use the out-expo curve (cubic-bezier(0.16, 1, 0.3, 1)) for state changes and clip-path openings from the bottom for reveals, with a still equivalent under reduced motion.
- **Do** draw icons as inline stroked SVG (1.8 stroke, round caps and joins).

### Don't:
- **Don't** warm the wall toward cream or beige; the ground is a cool white with a green-grey shade.
- **Don't** use turquoise-canopy as text on the white wall, or gold as anything but a hairline or a status dot.
- **Don't** set Gloock in bold or italic, or use it for buttons, labels or captions.
- **Don't** add a second accent color or any background pattern other than the relief. Gradients appear only as light: the wash behind hero copy, the scrim under salão text, the glass glint on vitrine pieces.
- **Don't** use hard offset shadows or glows; shadows are soft and cast downward.
- **Don't** redraw or imitate the script wordmark; use the supplied seal and lockup assets, and reserve the wide-tracked lowercase "confeitaria" for the brand lockup, never as a section label.
- **Don't** use thin or monospace faces.
