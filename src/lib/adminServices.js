import axios from "axios";

export const getAllSubmittedClientForms = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    const url = "http://localhost:4000/api/v1/all-client-form";
    const response = await axios.get(url, {
      headers: { auth: `Bearer ${token}` },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log("Error fetching client forms...");
  }
};

export const createClient = async (clientData) => {
  try {
    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = "http://localhost:4000/api/v1/client-client";

    const response = await axios.post(url, clientData, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });

    console.log("Client created successfully", response.data);

    if (response.data === true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Error creating client:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};

export const updateClientFormStatus = async (username, status, adminNote) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/client/form-status/${username}`;

    const response = await axios.put(
      url,
      { status, adminNote },
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );

    console.log("Client form status updated successfully", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating client form status:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export const getAllPendingEmployeesPaymentRequest = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/pending-emp`;

    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};
export const getAllPendingDealersPaymentRequest = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/pending-dealer`;

    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getClientById = async (clientId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/client/${clientId}`;

    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getBalance = async (clientAccountId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/acc-balance/account/${clientAccountId}`;
    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const processPayments = async (clientId, paymentsToProcess) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    console.log("PTP : ", paymentsToProcess);

    const url = `http://localhost:4000/api/v1/process-payment/client/${clientId}`;
    const response = await axios.post(
      url,
      { paymentsToProcess },
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response: ", response); // Log the response
    return response;
  } catch (error) {
    console.error("Error in processPayments:", error);
    throw error;
  }
};

export const getAllClients = async (filters) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/all-client`;
    const response = await axios.get(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
      params: filters,
    });
    console.log("RES : ", response.data);
    return response;
  } catch (error) {
    console.log("Error in getting all clients : ", error);
  }
};

export const updateClientById = async (clientId, parameter, value) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/client/${clientId}`;
    console.log("Para", parameter);
    console.log("VALUE:", value);
    const response = await axios.put(
      url,
      { parameter, value },
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("error in updating client : ", error);
  }
};

export const deleteClientById = async (clientId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const url = `http://localhost:4000/api/v1/client/${clientId}`;
    const response = await axios.delete(url, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    console.log("RES", response.data);
    return response;
  } catch (error) {
    console.log("error in deleting client : ", error);
  }
};
