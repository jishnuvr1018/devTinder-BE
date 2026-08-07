const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dbConnect = async () => {
  await mongoose.connect(
    "mongodb+srv://jishnuvr1018_db_user:bTe8zttecq1wuM5z@devtinder.sfmatvm.mongodb.net/devtinder",
  );
};

module.exports = { dbConnect };
