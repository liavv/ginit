#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');
const inquirer = require('./lib/inquirer');
const replace = require("replace");
const fs = require('fs');
const fsPromises = require('fs').promises;

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Liav CLI Test', { horizontalLayout: 'full' })
  )
);

// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a Git repository!'));
//   process.exit();
// }

const getGithubToken = async () => {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if(token) {
    return token;
  }

  // No token found, use credentials to access GitHub account
  token = await github.getPersonalAccesToken();

  return token;
};

const run = async () => {
  try {
    const questions = await inquirer.askGithubCredentials();

// File destination.txt will be created or overwritten by default.
    const res = await fsPromises.copyFile('templates/package.tpl', 'templates/packageTMP.tpl');
    replace({
        regex: "--projectName--",
        replacement: questions.projectName,
        paths: ['templates/packageTMP.tpl'],
        recursive: true,
        silent: true,
    });

    replace({
      regex: "--packages--",
      replacement: questions.packages,
      paths: ['templates/packageTMP.tpl'],
      recursive: true,
      silent: true,
  });
    // // Retrieve & Set Authentication Token
    // const token = await getGithubToken();
    // github.githubAuth(token);

    // // Create remote repository
    // const url = await repo.createRemoteRepo();

    // // Create .gitignore file
    // await repo.createGitignore();

    // // Set up local repository and push to remote
    // await repo.setupRepo(url);
    await fsPromises.rename('templates/packageTMP.tpl', 'templates/package.json')
    console.log(chalk.green('All done!'));
  } catch(err) {
      if (err) {
        switch (err.status) {
          case 401:
            console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
            break;
          case 422:
            console.log(chalk.red('There is already a remote repository or token with the same name'));
            break;
          default:
            console.log(chalk.red(err));
        }
      }
  }
};

run();
