const { fetchPageData } = require("./http");
const { isListed, addToUsedList } = require("./used");
const apiUrl = "https://golden.com/api/v1/";
//?page=1&per_page=100

const minPage = 1;
const maxPage = 30;
const perPage = 10;

const getDataOffset = () => {
  const page = Math.random() * (maxPage - minPage) + minPage;
  const post = Math.random() * (perPage - minPage) + minPage;

  if (isListed(post * page)) {
    return getDataOffset();
  }
  return [page, post].map(Math.round);
};

const parseSiteData = (data) => {
  if (!data) return null;

  const { name, thumbnail, description, generated_description = {} } = data;
  const icon = thumbnail.original || "";

  const info = collectLeafs({
    nodes: [].concat(generated_description.nodes, description.nodes),
  })
    .join(" ")
    .trim();

  return {
    name,
    info,
    icon,
  };
};

const collectLeafs = (desc = {}) => {
  try {
    const { nodes = [] } = desc;

    return nodes.map((node) => {
      if (node && node.leaves) {
        return node.leaves
          .map(({ text }) => text)
          .filter(Boolean)
          .join(" ");
      }
      return collectLeafs(node);
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getSaasData = async () => {
  try {
    const [page, post] = getDataOffset();
    const url = `${apiUrl}queries/list-of-software-as-a-service-companies-BMY/results?page=${page}&per_page=${perPage}`;
    const data = await fetchPageData(url);
    const { results } = data;
    const saas = results[post - 1];

    addToUsedList(page * post);

    return getCompanyDetails(saas.slug);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCompanyDetails = async (cid) => {
  try {
    const url = `${apiUrl}entities/${cid}/?quick_view=true`;
    const data = await fetchPageData(url);
    const { structuredData } = data;

    if (!structuredData) return null;
    return parseSiteData(structuredData);
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports.getDataOffset = getDataOffset;
module.exports.getSaasData = getSaasData;
