/******************************************************************************
 *
 * Context Errors
 *
 * ( for when the popup is displayed in the wrong site or context
 *
 */

import React from "react";

const WrongSite = () => (
  <>
    <h2>Wrong Site!</h2>
    <p>
      Oops! This extension only works on{" "}
      <a
        onClick={() =>
          chrome.tabs.create({ url: "https://classroom.google.com/" })
        }
        href="#"
      >
        Google Classroom
      </a>
    </p>
  </>
);

const WrongPage = () => (
  <>
    <h2>Wrong Page!</h2>
    <p>Oops! Navigate to the classwork tab before using this extension.</p>
  </>
);

const EmptyArray = () => (
  <>
    <h2>Clicked Too Quick!</h2>
    <p>
      It looks like you have no topics. If you do have topics, close and open
      this window!
    </p>
  </>
);

export const ContextError = ({ errorMsg }) => {
  if (typeof errorMsg === "object" && !errorMsg.length) {
    return <EmptyArray />;
  }
  if (errorMsg === "wrongPage") {
    return <WrongPage />;
  }
  return <WrongSite />;
};
