import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AiOutlineCheck } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { User } from "../models/user";
import {
  deleteUser,
  editUser,
  editUserCredentials,
} from "../network/users.api";
import styles from "../styles/routes.module.css";

export interface UserSettingsPageProps {
  loggedInUser: User | null;
  isLoading: boolean;
  isFetching: boolean;
}

export default function UserSettingsPage({
  loggedInUser,
  isLoading,
  isFetching
}: UserSettingsPageProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const [isEditingUsernameMode, setIsEditingUsernameMode] = useState(false);

  const [isEditingEmailMode, setIsEditingEmailMode] = useState(false);

  const [isEditingPasswordMode, setIsEditingPasswordMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<editUserCredentials>();

  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.setQueryData(["loggedInUser"], null); // Clear the user data from cache
      navigate("/loginpage");
    },
  });

  const handleDeleteUser = async () => {
    try {
      await deleteUserMutation.mutateAsync();
    } catch (error: any) {
      alert(error.message);
      console.error(error.message);
    }
  };

  const editUserMutation = useMutation(editUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["loggedInUser"]);
    },
  });

  const editUsername = async (credentials: editUserCredentials) => {
    try {
      await editUserMutation.mutateAsync(credentials);
      setIsEditingUsernameMode(false);
    } catch (error: any) {
      alert(error.message);
      console.error(error.message);
    }
  };

  const editEmail = async (credentials: editUserCredentials) => {
    try {
      await editUserMutation.mutateAsync(credentials);
      setIsEditingEmailMode(false);
    } catch (error: any) {
      alert(error.message);
      console.error(error.message);
    }
  };

  const editPassword = async (credentials: editUserCredentials) => {
    try {
      // Assuming you pass the new password via credentials.password
      const updatedCredentials: editUserCredentials = {
        ...credentials,
        username: loggedInUser?.username as string,
        email: loggedInUser?.email as string,
      };

      await editUserMutation.mutateAsync(updatedCredentials);
      setIsEditingPasswordMode(false);
      setValue("password", "");
    } catch (error: any) {
      alert(error.message);
      console.error(error.message);
    }
  };

  if (isLoading && isFetching) {
    return <Spinner className={styles.loadingStates} animation="border"/>
  }

  return (
    <>
      <div className={styles.settingsCard}>
        <section className={styles.marginBlock}>
          {isEditingUsernameMode ? (
            <>
              <Form id="usernameForm" onSubmit={handleSubmit(editUsername)}>
                <Form.Control
                  defaultValue={loggedInUser?.username}
                  isInvalid={!!errors.username}
                  {...register("username", {
                    required: "Please update username",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form>
              <button
                type="submit"
                className={styles.iconButton}
                form="usernameForm"
                disabled={isSubmitting}
              >
                {editUserMutation.isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <AiOutlineCheck />
                )}
              </button>
            </>
          ) : (
            <div
              className={styles.settingsCardFlex}
              onClick={() => {
                setIsEditingUsernameMode(true);
                setValue("username", loggedInUser?.username as string);
              }}
            >
              <div>Username</div>
              <div className={styles.editable}>{loggedInUser?.username}</div>
            </div>
          )}

          {isEditingEmailMode ? (
            <>
              <form id="emailForm" onSubmit={handleSubmit(editEmail)}>
                <input
                  defaultValue={loggedInUser?.email}
                  isInvalid={!!errors.email}
                  {...register("email", {
                    required: "Please update email",
                  })}
                />
                <div type="invalid">
                  {errors.email?.message}
                </div>
              </form>
              <button
                type="submit"
                className={styles.iconButton}
                form="emailForm"
                disabled={isSubmitting}
              >
                {editUserMutation.isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <div>loading</div>
                )}
              </button>
            </>
          ) : (
            <div
              className={styles.settingsCardFlex}
              onClick={() => {
                setIsEditingEmailMode(true);
                setValue("email", loggedInUser?.email as string);
              }}
            >
              <div>Email</div>
              <div className={styles.editable}>{loggedInUser?.email}</div>
            </div>
          )}
        </section>

        {isEditingPasswordMode ? (
          <Form id="passwordForm" onSubmit={handleSubmit(editPassword)}>
            <Form.Control
              type="password"
              placeholder="New Password"
              isInvalid={!!errors.password}
              {...register("password", {
                required: "Please update password",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>

            <button
              type="submit"
              className={styles.iconButton}
              form="passwordForm"
              disabled={isSubmitting}
            >
              {editUserMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <AiOutlineCheck />
              )}
            </button>
          </Form>
        ) : (
          <Button
            variant="dark"
            type="button"
            className={`btn primary ${styles.margin2}`}
            onClick={() => {
              setIsEditingPasswordMode(true);
            }}
          >
            Change Password
          </Button>
        )}

        <Button
          type="button"
          className={`btn btn-danger ${styles.margin1}`}
          onClick={handleDeleteUser}
        >
          delete User
        </Button>
      </div>
    </>
  );
}