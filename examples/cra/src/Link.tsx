import React, { FunctionComponent } from "react";

export const Link: FunctionComponent = ({ children }) => (
  <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

// @ts-ignore
Link.Inspector = ({ props, setProps }) => {
  return (
    <label className="flex flex-col px-4">
      <small className="opacity-75 italic tracking-wider">Text</small>
      <input
        autoFocus
        className="bg-transparent border-b border-dotted"
        onChange={event => setProps({ children: event.target.value })}
        defaultValue={props.children}
      />
    </label>
  );
};
