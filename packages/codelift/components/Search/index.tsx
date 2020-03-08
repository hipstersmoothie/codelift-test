import { useCombobox } from "downshift";
import React, { FunctionComponent, useEffect, useRef } from "react";

import { observer, useStore } from "../../store";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";

export const Search: FunctionComponent = observer(() => {
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const store = useStore();
  const [res, updateClassName] = useUpdateClassName();
  const items = store.flattenedCSSRules;

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    initialInputValue: store.query,
    inputValue: store.query,
    isOpen: Boolean(store.query),
    items,
    itemToString(item) {
      return item.className;
    },
    onHighlightedIndexChange(changes) {
      const { highlightedIndex = -1, selectedItem } = changes;
      const rule = items[highlightedIndex];

      if (rule) {
        store.selected?.element?.previewRule(rule);
      } else if (!selectedItem) {
        store.selected?.element?.cancelPreview();
      }
    },
    onInputValueChange({ inputValue = "" }) {
      return store.search(inputValue);
    },
    onSelectedItemChange(changes) {
      updateClassName();

      if (listRef.current) {
        listRef.current.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth"
        });
      }
    },
    selectedItem: undefined
  });

  let index = 0;

  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
  }, [store.selected?.element?.selector]);

  return (
    <div {...getComboboxProps({})}>
      <input
        autoFocus
        className="bg-gray-200 text-sm text-gray-600 focus:bg-white focus:text-black p-2 focus:shadow-inner w-full"
        disabled={res.fetching}
        placeholder="Search..."
        value={store.query}
        {...getInputProps({ ref: searchRef })}
      />

      {isOpen && (
        <ul {...getMenuProps()}>
          {store.groupedCSSRules.map(
            ([group, items]) =>
              items.length && (
                <React.Fragment key={`group-${group}`}>
                  <li
                    className="bg-gray-900 flex items-center shadow py-1 px-2 sticky text-sm text-white top-0"
                    key={group}
                  >
                    <label className="flex-grow truncate">{group}</label>
                    <small className="bg-gray-800 opacity-75 px-2 rounded-full shadow-inner text-white">
                      {items.length}
                    </small>
                  </li>

                  {items.map(item => (
                    <li key={item.className}>
                      <button
                        className={`font-mono text-left text-xs px-2 py-1 ${
                          item.isApplied ? "text-white" : "text-gray-400"
                        }  w-full ${
                          highlightedIndex === index ? "bg-gray-600" : ""
                        }`}
                        {...getItemProps({ item, index: index++ })}
                      >
                        {item.className}
                      </button>
                    </li>
                  ))}
                </React.Fragment>
              )
          )}
        </ul>
      )}
    </div>
  );
});
