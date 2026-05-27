import type { ToolId } from '../types/tools'
import type { ToolHandler } from './types'
import { selectTool } from './selectTool'
import { panTool } from './panTool'
import { lineTool } from './lineTool'
import { rectTool } from './rectTool'
import { circleTool } from './circleTool'
import { edgeFinishTool } from './edgeFinishTool'
import { componentTool } from './componentTool'
import { lShapeTool } from './lShapeTool'
import { penTool } from './penTool'
import { rodaBancaTool } from './rodaBancaTool'
import { eraserTool } from './eraserTool'
import { textTool } from './textTool'

const handlers: Record<ToolId, ToolHandler> = {
  select: selectTool,
  pan: panTool,
  line: lineTool,
  pen: penTool,
  'roda-banca': rodaBancaTool,
  lshape: lShapeTool,
  rect: rectTool,
  circle: circleTool,
  shapes: edgeFinishTool,
  component: componentTool,
  eraser: eraserTool,
  text: textTool,
  measure: lineTool,
}

export function getToolHandler(tool: ToolId): ToolHandler {
  return handlers[tool] ?? selectTool
}

export * from './types'
