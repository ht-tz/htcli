// simple git 用于拉取git仓库，progress-estimator设置预估git clone的时间并展示进度条
import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import log from "./log";
// 美化控制台打印输出
import chalk from "chalk";
let figlet = require("figlet");

// 引入预估进度条看起来比较好看 
const createLogger = require('progress-estimator');

//初始化一个进度条 
const logger = createLogger({
    spinner: {
        interval: 300,// 变换时间ms
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.blue(item)) // 设置加载动画
    }
})

const goodPrinter = async () => {
    const data = await figlet("欢迎使用 htz-cli 脚手架")
    console.log(chalk.rgb(40, 156, 193).visible(data));
}
const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(), //当前工作目录
    binary: 'git', //二进制文件路径， 文件下载路径
    maxConcurrentProcesses: 6, // 最大并发进程数量
    trimmed: false, //是否清楚尾部的空格 
};
 
//clone方法
export const clone = async (url: string, projectName: string, options: string[]):Promise<any> => {
    const git: SimpleGit = simpleGit(gitOptions);
     try {
         // 开始下载代码并展示预估时间预估进度条
         await logger(git.clone(url, projectName, options), "正在来取代码，请稍等...", {
            estimate: 8000, // 展示预估时间
         })
         goodPrinter()
         console.log()
         console.log(chalk.blueBright(`==================================`))
         console.log(chalk.blueBright(`=== 欢迎使用 htz-cli 脚手架 ===`))
         console.log(chalk.blueBright(`==================================`))
         console.log()

         //相关提示
         log.success(`项目创建成功 ${chalk.blueBright(projectName)}`)
         log.success(`执行以下命令启动项目：`)
         log.info(`cd ${chalk.yellow("pnpm")} install`)
         log.info(`${chalk.yellow("pnpm")} run dev`)
         
     } catch (error) {
         log.error("下载失败")
         log.error(String(error))
     }

}