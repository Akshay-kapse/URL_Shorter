import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";

export default async function RedirectPage({ params }) {
	const { shorturl } = params;

	if (!shorturl) {
		notFound();
	}

	await connectDB();

	const urlDoc = await Url.findOneAndUpdate(
		{ short_code: shorturl },
		{
			$inc: { visit_count: 1 },
			$set: { updatedAt: new Date() },
		},
		{ new: true }
	);

	if (!urlDoc) {
		notFound();
	}

	if (process.env.NODE_ENV === "development") {
		console.log(`Redirecting ${shorturl} to: ${urlDoc.original_url}`);
	}

	redirect(urlDoc.original_url);

}