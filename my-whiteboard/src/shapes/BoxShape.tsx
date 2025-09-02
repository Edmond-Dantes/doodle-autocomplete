import { ShapeUtil, Rectangle2d, T, HTMLContainer } from 'tldraw'
import type { TLBaseShape, Geometry2d, RecordProps } from 'tldraw'

export type BoxShape = TLBaseShape<'box', { w: number; h: number; fill: string; radius: number }>

export class BoxShapeUtil extends ShapeUtil<BoxShape> {
  static override type = 'box' as const
  static override props: RecordProps<BoxShape> = {
    w: T.number, h: T.number, fill: T.string, radius: T.number,
  }
  getDefaultProps(): BoxShape['props'] { return { w: 200, h: 120, fill: '#E3F2FF', radius: 12 } }
  getGeometry(shape: BoxShape): Geometry2d {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true })
  }
  component(shape: BoxShape) {
    const { w, h, fill, radius } = shape.props
    return <HTMLContainer style={{ width: w, height: h, borderRadius: radius, background: fill }} />
  }
  indicator(shape: BoxShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={shape.props.radius} ry={shape.props.radius} />
  }
}
