// Central place for reading build-time environment variables.
// CRA only exposes vars prefixed REACT_APP_ to the browser bundle, and inlines
// them at build time — set REACT_APP_BACKEND_API_URL per environment (e.g. as
// an ECS task build-arg) rather than relying on the localhost fallback below.
export const BACKEND_API_URL =
    process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8080";