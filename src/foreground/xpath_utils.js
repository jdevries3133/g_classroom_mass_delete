export const getOne = (xpath) => {
  /**
   * Return document node at a single xpath, or throw an error
   */
  const node = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (node) {
    return node;
  }
  throw new Error(`Single node not found for xpath: "${xpath}"`);
};

export const getMany = (xpath) => {
  /**
   * Get an array of nodes for selector that are expected to return many,
   * or throw an error.
   */
  let nodes = [];
  try {
    const result = document.evaluate(
      xpath,
      document,
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
