import React from 'react';
import LogoutButton from '../(auth)/_components/logout-button';

export default function Page() {
  return (
    <div className="flex flex-col">
      <LogoutButton>Logout</LogoutButton>
    </div>
  );
}
