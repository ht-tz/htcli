import {select, input} from "@inquirer/prompts";
import fs from "fs-extra";
import {clone} from "../utils/clone";
import axios, {AxiosResponse} from "axios";
import {gt} from "lodash";
import log from "../utils/log";
import {name, version} from "../../package.json";
const path = require("path");
const chalk = require("chalk")
 

export interface TemplateInfo {
    name: string; // 模版名称
    downloadUrl: string; // 下载地址
    description: string; // 模版描述
    branch: string; // 分支
}

// 这里是保存了之前开发的模版
export const templates: Map<string, TemplateInfo> = new Map([
    [
        "Vite4-Vue3-Types-template",
        {
            name: "amdin-template",
            downloadUrl: "https://github.com/ht-tz/deep-water.git", //项目模版地址
            description: "Vue3技术栈开发模版",
            branch: "master",
        },
    ]
]);

// 判断用户是否覆盖的公共方法
const isOverwrite = async (projectName: string) => {
    log.warn(`${projectName} 文件夹已存在`);

    return select({
        message: "是否覆盖原文件？",
        choices: [
            {
                name: "覆盖",
                value: true,
            },
            {
                name: "取消",
                value: false,
            },
        ],
    });
};

// 获取npm包的信息，npm包提供了根据包名称查询信息的接口，我们这里直接使用 axios 请求调用即可
export const getNpmInfo = async (packageName: string) => {
    const url = `https://registry.npmjs.org/${packageName}`;
    let res = {};
    try {
        res = await axios.get(url);
    } catch (error) {
        log.error(error as string);
    }
    return res;
};

//获取最新的包版本信息
export const getNpmLatestVersion = async (packageName: string) => {
    const {data} = (await getNpmInfo(packageName)) as AxiosResponse;
    // data['dist-tags].latest为最新版本
    return data["dist-tags"].latest;
};

// 检查npm包是否需要更新

export const checkNpmVersion = async (
    packageName: string, // 包名称
    packageVersion: string // 包版本
) => {
    const latestVersion = await getNpmLatestVersion(packageName);
    const lastestFlag = gt(latestVersion, packageVersion);
    if (lastestFlag) {
        log.info(`检测到 htz-cli 最新版本：${chalk.blueBright(latestVersion)}， 当前版本是 ${chalk.blackBright(version)}`);

        log.info(
            `可使用 ${chalk.yellow("npm")} install htz-cli@latest 或者 ${chalk.yellow(
                "htz"
            )} update 更新`
        );
    }
    return lastestFlag;
};


// 创建命令所需的
export async function create(projectName?: string) {
    //初始化模版列表
    const templateList = Array.from(templates).map(
        (item: [string, TemplateInfo]) => {
            const [name, info] = item;
            return {
                name,
                value: name,
                description: info.description,
            };
        }
    );

    log.info(`当前可用的模版：${templateList.map((item) => item.name)}`);

    // 如果文件名称没有传输，需要输入
    if (!projectName) {
        // 输入的项目名称
        projectName = await input({
            message: "请输入项目名称",
        });
    }

    // 如果文件已经存在，让用户决定是佛覆盖源文件
    const filePath = path.resolve(process.cwd(), projectName);
    // 带你文件的路径
    log.error(filePath);
    //判断路径是否存在
    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(projectName);
        // 覆盖需要把原来的给删除掉
        if (run) {
            await fs.remove(filePath);
        } else {
            return; // 不覆盖直接结束
        }
    }

    //检测版本更新
    checkNpmVersion(name, version);

    //选择模版
    const templateName = await select({
        message: "请选择要初始化的模版",
        choices: templateList,
    });

    // 下载模版
    const gitRepoInfo = templates.get(templateName);
    if (gitRepoInfo) {
        await clone(gitRepoInfo.downloadUrl, projectName, [
            "-b",
            gitRepoInfo.branch,
        ]);
    } else {
        log.error(`${templateName} 模版不存在`);
    }
    console.log("项目创建成功")
}
