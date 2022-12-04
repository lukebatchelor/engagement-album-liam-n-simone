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

    if (!files || !files.media || files.media instanceof Array) {
      res.status(400).json({ data: null, error: "Invalid file was uploaded" });
    }

    const created = await prisma.imageUpload.create({
      data: { fileName: (files.media as formidable.File).newFilename, authorName },
    });

    res.status(200).json({
      data: {
        image_id: created.id,
        fileName: created.fileName,
        authorName: created.authorName,
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
