import axios from "axios";
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("TTT : ", token);
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const data = { token: token };

    const response = await axios.post(
      "http://localhost:4000/api/v1/client/verify-token",
      data,
      {
        headers: {
          auth: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
