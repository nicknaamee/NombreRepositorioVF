import { readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
if (!process.env.VERCEL && !process.env.ADMIN_EMAIL) {
  const has = async (f) => {
    try {
      return await readFile(f, "utf8");
    } catch {
      return "";
    }
  };
  const local = await has(".env.local"),
    base = await has(".env");
  if (!/^ADMIN_EMAIL=/m.test(local + "\n" + base)) {
    const email = "admin@duoc.cl",
      clave = randomBytes(5).toString("hex");
    await writeFile(
      ".env.local",
      local + "\nADMIN_EMAIL=" + email + "\nADMIN_PASSWORD=" + clave + "\n",
      { mode: 0o600 },
    );
    console.log(
      "Acceso administrativo local: " +
        email +
        " / " +
        clave +
        " (también está en .env.local).",
    );
  }
}
