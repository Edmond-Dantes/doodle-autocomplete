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
      w: 100,
      h: 52,
      text: '',
      isDraft: false,
      color: 'light-red',
      fill: 'none',     // head fill (we’ll map this)
      dash: 'solid',
      size: 'm',        // drives stroke width
      font: 'sans',
      textAlign: 'middle',
    }
  }

component(shape: GlassesShape) {
  const { w, h, color, fill, dash, size, isDraft } = shape.props
  const theme = useDefaultColorTheme()

  const stroke = theme[color].solid
  const sw = STROKE_SIZES[size]
  const dashArray =
    dash === 'dotted' ? `${sw} ${sw}` :
    dash === 'dashed' ? `${sw * 2} ${sw * 2}` :
    undefined

  // proportions
  const cx = w / 2
  const headR      = Math.min(w, h) * 0.14
  const headCY     = headR + sw + h * 0.02
  const neckY      = headCY + headR
  const shouldersY = neckY + h * 0.06
  const hipsY      = h * 0.68
  const feetY      = h * 0.95
  const leftArmX   = w * 0.18
  const rightArmX  = w * 0.82
  const leftLegX   = w * 0.36
  const rightLegX  = w * 0.64

  const headFill =
    fill === 'semi'  ? theme[color].semi :
    fill === 'solid' ? theme[color].solid :
    'none'

  return (
    <HTMLContainer style={{ width: w, height: h, opacity: isDraft ? 0.6 : 1 }}>
<svg width={w} height={h} viewBox="0 0 100 52" style={{ display: 'block' }}>
  <g fill={stroke} stroke="none">
    <path d="M30.75,16.21c-4.92,0-8.93,4-8.93,8.93c0,0.92,0.62,1.54,1.54,1.54c0.92,0,1.54-0.62,1.54-1.54c0-3.08,2.77-5.85,5.85-5.85
      c0.92,0,1.54-0.62,1.54-1.54S31.67,16.21,30.75,16.21z"/>
    <path d="M71.07,16.21c-4.92,0-8.93,4-8.93,8.93c0,0.92,0.62,1.54,1.54,1.54c0.92,0,1.54-0.62,1.54-1.54c0-3.08,2.46-5.85,5.85-5.85
      c0.92,0,1.54-0.62,1.54-1.54S71.69,16.21,71.07,16.21z"/>
    <path d="M92.61,22.06h-2.77c-1.54-8.62-9.23-15.39-18.16-15.39s-16.62,6.77-18.16,15.39h-4.31c-1.54-8.62-9.23-15.39-18.16-15.39
      S14.44,13.44,12.9,22.06h-4c-1.54,0-3.08,1.23-3.08,3.08c0,1.85,1.23,3.08,3.08,3.08h3.69c1.23,8.62,8.93,15.39,18.16,15.39
      s16.93-7.08,18.47-16h4c1.23,8.93,8.93,16,18.47,16s16.93-7.08,18.47-16h2.77c1.54,0,3.08-1.23,3.08-3.08
      C96,22.68,94.15,22.06,92.61,22.06z M30.75,37.76c-7.08,0-12.62-5.85-12.62-12.62c0-7.08,5.85-12.62,12.62-12.62
      c7.08,0,12.62,5.85,12.62,12.62C43.68,32.22,37.83,37.76,30.75,37.76z M71.69,37.76c-7.08,0-12.62-5.85-12.62-12.62
      c0-7.08,5.85-12.62,12.62-12.62S84.3,18.37,84.3,25.14C84.3,32.22,78.46,37.76,71.69,37.76z"/>
  </g>
</svg>


    </HTMLContainer>
  )
}


  indicator(shape: GlassesShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
