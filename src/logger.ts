const info = (message: string) => console.log(message);
const error = (error: Error) => console.error(error);

export const logger = {
  info,
  error,
};
