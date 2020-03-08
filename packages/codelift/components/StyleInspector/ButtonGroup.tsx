import { chunk } from "lodash";
import { FunctionComponent } from "react";
import { ICSSRule } from "../../models/CSSRule";
import { useStore, observer } from "../../store";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";

export type ButtonGroupProps = {
  groups?: number;
  label?: string;
  render: (rule: ICSSRule, i: number) => string | JSX.Element;
  rules: ICSSRule[];
};

export const ButtonGroup: FunctionComponent<ButtonGroupProps> = observer(
  ({ groups = 1, label, render, rules }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();

    rules = rules.filter(Boolean);

    const selected = rules.find(rule => rule.isApplied);
    const chunks = chunk(rules, rules.length / groups);

    return (
      <div className="flex justify-center px-2 text-xs">
        {label && (
          <label
            className={`flex flex-grow h-8 items-center select-none ${
              selected ? "font-bold" : ""
            }`}
          >
            {label}
          </label>
        )}

        <div className="flex items-center py-1">
          <div className="flex flex-col shadow-md rounded overflow-hidden">
            {chunks.map((chunk, chunkIndex) => (
              <div className="flex flex-wrap" key={`group-${chunkIndex}`}>
                {chunk.map((rule, ruleIndex) => (
                  <button
                    className={`relative p-1 px-2 bg-white font-thin text-xs text-gray-700 border-gray-400 ${
                      // Make applied rules look pressed
                      rule.isApplied
                        ? "bg-green-200 shadow-inner"
                        : // Add border to last row
                        chunkIndex === chunks.length - 1
                        ? "border-b"
                        : ""
                    } ${res.fetching ? "cursor-wait" : ""} hover:bg-blue-100`}
                    disabled={res.fetching}
                    key={rule.className}
                    onMouseLeave={() =>
                      store.selected?.element?.cancelPreview()
                    }
                    onMouseOver={() =>
                      store.selected?.element?.previewRule(rule)
                    }
                    onClick={updateClassName}
                    style={{
                      boxShadow: rule.isApplied
                        ? "0 1px 3px rgba(0, 0, 0, 0.33) inset"
                        : undefined
                    }}
                  >
                    {render(rule, ruleIndex)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
