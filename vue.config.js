module.exports = {
  devServer: {
    proxy: {
      "^/add-to-cart": {
        target: "http://localhost:3211",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
