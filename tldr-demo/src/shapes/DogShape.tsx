// src/shapes/DogShape.tsx
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


export type DogShape = TLBaseShape<'dog', {
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

export class DogShapeUtil extends BaseBoxShapeUtil<DogShape> {
  static override type = 'dog' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<DogShape> = {
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

  getDefaultProps(): DogShape['props'] {
    return {
      w: 100,
      h: 88,
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

component(shape: DogShape) {
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
<svg width={w} height={h} viewBox="0 0 100 88" style={{ display: 'block' }}>
  <g fill={stroke} stroke="none">
    <path d="M1.41,79.11c0.16-0.41,0.28-0.84,0.48-1.23c0.98-2,2.58-3.12,4.82-3.16c3.18-0.05,6.35-0.01,9.53-0.01
      c0.31,0,0.61,0,0.78,0c-0.41-1.96-1.06-3.86-1.17-5.78c-0.37-6.6,2-12.13,7.52-15.83c6.22-4.17,12.69-7.95,19.09-11.84
      c2.79-1.7,5.66-3.27,8.48-4.93c0.31-0.18,0.5-0.55,0.68-0.94c-2.32-0.17-4.32-0.85-6.09-2.23c-2.07-1.61-3.61-3.65-4.19-6.19
      c-0.81-3.54-1.05-7.12,0.82-10.47c0.44-0.79,1.05-1.51,1.69-2.17c2.62-2.68,5.29-5.31,7.94-7.97c2.24-2.25,4.93-3.38,8.12-3.37
      c4,0.02,8.01,0.02,12.01,0c3.23-0.02,5.93,1.14,8.19,3.42c1.52,1.53,3.06,3.05,4.61,4.55c1.9,1.83,4.25,2.59,6.83,2.72
      c1.2,0.06,2.41,0.07,3.62,0.04c2.62-0.08,4.89,2.55,3.28,5.34c-1.44,2.5-2.75,5.12-4.5,7.39c-2.56,3.32-6.11,5.1-10.37,5.18
      c-3.11,0.06-6.23,0.01-9.34,0.01c-0.34,0-0.69,0-1.15,0c0,2.38-0.02,4.69,0.03,7c0.01,0.29,0.38,0.63,0.65,0.86
      c3.58,3.02,5.78,6.85,6.31,11.48c0.7,6.11-1.27,11.32-5.85,15.48c-0.42,0.38-0.84,0.82-1.34,1.07c-1.06,0.53-1.43,1.37-1.5,2.5
      c-0.11,1.57-0.35,3.14-0.5,4.41c1.79,0.86,3.52,1.5,5.02,2.5c1.07,0.71,1.97,1.8,2.69,2.89c1.65,2.48,0,5.53-2.98,5.56
      c-4.45,0.05-8.9,0.04-13.34,0c-2.01-0.01-3.48-1.48-3.5-3.51c-0.05-3.18-0.02-6.35-0.02-9.53c0-0.38,0-0.75,0-1.35
      c-1.9,0.09-3.72,0.1-5.53,0.3c-1.06,0.12-1.79,0.92-2.33,1.82c-0.46,0.76-0.85,1.55-1.21,2.21c1.25,1.01,2.46,1.91,3.57,2.92
      c0.55,0.5,0.98,1.17,1.36,1.82c1.32,2.24-0.15,5.06-2.76,5.29c-0.44,0.04-0.89,0.03-1.33,0.03c-14.14,0-28.27-0.04-42.41,0.03
      c-3.05,0.01-5.49-0.66-6.73-4.43C1.41,80.38,1.41,79.75,1.41,79.11z M65.98,24.52c1.16,0,2.21-0.02,3.25,0.02
      c0.22,0.01,0.52,0.23,0.62,0.43c1.13,2.18,2.93,3.14,5.35,3.11c2.73-0.03,5.47,0.1,8.19-0.05c1.42-0.08,2.88-0.43,4.21-0.96
      c3.09-1.22,4.52-4.03,5.91-6.6c-0.69-0.86-1.43-1.61-1.95-2.49c-0.32-0.55-0.64-0.75-1.23-0.81c-3.14-0.29-5.88-1.52-8.18-3.67
      c-1.57-1.48-3.08-3.03-4.61-4.56c-1.2-1.2-2.6-2.17-4.3-2.23c-3.55-0.13-7.11-0.06-10.67-0.07c-0.05,0-0.1,0.07-0.23,0.16
      c0,0.32,0,0.69,0,1.07c0,5.27,0.01,10.55-0.01,15.82c0,0.95-0.05,1.91-0.24,2.84c-0.76,3.67-2.9,6.27-6.34,7.79
      c-0.43,0.19-0.66,0.42-0.6,0.91c0.04,0.38-0.05,0.77,0.02,1.14c0.24,1.29-0.38,1.92-1.46,2.56c-8.68,5.09-17.32,10.24-25.96,15.39
      c-2.82,1.68-5.25,3.73-6.84,6.71c-4.75,8.88,1.75,20.43,11.8,20.73c6.06,0.18,12.13,0.06,18.2,0.08c0.14,0,0.28-0.06,0.51-0.11
      c-1.53-2.65-4.32-3.2-6.76-4.47c4.26-6.83,4.78-13.51-0.74-19.86c0.83-0.85,1.61-1.66,2.44-2.51c3.59,3.69,5.19,8.13,5.19,12.97
      c2.42-0.17,4.8-0.34,7.25-0.52c0-1.11,0-2.21,0-3.42c0.8,0,1.52,0,2.25,0c1.3,0,1.31,0,1.31,1.26c0,5.15,0,10.29,0,15.44
      c0,0.37,0,0.74,0,1.15c4.45,0,8.77,0,13.22,0c-0.9-1.63-2.2-2.6-3.84-3.02c-1.59-0.41-3.22-0.62-4.88-0.93
      c0.39-3.18,0.87-6.35,1.15-9.54c0.13-1.48,0.62-2.51,1.98-3.12c0.37-0.17,0.67-0.48,1.01-0.72c5.59-4.04,6.87-11.15,4.73-16.4
      c-1.11-2.72-3.03-4.82-5.32-6.6c-0.66-0.51-0.94-1.05-0.92-1.91c0.05-2.89,0-5.78,0.04-8.67c0.01-0.67-0.2-1.11-0.71-1.54
      C67.36,28.12,66.43,26.57,65.98,24.52z M58.72,6.74c-1.85,0.19-3.28,1.06-4.52,2.3c-2.11,2.11-4.09,4.38-6.36,6.3
      c-2.74,2.32-3.83,5.1-3.4,8.59c0.05,0.38,0.04,0.76,0.07,1.14c0.4,5.08,5.99,8.13,10.45,5.69c2.63-1.43,3.8-3.74,3.81-6.66
      c0.02-5.53,0.01-11.06,0-16.58C58.77,7.28,58.74,7.03,58.72,6.74z M22.69,81.79c-0.96-1.01-1.83-1.98-2.76-2.87
      c-0.32-0.31-0.83-0.57-1.27-0.58c-2.82-0.06-5.65-0.05-8.47-0.05c-1.21,0-2.41-0.02-3.61,0.05C5.7,78.39,5.2,78.96,5.06,79.8
      c-0.14,0.86,0.25,1.51,1.01,1.86c0.38,0.17,0.87,0.17,1.3,0.17c4.85,0.01,9.71,0.01,14.56,0.01
      C22.17,81.83,22.42,81.81,22.69,81.79z"/>
    <path d="M75.83,11.99c1.48,0.02,2.63,1.2,2.62,2.69c-0.01,1.47-1.2,2.65-2.67,2.65c-1.49,0-2.72-1.26-2.68-2.75
      C73.15,13.12,74.35,11.97,75.83,11.99z"/>
  </g>
</svg>


    </HTMLContainer>
  )
}


  indidogor(shape: DogShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
