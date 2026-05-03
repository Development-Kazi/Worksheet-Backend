import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const cleanUrl = req.originalUrl.split("?")[0].split("#")[0];
    const pathSegments = cleanUrl.split("/").filter(Boolean);

    let dir;

    if (pathSegments.includes("blog")) {
      dir = `./public/images/blog`;
      // dir = `/var/www/html/backend/public/images/blog`;
    } else if (pathSegments.includes("faq")) {
      dir = `./public/images/faq`;
      // dir = `/var/www/html/backend/public/images/faq`;
    } else if (pathSegments.includes("gateway")) {
      dir = `./public/images/paymentGateway`;
      // dir = `/var/www/html/backend/public/images/paymentGateway`;
    } else if (pathSegments.includes("client")) {
      dir = `./public/images/client`;
      // dir = `/var/www/html/backend/public/images/client`;
    } else if (pathSegments.includes("fund")) {
      dir = `./public/images/fund`;
      // dir = `/var/www/html/backend/public/images/fund`;
    } else if (pathSegments.includes("settlement")) {
      dir = `./public/images/settlement`;
      // dir = `/var/www/html/backend/public/images/fund`;
    } else if (pathSegments.includes("uploadPayout")) {
      dir = `./public/files/uploadPayout`;
      // dir = `/var/www/html/backend/public/images/user`;
    } else {
      dir = `./public/images/global`;
      // dir = `/var/www/html/backend/public/images/global`;
    }


    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory recursively
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
