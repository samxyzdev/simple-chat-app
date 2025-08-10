"use client";

import { SigninSchema, SignupSchema } from "@repo/zod/zodSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "../components/CustomInput";
import { BACKEND_URL } from "../config";
import { LandingSpinner } from "../icons/CopyIcon";

export default function LandingForm() {
  const [showSignin, setShowSignin] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("password");
  const [showEye, setShowEye] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (showSignin) {
        const data = SigninSchema.safeParse(registrationDetails);
        if (!data.success) {
          console.log("not success");
          return;
        }
        const response = await axios.post(
          `${BACKEND_URL}/user/signin`,
          {
            email: registrationDetails.email,
            password: registrationDetails.password,
          },
          { withCredentials: true },
        );
        if (response.status !== 200) {
          return router.push("/");
        }
        router.push("/dashboard");
        // const token = response.data.token;
        // if (typeof localStorage !== "undefined") {
        //   localStorage.setItem("token", token);
        //   router.push("/dashboard");
        // }
      } else {
        const data = SignupSchema.safeParse(registrationDetails);
        const response = await axios.post(`${BACKEND_URL}/user/signup`, {
          name: registrationDetails.name,
          email: registrationDetails.email,
          password: registrationDetails.password,
        });
        if (response.status !== 201) {
          alert("erroe while creating user");
          return;
        }
      }
      setShowSignin(true);
    } catch (error) {
      console.log(error);
      alert("some error has occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationDetails((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
    // setErrors({});
  };

  const handlePasswordVisibilityToggle = () => {
    if (type === "password") {
      setShowEye(true);
      setType("text");
    } else {
      setShowEye(false);
      setType("password");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-2xl font-bold uppercase">
        {showSignin ? "Signin" : "Signup"}
      </h2>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        {showSignin || (
          <Input
            label="name"
            id="name"
            name="name"
            placeholder="name"
            value={registrationDetails.name}
            // className="m-1 w-full rounded-lg border p-2"
            onChange={handleChange}
            error={"please enter correct details"}
            type="text"
          />
        )}
        <Input
          label="email"
          id="email"
          name="email"
          placeholder="email"
          value={registrationDetails.email}
          // className="m-1 w-full rounded-lg border p-2"
          onChange={handleChange}
          error={"please enter correct details"}
          type="email"
        />
        <Input
          label="password"
          id="password"
          name="password"
          placeholder="password"
          value={registrationDetails.password}
          // className="m-1 w-full rounded-lg border p-2"
          onChange={handleChange}
          error={"please enter correct details"}
          type={type}
        />
        <span
          className="relative -top-[50px] left-[360px] cursor-pointer"
          onClick={handlePasswordVisibilityToggle}
        >
          {showEye ? <Eye /> : <EyeOff />}
        </span>
        <button className="w-full rounded-lg bg-[#25D366] p-2 text-white hover:bg-[#1DA851]">
          {loading ? <LandingSpinner /> : showSignin ? "Sign in" : "Sign up"}
        </button>
      </form>
      <p className="space-x-1 p-2 text-center text-sm">
        <span>Click here to</span>
        <button
          onClick={() => setShowSignin(!showSignin)}
          className="cursor-pointer text-blue-500 underline"
        >
          {showSignin ? "Signup" : "Signin"}
        </button>
      </p>
    </div>
  );
}

export const Eye = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
};

export const EyeOff = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
};
