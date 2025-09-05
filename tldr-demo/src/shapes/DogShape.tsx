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
      <svg width={w} height={h} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <g fill={stroke} stroke="none">
          <path d="M85.09,61.27c0.16,1.43,0.39,2.77,0.45,4.11c0.35,8.83-2.64,16.13-10.24,21c-4.52,2.9-9.65,3.02-14.7,1.69
            c-3.17-0.84-6.2-2.2-9.25-3.44c-0.75-0.3-1.28-0.36-1.99,0.02c-3.83,2.04-7.85,3.51-12.19,3.95c-8.79,0.91-15.4-2.73-19.44-10.63
            c-2.46-4.81-3.15-9.87-2.28-15.17c0.08-0.48,0.12-0.96,0.18-1.47c-5.82-1.57-8.34-5.87-9.23-11.21c-0.81-4.9-1.34-9.88-1.65-14.84
            C4.1,25.09,9.59,17.12,19.3,13.83c6.28-2.13,12.68-2.06,19.01-0.4c4.29,1.13,8.46,2.27,13.01,2.01c2.63-0.15,5.18-0.23,7.7-1.07
            c6.39-2.13,12.91-2.85,19.53-1.33c8.05,1.85,14,6.37,16.66,14.37c0.82,2.45,0.87,5.28,0.71,7.9c-0.3,4.92-0.93,9.82-1.58,14.71
            c-0.21,1.59-0.78,3.17-1.44,4.64C91.4,58,88.97,60.38,85.09,61.27z M50.08,62.25c1.98,0.33,3.82,0.54,5.61,0.97
            c1.3,0.31,2.46,1.02,2.74,2.52c0.31,1.6-0.37,2.86-1.62,3.77c-0.95,0.69-1.98,1.28-3.03,1.79c-1.09,0.54-1.66,1.35-1.79,2.52
            c-0.2,1.8-0.35,3.61-0.62,5.4c-0.14,0.93,0.2,1.37,0.99,1.8c3.08,1.68,6.31,2.93,9.75,3.64c7.52,1.57,13.39-1.05,17.2-7.7
            c2.59-4.53,3.12-9.37,2.17-14.45c-0.17-0.91-0.48-1.39-1.4-1.7c-1.01-0.33-1.99-0.87-2.88-1.47c-3.21-2.18-4.5-5.55-5.05-9.13
            c-0.9-5.94-1.52-11.93-2.2-17.91c-0.56-4.91-2.49-8.85-7.36-10.83c-8.1-3.3-16.21-3.31-24.32-0.07c-4.27,1.71-6.62,4.92-7.25,9.39
            c-0.46,3.22-0.63,6.49-1.1,9.71c-0.62,4.24-1.21,8.51-2.19,12.67c-0.92,3.91-3.57,6.51-7.43,7.83c-0.38,0.13-0.84,0.57-0.92,0.94
            c-1.39,6.31-0.37,12.14,3.55,17.36c2.85,3.8,6.68,5.75,11.44,5.75c5.17,0,9.85-1.74,14.27-4.27c0.36-0.2,0.69-0.85,0.66-1.27
            c-0.14-1.99-0.28-3.99-0.69-5.93c-0.17-0.81-0.9-1.62-1.58-2.16c-1.05-0.84-2.39-1.32-3.41-2.18c-2.3-1.96-1.83-4.87,1.01-5.86
            C46.38,62.77,48.31,62.6,50.08,62.25z M63.17,17.13c6.95,3.07,9.98,8.64,10.6,15.87c0.36,4.24,0.72,8.48,1.36,12.68
            c0.42,2.75,1.12,5.5,2.1,8.09c0.91,2.4,3.03,3.65,5.62,3.88c2.69,0.23,4.66-1.07,5.97-3.27c0.79-1.34,1.51-2.86,1.72-4.38
            c0.73-5.24,1.26-10.51,1.78-15.77c0.44-4.49-1.03-8.36-4.07-11.68c-3.09-3.37-6.94-5.27-11.39-6.1
            C72.26,15.61,67.72,15.94,63.17,17.13z M37.69,17.21c-0.3-0.18-0.41-0.28-0.53-0.31c-5.11-1.14-10.22-1.34-15.32,0
            C14.7,18.77,7.1,25.36,8.41,35.34c0.53,4.08,0.82,8.19,1.28,12.28c0.31,2.72,0.95,5.35,2.72,7.56c2.09,2.63,5.33,3.25,8.27,1.61
            c2.24-1.25,3.41-3.3,3.83-5.66c0.77-4.31,1.33-8.66,1.91-13c0.36-2.69,0.48-5.42,0.94-8.09C28.42,23.96,31.84,19.69,37.69,17.21z"/>
          <path d="M63,50.08c2.12,0.03,3.89,1.85,3.83,3.94c-0.06,2.08-1.79,3.78-3.84,3.78c-2.12,0-3.89-1.75-3.89-3.86
            C59.1,51.84,60.9,50.05,63,50.08z"/>
          <path d="M37.79,57.82c-2.1,0.03-3.89-1.73-3.92-3.85c-0.03-2.09,1.77-3.89,3.88-3.88c2.1,0.01,3.85,1.79,3.85,3.92
            C41.6,56.02,39.83,57.79,37.79,57.82z"/>
          <path d="M61.11,73.34c0.43,0.56,0.91,0.93,0.86,1.19c-0.07,0.36-0.5,0.81-0.85,0.9c-0.22,0.06-0.83-0.49-0.83-0.77
            C60.29,74.29,60.72,73.93,61.11,73.34z"/>
          <path d="M42.92,72.68c0.39,0.51,0.84,0.85,0.82,1.16c-0.02,0.31-0.58,0.88-0.77,0.83c-0.37-0.1-0.82-0.5-0.92-0.87
            C41.99,73.57,42.51,73.18,42.92,72.68z"/>
          <path d="M59.04,73.93c-0.57,0.36-0.97,0.8-1.23,0.73c-0.35-0.1-0.6-0.59-0.89-0.91c0.32-0.25,0.64-0.68,0.97-0.69
            C58.2,73.07,58.51,73.51,59.04,73.93z"/>
          <path d="M39.54,75.85c-0.41-0.58-0.88-0.96-0.82-1.21c0.09-0.36,0.56-0.63,0.87-0.94c0.29,0.29,0.81,0.58,0.81,0.87
            C40.4,74.92,39.96,75.27,39.54,75.85z"/>
          <path d="M58.6,76c0.34,0.57,0.74,0.94,0.69,1.24c-0.05,0.32-0.52,0.57-0.81,0.86c-0.29-0.33-0.74-0.63-0.81-1
            C57.62,76.86,58.14,76.51,58.6,76z"/>
          <path d="M42.28,75.99c0.37,0.58,0.82,0.99,0.75,1.23c-0.12,0.36-0.6,0.59-0.93,0.88c-0.24-0.32-0.67-0.64-0.67-0.97
            C41.41,76.83,41.85,76.52,42.28,75.99z"/>
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
