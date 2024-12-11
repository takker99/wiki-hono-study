export function delay(msec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, msec);
  });
}
