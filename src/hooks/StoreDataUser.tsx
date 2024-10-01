import { auth } from "../utils/Firebase";

const storeUserData = async (userId: string, userData: any) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const token = await user.getIdToken();

    const response = await fetch(
      `https://rolereact-f4a63-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to store user data");
    }

    const data = await response.json();
    console.log("User data stored successfully:", data);
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export default storeUserData;
