const { spaceChildren } = require("antd/es/button");

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        zIndex:{
          '9999':'9999'
        },
        spacing:{
          '75vh':'75vh',
          '30vh':'30vh'
        }
      },
    },
    important:true,
    plugins: [],
  };
  