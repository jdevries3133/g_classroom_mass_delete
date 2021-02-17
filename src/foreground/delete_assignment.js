/**
 * Collection of utilities associated with deleting assignments
 */

import { getOne } from "./xpath_utils";

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

export const deleteAssignment = () => {
  // bring up the three-dot menu
  const menu = document.evaluate(
    "/html/body/div[2]/div/div/main/div/div/div[4]/ol/li[4]/div[2]/div/div/div[3]/ol/li[1]/div/div/div[4]/div/div",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  menu.click();
  setTimeout(() => {
    // click on "delete" option
    const delete_option = document.evaluate(
      "/html/body/div[11]/div/div/span[2]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    naturalClick(delete_option);
    setTimeout(() => {
      // confirm delete; this xpath should work for any assgt
      let confirmDelete = getOne(
        '//*[@id="yDmH0d"]/div[11]/div/div[2]/div[3]/div[2]'
      );
      naturalClick(confirmDelete);
    }, 1500);
  }, 1000);
};
