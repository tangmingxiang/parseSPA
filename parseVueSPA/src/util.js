import axios from 'axios'
export async function isExist(filePath) {
  try {
    const yy = await axios.get(filePath)
    return true
  } catch(error) {
    console.log(error.message)
    return false
  }
}