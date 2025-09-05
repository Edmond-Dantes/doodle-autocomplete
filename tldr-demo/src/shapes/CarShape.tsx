// src/shapes/CarShape.tsx
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


export type CarShape = TLBaseShape<'car', {
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

export class CarShapeUtil extends BaseBoxShapeUtil<CarShape> {
  static override type = 'car' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<CarShape> = {
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

  getDefaultProps(): CarShape['props'] {
    return {
      w: 100,
      h: 50,
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

component(shape: CarShape) {
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
<svg width={w} height={h} viewBox="0 0 100 50" style={{ display: 'block' }}>
  <g fill={stroke} stroke="none">
    <path d="M3.13,25.34c0-1.67-0.02-3.34,0-5c0.04-2.48,1.47-4.35,3.94-4.62c4.62-0.5,8.88-2.02,13.14-3.79
      c6.81-2.84,13.92-4.56,21.31-5.05c10.9-0.72,20.97,1.78,30.05,7.94c1.17,0.79,2.31,1.2,3.74,1.23c5.04,0.12,9.96,0.98,14.63,2.95
      c2.22,0.94,4.28,2.18,5.78,4.15c0.89,1.17,1.33,2.48,1.29,3.98c-0.05,1.91,0,3.82-0.02,5.73c-0.02,3.31-1.79,5.13-5.09,5.08
      c-1.1-0.02-1.48,0.33-1.84,1.38c-2.41,7.04-10.96,9.24-16.37,4.37c-1.51-1.35-2.59-2.99-3.08-4.98c-0.15-0.59-0.45-0.75-1.03-0.75
      c-12.09,0.01-24.18,0.01-36.28,0c-0.66,0-0.88,0.26-1.06,0.85c-1.28,4.38-4.93,7.24-9.48,7.48c-4.14,0.22-8.28-2.32-9.77-6.45
      c-0.59-1.63-1.32-2.01-2.85-1.9c-1.38,0.1-2.57-0.5-3.49-1.56c-0.77-0.89-1.57-1.77-2.33-2.67c-0.81-0.97-1.22-2.07-1.2-3.36
      C3.16,28.68,3.13,27.01,3.13,25.34z M6.21,24.03c0,1.27,0.12,2.56-0.03,3.82c-0.28,2.32,0.44,4.14,2.12,5.77
      c0.9,0.88,1.72,1.39,2.98,1.32c0.72-0.04,1.04-0.21,1.16-0.96c0.33-2.06,1.34-3.81,2.84-5.22C21.25,23.13,30.58,26,32.41,34
      c0.15,0.66,0.36,0.92,1.07,0.92c11.96-0.02,23.91-0.02,35.87,0c0.7,0,0.91-0.23,1.07-0.9c0.86-3.73,3.07-6.4,6.72-7.61
      c6-2,11.9,1.45,13.34,7.65c0.06,0.26,0.17,0.72,0.28,0.73c0.75,0.03,1.56,0.13,2.24-0.12c0.41-0.15,0.8-0.85,0.87-1.35
      c0.14-0.99,0.06-2.01,0.04-3.02c-0.02-0.96,0.29-2.27-0.21-2.8c-0.48-0.51-1.81-0.21-2.77-0.27c-0.07,0-0.14-0.01-0.21,0
      c-0.98,0.07-1.62-0.37-2.08-1.24c-0.82-1.53-1.68-3.05-2.6-4.52c-0.26-0.42-0.78-0.87-1.23-0.94c-3.08-0.52-6.17-1.3-9.26-1.34
      c-12.41-0.18-24.82-0.12-37.22-0.14c-0.25,0-0.5,0.07-0.86,0.13c1.5,3.06,2.94,5.99,4.37,8.92c0.17,0.34,0.36,0.68,0.46,1.05
      c0.24,0.86-0.08,1.55-0.88,1.89c-0.77,0.33-1.43,0.03-1.88-0.67c-0.17-0.26-0.29-0.56-0.43-0.84c-2.75-5.54-5.51-11.08-8.22-16.64
      c-0.41-0.84-0.79-1.13-1.72-0.78c-3.87,1.45-7.79,2.76-11.63,4.27c-1.85,0.73-3.67,1.44-5.66,1.67c-1.41,0.17-2.82,0.44-4.22,0.71
      c-1.15,0.22-1.49,0.76-1.27,1.94c1.17,0.24,3-0.36,2.99,1.65C9.36,24.37,7.5,23.7,6.21,24.03z M33.39,11.08
      c0.72,1.42,1.42,2.7,2.02,4.02c0.31,0.67,0.71,0.89,1.43,0.89c9.82-0.02,19.65-0.01,29.47-0.02c0.28,0,0.56-0.06,0.83-0.09
      C56.58,9.48,45.3,8.54,33.39,11.08z M80.29,43.18c3.93,0.09,7.2-3.07,7.29-7.02c0.08-3.82-3.13-7.13-7.01-7.23
      c-3.87-0.1-7.21,3.14-7.29,7.06C73.21,39.83,76.39,43.09,80.29,43.18z M22.44,43.18c3.93-0.01,7.07-3.14,7.11-7.07
      c0.04-3.91-3.23-7.2-7.14-7.18c-3.89,0.01-7.08,3.2-7.11,7.11C15.27,39.98,18.47,43.19,22.44,43.18z M92.31,23.99
      c-0.61-0.44-1.09-0.79-1.58-1.14C90.84,23.72,91.08,24.42,92.31,23.99z"/>
    <path d="M44.59,23.86c-0.35,0-0.7,0.03-1.04-0.01c-0.87-0.11-1.44-0.6-1.46-1.49c-0.02-0.89,0.52-1.45,1.4-1.53
      c0.76-0.07,1.53-0.07,2.29,0c0.84,0.08,1.34,0.63,1.36,1.46c0.01,0.88-0.51,1.42-1.39,1.54c-0.37,0.05-0.76,0.01-1.14,0.01
      C44.59,23.86,44.59,23.86,44.59,23.86z"/>
    <path d="M80.48,31.17c2.67,0.02,4.89,2.29,4.85,4.95c-0.04,2.64-2.24,4.85-4.85,4.86c-2.71,0.02-4.98-2.26-4.96-4.97
      C75.54,33.35,77.79,31.15,80.48,31.17z M82.24,36.09c0.01-0.93-0.85-1.82-1.78-1.83c-0.95-0.01-1.79,0.82-1.81,1.79
      c-0.01,1.01,0.74,1.79,1.76,1.8C81.38,37.86,82.23,37.05,82.24,36.09z"/>
    <path d="M27.3,36.02c0.02,2.72-2.13,4.93-4.83,4.97c-2.7,0.03-4.89-2.13-4.93-4.86c-0.04-2.7,2.12-4.92,4.83-4.95
      C25.09,31.14,27.28,33.29,27.3,36.02z M24.21,36.04c-0.02-0.98-0.87-1.8-1.82-1.78c-0.96,0.02-1.77,0.88-1.75,1.84
      c0.02,1,0.81,1.76,1.82,1.74C23.46,37.83,24.23,37.04,24.21,36.04z"/>
  </g>
</svg>

    </HTMLContainer>
  )
}


  indicator(shape: CarShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
