import { Application, Assets, Container, type ProgressCallback } from "pixi.js"
import { TinyAssets, TinyCanvasStyle } from "./types"
import * as Scenes from "./scenes"

let _app: Application
let _width: number
let _height: number

export const width = (): number => _width
export const height = (): number => _height

export const init = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): Application => {
  _width = width
  _height = height
  // Start pixi app
  _app = new Application({
    background: "#000",
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: false,
    view: canvas,
    width: width,
    height: height,
  })
  // Assign active scene
  const scene = Scenes.active()
  _app.stage.addChild(scene.container)
  // Assign update callback if scene has one
  if (scene.scene.update) {
    _app.ticker.add(scene.scene.update)
  }
  // Resize canvas
  _resize()
  window.addEventListener("resize", () => _resize())
  // Run active scene
  Scenes.init()
  // Start update ticker
  _app.ticker.add(_update)

  return _app
}

export const add = (c: Container): void => {
  _app.stage.addChild(c)
}
export const remove = (c: Container): void => {
  _app.stage.removeChild(c)
}

export const assignAssets = (type: string, assets: TinyAssets): void => {
  Assets.addBundle(type, assets)
}

export const loadAssets = async (
  type: string,
  callback?: ProgressCallback
): Promise<any> => {
  return Assets.loadBundle(type, callback)
}

const _update = (framesPassed: number): void => {
  if (Scenes.active().scene.update) {
    Scenes.active().scene.update?.(framesPassed)
  }
}

const _resize = (): void => {
  const screenWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  const screenHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )

  const scale = Math.min(screenWidth / _width, screenHeight / _height)

  const enlargedWidth = Math.floor(scale * _width)
  const enlargedHeight = Math.floor(scale * _height)

  const horizontalMargin = (screenWidth - enlargedWidth) / 2
  const verticalMargin = (screenHeight - enlargedHeight) / 2

  const appStyle: TinyCanvasStyle = _app.view.style as TinyCanvasStyle
  appStyle!.width = `${enlargedWidth}px`
  appStyle!.height = `${enlargedHeight}px`
  appStyle!.marginLeft = appStyle!.marginRight = `${horizontalMargin}px`
  appStyle!.marginTop = appStyle!.marginBottom = `${verticalMargin}px`
}
