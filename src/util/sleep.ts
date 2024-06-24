const sleep = (ms: number) =>
  new Promise(resolve => {
    setInterval(resolve, ms);
  });
export {sleep};
