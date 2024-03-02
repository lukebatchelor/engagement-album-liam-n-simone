/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "../utils/useWindowSize";

type UploadResp = {
  authorName: string;
  files: Array<{ image_id: string; fileName: string }>;
};

const Upload: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedFiles, setSelectedFiles] = useState<FileList>();
  const [previews, setPreviews] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadResp, setUploadResp] = useState<UploadResp>();
  const { height, width } = useWindowSize();

  if (status === "unauthenticated") {
    router.push("/");
  } else if (status === "authenticated" && session.user?.isAdmin) {
    router.push("/admin");
  }

  // https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
  useEffect(() => {
    if (!selectedFiles) {
      setPreviews(undefined);
      return;
    }

    const objectUrls = [...selectedFiles].map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // free memory when ever this component is unmounted
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) setSelectedFiles(files);
  };

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedFiles) return;
      setLoading(true);

      const formData = new FormData();
      [...selectedFiles].forEach((file) => {
        formData.append("media", file);
      });
      formData.append(
        "authorName",
        (document.getElementById("authorName") as HTMLInputElement).value
      );

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { data, error } = await res.json();

      if (error || !data) {
        setError(error || "Sorry! something went wrong.");
        return;
      }
      setUploadResp(data);
      console.log("File was uploaded successfully:", data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Sorry! something went wrong. " + error);
    }
  };

  return (
    <>
      <Head>
        <title>Engagement Album</title>
        <meta
          name="description"
          content="An online portal for uploading photos from Simone and Liam's engagement party"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Confetti height={height} width={width} run={!!uploadResp} />
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-bl from-cyan-200 to-blue-500 px-8 pb-24">
        <p className="py-8 text-center text-4xl ">
          {uploadResp === undefined ? "Share your photos" : "Uploaded!"}
        </p>

        {uploadResp === undefined && (
          <UploadControls
            previews={previews}
            onFileChange={onFileChange}
            onUpload={onUpload}
            loading={loading}
          />
        )}
        {uploadResp !== undefined && (
          <div className="flex w-full flex-grow flex-col items-center justify-center ">
            <p className="py-4 text-center text-xl">Thanks {uploadResp.authorName}!</p>
            <p className="text-center text-xl">
              We have received your photos!
            </p>
            <div className="flex flex-wrap justify-center gap-4 py-4 ">
              {uploadResp.files.map((file) => (
                <div key={file.fileName} className="flex flex-col justify-center">
                  <img
                    src={`/uploads/${file.fileName}`}
                    alt="preview"
                    className="max-h-20 object-scale-down"
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-xl">
             Love you long time!
            </p>
          </div>
        )}
      </main>
    </>
  );
};

type UploadControlsProps = {
  previews?: string[];
  loading: boolean;
  onFileChange: React.ChangeEventHandler<HTMLInputElement>;
  onUpload: React.FormEventHandler;
};

function UploadControls(props: UploadControlsProps) {
  const { previews, onFileChange, onUpload, loading } = props;

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {!!previews && (
              <div className="mb-2 flex flex-wrap justify-center gap-2">
                {previews.map((preview, idx) => (
                  <img
                    key={idx}
                    src={preview}
                    alt="preview"
                    className="max-h-20 object-scale-down"
                  />
                ))}
              </div>
            )}
            {!previews && (
              <svg
                aria-hidden="true"
                className="mb-3 h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
            )}

            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={onFileChange}
            multiple
          />
        </label>
      </div>
      <form onSubmit={onUpload} autoComplete="off">
        <div className="mt-4 flex flex-col items-center gap-2">
          <input
            type="text"
            className="form-control m-0 inline-block rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
            id="authorName"
            data-lpignore="true"
            placeholder="Your name"
          />

          <button
            className="my-2 rounded-full bg-white/10 px-5 py-2 font-semibold no-underline transition hover:bg-white/20 disabled:opacity-30"
            type="submit"
            disabled={!previews || loading}
          >
            {loading ? "Loading" : "Upload"}
          </button>
        </div>
      </form>
    </>
  );
}

export default Upload;
