globalThis.addEventListener("unhandledrejection", (reason) => {
  console.error("Unhandled Rejection", reason);
});
