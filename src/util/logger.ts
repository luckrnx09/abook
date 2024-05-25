const info = (message: string) =>
  console.log(`[${new Date().toLocaleString()}] ${message}`);
const error = (error: Error) =>
  console.error(`[${new Date().toLocaleString()}] ${error}`);

export const logger = {
  info,
  error,
};
