export function getTime(data) {
  const timeSent = new Date(parseInt(data));
  const timeNew=new Date(Date.now())
  
  const currentHours = timeSent.getHours();
  const currentMinutes = timeSent.getMinutes();
  
  const formatMinutes = currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes;
  return `${currentHours}:${formatMinutes}`;
}
const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
    
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export function getWeekdays(data) {
  const time = new Date(parseInt(data));
  const weekday = days[time.getDay()];
  return weekday;
}
export function cauculatorTime(data)
{
  const int=parseInt(data)
  const m=Math.floor(int/60)
  const h=Math.floor(m/60)

  if(int<60)
    {
      return `0 : ${data}s`
    }
  else{
    if(m<60)
      {
        return `${m}m : ${int-m*60}s`
      }
      if(h>0)
        {
          return `${h}h:${m-h*60}m : ${int-h*60*60-m*60}`
        }
  }
}
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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

  const diffInSeconds = Math.floor((date - timeSent) / 1000);
  const hour = Math.floor(diffInSeconds / 3600);
  const minute = Math.floor((diffInSeconds % 3600) / 60);
  const second = diffInSeconds % 60;

  if (hour < 1) {
    if (minute >= 1) {
      return `${minute} minutes`;
    } else {
      return `vừa xong`;
    }
  } else if (hour < 24) {
    return `${hour} hours`;
  } else {
    const day = Math.floor(hour / 24);
    return `${day}d`;
  }
}
export const Month=(time)=>{
  let nameMonth;
  switch (parseInt(time)) {
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
  }
  return nameMonth
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
