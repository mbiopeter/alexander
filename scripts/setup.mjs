import { copyFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
try {
  await copyFile(
    path.join(projectDirectory, ".env.example"),
    path.join(projectDirectory, ".env.local"),
    constants.COPYFILE_EXCL,
  );
  console.log(
    "Created .env.local. Add your WhatsApp username or fallback number, Paystack payment page, TikTok profile, and code runner settings.",
  );
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log(".env.local already exists; your settings were kept.");
}
console.log(
  "Add your deployed site URL for sharing metadata. Run npm run check:config when ready.",
);
