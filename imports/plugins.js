import { logger } from "./logger.js"
import * as NpmPackages from '../package.json'

// List all plugins installed with npm
var pluginNames = Object.keys(NpmPackages.dependencies).filter(function(plugin){
  return plugin.startsWith("topogram-plugin")
})
logger.log("Topogram plugins registered : ",pluginNames);

registerPlugins(pluginNames)

// helpers to register plugins
var plugins = {}
function registerPlugins(pluginNames) {
  pluginNames.forEach(function(pluginName){
    logger.log("register " + pluginName)
    try {
        require(pluginName)
    } catch (e) {
      logger.error("a problem installing " + pluginName)
    }
  })
}
