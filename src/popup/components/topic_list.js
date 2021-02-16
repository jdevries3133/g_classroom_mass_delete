import React, { Fragment } from "react";

export const CheckList = ({ items, checkedHandler }) => {
  console.log(items);
  return (
    <form>
      {Object.keys(items).map((i) => {
        return (
          <Fragment key={i}>
            <label htmlFor={`selectItem${i}`} key={i}>
              {i}
            </label>
            <input
              type="checkbox"
              name={`selectItem${i}`}
              value={items[i]}
              onClick={() => checkedHandler(i)}
            />
          </Fragment>
        );
      })}
    </form>
  );
};
