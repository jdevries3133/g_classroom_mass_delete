import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";

const Ul = styled.ul`
  list-style: none;
  padding-left: 10px;
  > li > label {
    font-size: 20px;
  }
  > li > input[type="checkbox"] {
    input[type="checkbox"] {
      -webkit-appearance: none;
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 5px;
      border: 2px solid #555;
    }
    input[type="checkbox"]:checked {
      background: #abd;
    }
  }
`;

export const DeleteTopics = (props) => {
  let [topics, setTopics] = useState([]);
  let [checkboxState, setCheckboxState] = useState({});
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getTopics" }, (response) => {
        response ? setTopics(response) : console.warn("Topics are undefined");
      });
    });
  }, []);
  return (
    <form>
      <Ul>
        {topics.map((i) => {
          return (
            <li key={i}>
              <input
                type="checkbox"
                name={`selectItem${i}`}
                value={checkboxState[i]}
                onChange={() => {
                  setCheckboxState({
                    ...checkboxState,
                    [i]: !checkboxState[i],
                  });
                }}
              />
              <label htmlFor={`selectItem${i}`} key={i}>
                {i}
              </label>
            </li>
          );
        })}
      </Ul>
      <input
        onClick={(e) => {
          e.preventDefault();
          props.deleteCallback(
            Object.keys(checkboxState).filter((k) => checkboxState[k])
          );
        }}
        type="submit"
        value="Delete"
      ></input>
    </form>
  );
};
