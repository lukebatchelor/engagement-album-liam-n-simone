import { ImageUpload } from "@prisma/client";
import formidable from "formidable";
import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";
import { FormidableError, parseUploadedFile } from "../../utils/parseUploadedFile";

const uploadApi = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Request must be a POST" });
    return;
  }

  try {
    const { fields, files } = await parseUploadedFile(req);
    const authorName = fields.authorName as string;

    if (!files || !files.media) {
      res.status(400).json({ data: null, error: "Invalid file was uploaded" });
    }

    let created: ImageUpload[] = [];
    if (files.media instanceof Array) {
      created = await Promise.all(
        files.media.map((file) =>
          prisma.imageUpload.create({
            data: { fileName: (file as formidable.File).newFilename, authorName },
          })
        )
      );
    } else {
      const newCreated = await prisma.imageUpload.create({
        data: { fileName: (files.media as formidable.File).newFilename, authorName },
      });
      created.push(newCreated);
    }

    res.status(200).json({
      data: {
        authorName,
        files: created.map((file) => ({
          image_id: file.id,
          fileName: file.fileName,
        })),
      },
      error: null,
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ data: null, error: "Internal Server Error" });
    }
  }
};

export default uploadApi;

// disable nextjs's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
