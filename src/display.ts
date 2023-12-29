import { Application, Container, DisplayObject } from "pixi.js";
import { TinyScene } from "./types";

type SceneInternal = {
  container: DisplayObject,
  name: string,
  active: boolean
}

type InternalScenes =  { [name: string]: SceneInternal }
const _scenes: InternalScenes = {}

let _current: SceneInternal

let _app: Application

export const registerApp = (app: Application): void => {
  _app = app
}

export const add = (scene: TinyScene): void => {
  if (_scenes[scene.name] !== undefined) {
    throw new Error(`Scene with name ${scene.name} already exists`)
  }
  // Transform scene internal
  const s = <SceneInternal>{
    container: new Container(),
    name: scene.name,
    active: scene.active ?? false
  }
  // Save
  if (scene.active === true) _current = s
  _scenes[s.name] = s
}

export const switchTo = (sceneName: string): void => {
  if (_scenes[sceneName] === undefined) {
    throw new Error(`Scene with name ${sceneName} not found`)
  }

  _app.stage.removeChild(_current.container)
  _app.stage.addChild(_scenes[sceneName].container)

  _current = _scenes[sceneName]
}