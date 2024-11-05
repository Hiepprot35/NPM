
const mysql=()=>
{

}
const connection =mysql.createConnection(
    {
        host:process.env.DB_host || 'db4free.net',
        user:process.env.DB_user || 'hiepprot3',
        password:process.env.DB_password||'Tzuyu2407!',
        database:process.env.DB_database ||'hiepprot35',
    }
)
async function connectDatabase()
{
    try {
        await connection.connect();
        console.log("Kết nối  thành công")


    } catch (error) {
        console.log("Kết nối không thành công")
    }
}

module.exports={connection,
    connectDatabase}