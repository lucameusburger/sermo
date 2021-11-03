import React, { useState, useContext } from 'react';
import Axios from 'axios';

const axiosInst = Axios.create({ withCredentials: true });

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}

export function useUserUpdate() {
  console.log('update auth user!!');
  return useContext(UserUpdateContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(false);

  function fetchUser() {
    axiosInst.post('http://localhost:3001/checkLogged').then(function (response) {
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(false);
      }
    });
  }

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={fetchUser}>{children}</UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
