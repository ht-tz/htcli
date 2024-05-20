import process from "child_process";
const chalk  = require("chalk")
const ora = require('ora');
import log from "../utils/log";

const spinner = ora({
  text: "htz-cli 正在更新... \n",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) =>
      chalk.blue(item)
    ),
  },
});

// 项目创建流程
export function update() {
  spinner.start();
  process.exec("npm install htz-cli@latest -g", (err: any) => {
    spinner.stop();
    if (!err) {
      log.success("更新成功");
    } else {
      log.error(`${err}`);
    }
  });
}
