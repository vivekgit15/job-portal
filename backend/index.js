require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes'); 
const jobRoutes = require('./routes/job.route')
const connectDB = require('./config/db');
const protect = require('./middlewares/auth');
const applicationRoutes = require('./routes/application.routes')
const fileUpload = require("express-fileupload");  
const userRoutes = require("./routes/user.routes");

const cors = require('cors')   


app.use(cors())

app.use(fileUpload({
  useTempFiles: true
}));


connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs' , jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use("/api/user" , userRoutes)
// app.use(fileUpload({
//   useTempFiles:true
// }))


app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server is running on', PORT);
});
