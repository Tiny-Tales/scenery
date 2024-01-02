import { Application, Container, DisplayObject } from "pixi.js"
import { TinyDisplay } from "./types"

export interface Widget {
  readonly container: Container
  addGui(gui: TinyDisplay): void
}

export interface Scene {
  readonly name: string
  active?: boolean
  init(): void
  update?(elapsedFrames: number): void
}
type SceneInternal = {
  container: DisplayObject
  scene: Scene
}

type InternalScenes = { [name: string]: SceneInternal }
const _scenes: InternalScenes = {}

let _current: SceneInternal

let _app: Application

export const registerApp = (app: Application): void => {
  _app = app
}

export const add = (scene: Scene): void => {
  if (_scenes[scene.name] !== undefined) {
    throw new Error(`Scene with name ${scene.name} already exists`)
  }
  // Transform scene internal
  const s = <SceneInternal>{
    container: new Container(),
    scene: scene,
  }
  // Save
  if (scene.active === true) _current = s
  _scenes[s.scene.name] = s
}

export const switchTo = (sceneName: string): void => {
  if (_scenes[sceneName] === undefined) {
    throw new Error(`Scene with name ${sceneName} not found`)
  }

  _app.stage.removeChild(_current.container)
  _app.stage.addChild(_scenes[sceneName]!.container)

  _current = _scenes[sceneName] as SceneInternal
}

export const activeScene = (): SceneInternal => {
  console.log("all scenes", _scenes)
  console.log("active", _current)
  return _current
}
