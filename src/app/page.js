"use client";
import { useState, useRef, useEffect } from "react";
import data from "./data.json";

export default function Home() {
	const [emailAddress, setEmailAddress] = useState("");
	const [subject, setSubject] = useState(data.subject);
	const [content, setContent] = useState(data.content);
	const [attachedFile, setAttachedFile] = useState(null);
	const contentRef = useRef(null);
	const fileInputRef = useRef(null);

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

		const formData = new FormData();
		formData.append("emails", JSON.stringify(emails));
		formData.append("subject", subject);
		formData.append("content", content);
		if (attachedFile) {
			formData.append("file", attachedFile);
		}

		const res = await fetch("/api/send", {
			method: "POST",
			body: formData,
		});
		const result = await res.json();
		console.log(result);

		// Clear email input and attached file
		setEmailAddress("");
		setAttachedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";

		// Show success/failure summary
		if (result.sent.length) {
			alert(
				`✅ Sent to: ${result.sent.join(", ")}${result.failed.length ? `\n❌ Failed: ${result.failed.map((f) => f.email).join(", ")}` : ""}`,
			);
		} else {
			alert(
				`❌ All failed: ${result.failed.map((f) => f.email).join(", ")}`,
			);
		}
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

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 16,
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<input
						type="file"
						ref={fileInputRef}
						style={{ display: "none" }}
						onChange={(e) =>
							setAttachedFile(e.target.files[0] || null)
						}
					/>
					<button
						onClick={() => fileInputRef.current.click()}
						style={{
							padding: "8px 16px",
							fontSize: 14,
							cursor: "pointer",
						}}
					>
						📎 Attach File
					</button>
					<span
						style={{
							fontSize: 13,
							color: attachedFile ? "#333" : "#999",
						}}
					>
						{attachedFile ? attachedFile.name : "No file attached"}
					</span>
				</div>

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
		</div>
	);
}
