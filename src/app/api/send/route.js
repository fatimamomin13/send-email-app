import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587, // try 587 (TLS) instead of 465 (SSL)
	secure: false, // true for 465, false for 587
	family: 4,
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PASS,
	},
});

export async function POST(req) {
	const formData = await req.formData();

	const emails = JSON.parse(formData.get("emails"));
	const subject = formData.get("subject");
	const content = formData.get("content");
	const file = formData.get("file"); // File | null

	let attachments;
	if (file && file.size > 0) {
		const buffer = Buffer.from(await file.arrayBuffer());
		attachments = [{ filename: file.name, content: buffer }];
	} else {
		attachments = [
			{
				filename: "Fatima_Momin_Resume.pdf",
				path: path.join(process.cwd(), "public", "resume.pdf"),
			},
		];
	}

	const results = { sent: [], failed: [] };

	for (let i = 0; i < emails.length; i++) {
		try {
			await transporter.sendMail({
				from: process.env.GMAIL_USER,
				to: emails[i],
				subject,
				html: content.replace(/\n/g, "<br>"),
				attachments,
			});
			results.sent.push(emails[i]);
			console.log(`✓ Sent to ${emails[i]}`);

			if (i < emails.length - 1) {
				await new Promise((r) => setTimeout(r, 2000));
			}
		} catch (err) {
			console.error(`✗ Failed ${emails[i]}:`, err.message);
			results.failed.push({ email: emails[i], error: err.message });
		}
	}

	return Response.json(results);
}
