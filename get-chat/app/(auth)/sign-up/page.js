"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema } from "@/schemas/signupSchema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/debounce.js";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GiWorld } from "react-icons/gi";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const debouncedUsername = useDebounce(username, 500);
  const router = useRouter();

  const {
    uniqueUsernameMessage,
    checkUniqueUsername,
    isCheckingUsername,
    isSigningUp,
    signup
  } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (debouncedUsername) {
      checkUniqueUsername(debouncedUsername);
    }
  }, [debouncedUsername, checkUniqueUsername]);

  const onSubmit = async (formData) => {
    signup(formData, router)
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 text-white">
      <div
        className="h-10 absolute top-0 left-0 m-4 flex items-center gap-x-2 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
        onClick={() => router.replace("/")}
      >
        <Image src="/messenger.png" width={30} height={30} alt="Logo" />
        <span className="text-lg font-bold">Get Chat</span>
      </div>

      <div className="flex w-full max-w-5xl rounded-xl shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 text-left md:block">
          <div className="h-full flex flex-col items-center justify-center gap-y-4">
            <Image src="/messenger.png" width={150} height={150} alt="Logo" />
            <h1 className="text-5xl font-bold">Get Chat</h1>
            <p className="flex gap-x-1 text-xl">
              Bringing the{" "}
              <span className="flex gap-x-1 text-secondColor">
                World <GiWorld />
              </span>{" "}
              Closer
            </p>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 bg-white text-black px-8 py-10">
          <h2 className="text-2xl font-semibold mb-6">Create account</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                        className="focus:ring-2 focus:ring-secondColor"
                      />
                    </FormControl>
                    <div className="flex items-center gap-2 mt-1">
                      {isCheckingUsername && (
                        <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                      )}
                      <p
                        className={`text-sm ${
                          uniqueUsernameMessage === "Username is unique"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {uniqueUsernameMessage}
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="focus:ring-2 focus:ring-secondColor"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="focus:ring-2 focus:ring-secondColor pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2  cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Must be at least 6 characters
                    </p>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-black hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="w-full mt-2 bg-white border border-gray-300 text-black font-semibold py-2 rounded-md hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center gap-3">
                    <FcGoogle className="h-4" />
                    Sign up with Google
                  </span>
                </button>
              </div>

              <p
                className="text-sm text-center mt-4"
                onClick={() => router.push("/sign-in")}
              >
                Already have an account?{" "}
                <span className="text-secondColor font-bold hover:underline cursor-pointer">
                  Log in
                </span>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
