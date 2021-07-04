module.exports = {
  devServer: {
    port: "81",
    proxy: {
      "/api": {
        target: "http://www.lzuwk.ltd:8000/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/"
        }
      }
    }
  }
};
