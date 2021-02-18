/**
 * Collection of utilities associated with deleting assignments
 */

import { getOne, getTopicElements, nodeToXpath } from "./xpath_utils";

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

const deleteFirstAssignment = (topicRootNode) => {
  /**
   * Delete the first assignment given the root node of a topic.
   * This action is repeated until there is nothing left in the topic.
   * @param {node} topicRootNode DOM node where first assgt will be deleted
   */
  // bring up the three-dot menu
  const relativeXpath = "div[1]/div/div/div/div/div";
  const menu = nodeToXpath(topicRootNode, relativeXpath);
  console.log(menu);
  menu.click();
  setTimeout(() => {
    // click on "delete" option
    throw new Error("Not implemented: remove hard coded xpath");
    const delete_option = getOne("/html/body/div[11]/div/div/span[2]");
    naturalClick(delete_option);
    setTimeout(() => {
      // confirm delete; this xpath should work for any assgt
      throw new Error("Not implemented: remove hard coded xpath");
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
  const allTopics = getTopicElements();
  let target;
  for (let t in allTopics) {
    if (allTopics[t].innerText === topicName) {
      target = allTopics[t];
    }
  }
  if (!target) {
    throw new Error(`Target element for topic ${topicName} not found`);
  }
  return target;
};

const deleteTopic = (topicName) => {
  const node = selectTopic(topicName);
  const commonRootNode = node.parentElement.parentElement.parentElement;
  deleteFirstAssignment(commonRootNode);
};

export const deleteTopics = (topicNames) => {
  /**
   * @param {array} topicNames Array of topic names
   * @returns {array} List of topics that failed to be deleted.
   */
  let failed = [];
  for (let i in topicNames) {
    // try {
    deleteTopic(topicNames[i]);
    // } catch (e) {
    // console.log(`Failed to delete topic ${topicNames[i]} due to error ${e}`);
    // failed.push(topicNames[i]);
    // }
  }
};
