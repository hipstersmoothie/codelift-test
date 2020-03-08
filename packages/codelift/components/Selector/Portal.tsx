import React, { FunctionComponent } from "react";
import { createPortal } from "react-dom";
import { observer, useStore } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type PortalProps = {
  node: IReactNode;
};

export const Portal: FunctionComponent<PortalProps> = observer(({ node }) => {
  const store = useStore();

  if (!store.contentWindow || !store.document || !node.element) {
    return null;
  }

  const { top, right, bottom, left } = node.element.getBoundingClientRect();
  const labelPosition = top > 22 ? "top" : "bottom";

  return createPortal(
    <div
      style={{
        border: "1px dashed #4299e1",
        filter: `grayscale(${node === store.selected ? 0 : 1})`,
        height: bottom - top,
        left: left + store.contentWindow.scrollX,
        opacity: store.selected?.element?.isPreviewing ? 0 : 1,
        pointerEvents: "none",
        position: "absolute",
        top: top + store.contentWindow.scrollY,
        transition: "all 100ms ease-in-out",
        width: right - left,
        zIndex: 40
      }}
    >
      <label
        style={{
          [labelPosition]: "-22px",
          background: "#4299e1",
          borderRadius: labelPosition === "top" ? "4px 4px 0 0" : "0 0 4px 4px",
          color: "#ffffff",
          fontFamily:
            'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: "12px",
          marginLeft: "-1px",
          maxWidth: "100%",
          overflow: "hidden",
          position: "absolute",
          padding: "2px 4px",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {node.element.tagName.toLowerCase()}

        <small style={{ color: "#bee3f8" }}>
          {node.element.classNames.map(className => `.${className}`).join("")}
        </small>
      </label>
    </div>,
    store.document.body
  );
});
