import React, { useEffect, useState } from "react";

import { ContextError } from "./errors";
import { DeleteSelectionForm } from "./select_delete.form";

export const SelectTopicsToDelete = (props) => {
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
    return (
      <DeleteSelectionForm
        topics={contentScriptResponse}
        deleteCallback={props.deleteCallback}
      />
    );
  } else {
    return <ContextError errorMsg={contentScriptResponse} />;
  }
};
