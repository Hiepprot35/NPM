
export const getConversation = async (auth,token) => {
    const URL = `${process.env.REACT_APP_DB_HOST}/api/conversations`;
    try {
      const res = await fetch(URL, {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log(res,"resssssssssssssssssss")
      if (!res.ok) {
        return []
      }
  
    const respon = await res.json();
    return respon;
    } catch (error) {
      return []
    }
  };
  