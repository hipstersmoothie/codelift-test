# code<sup>_lift_</sup>&nbsp;&nbsp;![Version](https://img.shields.io/npm/v/codelift.svg) ![Downloads](https://img.shields.io/npm/dm/codelift.svg)

> A "No Code" GUI for your existing React app.
> – [Launch Tweet](https://twitter.com/ericclemmons/status/1205161643300098048)

![Next.js Example](/screenshot.png)

## Getting Started

Within your project:

1. `yarn add codelift --dev`
1. For [create-react-app][cra]:

   `yarn codelift start`

   For [Next.js][next]:

   `yarn codelift dev`

   _(`codelift` runs `yarn ____` with whatever you provide)_

1. Add the following `import "codelift/register"` to the top of your `src/index.tsx` or `pages/_app.tsx`:

   ```js
   import React from "react";
   import ReactDOM from "react-dom";

   import { register } from "codelift";
   register({ React, ReactDOM });
   ```

   _`codelift` requires access to your application's copy of `react` and `react-dom` to support custom inspectors._

## Examples

- [Create React App + Tailwind CSS](/examples/cra)
- [Next.js + Tailwind CSS](examples/next)

## Features

- <kbd>Double-Click</kbd> componetns & elements in the tree view to open in VS Code.

- [Tailwind](https://tailwindcss.com/) Visual Inspector

  1. Hover & Select an element.
  1. **Find-as-you-type** CSS classes.
  1. **Hover to preview** before applying.
  1. **Click to toggle** in your source code.

- <kbd>CMD+'</kbd> to toggle _codelift_ and browse normally.

- Custom Inspectors:

  Suppose you have [`Header` component](examples/next/components/Header.tsx) that accepts a `title`:

  ```js
  export const Header = ({ title }) => {
    ...
  }
  ```

  Next, attach a custom `Inspector` component to your `Header` that accepts the current `props` and calls `setProps` when it changes:

  ```js
  Header.Inspector = ({ props, setProps }) => {
    return (
      <input
        onChange={event => setProps({ title: event.target.value })}
        defaultValue={props.title}
      />
    );
  };
  ```

  Your `Inspector` will be rendered in a sidepanel when a `Header` is selected:

  > ![Header Inspector](/header.inspector.png)

* [What feature would you like to see?](https://github.com/ericclemmons/codelift/issues/new)

## Contributing

1. Clone this repo.
1. `yarn cra` or `yarn next` to run the CRA or Next.js examples, respectively.

## Author

- Eric Clemmons

[cra]: https://github.com/facebook/create-react-app
[next]: https://github.com/zeit/next.js/
[tailwind]: https://tailwindcss.com/

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://ericclemmons.com/"><img src="https://avatars0.githubusercontent.com/u/15182?v=4" width="50px;" alt=""/><br /><sub><b>Eric Clemmons</b></sub></a><br /><a href="https://github.com/ericclemmons/codelift/commits?author=ericclemmons" title="Code">💻</a> <a href="https://github.com/ericclemmons/codelift/commits?author=ericclemmons" title="Documentation">📖</a> <a href="#infra-ericclemmons" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://aulisi.us"><img src="https://avatars2.githubusercontent.com/u/6629172?v=4" width="50px;" alt=""/><br /><sub><b>​Faizaan</b></sub></a><br /><a href="https://github.com/ericclemmons/codelift/commits?author=aulisius" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
