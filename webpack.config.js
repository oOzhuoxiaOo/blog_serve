const path = require('path');

module.exports = {
  entry: {
    "wpk-login":'./static/web/user/auth/login/login.js',
    "wpk-register":'./static/web/user/auth/register/register.js',
    "wpk-resetPassword":'./static/web/user/auth/resetPassword/resetPassword.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};