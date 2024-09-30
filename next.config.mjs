/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
	images: {
		domains: ["upload.wikimedia.org", "www.uthm.edu.my"],
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "https://jg160007-api.vercel.app/:path*",
			},
		];
	},
};

export default withPWA({
	dest: "public",
})(nextConfig);
