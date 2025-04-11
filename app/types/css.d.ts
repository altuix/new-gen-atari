import * as React from "react";

declare module "react" {
  interface CSSProperties {
    "--neon-base"?: string;
    "--neon-glow"?: string;
  }
}
