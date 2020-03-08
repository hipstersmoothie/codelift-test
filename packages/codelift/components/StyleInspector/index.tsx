import { capitalize, words } from "lodash";
import { ComponentType, FunctionComponent, useEffect } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignJustify,
  AlignRight,
  ArrowDown,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  Crosshair,
  Eye,
  EyeOff,
  Grid,
  Image,
  Layout,
  List,
  Loader,
  Lock,
  Maximize,
  Maximize2,
  Minimize,
  Minimize2,
  MoreHorizontal,
  MoreVertical,
  MousePointer,
  Move,
  PenTool,
  Props,
  Slash,
  Square,
  Trello,
  Type
} from "react-feather";

import { observer, useStore } from "../../store";
import { Search } from "../Search";
import { Palette } from "./Palette";
import { Select } from "./Select";
import { SliderMenu } from "./SliderMenu";
import { Menu } from "./Menu";
import { ButtonGroup } from "./ButtonGroup";
import { ButtonMenu } from "./ButtonMenu";

type HeadingProps = {
  Icon?: ComponentType<Props>;
};

const Heading: FunctionComponent<HeadingProps> = ({ children, Icon }) => (
  <label className="flex items-center text-left text-gray-500 px-2 py-1 shadow sticky text-sm top-0 w-full z-10 bg-gray-900">
    {Icon && <Icon className="mr-2" size={13} />}
    <span className="w-full">{children}</span>
  </label>
);

