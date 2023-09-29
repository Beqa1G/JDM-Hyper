"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCountries } from "../network/fetchData";

export default function SignupPage() {

    const { data: countries, isLoading, isError} = useQuery({
        queryKey: ["countries"],
        queryFn: fetchCountries
    })



  return (
    <div>
      <form>
        <div>
          <label htmlFor="title">username</label>
          <input type="text"  />
        </div>
        <div>
          <label htmlFor="title">email</label>
          <input type="email"  />
        </div>
        <div>
          <label htmlFor="title">first name</label>
          <input type="text" />
        </div>
        <div>
          <label htmlFor="title">last name</label>
          <input type="text"/>
        </div>
        <div>
          <label htmlFor="title">password</label>
          <input type="password" />
        </div>
        <div>
          <label htmlFor="title">confrim password</label>
          <input type="password"  />
        </div>
        <div>
          <label htmlFor="title">phone number</label>
          <input type="tel" />
        </div>

        <div>
            <label htmlFor="cars">Country</label>
            <select name="country" id="country">
              <option value="Select Country">Select Country</option>
              {countries?.map((country) => (
                <option
                  value={country.name}
                  key={country.id} // Assuming id is unique
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>


        <div>
          <label htmlFor="cities">City</label>
          <select name="cities" id="cities">
            <option value="Georgia">Tbilisi</option>
            <option value="Yerevan">Yerevan</option>
            <option value="Baku">Baku</option>
            <option value="Kiev">Kiev</option>
          </select>
        </div>

        <div>
          <label htmlFor="birthday">Date of birth</label>
          <input type="date" id="birthday" name="birthday"></input>
        </div>

{/*         <legend>Choose your gender:</legend>
        <label htmlFor="male">Male</label>
        <input type="radio" name="gender" id="male" value="male" checked />
        <label htmlFor="female">Female</label>
        <input type="radio" name="gender" id="female" value="female" /> */}
      </form>
    </div>
  );
}
