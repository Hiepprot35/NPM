
export const getConversation = async (auth,token) => {
    const URL = `${process.env.REACT_APP_DB_HOST}/api/conversations/${auth.userID}`;
    try {
      const res = await fetch(URL, {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch conversation data. Status: ${res.status}`);
      }
  
    const respon = await res.json();
    return respon;
    } catch (error) {
      console.error("Error in getConversation:", error.message);
    
      return { error: error.message };
    }
  };
  