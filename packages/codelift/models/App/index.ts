import { groupBy, sortBy } from "lodash";
import { Instance, types } from "mobx-state-tree";
import { SyntheticEvent } from "react";

import { createRulesFromDocument, CSSRule, ICSSRule } from "../CSSRule";
import {
  createReactNode,
  getReactInstance,
  IReactNode,
  ReactNode,
  flattenReactNodes
} from "../ReactNode";

export interface IApp extends Instance<typeof App> {}

export const App = types
  .model("App", {
    // TODO Use `types.map` for faster lookup by className:
    // https://mobx.js.org/refguide/map.html
    cssRules: types.array(CSSRule),
    path: window.location.href.split(window.location.origin).pop() ?? "/",
    query: "",
    reactNodes: types.array(types.safeReference(ReactNode)),
    rootInstance: types.maybe(ReactNode),
    state: types.optional(
      types.enumeration("State", ["HIDDEN", "VISIBLE"]),
      "VISIBLE"
    ),
    targeted: types.maybe(types.safeReference(ReactNode)),
    selected: types.maybe(types.safeReference(ReactNode)),
    selector: types.maybe(types.string)
  })
  .volatile(self => ({
    // Needed for scrollX/Y
    contentWindow: null as null | Window,
    // Needed for document.body
    document: null as null | HTMLDocument,
    // In-case of an error accessing the iframe
    error: null as null | Error,
    rule: null as null | ICSSRule
  }))
  .views(self => ({
    get appliedCSSRules(): ICSSRule[] {
      const { selected } = self;

      if (!selected || !selected.element) {
        return [];
      }

      return this.queriedCSSRules.filter(selected.element.hasRule);
    },

    get cssRulesByStyle() {
      return self.cssRules.reduce(
        (acc, cssRule) => {
          const key = String(Object.keys(cssRule.style).sort());

          if (!acc[key]) {
            acc[key] = [];
          }

          // TODO Support pseudo selectors
          if (cssRule.className.indexOf(":") === -1) {
            acc[key].push(cssRule);
          }

          return acc;
        },
        {} as {
          [key: string]: ICSSRule[];
        }
      );
    },

    get cssRuleByClassName() {
      return self.cssRules.reduce(
        (acc, cssRule) => {
          acc[cssRule.className] = cssRule;

          return acc;
        },
        {} as {
          [key: string]: ICSSRule;
        }
      );
    },

    findRulesByStyle(style: string | string[]) {
      const styles = Array.isArray(style) ? style : [style];
      const key = String(styles.sort());

      return this.cssRulesByStyle[key] ?? [];
    },

    findReactNodeByElement(element: HTMLElement) {
      const reactNode = self.reactNodes.find(reactNode => {
        return (
          reactNode &&
          reactNode.element &&
          reactNode.element.element === element
        );
      });

      return reactNode;
    },

    get queriedCSSRules(): ICSSRule[] {
      const { cssRules, query } = self;

      const words = query
        .split(" ")
        .map(word => word.trim())
        .filter(Boolean);

      const matching = words.reduce(
        (filtered, word) => {
          const tests = [
            (rule: ICSSRule) => {
              return rule.className.includes(word);
            },

            (rule: ICSSRule) => {
              return rule.cssText.includes(word);
            }
          ];

          return filtered.filter(rule => tests.some(test => test(rule)));
        },
        [...cssRules]
          // Remove duplicates
          // .filter(match => !this.appliedRules.includes(match))
          // Remove :hover, :active, etc.
          .filter(match => match.className.indexOf(":") === -1)
      );

      return sortBy(matching, [
        ...words.map(word => (rule: ICSSRule) => {
          return rule.className.startsWith(word) ? -1 : 0;
        }),
        (rule: ICSSRule) => {
          return rule.className.replace(/[\d+]/g, "");
        }
      ]);
    },

    get flattenedCSSRules() {
      return this.groupedCSSRules.reduce((acc, [group, items]) => {
        return acc.concat(items);
      }, [] as ICSSRule[]);
    },

    get groupedCSSRules() {
      return Object.entries(
        groupBy(this.queriedCSSRules, ({ group = "Other " }) => group)
      );
    },

    get root(): null | HTMLElement {
      if (!self.document) {
        return null;
      }

      for (const node of [...self.document.all]) {
        if ("_reactRootContainer" in node) {
          return node;
        }
      }

      console.error(`codelift could not find React's root container`);

      return null;
    }
  }))
  .actions(self => ({
    clearSelected() {
      self.selected = undefined;
    },

    clearTargeted() {
      self.targeted = undefined;
    },

    close() {
      self.state = "HIDDEN";
      self.selected = undefined;
      self.targeted = undefined;
    },

    handleFrameLoad(event: SyntheticEvent) {
      if (!(event.target instanceof HTMLIFrameElement)) {
        throw new Error(`handleLoad expected an iFrame`);
      }

      const iframe = event.target;

      if (!iframe.contentWindow) {
        throw new Error("iframe missing contentWindow");
      }

      document.domain = "localhost";

      self.contentWindow = iframe.contentWindow;

      try {
        self.document = iframe.contentWindow.document;
        self.error = null;
      } catch (error) {
        self.error = error;
        console.error(error);

        return;
      }

      window.removeEventListener("keydown", this.handleKeyPress);
      window.addEventListener("keydown", this.handleKeyPress);

      self.contentWindow.removeEventListener("keydown", this.handleKeyPress);
      self.contentWindow.addEventListener("keydown", this.handleKeyPress);
      self.contentWindow.addEventListener("unload", this.handleFrameUnload);

      this.syncPath();
      this.initNodes();
      this.reselect();
    },

    handleFrameUnload() {
      self.contentWindow = null;
      self.document = null;
    },

    handleKeyPress(event: KeyboardEvent) {
      const { key, metaKey } = event;

      // CMD+'
      if (metaKey && key === "'") {
        event.preventDefault();

        if (self.state === "VISIBLE") {
          return this.close();
        } else {
          return this.open();
        }
      }

      // Ignore any other commands until we're open
      if (self.state === "HIDDEN") {
        return;
      }

      if (key === "Escape") {
        event.preventDefault();

        if (self.selected) {
          self.selected = undefined;
          return;
        }

        if (self.state === "VISIBLE") {
          return this.close();
        }
      }
    },

    handleStatus(status: string) {
      if (status === "idle" && self.document) {
        this.initNodes();
        this.reselect();
      }
    },

    initCSSRules() {
      if (!self.document) {
        return;
      }

      if (self.cssRules.length) {
        return;
      }

      const cssRules = createRulesFromDocument(self.document);

      self.cssRules.replace(cssRules);
    },

    initNodes() {
      if (self.root) {
        self.rootInstance = createReactNode(getReactInstance(self.root));
        self.reactNodes.replace(flattenReactNodes(self.rootInstance.children));
      } else {
        self.rootInstance = undefined;
        self.reactNodes.clear();
      }
    },

    open() {
      self.state = "VISIBLE";
    },

    register() {
      // TODO App has been registered, so references can start being made now
    },

    reselect() {
      const { selector } = self;

      if (self.root && selector) {
        self.selected = self.reactNodes.find(reactNode => {
          return (
            reactNode &&
            reactNode.element &&
            reactNode.element.selector === selector
          );
        });
      }
    },

    resetQuery() {
      self.query = "";
    },

    search(value: string) {
      self.query = value;
    },

    selectDOMNode(element: HTMLElement) {
      const reactNode = self.findReactNodeByElement(element);

      if (reactNode) {
        this.selectReactNode(reactNode);
      }
    },

    selectReactNode(node: IReactNode) {
      self.selected = node;
      self.selector = self.selected.element
        ? self.selected.element.selector
        : undefined;
      self.targeted = undefined;
    },

    setPath(path: string) {
      self.path = path;
    },

    syncPath() {
      const path = self.contentWindow?.location.href
        .split(self.contentWindow.window.location.origin)
        .pop();

      if (path) {
        self.path = path;
      }
    },

    targetDOMNode(element: HTMLElement) {
      const reactNode = self.findReactNodeByElement(element);

      if (reactNode) {
        this.targetReactNode(reactNode);
      }
    },

    targetReactNode(node: IReactNode) {
      self.targeted = node;
    }
  }));
