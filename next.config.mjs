/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
};
export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
<<<<<<< HEAD
})(nextConfig);
=======
})(nextConfig);
>>>>>>> 409e7a230da1e951078457dcf441fc737f56423d
