import { FunctionComponent } from "react";

export const Sidebar: FunctionComponent = ({ children }) => (
  <aside className="text-white bg-gray-800 flex flex-col justify-center h-screen overflow-auto shadow-inner">
    {children}
  </aside>
);
