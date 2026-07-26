import { t as supabase } from "./client-CuNUhF0V.mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/courses._slug-puorL67q.js
var $$splitComponentImporter = () => import("./courses._slug-Bz0W_kyH.mjs");
var Route = createFileRoute("/courses/$slug")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title ? `${loaderData.title} — Deen Learn Platform` : "Course — Deen Learn Platform" }, {
		name: "description",
		content: loaderData?.description ?? "Study classical Islamic sciences with recorded lectures."
	}] }),
	loader: async ({ params }) => {
		const { data } = await supabase.from("courses").select("title, description").eq("slug", params.slug).maybeSingle();
		return data ?? void 0;
	}
});
//#endregion
export { Route as t };
