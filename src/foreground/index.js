/**
 * Script running in the context of the classroom tab with access
 * to the classroom dom
 */
import { deleteTopics } from "./delete_assignment";
import { getTopicRootElements } from "./xpath_utils";

const getTopicNames = () => {
  return getTopicRootElements().map((i) => i.innerText);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "getTopics":
      if (window.location.hostname !== "classroom.google.com") {
        sendResponse("wrongSite");
      } else if (!window.location.href.split("/").includes("w")) {
        sendResponse("wrongPage");
      } else {
        sendResponse(getTopicNames());
      }
      break;

    case "deleteTopics":
      deleteTopics(request.payload);
      console.log("All topics deleted");
      sendResponse();
      break;

    default:
      console.warn(`Unknown message type from popup: ${request.type}`);
  }
});
