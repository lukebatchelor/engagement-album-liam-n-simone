import formidable from "formidable";
import type { NextApiRequest } from "next";
import { join } from "path";
import { mkdir, stat } from "fs/promises";
import crypto from "node:crypto";

import { env } from "../env/server.mjs";

export const FormidableError = formidable.errors.FormidableError;
type ParsedFields = { fields: formidable.Fields; files: formidable.Files };

export const parseUploadedFile = async (req: NextApiRequest): Promise<ParsedFields> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = join(process.cwd(), env.UPLOADED_IMGS_DIR);

    const form = formidable({
      maxFiles: 1,
      uploadDir,
      keepExtensions: true,
      filename: (name, ext) => {
        const newName = `${Date.now()}-${crypto.randomBytes(10).toString("hex")}${ext}`;
        console.log("Uploaded file, new name: ", newName);
        return newName;
      },
      filter: (part) => {
        return part.name === "media" && (part.mimetype?.includes("image") || false);
      },
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};
