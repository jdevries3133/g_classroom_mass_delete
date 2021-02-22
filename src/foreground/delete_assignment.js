/**
 * Collection of utilities associated with deleting assignments
 */

import { getOne, nodeToXpath, getTopicRootElements } from "./xpath_utils";

// adjust all sleep call times by this constant
let SLEEP_CORRECTION = 0.5;
// reduce sleep_correction if we are on an error-free streak
let SUCCESS_STREAK = 0;

/******************************************************************************
 *
 * UTILITY FUNCTIONS
 *
 * Pure utilities that do not necessarily need to be executed in sequence.
 *
 */

const sleep = (ms) => {
  /**
   * @param {number} ms milliseconds multiplied by the SLEEP_CORRECTION constant;
   *                    which is typically 1.
   * @returns {Promise}
   */
  return new Promise((resolve) => setTimeout(resolve, ms * SLEEP_CORRECTION));
};

const naturalClick = (targetNode) => {
  // Simulate a natural mouse-click sequence.
  triggerMouseEvent(targetNode, "mouseover");
  triggerMouseEvent(targetNode, "mousedown");
  triggerMouseEvent(targetNode, "mouseup");
  triggerMouseEvent(targetNode, "click");
};

const triggerMouseEvent = (node, eventType) => {
  var clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

const firstAssignmentRoot = (topicRootNode) => {
  return nodeToXpath(topicRootNode, "div[2]/div/div/div[3]/ol/li[1]", false);
};

const menuButton = (assignmentRoot) => {
  const menuB = nodeToXpath(assignmentRoot, "div/div/div[4]/div/div", false);
  return menuB;
};

const followThroughDelete = async () => {
  /**
   * Once the context menu (the one with three dots) has been brought up,
   * the process to click and confirm delete is identical for topics and
   * assignments alike.
   * @returns {boolean} whether the action succeeded
   */

  // click on "delete" option (xpath always the same)
  let deleteOption;
  try {
    deleteOption = getOne("/html/body/div[11]/div/div/span[2]");
  } catch {
    try {
      deleteOption = getOne("/html/body/div[12]/div/div/span[2]");
    } catch {
      return false;
    }
  }
  try {
    naturalClick(deleteOption);
    await sleep(800);
    let confirmDelete;
    try {
      confirmDelete = getOne(
        '//*[@id="yDmH0d"]/div[11]/div/div[2]/div[3]/div[2]'
      );
    } catch (e) {
      confirmDelete = getOne(
        '//*[@id="yDmH0d"]/div[12]/div/div[2]/div[3]/div[2]'
      );
    }
    confirmDelete.click();
    return true;
  } catch (e) {
    return false;
  }
};

const lenTopic = (topicName) => {
  /**
   * @param {string} topicName name of a classroom topic
   * @returns {number} of posts under that topic
   */
  const node = selectTopic(topicName);
  const assignmentNodes = nodeToXpath(
    node,
    "div[2]/div/div/div[3]/ol/li",
    true
  );
  return assignmentNodes.length;
};

const selectTopic = (topicName) => {
  /**
   * @param {string} topicName The name of a topic in the classroom
   * @returns {node} DOM node
   */
  const allTopics = getTopicRootElements();
  const target = allTopics.filter((topic) => topic.innerText === topicName)[0];
  if (!target || target.innerText !== topicName) {
    throw new Error(`Target element for topic ${topicName} not found`);
  }
  // walk up to topic root node from the element with topic name
  return target.parentElement.parentElement.parentElement;
};

/******************************************************************************
 *
 * SEQUENTIAL COMPONENT FUNCTIONS
 *
 * Functions that are called as part of the flow of deleting assignments,
 * which must be called in a particular order.
 *
 */

const deleteFirstAssignment = async (topicRootNode) => {
  /**
   * Delete the first assignment given the root node of a topic.
   * This action is repeated until there is nothing left in the topic.
   * @param {node} topicRootNode DOM node where first assgt will be deleted
   * @returns {boolean} whether or not the action was successful
   */
  // bring up the three-dot menu
  const assignmentRoot = firstAssignmentRoot(topicRootNode);
  menuButton(assignmentRoot).click();
  await sleep(500);
  return await followThroughDelete();
};

const deleteTopic = async (topicName) => {
  /**
   * Delete all the assignments beneath a topic, then delete the topic
   * itself.
   */
  let node;
  node = selectTopic(topicName);
  while (lenTopic(topicName)) {
    const successful = await deleteFirstAssignment(node);
    if (!successful) {
      // refresh rootNode if deleteFirstAssignment fails
      node = selectTopic(topicName);
      SLEEP_CORRECTION *= 1.3;
    } else {
      SUCCESS_STREAK += 1;
      if (SUCCESS_STREAK > 15) {
        SLEEP_CORRECTION *= 0.7;
        SUCCESS_STREAK = 0;
      }
    }
    console.log("sleep correction", SLEEP_CORRECTION);
    await sleep(2000);
  }

  const topicMenu = nodeToXpath(node, "div[1]/div/div/div/div/div", false);
  naturalClick(topicMenu);
  await sleep(800);
  let success = await followThroughDelete();
  if (success) {
    await sleep(2000);
    return true;
  } else {
    SLEEP_CORRECTION *= 1.3;
    await sleep(1000);
    deleteTopic(topicName);
  }
};

export const deleteTopics = async (topicNames) => {
  /**
   * @param {array} topicNames Array of topic names
   */
  for (let i = 0; i < topicNames.length; i++) {
    await deleteTopic(topicNames[i]);
  }
  console.info("All topis deleted.");
};
