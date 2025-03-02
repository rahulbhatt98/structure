export const BaseUrl = {
  // API_URL: "https://jobizz.itechnolabs.tech/api/v1/",
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  GOOGLE_KEY: process.env.NEXT_PUBLIC_GOOGLE_KEY,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};

export const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phoneNumber: /^[0-9]{10,15}$/,
};
