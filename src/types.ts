import { ICanvasStyle, Container, Graphics } from "pixi.js"

export type TinyAssets = { [name: string]: string }

export interface TinyCanvasStyle extends ICanvasStyle {
 marginLeft: string 
 marginRight: string 
 marginTop: string 
 marginBottom: string 
}

export type TinyDisplay = Graphics

export interface Widget {
  readonly container: Container,
  addGui(gui: TinyDisplay): void 
}

export interface TinyScene {
  readonly name: string,
  active?: boolean,
  init(): void,
  update(elapsedFrames: number): void
}