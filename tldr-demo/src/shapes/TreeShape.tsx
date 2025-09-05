// src/shapes/TreeShape.tsx
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


export type TreeShape = TLBaseShape<'tree', {
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

export class TreeShapeUtil extends BaseBoxShapeUtil<TreeShape> {
  static override type = 'tree' as const

  // Declare style props → tldraw shows the matching style controls
  static override props: RecordProps<TreeShape> = {
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

  getDefaultProps(): TreeShape['props'] {
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

component(shape: TreeShape) {
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
    <path d="M27.33,32.65c-1.11-0.53-1.88-0.92-2.66-1.27c-3.74-1.71-5.52-5.04-5.47-8.41c0.06-4.08,2.39-6.85,6.45-8
      c1.18-0.34,1.64-0.96,1.75-2.16c0.49-5.16,5.62-8.8,10.65-7.52c1.41,0.36,2.76,1.05,4.04,1.75c0.89,0.49,1.5,0.49,2.13-0.31
      c2.7-3.41,6.27-4.32,10.34-3.38c3.9,0.9,6.52,3.41,7.83,7.15c0.53,1.51,1.3,2.23,2.92,2.44c3.05,0.39,5.98,3.18,6.59,6
      c0.76,3.53-0.1,6.75-3.29,8.2c-2.77,1.26-4.12,3.76-6.37,5.37c-0.8,0.57-0.95,1.29,0.15,1.9c0.75,0.42,1.49,0.96,2.05,1.6
      c0.93,1.05,1.85,1.07,2.99,0.41c2.89-1.67,5.86-1.67,8.58,0.19c2.67,1.81,3.85,4.52,3.36,7.77c-0.22,1.43,0.31,2.13,1.56,2.75
      c4.72,2.35,6.73,7.57,5,12.69c-1.53,4.52-6.76,7.48-11.64,6.4c-1.41-0.31-2.75-1.1-4-1.86c-0.98-0.6-1.79-0.65-2.69,0
      c-3.68,2.68-7.53,2.72-11.45,0.65c-0.93-0.49-1.6-0.52-2.53,0.02c-1.04,0.61-2.26,1.11-3.44,1.23c-1.5,0.15-1.94,0.84-1.93,2.17
      c0.02,3.55-0.01,7.1-0.01,10.65c0,4.53,0,9.05,0.01,13.58c0.01,2.13,0.25,2.38,2.39,2.4c2.67,0.02,5.35,0,8.02,0.02
      c0.56,0,1.2-0.06,1.66,0.18c0.48,0.25,1.02,0.79,1.09,1.27c0.05,0.36-0.52,0.95-0.95,1.21c-0.4,0.24-0.99,0.25-1.49,0.26
      c-8.22,0.01-16.45,0-24.67,0c-0.15,0-0.35,0.05-0.46-0.02c-0.67-0.45-1.78-0.85-1.87-1.4c-0.18-1.11,0.87-1.5,1.88-1.5
      c3.08-0.02,6.17,0.02,9.25-0.01c1.96-0.02,2.22-0.28,2.22-2.25c0.01-5.25-0.02-10.49,0.03-15.74c0.01-1.36-0.47-2.21-1.77-2.7
      c-1.97-0.74-3.9-1.6-5.83-2.43c-0.94-0.41-1.9-1.02-1.39-2.17c0.49-1.11,1.54-0.96,2.53-0.53c1.51,0.65,3.03,1.27,4.56,1.88
      c1.4,0.56,1.8,0.31,1.87-1.14c0.04-0.87,0.16-1.79-0.06-2.61c-0.19-0.71-0.7-1.42-1.25-1.92c-1.78-1.59-3.42-1.68-5.69-0.29
      c-3.57,2.19-7.35,1.67-10.9-0.67c-0.59-0.39-1.73-0.43-2.39-0.13c-3.67,1.66-7.22,1.59-10.54-0.69c-3.55-2.45-4.98-5.99-4.28-10.21
      c0.6-3.58,2.69-6.22,6.06-7.62c1.54-0.64,2.25-1.46,2.23-3.19c-0.04-4.24,2.99-8.4,7.58-9.48C26.37,33.08,26.64,32.93,27.33,32.65z
       M40.88,55.33c0.03,2.97,1.46,5.2,4.03,6.43c2.48,1.19,5.08,1.04,7.45-0.62c2.06-1.44,1.97-1.28,4,0.27
      c1.21,0.92,2.75,1.59,4.24,1.89c2.76,0.56,4.96-0.74,6.8-2.76c1.11-1.22,1.94-1.19,3.09,0c0.21,0.22,0.4,0.47,0.61,0.69
      c2.11,2.13,5.84,2.87,8.25,1.63c3.01-1.55,4.68-4.59,4.23-7.71c-0.45-3.06-3.02-5.61-6.13-6.08c-2.43-0.37-2.85-1.27-1.61-3.43
      c1.67-2.91,0.12-6.56-3.14-7.27c-2.28-0.49-4.08,0.36-5.63,2.04c-1.74,1.89-2.44,1.76-3.54-0.49c-1.69-3.45-5.67-5.05-9.38-3.76
      c-3.69,1.28-5.58,4.77-4.73,8.71c0.5,2.29,0.1,2.85-2.2,3.14C43.55,48.45,40.77,51.66,40.88,55.33z M27.96,17.76
      c-2.13-0.12-4.01,0.8-4.98,2.45c-1.47,2.49-1.13,5.06,0.95,7.17c1.93,1.95,4.87,2.42,7.19,1.03c1.08-0.65,1.95-0.61,2.95,0.18
      c1.27,1,2.7,1.58,4.4,1.58c2.68,0,4.59-1.62,6.63-2.93c1.55-0.99,2.24-1.11,3.74-0.03c1.21,0.86,2.41,1.74,3.66,2.55
      c4.11,2.68,7.92,1.74,10.48-2.43c0.48-0.78,1.41-1.4,2.26-1.81c1.35-0.65,2.75-1.13,3.47-2.62c0.89-1.84,0.53-3.56-0.63-5.07
      c-1.29-1.66-3.07-2.33-5.2-1.95c-1.94,0.35-2.48-0.12-2.78-2.03c-0.16-1.05-0.38-2.13-0.8-3.11c-1.28-3.01-4.41-5.09-7.55-4.9
      c-3.18,0.19-5.32,1.88-6.43,4.91c-0.69,1.89-2.02,2.07-3.29,0.46c-1.32-1.67-2.88-2.97-5.03-3.28c-3.95-0.56-7.04,2.79-6.58,7.08
      C30.65,17.28,30.12,17.88,27.96,17.76z M45.31,41.9c0,0-0.01,0-0.01,0c0-0.51,0.01-1.03,0-1.54c-0.04-1.93-0.8-2.64-2.58-1.98
      c-1.34,0.5-2.65,1.32-3.7,2.3c-1.46,1.35-2.35,1.42-3.12-0.39c-1.1-2.59-3.14-3.87-5.71-4.43c-2.67-0.58-5.04,0.24-6.85,2.21
      c-1.74,1.89-2.62,4.15-1.81,6.8c0.65,2.11,0.18,2.84-1.97,3.13c-3.03,0.4-5.6,2.54-6.25,5.2c-0.82,3.34,0.23,6.21,2.96,8.12
      c2.3,1.61,5.7,1.54,8.24-0.17c2.07-1.39,2.07-1.39,3.97,0.31c2.67,2.4,6.62,2.63,9.5,0.56c0.94-0.68,1.42-1.46,0.83-2.62
      c-2.43-4.8-0.03-11.1,5.21-13.63c0.62-0.3,1-1.27,1.27-2.01C45.47,43.19,45.31,42.52,45.31,41.9z M29.8,32.74
      c0.55,0.16,0.92,0.32,1.31,0.39c2.15,0.37,4,1.32,5.5,2.89c0.97,1.01,1.88,0.93,3.04,0.38c1.04-0.49,2.19-0.89,3.33-1.04
      c2.3-0.3,2.46-0.39,2.35-2.75c-0.07-1.47-0.54-1.75-1.8-0.96c-3.17,2-6.4,1.93-9.67,0.33C31.87,30.99,31.54,31.02,29.8,32.74z
       M48.2,33.28c-0.04,0.01-0.09,0.03-0.13,0.04c0.21,0.76,0.42,1.52,0.63,2.29c0.62-0.34,1.24-0.68,1.86-1.02
      c0.18-0.1,0.42-0.14,0.53-0.29c0.27-0.37,0.75-1.06,0.67-1.14c-0.73-0.73-1.54-1.4-2.39-1.99c-0.19-0.13-0.67,0.04-0.94,0.2
      c-0.16,0.1-0.21,0.44-0.24,0.68C48.17,32.46,48.2,32.87,48.2,33.28z"/>
  </g>
</svg>


    </HTMLContainer>
  )
}


  indicator(shape: TreeShape) {
    const { w, h } = shape.props
    const r = Math.min(h / 2, 999)
    return <rect width={w} height={h} rx={r} ry={r} />
  }
}
