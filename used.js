const fs = require("fs")
const listPath = "./list.json"
let memList = null

module.exports.getUsedList = () => {
  if (memList) return memList
  if (fs.existsSync(listPath)) {
    memList = JSON.parse(fs.readFileSync(listPath, "utf8"))
  }

  return []
}

module.exports.addToUsedList = (num) => {
  memList = memList || []
  memList.push(num)

  fs.writeFileSync(listPath, JSON.stringify(memList))
}

module.exports.isListed = (num) => {
  const list = module.exports.getUsedList()
  if (list.includes(num)) return false
}
