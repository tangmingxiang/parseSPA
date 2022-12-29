import { isExist } from "./util"
// const configPath = '../../../src/router/index.js'
const configPath = './util'
const isConfigPathExist = await isExist(configPath)
console.log("isConfigPathExist", isConfigPathExist)
let router
let errorFlag = false
if (isConfigPathExist) {
  try {
    let data = await import(configPath)
    console.log(data)
  } catch(error) {
    errorFlag = true
  }
}