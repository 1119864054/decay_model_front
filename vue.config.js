module.exports = {
  devServer: {
    port: "81",
    proxy: {
      "/api": {
        target: "http://www.lzuwk.ltd:8000/",
        // target: "http://127.0.0.1:8000/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  }
};
