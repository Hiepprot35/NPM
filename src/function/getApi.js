export const getUserinfobyID = async (data) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_DB_HOST}/api/username?id=${data}`);
        const data2 = await res.json();
      return data2[0]
      } catch (err) {
        console.log("Không có giá trí");
    }
};
export async function getStudentInfoByMSSV(data) {
    if (data) {
        const URL2 = `${process.env.REACT_APP_DB_HOST}/api/getStudentbyID/${data}`;
        try {
            const studentApi = await fetch(URL2);
            const student = await studentApi.json();
            return student;
          } catch (error) {
            console.error(error);
        }
    }
}