"use client";

import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { WhatsAppLogoIcon } from "../icons/WhatsAppLogoIcon";
import { WhatsAppNameLogoIcon } from "../icons/WhatsAppNameLogoIcon";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [showSignin, setShowSignin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignupRequest() {
    setLoading(true);
    try {
      if (showSignin) {
        const response = await axios.post(`${BACKEND_URL}/user/signin`, {
          email,
          password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        await axios.post(`${BACKEND_URL}/user/signup`, {
          name,
          email,
          password,
        });
      }
      setShowSignin(true);
    } catch (error) {
      console.log(error);
      alert("some error has occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-screen flex-1 flex-col bg-[#FCF5EB]">
      <h1 className="flex items-center gap-1 px-10 py-2 text-[#25D366]">
        <WhatsAppLogoIcon />
        <WhatsAppNameLogoIcon />
      </h1>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-lg border bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">
            {showSignin ? "Signin" : "Signup"}
          </h2>
          {showSignin || (
            <input
              type="text"
              placeholder="Name"
              className="m-1 w-full rounded-lg border p-2"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Email"
            className="m-1 w-full rounded-lg border p-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="m-1 w-full rounded-lg border p-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignupRequest}
            className="mt-4 w-full rounded-lg bg-[#25D366] p-2 text-white hover:bg-[#1DA851]"
          >
            {loading ? <LandingSpinner /> : showSignin ? "Sign in" : "Sign up"}
          </button>
          <p className="p-2 text-sm">
            Click here to{" "}
            <button
              onClick={() => setShowSignin(!showSignin)}
              className="cursor-pointer text-blue-500"
            >
              {showSignin ? "Signup" : "Signin"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

function LandingSpinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline h-8 w-8 animate-spin fill-green-500 text-gray-200 dark:text-gray-600"
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
