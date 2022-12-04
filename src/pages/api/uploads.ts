import { type NextApiRequest, type NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { prisma } from "../../server/db/client";

/* Get all uploaded images */
const uploads = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  if (!token || !token.isAdmin) {
    return res.status(400).json({ data: null, error: "User is not an admin" });
  }
  const uploadedImages = await prisma.imageUpload.findMany();
  res.status(200).json({ data: uploadedImages });
};

export default uploads;
