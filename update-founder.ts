import { saveDbPageSettings, getDbPageSettings } from "./lib/db";

async function main() {
  const current = await getDbPageSettings("founder_settings");
  current.portraitImage = "/images/founder/Heroimage.jpeg";
  await saveDbPageSettings("founder_settings", current);

  const about = await getDbPageSettings("about_settings");
  about.portraitImage = "/images/founder/Heroimage.jpeg";
  await saveDbPageSettings("about_settings", about);
  
  console.log("Updated DB settings.");
}
main();
