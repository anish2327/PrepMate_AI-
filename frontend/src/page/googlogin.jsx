import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function googleLogin() {

  const handleSuccess = async (credentialResponse) => {

    const res = await axios.post(
      "http://localhost:8080/api/user/google-login",
      {
        token: credentialResponse.credential,
      },
      {
        withCredentials: true,
      }
    );

    console.log(res.data);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Login Failed")}
    />
  );
}

export default googleLogin;