let promise = require("sdk/core/promise");
let tabs = require("sdk/tabs");
let main = require("./main");
let { wait, context, loadPage } = require("./lib/sdkTestUtil");

exports["test browser should redirect to gfycat service when a gif is directly requested"] = function(assert, done) {
  loadPage("http://mr-andersen.no/gfcycat-companion-test/index.html", assert)
  .then(test_gifRequestShouldBeRedirectedToGfycat)
  .then(done);
};

function test_gifRequestShouldBeRedirectedToGfycat(assert) {
  let deferred = promise.defer();
  getAnchorNode().click();

  wait(10000).then(() => {
    assert.ok(tabs.activeTab.url.startsWith("chrome://gfycat/content/video.html"),
      "Direct gif request should be redirected to video viewer");
    deferred.resolve(assert);
  });
  return deferred.promise;
}

function getAnchorNode() {
  let doc = context.getDocument();
  return doc.querySelector("#gif-link");
}

require("sdk/test").run(exports);