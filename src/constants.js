import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const ChangeStream_MAX_RETRIES = 3;
export const ObjectIdValidate = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "xxx",
    pass: "xxx",
  },
});

export const sendMail = (mailOptions) => {
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error("Failed to send mail");
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send mail");
  }
};

export function DateFilterQuery(query, startDate, endDate) {
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  } else if (startDate) {
    query.createdAt = {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(startDate).setHours(23, 59, 59, 999)),
    };
  } else if (endDate) {
    query.createdAt = {
      $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }
}

export function DateTimeFilterQuery(query, startDate, endDate) {
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(new Date(startDate)),
      $lt: new Date(new Date(endDate)),
    };
  } else if (startDate) {
    query.createdAt = {
      $gte: new Date(new Date(startDate)),
      $lt: new Date(new Date(startDate)),
    };
  } else if (endDate) {
    query.createdAt = {
      $lt: new Date(new Date(endDate)),
    };
  }
}

export const AllStatus = ["active", "inactive", "deleted"];
export const AllEntryFrom = ["web", "android", "ios", "unknown"];

// forwarding
export const calculateFeesTaxes = (commissionRange, amount) => {
  let fees = 0;
  let taxes = 0;
  commissionRange.details.map((rangeDetails, index) => {
    if (amount >= rangeDetails.min && amount <= rangeDetails.max) {
      if (rangeDetails.type == "amount") {
        fees = rangeDetails.amount;
        taxes = (commissionRange.gst / 100) * fees;
      } else if (rangeDetails.type == "percentage") {
        fees = (rangeDetails.amount / 100) * amount;
        taxes = (commissionRange.gst / 100) * fees;
      }
    }
  });
  if (fees === 0 && taxes === 0) {
    return {
      fees: 0.0,
      taxes: 0.0,
    };
  }

  if (!fees || fees < 0 || !taxes || taxes < 0) {
    return null;
  }

  return {
    fees: parseFloat(fees.toFixed(2)),
    taxes: parseFloat(taxes.toFixed(2)),
  };
};

export function generateRandomDigits(length) {
  let randomDigits = "";
  for (let i = 0; i < length; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  return randomDigits;
}
