const axios = require("axios")

module.exports.fetchPageData = async (url) => {
  try {
    const resp = await axios.get(url)
    return resp.data
  } catch (error) {
    return null
  }
}
