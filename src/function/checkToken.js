try {
    const respon = await fetch('http://localhost:4000/api/authentication',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AccessToken}`
            }
        })
    if (respon.status === 401) {

        await refreshAccessToken()


    }
    else {
        sendData(data, AccessToken)
    }
} catch (error) {
   console.log(error)
}
