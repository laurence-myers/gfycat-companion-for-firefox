"use strict";

const { Cc, Ci } = require("chrome");

exports.sha1 = sha1;

function sha1(str) {
    let hasher = Cc["@mozilla.org/security/hash;1"].createInstance(Ci.nsICryptoHash);
    let byteArray = toByteArray(str);
    hasher.init(hasher.SHA1);
    hasher.update(byteArray, byteArray.length);
    let hash = hasher.finish(false);
    let hexString = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
    return hexString;
}

function toByteArray(str) {
    let converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    return converter.convertToByteArray(str, {});
}

function toHexString(charCode) {
    return ("0" + charCode.toString(16)).slice(-2);
}