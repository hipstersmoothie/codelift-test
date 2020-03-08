import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Textarea,
  useClipboard,
  Button
} from "@chakra-ui/core";
import { FunctionComponent } from "react";
import { observer, useStore } from "../../store";

const code = `
import React from "react";
import ReactDOM from "react-dom";
import { register } from "codelift";
register({ React, ReactDOM });
`.trim();

export const Error: FunctionComponent = observer(() => {
  const store = useStore();
  const { onCopy, hasCopied } = useClipboard(code);

  if (!store.error) {
    return null;
  }

  return (
    <Alert
      color="white"
      flexDirection="column"
      status="warning"
      variant="left-accent"
    >
      <AlertIcon />
      <AlertTitle fontSize="lg" marginY="2" textAlign="center" textShadow="sm">
        {store.error.message}
      </AlertTitle>
      <AlertDescription fontWeight="normal" marginY="2" textAlign="center">
        Add to the top of your app:
      </AlertDescription>
      <Textarea
        bg="black"
        defaultValue={code}
        fontSize="xs"
        fontFamily="mono"
        minHeight="2rem"
        opacity={0.5}
        padding="2"
        overflow="auto"
        resize="none"
        rounded="md"
        roundedBottom="none"
        whiteSpace="pre"
        width="full"
      />
      <Button
        leftIcon={hasCopied ? "check-circle" : "copy"}
        onClick={onCopy}
        size="sm"
        variantColor="green"
        width="full"
        roundedTop="none"
      >
        {hasCopied ? "Copied!" : "Copy"}
      </Button>
    </Alert>
  );
});
