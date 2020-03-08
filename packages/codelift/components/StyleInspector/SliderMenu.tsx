import { FunctionComponent } from "react";

import { Slider, SliderProps } from "./Slider";
import { Menu } from "./Menu";
import { observer, useStore } from "../../store";

type SliderMenuProps = {
  label: string | JSX.Element;
  items: SliderProps[];
};

// TODO Highlight the label if the rules match
export const SliderMenu: FunctionComponent<SliderMenuProps> = observer(
  ({ label, items }) => {
    const store = useStore();
    const rules = items.map(item => item.rules).flat();
    const selected = rules.find(rule => rule.isApplied);
    const previewedRule = store.selected?.element?.previewedRule;

    if (previewedRule && rules.includes(previewedRule)) {
      if (previewedRule === selected) {
        label = `Remove ${label}`;
      } else {
        label = <code>{previewedRule?.className}</code>;
      }
    }

    return (
      <Menu label={label} selected={selected}>
        <ul>
          {items.map((item, i) => (
            <li className="hover:bg-gray-200" key={`${item.label}-${i}`}>
              <Slider {...item} />
            </li>
          ))}
        </ul>
      </Menu>
    );
  }
);
