import { FunctionComponent } from "react";

import { ICSSRule } from "../../models/CSSRule";
import { observer } from "../../store";

type SwatchProps = {
  rule?: ICSSRule;
};

export const Swatch: FunctionComponent<SwatchProps> = observer(({ rule }) => {
  const style = rule
    ? null
    : {
        backgroundImage:
          "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
        backgroundSize: "1rem 1rem",
        backgroundPosition: "0 0, 0 0.5rem, 0.5rem -0.5rem, -0.5rem 0px"
      };

  return (
    <span
      className={`${rule?.className.replace(/^\w+/, "bg")} p-2 border ${
        rule ? "border-swhite" : "border-gray-500"
      } rounded-sm shadow`}
      style={{
        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.25)",
        ...style
      }}
    />
  );
});
