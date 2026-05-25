interface SystemConfig {
  mode: "production" | "development";
  version: `v${number}.${number}`;
}

export function isValidConfig(config: any): config is SystemConfig {
  return (
    config &&
    (config.mode === "production" || config.mode === "development") &&
    typeof config.version === "string" &&
    config.version.startWith("w")
  );
}
