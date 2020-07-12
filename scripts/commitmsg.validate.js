const chalk = require('chalk')
const fs = require('fs')
const commitMsg = fs.readFileSync(process.env.HUSKY_GIT_PARAMS, 'utf-8')
const commitPattern = /^(feat|fix|improvement|docs|style|refactor|pref|test|build|ci|chore|revert):\s[\s\S]+$/g

const versionPattern = /^v?\d\.\d\.\d\n*$/

if (!commitPattern.test(commitMsg) && !versionPattern.test(commitMsg)) {
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(` 💅 sorry, its a invalid commit message format: ${commitMsg}`)}\n\n` +
    chalk.red(' please see under examples:\n\n') +
    `     👉  commit message: ${chalk.green('feat: 新增xx功能')}\n`
  )
  process.exit(1)
}
