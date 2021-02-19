/**
 * Various functions for traversing the DOM with xpaths.
 */

const makeXpath = (node) => {
  if (node.tagName == "HTML") return "/HTML[1]";
  if (node === document.body) return "/HTML[1]/BODY[1]";

  var ix = 0;
  var siblings = node.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === node)
      return (
        makeXpath(node.parentNode) + "/" + node.tagName + "[" + (ix + 1) + "]"
      );
    if (sibling.nodeType === 1 && sibling.tagName === node.tagName) ix++;
  }
};

export const nodeToXpath = (node, xpath, many) => {
  /**
   * Given a context node and an xpath to describe the route from that
   * node to another, return the resultant node.
   * @param {node} node DOM node to search from
   * @param {string} xpath Describes route from node to target
   * @param {boolean} many Whether the xpath should return one or many nodes.
   */
  const fullXp = makeXpath(node) + "/" + xpath;
  const rval =  many ? getMany(fullXp) : getOne(fullXp);
  return rval
};

export const getOne = (xpath, contextNode = null) => {
  /**
   * Return document node at a single xpath, or throw an error
   */
  const node = document.evaluate(
    xpath,
    document,
    contextNode,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (node) {
    return node;
  }
  throw new Error(`Single node not found for xpath: "${xpath}"`);
};

export const getMany = (xpath, contextNode = document) => {
  /**
   * Get an array of nodes for selector that are expected to return many,
   * or throw an error.
   */
  let nodes = [];
  try {
    const result = document.evaluate(
      xpath,
      contextNode,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    for (let i = 0; i < result.snapshotLength; i++) {
      nodes.push(result.snapshotItem(i));
    }
  } catch (e) {
    throw new Error(
      `Failed to get many nodes for xpath "${xpath}" due to exception ${e}`
    );
  }
  return nodes;
};

export const getTopicRootElements = () => {
  return getMany('//*[@id="c1"]/div/div/div[4]/ol/li/div[1]/div/a');
};
