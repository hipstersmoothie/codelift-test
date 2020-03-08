import { isValidReference } from "mobx-state-tree";
import { FunctionComponent } from "react";
import { Code, Image, Link, List, Package, Type, Grid } from "react-feather";

import { observer, useStore } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type LabelProps = {
  node: IReactNode;
};

const Icon: FunctionComponent<LabelProps> = ({ node, ...props }) => {
  if (node.isComponent) {
    return <Package {...props} />;
  }

  switch (node.name) {
    case "a":
      return <Link {...props} />;
    case "img":
      return <Image {...props} />;
    case "li":
    case "ul":
      return <List {...props} />;
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
      return <Type {...props} />;
    case "table":
      return <Grid {...props} />;
    default:
      return <Code {...props} />;
  }
};

export const Label: FunctionComponent<LabelProps> = observer(({ node }) => {
  const store = useStore();
  const isSelected = node === store.selected;
  const isTargeted = node === store.targeted;

  // When HMR runs, these nodes may be removed, but still observing a previous reference
  if (!isValidReference(() => node)) {
    return null;
  }

  return (
    <button
      className={`flex items-center my-1 pl-2 rounded-l text-left truncate w-full ${
        isSelected
          ? "bg-white text-black font-bold shadow-sm"
          : `text-gray-200 text-normal ${
              isTargeted ? "bg-gray-700 font-bold" : ""
            }`
      }`}
      onClick={() => store.selectReactNode(node)}
      onDoubleClick={() => node.openInIDE()}
      onMouseEnter={() => store.targetReactNode(node)}
      style={{ transition: "all 100ms ease-in-out" }}
    >
      <Icon
        // @ts-ignore   Property 'className' does not exist on type 'IntrinsicAttributes & LabelProps & { children?: ReactNode; }'.
        className="flex-none mr-1 text-gray-600"
        node={node}
        size={12}
      />
      {node.name}

      <small className="text-xs text-gray-600 font-normal">
        {node.element?.id ? `#${node.element.id}` : null}
        {node.element?.classNames.map(className => `.${className}`).join("")}
      </small>
    </button>
  );
});
