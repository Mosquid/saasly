const { fetchPageData } = require("./http");
const { isListed, incrementOffset } = require("./used");
const ogs = require("open-graph-scraper");
const csv = require("csvtojson");
const { resolve, dirname } = require("path");
const scriptPath = process.argv[1];
const scriptDirectory = dirname(scriptPath);

const getDataOffset = () => {
  return incrementOffset();
};

function normalizeDomain(domain) {
  // Check if the domain starts with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(domain)) {
    // If not, add 'https://' by default
    domain = "https://" + domain;
  }

  try {
    // Create a URL object to validate and normalize the domain
    const url = new URL(domain);

    // Return the normalized URL as a string
    return url.origin;
  } catch (error) {
    // If there's an error, the domain is not valid
    console.error("Invalid domain:", domain);
    return null;
  }
}

const getSaasData = async () => {
  try {
    const data = await csv().fromFile(
      resolve(scriptDirectory, "./companies.csv")
    );
    const offset = getDataOffset();
    const item = data[Number(offset)];
    const details = await getCompanyDetails(item.Website);
    const name = item["Company Name"];
    const info = item["Company Description"];
    const icon = details.image;

    return {
      name,
      info,
      icon,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCompanyDetails = async (domain) => {
  try {
    const data = await ogs({
      timeout: 10000,
      fetchOptions: {
        signal: null,
      },
      url: normalizeDomain(domain),
    });

    const { result } = data;
    const { ogImage } = result;

    const url = Array.isArray(ogImage) ? ogImage[0].url : ogImage.url;

    return { image: url };
  } catch (error) {
    console.error(error);
    return {};
  }
};

module.exports.getDataOffset = getDataOffset;
module.exports.getSaasData = getSaasData;
