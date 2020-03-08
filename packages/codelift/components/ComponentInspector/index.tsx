import { useEffect, useRef, useState } from "react";
import { useStore, observer } from "../../store";

export const ComponentInspector = observer(() => {
  const ref = useRef(null);
  const store = useStore();
  const selected = store.selected;
  const type = selected?.instance.type;
  const Inspector = type.Inspector;
  const props = selected?.props;

  useEffect(
    function renderInspector() {
      if (!ref.current || !Inspector || !store.contentWindow || !selected) {
        return;
      }

      // Use host's React/ReactDOM from register
      const { React, ReactDOM } = store.contentWindow as any;

      // Use Component's copy of React & ReactDOM so that hooks work
      ReactDOM.render(
        React.createElement(Inspector, {
          props,
          setProps: selected.previewProps
        }),
        ref.current
      );
    },
    [ref.current, props, Inspector]
  );

  useEffect(
    function renderPreview() {
      if (!Inspector || !selected) {
        return;
      }

      // Use host's React/ReactDOM from register
      const { React, ReactDOM } = store.contentWindow as any;

      // Wrap preview in a <span> (just in case there are any fragments)
      let preview = React.createElement(
        "span",
        {},
        React.createElement(type, props)
      );

      // Wrap preview in contexts
      selected.contexts.forEach(context => {
        const { value } = context.instance.memoizedProps;
        preview = React.createElement(
          context.instance.type,
          { value },
          preview
        );
      });

      // ! Find first HostComponent's stateNode, as `instance.child` can be a FunctionComponent or other ReactFiber type that's not associated with the DOM
      const node = selected.instance.child.stateNode;

      //  This will render the preview _within_ the current DOM node.
      // ! Warning: render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render.
      ReactDOM.render(preview, node);
      // We don't want the nesting, so we replace the node with the <span> from before
      // ! Warning: render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.
      node.replaceWith(node.firstChild);
    },
    [props]
  );

  if (!Inspector && store.selected?.isUserCode) {
    return (
      <button
        className="self-center border px-2 bg-green-500 border-green-300 shadow py-px hover:bg-green-400"
        onClick={() => store.selected?.openInIDE()}
      >
        Open in IDE
      </button>
    );
  }

  return <section ref={ref} />;
});
