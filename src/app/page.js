"use client";
import { useState, useRef, useEffect } from "react";
import data from "./data.json";

export default function Home() {
	const [emailAddress, setEmailAddress] = useState("");
	const [subject, setSubject] = useState(data.subject);
	const [content, setContent] = useState(data.content);
	const contentRef = useRef(null);

	useEffect(() => {
		const el = contentRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = el.scrollHeight + "px";
		}
	}, [content]);

	const handleClick = async () => {
		const emails = emailAddress
			.split(",")
			.map((e) => e.trim())
			.filter(Boolean);
		console.log(emails);

		const res = await fetch("/api/send", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ emails, subject, content }),
		});
		const result = await res.json();
		console.log(result);
	};

	return (
		<div
			style={{
				maxWidth: 600,
				margin: "40px auto",
				padding: "0 20px",
				fontFamily: "sans-serif",
			}}
		>
			<h2>HR Mailer</h2>

			<label>Emails (comma separated)</label>
			<input
				type="text"
				placeholder="hr@company1.com, hr@company2.com"
				value={emailAddress}
				onChange={(e) => setEmailAddress(e.target.value)}
				style={{
					width: "100%",
					padding: 10,
					marginBottom: 16,
					fontSize: 14,
				}}
			/>

			<label>Subject</label>
			<input
				type="text"
				value={subject}
				onChange={(e) => setSubject(e.target.value)}
				style={{
					width: "100%",
					padding: 10,
					marginBottom: 16,
					fontSize: 14,
				}}
			/>

			<label>Content</label>
			<textarea
				ref={contentRef}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				style={{
					width: "100%",
					padding: 10,
					marginBottom: 16,
					fontSize: 14,
					resize: "none",
					overflow: "hidden",
					lineHeight: 1.6,
				}}
			/>

			<button
				onClick={handleClick}
				style={{
					padding: "10px 24px",
					fontSize: 14,
					cursor: "pointer",
				}}
			>
				Send Email
			</button>
		</div>
	);
}
