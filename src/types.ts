import { type ICanvasStyle, Graphics } from "pixi.js"

export type TinyAssets = { [name: string]: string }

export interface TinyCanvasStyle extends ICanvasStyle {
  marginLeft: string
  marginRight: string
  marginTop: string
  marginBottom: string
}

export type TinyDisplay = Graphics
