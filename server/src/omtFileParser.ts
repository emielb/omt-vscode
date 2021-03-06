import * as fs from "fs";
import { CheckFileResult, CheckTextResult } from "./types";

// pattern capturing only the name of the declaration
const moduleNamePattern = /^moduleName: (\w+)(?:\s|\s#.*)?$/;

/**
 * Parse an OMT text and look for certain properties, like if it contains a module definition.
 * @param text The text of an OMT file
 */
export function parseOmtText(text: string): CheckTextResult {
    const match = new RegExp(moduleNamePattern, 'gm').exec(text);
    return match ?
        {
            module: {
                name: match[1]
            }
        } : {};
}

/**
 * Reads a file from the filesystem and returns an information object about the OMT.
 * @returns A promise that resolves with a `CheckFileResult` or rejects when an error occurred.
 * @param uri the path to the file
 */
export function parseOmtFile(uri: string): Promise<CheckFileResult> {
    return new Promise((resolve, reject) => {
        fs.readFile(uri, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const result: CheckFileResult = {
                    path: uri,
                    ...parseOmtText(data)
                };
                resolve(result);
            }
        });
    });
}
