import * as Core from "./core"
import { active, addScene, addWidget, switchTo } from "./scenes"

export const zzt = {
  core: {
    init: Core.init,
    assignAssets: Core.assignAssets,
    loadAssets: Core.loadAssets,
  },
  scenes: {
    addScene: addScene,
    addWidget: addWidget,
    switchTo: switchTo,
    active: active,
  },
}

export { Widget, Scene } from "./scenes"
export * from "./types"
