// Employee login. POST checks the username and password against Vercel env
// vars and sets a signed HttpOnly session cookie. DELETE logs out.
import { authConfigured, checkLogin, makeSession, sessionCookie } from "../employees/website-designer-employee/member-projects/bouke/store/employee.mjs";
import { isSameOrigin, json } from "../employees/website-designer-employee/member-projects/bouke/store/http.mjs";

export async function POST(request) {
  if (!isSameOrigin(request.url, request.headers.get("origin"))) return json(403, { error: "Sign in from the BOUKE site." });
  if (!authConfigured()) return json(503, { error: "Employee login is not set up yet." });
  let body = null;
  try { body = JSON.parse((await request.text()).slice(0, 2000)); } catch { body = null; }
  if (!body || !checkLogin(body.username, body.password)) {
    await new Promise((r) => setTimeout(r, 600));
    return json(401, { error: "Wrong username or password." });
  }
  const res = json(200, { ok: true });
  res.headers.append("set-cookie", sessionCookie(makeSession()));
  return res;
}

export async function DELETE() {
  const res = json(200, { ok: true });
  res.headers.append("set-cookie", sessionCookie("", true));
  return res;
}
