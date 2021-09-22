import React from 'react';
import User from './User';

export default function UsersList({ users = [], mode = 'md' }) {
  console.log(users);
  if (users.length == 0) {
    return <>No users found</>;
  }
  return users.map((user) => {
    return <User key={user._id} user={user} mode={mode} />;
  });
}
