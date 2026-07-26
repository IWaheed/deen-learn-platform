import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CuNUhF0V.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { _ as useSearch, g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as BookOpen } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-Bav9nr75.mjs";
import { n as Label, t as Input } from "./label-D2fwATjQ.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BxSmFKrL.mjs";
import { t as Spinner } from "./spinner-DMP4BHzT.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C3L2W1y1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function AuthPage() {
	const search = useSearch({ from: "/auth" });
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [view, setView] = (0, import_react.useState)("signin");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [showVerifyDialog, setShowVerifyDialog] = (0, import_react.useState)(false);
	function passwordScore(pw) {
		let score = 0;
		if (pw.length >= 6) score += 20;
		if (pw.length >= 10) score += 15;
		if (/[a-z]/.test(pw)) score += 15;
		if (/[A-Z]/.test(pw)) score += 15;
		if (/[0-9]/.test(pw)) score += 15;
		if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
		if (score < 30) return {
			label: "Weak",
			color: "bg-destructive",
			pct: Math.max(score, 5)
		};
		if (score < 60) return {
			label: "Fair",
			color: "bg-amber-500",
			pct: score
		};
		if (score < 80) return {
			label: "Good",
			color: "bg-yellow-600",
			pct: score
		};
		return {
			label: "Strong",
			color: "bg-emerald-600",
			pct: score
		};
	}
	const strength = passwordScore(password);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") setView("reset");
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	async function afterAuth() {
		navigate({
			to: search.redirect ?? "/",
			replace: true
		});
	}
	async function signIn() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("As-salāmu ʿalaykum. Welcome back.");
		await afterAuth();
	}
	async function signUp() {
		setLoading(true);
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: window.location.origin,
				data: { full_name: fullName }
			}
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		setShowVerifyDialog(true);
	}
	async function signInGoogle() {
		const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
		if (result.error) return toast.error(result.error.message ?? "Sign-in failed");
		if (result.redirected) return;
		await afterAuth();
	}
	async function forgotPassword() {
		setLoading(true);
		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Check your email for a password reset link.");
		setView("signin");
	}
	async function updatePassword() {
		if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
		setLoading(true);
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Password updated successfully. You may now sign in.");
		setView("signin");
		setNewPassword("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid place-items-center px-6 py-12 bg-parchment",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: showVerifyDialog,
			onOpenChange: setShowVerifyDialog,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Check your email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"We sent a verification link to ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: email }),
				". Please verify your email, then sign in."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => setShowVerifyDialog(false),
				children: "Got it"
			}) })] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md p-8 shadow-scholarly",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-scholarly mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.25em] text-gold ornament",
						children: "Deen Learn Platform"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-serif text-3xl text-primary",
						children: "Enter the halaqah"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Sign in to access the lectures and notes."
					})
				]
			}), view === "reset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Enter your new password below."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: newPassword,
						onChange: (e) => setNewPassword(e.target.value),
						minLength: 6
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: updatePassword,
						disabled: loading,
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }) : null, loading ? "Updating..." : "Update password"]
					})
				]
			}) : view === "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Enter your email and we'll send you a reset link."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: forgotPassword,
						disabled: loading,
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }) : null, loading ? "Sending..." : "Send reset link"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "text-xs text-muted-foreground hover:underline mx-auto block",
						onClick: () => setView("signin"),
						children: "Back to sign in"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: signInGoogle,
					disabled: loading,
					children: "Continue with Google"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 my-5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
						"or",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					value: view,
					onValueChange: (v) => setView(v),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid grid-cols-2 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "signin",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "signup",
								children: "Register"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "signin",
							className: "space-y-3 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full",
									onClick: signIn,
									disabled: loading,
									children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }) : null, "Sign in"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-xs text-muted-foreground hover:underline mx-auto block",
									onClick: () => setView("forgot"),
									children: "Forgot password?"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "signup",
							className: "space-y-3 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fullName,
									onChange: (e) => setFullName(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										minLength: 6
									}),
									password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 w-full bg-muted rounded-full overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full ${strength.color} transition-all duration-300 rounded-full`,
												style: { width: `${strength.pct}%` }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: strength.label
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full",
									onClick: signUp,
									disabled: loading,
									children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }) : null, "Create account"]
								})
							]
						})
					]
				})
			] })]
		})]
	});
}
//#endregion
export { AuthPage as component };
