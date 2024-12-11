import hasDom from "has-dom";
import process from "node:process";

if (hasDom()) {
  globalThis.addEventListener("unhandledrejection", (reason) => {
    console.error("Unhandled Rejection", reason);
  });
} else {
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection", err.stack || err);
  });
}