// TODO Move hover: highlight to <li>
export const StyleInspector: FunctionComponent = observer(() => {
  const store = useStore();

  // When mounted, initialize CSS Rules
  useEffect(() => {
    store.initCSSRules();
  }, []);

  // Log the currently selectly element for easier inspection in DevTools
  useEffect(() => {
    console.info(
      "%ccode%clift",
      "color: #669",
      "font-style: italic; font-size: 0.8em; text-decoration: underline;",
      store.selected?.element?.element
    );
  }, [store.selected?.element]);

  // TODO Add a toggle for :hover,, :focus, :active based on selectorText
  return (
    <ol className="text-gray-400 text-xs overflow-auto">
      <li className="hover:bg-gray-700">
        <Search />
      </li>
      <li>
        <Heading Icon={Layout}>Layout</Heading>
        <ol>
          <li className="hover:bg-gray-700">
            <Select
              label="Display"
              render={rule => capitalize(words(rule.className).join(" "))}
              rules={store.findRulesByStyle("display")}
            />
          </li>
          <li className="hover:bg-gray-700">
            <SliderMenu
              label="Margin"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "margin-top",
                    "margin-right",
                    "margin-bottom",
                    "margin-left"
                  ])
                },
                {
                  label: "Horizontal",
                  rules: store.findRulesByStyle(["margin-left", "margin-right"])
                },
                {
                  label: "Vertical",
                  rules: store.findRulesByStyle(["margin-top", "margin-bottom"])
                },
                { label: "Top", rules: store.findRulesByStyle("margin-top") },
                {
                  label: "Right",
                  rules: store.findRulesByStyle("margin-right")
                },
                {
                  label: "Bottom",
                  rules: store.findRulesByStyle("margin-bottom")
                },
                { label: "Left", rules: store.findRulesByStyle("margin-left") }
              ]}
            />
          </li>
          <li className="hover:bg-gray-700">
            <SliderMenu
              label="Padding"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "padding-top",
                    "padding-right",
                    "padding-bottom",
                    "padding-left"
                  ])
                },
                {
                  label: "Horizontal",
                  rules: store.findRulesByStyle([
                    "padding-left",
                    "padding-right"
                  ])
                },
                {
                  label: "Vertical",
                  rules: store.findRulesByStyle([
                    "padding-top",
                    "padding-bottom"
                  ])
                },
                { label: "Top", rules: store.findRulesByStyle("padding-top") },
                {
                  label: "Right",
                  rules: store.findRulesByStyle("padding-right")
                },
                {
                  label: "Bottom",
                  rules: store.findRulesByStyle("padding-bottom")
                },
                { label: "Left", rules: store.findRulesByStyle("padding-left") }
              ]}
            />
          </li>
          <li className="hover:bg-gray-700">
            <Menu
              label="Overflow"
              selected={[
                ...store.findRulesByStyle(["overflow-x", "overflow-y"]),
                ...store.findRulesByStyle("overflow-x"),
                ...store.findRulesByStyle("overflow-y")
              ].find(rule => rule.isApplied)}
            >
              <Select
                label="All"
                rules={store.findRulesByStyle(["overflow-x", "overflow-y"])}
              />
              <Select
                label="Horizontal"
                rules={store.findRulesByStyle("overflow-x")}
              />
              <Select
                label="Vertical"
                rules={store.findRulesByStyle("overflow-y")}
              />
              <ButtonGroup
                label="Momentum Scroll"
                render={rule =>
                  (({
                    "scrolling-touch": <Check size={13} />
                  } as any)[rule.className])
                }
                rules={[store.cssRuleByClassName["scrolling-touch"]]}
              />
            </Menu>
          </li>
        </ol>
      </li>

      {/* TODO Hide unless in valid flex container  */}
      <li>
        <Heading Icon={Trello}>Flexbox</Heading>

        <ol>
          <li className="hover:bg-gray-700">
            <Select
              label="Direction"
              rules={store.findRulesByStyle("flex-direction")}
            />
          </li>
          <li className="hover:bg-gray-700">
            <Select label="Wrap" rules={store.findRulesByStyle("flex-wrap")} />
          </li>
          <li className="hover:bg-gray-700">
            <Select
              label="Align Items"
              rules={store.findRulesByStyle("align-items")}
            />
          </li>
          <li className="hover:bg-gray-700">
            <Select
              label="Align Content"
              rules={store.findRulesByStyle("align-content")}
            />
          </li>
          <li className="hover:bg-gray-700">
            <Select
              label="Align Self"
              rules={store.findRulesByStyle("align-self")}
            />
          </li>
          <li className="hover:bg-gray-700">
            <Select
              label="Justify Content"
              rules={store.findRulesByStyle("justify-content")}
            />
          </li>
          <li className="hover:bg-gray-700">
            <SliderMenu
              label="Order"
              items={[{ rules: store.findRulesByStyle("order") }]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Shrink"
              render={rule => {
                return ({
                  "flex-shrink": <Minimize size={13} />,
                  "flex-shrink-0": <Lock size={13} />
                } as any)[rule.className];
              }}
              rules={store.findRulesByStyle("flex-shrink")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Grow"
              render={rule => {
                return ({
                  "flex-grow": <Maximize size={13} />,
                  "flex-grow-0": <Lock size={13} />
                } as any)[rule.className];
              }}
              rules={store.findRulesByStyle("flex-grow")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Move}>Size</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Width"
              items={[
                {
                  label: "Width",
                  rules: store.findRulesByStyle("width")
                },
                {
                  label: "Min Width",
                  rules: store.findRulesByStyle("min-width")
                },
                {
                  label: "Max Width",
                  rules: store.findRulesByStyle("max-width")
                }
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Height"
              items={[
                {
                  label: "Height",
                  rules: store.findRulesByStyle("height")
                },
                {
                  label: "Min Height",
                  rules: store.findRulesByStyle("min-height")
                },
                {
                  label: "Max Height",
                  rules: store.findRulesByStyle("max-height")
                }
              ]}
            />
          </li>
          {/* TODO Hide when not an img */}
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Fit"
              render={rule =>
                (({
                  "object-none": <Slash size={13} />,
                  "object-scale-down": <Minimize2 size={13} />,
                  "object-contain": <Minimize size={13} />,
                  "object-cover": <Maximize size={13} />,
                  "object-fill": <Maximize2 size={13} />
                } as any)[rule.className])
              }
              rules={[
                store.cssRuleByClassName["object-none"],
                store.cssRuleByClassName["object-scale-down"],
                store.cssRuleByClassName["object-contain"],
                store.cssRuleByClassName["object-cover"],
                store.cssRuleByClassName["object-fill"]
              ]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Crosshair}>Position</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <Select
              label="Position"
              rules={store.findRulesByStyle("position")}
            />
          </li>
          {/* TODO Hide when not an img */}
          <li className="hover:bg-gray-800">
            <ButtonMenu
              label="Object Position"
              groups={3}
              render={rule =>
                (({
                  "object-left-top": <ArrowUpLeft size={13} />,
                  "object-top": <ArrowUp size={13} />,
                  "object-right-top": <ArrowUpRight size={13} />,
                  "object-left": <ArrowLeft size={13} />,
                  "object-center": <Move size={13} />,
                  "object-right": <ArrowRight size={13} />,
                  "object-left-bottom": <ArrowDownLeft size={13} />,
                  "object-bottom": <ArrowDown size={13} />,
                  "object-right-bottom": <ArrowDownRight size={13} />
                } as any)[rule.className])
              }
              rules={[
                store.cssRuleByClassName["object-left-top"],
                store.cssRuleByClassName["object-top"],
                store.cssRuleByClassName["object-right-top"],
                store.cssRuleByClassName["object-left"],
                store.cssRuleByClassName["object-center"],
                store.cssRuleByClassName["object-right"],
                store.cssRuleByClassName["object-left-bottom"],
                store.cssRuleByClassName["object-bottom"],
                store.cssRuleByClassName["object-right-bottom"]
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Pinning"
              render={rule => {
                return ({
                  "top-0": <ArrowUp size={13} />,
                  "right-0": <ArrowRight size={13} />,
                  "bottom-0": <ArrowDown size={13} />,
                  "left-0": <ArrowLeft size={13} />
                } as any)[rule.className];
              }}
              rules={[
                store.cssRuleByClassName["top-0"],
                store.cssRuleByClassName["right-0"],
                store.cssRuleByClassName["bottom-0"],
                store.cssRuleByClassName["left-0"]
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Float"
              render={rule => {
                return ({
                  "float-left": <ArrowLeftCircle size={13} />,
                  "float-right": <ArrowRightCircle size={13} />,
                  "float-none": <Slash size={13} />
                } as any)[rule.className];
              }}
              rules={[
                store.cssRuleByClassName["float-left"],
                store.cssRuleByClassName["float-right"],
                store.cssRuleByClassName["float-none"]
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Z Index"
              items={[{ rules: store.findRulesByStyle("z-index") }]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Image}>Background</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <Palette
              label="Color"
              rules={store.findRulesByStyle("background-color")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Attachment"
              rules={store.findRulesByStyle("background-attachment")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonMenu
              label="Position"
              groups={3}
              render={rule =>
                (({
                  "bg-left-top": <ArrowUpLeft size={13} />,
                  "bg-top": <ArrowUp size={13} />,
                  "bg-right-top": <ArrowUpRight size={13} />,
                  "bg-left": <ArrowLeft size={13} />,
                  "bg-center": <Move size={13} />,
                  "bg-right": <ArrowRight size={13} />,
                  "bg-left-bottom": <ArrowDownLeft size={13} />,
                  "bg-bottom": <ArrowDown size={13} />,
                  "bg-right-bottom": <ArrowDownRight size={13} />
                } as any)[rule.className])
              }
              rules={[
                store.cssRuleByClassName["bg-left-top"],
                store.cssRuleByClassName["bg-top"],
                store.cssRuleByClassName["bg-right-top"],
                store.cssRuleByClassName["bg-left"],
                store.cssRuleByClassName["bg-center"],
                store.cssRuleByClassName["bg-right"],
                store.cssRuleByClassName["bg-left-bottom"],
                store.cssRuleByClassName["bg-bottom"],
                store.cssRuleByClassName["bg-right-bottom"]
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Repeat"
              rules={store.findRulesByStyle("background-repeat")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Size"
              rules={store.findRulesByStyle("background-size")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Type}>Typography</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <Palette label="Color" rules={store.findRulesByStyle("color")} />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Font"
              rules={store.findRulesByStyle("font-family")}
            />
          </li>
          <li className="hover:bg-gray-800">
            {/* TODO Cannot use SelectMenu because the ordering is weird */}
            <Select
              label="Weight"
              rules={store.findRulesByStyle("font-weight")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Size"
              items={[{ rules: store.findRulesByStyle("font-size") }]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Style"
              render={rule => (
                <span className={`font-serif ${rule.className}`}>Aa</span>
              )}
              rules={store.findRulesByStyle("font-style")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Decoration"
              render={rule => (
                <span className={`font-serif ${rule.className}`}>Aa</span>
              )}
              rules={store.findRulesByStyle("text-decoration")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Transform"
              render={rule =>
                (({
                  "uppercase": <span className="font-serif italic">AA</span>,
                  "lowercase": <span className="font-serif italic">aa</span>,
                  "capitalize": <span className="font-serif italic">Aa</span>,
                  "normal-case": <Slash size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("text-transform")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Align"
              render={rule =>
                (({
                  "text-left": <AlignLeft size={13} />,
                  "text-center": <AlignCenter size={13} />,
                  "text-right": <AlignRight size={13} />,
                  "text-justify": <AlignJustify size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("text-align")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Vertical Align"
              render={rule => rule.className}
              rules={store.findRulesByStyle("vertical-align")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Letter Spacing"
              items={[{ rules: store.findRulesByStyle("letter-spacing") }]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Line Height"
              items={[{ rules: store.findRulesByStyle("line-height") }]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Word Break"
              render={rule =>
                (({
                  "break-normal": <span className="font-serif">Auto</span>,
                  "break-words": <span className="font-serif">Words</span>,
                  "break-all": <span className="font-serif">All</span>,
                  "truncate": <span className="font-serif">&hellip;</span>
                } as any)[rule.className])
              }
              rules={[
                store.cssRuleByClassName["break-normal"],
                store.cssRuleByClassName["break-words"],
                store.cssRuleByClassName["break-all"],
                store.cssRuleByClassName["truncate"]
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Whitespace"
              rules={store.findRulesByStyle("white-space")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Antialiasing"
              render={rule =>
                (({
                  "antialiased": <span className="font-serif">Grayscale</span>,
                  "subpixel-antialiased": (
                    <span className="font-serif">Subpixel</span>
                  )
                } as any)[rule.className])
              }
              rules={[
                store.cssRuleByClassName["antialiased"],
                store.cssRuleByClassName["subpixel-antialiased"]
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="List Type"
              render={rule =>
                (({
                  "list-none": <Slash size={13} />,
                  "list-disc": <span className="font-serif italic">•</span>,
                  "list-decimal": <span className="font-serif italic">1.</span>
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("list-style-type").reverse()}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="List Position"
              render={rule =>
                (({
                  "list-inside": <AlignJustify size={13} />,
                  "list-outside": <List size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("list-style-position")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Loader}>Effects</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Opacity"
              items={[{ rules: store.findRulesByStyle("opacity") }]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Shadow"
              rules={store.findRulesByStyle("box-shadow")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Visibility"
              render={rule =>
                (({
                  invisible: <EyeOff size={13} />,
                  visible: <Eye size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("visibility")}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={MousePointer}>Interactivity</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Customize Appearance"
              render={rule =>
                (({
                  "appearance-none": <Check size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("appearance")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Cursor"
              render={rule => (
                <div
                  className={`${rule.className} flex w-full h-full items-center`}
                >
                  {capitalize(
                    words(rule.className)
                      .slice(1)
                      .join(" ")
                  )}
                </div>
              )}
              rules={store.findRulesByStyle("cursor")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Outline"
              render={rule =>
                (({
                  "outline-none": <Check size={13} />
                } as any)[rule.className])
              }
              rules={[store.cssRuleByClassName["outline-none"]]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Pointer Events"
              render={rule =>
                (({
                  "pointer-events-auto": (
                    <span className="font-serif italic">Auto</span>
                  ),
                  "pointer-events-none": <Slash size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("pointer-events").reverse()}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Select Text"
              render={rule =>
                (({
                  "select-none": <Slash size={13} />
                } as any)[rule.className] ?? (
                  <span className="font-serif italic">
                    {capitalize(words(rule.className)[1])}
                  </span>
                ))
              }
              rules={store.findRulesByStyle("user-select").reverse()}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Resize"
              render={rule =>
                (({
                  "resize": <Move size={13} />,
                  "resize-x": <MoreHorizontal size={13} />,
                  "resize-y": <MoreVertical size={13} />,
                  "resize-none": <Slash size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("resize").reverse()}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={Square}>Border</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Size"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "border-top-width",
                    "border-right-width",
                    "border-bottom-width",
                    "border-left-width"
                  ])
                },
                {
                  label: "Top",
                  rules: store.findRulesByStyle("border-top-width")
                },
                {
                  label: "Right",
                  rules: store.findRulesByStyle("border-right-width")
                },
                {
                  label: "Bottom",
                  rules: store.findRulesByStyle("border-bottom-width")
                },
                {
                  label: "Left",
                  rules: store.findRulesByStyle("border-left-width")
                }
              ]}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Select
              label="Style"
              rules={store.findRulesByStyle([
                "border-top-style",
                "border-right-style",
                "border-bottom-style",
                "border-left-style"
              ])}
            />
          </li>
          <li className="hover:bg-gray-800">
            <Palette
              label="Color"
              rules={store.findRulesByStyle([
                "border-top-color",
                "border-right-color",
                "border-bottom-color",
                "border-left-color"
              ])}
            />
          </li>
          <li className="hover:bg-gray-800">
            <SliderMenu
              label="Radius"
              items={[
                {
                  label: "All",
                  rules: store.findRulesByStyle([
                    "border-top-left-radius",
                    "border-top-right-radius",
                    "border-bottom-left-radius",
                    "border-bottom-right-radius"
                  ])
                },
                {
                  label: "Top Left",
                  rules: store.findRulesByStyle("border-top-left-radius")
                },
                {
                  label: "Top Right",
                  rules: store.findRulesByStyle("border-top-right-radius")
                },
                {
                  label: "Bottom Left",
                  rules: store.findRulesByStyle("border-bottom-left-radius")
                },
                {
                  label: "Bottom Right",
                  rules: store.findRulesByStyle("border-bottom-right-radius")
                }
              ]}
            />
          </li>
        </ol>
      </li>

      <li>
        <Heading Icon={PenTool}>SVG</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Fill"
              render={rule => <Check size={13} />}
              rules={store.findRulesByStyle("fill")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Stroke"
              render={rule => <Check size={13} />}
              rules={store.findRulesByStyle("stroke")}
            />
          </li>
        </ol>
      </li>

      {/* TODO Hide unless `table` is selected */}
      <li>
        <Heading Icon={Grid}>Table</Heading>

        <ol>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Border"
              render={rule =>
                (({
                  "border-collapse": <Square size={13} />,
                  "border-separate": <Grid size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("border-collapse")}
            />
          </li>
          <li className="hover:bg-gray-800">
            <ButtonGroup
              label="Layout"
              render={rule =>
                (({
                  "table-auto": <Maximize2 size={13} />,
                  "table-fixed": <Lock size={13} />
                } as any)[rule.className])
              }
              rules={store.findRulesByStyle("table-layout")}
            />
          </li>
        </ol>
      </li>
    </ol>
  );
});
