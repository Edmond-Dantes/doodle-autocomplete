// src/shapes/GlassesShape.tsx
import {
  BaseBoxShapeUtil,
  HTMLContainer,
  T,
  type TLBaseShape,
  type RecordProps,
  useDefaultColorTheme,
  // built-in style props / types
  DefaultColorStyle, type TLDefaultColorStyle,
  DefaultFillStyle,  type TLDefaultFillStyle,
  DefaultDashStyle,  type TLDefaultDashStyle,
  DefaultSizeStyle,  type TLDefaultSizeStyle,
  DefaultFontStyle,  type TLDefaultFontStyle,
  DefaultTextAlignStyle, type TLDefaultTextAlignStyle,
  STROKE_SIZES, FONT_SIZES,
} from 'tldraw'


export type GlassesShape = TLBaseShape<'glasses', {
  w: number
  h: number
  text: string
  isDraft: boolean
  color: TLDefaultColorStyle
  fill: TLDefaultFillStyle
  dash: TLDefaultDashStyle
  size: TLDefaultSizeStyle
  font: TLDefaultFontStyle
  textAlign: TLDefaultTextAlignStyle
}>

export class GlassesShapeUtil extends BaseBoxShapeUtil<GlassesShape> {
  static override type = 'glasses' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<GlassesShape> = {
    w: T.number,
    h: T.number,
    text: T.string,
    isDraft: T.boolean,
    color: DefaultColorStyle,
    fill: DefaultFillStyle,
    dash: DefaultDashStyle,
    size: DefaultSizeStyle,
    font: DefaultFontStyle,
    textAlign: DefaultTextAlignStyle,
  }

  getDefaultProps(): GlassesShape['props'] {
    return {
      w: 160,
      h: 44,
      text: 'Doodly Doo',
      isDraft: false,
      color: 'yellow',
      fill: 'solid',
      dash: 'solid',
      size: 'm',
      font: 'sans',
      textAlign: 'middle',
    }
  }

  component(shape: GlassesShape) {
    const { w, h, text, color, fill, dash, size, font, textAlign, isDraft } = shape.props
    const theme = useDefaultColorTheme()

    // map style → CSS
    const strokeWidth = STROKE_SIZES[size]
    const strokeColour = theme[color].solid
    const fillColour =
      fill === 'none' ? 'transparent'
      : fill === 'semi' ? theme[color].semi
      : fill === 'pattern'
      ? `repeating-linear-gradient(45deg, ${theme[color].semi} 0 6px, transparent 6px 12px)`
      : theme[color].solid

    const borderStyle =
      dash === 'dotted' ? 'dotted'
      : dash === 'dashed' ? 'dashed'
      // tldraw’s “draw” is a hand-drawn effect; here we fall back to solid
      : 'solid'

    const fontFamily =
      font === 'mono' ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
      : font === 'serif' ? 'Georgia, Cambria, Times, serif'
      : font === 'draw' ? 'cursive'
      : 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'

    const textAlignCss =
      textAlign === 'start' ? 'left'
      : textAlign === 'end' ? 'right'
      : 'center'

    const r = Math.min(h / 2, 999)

    return (
      <HTMLContainer
        style={{
          width: w,
          height: h,
          borderRadius: r,
          background: fillColour,
          border: `${strokeWidth}px ${borderStyle} ${strokeColour}`,
          display: 'grid',
          placeItems: 'center',
          paddingInline: 12,
          boxSizing: 'border-box',
          fontFamily,
          fontSize: FONT_SIZES[size],
          fontWeight: 700,
          textAlign: textAlignCss as any,
          // keep text centred vertically even when left/right aligned
          alignItems: 'center',
          justifyItems: textAlignCss === 'left' ? 'start' : textAlignCss === 'right' ? 'end' : 'center',
          userSelect: 'none',
          opacity: isDraft ? 0.6 : 1,         // ← fade EVERYTHING while dragging
          transition: 'opacity 120ms ease',   // ← nice snap-in when you release

        }}
      >
        {text}
      </HTMLContainer>
    )
  }

  indicator(shape: GlassesShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
