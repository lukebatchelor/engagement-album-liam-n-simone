import { type ImageUpload } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Admin: NextPage = () => {
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/uploads")
      .then((r) => r.json())
      .then((res) => {
        if (res.error) router.push("/");
        if (res.data) setUploadedImages(res.data);
      })
      .catch((err) => router.push("/"));
  }, []);

  const handleDownloadAll = async () => {
    if (!uploadedImages) return;

    const zip = new JSZip();

    // Add each image to the zip file
    const imagePromises = uploadedImages.map((image) =>
      fetch(`/uploads/${image.fileName}`)
        .then((res) => res.blob())
        .then((blob) => zip.file(image.fileName, blob))
    );

    await Promise.all(imagePromises);

    // Generate and download the zip file
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "all_images.zip");
  };

  return (
    <>
      <Head>
        <title>Engagement Album - Admin</title>
        <meta
          name="description"
          content="Admin page for Simone and Liam's engagement album"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-bl from-cyan-200 to-blue-500 px-8 pb-24">
        <p className="py-8 text-center text-4xl">Our Photos 🥰</p>
        <button
          onClick={handleDownloadAll}
          className="mb-8 rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Download All
        </button>
        {uploadedImages === undefined && (
          <div className="flex w-full flex-grow flex-col items-center justify-center ">
            <LoadingSpinner />
          </div>
        )}
        {uploadedImages !== undefined && (
          <div className="flex flex-col gap-5 px-4">
            {uploadedImages.map((image) => (
              <div key={image.id}>
                <p className=" text-lg">
                  #{image.id} by {image.authorName}
                </p>
                <img
                  src={`/uploads/${image.fileName}`}
                  alt={`Uploaded by ${image.authorName}`}
                  className="h-auto max-w-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
        {uploadedImages !== undefined && uploadedImages.length === 0 && (
          <div className="flex flex-col gap-5 px-4">
            <p className=" text-lg">No images have been uploaded yet</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Admin;

function LoadingSpinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
