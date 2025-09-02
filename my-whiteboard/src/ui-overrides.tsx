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

// icon mapping stays the same
// src/ui-overrides.tsx (top)
export const assetUrls: TLUiAssetUrlOverrides = {
  icons: {
    'stamp-icon': '/stamp.svg',
    'blank-icon':
      'data:image/svg+xml;utf8,' +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'),
  },
}


export const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools.stamp = { id: 'stamp', label: 'Stamp', icon: 'stamp-icon', kbd: 's', readonlyOk: true }
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
  const selectedColour = styles.get(DefaultColorStyle)?.value as TLDefaultColorStyle | undefined

  // ✅ Remember the last seen colour so the swatch has a value even with no selection
  const [lastColour, setLastColour] = React.useState<TLDefaultColorStyle>('yellow')
  React.useEffect(() => {
    if (selectedColour) setLastColour(selectedColour)
  }, [selectedColour])

  // Use selection colour when available; otherwise fall back to the last one we saw
  const current = selectedColour ?? lastColour
  const hex = theme[current].solid


  return (
    <>
      {/* fixed-size slot so the toolbar layout doesn't change */}
      <div
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
          id="style-sheet"     // 👈 avoid colliding with any built-in ids
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
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 20 }}
          />
          <div
            role="dialog"
            aria-label="Style panel"
            style={{
              position: 'fixed',
              left: 0,
              right: 90,
              bottom: 45,
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 12px calc(12px + env(safe-area-inset-bottom))',
              zIndex: 21,
            }}
          >
            <div
              style={{
                background: '#fff',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <DefaultStylePanel isMobile>
                <DefaultStylePanelContent styles={styles} />
              </DefaultStylePanel>
            </div>
          </div>
        </>
      )}
    </>
  )
}



export const components: TLComponents = {
  Overlays: () => (
    <style>{`
      button#style-sheet {
        width:32px !important;
        min-width:32px !important;
        height:32px !important;
        padding:0 !important;
        margin:0 2px !important;
        flex:0 0 32px !important;
      }
      button#style-sheet[data-state="open"] {
        width:32px !important;
      }
    `}</style>
  ),


  Toolbar: (props) => {
    const tools = useTools()
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools['stamp']} />
        <StyleButton />            {/* ← single style button with live swatch */}
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },

  // hide the default side style panel so only the sheet is used
  StylePanel: () => null,
}
