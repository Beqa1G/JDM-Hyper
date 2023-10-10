"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchCitiesByCountryName,
  fetchCountries,
} from "../../network/fetchData";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./singuppage.module.css";
import { Controller, useForm } from "react-hook-form";
import {
  FieldTypes,
  checkFields,
  register,
  signUpCredentials,
} from "../../network/users.api";
import {  useRouter } from "next/navigation";
import { AuthNavBar } from "../AuthNavBar";

export default function SignupPage() {
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState("Select Country");
  const [selectedGender, setSelectedGender] = useState("");

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const { data: citiesByCountry } = useQuery(
    ["citiesByCountry", selectedCountry],
    () => {
      if (selectedCountry === "Select Country") {
        return Promise.resolve([]);
      }
      return fetchCitiesByCountryName(selectedCountry);
    },

    {
      enabled: !!selectedCountry,
    }
  );

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<signUpCredentials>();

  const signUpMutation = useMutation(register);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const country = e.target.value;

    setSelectedCountry(country);
  }

  function isSelected(value: string): boolean {
    return selectedGender === value;
  }

  function handleGenderSelection(e: React.ChangeEvent<HTMLInputElement>) {
    const gender = e.target.value;

    setSelectedGender(gender);
  }

  async function checkFieldAvailability(fieldName: FieldTypes, value: string) {
    const data = await checkFields(fieldName, value);

    const capitalizedFieldName =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

    const errorMessage =
      fieldName === "phoneNumber"
        ? "Phone number is already taken"
        : `${capitalizedFieldName} is already taken`;

    if (data.taken) {
      setError(fieldName, {
        type: "manual",
        message: errorMessage,
      });
    } else {
      clearErrors(fieldName);
    }
  }

  function comparePasswords() {
    const password = getValues("password");
    const confirmPassword = getValues("confirmPassword");

    if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords dont match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }

  function checkpasswordLengths() {
    const password = getValues("password");

    if (password.length < 6) {
      setError("password", {
        type: "minLength",
        message: "Password must be at least 6 characters long",
      });
    }
  }

  async function onSubmit(credentials: signUpCredentials) {
    try {
      checkpasswordLengths();
      comparePasswords();
      await checkFieldAvailability("email", credentials.email);
      await checkFieldAvailability("username", credentials.username);
      await checkFieldAvailability("phoneNumber", credentials.phoneNumber);

      await signUpMutation.mutateAsync(credentials);

      reset();

      setSelectedCountry("");
      setSelectedGender("");
      router.push("/");
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <>
      <AuthNavBar />
      <div className={styles.mainFlex}>
        <div>
          <h2 className={styles.marginBottomS}>Register Your Account</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.flex}>
              <Controller
                name="username"
                defaultValue=""
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div className={styles.flexCol}>
                    <input type="text" placeholder="Username" {...field} />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />

              <Controller
                name="email"
                defaultValue=""
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div className={styles.flexCol}>
                    <input type="email" placeholder="Email" {...field} />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className={styles.flex}>
              <Controller
                name="firstName"
                defaultValue=""
                control={control}
                rules={{ required: "First name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div className={styles.flexCol}>
                    <input placeholder="First name" type="text" {...field} />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />

              <Controller
                name="lastName"
                defaultValue=""
                control={control}
                rules={{ required: "Last name is required", minLength: 6 }}
                render={({ field, fieldState: { error } }) => (
                  <div className={styles.flexCol}>
                    <input type="text" placeholder="Last name" {...field} />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className={styles.flex}>
              <Controller
                name="password"
                defaultValue=""
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div className={styles.flexCol}>
                    <input type="password" placeholder="password" {...field} />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />

              <Controller
                name="confirmPassword"
                defaultValue=""
                control={control}
                rules={{
                  required: "Please confirm your password",
                }}
                render={({ field, fieldState: { error } }) => (
                  <div className={styles.flexCol}>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className={styles.center}>
              <Controller
                name="phoneNumber"
                defaultValue=""
                control={control}
                rules={{ required: "Phone number is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <input type="tel" placeholder="Phone number" {...field} />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className={styles.flex}>
              <div>
                <Controller
                  name="country"
                  defaultValue={selectedCountry}
                  control={control}
                  rules={{
                    validate: (value) =>
                      value !== "Select Country" || "Please select a country",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className={styles.flexCol}>
                      <select
                        id="country"
                        onChange={(e) => {
                          field.onChange(e);
                          handleChange(e);
                        }}
                        value={selectedCountry}
                      >
                        <option value="Select Country">Select Country</option>
                        {countries?.map((country) => (
                          <option key={country.id}>{country.name}</option>
                        ))}
                      </select>
                      {error && (
                        <div className={styles.errorMessage}>
                          {error.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: "Please Select a city" }}
                  render={({ field, fieldState: { error } }) => (
                    <div className={styles.flexCol}>
                      <select id="cities" {...field}>
                        <option value="Select city">Select City</option>
                        {citiesByCountry?.map((city) => (
                          <option value={city.cityName} key={city.cityId}>
                            {city.cityName}
                          </option>
                        ))}
                      </select>
                      {error && (
                        <div className={styles.errorMessage}>
                          {error.message}
                        </div>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className={styles.flexCol}>
              <Controller
                name="dateOfBirth"
                defaultValue=""
                control={control}
                rules={{ required: "Enter your date of birth" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <input
                      placeholder="Date of Birth: YYYY-MM-DD"
                      id="birthday"
                      {...field}
                    />
                    {error && (
                      <div className={styles.errorMessage}>{error.message}</div>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="genderType"
              defaultValue=""
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <>
                  <legend className={styles.marginTopXS}>
                    Choose your gender:
                  </legend>
                  <div className={`${styles.flexNoGap} ${styles.marginTopS}`}>
                    <label htmlFor="male">Male</label>
                    <input
                      type="radio"
                      id="male"
                      name="male"
                      value="Male"
                      onChange={(e) => {
                        onChange(e);
                        handleGenderSelection(e);
                      }}
                      checked={isSelected("Male")}
                    />
                    <label htmlFor="female">Female</label>
                    <input
                      type="radio"
                      id="female"
                      value="Female"
                      onChange={(e) => {
                        onChange(e);
                        handleGenderSelection(e);
                      }}
                      checked={isSelected("Female")}
                    />
                  </div>
                  {error && (
                    <div className={styles.errorMessage}>{error.message}</div>
                  )}
                </>
              )}
            />

            <button
              className={styles.button3}
              role="button"
              disabled={isSubmitting}
            >
              Register
            </button>
          </form>
        </div>
        <div>
          <Image src="/S13.png" alt="S13 image" width={640} height={350} />
        </div>
      </div>
    </>
  );
}
