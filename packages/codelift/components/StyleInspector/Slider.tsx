import { FunctionComponent, useEffect, useMemo, useState } from "react";

import { observer, useStore } from "../../store";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";
import { ICSSRule } from "../../models/CSSRule";

export type SliderProps = {
  label?: string;
  rules: ICSSRule[];
};

const useSortedRules = (rules: ICSSRule[]) => {
  return useMemo(() => {
    return rules.slice().sort((a, b) => {
      // TODO Sort by actual `value(cssRule)`
      let [aString, aUnit] = a.className.split(/(\d+|px|auto$)/);
      let [bString, bUnit] = b.className.split(/(\d+|px|auto$)/);

      // Treat `px` as a value between 1 & 0 for sorting
      if (aUnit === "px") aUnit = "0.1";
      if (bUnit === "px") bUnit = "0.1";

      // Treat `auto` as a larger value than 64
      if (aUnit === "auto") aUnit = "1000";
      if (bUnit === "auto") bUnit = "1000";

      // String order wins out, since the unit isn't a tie-breaker
      const textOrder = aString.localeCompare(bString);

      // Reverse negative sort so that it's bigger numbers are first
      const direction =
        a.className.startsWith("-") && b.className.startsWith("-") ? -1 : 1;

      if (textOrder) {
        return direction * textOrder;
      }

      const numberOrder = Number(aUnit) - Number(bUnit);

      if (numberOrder) {
        return direction * numberOrder;
      }

      return 0;
    });
  }, [rules.length]);
};

// Show actual value somehow? https://github.com/davidchin/react-input-range
export const Slider: FunctionComponent<SliderProps> = observer(
  ({ label, rules }) => {
    const store = useStore();
    const sortedRules = useSortedRules(rules);
    const initialValue = sortedRules.findIndex(rule => rule.isApplied);
    const [res, updateClassName] = useUpdateClassName();
    const [value, setValue] = useState(initialValue);
    const tickPercentage = `${100 / sortedRules.length}%`;
    const initialRule = sortedRules[initialValue];
    const selectedRule = sortedRules[value];

    useEffect(() => {
      if (!store.selected?.element) {
        return;
      }

      const { element } = store.selected;

      element.cancelPreview();

      if (value === -1 && initialRule) {
        // Setting the value to -1 should toggle the existing rule
        element.previewRule(initialRule);
      } else if (selectedRule !== initialRule) {
        // Using a different value should update the preview
        element.previewRule(selectedRule);
      }
    }, [value]);

    return (
      <label
        className={`flex items-center ${
          value === -1 ? "font-normal text-black" : "font-bold text-green-600"
        } px-3 h-8 text-xs`}
      >
        {label && (
          <span className="select-none w-32">
            {label}
            {value !== initialValue && "*"}
          </span>
        )}
        <input
          className={`text-gray-300 appearance-none h-1 ml-2 rounded shadow-inner w-full ${
            res.fetching ? "cursor-wait opacity-50" : "cursor-move"
          }`}
          disabled={res.fetching}
          onMouseUp={event => {
            if (value !== initialValue) {
              updateClassName();
            }
          }}
          onChange={event => setValue(parseInt(event.target.value, 10))}
          min={-1}
          max={rules.length - 1}
          style={{
            background: `repeating-linear-gradient(to right, currentColor, currentColor 1px, transparent 1px, transparent ${tickPercentage})`
          }}
          type="range"
          value={value}
        />
      </label>
    );
  }
);
