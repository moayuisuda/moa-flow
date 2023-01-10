const path = require('path')
const fs = require('fs-extra')

module.exports = dest => ({
    name: 'clean',
    buildStart() {
        console.log('```````````````````````````````````````````````````````````````````````````start');
        console.log('```````````````````````````````````````````````````````````````````````````start');
        console.log('```````````````````````````````````````````````````````````````````````````start');
        console.log('```````````````````````````````````````````````````````````````````````````start');
        console.log('```````````````````````````````````````````````````````````````````````````start');
        console.log('```````````````````````````````````````````````````````````````````````````start');
        const cwd = process.cwd()
        const destDir = path.join(cwd, dest)
        fs.removeSync(destDir)
    },
})
