// import UseRefresh from "./hook/useRefresh"
// import { useState } from 'react';

// export const TestComponent = () => {
//   const refresh = UseRefresh();
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [refreshedToken, setRefreshedToken] = useState('');

//   const handleRefreshClick = async () => {
//     try {
//       setIsRefreshing(true);
//       const newAccessToken = await refresh();
//       setRefreshedToken(newAccessToken);
//     } catch (error) {
//      console.log('Error:', error.message);
//       // Xử lý lỗi, ví dụ hiển thị thông báo lỗi cho người dùng
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleRefreshClick} disabled={isRefreshing}>
//         {isRefreshing ? 'Refreshing...' : 'Click to Refresh'}
//       </button>
//       {refreshedToken && <div>New AccessToken: {refreshedToken}</div>}
//     </div>
//   );
// };
