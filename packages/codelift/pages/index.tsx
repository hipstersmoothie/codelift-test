import { CSSReset, DarkMode, ThemeProvider } from "@chakra-ui/core";
import dynamic from "next/dynamic";

const AppClient = dynamic(
  async () => {
    const { App } = await import("../components/App");

    return App;
  },
  {
    ssr: false
  }
);

export default () => (
  <ThemeProvider>
    <CSSReset />

    <DarkMode>
      <AppClient />
    </DarkMode>
  </ThemeProvider>
);
