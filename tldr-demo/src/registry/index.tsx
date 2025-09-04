//registry for all louise's code

// src/registry/index.ts
import { StampShapeUtil } from '../shapes/StampShape'
import { StampTool } from '../tool_events/StampTool'
import { assetUrls } from '../ui/icons'
import { uiOverrides, components } from '../ui/ui-overrides'

import { AxisShapeUtil } from '../shapes/AxisShape'
import { AxisTool } from '../tool_events/AxisTool'

import { BatShapeUtil } from '../shapes/BatShape'
import { BatTool } from '../tool_events/BatTool'

import { CarShapeUtil } from '../shapes/CarShape'
import { CarTool } from '../tool_events/CarTool'

import { CatShapeUtil } from '../shapes/CatShape'
import { CatTool } from '../tool_events/CatTool'

import { DogShapeUtil } from '../shapes/DogShape'
import { DogTool } from '../tool_events/DogTool'

import { GlassesShapeUtil } from '../shapes/GlassesShape'
import { GlassesTool } from '../tool_events/GlassesTool'

import { HouseShapeUtil } from '../shapes/HouseShape'
import { HouseTool } from '../tool_events/HouseTool'

import { MoonShapeUtil } from '../shapes/MoonShape'
import { MoonTool } from '../tool_events/MoonTool'

import { BoatShapeUtil } from '../shapes/SailboatShape'
import { BoatTool } from '../tool_events/SailboatTool'

import { StickShapeUtil } from '../shapes/StickFigureShape'
import { StickTool } from '../tool_events/StickFigureTool'

import { TreeShapeUtil } from '../shapes/TreeShape'
import { TreeTool } from '../tool_events/TreeTool'


export const shapeUtils = [
  StampShapeUtil,
  AxisShapeUtil,
  BatShapeUtil,
  CarShapeUtil,
  CatShapeUtil,
  DogShapeUtil,
  GlassesShapeUtil,
  HouseShapeUtil,
  MoonShapeUtil,
  BoatShapeUtil,
  StickShapeUtil,
  TreeShapeUtil,
]

export const tools = [
  StampTool,
  AxisTool,
  BatTool,
  CarTool,
  CatTool,
  DogTool,
  GlassesTool,
  HouseTool,
  MoonTool,
  BoatTool,
  StickTool,
  TreeTool,
]


export { assetUrls, uiOverrides, components }
