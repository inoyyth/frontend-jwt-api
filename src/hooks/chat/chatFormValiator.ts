import { z } from "zod";

export class ChatFormValidator {
  private static readonly schema = z.object({
    username: z.string().min(1, "Username is required"),
  });

  static validate() {
    return this.schema;
  }
}

export type ChatFormData = z.infer<(typeof ChatFormValidator)["schema"]>;
