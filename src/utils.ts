export function randomStr(len: number): string {
  let options =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const length = options.length;

  let output = "";

  for (let i = 0; i < len; i++)
    output += options[Math.floor(Math.random() * length)];

  return output;
}
