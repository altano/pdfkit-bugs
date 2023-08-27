import { MakePdf } from "./makePdf.js";
import open from "open";

async function createTestPdf(
  font: string,
  name: string,
  includeLineGap: boolean
) {
  const make = new MakePdf(
    149,
    1,
    "Hello I'm a thing",
    font,
    800,
    400,
    name,
    includeLineGap
  );
  const path = await make.save();
  console.log(`[${name}] Wrote ${path}. Opening...`);
  open(path);
}

// First do Helvetica
await createTestPdf("Helvetica", "Helvetica", false);

// Then do Inter-SemiBold
await createTestPdf("fonts/Inter-SemiBold.ttf", "Inter", false);
await createTestPdf("fonts/Inter-SemiBold.ttf", "Inter", true);

console.log(`Done.`);
