import { Container } from "pixi.js"
import * as Core from "./core"

export interface Widget {
  readonly name: string
  draw(parent: DrawReference): void
}

export interface Scene {
  readonly name: string
  active?: boolean
  init(): void
  update?(elapsedFrames: number): void
}

type Position = { x: number; y: number }
type Dimensions = { w: number; h: number }
export type DrawReference = {
  container: Container
  position: Position
  dimensions: Dimensions
}

type SceneInternal = {
  width: number
  height: number
  container: Container
  scene: Scene
  widgets: Array<WidgetInternal>
}
type WidgetInternal = {
  width: number
  height: number
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

  _current.width = Core.width()
  _current.height = Core.height()

  _current.scene.init()
  _current.widgets.forEach((w: WidgetInternal) => {
    if (w.width <= 0) w.width = Core.width()
    if (w.height <= 0) w.height = Core.height()

    w.widget.draw({
      container: w.container,
      dimensions: { w: w.width, h: w.height },
      position: { x: 0, y: 0 },
    })
  })
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
    // Dimensions get set during init
    width: 0,
    height: 0,
  }
  s.container.name = scene.name
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
    // Dimensions get set during init
    width: 0,
    height: 0,
  }
  w.container.name = widget.name
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
  init()
}

export const active = (): SceneInternal => {
  return _current
}
