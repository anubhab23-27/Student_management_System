import { Button } from '@/components/ui/button';
import React from 'react'
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-row gap-9">
        <Link to={"/login/teacher"}>
          <Button variant="outline">Log in as Teacher</Button>
        </Link>

        <Link to={"/login/student"}>
          <Button variant="outline">Log in as student</Button>
        </Link>

        <Link to={"/login/parent"}>
          <Button variant="outline">Log in as parent</Button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage
