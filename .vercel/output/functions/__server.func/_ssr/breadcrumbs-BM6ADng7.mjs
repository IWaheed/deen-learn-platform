import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/breadcrumbs-BM6ADng7.js
var import_jsx_runtime = require_jsx_runtime();
function Breadcrumbs({ crumbs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-4",
		"aria-label": "Breadcrumb",
		children: crumbs.map((crumb, i) => {
			const isLast = i === crumbs.length - 1;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }), isLast || !crumb.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: isLast ? "text-foreground font-medium" : "",
					children: crumb.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: crumb.to,
					params: crumb.params,
					className: "hover:text-foreground transition-colors",
					children: crumb.label
				})]
			}, i);
		})
	});
}
//#endregion
export { Breadcrumbs as t };
