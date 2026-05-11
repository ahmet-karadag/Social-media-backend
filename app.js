const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use('/api/messages', require('./routes/message'));
app.use('/api/posts', require('./routes/post'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
