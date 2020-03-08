import { capitalize } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";
import { ICSSRule } from "../../models/CSSRule";

type SelectProps = {
  label: string | JSX.Element;
  render?: (rule: ICSSRule) => string | JSX.Element;
  rules: ICSSRule[];
};

const defaultRender: SelectProps["render"] = rule => {
  const suffix = rule.className.split("-").pop();

  switch (suffix) {
    case undefined:
      return capitalize(rule.className);
    case "md":
      return "Medium";
    case "lg":
      return "Large";
    case "xl":
      return "X-Large";
    case "2xl":
      return "XX-Large";
    default:
      return capitalize(suffix);
  }
};

export const Select: FunctionComponent<SelectProps> = observer(
  ({ label, render = defaultRender, rules }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();
    const selected = rules.find(rule => rule.isApplied);
    const previewedRule = store.selected?.element?.previewedRule;

    if (previewedRule && rules.includes(previewedRule)) {
      label = <code>{previewedRule?.className}</code>;
    }

    return (
      <Menu label={label} selected={selected}>
        <ul>
          {rules.map(rule => (
            <li
              className={`flex items-center px-3 h-8 text-xs hover:bg-gray-200 ${
                rule.isApplied
                  ? "font-bold text-green-600"
                  : "font-normal text-gray-800"
              } ${res.fetching ? "cursor-wait" : "cursor-pointer"}`}
              key={rule.className}
              onMouseLeave={() => store.selected?.element?.cancelPreview()}
              onMouseOver={() => store.selected?.element?.previewRule(rule)}
              onClick={updateClassName}
              value={rule.className}
            >
              {render(rule)}
            </li>
          ))}
        </ul>
      </Menu>
    );
  }
);
