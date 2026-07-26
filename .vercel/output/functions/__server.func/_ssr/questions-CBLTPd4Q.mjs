import { t as supabase } from "./client-CuNUhF0V.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as SiteHeader } from "./site-header-DUNEZ_tR.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as SiteFooter } from "./site-footer-SnomvQNS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/questions-CBLTPd4Q.js
var import_jsx_runtime = require_jsx_runtime();
function QuestionsPage() {
	const { data: questions = [] } = useQuery({
		queryKey: ["my-questions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("questions").select("id, subject, body, answer, answered_at, created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto max-w-3xl px-6 py-10 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.25em] text-gold ornament",
						children: "Correspondence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-4xl text-primary",
						children: "My Questions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Your private conversations with the teacher."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 space-y-4",
						children: questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-10 text-center border-dashed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-10 w-10 mx-auto text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-serif italic text-muted-foreground",
								children: "You haven’t asked anything yet. Open a lecture to send your first question."
							})]
						}) : questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-lg text-primary",
										children: q.subject
									}), q.answer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-primary/10 text-primary hover:bg-primary/10",
										children: "Answered"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										children: "Awaiting reply"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground whitespace-pre-wrap",
									children: q.body
								}),
								q.answer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pl-4 border-l-2 border-gold/60 bg-parchment/50 p-3 rounded-r",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-wider text-gold mb-1",
										children: "Teacher’s reply"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm whitespace-pre-wrap",
										children: q.answer
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-xs text-muted-foreground",
									children: new Date(q.created_at).toLocaleString()
								})
							]
						}, q.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { QuestionsPage as component };
