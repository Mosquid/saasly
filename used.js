const fs = require("fs");
const listPath = "./list.json";

module.exports.getUsedList = () => {
  if (fs.existsSync(listPath)) {
    const list = JSON.parse(fs.readFileSync(listPath, "utf8"));
    return Number(list);
  }
};

module.exports.incrementOffset = () => {
  const prev = module.exports.getUsedList();
  const curr = prev + 1;

  fs.writeFileSync(listPath, JSON.stringify(curr));

  return curr;
};
