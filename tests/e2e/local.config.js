/* eslint-disable global-require */
const caps = require("./caps/local");
const sh = require("shelljs");

let avd = caps["android-6.0"];

process.argv.forEach(function (val) {
    if (val.indexOf("--params.avd") > -1) {
        const avdName = val.replace("--params.avd=", "");

        avd = caps[avdName];
    }
});

exports.config = {
    framework: "jasmine2",
    specs: ["**/*_test.js"],
    seleniumAddress: "http://localhost:4723/wd/hub",

    capabilities: avd,

    onPrepare() {
        const wd = require("wd");
        const protractor = require("protractor");
        const wdBridge = require("wd-bridge")(protractor, wd);

        wdBridge.initFromProtractor(exports.config);
        require("babel-core/register");

        // check if location services enabled if not, enable
        // var output = sh.exec("adb shell settings get secure location_providers_allowed").output;

        // enable high accuracy location
        sh.exec("adb shell settings put secure location_providers_allowed network,gps");
        // if (output && output.trim().length === 0) {
        //     return wdBrowser.toggleLocationServicesOnDevice();
        // }
    },
};
