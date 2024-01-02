import { Container } from "pixi.js"
import * as Core from "./core"
import { TinyDisplay } from "./types"

export interface Widget {
  readonly name: string
  gui(): TinyDisplay
}

export interface Scene {
  readonly name: string
  active?: boolean
  init(): void
  update?(elapsedFrames: number): void
}

type SceneInternal = {
  container: Container
  scene: Scene
  widgets: Array<WidgetInternal>
}
type WidgetInternal = {
  container: Container
  widget: Widget
}

type InternalScenes = { [name: string]: SceneInternal }
const _scenes: InternalScenes = {}

let _current: SceneInternal

export const init = (): void => {
  if (_current === undefined) {
    throw new Error("No active scene to run")
  }

  _current.scene.init()
}

export const addScene = (scene: Scene): void => {
  if (_scenes[scene.name] !== undefined) {
    throw new Error(`Scene with name ${scene.name} already exists`)
  }
  // Transform scene internal
  const s = <SceneInternal>{
    container: new Container(),
    scene: scene,
    widgets: [],
  }
  // Save
  if (scene.active === true) _current = s
  _scenes[s.scene.name] = s
}

export const addWidget = (widget: Widget, sceneName: string): void => {
  if (_scenes[sceneName] === undefined) {
    throw new Error(`Scene with name ${sceneName} doesn't exist`)
  }
  // Create internal widget
  const w = <WidgetInternal>{
    container: new Container(),
    widget: widget,
  }
  _scenes[sceneName].widgets.push(w)
  // Add widget to scene stage
  _scenes[sceneName].container.addChild(w.container)
}

export const switchTo = (sceneName: string): void => {
  if (_scenes[sceneName] === undefined) {
    throw new Error(`Scene with name ${sceneName} not found`)
  }

  Core.remove(_current.container)
  Core.add(_scenes[sceneName]!.container)

  _current = _scenes[sceneName] as SceneInternal
  _current.scene.init()
}

export const active = (): SceneInternal => {
  return _current
}
