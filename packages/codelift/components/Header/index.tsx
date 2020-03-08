import { FunctionComponent } from "react";
import { Check, GitHub, HelpCircle } from "react-feather";
import { observer, useStore } from "../../store";
import { useMutation } from "urql";

const Spacer = () => <div className="flex-grow" />;

export const Header: FunctionComponent = observer(() => {
  const store = useStore();
  const [res, updateProps] = useMutation(`
    mutation UpdateProps(
      $props: JSONObject!
      $fileName: String!
      $lineNumber: Int!
    ) {
      updateProps(
        props: $props
        fileName: $fileName
        lineNumber: $lineNumber
      )
    }
  `);

  return (
    <header
      className={`text-gray-300 flex font-thin bg-black items-center items-stretch ${
        store.state === "VISIBLE" ? "h-8" : "h-0"
      }`}
      style={{
        transition: "all 200ms ease-in-out"
      }}
    >
      <a
        className="flex items-center px-2 py-1 pt-0 hover:text-white hover:bg-gray-800"
        href="https://github.com/ericclemmons/codelift"
      >
        code
        <small className="text-white font-normal italic underline pl-px">
          lift
        </small>
      </a>
      <a
        className="flex items-center px-2 py-1 hover:text-white hover:bg-gray-800"
        href="https://github.com/ericclemmons/codelift"
      >
        <GitHub className="current-color" size={13} />
      </a>
      <a
        className="flex items-center px-2 py-1 hover:text-white hover:bg-gray-800"
        href="https://github.com/ericclemmons/codelift/issues/new"
      >
        <HelpCircle className="current-color" size={13} />
      </a>

      <Spacer />

      {store.selected?.hasChanges && (
        <div className="flex items-center py-1 px-2">
          <button
            className="relative p-1 px-2 font-thin text-xs text-gray-400 mr-1 underline hover:text-white"
            onClick={store.selected.resetProps}
          >
            Reset
          </button>

          <div className="flex flex-col shadow-md rounded overflow-hidden">
            <div className="flex flex-wrap">
              <button
                className="flex items-center relative p-1 px-2 bg-gray-200 font-thin text-xs text-gray-700 border-gray-400 border-b hover:bg-white active:bg-green-200 active:shadow-inner"
                onClick={() => {
                  if (store.selected) {
                    // Since `undefined` isn't valid JSON, all values are serialized to JSON
                    const serializedProps = Object.entries(
                      store.selected.props
                    ).reduce((acc, [prop, value]) => {
                      acc[prop] = `${JSON.stringify(value)}`;
                      return acc;
                    }, {} as Record<string, string>);

                    updateProps({
                      props: serializedProps,
                      fileName: store.selected.fileName,
                      lineNumber: store.selected.lineNumber
                    });
                  }
                }}
              >
                <Check className="mr-1" size={13} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
