import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { S as SiteHeader, B as BackButton, a as SiteFooter } from "./back-button-PLK58KB_.mjs";
import { c as cn } from "./router-CaL1rPwL.mjs";
function PageShell({
  children,
  className,
  showBack,
  backFallback = "/"
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shouldShowBack = showBack ?? pathname !== "/";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex min-h-screen flex-col bg-background", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1", children: [
      shouldShowBack ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-app pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BackButton, { fallbackTo: backFallback }) }) : null,
      children
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
  ] });
}
function LegalLayout({
  title,
  updated,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container-app pb-20 pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Legal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-serif text-5xl", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
      "Last updated: ",
      updated
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose-legal mt-12 max-w-3xl space-y-6 text-foreground/85 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1", children })
  ] }) });
}
export {
  LegalLayout as L,
  PageShell as P
};
