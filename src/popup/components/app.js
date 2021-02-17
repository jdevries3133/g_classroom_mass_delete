import React, { Fragment } from "react";

import { DeleteTopics } from "./topic_list";

export const App = () => {
  const onDelete = (topics) => {
    // TODO: ask content script to do deletion.
  };
  return (
    <Fragment>
      <div>
        <h1>Hello, World</h1>
        <p>Check off some of our things!</p>
      </div>
      <DeleteTopics deleteCallback={onDelete} />
    </Fragment>
  );
};
