export function getTime(data) {
  const timeSent = new Date(data);
  const date = new Date();
  const result = date.getTime() - timeSent.getTime();
  const hour = Math.floor(result / (1000 * 60 * 60));
  const minute = Math.floor(result / (1000 * 60)) - 60 * hour;
  const second = Math.floor(result / 1000) - 60 * minute;
  const currentDay = timeSent.getDate();
  const currentHours = timeSent.getHours();
  const currentMinutes = timeSent.getMinutes();
  const currentSeconds = timeSent.getSeconds();
  const formatMinute = currentMinutes < 10 ? `0${currentMinutes}` : minute;

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0 (0 - 11)
  const day = date.getUTCDate();
  if (timeSent.getMonth() !== date.getMonth()) {
    return `${currentDay}/${timeSent.getMonth()} ${currentHours}:${currentMinutes}`;
  }
  return `${currentHours}:${formatMinute}`;
}
export function getDate(data) {
  console.log("Nhay vao", data);
  const timeSent = new Date(data);
  const year = timeSent.getUTCFullYear();
  const month = timeSent.getUTCMonth() + 1;
  const day = timeSent.getUTCDate();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  return `${year}-${formattedMonth}-${formattedDay}`;
}
export function countTime(data) {
  const timeSent = new Date(data);
  const date = new Date();
  const result = date.getTime() - timeSent.getTime();
  const hour = Math.floor(result / (1000 * 60 * 60));
  const minute = Math.floor(result / (1000 * 60)) - 60 * hour;
  const second = Math.floor(result / 1000) - 60 * minute;
  const formatMinute = minute < 10 ? `0${minute}` : minute;
  if (hour < 1) {
    return minute >= 1 ? `${formatMinute} phút` : `vừa xong`;
  } else if (hour < 24) {
    return `${hour} giờ`;
  } else {
    return `${Math.floor(hour / 24)} tuần`;
  }
}
export const getNameMonth = (time) => {
  if (time) {
        
    const data = time.split("-");
    let nameMonth;
        
    switch (parseInt(data[1])) {
      case 1:
        nameMonth = "Jan";
        break;
      case 2:
        nameMonth = "Feb";
        break;
      case 3:
        nameMonth = "Mar";
        break;
      case 4:
        nameMonth = "Apr";
        break;
      case 5:
        nameMonth = "May";
        break;
      case 6:
        nameMonth = "Jun";
        break;
      case 7:
        nameMonth = "Jul";
        break;
      case 8:
        nameMonth = "Aug";
        break;
      case 9:
        nameMonth = "Sep";
        break;
      case 10:
        nameMonth = "Oct";
        break;
      case 11:
        nameMonth = "Nov";
        break;
      case 12:
        nameMonth = "Dec";
        break;
      default:
        nameMonth = "Unknown";
    }

    return `${nameMonth} ${data[2]}, ${data[0]}`;
  }
  else{
        return ""
  }
};
