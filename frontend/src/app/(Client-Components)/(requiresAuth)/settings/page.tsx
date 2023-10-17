"use client";
import useFetch from "@/app/hooks/useFetch";
import styles from "./settings.module.css";
import { usePrivateFetch } from "@/app/hooks/usePrivateFetch";
import { User } from "@/app/models/user.model";
import { editUserCredentials } from "@/app/network/users.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCheck } from "react-icons/ai";
import * as Cookies from "tiny-cookie";

export default function SettingsPage() {
  const fetchPrivate = usePrivateFetch();
  const callFetch = useFetch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditingEmailMode, setIsEditingEmailMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<editUserCredentials>();

  const { data: loggedInUser, isLoading } = useQuery<User | null>(
    ["loggedInUser"],
    async () => {
      const { data, response } = await fetchPrivate("/api/auth/loggedinuser", {
        method: "GET",
        credentials: "include",
      });
      const dataPromise: User = await data;

      return dataPromise;
    },
    {
      retry: false,
      staleTime: 0,
      onError: () => {
        Cookies.remove("isLoggedIn");
        Cookies.remove("username");
        Cookies.remove("genderId");
        router.push("/loginpage");
      },
    }
  );

  const editUser = async (credentials: editUserCredentials) => {
    console.log("passed to edituser:", credentials);
    await callFetch("/api/auth/profile", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

  };

  const editUserMutation = useMutation(editUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["loggedInUser"]);
    },
  });

  const editEmail = async (credentials: editUserCredentials) => {
    console.log(credentials);
    try {
      await editUserMutation.mutateAsync(credentials);
      setIsEditingEmailMode(false);
    } catch (error: any) {
      alert(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <label>email</label>
      {isEditingEmailMode ? (
        <>
          <form id="emailForm" onSubmit={handleSubmit(editEmail)}>
            <input
              className={styles.editable}
              defaultValue={loggedInUser?.email}
              {...register("email", {
                required: "Please update email",
              })}
            />
            <div>{errors.email?.message}</div>
          </form>
          <button
            type="submit"
            className={styles.iconButton}
            form="emailForm"
            disabled={isSubmitting}
          >
            {editUserMutation.isLoading ? (
              <div>loading</div>
            ) : (
              <AiOutlineCheck />
            )}
          </button>
        </>
      ) : (
        <>
          <div
            onClick={() => {
              setIsEditingEmailMode(true);
              setValue("email", loggedInUser?.email as string);
            }}
          >
            <div className={styles.editable}>{loggedInUser?.email}</div>
          </div>
        </>
      )}
      <div>{loggedInUser?.username}</div>
      <div>{loggedInUser?.phoneNumber}</div>
      <div>{loggedInUser?.genderType}</div>
      <div>{loggedInUser?.lastName}</div>
      <div>{loggedInUser?.dateOfBirth}</div>
    </>
  );
}
