import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PASS,
	},
});

export async function POST(req) {
	const { emails, subject, content } = await req.json();

	const results = { sent: [], failed: [] };

	for (let i = 0; i < emails.length; i++) {
		try {
			await transporter.sendMail({
				from: process.env.GMAIL_USER,
				to: emails[i],
				subject,
				html: content.replace(/\n/g, "<br>"),
				attachments: [
					{
						filename: "Fatima_Momin_Resume.pdf",
						path: path.join(process.cwd(), "public", "resume.pdf"),
					},
				],
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
