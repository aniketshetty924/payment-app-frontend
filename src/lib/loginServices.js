import axios from "axios";
import Cookies from "js-cookie";

export const handleLogin = async (e, loginData) => {
  e.preventDefault();

  try {
    const url = "http://localhost:4000/api/v1/login";
    console.log("O : ", loginData);
    const response = await axios.post(url, loginData);

    console.log("Response : ", response);
    const fullToken = response.data.token;
    const client = response.data.client;
    const token = fullToken.split(" ")[1];
    console.log("TOKEN IS HERE : ", token);
    localStorage.setItem("token", token);
    Cookies.set("token", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    const payloadBase64 = token.split(".")[1];
    const payloadJson = JSON.parse(
      atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
    );

    const isAdmin = payloadJson.isAdmin;
    console.log("Token", token);
    console.log("isAdmin : ", isAdmin);
    console.log("client : ", client);
    return { token, isAdmin, client };
  } catch (error) {
    console.error("Error logging in ", error);
  }
};

export const handleSignUp = async (e, basicInfo, addressInfo, bankDetails) => {
  e.preventDefault();
  const { clientName, founder, username, password, email } = basicInfo;
  const { city, state } = addressInfo;
  const { accountId, businessLicense, gstCertificate } = bankDetails;

  const signUpData = {
    clientName,
    founder,
    username,
    password,
    email,
    city,
    state,
    accountId,
    businessLicense,
    gstCertificate,
  };
  try {
    const url = "http://localhost:4000/api/v1/client-form";

    const response = await axios.post(url, signUpData);
    return response;
  } catch (error) {
    alert("Username already exists...");
  }
};
