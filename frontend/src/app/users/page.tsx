import { User } from "../models/user.model";
import { fetchData } from "../network/fetchData";
import { getUsers } from "../network/users.api";


export default async function Users() {


const users: User[]  = await getUsers()

    return (
      <div>
        { users ? (users.map(user => (
          <div key={user.username}>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
            <div>{user.username}</div>
            <div>{user.role}</div>
          </div>
        ))) : (
            <div>Please login, redirecting to a login page...</div>
        )}
      </div>
    );
   
    

}
