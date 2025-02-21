"use client";

import { useState, useEffect, useRef } from "react";
import FlaggedNote from "../components/home/FlaggedNote";
import {
	PhoneArrowUpRightIcon,
	PhoneArrowDownLeftIcon,
	HeartIcon,
	HomeIcon,
	UserGroupIcon,
	BookmarkIcon,
	MicrophoneIcon,
	CogIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import AudioStreamer from "../components/home/AudioStreamer";
import SiriCircle from "../components/home/SiriCircle";

const navigation = [
	{ name: "Home", href: "/home", icon: HomeIcon, current: true },
	{ name: "Family", href: "/family", icon: HeartIcon, current: false },
	{
		name: "Saved Notes",
		href: "/bookmarks",
		icon: BookmarkIcon,
		current: false,
	},
	{ name: "Settings", href: "/settings", icon: CogIcon, current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Example() {
	const [isRecording, setIsRecording] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [audioContext, setAudioContext] = useState(null);
	const [mediaStream, setMediaStream] = useState(null);
	const recognitionRef = useRef(null);
	const [micIconAnimation, setMicIconAnimation] = useState(false);

	useEffect(() => {
		if (!("webkitSpeechRecognition" in window)) {
			alert(
				"Your browser does not support speech recognition. Please use Chrome or Edge."
			);
			return;
		}

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		recognitionRef.current = new SpeechRecognition();
		recognitionRef.current.continuous = true;
		recognitionRef.current.interimResults = true;
		recognitionRef.current.lang = "en-US";

		recognitionRef.current.onresult = (event) => {
			let interimTranscript = "";
			let finalTranscript = "";
			for (let i = event.resultIndex; i < event.results.length; ++i) {
				const transcriptChunk = event.results[i][0].transcript;
				if (event.results[i].isFinal) {
					finalTranscript += transcriptChunk;
				} else {
					interimTranscript += transcriptChunk;
				}
			}
			setTranscript(finalTranscript + interimTranscript);
		};

		recognitionRef.current.onerror = (event) => {
			console.error("Speech recognition error detected: " + event.error);
		};
	}, []);

	const toggleRecording = async () => {
		try {
      setIsRecording((prev) => !prev);
			const response = await fetch("http://localhost:8080/outbound", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phoneNumberId: "8fb2f4e9-b671-4de6-88c9-5ec10cc7a153",
					assistantId: "94b06c6e-2e7e-44fb-bb97-3aa1aa58eb6e",
					customerNumber: "+14437211597",
				}),
			});
      // +14437211597

			if (response.ok) {
				alert("Call Sent!");
			} else {
				alert(`Error: ${errorData.error}`);
			}
		} catch (error) {
			alert("An unexpected error occurred.");
		}
	};

	return (
		<>
			<div className="flex h-screen text-neutral-700">
				{/* Desktop Sidebar */}
				<div className="flex flex-col min-w-64">
					<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
						<div className="flex h-16 items-center justify-center pt-5">
							<Image
								src="/deer-image.avif"
								alt="Your Company"
								width={56}
								height={56}
								className="h-12 w-auto rounded-md"
							/>
						</div>
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-1">
										{navigation.map((item) => (
											<li key={item.name}>
												<a
													href={item.href}
													className={classNames(
														item.current
															? "bg-gray-50 text-slate-900"
															: "text-gray-700 hover:bg-gray-50 hover:text-slate-900",
														"group flex gap-x-3 rounded-md p-6 text-sm font-semibold leading-6"
													)}
												>
													<item.icon
														aria-hidden="true"
														className={classNames(
															item.current
																? "text-slate-900"
																: "text-gray-400 group-hover:text-slate-900",
															"h-6 w-6 shrink-0"
														)}
													/>
													{item.name}
												</a>
											</li>
										))}
									</ul>
								</li>

								<li className="hidden -mx-6 mt-auto">
									<a
										href="#"
										className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
									>
										<Image
											src="/advait.jpeg"
											alt=""
											width={32}
											height={32}
											className="h-8 w-8 rounded-full bg-gray-50"
										/>
										<span className="sr-only">Your profile</span>
										<span aria-hidden="true">Joe Biden</span>
									</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				{/* Content Area 1 */}
				<div className="w-1/2 min-h-screen flex flex-col items-center justify-between p-10 bg-[#F5F7F8]">
					<div className="w-full text-start flex justify-between">
						<h1 className="text-2xl font-bold">Start a Call!</h1>
					</div>

					<div className="w-1/2 flex-grow flex-col flex items-center justify-center">
						<button
							className={`rounded-full bg-transparent border-4 h-36 w-36 flex items-center justify-center ${
								isRecording ? "text-red-500 border-red-500 hover:bg-red-500 hover:text-white" : "text-green-500 border border-green-500 hover:text-white hover:bg-green-500"
							} ${micIconAnimation ? "animate-bounce" : ""}`}
							onClick={toggleRecording}
							aria-label={isRecording ? "Stop Recording" : "Start Recording"}
						>
							{isRecording ? (
								<PhoneArrowDownLeftIcon className="h-24 w-24" />
							) : (
								<PhoneArrowUpRightIcon className="h-24 w-24" />
							)}
						</button>
						<h1 className="pt-16 font-bold">
							{transcript && isRecording
								? `"${transcript}"`
								: "Click the icon to start the call"}
						</h1>
					</div>
					<div className="h-20"></div>
				</div>

				{/* Content Area 2 */}
				<div className="w-1/2 flex flex-col items-center border-l">
					<div className="p-10">
						<h1 className="text-2xl font-bold mb-4">Conversation Notes</h1>
						<FlaggedNote
							title="Raj does not remember Kshitij"
							description="Raj has mentioned not remembering Kshitij. Preparing Kshitij's voice next."
						/>
						<FlaggedNote
							title="Raj does not remember graduating High School"
							description="Raj has mentioned not remembering graduating High School."
						/>
						<FlaggedNote
							title="Raj does not remember Jessica"
							description="Raj has mentioned not remembering Jessica. Preparing Jessica's voice next."
						/>
					</div>
				</div>
			</div>
		</>
	);
}
