import { FunctionComponent, useEffect } from "react";

import { observer, useStore } from "../../store";
import { List } from "./List";

export const TreeInspector: FunctionComponent = observer(() => {
  const store = useStore();

  if (!store.rootInstance) {
    return null;
  }

  return (
    <nav
      className="font-thin text-xs text-gray-400 py-2"
      onMouseLeave={() => store.clearTargeted()}
    >
      <List node={store.rootInstance} />
    </nav>
  );
});
