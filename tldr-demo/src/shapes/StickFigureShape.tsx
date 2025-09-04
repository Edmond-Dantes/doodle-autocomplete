// src/shapes/StickShape.tsx
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


export type StickShape = TLBaseShape<'stick', {
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

export class StickShapeUtil extends BaseBoxShapeUtil<StickShape> {
  static override type = 'stick' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<StickShape> = {
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

  getDefaultProps(): StickShape['props'] {
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

component(shape: StickShape) {
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
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
        {/* head */}
        <circle
          cx={cx} cy={headCY} r={headR}
          fill={headFill}
          stroke={stroke}
          strokeWidth={sw}
          strokeDasharray={dashArray}
        />
        {/* torso */}
        <line
          x1={cx} y1={neckY} x2={cx} y2={hipsY}
          stroke={stroke} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={dashArray}
        />
        {/* arms */}
        <line
          x1={leftArmX} y1={shouldersY} x2={cx} y2={shouldersY}
          stroke={stroke} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={dashArray}
        />
        <line
          x1={cx} y1={shouldersY} x2={rightArmX} y2={shouldersY}
          stroke={stroke} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={dashArray}
        />
        {/* legs */}
        <line
          x1={cx} y1={hipsY} x2={leftLegX} y2={feetY}
          stroke={stroke} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={dashArray}
        />
        <line
          x1={cx} y1={hipsY} x2={rightLegX} y2={feetY}
          stroke={stroke} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={dashArray}
        />
      </svg>
    </HTMLContainer>
  )
}


  indicator(shape: StickShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
