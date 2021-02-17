/**
 * Script running in the context of the classroom tab with access
 * to the classroom dom
 */

const getTopicElements = () => {
  let els = [];
  const result = document.evaluate(
    '//*[@id="c1"]/div/div/div[4]/ol/li/div[1]/div/a',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (let i = 0; i < result.snapshotLength; i++) {
    els.push(result.snapshotItem(i));
  }
  return els;
};

const getTopicNames = () => {
  const els = getTopicElements();
  return getTopicElements().map((i) => i.innerText);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const topicNames = getTopicNames();
  sendResponse(topicNames);
});
