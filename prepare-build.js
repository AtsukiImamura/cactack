/**
 * hashの違うbundleファイルが大量に増えるのを防ぐために、deploy前にdistディレクトリの既存ファイルを削除する
 */

const fs = require("fs");
const TEST_DIR = "./dist";

fs.readdir(TEST_DIR, (err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".bundle.js")) {
      return;
    }
    fs.unlink(TEST_DIR + "/" + file, (err) => {
      if (err) throw err;
    });
  });
});
