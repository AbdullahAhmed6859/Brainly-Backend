import { z } from "zod";

export const shareLinkParam = z.object({
  shareLink: z.string().length(10, "invalid link"),
});
