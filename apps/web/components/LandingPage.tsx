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
        const response = await axios.post(`${BACKEND_URL}/user/signin`, {
          email: registrationDetails.email,
          password: registrationDetails.password,
        });
        const token = response.data.token;
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("token", token);
          router.push("/dashboard");
        }
      } else {
        const data = SignupSchema.safeParse(registrationDetails);
        console.log(data);

        await axios.post(`${BACKEND_URL}/user/signup`, {
          name: registrationDetails.name,
          email: registrationDetails.email,
          password: registrationDetails.password,
        });
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
        />
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
