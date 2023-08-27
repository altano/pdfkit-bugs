export declare class MakePdf {
    #private;
    private fontSize;
    private lineHeight;
    private text;
    private font;
    private maxWidth;
    private maxHeight;
    private name;
    private includeLineGap;
    constructor(fontSize: number, lineHeight: number, text: string, font: string, maxWidth: number, maxHeight: number, name: string, includeLineGap: boolean);
    save(): Promise<string>;
}
