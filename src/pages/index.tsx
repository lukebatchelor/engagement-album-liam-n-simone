import { type NextPage } from "next";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";

const Home: NextPage = () => {
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const queryParams = new URLSearchParams(window.location.search);
    if (!queryParams.has("pw")) return;
    const pw = queryParams.get("pw");
    passwordRef.current!.value = pw!;
  }, []);
  return (
    <>
      <Head>
        <title>Engagement Album</title>
        <meta
          name="description"
          content="An online portal for uploading photos for Sarah and Luke's egagement album"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <p className="py-8 text-center text-4xl text-white">❤️ Sarah + Luke ❤️</p>
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-4 ">
          <img
            src="/couple-1-crop.jpg"
            className="rounded-full object-scale-down"
            width="200"
            height="200"
            alt="Avatar"
          />
          <p className="text-center text-xl text-white">
            Welcome to our online engagement album. Thank you so much for joining us today!
          </p>
          <p className="text-center text-xl text-white">
            Sign in below to upload your selfie with one or both of us
          </p>
          <div className="flex flex-col items-center gap-2">
            <input
              type="password"
              className="form-control m-0 inline-block rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
              id="password"
              data-lpignore="true"
              placeholder="Password"
              ref={passwordRef}
            />

            <button
              className="my-2 rounded-full bg-white/10 px-5 py-2 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() =>
                signIn("credentials", {
                  password: (document.getElementById("password") as HTMLInputElement).value,
                  callbackUrl: "/upload",
                })
              }
            >
              Sign in
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
