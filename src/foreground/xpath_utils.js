const makeXpath = (node) => {
  let allNodes = document.getElementsByTagName("*");
  for (let segs = []; node && node.nodeType == 1; node = node.parentNode) {
    if (node.hasAttribute("id")) {
      let uniqueIdCount = 0;
      for (let n = 0; n < allNodes.length; n++) {
        if (allNodes[n].hasAttribute("id") && allNodes[n].id == node.id)
          uniqueIdCount++;
        if (uniqueIdCount > 1) break;
      }
      if (uniqueIdCount == 1) {
        segs.unshift('id("' + node.getAttribute("id") + '")');
        return segs.join("/");
      } else {
        segs.unshift(
          node.localName.toLowerCase() +
            '[@id="' +
            node.getAttribute("id") +
            '"]'
        );
      }
    } else if (node.hasAttribute("class")) {
      segs.unshift(
        node.localName.toLowerCase() +
          '[@class="' +
          node.getAttribute("class") +
          '"]'
      );
    } else {
      let i;
      let sib;
      for (i = 1, sib = node.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.localName == node.localName) i++;
      }
      segs.unshift(node.localName.toLowerCase() + "[" + i + "]");
    }
  }
  return segs.length ? "/" + segs.join("/") : null;
};

export const nodeToXpath = (node, xpath) => {
  /**
   * Given a context node and an xpath to describe the route from that
   * node to another, return the resultant node.
   */
  const fullXpath = makeXpath(node) + "/" + xpath;
  return getOne(fullXpath);
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
  return node;
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

export const getTopicElements = () => {
  return getMany('//*[@id="c1"]/div/div/div[4]/ol/li/div[1]/div/a');
};
