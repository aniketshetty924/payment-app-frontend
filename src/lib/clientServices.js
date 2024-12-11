import { verifyToken } from "@/utils/verifyToken";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const getClientById = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login in.");
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/client/${clientId}`;
    const response = await axios.get(url, {
      headers: { auth: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllEmployees = async (filters) => {
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN : ", token);
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    console.log(filters);
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/all-employee/client/${clientId}`;

    const response = await axios.get(url, {
      headers: { auth: `Bearer ${token}` },
      params: filters,
    });

    return response;
  } catch (error) {
    console.error("Error fetching employees : ", error);
  }
};

export const getAllEmployeesPaymentRequestsPerMonth = async (paymentMonth) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/emp-payment-month/client/${clientId}`;
    console.log("HEllo : ", paymentMonth);
    const response = await axios.get(url, {
      params: { paymentMonth },
      headers: { auth: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error fetching emp per month: ", error);
    throw error;
  }
};
export const getAllDealersPaymentRequestByMonth = async (paymentMonth) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/dealer-payment-month/client/${clientId}`;

    const response = await axios.get(url, {
      params: { paymentMonth },
      headers: { auth: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error fetching emp per month: ", error);
    throw error;
  }
};

export const getAllDealers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/all-dealer/client/${clientId}`;
    const response = await axios.get(url, {
      headers: { auth: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error fetching dealers : ", error);
  }
};
export const getAllBanks = async () => {
  try {
    const url = `http://localhost:4000/api/v1/bank`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching banks : ", error);
  }
};

export const createEmployee = async (data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    console.log("Here is : ", data);
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/employee/client/${clientId}`;
    const response = await axios.post(url, data, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating employee : ", error);
  }
};

export const uploadEmployeesCSV = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/csv-employee/upload/client/${clientId}`;

    // Log FormData before sending to check it's populated
    formData.forEach((value, key) => {
      console.log(`Sending FormData: ${key} =`, value); // Logs the file object properly
      if (value instanceof File) {
        console.log("File details:", {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      }
    });

    const response = await axios.post(url, formData, {
      headers: {
        auth: `Bearer ${token}`,
        // No need to set Content-Type manually, axios will handle it
      },
    });

    return response;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    throw error;
  }
};

export const createDealer = async (data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/dealer/client/${clientId}`;
    const response = await axios.post(url, data, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating dealer : ", error);
  }
};

export const saveEmployeePaymentsForAdminReview = async (paymentDetails) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/payment/client/${clientId}`;

    const data = {
      paymentDetails: paymentDetails.map((payment) => ({
        ...payment,
        paymentType: "employee",
      })),
    };
    console.log("Here is the data : ", data);

    const response = await axios.post(url, data, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving payments for admin review: ", error);
    throw error;
  }
};

export const saveDealerPaymentsForAdminReview = async (paymentDetails) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/payment/client/${clientId}`;

    const data = {
      paymentDetails: paymentDetails.map((payment) => ({
        ...payment,
        paymentType: "dealer",
      })),
    };
    console.log("Here is the data : ", data);

    const response = await axios.post(url, data, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving payments for admin review: ", error);
    throw error;
  }
};

export const getDealerPaymentReportByMonth = async (paymentMonth) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/report-dealer/client/${clientId}/payment-month/${paymentMonth}`;
    console.log("PM : ", paymentMonth);

    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    console.log("Res : ", response);
    return response;
  } catch (error) {
    console.error("Error getting dealer payment report by month: ", error);
    throw error;
  }
};
export const getEmployeePaymentReportByMonth = async (paymentMonth) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    console.log("PM : ", paymentMonth);
    const tokenData = await verifyToken();
    const clientId = tokenData.id;
    const url = `http://localhost:4000/api/v1/report-emp/client/${clientId}/payment-month/${paymentMonth}`;

    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    console.log("Res : ", response);
    return response;
  } catch (error) {
    console.error("Error getting dealer payment report by month: ", error);
    throw error;
  }
};
