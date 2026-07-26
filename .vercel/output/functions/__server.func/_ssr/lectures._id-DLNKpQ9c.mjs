import { t as supabase } from "./client-CuNUhF0V.mjs";
import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lectures._id-DLNKpQ9c.js
var $$splitComponentImporter = () => import("./lectures._id-DwVzYeYg.mjs");
var Route = createFileRoute("/_authenticated/lectures/$id")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async ({ params }) => {
		const { data } = await supabase.from("lectures").select("title, courses(title)").eq("id", params.id).maybeSingle();
		return data;
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData?.title ? `${loaderData.title} — Deen Learn Platform` : "Lecture — Deen Learn Platform" }, {
		name: "description",
		content: `Lecture: ${loaderData?.title ?? ""} — part of ${loaderData?.courses?.title ?? "Deen Learn Platform"}`
	}] })
});
//#endregion
export { Route as t };
