import { useEffect } from "react";
import { Portal } from "./Portal";
import { observer, useStore } from "../../store";

export const Selector = observer(() => {
  const store = useStore();
  const { root } = store;

  useEffect(() => {
    if (!root) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      store.selectDOMNode(event.target as HTMLElement);
    };

    const handleHover = (event: MouseEvent) => {
      store.targetDOMNode(event.target as HTMLElement);
    };

    // When nothing is selected, allow the user to click to choose.
    // Otherwise, target is only set by the TreeInspector
    if (!store.selected) {
      root.addEventListener("mousemove", handleHover);
    }

    root.addEventListener("click", handleClick);

    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("mousemove", handleHover);
    };
  }, [root, store.selected]);

  return (
    <>
      {store.selected && <Portal key="selected" node={store.selected} />}
      {store.targeted && <Portal key="targeted" node={store.targeted} />}
    </>
  );
});
