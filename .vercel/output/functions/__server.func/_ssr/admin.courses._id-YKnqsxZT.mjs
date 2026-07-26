import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuNUhF0V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { D as ArrowLeft, c as Pencil, i as Trash2, r as Upload, s as Plus, v as FileText } from "../_libs/lucide-react.mjs";
import { t as Route } from "./admin.courses._id-CDsycUfz.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { a as DialogHeader, i as DialogFooter, n as Dialog, o as DialogTitle, r as DialogContent, t as ConfirmDialog } from "./confirm-dialog-ZU0rYC_b.mjs";
import { t as Spinner } from "./spinner-DMP4BHzT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.courses._id-YKnqsxZT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManageCourse() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const { data: course } = useQuery({
		queryKey: ["admin-course", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: lectures = [] } = useQuery({
		queryKey: ["admin-lectures", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("lectures").select("*").eq("course_id", id).order("position");
			if (error) throw error;
			return data;
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		youtube_url: "",
		position: 0
	});
	function openNew() {
		setEditing(null);
		setForm({
			title: "",
			description: "",
			youtube_url: "",
			position: lectures.length
		});
		setOpen(true);
	}
	function openEdit(l) {
		setEditing(l);
		setForm({
			title: l.title,
			description: l.description ?? "",
			youtube_url: l.youtube_url ?? "",
			position: l.position
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				course_id: id,
				title: form.title.trim(),
				description: form.description.trim() || null,
				youtube_url: form.youtube_url.trim() || null,
				position: form.position
			};
			if (editing) {
				const { error } = await supabase.from("lectures").update(payload).eq("id", editing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("lectures").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["admin-lectures", id] });
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (lectureId) => {
			const { error } = await supabase.from("lectures").delete().eq("id", lectureId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin-lectures", id] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin",
				className: "text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " All courses"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl text-primary",
					children: course?.title ?? "Course"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Manage lectures and attached documents."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " New lecture"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [lectures.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LectureRow, {
					lecture: l,
					onEdit: () => openEdit(l),
					onDelete: () => del.mutate(l.id)
				}, l.id)), lectures.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-8 text-center border-dashed text-muted-foreground italic font-serif",
					children: "No lectures yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit lecture" : "New lecture" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.title,
								onChange: (e) => setForm({
									...form,
									title: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "YouTube URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.youtube_url,
								onChange: (e) => setForm({
									...form,
									youtube_url: e.target.value
								}),
								placeholder: "https://youtube.com/watch?v=…"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Position (order)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: form.position,
								onChange: (e) => setForm({
									...form,
									position: Number(e.target.value)
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => save.mutate(),
						disabled: save.isPending || !form.title.trim(),
						children: [save.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }) : null, "Save"]
					})] })
				] })
			})
		]
	});
}
function LectureRow({ lecture, onEdit, onDelete }) {
	const qc = useQueryClient();
	const fileRef = (0, import_react.useRef)(null);
	const { data: docs = [] } = useQuery({
		queryKey: ["admin-docs", lecture.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("lecture_documents").select("*").eq("lecture_id", lecture.id).order("created_at");
			if (error) throw error;
			return data;
		}
	});
	const upload = useMutation({
		mutationFn: async (file) => {
			const path = `${lecture.id}/${Date.now()}-${file.name}`;
			const { error: upErr } = await supabase.storage.from("lecture-docs").upload(path, file);
			if (upErr) throw upErr;
			const { error } = await supabase.from("lecture_documents").insert({
				lecture_id: lecture.id,
				name: file.name,
				storage_path: path,
				size_bytes: file.size
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Uploaded");
			qc.invalidateQueries({ queryKey: ["admin-docs", lecture.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	const delDoc = useMutation({
		mutationFn: async (doc) => {
			await supabase.storage.from("lecture-docs").remove([doc.storage_path]);
			const { error } = await supabase.from("lecture_documents").delete().eq("id", doc.id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-docs", lecture.id] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: ["#", lecture.position]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg text-primary truncate",
						children: lecture.title
					})]
				}), lecture.youtube_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground truncate mt-0.5",
					children: lecture.youtube_url
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: onEdit,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
					title: "Delete this lecture?",
					description: "This will permanently remove the lecture and all its documents.",
					onConfirm: onDelete,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
					})
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 pl-4 border-l-2 border-border/60 space-y-1.5",
			children: [docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate",
						children: d.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "h-7 w-7 p-0",
						onClick: () => delDoc.mutate(d),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-destructive" })
					})
				]
			}, d.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) upload.mutate(f);
					e.target.value = "";
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => fileRef.current?.click(),
				disabled: upload.isPending,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
					" ",
					upload.isPending ? "Uploading…" : "Attach document"
				]
			})] })]
		})]
	});
}
//#endregion
export { ManageCourse as component };
