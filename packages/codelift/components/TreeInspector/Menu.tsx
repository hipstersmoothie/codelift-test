import { FunctionComponent } from "react";

import { observer } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type MenuProps = {
  node: IReactNode;
};

export const Menu: FunctionComponent<MenuProps> = observer(({ node }) => {
  return (
    <button className="px-2 font-mono fill-current">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path
          className="heroicon-ui"
          d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
        />
      </svg>
    </button>
  );
});
