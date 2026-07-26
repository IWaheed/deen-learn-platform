import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-footer-SnomvQNS.js
var import_jsx_runtime = require_jsx_runtime();
function getHijriDate() {
	const date = /* @__PURE__ */ new Date();
	return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(date);
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border/60 mt-24 relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "gold-divider absolute -top-px left-1/2 -translate-x-1/2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-6 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-serif italic text-center md:text-left",
					children: ["“Seeking knowledge is an obligation upon every Muslim.”", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground/60 mt-1",
						children: "— Ibn Mājah, 224"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center md:items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-arabic text-sm leading-relaxed",
							dir: "rtl",
							children: getHijriDate()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Deen Learn Platform"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/terms",
									className: "hover:text-foreground transition-colors",
									children: "Terms"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-border",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy",
									className: "hover:text-foreground transition-colors",
									children: "Privacy"
								})
							]
						})
					]
				})]
			})
		})]
	});
}
//#endregion
export { SiteFooter as t };
