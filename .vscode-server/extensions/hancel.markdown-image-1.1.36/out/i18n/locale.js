"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = void 0;
const locale_zh_cn_1 = require("./locale.zh-cn");
const locale_zh_tw_1 = require("./locale.zh-tw");
exports.default = {
    config_failed: "Config Failed: ",
    upload_failed: "Upload File Failed: ",
    save_failed: "Save File Failed: ",
    something_wrong: "Something was wrong: ",
    prompt_name_component: "Please enter a file name. The full name will be: ",
    user_did_not_answer_prompt: "User did not answer prompt",
    open_with_folder: "Please Open the project of the file with folder.",
    replace_or_no: "The file was exists. Would you replace it?",
    Yes: "Yes",
    No: "No",
    'qiniu.east': "East China",
    'qiniu.north': "North China",
    'qiniu.south': "South China",
    'qiniu.na': "North America",
    'qiniu.sa': "Southeast Asia",
    'upyun.smart': "Smart choose: v0.api.upyun.com",
    'upyun.telecom': "China Telecom: v1.api.upyun.com",
    'upyun.unicom': "China Unicom: v2.api.upyun.com",
    'upyun.mobile': "China Mobile: v3.api.upyun.com",
    'smms.token-miss': 'Please setting sm.ms token first.',
    named_paste: "Name the picture you pasted (don't include extname, it's will be replace the ${filename} in the format).",
    uploading: "Uploading...",
    picture: "picture",
    install_xclip: "You need to install xclip command first.",
    powershell_not_found: "The powershell command is not in you PATH environment variables. Please add it and retry.",
    "like.extension": "Do you like this extension? Hope to get your kindly favorable comments.",
    "like.ok": "Yes",
    "like.no": "No",
    "like.later": "Remind later",
    sftp_not_host: "You must config the ssh host.",
    sftp_not_port: "You must config the ssh port.",
    sftp_not_username: "You must config the ssh username.",
    sftp_not_password: "You must config a ssh password or private key file path.",
    sftp_connect_failed: "Connect to the ssh server failed: ",
};
let $ = { 'zh-cn': locale_zh_cn_1.default, 'zh-tw': locale_zh_tw_1.default };
exports.$ = $;
//# sourceMappingURL=locale.js.map