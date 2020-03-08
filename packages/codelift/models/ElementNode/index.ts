import { autorun } from "mobx";
import { getRoot, IAnyModelType, Instance, types } from "mobx-state-tree";

import { CSSRule, ICSSRule } from "../CSSRule";
import { IApp } from "../App";

export interface IElementNode extends Instance<typeof ElementNode> {}

export const getReactInstance = (element: HTMLElement) => {
  if ("_reactRootContainer" in element) {
    // @ts-ignore Property '_reactRootContainer' does not exist on type 'never'.ts(2339)
    return element._reactRootContainer._internalRoot.current.child;
  }

  for (const key in element) {
    if (key.startsWith("__reactInternalInstance$")) {
      // @ts-ignore No index signature with a parameter of type 'string' was found on type 'HTMLElement'.ts(7053)
      return element[key];
    }
  }
};

export const ElementNode = types
  .model("ElementNode", {
    classNames: types.array(types.string),
    childNodes: types.array(types.late((): IAnyModelType => ElementNode)),
    previewedRule: types.maybeNull(types.safeReference(CSSRule)),
    uuid: types.optional(types.identifierNumber, () => Math.random())
  })
  .volatile(self => ({
    element: document.createElement("null")
  }))
  .views(self => ({
    get className() {
      const classNames = new Set(self.classNames);

      // When not previewing, return the original className value
      if (!self.previewedRule) {
        return Array.from(classNames).join(" ");
      }

      const hashStyles = (style: any) => String(Object.keys(style));
      const previewHash = hashStyles(self.previewedRule.style);

      // Remove overlapping classes that style the same properties
      // ! This is O(n) and potentially slow.
      // !Instead, we need a map of cssRulesByClassName, cssRulesByKeys
      this.store.cssRules.forEach(rule => {
        const sameStyles = hashStyles(rule.style) === previewHash;

        if (sameStyles && classNames.has(rule.className)) {
          classNames.delete(rule.className);
        }
      });

      // When previewing, only add the class if it doesn't exist already
      if (!self.classNames.includes(self.previewedRule.className)) {
        classNames.add(self.previewedRule.className);
      }

      return Array.from(classNames).join(" ");
    },

    get componentName() {
      return this.reactElement.return.type.name;
    },

    get debugSource() {
      if (!this.reactElement._debugSource) {
        throw new Error(`Selected element is missing _debugSource property`);
      }

      return this.reactElement._debugSource;
    },

    getBoundingClientRect() {
      return self.element.getBoundingClientRect();
    },

    hasRule(rule: ICSSRule) {
      return self.classNames.includes(rule.className);
    },

    get id() {
      return self.element.getAttribute("id");
    },

    get isPreviewing() {
      return Boolean(self.previewedRule);
    },

    get isSelected(): boolean {
      return this.store.selected ? this.store.selected.element === self : false;
    },

    get isTargeted(): boolean {
      return this.store.targeted ? this.store.targeted.element === self : false;
    },

    get reactElement() {
      return getReactInstance(self.element);
    },

    get selector() {
      let element: HTMLElement | null = self.element;

      const selectors = [];

      while (element) {
        const nthChild = element.parentNode
          ? [...element.parentNode.childNodes]
              .filter(node => node.nodeType === 1)
              .indexOf(element) + 1
          : null;
        const { id, tagName } = element;

        selectors.unshift(
          [
            tagName.toLowerCase(),
            id && `#${element.id}`,
            !id && nthChild && `:nth-child(${nthChild})`
          ]
            .filter(Boolean)
            .join("")
        );

        element = element.parentElement;
      }

      return selectors.join(" > ");
    },

    get store(): IApp {
      return getRoot(self);
    },

    get tagName() {
      return self.element.tagName.toLowerCase();
    }
  }))
  .actions(self => ({
    afterCreate() {
      autorun(() => {
        // Keep element className in sync with computed (preview) one
        self.element.className = self.className;
      });
    },

    cancelPreview() {
      self.previewedRule = null;
    },

    previewRule(rule: ICSSRule) {
      self.previewedRule = rule;
    },

    setElement(element: HTMLElement) {
      self.element = element;

      self.classNames.replace([...element.classList]);
      self.childNodes.replace(createChildNodes(element));
    }
  }));

export const createNode = (element: HTMLElement) => {
  const node = ElementNode.create();
  node.setElement(element);

  return node;
};

export const createChildNodes = (element: HTMLElement) => {
  const children = [...element.children] as HTMLElement[];

  return children.map((child: HTMLElement) => createNode(child));
};

export const flattenNodes = (nodes: IElementNode[]) => {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    acc.push(...flattenNodes(node.childNodes));

    return acc;
  }, [] as IElementNode[]);
};
