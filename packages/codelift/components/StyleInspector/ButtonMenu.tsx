import { FunctionComponent } from "react";

import { Menu } from "./Menu";
import { ButtonGroup, ButtonGroupProps } from "./ButtonGroup";
import { observer } from "../../store";

export type ButtonMenuProps = ButtonGroupProps & {
  label: string | JSX.Element;
};

export const ButtonMenu: FunctionComponent<ButtonMenuProps> = observer(
  ({ label, groups, render, rules }) => {
    rules = rules.filter(Boolean);

    const selected = rules.find(rule => rule.isApplied);

    return (
      <Menu label={label} selected={selected}>
        <ButtonGroup groups={groups} render={render} rules={rules} />
      </Menu>
    );
  }
);
