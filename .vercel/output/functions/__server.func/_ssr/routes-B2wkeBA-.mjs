import { t as supabase } from "./client-CuNUhF0V.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as BookOpen, _ as GraduationCap, h as ListOrdered, u as MessageCircle, x as CirclePlay } from "../_libs/lucide-react.mjs";
import { n as useAuth, t as SiteHeader } from "./site-header-DUNEZ_tR.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as SiteFooter } from "./site-footer-SnomvQNS.mjs";
import { n as CourseCardSkeleton, t as AnimateIn } from "./skeleton-CvLIESYw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B2wkeBA-.js
var import_jsx_runtime = require_jsx_runtime();
var hero_default = "/assets/hero-B8mTzODb.jpg";
function Index() {
	const { user } = useAuth();
	const { data: courses = [], isLoading } = useQuery({
		queryKey: ["courses", "published"],
		queryFn: async () => {
			const { data, error } = await supabase.from("courses").select("id, slug, title, description, cover_url, created_at").eq("is_published", true).order("created_at", { ascending: false });
			if (error) throw error;
			return await Promise.all((data ?? []).map(async (c) => {
				const { count } = await supabase.from("lectures").select("*", {
					count: "exact",
					head: true
				}).eq("course_id", c.id);
				return {
					...c,
					lecture_count: count ?? 0
				};
			}));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 -z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: hero_default,
										alt: "",
										className: "w-full h-full object-cover object-center opacity-35",
										width: 1600,
										height: 900
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "geometric-pattern absolute inset-0 -z-10" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto max-w-6xl px-6 py-24 md:py-36",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
									animation: "fade-in",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "max-w-2xl",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs uppercase tracking-[0.25em] text-gold font-medium",
												children: "Traditional knowledge, digitally delivered"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
												className: "mt-6 font-serif text-5xl md:text-7xl leading-[1.05] text-primary",
												children: [
													"Sit at the feet of",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
													"the scholars."
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed",
												children: "Recorded lectures, downloadable notes, and direct correspondence with your teacher — a complete madrasah, wherever you are."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-8 flex flex-wrap gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "lg",
													className: "shadow-scholarly",
													onClick: () => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" }),
													children: "Browse courses"
												}), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													size: "lg",
													variant: "outline",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/questions",
														children: "My questions"
													})
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													size: "lg",
													variant: "outline",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/auth",
														children: "Sign in to study"
													})
												})]
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gold-divider" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-6",
						children: [
							{
								icon: CirclePlay,
								title: "Recorded lectures",
								body: "Every session is preserved — revisit and review at your own pace."
							},
							{
								icon: BookOpen,
								title: "Course notes",
								body: "Downloadable PDFs and companion documents for every lecture."
							},
							{
								icon: MessageCircle,
								title: "Ask the teacher",
								body: "Send private questions and receive a reply directly from the shaykh."
							}
						].map(({ icon: Icon, title, body }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							animation: "fade-in",
							delay: i * 150,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-6 bg-card/60 border-border/60 shadow-scholarly h-full transition-all hover:shadow-lg hover:-translate-y-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-serif text-xl text-primary",
										children: title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground leading-relaxed",
										children: body
									})
								]
							})
						}, title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "courses",
						className: "mx-auto max-w-6xl px-6 py-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							animation: "fade-in",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-[0.25em] text-gold ornament",
										children: "The Curriculum"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-3 font-serif text-4xl md:text-5xl text-primary",
										children: "Our Courses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gold-divider mt-4" })
								]
							})
						}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
							children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseCardSkeleton, {}, i))
						}) : courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
							animation: "scale-in",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-12 text-center border-dashed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-10 w-10 mx-auto text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-muted-foreground font-serif italic text-lg",
									children: "Courses will appear here soon, in shā’ Allāh."
								})]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
							children: courses.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimateIn, {
								animation: "fade-in",
								delay: i * 100,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/courses/$slug",
									params: { slug: c.slug },
									className: "group block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
										className: "overflow-hidden h-full bg-card border-border/60 shadow-scholarly transition-all hover:shadow-xl hover:-translate-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "aspect-video bg-gradient-to-br from-primary/10 to-gold/15 relative overflow-hidden",
											children: [c.cover_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: c.cover_url,
												alt: "",
												className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
												loading: "lazy"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "absolute inset-0 grid place-items-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-10 w-10 text-primary/30" })
											}), c.lecture_count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-xs gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, { className: "h-3 w-3" }),
													c.lecture_count,
													" ",
													c.lecture_count === 1 ? "lecture" : "lectures"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-serif text-xl text-primary group-hover:text-primary/80 transition-colors",
												children: c.title
											}), c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed",
												children: c.description
											})]
										})]
									})
								})
							}, c.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Index as component };
