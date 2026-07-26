import { t as supabase } from "./client-CuNUhF0V.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { N as notFound, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { p as Lock, x as CirclePlay } from "../_libs/lucide-react.mjs";
import { n as useAuth, t as SiteHeader } from "./site-header-DUNEZ_tR.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Route } from "./courses._slug-puorL67q.mjs";
import { t as SiteFooter } from "./site-footer-SnomvQNS.mjs";
import { r as LectureListSkeleton, t as AnimateIn } from "./skeleton-CvLIESYw.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BM6ADng7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._slug-Bz0W_kyH.js
var import_jsx_runtime = require_jsx_runtime();
function CoursePage() {
	const { slug } = Route.useParams();
	const { user, loading } = useAuth();
	const { data: course, isLoading: courseLoading } = useQuery({
		queryKey: ["course", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("courses").select("id, title, description, cover_url, is_published").eq("slug", slug).maybeSingle();
			if (error) throw error;
			if (!data) throw notFound();
			return data;
		}
	});
	const { data: lectures = [], isLoading: lecturesLoading } = useQuery({
		queryKey: ["lectures", course?.id],
		enabled: !!course?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("lectures").select("id, title, description, position").eq("course_id", course.id).order("position", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto max-w-4xl px-6 py-12 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { crumbs: [{
						label: "Home",
						to: "/"
					}, { label: course?.title ?? "Course" }] }),
					courseLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-24 rounded-md" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-12 w-3/4 rounded-md" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-6 w-1/2 rounded-md" })
						]
					}) : course ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimateIn, {
						animation: "fade-in",
						children: [
							course.cover_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-video rounded-xl overflow-hidden mb-8 border border-border/60 shadow-scholarly",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: course.cover_url,
									alt: "",
									className: "w-full h-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Course" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-px bg-gold/50" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-serif text-4xl md:text-5xl text-primary leading-tight",
								children: course.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-3 mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-xs",
									children: [
										lectures.length,
										" ",
										lectures.length === 1 ? "lecture" : "lectures"
									]
								})
							}),
							course.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl",
								children: course.description
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							animation: "fade-in",
							delay: 100,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-2xl text-primary mb-4",
								children: "Lectures"
							})
						}), lecturesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LectureListSkeleton, { count: 5 }) : lectures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-8 text-center border-dashed text-muted-foreground italic font-serif",
							children: "No lectures yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: lectures.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
								animation: "fade-in",
								delay: i * 80,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-5 flex items-center gap-4 bg-card/70 hover:bg-card transition-all hover:shadow-md group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center font-serif text-sm font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors",
											children: i + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-lg leading-snug",
												children: l.title
											}), l.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm text-muted-foreground line-clamp-1 mt-0.5",
												children: l.description
											})]
										}),
										user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "secondary",
											className: "shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/lectures/$id",
												params: { id: l.id },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-4 w-4 mr-1.5" }), " Watch"]
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											disabled: loading,
											className: "shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/auth",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 mr-1.5" }), "Sign in"]
											})
										})
									]
								})
							}, l.id))
						})]
					}),
					course && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
						animation: "fade-in",
						delay: 200,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "mt-10 p-8 bg-gradient-to-br from-primary/5 to-gold/5 border-primary/20 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gold-divider mb-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-serif text-lg text-primary",
									children: "Create a free account to watch the lectures and download the notes."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "mt-4 shadow-scholarly",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/auth",
										children: "Sign in or register"
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { CoursePage as component };
