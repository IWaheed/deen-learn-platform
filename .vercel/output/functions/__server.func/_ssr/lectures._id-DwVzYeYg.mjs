import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuNUhF0V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { N as notFound, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as ChevronLeft, S as ChevronRight, o as Send, v as FileText, y as Download } from "../_libs/lucide-react.mjs";
import { n as useAuth, t as SiteHeader } from "./site-header-DUNEZ_tR.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { t as Spinner } from "./spinner-DMP4BHzT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SiteFooter } from "./site-footer-SnomvQNS.mjs";
import { i as LecturePageSkeleton, t as AnimateIn } from "./skeleton-CvLIESYw.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BM6ADng7.mjs";
import { t as Route } from "./lectures._id-DLNKpQ9c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lectures._id-DwVzYeYg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function extractYouTubeId(url) {
	if (!url) return null;
	const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
	return m ? m[1] : null;
}
function LecturePage() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const { user } = useAuth();
	const { data: lecture, isLoading } = useQuery({
		queryKey: ["lecture", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("lectures").select("id, title, description, youtube_url, course_id, position, courses(slug, title)").eq("id", id).maybeSingle();
			if (error) throw error;
			if (!data) throw notFound();
			return data;
		}
	});
	const { data: allLectures = [] } = useQuery({
		queryKey: ["lectures", lecture?.course_id],
		enabled: !!lecture?.course_id,
		queryFn: async () => {
			const { data, error } = await supabase.from("lectures").select("id, title, position").eq("course_id", lecture.course_id).order("position", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
	const { data: docs = [] } = useQuery({
		queryKey: ["lecture-docs", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("lecture_documents").select("id, name, storage_path, size_bytes").eq("lecture_id", id).order("created_at");
			if (error) throw error;
			return data;
		}
	});
	const currentIndex = allLectures.findIndex((l) => l.id === id);
	const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
	const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;
	const videoId = extractYouTubeId(lecture?.youtube_url);
	async function download(path, name) {
		const { data, error } = await supabase.storage.from("lecture-docs").createSignedUrl(path, 60);
		if (error) return toast.error(error.message);
		const a = document.createElement("a");
		a.href = data.signedUrl;
		a.download = name;
		a.click();
	}
	const [subject, setSubject] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const ask = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Sign in required");
			const { error } = await supabase.from("questions").insert({
				user_id: user.id,
				lecture_id: id,
				subject: subject.trim(),
				body: body.trim()
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Your question has been sent to the teacher.");
			setSubject("");
			setBody("");
			qc.invalidateQueries({ queryKey: ["my-questions"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 mx-auto max-w-4xl px-6 py-10 w-full",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LecturePageSkeleton, {}) : lecture ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { crumbs: [
						{
							label: "Home",
							to: "/"
						},
						{
							label: lecture.courses?.title ?? "Course",
							to: "/courses/$slug",
							params: { slug: lecture.courses?.slug }
						},
						{ label: lecture.title }
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimateIn, {
						animation: "fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Lecture ", lecture.position] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-px bg-gold/50" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-3xl md:text-4xl text-primary leading-tight",
								children: lecture.title
							}),
							lecture.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-muted-foreground leading-relaxed",
								children: lecture.description
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						animation: "fade-in",
						delay: 100,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 aspect-video rounded-xl overflow-hidden border border-border/60 shadow-scholarly bg-black",
							children: videoId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								className: "w-full h-full",
								src: `https://www.youtube.com/embed/${videoId}?rel=0`,
								title: lecture.title,
								allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
								allowFullScreen: true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-full grid place-items-center text-muted-foreground",
								children: "No video attached yet."
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						animation: "fade-in",
						delay: 150,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center justify-between gap-4",
							children: [prevLecture ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/lectures/$id",
									params: { id: prevLecture.id },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 mr-1" }),
										" ",
										prevLecture.title
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), nextLecture ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/lectures/$id",
									params: { id: nextLecture.id },
									children: [
										nextLecture.title,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 ml-1" })
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						animation: "fade-in",
						delay: 200,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Course notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-px bg-gold/50" })]
							}), docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "p-6 border-dashed text-center text-muted-foreground italic font-serif",
								children: "No documents attached to this lecture."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-3 flex items-center gap-3 transition-all hover:shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-primary shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-sm font-medium",
												children: d.name
											}), d.size_bytes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [(d.size_bytes / 1024).toFixed(0), " KB"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => download(d.storage_path, d.name),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
										})
									]
								}, d.id))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						animation: "fade-in",
						delay: 250,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-14",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ask the teacher" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-px bg-gold/50" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-serif text-2xl text-primary",
									children: "Have a question on this lecture?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: "Your question is private, sent directly to the shaykh."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "mt-4 p-5 space-y-3 bg-card/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: subject,
											onChange: (e) => setSubject(e.target.value),
											placeholder: "e.g. Regarding the second condition of ṭahārah",
											maxLength: 200
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Your question" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											rows: 5,
											value: body,
											onChange: (e) => setBody(e.target.value),
											maxLength: 2e3
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: () => ask.mutate(),
												disabled: ask.isPending || !subject.trim() || !body.trim(),
												className: "shadow-scholarly",
												children: [ask.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4 mr-1.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-1.5" }), "Send question"]
											})
										})
									]
								})
							]
						})
					})
				] }) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { LecturePage as component };
