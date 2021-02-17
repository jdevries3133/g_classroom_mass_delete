import React, { Fragment } from "react";
import styled from "styled-components";

import { DeleteTopics } from "./topic_list";

const Div = styled.div`
  width: 300px;
  > h3 {
    font-style: italic;
  }
`;

export const App = () => {
  const onDelete = (topics) => {
    // TODO: ask content script to do deletion.
  };
  return (
    <Fragment>
      <Div>
        <h1>Delete By Topic</h1>
        <h3>In Google Classroom</h3>
        <p>Check off the topics you want to delete.</p>
      </Div>
      <DeleteTopics deleteCallback={onDelete} />
    </Fragment>
  );
};
