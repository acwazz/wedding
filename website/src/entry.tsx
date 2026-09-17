import { render } from "solid-js/web";

import App from "./App";
import "./styles.css";

// production is served as static assets where public/_redirects answers
// /invito with HTTP 307; this covers the dev server and any asset host
// without _redirects support
if (location.pathname === "/invito") {
  location.replace("/");
}

render(App, document.getElementById("root") ?? document.body);
