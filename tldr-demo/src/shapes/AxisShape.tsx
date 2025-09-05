// src/shapes/AxisShape.tsx
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


export type AxisShape = TLBaseShape<'axis', {
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

export class AxisShapeUtil extends BaseBoxShapeUtil<AxisShape> {
  static override type = 'axis' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<AxisShape> = {
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

  getDefaultProps(): AxisShape['props'] {
    return {
      w: 80,
      h: 160,
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

component(shape: AxisShape) {
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
        <polygon
          points="
            92,88.5 81.64,82.52 81.64,87 15,87 15,18.36 19.48,18.36 13.5,8 7.52,18.36 12,18.36
            12,24.88 9.88,24.88 9.88,27.88 12,27.88 12,40.88 9.88,40.88 9.88,43.88 12,43.88
            12,56.88 9.88,56.88 9.88,59.88 12,59.88 12,72.88 9.88,72.88 9.88,75.88 12,75.88
            12,87 12,88 12,90 26,90 26,92 29,92 29,90 42,90 42,92 45,92 45,90 58,90 58,92
            61,92 61,90 74,90 74,92 77,92 77,90 81.64,90 81.64,94.48
          "
          fill={stroke}
          stroke="none"
        />
      </svg>
    </HTMLContainer>
  )
}


  indicator(shape: AxisShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
