/**
 * Collection of utilities associated with deleting assignments
 */

import { getOne, nodeToXpath, getTopicRootElements } from "./xpath_utils";

/******************************************************************************
 *
 * UTILITY FUNCTIONS
 *
 * Pure utilities that do not necessarily need to be executed in sequence.
 *
 */

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
   */

  // click on "delete" option (xpath always the same)
  let deleteOption;
  try {
    deleteOption = getOne("/html/body/div[11]/div/div/span[2]");
  } catch (e) {
    console.warn("deleteOption selection failed; retrying with div12");
    deleteOption = getOne("/html/body/div[12]/div/div/span[2]");
  }
  naturalClick(deleteOption);
  await sleep(1500);
  let confirmDelete;
  try {
    confirmDelete = getOne(
      '//*[@id="yDmH0d"]/div[11]/div/div[2]/div[3]/div[2]'
    );
  } catch (e) {
    console.warn("confirmDelete selection failed; retrying with div12");
    confirmDelete = getOne(
      '//*[@id="yDmH0d"]/div[12]/div/div[2]/div[3]/div[2]'
    );
  }
  confirmDelete.click();
};

const lenTopic = (topicName) => {
  /**
   * @param {string} topicName name of a classroom topic
   * @returns {number} of posts under that topic
   */
  const node = selectTopic(topicName);
  const commonRootNode = node.parentElement.parentElement.parentElement;
  const assignmentNodes = nodeToXpath(
    commonRootNode,
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
  return target;
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
   */
  // bring up the three-dot menu
  const assignmentRoot = firstAssignmentRoot(topicRootNode);
  menuButton(assignmentRoot).click();
  await sleep(1000);
  await followThroughDelete();
};

const deleteTopic = async (topicName) => {
  /**
   * Delete all the assignments beneath a topic, then delete the topic
   * itself.
   */
  let node;
  node = selectTopic(topicName);
  const commonRootNode = node.parentElement.parentElement.parentElement;
  const numTopics = lenTopic(topicName);
  for (let i = 0; i < numTopics; i++) {
    console.log(`i = ${i}`);
    await deleteFirstAssignment(commonRootNode);
    await sleep(2000);
  }
  const topicMenu = nodeToXpath(
    commonRootNode,
    "div[1]/div/div/div/div/div",
    false
  );
  naturalClick(topicMenu);
  await sleep(1000);
  await followThroughDelete();
};

export const deleteTopics = async (topicNames) => {
  /**
   * @param {array} topicNames Array of topic names
   * @returns {array} List of topics that failed to be deleted.
   */
  let failed = [];
  topicNames.forEach(async (name, i) => {
    // TODO: these functions are all getting run at the same time.
    // I think a traditional for loop will fix
    try {
      await deleteTopic(name);
    } catch (e) {
      console.warn(`Topic "${name}" failed due to ${e}`);
      failed.push(name);
    }
  });
};
