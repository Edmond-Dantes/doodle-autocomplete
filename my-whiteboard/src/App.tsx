import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { StampShapeUtil } from './shapes/StampShape'
import { BoxShapeUtil } from './shapes/BoxShape'
import { uiOverrides, components, assetUrls } from './ui-overrides'

export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        shapeUtils={[StampShapeUtil, BoxShapeUtil]}
        overrides={uiOverrides}
        components={components}
        assetUrls={assetUrls}
      />
    </div>
  )
}
