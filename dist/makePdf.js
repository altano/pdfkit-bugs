import Pdf from "pdfkit";
import { dir } from "tmp-promise";
import { join } from "node:path";
import { createWriteStream } from "node:fs";
export class MakePdf {
    fontSize;
    lineHeight;
    text;
    font;
    maxWidth;
    maxHeight;
    name;
    includeLineGap;
    #pdf;
    constructor(fontSize, lineHeight, text, font, maxWidth, maxHeight, name, includeLineGap) {
        this.fontSize = fontSize;
        this.lineHeight = lineHeight;
        this.text = text;
        this.font = font;
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.name = name;
        this.includeLineGap = includeLineGap;
        this.#pdf = new Pdf({
            font: this.font,
            size: [this.maxWidth, this.maxHeight],
            margin: 0,
        });
        this.#pdf.fontSize(this.fontSize);
        this.#pdf.text(this.text, this.#getTextOptions(this.fontSize));
        // Draw a rect as given by widthOfString/HeightOfString
        const width = this.#pdf.widthOfString(this.text, this.#getTextOptions(this.fontSize));
        const height = this.#pdf.heightOfString(this.text, this.#getTextOptions(this.fontSize));
        this.#pdf.rect(0, 0, width, height).stroke("red");
    }
    /**
     * PDFKit does a whacky line-height calculation that looks very different than
     * the browser. let's figure out what the difference is and then create a
     * negative lineGap to compensate and match the browser. the variable here is
     * the given line-height * the curent font size.
     */
    #getLineGap(fontSize) {
        const desiredLineHeight = this.lineHeight;
        const adjustedLineHeight = desiredLineHeight * fontSize;
        const lineHeight = this.#pdf.currentLineHeight(false);
        const lineGap = -1 * (lineHeight - adjustedLineHeight);
        return lineGap;
    }
    #getTextOptions(fontSize) {
        return {
            width: this.maxWidth,
            align: "left",
            lineGap: this.includeLineGap ? this.#getLineGap(fontSize) : undefined,
            indent: 0,
        };
    }
    async save() {
        const tempDir = await dir();
        const filename = join(tempDir.path, `${this.name}${this.includeLineGap ? "--with-negative-line-gap" : "--no-line-gap"}.pdf`);
        return new Promise((resolve) => {
            const stream = this.#pdf.pipe(createWriteStream(filename));
            stream.on("finish", () => resolve(filename));
            this.#pdf.end();
        });
    }
}
