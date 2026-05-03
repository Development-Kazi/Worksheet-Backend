// utils/saveUserAgent.js
const saveUserAgent = (modelInstance, userAgentDetails) => {
  if (!modelInstance) {
    throw new Error("Model instance is required.");
  }
  if (!userAgentDetails) {
    throw new Error("User agent details are required.");
  }

  let entryFrom = "unknown";

  switch (userAgentDetails.osType) {
    case "Android":
      entryFrom = "android";
      break;
    case "iOS":
      entryFrom = "ios";
      break;
    case "MacOS":
      entryFrom = "web";
      break;
    case "Windows":
      entryFrom = "web";
      break;
    default:
      entryFrom = "unknown";
  }

  if (userAgentDetails.deviceType === "Desktop") {
    entryFrom = "web";
  }

  // Attach userAgent details to the document
  modelInstance.entryFrom = entryFrom;
  modelInstance.userAgent = userAgentDetails; // Assuming you have a field named userAgent in your model
};

export { saveUserAgent };
