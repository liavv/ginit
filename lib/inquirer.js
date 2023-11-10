const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'projectName',
        type: 'input',
        message: 'Enter Project Name:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter project name.';
          }
        }
      },
      {
        name: 'packages',
        type: 'input',
        message: 'Enter Packages delimiter ,:',
        validate: function( value ) {
         const  pkgArr = value.split(",");
         if (pkgArr.length === 0 || (pkgArr[0].trim() ==="" && pkgArr.length === 1)){
            return 'Please enter packages with , as delimiter'
         }
         else{
          
          return true;
         }
        }
      },
    ];
    return inquirer.prompt(questions);
  },

  getTwoFactorAuthenticationCode: () => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your two-factor authentication code.';
        }
      }
    });
  },

  askRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a name for the repository.';
          }
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:'
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private:',
        choices: [ 'public', 'private' ],
        default: 'public'
      }
    ];
    return inquirer.prompt(questions);
  },

  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ];
    return inquirer.prompt(questions);
  },
};
