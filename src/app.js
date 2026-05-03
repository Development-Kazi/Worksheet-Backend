import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
// import dotenv from "dotenv";
// import Redis from "ioredis";
// dotenv.config();

// const redis = new Redis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   tls: {},
// });
//

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
const upload = multer();
// app.use(upload.none());
// app.use("/v1", upload.none(), (req, res, next) => {
//     next();
// });
//routes import
import adminRouter from "./routes/admin.routes.js";
import categoryRouter from "./routes/category.routes.js";
import sitePageRouter from "./routes/sitePage.routes.js";
import worksheetRouter from "./routes/worksheet.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import clientRouter from "./routes/client.routes.js";

app.use("/", (req, res, next) => {
  let userAgent = req.headers["user-agent"];

  // Regular expressions to check for mobile devices and OS types
  let isMobile = /mobile/i.test(userAgent);
  let isAndroid = /android/i.test(userAgent);
  let isIOS = /iphone|ipad|ipod/i.test(userAgent);
  let isMac = /macintosh/i.test(userAgent);
  let isWindows = /windows/i.test(userAgent);

  let deviceType = isMobile ? "Mobile" : "Desktop";
  let osType = "Unknown";

  if (isAndroid) {
    osType = "Android";
  } else if (isIOS) {
    osType = "iOS";
  } else if (isMac) {
    osType = "MacOS";
  } else if (isWindows) {
    osType = "Windows";
  }
  const xForwardedFor = req.headers["x-forwarded-for"];
  const realIp = xForwardedFor
    ? xForwardedFor.split(",")[0].trim() // FIRST IP = REAL USER
    : req.ip;

  req.userAgent = {
    userAgent,
    deviceType,
    osType,
    ip: req.ip,
    cf: req.headers["cf-connecting-ip"],
    realIp: realIp,
  };

  next();
});

// Route to check user agent details
app.use("/healthCheck", async (req, res) => {
  let userAgent = req.userAgent;

  function generateUpiIntentUri({
    payeeVpa,
    payeeName,
    transactionNote,
    amount,
    currency = "INR",
  }) {
    const baseUri = `upi://pay`;
    const queryParams = new URLSearchParams({
      pa: payeeVpa, // Payee VPA
      pn: payeeName, // Payee Name
      tn: transactionNote, // Transaction Note
      am: amount.toString(), // Amount
      cu: currency, // Currency
    });

    return `${baseUri}?${queryParams.toString()}`;
  }

  let Qr = generateUpiIntentUri({
    payeeVpa: "techno36880@fbl",
    payeeName: "TechPay",
    transactionNote: "Payment for services",
    amount: 10,
    currency: "INR",
  });

  res.status(200).json({
    success: true,
    message: "Server is running",
    data: userAgent,
    QR: Qr,
  });
});

app.use("/v1/admin", upload.none(), adminRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/site-page", sitePageRouter);
app.use("/v1/worksheet", worksheetRouter);
app.use("/v1/upload", uploadRouter);
app.use("/v1/client", clientRouter);

export { app };
