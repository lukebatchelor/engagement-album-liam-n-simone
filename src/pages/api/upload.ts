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

    if (!files || !files.media) {
      res.status(400).json({ data: null, error: "Invalid file was uploaded" });
    }

    console.log({ fields, files });

    res.status(200).json({
      data: {
        image_id: "17",
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
