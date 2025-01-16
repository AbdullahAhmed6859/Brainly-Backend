export function random(len: number): string {
  let options = "abcdefghijklmnopqrstuvwxyz1234567890";

  let output = "";

  for (let i = 0; i < len; i++)
    output += options[Math.floor(Math.random() * length)];

  return output;
}
