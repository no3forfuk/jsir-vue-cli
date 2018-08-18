#!/usr/bin/env node


// 处理用户输入的命令
const program = require('commander');
// 下载模板
const download = require('download-git-repo');
// 问题交互
const inquirer = require('inquirer');
// node 文件模块
const fs = require('fs');
// 填充信息至文件
const handlebars = require('handlebars');
// 动画效果
const ora = require('ora');
// 字体加颜色
const chalk = require('chalk');
// 显示提示图标
const symbols = require('log-symbols');

program.version('1.0.0', '-v,--version').command('init <name>').action(name => {
    if (fs.existsSync(name)) {
        console.log(symbols.error, chalk.red('The object has exist'));
    } else {
        inquirer.prompt([{
            name: 'description',
            message: 'input your project description'
        }, {
            name: 'author',
            message: 'input author'
        }, {
            name: 'version',
            message: 'input project version'
        }]).then(answers => {
            const spinner = ora('Downloading...');
            spinner.start();
            download('no3forfuk/jsir-vue-cli', name, err => {
                if (err) {
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                } else {
                    spinner.succeed();
                    const fileName = `${name}/package.json`;
                    const meta = {
                        name,
                        description: answers.description,
                        author: answers.author,
                        version: answers.version
                    }
                    if (fs.existsSync(fileName)) {
                        const content = fs.readFileSync(fileName).toString();
                        const result = handlebars.compile(content)(meta);
                        fs.writeFileSync(fileName, result);
                    }
                    console.log(symbols.success, chalk.green('The vue object has downloaded successfully!'));
                }
            })
        })
    }

})
program.parse(process.argv);
