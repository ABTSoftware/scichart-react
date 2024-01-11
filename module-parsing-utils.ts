import { appendFileSync, promises, readFileSync, writeFileSync } from "fs";
import * as path from "path";
import * as ts from "typescript";
import { Statement } from "typescript";

const IGNORE_DIRS: string[] = ["src/stories"];

const IGNORE_FILES: string[] = ["src/index.ts", "src/utils.ts", "src/constants.ts"];

const IGNORE_FILE_NAMES: string[] = [];

export type TExport = {
    path: string;
    exportName: string;
};

export async function getFiles(pathUrl: string, rootFolderPath: string) {
    const entries = await promises.readdir(pathUrl, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(file => {
            // console.log("file", file);
            // console.log("file.name", file.name);
            const filePath = path.join(pathUrl, file.name);
            const isIgnoredFile = IGNORE_FILES.some(ignoredFile => {
                // console.log("ignoredPath", path.join(rootFolderPath, ignoredPath));
                // console.log("filePath", filePath);
                return path.join(rootFolderPath, ignoredFile) === filePath;
            });
            // console.log("isIgnoredFile", isIgnoredFile);
            const isIgnoredDir = IGNORE_DIRS.some(ignoredDir => {
                // console.log("CHILD", filePath);
                // console.log("PARENT", path.join(rootFolderPath, ignoredDir));
                return isChildOf(filePath, path.join(rootFolderPath, ignoredDir));
            });
            // console.log("isIgnoredDir", isIgnoredDir);
            const isIgnoredFileName = IGNORE_FILE_NAMES.some(ignoredFileName => ignoredFileName === file.name);
            // console.log("isIgnoredFileName", isIgnoredFileName);
            const fileExtension = path.extname(file.name).toLowerCase();
            const isExtensionTs = fileExtension === ".ts" || fileExtension === ".tsx";
            // console.log("isExtensionTs", file.name, isExtensionTs);
            // console.log("file.isDirectory()", file.isDirectory());
            return !isIgnoredFile && !isIgnoredDir && !isIgnoredFileName && isExtensionTs && !file.isDirectory();
        })
        .map(file => path.join(pathUrl, file.name));

    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    // Add the found files within the subdirectory to the files array
    for (const folder of folders) {
        files.push(...(await getFiles(path.join(pathUrl, folder.name), rootFolderPath)));
    }

    return files;
}

export function generateTypedExportsFile(allExports: TExport[], fileName: string) {
    // console.log(fileName);
    const sourceFile: ts.SourceFile = ts.createSourceFile(
        fileName,
        readFileSync(fileName).toString(),
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    );
    sourceFile.statements.forEach(statement => {
        // console.log("statement.kind", statement.kind);
        let name = "";
        if (ts.isFunctionDeclaration(statement)) {
            // console.log("isFunctionDeclaration");
            name = statement.name!.text;
        } else if (ts.isVariableStatement(statement)) {
            // console.log("isVariableStatement");
            name = statement!.declarationList.declarations[0].name.getText(sourceFile);
        } else if (ts.isClassDeclaration(statement)) {
            // console.log("isClassDeclaration");
            name = statement.name!.text;
        } else if (ts.isEnumDeclaration(statement)) {
            // console.log("isEnumDeclaration");
            name = statement.name.text;
        } else if (ts.isInterfaceDeclaration(statement)) {
            // console.log("isInterfaceDeclaration");
            name = statement.name.text;
        } else if (ts.isTypeAliasDeclaration(statement)) {
            // console.log("isTypeAliasDeclaration");
            name = statement.name.text;
        }
        const comment = statement.getFullText().slice(0, statement.getLeadingTriviaWidth());
        // console.log(fileName, "comment", comment);
        const hasIgnoreComment = comment.toLowerCase().includes("@ignore");
        // console.log("hasIgnoreComment", hasIgnoreComment);

        const hasExport = testHasExport(statement);
        const isNotAbstract = testNotAbstract(statement);
        // console.log("hasExport", hasExport);
        if (name && hasExport && !hasIgnoreComment) {
            allExports.push({
                exportName: name,
                path: fileName
            });
        }
    });
}

function testHasExport(statement: Statement) {
    let hasExport = false;
    ts.forEachChild(statement, childNode => {
        if (childNode.kind === ts.SyntaxKind.ExportKeyword) {
            hasExport = true;
        }
    });
    return hasExport;
}

function testNotAbstract(statement: Statement) {
    let isAbstract = false;
    ts.forEachChild(statement, childNode => {
        if (childNode.kind === ts.SyntaxKind.AbstractKeyword) {
            isAbstract = true;
        }
    });
    return !isAbstract;
}

function isChildOf(child: string, parent: string) {
    if (child === parent) {
        return true;
    }
    const parentTokens = parent.split(path.sep).filter(i => i.length);
    const childTokens = child.split(path.sep).filter(i => i.length);
    // console.log("parent", parent);
    // console.log("parentTokens", parentTokens[0], parentTokens[1]);
    // console.log("child", child);
    // console.log("childTokens", childTokens[0], childTokens[1]);
    return parentTokens.every((t, i) => {
        return childTokens[i] === t;
    });
}

export function writeAllAsNamedExports(
    allExports: TExport[],
    outputFile: string,
    prefixLength: number,
    relativePrefix: string
) {
    writeFileSync(
        outputFile,
        "// This file is generated by generate-exports-file.ts script, do not edit it manually!\n"
    );

    allExports.forEach(el => {
        writeImport(el.exportName, el.path);
    });

    function writeImport(elementName: string, importPath: string) {
        const fileExtension = path.extname(importPath).toLowerCase();
        const lengthWithoutPrefixAndExtension = importPath.length - prefixLength - fileExtension.length;
        let relativePath = `${relativePrefix}${importPath.substr(prefixLength, lengthWithoutPrefixAndExtension)}`;
        const isWindows = process.platform === "win32";
        if (isWindows) {
            relativePath = relativePath.split(path.sep).join(path.posix.sep);
        }
        const textToWrite = `export { ${elementName} } from "${relativePath}";\n`;
        appendFileSync(outputFile, textToWrite);
    }
}
