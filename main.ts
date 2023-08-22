// Example
// deno run --allow-read --allow-write main.ts ../flash-2308211824.xml ../results

import type { AnkiCardData, PlecoCard, PlecoResponse } from "./types.ts";
import { parse } from "https://deno.land/x/xml/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.199.0/fs/ensure_dir.ts";
import { convert } from "./pinyin_converter.ts";

const [inFile, outDir = "./"] = Deno.args;

const text = await Deno.readTextFile(inFile);

// deno-lint-ignore no-explicit-any
const xml: PlecoResponse = parse(text) as any;
const cards = xml.plecoflash.cards.card;

const categoryExports: {
  [categoryName: string]: AnkiCardData[];
} = {};

cards.forEach((card: PlecoCard) => {
  const { headword, pron, defn: definition } = card.entry;
  const data: AnkiCardData = {
    pinyin: convert(pron["#text"]),
    definition,
    simplifiedText: headword.find((h) => h["@charset"] == "sc")?.["#text"],
    traditionalText: headword.find((h) => h["@charset"] == "tc")?.["#text"],
  };

  const categories = [card.catassign].flat()
    .map((catassign) => catassign["@category"]);
  categories.forEach((category) => {
    categoryExports[category] = categoryExports[category] || [];
    categoryExports[category].push(data);
  });
});

const respPromises = Object.keys(categoryExports)
  .map(async (categoryName: string) => {
    const tsvText = cardsToTSV(categoryExports[categoryName]);
    await ensureDir(
      join(outDir, categoryName.split("/").slice(0, -1).join("/")),
    );
    return Deno.writeTextFile(join(outDir, `${categoryName}.tsv`), tsvText);
  });

await Promise.all(respPromises);
console.log("complete");

function format(str: string): string {
  return str.replace(/\t/g, " ").replace(/\n/g, " <br/> ");
}

function cardsToTSV(cards: AnkiCardData[]): string {
  let str = "traditionalText\tsimplifiedText\tpinyin\tdefinition\n";
  cards.forEach((card: AnkiCardData) => {
    const { definition, pinyin, simplifiedText, traditionalText } = card;
    const sub = [
      format(traditionalText || ""),
      format(simplifiedText || ""),
      format(pinyin || ""),
      format(definition || ""),
    ].join("\t");
    str += `${sub}\n`;
  });
  return str;
}
