// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     ['/messages', '/media'],
//     createProxyMiddleware({
//       target: 'http://anotsenimzhizn.ru/',
//       changeOrigin: true,
//       onProxyReq: (proxyReq, req, res) => {
//         console.log('Проксирование запроса:', req.method, req.path);
//       },
//     })
//   );
// };
