import { type NextPage } from "next";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import { HeroImage } from "../components/HeroImage";

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
          content="An online portal for uploading photos from Simone and Liam's engagement party"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-bl from-cyan-200 to-blue-500">
        <p className="py-4 text-center text-3xl">❤️ Simone and Liam ❤️</p>
        <p className="text-center text-sm">6th April 2024</p>
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-4 ">
          <HeroImage />
          <p className="text-center text-xl">
            G&lsquo;day team! We have absolutely loved having you share this day with us!
          </p>
          <p className="text-center text-xl">
           We would love it even more if you could share any photos you&lsquo;ve taken too!
          </p>
          <p className="text-center text-xl">
            Please click sign in below (the password is Liam&lsquo;s middle name!)
          </p>
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              signIn("credentials", {
                password: passwordRef.current!.value,
                callbackUrl: "/upload",
              });
            }}
          >
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
                type="submit"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
