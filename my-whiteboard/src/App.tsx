import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { shapeUtils, tools, uiOverrides, components, assetUrls } from './registry'

// (optional) for typing:
import type { Editor} from 'tldraw'
import { DefaultColorStyle } from 'tldraw'

export default function App() {
  const handleMount = (editor: Editor) => {
    // make pencil (Draw) the active tool on load
    // rAF avoids any late “select” resets during initial layout
    requestAnimationFrame(() => {
      editor.setCurrentTool('draw') // id for the pencil tool
      editor.focus()                // ensures keybinds/UI state look right
      if (typeof (editor as any).setStyleForNextShapes === 'function') {
        editor.setStyleForNextShapes(DefaultColorStyle, 'light-blue')
      }
    })
  }

    return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        onMount={handleMount}
        shapeUtils={shapeUtils}
        tools={tools}
        overrides={uiOverrides}
        components={components}
        assetUrls={assetUrls}
      />
    </div>
  )
}
