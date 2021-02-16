import React, { Fragment, useState } from "react";

import { CheckList } from "./topic_list";

export const App = () => {
  const [checked, setChecked] = useState({
    bananna: false,
    strawberry: false,
    blueberry: false,
    grape: false,
  });

  const checkedHandler = (itemName) => {
    setChecked({ [itemName]: !checked[itemName], ...checked });
  };

  return (
    <Fragment>
      <div>
        <h1>Hello, World</h1>
        <p>Check off some of our things!</p>
      </div>
      <CheckList items={checked} checkedHandler={checkedHandler} />
    </Fragment>
  );
};
