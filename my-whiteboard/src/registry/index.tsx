//registry for all louise's code

// src/registry/index.ts
import { StampShapeUtil } from '../shapes/StampShape'
import { StampTool } from '../tool_events/StampTool'
import { assetUrls } from '../ui/icons'
import { uiOverrides, components } from '../ui/ui-overrides'

export const shapeUtils = [StampShapeUtil]
export const tools = [StampTool]

export { assetUrls, uiOverrides, components }
