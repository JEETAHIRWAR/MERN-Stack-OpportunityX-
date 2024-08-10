import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../utils/api";

const GoogleLogin = () => {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        const { name, email, image } = result.data.user;
        console.log("result.data.user---", result.data.user);
      }
      console.log(authResult);
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <GoogleSignIn
        onSuccess={responseGoogle}
        onError={responseGoogle}
        theme="outline"
        size="large"
      /> */}
      <button onClick={googleLogin}>
        {/* <GoogleSignIn /> */}
        login with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
