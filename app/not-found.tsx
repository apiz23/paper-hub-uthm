import Link from "next/link";
import React from "react";

export default function NotFound() {
	return (
		<>
			<div className="flex justify-center items-center px-4 min-h-screen">
				<div className="text-center">
					<h1 className="text-9xl font-black text-gray-700 dark:text-gray-200">
						404
					</h1>

					<p className="text-2xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
						Uh-oh!
					</p>
					<p className="mt-4 text-gray-500">We can&apos;t find that page.</p>

					<Link
						href="/"
						className="mt-6 inline-block rounded bg-red-500 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring"
					>
						Go Back Home
					</Link>
				</div>
			</div>
		</>
	);
}
