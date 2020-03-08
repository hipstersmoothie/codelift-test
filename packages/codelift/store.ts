import { createContext, useContext } from "react";
import { observer } from "mobx-react-lite";

import { App } from "./models/App";

const store = App.create();

window.addEventListener("message", event => {
  const { source, payload } = event.data;

  if (source !== "codelift") {
    return;
  }

  const { action, args } = payload;

  if (action in store) {
    // @ts-ignore
    store[action].apply(store, args);
  } else {
    throw new Error(
      `codelift does not support action ${JSON.stringify(action)}`
    );
  }
});

export { observer };
export const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);
