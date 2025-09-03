import * as React from 'react'
import {
  DefaultToolbar, DefaultToolbarContent,
  DefaultStylePanel, DefaultStylePanelContent,
  TldrawUiMenuItem, useTools, useRelevantStyles,
  useEditor, useDefaultColorTheme, DefaultColorStyle,
} from 'tldraw'
import type {
  TLComponents, TLUiOverrides, TLUiAssetUrlOverrides, TLDefaultColorStyle
} from 'tldraw'
import { createPortal } from 'react-dom'


// icon mapping stays the same
// src/ui-overrides.tsx (top)


export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools.stamp = {
      id: 'stamp',
      label: 'Stamp',
      icon: 'stamp-icon',
      kbd: 's',
      readonlyOk: true,
      onSelect: () => editor.setCurrentTool('stamp'), // ← important
    }
    return tools
  },
}

/** ONE button: toggles the style sheet AND shows current colour as an overlay dot */
function StyleButton() {
  const [open, setOpen] = React.useState(false)
  const editor = useEditor()
  const styles = useRelevantStyles()
  const theme = useDefaultColorTheme()

  // ✅ Read the colour from the current selection (if any)
  const selectedColour = styles?.get?.(DefaultColorStyle)?.value as TLDefaultColorStyle | undefined


  // ✅ Remember the last seen colour so the swatch has a value even with no selection
  const [lastColour, setLastColour] = React.useState<TLDefaultColorStyle>('light-blue')
  React.useEffect(() => {
    if (selectedColour) setLastColour(selectedColour)
  }, [selectedColour])

  // Use selection colour when available; otherwise fall back to the last one we saw
  const current = selectedColour ?? lastColour
  const hex = theme[current].solid

  // close on Esc
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])



  return (
    <>
      {/* fixed-size slot so the toolbar layout doesn't change */}
      <div
        data-kevin="colour-wrapper"   // ← add this
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: 32,
          height: 32,
          flex: '0 0 32px',   // 👈 freeze flex-basis
          margin: '0 2px',    // 👈 match tldraw’s gap
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <TldrawUiMenuItem
          id="kevin-colour"     // 👈 avoid colliding with any built-in ids
          label="Style"
          icon="blank-icon"
          onSelect={() => setOpen(v => !v)}
          style={{
            width: 32,
            height: 32,
            padding: 0,
            margin: 0,
            flex: '0 0 32px',
            boxSizing: 'border-box',
            outline: 'none',
            border: 'none',
          }}
        />

        {/* single colour circle, centred */}
        <div
        style={{
          position: 'absolute',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: hex,
          border: '1px solid rgba(0,0,0,0.25)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
        title={`Colour: ${current}`}
        />
        </div>

        {/* your bottom sheet unchanged */}
        {open && createPortal(
          // full-screen backdrop: clicking it closes
          <div
            onPointerDown={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.15)',
              zIndex: 10000,
            }}
          >
          {/* CONTAINER: allow clicks to pass through to backdrop */}
          <div
            // was stopping events before — remove that
            style={{
              position: 'absolute',
              left: 0,
              right: 260, // keep if you want to avoid the toolbar area; use 0 for full width
              bottom: 45,
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 12px calc(12px + env(safe-area-inset-bottom))',
              pointerEvents: 'none',        // ← important: don't eat clicks
            }}
          >
            {/* CARD: only the panel itself should block closing */}
            <div
              onPointerDown={(e) => e.stopPropagation()} // clicks inside don't close
              style={{
                pointerEvents: 'auto',
                background: '#fff',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
            <DefaultStylePanel isMobile>
              <DefaultStylePanelContent styles={styles ?? undefined} />
            </DefaultStylePanel>
            </div>
        </div>
      </div>,
      document.body
    )}
            </>
        )
}



export const components: TLComponents = {
  // NEW: dark navy canvas
  Background: () => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0F1D3D', // 紺色-ish; tweak as desired
      }}
    />
  ),
  Overlays: () => (
    <style>{`
      /* ---- App theme tokens ---- */
      :root {
        --kevin-bg: #0F1D3D;      /* canvas/navy */
        --kevin-panel: #132A4A;   /* panels/toolbars */
        --kevin-panel-hi: #1A3B6B;/* hover/active */
        --kevin-border: rgba(255,255,255,0.14);
        --kevin-text: #fff;
        --kevin-muted: rgba(255,255,255,0.7);
      }

    /* ---- Make ALL tldraw UI icons white (they use mask + background) ---- */
    .tlui-toolbar-container .tlui-icon,
    .tlui-popover__content .tlui-icon {
      background: #fff !important;
    }


    [data-testid="style.color"] .tlui-icon {
      background: currentColor !important;  /* mask fills with that inline colour */
    }

    /* ---- Toolbar & overflow panel surfaces ---- */
    .tlui-toolbar-container {
      background: var(--kevin-panel) !important;
      color: var(--kevin-text) !important;
      border: 1px solid var(--kevin-border) !important;
      backdrop-filter: blur(6px);
    }
    .tlui-popover__content {
      background: var(--kevin-panel) !important;
      color: var(--kevin-text) !important;
      border: 1px solid var(--kevin-border) !important;
    }
    /* button borders (where applicable) */
    .tlui-button,
    .tlui-button:focus-visible {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--kevin-border) !important;
    }

    /* ---- Menus & grid of overflow tools ---- */
    .tlui-buttons__grid { color: var(--kevin-text) !important; }

    /* ---- Tooltips, small text, etc. (optional) ---- */
    .tlui-kbd, .tlui-help-text, .tlui-label { color: var(--kevin-muted) !important; }

    /* ===== NAVIGATION / ZOOM (bottom-right) ===== */
    .tlui-navigation-zone,
    .tlui-navigation-zone * {
      color: var(--kevin-text) !important;
    }
    .tlui-navigation-zone .tlui-icon {
      background: #fff !important; /* white zoom +/- and other glyphs */
    }
    /* the little percentage label (e.g. 100%) sometimes isn’t a button */
    .tlui-navigation-zone [data-testid*="zoom"],
    .tlui-navigation-zone [data-testid*="percent"] {
      color: var(--kevin-text) !important;
    }

    /* ===== TOP BAR / PAGE MENU / HAMBURGER ===== */
    /* make the whole top zone use white text */
    .tlui-layout__top,
    .tlui-layout__top * {
      color: var(--kevin-text) !important;
      border-bottom-right-radius: 3px;
    }
    /* white icons in top bar */
    .tlui-layout__top .tlui-icon { background: #fff !important; }

    /* dropdown/popup menus opened from the top bar (page menu, hamburger) */
    .tlui-popover__content,
    .tlui-context-menu__content,
    .tlui-dropdown-menu__content {
      background: var(--kevin-panel) !important;
      color: var(--kevin-text) !important;
      border: 1px solid var(--kevin-border) !important;
    }
    /* ensure items inside those menus inherit the white text */
    .tlui-popover__content .tlui-button,
    .tlui-context-menu__content .tlui-button,
    .tlui-dropdown-menu__content .tlui-button {
      color: var(--kevin-text) !important;
    }
    .tlui-popover__content .tlui-icon,
    .tlui-context-menu__content .tlui-icon,
    .tlui-dropdown-menu__content .tlui-icon {
      background: #fff !important;
    }
    /* subtle hover/active in menus */
    .tlui-popover__content .tlui-button:hover,
    .tlui-context-menu__content .tlui-button:hover,
    .tlui-dropdown-menu__content .tlui-button:hover,
    .tlui-popover__content .tlui-button[data-isactive="true"],
    .tlui-context-menu__content .tlui-button[data-isactive="true"],
    .tlui-dropdown-menu__content .tlui-button[data-isactive="true"] {
      background: var(--kevin-panel-hi) !important;
    }

      button#kevin-colour {
        width:32px !important;
        min-width:32px !important;
        height:32px !important;
        padding:0 !important;
        margin:0 2px !important;
        flex:0 0 32px !important;
      }
      button#kevin-colour[data-state="open"] {
        width:32px !important;
      }
      [data-testid="tools.more-content"] [data-kevin="colour-wrapper"] {
        display: none !important;
      }
      .tl-watermark_SEE-LICENSE{
        display: none !important;
      }

      /* Menu/group headings inside popovers & dropdowns */
      .tlui-popover__content .tlui-dropdown-menu__label,
      .tlui-popover__content .tlui-menu__label,
      .tlui-dropdown-menu__content .tlui-dropdown-menu__label,
      .tlui-dropdown-menu__content .tlui-menu__label,
      .tlui-popover__content h1, .tlui-popover__content h2,
      .tlui-popover__content h3, .tlui-popover__content h4,
      .tlui-dropdown-menu__content h1, .tlui-dropdown-menu__content h2,
      .tlui-dropdown-menu__content h3, .tlui-dropdown-menu__content h4 {
        color: var(--kevin-text) !important;
      }

      /* Bottom-right navigation / zoom */
      .tlui-layout__bottom,
      .tlui-layout__bottom * {
        color: var(--kevin-text) !important;
        border-top-right-radius: 9px;
      }

      /* Zoom +/- icons (mask → white) */
      [title*="Zoom in"] .tlui-icon,
      [title*="Zoom out"] .tlui-icon,
      [data-testid*="zoom-in"] .tlui-icon,
      [data-testid*="zoom-out"] .tlui-icon {
        background: #fff !important;
      }

      /* Zoom percentage text */
      [data-testid*="zoom"],
      [data-testid*="percent"],
      [aria-label*="%"],
      [title*="%"] {
        color: var(--kevin-text) !important;
      }

      /* Any navigation popover/dropdown content */
      .tlui-popover__content[data-testid*="navigation"],
      .tlui-dropdown-menu__content[data-testid*="navigation"],
      .tlui-popover__content[id*="navigation"],
      .tlui-dropdown-menu__content[id*="navigation"] {
        background: var(--kevin-panel) !important;
        color: var(--kevin-text) !important;
        border: 1px solid var(--kevin-border) !important;
      }
      .tlui-popover__content[data-testid*="navigation"] .tlui-icon,
      .tlui-dropdown-menu__content[data-testid*="navigation"] .tlui-icon {
        background: #fff !important;
      }
/* ---------- 1) Main hamburger dropdown (radix menu) ---------- */
/* Root surface + text + border */
.tlui-menu {
  background: var(--kevin-panel) !important;
  color: var(--kevin-text) !important;
  border: 1px solid var(--kevin-border) !important;
}
/* Ensure every item label is white */
.tlui-menu .tlui-button__label,
.tlui-menu [role="menuitem"],
.tlui-menu .tlui-kbd {
  color: var(--kevin-text) !important;
}
/* White icons inside the menu */
.tlui-menu .tlui-icon { background: #fff !important; }
/* Hover/active rows */
.tlui-menu .tlui-button:hover,
.tlui-menu .tlui-menu__submenu__trigger[aria-expanded="true"],
.tlui-menu .tlui-button[data-isactive="true"] {
  background: var(--kevin-panel-hi) !important;
}

/* ---------- 2) Page menu header (“Pages”) ---------- */
.tlui-page-menu__header,
.tlui-page-menu__header * {
  color: var(--kevin-text) !important;
}
/* If its container is a popover, make sure the surface is tinted too */
.tlui-popover__content .tlui-page-menu__header {
  background: transparent !important;
}

/* Top menu zone buttons (hamburger, page trigger) — keep them white on navy */
.tlui-menu-zone .tlui-button { color: var(--kevin-text) !important; }
.tlui-menu-zone .tlui-icon   { background: #fff !important; }

/* ---------- 3) Minimap (canvas) ---------- */
/* Option A: light-on-dark feel with a filter (trade-off: colours invert) */
.tlui-minimap__canvas {
  filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.05);
}

/* Option B (instead of A): hide the minimap entirely */
/* .tlui-minimap { display: none !important; } */

.tlui-slider__container{
      display: none;
}

.tlui-style-panel__section__common:not(:only-child){
      margin-bottom:0;
}

/* Menu strip (top-left) — navy chrome + white icons */
.tlui-menu-zone {
  background: var(--kevin-panel) !important;
  border-right: 1px solid var(--kevin-border) !important;
  border-bottom: 1px solid var(--kevin-border) !important;
  /* keep radius from tldraw, but you can change it */
  border-bottom-right-radius: var(--radius-4) !important;
}

.tlui-menu-zone .tlui-button { color: var(--kevin-text) !important; }
.tlui-menu-zone .tlui-icon   { background: #fff !important; }

/* Any kebab menu trigger icon (actions menu, page row menu, etc.) */
[data-testid$="menu.button"] .tlui-icon,
.tlui-page_menu__item__submenu .tlui-icon,      /* underscore version */
.tlui-page-menu__item__submenu .tlui-icon {     /* hyphen version (future-proof) */
  color: #fff !important;
}



    `}


    </style>
  ),


  Toolbar: (props) => {
    const tools = useTools()

    return (
      <DefaultToolbar {...props}>
        <StyleButton />            {/* ← single style button with live swatch */}
        <DefaultToolbarContent />
        <TldrawUiMenuItem {...tools['stamp']} />
      </DefaultToolbar>
    )
  },

  // hide the default side style panel so only the sheet is used
  StylePanel: () => null,
}
