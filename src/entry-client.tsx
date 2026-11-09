import { StartClient } from "@tanstack/react-start/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// StartClient resolves the router from the framework's router entry
// (src/router.tsx -> getRouter), so it takes no props.
hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);
