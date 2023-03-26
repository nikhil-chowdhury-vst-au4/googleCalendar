"use strict";
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
exports.getSignedUrl = exports.deleteFile = exports.uploadFile = void 0;
const storage_1 = require("@google-cloud/storage");
const storage = new storage_1.Storage();
const uploadFile = (buffer, destFileName, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bucket = storage.bucket(bucketName);
        console.log('yes');
        yield bucket.file(destFileName).save(buffer);
        yield bucket.file(destFileName).makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destFileName}`;
        return publicUrl;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (destFileName, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bucket = storage.bucket(bucketName);
        console.log('deleting');
        yield bucket.file(destFileName).delete();
        return true;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.deleteFile = deleteFile;
const getSignedUrl = (fileName, bucketName, contentType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000,
            contentType: contentType
        };
        const mainUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        const [url] = yield storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl(options);
        console.log(mainUrl, url);
        return {
            url,
            mainUrl
        };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.getSignedUrl = getSignedUrl;
//# sourceMappingURL=bucket.upload.js.map