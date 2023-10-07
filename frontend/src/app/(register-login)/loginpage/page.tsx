"use client";

import { login, loginCredentials } from "@/app/network/users.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import styles from "./loginpage.module.css";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { User } from "@/app/models/user.model";
import { useContext, useEffect, useState } from "react";
import { AuthNavBar } from "../AuthNavBar";
import { UserContext, UserContextType } from "@/app/useUser";

export default function LoginPage() {
  const router = useRouter();

  const { user, setUser, isLoading} =
    useContext<UserContextType>(UserContext);

  const [logginIn, setIsloggingIn] = useState(false);

  const loginMutation = useMutation<User, any, loginCredentials>(login, {
    onSuccess: (data) => {
      setUser(data);
    },
  });

  console.log(loginMutation)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<loginCredentials>();

  async function onSubmit(credentials: loginCredentials) {
    try {
      setIsloggingIn(true);
      await loginMutation.mutateAsync(credentials);
      setIsloggingIn(false);
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);


  if (logginIn) {
    return <div>redirecting...</div>;
  }



  return (
    <>
    
      <AuthNavBar />
      <div className={styles.mainFlex}>
        <div className={styles.flexGrow}>
          <h2 className={styles.mAuto}>Authorization</h2>
          <form className={styles.fullWidth} onSubmit={handleSubmit(onSubmit)}>
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
                      <div className={styles.errorMessage}>{error.message}</div>
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
                    <input type="password" placeholder="password" {...field} />
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
  );
}
