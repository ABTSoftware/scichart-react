import * as path from "path";
import { TExport, generateTypedExportsFile, getFiles, writeAllAsNamedExports } from "./module-parsing-utils";

(async function main() {
    const prefixPath = process.cwd();
    // console.log("prefixPath", prefixPath);
    const folderName = prefixPath.split(path.sep).pop();
    // console.log("folderName", folderName);
    const rootFolderPath = prefixPath;
    // console.log("rootFolderPath", rootFolderPath);
    const sourcesDir = path.join(rootFolderPath, "src");

    // console.log("filesDir", sourcesDir);
    const files = await getFiles(sourcesDir, rootFolderPath);
    // console.log("files.length", files.length);
    // console.log("files", files);
    const allExports: TExport[] = [];
    for (const fileName of files) {
        // console.log("Timestamp", Date.now());
        generateTypedExportsFile(allExports, fileName);
    }
    // console.log("allExports", allExports);

    const outputFileName = "src/index.ts";
    const relativePathPrefix = ".";

    writeAllAsNamedExports(allExports, outputFileName, sourcesDir.length, relativePathPrefix);
})();
