import React, { useEffect, useState } from "react";

import { ContextError } from "./errors";
import { DeleteSelectionForm } from "./delete_selection_form";

export const DeleteTopics = () => {
  let [contentScriptResponse, setContentScriptResponse] = useState([]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getTopics" }, (response) => {
        setContentScriptResponse(response);
      });
    });
  }, []);
  if (
    contentScriptResponse &&
    contentScriptResponse.length > 0 &&
    typeof contentScriptResponse !== "string"
  ) {
    return <DeleteSelectionForm topics={contentScriptResponse} />;
  } else {
    return <ContextError errorMsg={contentScriptResponse} />;
  }
};
