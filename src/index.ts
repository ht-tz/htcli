import { Command } from "commander";
import { version } from "../package.json";
import { update } from "./command/update";
import { create } from "./command/create";
//使用htz指令名称
// 命令行中使用 htz XXX
const program = new Command("htz")
// .vesion 表示可以使用 -V --version 参数查看当前SDK版本
// 我们直接使用 package.json 中的 version 即可
program.version(version, '-v', '--verison')
program.command("update")
    .description("更新htz到最新版本")
    .action(async () => {
    await update()
})

program.command("create")
    .description("创建一个htz项目")
    .argument('[name]', '项目名称')
    .action(async (dirName:string) => {
   await create(dirName)
})
//解析指令
program.parse()