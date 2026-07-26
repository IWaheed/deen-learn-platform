import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuNUhF0V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { T as BookOpen, c as Pencil, i as Trash2, s as Plus } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { a as DialogHeader, i as DialogFooter, n as Dialog, o as DialogTitle, r as DialogContent, t as ConfirmDialog } from "./confirm-dialog-ZU0rYC_b.mjs";
import { t as Spinner } from "./spinner-DMP4BHzT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-C6u1e4vH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function slugify(s) {
	return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}
function AdminCourses() {
	const qc = useQueryClient();
	const { data: courses = [] } = useQuery({
		queryKey: ["admin-courses"],
		queryFn: async () => {
			const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		slug: "",
		description: "",
		cover_url: "",
		is_published: true
	});
	function openNew() {
		setEditing(null);
		setForm({
			title: "",
			slug: "",
			description: "",
			cover_url: "",
			is_published: true
		});
		setOpen(true);
	}
	function openEdit(c) {
		setEditing(c);
		setForm({
			title: c.title,
			slug: c.slug,
			description: c.description ?? "",
			cover_url: c.cover_url ?? "",
			is_published: c.is_published
		});
		setOpen(true);
	}
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				title: form.title.trim(),
				slug: (form.slug || slugify(form.title)).trim(),
				description: form.description.trim() || null,
				cover_url: form.cover_url.trim() || null,
				is_published: form.is_published
			};
			if (editing) {
				const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("courses").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["admin-courses"] });
			qc.invalidateQueries({ queryKey: ["courses", "published"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("courses").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: ["admin-courses"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl text-primary",
					children: "Courses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Create, edit, and organise your curriculum."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " New course"]
				})]
			}),
			courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-12 text-center border-dashed",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-10 w-10 mx-auto text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-serif italic text-muted-foreground",
					children: "No courses yet. Click “New course” to start."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-2 gap-4",
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-xl text-primary truncate",
										children: c.title
									}), !c.is_published && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground",
										children: "Draft"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: ["/", c.slug]
								}),
								c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground line-clamp-2",
									children: c.description
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/courses/$id",
									params: { id: c.id },
									children: "Manage lectures"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => openEdit(c),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
								title: `Delete "${c.title}"?`,
								description: "This will permanently remove the course and all its lectures.",
								onConfirm: () => del.mutate(c.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							})
						]
					})]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit course" : "New course" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.title,
								onChange: (e) => setForm({
									...form,
									title: e.target.value,
									slug: form.slug || slugify(e.target.value)
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "URL slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.slug,
								onChange: (e) => setForm({
									...form,
									slug: e.target.value
								}),
								placeholder: "e.g. fiqh-of-worship"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cover image URL (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.cover_url,
								onChange: (e) => setForm({
									...form,
									cover_url: e.target.value
								}),
								placeholder: "https://…"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: form.is_published,
									onCheckedChange: (v) => setForm({
										...form,
										is_published: v
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Published" })]
							})
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
//#endregion
export { AdminCourses as component };
