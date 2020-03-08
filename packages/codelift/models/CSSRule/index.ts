import { Instance, getRoot, types } from "mobx-state-tree";
import { classNameGroups } from "./classNameGroups";

import { IApp } from "../App";

export interface ICSSRule extends Instance<typeof CSSRule> {}

export const CSSRule = types
  .model("CSSRule", {
    className: types.identifier,
    cssText: types.string,
    style: types.frozen()
  })
  .views(self => ({
    get group() {
      for (const pattern in classNameGroups) {
        if (self.className.startsWith(pattern)) {
          return classNameGroups[pattern];
        }
      }

      return "Other";
    },

    get isApplied(): boolean {
      return Boolean(this.store.selected?.element?.hasRule(this as ICSSRule));
    },

    get store(): IApp {
      return getRoot(self);
    }
  }));

export const createRulesFromDocument = (document: HTMLDocument) => {
  const map = {} as Record<
    string,
    {
      className: string;
      cssText: string;
      style: Record<string, string>;
    }
  >;

  const styleSheets = [...document.styleSheets].filter(
    styleSheet => styleSheet.constructor.name === "CSSStyleSheet"
  ) as CSSStyleSheet[];

  const cssStyleRules = styleSheets
    .map(styleSheet => {
      return [...styleSheet.cssRules].filter(
        cssRule => cssRule.constructor.name === "CSSStyleRule"
      );
    })
    .flat() as CSSStyleRule[];

  cssStyleRules.forEach(cssStyleRule => {
    const { cssText, selectorText, style } = cssStyleRule;

    selectorText.split(",").forEach(selector => {
      selector = selector.trim();

      if (!selector.startsWith(".")) {
        return;
      }

      const className = selector
        .slice(1)
        .split("\\/")
        .join("/");

      if (!map[className]) {
        map[className] = {
          className,
          cssText,
          style: {}
        };
      }

      // Firefox can use Object.values(style) to iterate over styles.
      // Edge returns 519 empty "" strings. Array.from seems to work...
      // see: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule/style
      Array.from(style).forEach(property => {
        // Remove prefixes
        let normalizedProperty = property
          .replace("-moz-", "")
          .replace("-webkit-", "");

        if (
          [
            // Some properties have been deprecated:
            // @see: https://developer.mozilla.org/en-US/docs/Web/CSS/-moz-box-ordinal-group
            // Flexbox has replaced box-* properties
            // @see: https://developer.mozilla.org/en-US/docs/Web/CSS/box-direction
            "box-align",
            "box-direction",
            "box-flex",
            "box-flex-group",
            "box-lines",
            "box-ordinal-group",
            "box-orient",
            "box-pack",
            // text-decoration expands into properties that don't have equivalent utilities
            "text-decoration-color",
            "text-decoration-style",
            "text-decoration-thickness"
          ].includes(normalizedProperty)
        ) {
          return;
        }

        // Collapse text-decoration back into how we know it
        if (normalizedProperty === "text-decoration-line") {
          normalizedProperty = "text-decoration";
        }

        // Only valid rules will be set, so there shouldn't be collissions
        map[className].style[normalizedProperty] = style[property as any];
      });
    });
  });

  return Object.entries(map).map(([className, init]) => CSSRule.create(init));
};
