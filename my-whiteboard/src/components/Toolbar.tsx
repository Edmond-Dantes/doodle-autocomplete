// src/components/Toolbar.tsx
import * as React from 'react'
import { useEditor } from 'tldraw'

export function Toolbar() {
  const editor = useEditor()
  return (
    <div style={{ position: 'fixed', top: 12, left: 12, display: 'flex', gap: 8, zIndex: 10 }}>
      <button onClick={() => {
        const { x, y } = editor.getViewportScreenCenter()
        editor.createShape({ type: 'box', x, y, props: { w: 240, h: 120, fill: '#D4F8D4', radius: 16 } })
      }}>
        + Box
      </button>
    </div>
  )
}
