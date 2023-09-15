'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const utils_1 = require("./lib/utils");
const utils_2 = require("./lib/utils");
const image_size_1 = require("image-size");
function getUploadInstance(config) {
    let uploads = [];
    // Get All Upload Methods
    let uploadMethods = config.base.uploadMethods || [];
    uploadMethods.unshift(config.base.uploadMethod);
    uploadMethods = Array.from(new Set(uploadMethods));
    // Load All Upload Method Instance
    for (const t of uploadMethods) {
        const upload = utils_1.default.getUpload(t, config);
        if (upload)
            uploads.push(upload);
    }
    return uploads;
}
function activate(context) {
    console.info('Congratulations, your extension "markdown-image" is now active!');
    let config = utils_1.default.getConfig();
    let uploads = getUploadInstance(config);
    let pasteCommand = vscode.commands.registerCommand('markdown-image.paste', () => __awaiter(this, void 0, void 0, function* () {
        let stop = () => { };
        try {
            stop = utils_1.default.showProgress(utils_2.locale['uploading']);
            let editor = vscode.window.activeTextEditor;
            let selections = utils_1.default.getSelections();
            let savePath = utils_1.default.getTmpFolder();
            savePath = path.resolve(savePath, `pic_${new Date().getTime()}.png`);
            let images = yield utils_1.default.getPasteImage(savePath);
            images = images.filter(img => ['.jpg', '.jpeg', '.gif', '.bmp', '.png', '.webp', '.svg'].find(ext => img.endsWith(ext)));
            if (config.base.fileFormat == 'jpg' && images.length === 1 && images[0] == savePath) {
                images[0] = yield utils_1.default.convertImage(images[0]);
            }
            console.debug(`Get ${images.length} Images`);
            let urls = [], maxWidth = [];
            for (let i = 0; i < images.length; i++) {
                let width = image_size_1.imageSize(images[i]).width || 0;
                maxWidth.push(config.base.imageWidth < width ? config.base.imageWidth : 0);
                let name = config.base.fileNameFormat ? (yield utils_1.default.formatName(config.base.fileNameFormat, images[i], savePath === images[i])) + (images[i] ? path.extname(images[i]) : '.png') : images[i];
                console.debug(`Uploading ${images[i]} to ${name}.`);
                let p;
                for (let j = 0; j < uploads.length; j++) {
                    let upload = uploads[j];
                    const result = yield upload.upload(images[i], name);
                    if (j == 0)
                        p = result;
                }
                images[i] = name;
                if (p) {
                    urls.push(p);
                }
            }
            let insertCode = '', insertTag = '';
            for (let i = 0; i < urls.length; i++) {
                let selection = yield utils_1.default.getAlt(config.base.altFormat, images[i], context);
                if ((selections === null || selections === void 0 ? void 0 : selections.length) === 1 && (editor === null || editor === void 0 ? void 0 : editor.document.getText(selections[0]))) {
                    selection = `${editor === null || editor === void 0 ? void 0 : editor.document.getText(selections[0])} ${i + 1}`;
                }
                else if ((selections === null || selections === void 0 ? void 0 : selections[i]) && (editor === null || editor === void 0 ? void 0 : editor.document.getText(selections[i]))) {
                    selection = (selections === null || selections === void 0 ? void 0 : selections[i]) && (editor === null || editor === void 0 ? void 0 : editor.document.getText(selections[i]));
                }
                if (config.base.uploadMethod !== 'Data URL') {
                    if (config.base.urlEncode) {
                        urls[i] = encodeURIComponent(urls[i].toString()).replace(/%5C/g, '\\').replace(/%2F/g, '/').replace(/%3A/g, ':').replace(/%40/g, '@');
                    }
                    let text = utils_1.default.formatCode(urls[i], selection, maxWidth[i], config.base.codeType);
                    if ((selections === null || selections === void 0 ? void 0 : selections[i]) && (selections === null || selections === void 0 ? void 0 : selections.length) > 1) {
                        yield utils_1.default.editorEdit(selections[i], text);
                    }
                    else {
                        insertCode += text;
                    }
                }
                else {
                    let tag = new Date().getTime().toString();
                    let text = utils_1.default.formatCode(tag, selection, maxWidth[i], 'Markdown');
                    tag = `\n[${tag}]: ${urls[i]}`;
                    if ((selections === null || selections === void 0 ? void 0 : selections[i]) && (selections === null || selections === void 0 ? void 0 : selections.length) > 1) {
                        yield utils_1.default.insertToEnd(tag);
                        yield utils_1.default.editorEdit(selections[i], text);
                    }
                    else {
                        insertCode += text;
                        insertTag += tag;
                    }
                }
            }
            if (insertCode) {
                let pos = editor === null || editor === void 0 ? void 0 : editor.selection.active;
                if (config.base.uploadMethod === 'Data URL') {
                    yield utils_1.default.insertToEnd(insertTag);
                }
                else if (pos) {
                    yield utils_1.default.editorEdit(pos, insertCode);
                }
                else {
                    vscode.env.clipboard.writeText(insertCode);
                    setTimeout(() => {
                        vscode.commands.executeCommand("editor.action.clipboardPasteAction");
                    }, 100);
                }
            }
            utils_1.default.noticeComment(context);
        }
        catch (error) {
            let e = error;
            vscode.window.showErrorMessage(`${utils_2.locale['something_wrong']}${e.message in utils_2.locale ? utils_2.locale[e.message] : e.message}\n${e.toString()}`);
        }
        stop();
    }));
    context.subscriptions.push(pasteCommand);
    let configCommand = vscode.commands.registerCommand('markdown-image.config', () => {
        vscode.commands.executeCommand('workbench.action.openSettings', 'markdown-image');
    });
    context.subscriptions.push(configCommand);
    let richTextCommand = vscode.commands.registerCommand('markdown-image.paste-rich-text', () => __awaiter(this, void 0, void 0, function* () {
        let stop = () => { };
        try {
            let editor = vscode.window.activeTextEditor;
            let text = yield utils_1.default.getRichText();
            if (text) {
                utils_1.default.editorEdit(editor === null || editor === void 0 ? void 0 : editor.selection, utils_1.default.html2Markdown(text));
            }
        }
        catch (error) {
            let e = error;
            vscode.window.showErrorMessage(`${utils_2.locale['something_wrong']}${e.message}\n${e.toString()}`);
        }
        stop();
    }));
    context.subscriptions.push(richTextCommand);
    vscode.workspace.onDidChangeConfiguration(function (event) {
        config = utils_1.default.getConfig();
        uploads = getUploadInstance(config);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map