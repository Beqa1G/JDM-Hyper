"use client";

import { login, loginCredentials } from "@/app/network/users.api";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import styles from "./loginpage.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginResponse, User } from "@/app/models/user.model";
import { useEffect } from "react";
import { AuthNavBar } from "../AuthNavBar";
import { useAuth } from "@/app/hooks/useAuth";
import * as Cookies from "tiny-cookie";

export default function LoginPage() {
  const router = useRouter();

  const { setAuth } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { isSubmitting },
  } = useForm<loginCredentials>();

  const username = getValues("username");
  const password = getValues("password");

  const { isSuccess, mutateAsync } = useMutation<
    LoginResponse,
    any,
    loginCredentials
  >(login, {
    onSuccess: (data) => {
      setAuth({ ...data });
    },
    onError: () => {},
  });

  async function onSubmit(credentials: loginCredentials) {
    try {
      await mutateAsync(credentials);
      clearErrors("password");
      clearErrors("username");
      Cookies.set("isLoggedIn", true);
    } catch (error: any) {
      console.error(error.message);
      if (error.message === "Invalid Credentials") {
        setError("password", {
          message: error.message,
        });
      } else if (error.message === "Failed to fetch") {
        setError("password", {
          message: "Unknown Error",
        });
      }
    }
  }

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);

  return (
    <>
      {isSuccess ? (
        <div>Login successfull, redirecting...</div>
      ) : (
        <>
          <AuthNavBar />
          <div className={styles.mainFlex}>
            <div className={styles.flexGrow}>
              <h2 className={styles.mAuto}>Authorization</h2>
              <form
                className={styles.fullWidth}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="username"
                  defaultValue=""
                  control={control}
                  rules={{ required: "Username is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <div>
                        <input type="text" placeholder="Username" {...field} />
                        {error && (
                          <div className={styles.errorMessage}>
                            {error.message}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                />

                <Controller
                  name="password"
                  defaultValue=""
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <div>
                        <input
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                        {fieldState.error && (
                          <div className={styles.errorMessage}>
                            {fieldState.error.message}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                />

                <button
                  className={styles.button3}
                  role="button"
                  disabled={isSubmitting}
                >
                  Login
                </button>
              </form>
            </div>
            <div>
              <Image
                src="/R34.png"
                alt="Toyota chaser image"
                width={640}
                height={350}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
