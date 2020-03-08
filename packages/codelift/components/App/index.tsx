import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Grid,
  useToast
} from "@chakra-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { createClient, Provider } from "urql";

import { observer, useStore } from "../../store";
import { ComponentInspector } from "../ComponentInspector";
import { Error } from "./Error";
import { Header } from "../Header";
import { Selector } from "../Selector";
import { Sidebar } from "./Sidebar";
import { StyleInspector } from "../StyleInspector";
import { TreeInspector } from "../TreeInspector";

const client = createClient({ url: "/api" });

export const App: FunctionComponent = observer(() => {
  const store = useStore();
  // Only render the initial path to prevent double-reloads.
  const [initialPath] = useState(store.path);
  const toast = useToast();

  useEffect(() => {
    if (store.state === "HIDDEN") {
      toast({
        description: "Press ⌘+' to re-open",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
        status: "info",
        title: "Codelift hidden"
      });
    }
  }, [store.state]);

  useEffect(() => {
    const { path } = store;

    window.history.pushState(
      {
        as: path,
        url: path
      },
      path,
      path
    );
  }, [store.path]);

  return (
    <Provider value={client}>
      {store.state === "VISIBLE" && <Selector />}

      <Header />

      <Grid
        gridTemplateColumns={`${store.state === "VISIBLE" ? "16rem" : 0} 1fr ${
          store.state === "VISIBLE" ? "16rem" : 0
        }`}
        style={{ transition: "all 200ms ease-in-out" }}
      >
        <Sidebar key="Tree">
          <main className="flex-grow overflow-auto shadow-inner">
            {store.root ? (
              <TreeInspector />
            ) : store.error ? (
              <Error />
            ) : (
              <Alert
                flexDirection="column"
                paddingY="4"
                status="info"
                variant="left-accent"
              >
                <AlertTitle color="white" fontSize="xl">
                  <CircularProgress
                    isIndeterminate
                    size="70%"
                    marginRight="2"
                  />
                  Loading
                </AlertTitle>
              </Alert>
            )}
          </main>
        </Sidebar>

        <Box as="main" boxShadow="lg" height="100vh" overflow="auto" zIndex={1}>
          <iframe
            onLoad={store.handleFrameLoad}
            src={`http://localhost:3000${initialPath}`}
            style={{ width: "100%", height: "100%" }}
            title="Source"
          />
        </Box>

        <Sidebar key="CSS">
          {store.selected?.isComponent && <ComponentInspector />}
          {store.selected?.isElement && <StyleInspector />}
        </Sidebar>
      </Grid>
    </Provider>
  );
});
