import React, { Fragment, useEffect, useState } from "react";

export const DeleteTopics = () => {
  let [topics, setTopics] = useState([]);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "documentRequest" },
        (response) => {
          console.log(response);
          setTopics(response);
        }
      );
    });
  });
  return (
    <form>
      {topics.map((i) => {
        return (
          <Fragment key={i}>
            <label htmlFor={`selectItem${i}`} key={i}>
              {i}
            </label>
            <input
              type="checkbox"
              name={`selectItem${i}`}
              value={topics[i]}
              onClick={() => checkedHandler(i)}
            />
          </Fragment>
        );
      })}
    </form>
  );
};
