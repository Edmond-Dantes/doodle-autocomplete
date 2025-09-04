import { StateNode, createShapeId } from 'tldraw'

export class TreeTool extends StateNode {
  static id = 'tree' as const

  private start: { x: number; y: number } | null = null
  private draftId: string | null = null

  onEnter = () => this.editor.setCursor({ type: 'cross' })

  onPointerDown = () => {
    const p = this.editor.inputs.currentPagePoint
    this.start = { x: p.x, y: p.y }

    const id = createShapeId()
    this.draftId = id

    // Create a visible draft (dashed / semi) so the user sees feedback immediately
    this.editor.createShape({
      id,
      type: 'tree',
      x: p.x,
      y: p.y,
      props: {
        w: 1,
        h: 1,
       isDraft: true,
       dash: 'solid',  // ← keep outline solid
       fill: 'semi'
      },
    })

    // Make it obvious which thing is being created
    this.editor.setSelectedShapes([id])
  }

  onPointerMove = () => {
    if (!this.start || !this.draftId) return
    const p = this.editor.inputs.currentPagePoint
    const x = Math.min(this.start.x, p.x)
    const y = Math.min(this.start.y, p.y)
    const w = Math.max(1, Math.abs(p.x - this.start.x))
    const h = Math.max(1, Math.abs(p.y - this.start.y))

    this.editor.updateShape({
      id: this.draftId,
      type: 'tree',
      x,
      y,
      props: { w, h }, // keep drafty styles; we’ll switch on release
    })
  }

  onPointerUp = () => {
    const start = this.start
    const id = this.draftId
    this.start = null
    this.draftId = null
    if (!start || !id) return

    const p = this.editor.inputs.currentPagePoint
    const dx = Math.abs(p.x - start.x)
    const dy = Math.abs(p.y - start.y)

    if (dx < 3 && dy < 3) {
      // Click → drop default size centred at click
      const w = 160, h = 44
      this.editor.updateShape({
        id,
        type: 'tree',
        x: start.x - w / 2,
        y: start.y - h / 2,
        props: { w, h },
      })
    }

    // Switch draft look → final look
    this.editor.updateShape({
      id,
      type: 'tree',
      props: {
        isDraft: false,
        dash: 'solid',
        fill: 'solid',
      },
    })
    // tool stays active; press V / Esc to leave if you want
  }

  onCancel = () => {
    if (this.draftId) this.editor.deleteShape(this.draftId) // Esc cancels the draft
    this.start = null
    this.draftId = null
    this.editor.setCursor({ type: 'default' })
  }

  onExit = () => this.editor.setCursor({ type: 'default' })
}
