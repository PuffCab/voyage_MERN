import { useEffect } from "react";
import Signup from "../components/Signup";

function SignUp() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <h1>sign up</h1>
      <Signup />
    </div>
  );
}

export default SignUp;
