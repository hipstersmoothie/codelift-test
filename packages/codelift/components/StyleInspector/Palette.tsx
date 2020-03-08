import { groupBy } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { Swatch } from "./Swatch";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";
import { ICSSRule } from "../../models/CSSRule";

type PaletteProps = {
  label: string | JSX.Element;
  rules: ICSSRule[];
};

export const Palette: FunctionComponent<PaletteProps> = observer(
  ({ label, rules }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();

    const selected = rules.find(rule => rule.isApplied);
    const groups = groupBy(rules, rule => {
      const [, group, shade] = rule.className.split("-");

      // Only group colors that have a common shade
      return shade ? group : undefined;
    });

    const previewedRule = store.selected?.element?.previewedRule;

    if (previewedRule && rules.includes(previewedRule)) {
      label = <code>{previewedRule?.className}</code>;
    }

    return (
      <>
        <Menu
          icon={<Swatch rule={selected} />}
          label={label}
          selected={selected}
        >
          {Object.entries(groups).map(([group, groupRules]) => (
            <div
              className="flex"
              key={group}
              style={{
                background:
                  "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
                backgroundPosition:
                  "0 0, 0 0.5rem, 0.5rem -0.5rem, -0.5rem 0px",
                backgroundSize: "1rem 1rem"
              }}
            >
              {groupRules.map(groupRule => (
                <button
                  className="flex-grow py-3 hover:shadow-outline hover:z-10"
                  disabled={res.fetching}
                  key={groupRule.className}
                  onMouseLeave={() => store.selected?.element?.cancelPreview()}
                  onMouseOver={() =>
                    store.selected?.element?.previewRule(groupRule)
                  }
                  onClick={updateClassName}
                  style={{
                    background:
                      groupRule.style[Object.keys(groupRule.style)[0]],
                    outlineStyle: groupRule.isApplied ? "solid" : "unset",
                    outlineWidth: "2px",
                    outlineOffset: "-2px"
                  }}
                />
              ))}
            </div>
          ))}
        </Menu>
      </>
    );
  }
);
