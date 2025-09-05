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
      <svg width={w} height={h} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <g fill={stroke} stroke="none">
          <path d="M5.37,52.44c0-1.59-0.02-3.19,0-4.78c0.04-2.37,1.41-4.15,3.76-4.41c4.41-0.48,8.48-1.93,12.54-3.62
            c6.5-2.72,13.3-4.35,20.35-4.82c10.41-0.69,20.02,1.7,28.69,7.58c1.12,0.76,2.21,1.15,3.57,1.18c4.81,0.11,9.51,0.93,13.97,2.81
            c2.12,0.89,4.09,2.08,5.51,3.96c0.85,1.12,1.27,2.37,1.23,3.8c-0.05,1.82,0,3.65-0.01,5.48c-0.02,3.17-1.71,4.9-4.86,4.85
            c-1.05-0.02-1.41,0.31-1.75,1.31c-2.31,6.72-10.47,8.82-15.63,4.18c-1.44-1.29-2.47-2.86-2.94-4.75c-0.14-0.56-0.43-0.72-0.98-0.72
            c-11.55,0.01-23.09,0.01-34.64,0c-0.63,0-0.84,0.25-1.01,0.81c-1.22,4.18-4.71,6.91-9.05,7.14c-3.96,0.21-7.91-2.22-9.33-6.16
            c-0.56-1.56-1.26-1.92-2.72-1.81C10.74,64.57,9.6,64,8.72,62.98c-0.74-0.85-1.5-1.69-2.22-2.55c-0.77-0.92-1.17-1.98-1.14-3.21
            C5.39,55.63,5.37,54.04,5.37,52.44z M38.14,46.5c0.21,0.45,0.35,0.77,0.5,1.09c1.22,2.5,2.45,5.01,3.68,7.51
            c0.15,0.3,0.31,0.59,0.41,0.91c0.25,0.81,0,1.48-0.75,1.84c-0.77,0.37-1.42,0.08-1.87-0.63c-0.16-0.25-0.27-0.53-0.41-0.8
            c-2.65-5.35-5.31-10.7-7.94-16.07c-0.33-0.67-0.66-0.85-1.37-0.59c-3.82,1.41-7.68,2.74-11.48,4.21c-1.62,0.63-3.2,1.25-4.93,1.46
            c-1.45,0.18-2.89,0.45-4.32,0.73c-1.09,0.21-1.42,0.76-1.17,1.85c1.1,0.22,2.79-0.34,2.84,1.49c0.06,2.02-1.79,1.35-2.98,1.67
            c0,2.17-0.01,4.31,0.01,6.46c0,0.19,0.08,0.41,0.2,0.55c0.86,1.01,1.61,2.17,2.65,2.94c0.61,0.46,1.69,0.39,2.55,0.35
            c0.22-0.01,0.45-0.84,0.58-1.31c0.42-1.65,1.24-3.1,2.43-4.28c2.63-2.6,5.81-3.58,9.41-2.65c3.84,1,6.23,3.54,7.13,7.4
            c0.17,0.74,0.44,0.95,1.17,0.95c11.35-0.02,22.7-0.02,34.05,0c0.68,0,0.95-0.17,1.1-0.89c0.86-4.15,4.38-7.33,8.46-7.72
            c5.13-0.5,9.51,2.67,10.67,7.71c0.06,0.28,0.12,0.65,0.31,0.79c1.02,0.71,2.92-0.21,2.96-1.44c0.05-1.69,0-3.39,0.02-5.08
            c0.01-0.51-0.17-0.72-0.69-0.71c-0.8,0.02-1.59-0.02-2.39,0.01c-0.89,0.03-1.5-0.32-1.93-1.12c-0.79-1.46-1.6-2.91-2.48-4.31
            c-0.27-0.43-0.78-0.89-1.24-0.97c-2.9-0.5-5.82-1.24-8.74-1.28c-11.91-0.17-23.83-0.11-35.74-0.14
            C38.67,46.43,38.51,46.46,38.14,46.5z M34.26,38.82c0.67,1.32,1.32,2.5,1.88,3.73c0.32,0.7,0.72,0.96,1.51,0.96
            c9.32-0.03,18.63-0.02,27.95-0.02c0.3,0,0.61-0.04,0.91-0.07C56.41,37.3,45.64,36.4,34.26,38.82z M79.19,69.48
            c3.7,0,6.77-3.04,6.81-6.75c0.04-3.69-3.15-6.89-6.84-6.86c-3.7,0.03-6.79,3.1-6.82,6.79C72.32,66.37,75.43,69.47,79.19,69.48z
             M23.79,69.48c3.75,0,6.75-2.98,6.8-6.75c0.04-3.74-3.07-6.87-6.81-6.87c-3.71,0.01-6.76,3.05-6.8,6.78
            C16.95,66.41,20,69.48,23.79,69.48z M90.52,51.15c-0.58-0.42-1.04-0.76-1.51-1.09C89.12,50.89,89.34,51.56,90.52,51.15z"/>
          <path d="M45.01,48.06c0.45,0.05,1-0.04,1.34,0.19c0.44,0.3,0.96,0.85,0.97,1.3c0.01,0.45-0.5,1.22-0.9,1.31
            c-0.91,0.2-1.92,0.21-2.83,0.02c-0.42-0.09-0.98-0.84-0.96-1.27c0.03-0.49,0.55-1.05,1.01-1.38C43.96,48,44.53,48.1,45.01,48.06z"/>
          <path d="M79.2,58c2.54,0,4.68,2.16,4.66,4.7c-0.02,2.52-2.11,4.64-4.61,4.67c-2.58,0.03-4.77-2.13-4.76-4.71
            C74.5,60.12,76.63,58.01,79.2,58z M80.9,62.73c0.02-0.89-0.79-1.75-1.68-1.77c-0.91-0.02-1.72,0.77-1.74,1.69
            c-0.02,0.96,0.7,1.71,1.66,1.73C80.07,64.4,80.88,63.64,80.9,62.73z"/>
          <path d="M19.13,62.54c0.08-2.6,2.22-4.62,4.8-4.53c2.6,0.09,4.61,2.24,4.51,4.82c-0.1,2.62-2.23,4.63-4.8,4.54
            C21.05,67.28,19.05,65.14,19.13,62.54z M23.76,64.38c0.96,0.01,1.72-0.72,1.73-1.67c0.01-0.93-0.76-1.74-1.68-1.75
            c-0.92-0.01-1.72,0.78-1.73,1.7C22.06,63.61,22.81,64.37,23.76,64.38z"/>
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
