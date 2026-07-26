import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuNUhF0V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { g as Inbox, o as Send } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { t as Spinner } from "./spinner-DMP4BHzT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.questions-fG71vaRl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminQuestions() {
	const qc = useQueryClient();
	const { data: questions = [] } = useQuery({
		queryKey: ["admin-questions"],
		queryFn: async () => {
			const { data, error } = await supabase.from("questions").select("id, subject, body, answer, answered_at, created_at, user_id, lecture_id, lectures(title)").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const reply = useMutation({
		mutationFn: async ({ id, answer }) => {
			const { error } = await supabase.from("questions").update({
				answer,
				answered_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Reply sent");
			qc.invalidateQueries({ queryKey: ["admin-questions"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl text-primary",
				children: "Question Inbox"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Reply directly to your students."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [questions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-10 text-center border-dashed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-10 w-10 mx-auto text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif italic text-muted-foreground",
						children: "No questions yet."
					})]
				}), questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
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
								children: "New"
							})]
						}),
						q.lectures?.title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: ["On: ", q.lectures.title]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm whitespace-pre-wrap",
							children: q.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								placeholder: "Write your reply…",
								defaultValue: q.answer ?? "",
								onChange: (e) => setDrafts({
									...drafts,
									[q.id]: e.target.value
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => {
										const answer = (drafts[q.id] ?? q.answer ?? "").trim();
										if (!answer) return toast.error("Reply cannot be empty");
										reply.mutate({
											id: q.id,
											answer
										});
									},
									disabled: reply.isPending,
									children: [reply.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4 mr-1.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4 mr-1.5" }), q.answer ? "Update reply" : "Send reply"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-xs text-muted-foreground",
							children: new Date(q.created_at).toLocaleString()
						})
					]
				}, q.id))]
			})
		]
	});
}
//#endregion
export { AdminQuestions as component };
