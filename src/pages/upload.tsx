import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Upload: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  if (status === "unauthenticated") {
    router.push("/");
  }
  // Not going to worry about loading state here

  // https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) setSelectedFile(files[0]);
  };

  const onUpload = async (e: React.MouseEvent<HTMLElement>) => {
    try {
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("media", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { data, error } = await res.json();

      if (error || !data) {
        alert(error || "Sorry! something went wrong.");
        return;
      }

      console.log("File was uploaded successfully:", data);
    } catch (error) {
      console.error(error);
      alert("Sorry! something went wrong.");
    }
  };

  return (
    <>
      <Head>
        <title>Engagement Album</title>
        <meta
          name="description"
          content="An online portal for uploading photos for Sarah and Luke's engagement album"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col  bg-gradient-to-b from-[#2e026d] to-[#15162c] px-8">
        <p className="py-8 text-center text-4xl text-white">Add your photo</p>

        <div className="flex w-full flex-col items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {preview && (
                <img src={preview} alt="preview" className="max-h-20 object-scale-down" />
              )}
              {!preview && (
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
            <input id="dropzone-file" type="file" className="hidden" onChange={onFileChange} />
          </label>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <input
            type="text"
            className="form-control m-0 inline-block rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
            id="name"
            data-lpignore="true"
            placeholder="Your name"
          />

          <button
            className="my-2 rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20 disabled:opacity-30"
            onClick={onUpload}
            disabled={!preview}
          >
            Upload
          </button>
        </div>
      </main>
    </>
  );
};

export default Upload;
