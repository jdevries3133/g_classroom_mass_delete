/**
 * Collection of utilities associated with deleting assignments
 */

import { getOne, nodeToXpath, getTopicRootElements } from "./xpath_utils";

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
  // TODO: THIS IS WHERE THE PROBLEM IS
  // not getting properly between:
  // /html/body/div[2]/div/div/main/div/div/div[4]/ol/li[2]
  // /html/body/div[2]/div/div/main/div/div/div[4]/ol/li[2]/div[2]/div/div/div[3]/ol/li[1]
  return nodeToXpath(topicRootNode, "div[2]/div/div/div[3]/ol/li[1]", false);
};

const menuButton = (assignmentRoot) => {
  const menuB = nodeToXpath(assignmentRoot, "div/div/div[4]/div/div", false);
  console.log("Menu button", menuB);
  return menuB;
};

const deleteFirstAssignment = (topicRootNode) => {
  /**
   * Delete the first assignment given the root node of a topic.
   * This action is repeated until there is nothing left in the topic.
   * @param {node} topicRootNode DOM node where first assgt will be deleted
   */
  // bring up the three-dot menu
  console.log("topic root", topicRootNode);
  const assignmentRoot = firstAssignmentRoot(topicRootNode);
  console.log("assgt root", assignmentRoot);
  menuButton(assignmentRoot).click();
  return;
  setTimeout(() => {
    // click on "delete" option (xpath always the same)
    const deleteOption = getOne("/html/body/div[11]/div/div/span[2]");
    // TODO: remove console log
    console.log(deleteOption, "there was a problem here before");
    naturalClick(deleteOption);
    setTimeout(() => {
      // confirm delete; this xpath should work for any assgt
      let confirmDelete = getOne(
        '//*[@id="yDmH0d"]/div[11]/div/div[2]/div[3]/div[2]'
      );
      naturalClick(confirmDelete);
    }, 1500);
  }, 1000);
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

const deleteTopic = (topicName) => {
  for (let i = 0; i < lenTopic(topicName); i++) {
    let node;
    node = selectTopic(topicName);
    const commonRootNode = node.parentElement.parentElement.parentElement;
    setTimeout(() => deleteFirstAssignment(commonRootNode), i * 5000);
  }
  // TODO: delete the topic itself once all posts under the topic are deleted.
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
  console.log(`Deleting ${assignmentNodes.length} assignments`);
  return assignmentNodes.length;
};

export const deleteTopics = (topicNames) => {
  /**
   * @param {array} topicNames Array of topic names
   * @returns {array} List of topics that failed to be deleted.
   */
  let failed = [];
  topicNames.forEach((name) => {
    console.log(`Deleting topic ${name}`);
    try {
      deleteTopic(name);
    } catch (e) {
      console.log(`Failed to delete topic ${name} due to error ${e}`);
      failed.push(name);
    }
  });
};
