const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
//const allowedOrigin = "http://localhost:5174";
app.use(
  cors({
    origin: true,           // Allow all origins
    credentials: true,      // Allow credentials (cookies, authorization headers)
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(bodyParser.json());


app.use("/uploads", express.static("uploads"));

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const headerContactRoutes = require("./routes/headerContactRoutes");
const socialContactRoutes = require("./routes/SocialContactRoute");
const testimonialRoutes = require("./routes/testimonialRoutes");
// const infrastructureRoutes = require("./routes/infrastructureRoute");
// const carrousalRoutes = require('./routes/carrousalRoutes');
const homeSliderRoutes = require('./routes/homeSliderRoutes');
const uploadCVRoutes = require('./routes/uploadCVRoutes');
// const contactPersonRoutes = require('./routes/contactPersonRoutes');
// const officeRoutes = require('./routes/officeRoutes');
const carousalFormRoutes = require('./routes/carousalFormRoutes');
// const requestCallbackFormRoutes = require('./routes/requestCallbackFormRoutes');
// const subscribeRoutes = require('./routes/subscribeRoutes');
// const getInTouchRoutes = require('./routes/getInTouchRoutes');
// const productNameRoutes = require('./routes/productNameRoutes');
// const productDetailsRoutes = require('./routes/productDetailsRoutes');
// const technicalDataRoutes = require('./routes/technicalDataRoutes');
// const optionsDataRoutes = require('./routes/optionsDataRoutes');
// const materialDataRoutes = require('./routes/materialDataRoutes');
// const productAggregateRoutes = require('./routes/productAggregateRoutes');
// const blogDetailRoutes = require('./routes/blogDetailRoutes');
// const newsRoutes = require('./routes/newsRoutes');
const teamRoutes = require('./routes/teamRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const OueleadersRoutes = require('./routes/OueleadersRoutes');

// const ApplicationRoutes = require('./routes/ApplicationDataRoutes');
// const productImagesRouter = require('./routes/productImagesRoutes')
// const leadershipRoutes = require('./routes/leadershipRoutes');
// const about = require('./routes/aboutRoutes');

// new modearch api
const categoryRoutes = require('./routes/categoryRoutes');
// const projectNameRoutes = require('./routes/projectNameRoutes');
const projectDetailsRoutes = require('./routes/projectDetailsRoutes');
const projectDetailsWithImagesRoutes = require('./routes/projectDetailsWithImagesRoutes')
const galleryDetailsRoutes = require('./routes/galleryDetailsRoutes');
const galleryImagesRoutes = require('./routes/galleryImagesRoutes')
// app.use("/uploads", express.static("uploads"));

// app.use('/about', about);
// app.use('/leadership', leadershipRoutes);
app.use('/team', teamRoutes);
// app.use('/news', newsRoutes);
// app.use('/events', eventRoutes);
// app.use('/OueleadersRoutes', OueleadersRoutes);
// app.use('/blogdetails', blogDetailRoutes);
// app.use('/productdetails', productDetailsRoutes);
// app.use('/productname', productNameRoutes);
// app.use('/getintouch', getInTouchRoutes);
// app.use('/subscribe', subscribeRoutes);
// app.use('/requestcallbackform', requestCallbackFormRoutes);
app.use('/carousal-form', carousalFormRoutes);
// app.use('/office', officeRoutes);
// app.use('/contactperson', contactPersonRoutes);
app.use("/auth", authRoutes);
app.use("/header-contact", headerContactRoutes);
app.use("/social-contact", socialContactRoutes);
app.use("/testimonials", testimonialRoutes);
// app.use("/infrastructure", infrastructureRoutes);
// app.use('/carrousal', carrousalRoutes);
app.use('/homeslider', homeSliderRoutes);
app.use('/uploadcv', uploadCVRoutes);
// app.use('/technicalData', technicalDataRoutes);
// app.use('/optionsData', optionsDataRoutes);
// app.use('/applicationData',ApplicationRoutes);
// app.use('/materialData', materialDataRoutes);
// app.use('/productAggregate', productAggregateRoutes);
// app.use('/productImages', productImagesRouter);

// new modearch api
app.use('/category', categoryRoutes);
// app.use('/projectName', projectNameRoutes);
app.use('/projectDetails', projectDetailsRoutes);
app.use('/projectDetailsWithImages',projectDetailsWithImagesRoutes)
app.use('/galleryDetails',galleryDetailsRoutes)
app.use('/galleryImages',galleryImagesRoutes)

// Test DB connection
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");
    await sequelize.sync(); // Ensure the database and model are in sync
  } catch (err) {
    console.error("Error: " + err);
  }
};

app.use(express.urlencoded({ extended: true })); // Handles URL-encoded data

// Initialize the application
const init = async () => {
  await testDbConnection();
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};

init();

app.get("/", (req, res) => {
  res.send("server start");
});
