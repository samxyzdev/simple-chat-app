"use client";

import { SigninSchema, SignupSchema } from "@repo/zod/zodSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Input from "../components/CustomInput";
import { BACKEND_URL } from "../config";
import { Eye } from "../icons/EyeIcon";
import { EyeOff } from "../icons/EyeoffIcon";
import { LoadingSpinner } from "../icons/LoadingSpinner";

type RegistrationDetails = {
  name: string;
  email: string;
  password: string;
};

type ErrorState = {
  email: string;
  password: string;
  error: string;
};

type RegexTest = {
  email: boolean;
  password: boolean;
};

type Validator = {
  [K in keyof Omit<RegistrationDetails, "name">]: {
    regex: RegExp;
    message: string;
  };
};

export default function LandingForm() {
  const [showSignin, setShowSignin] = useState(false);
  const [registrationDetails, setRegistrationDetails] =
    useState<RegistrationDetails>({
      name: "",
      email: "",
      password: "",
    });
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"password" | "text">("password");
  const [showEye, setShowEye] = useState(false);
  const [error, setError] = useState<ErrorState>({
    email: "",
    password: "",
    error: "",
  });
  const [regextTest, setRegexTest] = useState<RegexTest>({
    email: false,
    password: false,
  });
  const router = useRouter();
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    const allValid = regextTest.email && regextTest.password;
    setDisableButton(!allValid);
  }, [regextTest, registrationDetails.name, showSignin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // alert("dfadfjasd;lfj;klsdjf");
    e.preventDefault();
    setLoading(true);
    setDisableButton(true);
    if (showSignin) {
      const data = SigninSchema.safeParse(registrationDetails);

      if (!data.success) {
        setError((prev) => ({
          ...prev,
          error: "Please enter correct details",
        }));
        setLoading(false);
        setDisableButton(false);
        return;
      }
      try {
        const response = await axios.post(
          `${BACKEND_URL}/auth/signin`,
          {
            email: registrationDetails.email,
            password: registrationDetails.password,
          },
          { withCredentials: true },
        );
        if (response.status !== 200) {
          setError((prev) => ({
            ...prev,
            error: "Please enter correct details",
          }));
          return router.push("/");
        }
        router.push("/dashboard");
      } catch (error: any) {
        if (error.status === 400) {
          setError((prev) => ({
            ...prev,
            error: "Please signup",
          }));
        }
        setLoading(false);
        setDisableButton(false);
        console.log(error);
      }
    } else {
      const data = SignupSchema.safeParse(registrationDetails);
      if (!data.success) {
        setError((prev) => ({
          ...prev,
          error: "Please enter correct details",
        }));
        setLoading(false);
        setDisableButton(false);
        return;
      }
      try {
        const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
          name: registrationDetails.name,
          email: registrationDetails.email,
          password: registrationDetails.password,
        });
        // console.log(response.data);
        if (response.status !== 201) {
          setError((prev) => ({
            ...prev,
            error: response.data.message,
          }));
          return;
        }
      } catch (error: any) {
        setError((prev) => ({
          ...prev,
          error: error.response.data.message,
        }));
        setLoading(false);
        setDisableButton(false);
        return;
      }
    }
    setShowSignin(true);
    setLoading(false);
  };

  const handleCheckError = (field: keyof RegexTest) => {
    const validator: Validator = {
      email: {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
        message: "Please enter correct email address",
      },
      password: {
        regex: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/,
        message: "Please enter correct password",
      },
    };
    if (registrationDetails[field]) {
      const isValid = validator[field].regex.test(registrationDetails[field]);
      setRegexTest((prev) => ({
        ...prev,
        [field]: isValid,
      }));
      setError((prev) => ({
        ...prev,
        [field]: isValid ? "" : validator[field].message,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, email: "", password: "", error: "" }));
    const { name, value } = e.target;
    setRegistrationDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      <form noValidate className="w-full space-y-4" onSubmit={handleSubmit}>
        {!showSignin && (
          <Input
            label="Name"
            id="name"
            name="name"
            placeholder="name"
            value={registrationDetails.name}
            onChange={handleChange}
            type="text"
            error={""}
            onBlur={() => {}}
          />
        )}
        <Input
          label="Email"
          id="email"
          name="email"
          placeholder="example@domain.com"
          value={registrationDetails.email}
          onChange={handleChange}
          error={error.email}
          type="email"
          onBlur={() => handleCheckError("email")}
        />
        <div className="relative">
          <Input
            label="Password"
            id="password"
            name="password"
            placeholder="password"
            value={registrationDetails.password}
            onChange={handleChange}
            error={error.password}
            type={showEye ? "password" : "text"}
            onBlur={() => handleCheckError("password")}
          />
          <div
            className="absolute top-[46%] right-3 -translate-y-1/2 cursor-pointer"
            onClick={handlePasswordVisibilityToggle}
          >
            {showEye ? <Eye /> : <EyeOff />}
          </div>
        </div>
        <div className="min-h-5 text-sm text-red-600">
          {error.error && error.error}
        </div>
        <button
          disabled={disableButton}
          className={`w-full ${disableButton ? "cursor-not-allowed" : "cursor-pointer"} rounded-lg bg-[#25D366] p-2 text-white hover:bg-[#1DA851] active:bg-green-700 disabled:cursor-not-allowed`}
        >
          {loading ? <LoadingSpinner /> : showSignin ? "Sign in" : "Sign up"}
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
