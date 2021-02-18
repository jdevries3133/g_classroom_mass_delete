import React, { useState } from "react";
import styled from "styled-components";

import { SelectTopicsToDelete } from "./select_delete.container";
import { Loading } from "./spinner";

const Div = styled.div`
  width: 300px;
  > h3 {
    font-style: italic;
  }
`;

export const App = () => {
  const [deleting, setDeleting] = useState(false);
  const onDelete = (topics) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "deleteTopics",
        payload: topics,
      });
    });
    setDeleting(true);
  };
  return (
    <Div>
      <h1>Delete By Topic</h1>
      <h3>In Google Classroom</h3>
      {deleting ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <p>Check off the topics you want to delete.</p>
          <SelectTopicsToDelete deleteCallback={onDelete} />
        </>
      )}
    </Div>
  );
};
