module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1337", // Cố định network ID = 1337
      gas: 29000000, // Giảm xuống 29M
      gasPrice: 0 // Set về 0 để không cần ETH
    }
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1  // Giảm runs xuống 1 để giảm contract size tối đa
        },
        viaIR: true  // Sửa lỗi Stack too deep
      }
    },
  },
};
