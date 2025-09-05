// src/shapes/HouseShape.tsx
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


export type HouseShape = TLBaseShape<'house', {
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

export class HouseShapeUtil extends BaseBoxShapeUtil<HouseShape> {
  static override type = 'house' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<HouseShape> = {
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

  getDefaultProps(): HouseShape['props'] {
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

component(shape: HouseShape) {
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
    <path d="M50.11,77.1c-13.33,0-26.66,0-39.99,0c-0.5,0-1.01-0.05-1.51-0.02c-1.43,0.07-1.96-0.57-1.95-2.01
      c0.06-5.41,0.04-10.82,0.01-16.24c0-1.11,0.25-2.2-1.66-2.38c-1.26-0.12-0.6-1.54-0.06-2.28c1.55-2.11,3.15-4.18,4.76-6.25
      c6.52-8.4,13.08-16.78,19.54-25.23c0.94-1.23,1.8-1.43,3.12-0.85c6.05,2.69,12.11,5.36,18.17,8.02c7.7,3.38,15.46,6.61,23.07,10.17
      c2.52,1.18,4.74,3.08,6.95,4.82c4.72,3.72,9.36,7.56,14.01,11.36c0.42,0.35,0.85,0.75,1.11,1.22c0.51,0.9,0.45,1.71-0.84,1.68
      c-1.24-0.03-1.48,0.57-1.48,1.65c0.03,4.63,0,9.26-0.01,13.89c0,2.36-0.07,2.43-2.44,2.43C77.33,77.1,63.72,77.1,50.11,77.1z
       M61.2,73.41c8.76,0,17.51-0.01,26.27,0.01c1.16,0,2.16-0.07,2.16-1.6c-0.01-4.24,0.04-8.48-0.07-12.72
      c-0.01-0.58-0.69-1.46-1.24-1.65c-2.27-0.76-4.61-1.31-6.92-1.92c-8.39-2.23-16.78-4.48-25.19-6.66c-1.27-0.33-2.66-0.57-3.94-0.43
      c-2.93,0.33-5.83,0.91-8.74,1.42c-10.42,1.84-20.84,3.72-31.27,5.53c-1.3,0.23-1.84,0.8-1.84,2.09c0.02,4.63,0.01,9.26-0.02,13.89
      c-0.01,1.51,0.66,2.08,2.15,2.04c2.79-0.07,5.58-0.03,8.37-0.04c2.17-0.01,2.35-0.18,2.37-2.4c0.02-3.57,0.07-7.14-0.05-10.71
      c-0.05-1.61,0.65-2.25,2.09-2.4c1.88-0.2,3.79-0.31,5.65-0.61c1.47-0.24,1.9,0.3,1.89,1.68c-0.04,3.96-0.01,7.92,0,11.88
      c0.01,2.37,0.22,2.59,2.58,2.59C44.03,73.42,52.61,73.41,61.2,73.41z"/>
    <path d="M41.09,64.39c-3.99,0.16-3.99,0.16-4-3.8c-0.01-3.94-0.01-3.95,3.92-4.57c1.04-0.17,2.09-0.31,3.14-0.45
      c1.1-0.14,1.69,0.29,1.67,1.47c-0.03,1.84-0.05,3.68,0,5.51c0.03,1.13-0.46,1.64-1.56,1.68C43.2,64.27,42.15,64.34,41.09,64.39z"/>
    <path d="M63.34,60.57c-0.01-3.91-0.02-3.78,3.75-3.31c5.31,0.66,4.12,0.85,4.25,5.15c0.08,2.69,0.02,2.7-2.65,2.59
      c-1-0.04-2-0.07-2.99-0.14c-2.23-0.15-2.35-0.27-2.35-2.46C63.34,61.79,63.34,61.18,63.34,60.57z"/>
    <path d="M20.42,61.87c0,3.65,0.01,3.7-3.58,3.86c-3.8,0.17-3.6,0.88-3.61-3.39c0-0.5,0.04-1.01-0.01-1.51
      c-0.09-1.04,0.36-1.55,1.39-1.67c1.22-0.14,2.43-0.35,3.65-0.5c1.95-0.24,2.13-0.08,2.16,1.87C20.42,60.98,20.42,61.42,20.42,61.87
      z"/>
    <path d="M77.09,62.2c-0.13-3.7,0.18-3.11,3.19-2.81c0.06,0.01,0.11,0.01,0.17,0.02c3.64,0.47,4.67,1.98,3.62,5.5
      c-0.12,0.42-0.83,0.92-1.28,0.93c-1.43,0.03-2.88-0.12-4.31-0.27c-0.98-0.1-1.46-0.69-1.4-1.71C77.11,63.31,77.09,62.75,77.09,62.2
      z"/>
  </g>
</svg>

    </HTMLContainer>
  )
}


  indicator(shape: HouseShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
