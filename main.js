const {
  exec,
  spawn
} = require("child_process");
const fs = require("fs");
const SCRIPT_FILE = "page_bot.js";
const SCRIPT_PATH = __dirname + "/" + SCRIPT_FILE;
const GIT = process.env.repo || "https://github.com/hardasf/LeechAI-WieSrc-.git";

async function Load() {
  console.log(`Ws3 PageBot | Created by Kenneth Aceberos`);
  const execute = async (cmd) => {
    await new Promise(async (resolve, reject) => {
      const buang = await exec(cmd, {
          cwd: __dirname,
          stdio: "inherit",
          shell: true
        },
        (async (error, stdout, stderr) => {
          if (error) return console.error(error);
          if (stdout) return console.error(stdout);
          if (stderr) return console.error(stderr);
          resolve();
          return;
        }));
    });
  };
  const execute1 = async (cmd, args) => {
    await new Promise((resolve, reject) => {
      let main_ = spawn(cmd, args, {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
      });
      main_.on("data", async (data) => {
        console.log(data);
      });
      main_.on("close", async (exitCode) => {
        if (exitCode === 0) {
          console.log(`Success: code ${exitCode}`);
        } else if (exitCode === 1) {
          console.log(`Error: code ${exitCode}`);
          console.log(`Restarting WSE PageBot...`);
          Load();
        } else {
          console.log(`Error: code ${exitCode}`);
        }
        resolve();
        return;
      });
    });
  };
  if (!process.env.replit) await execute(`rm -rf /.git`);
  if (!process.env.nopull) await execute1(`git pull`, [GIT, "main", "--ff-only"]);
  console.log("Done!");
  await execute1(`node`, [SCRIPT_PATH]);
  return;
}
Load();
process.on("unhandledRejection", reason => console.log(reason));