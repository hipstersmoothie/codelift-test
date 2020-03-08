import { useMutation, UseMutationResponse } from "urql";

import { useStore } from "../store";

export const useUpdateClassName = (): UseMutationResponse<any, object> => {
  const store = useStore();
  const [res, updateClassName] = useMutation(`
    mutation UpdateClassName(
      $className: String
      $fileName: String!
      $lineNumber: Int!
    ) {
      updateClassName(
        className: $className
        fileName: $fileName
        lineNumber: $lineNumber
      )
    }
  `);

  if (res.error) {
    console.error(res.error);

    throw new Error(res.error.toString());
  }

  const trigger = async () => {
    if (!store.selected) {
      throw new Error("Cannot apply rule without an element selected");
    }

    const { element } = store.selected;

    if (!element) {
      const error = new Error(
        "Selected node does not have an element associated with it"
      );

      console.warn(error, store.selected);
      throw error;
    }

    if (!element.debugSource) {
      const error = new Error(
        "Selected element is missing _debugSource property"
      );

      console.error(error, element);
      throw error;
    }

    return updateClassName({
      className: element.className,
      fileName: element.debugSource.fileName,
      lineNumber: element.debugSource.lineNumber
    });
  };

  return [res, trigger];
};
