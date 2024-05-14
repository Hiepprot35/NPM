export function getTime(data) {
  const timeSent = new Date(parseInt(data));
  const currentHours = timeSent.getHours();
  const currentMinutes = timeSent.getMinutes();
  
  const formatMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;

  return `${currentHours}:${formatMinutes}`;
}
export function timeFilm(data)
{
  const hours=Math.floor(data/60)
  const minutes=data-hours*60;
  return `${hours}h ${minutes}m`
}
export function getDate(data) {
  const timeSent = new Date(parseInt(data));
  const year = timeSent.getUTCFullYear();
  const month = timeSent.getUTCMonth() + 1;
  const day = timeSent.getUTCDate();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  return `${year}-${formattedMonth}-${formattedDay}`;
}
export function detaiData(data)
{
  const timeSent = new Date(data);

}
export function countDownToNow(startTimeMillis) {
  const currentTimeMillis = new Date().getTime();
  const timeDifferenceMillis = currentTimeMillis - startTimeMillis;
  const oneDayMillis = 24 * 60 * 60 * 1000;

  // Tính số ngày còn lại
  const daysRemaining = Math.floor((oneDayMillis - timeDifferenceMillis) / (24 * 60 * 60 * 1000));

  // Nếu còn ít hơn 1 ngày, in ra giờ và phút
  if (daysRemaining < 1) {
      const hours = Math.floor((oneDayMillis - timeDifferenceMillis) / (60 * 60 * 1000));
      const minutes = Math.floor(((oneDayMillis - timeDifferenceMillis) % (60 * 60 * 1000)) / (60 * 1000));
      return `${hours} giờ ${minutes} phút`;
  }

  // Nếu còn nhiều hơn 1 ngày, in ra số ngày còn lại
  return `${daysRemaining} ngày`;
}
export function countTime(data) {
  const timeSent = new Date(parseInt(data));
  const date = new Date();
  const hour =-timeSent.getHours()+date.getHours()
  const minute = -timeSent.getMinutes()+date.getMinutes()
  const second = -timeSent.getSeconds()+date.getSeconds()
  if (hour < 1) {
    return minute >= 1 ? `${minute} phút` : `vừa xong`;
  } else if (hour < 24) {
    return `${hour} giờ`;
  } else if(-timeSent.getDate()+date.getDate()>1) {
    return `${timeSent.getDate()+date.getDate()} ngày`;
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
