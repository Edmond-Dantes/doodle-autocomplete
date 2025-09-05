// src/shapes/MoonShape.tsx
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


export type MoonShape = TLBaseShape<'moon', {
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

export class MoonShapeUtil extends BaseBoxShapeUtil<MoonShape> {
  static override type = 'moon' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<MoonShape> = {
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

  getDefaultProps(): MoonShape['props'] {
    return {
      w: 100,
      h: 100,
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

component(shape: MoonShape) {
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
<svg width={w} height={h} viewBox="0 0 100 100" style={{ display: 'block' }}>
  <g fill={stroke} stroke="none">
    <path d="M51.8,89c-7.89,0-15.46-2.52-22.09-6.94c-8.52-6-14.2-14.83-16.09-24.93s0.32-20.51,6.31-29.03S34.76,13.9,44.86,12
      c2.52-0.32,5.05-0.63,7.26-0.63c1.26,0,2.52,0.95,2.84,2.21s0,2.52-1.26,3.47C40.13,26.2,34.76,42.3,41.39,54.6l0,0
      c6.94,13.25,24.93,17.36,40.71,9.78c1.26-0.63,2.52-0.32,3.47,0.63c0.95,0.95,1.26,2.21,0.63,3.47
      c-5.68,10.73-15.78,18.3-27.45,20.2C56.54,89,54.01,89,51.8,89z M42.65,18.63c-7.26,2.21-13.25,6.63-17.67,12.94
      c-5.05,7.26-6.94,15.78-5.36,24.61c3.16,17.67,20.2,29.66,38.18,26.51c6.94-1.26,13.25-4.73,17.99-9.78
      c-16.09,3.79-32.5-2.21-39.45-15.78l0,0C29.71,45.14,32.87,29.67,42.65,18.63z"/>
  </g>
</svg>


    </HTMLContainer>
  )
}


  indicator(shape: MoonShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
