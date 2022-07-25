const getFiles = require('node-recursive-directory');
const path = require('path');
const { exec } = require('child_process');

// Following directories are searched for *.mmd files that will be converted into *.svg
const directories = [
    'content',
    'static/img'
];

async function convert() {
    // Collect all Mermaid files (*.mmd)
    let allFilesMmd = []
    for (let directory of directories) {
        const directoryPath = path.join(__dirname, '..', directory)
        const allFiles = await getFiles(directoryPath, true);
        const mmdFiles = allFiles.filter(fileData => /\.mmd$/.test(fileData.filename))
        allFilesMmd = allFilesMmd.concat(mmdFiles)
    }

    // Convert each Mermaid file into SVG
    const mmdc = path.join(__dirname, '../node_modules/.bin/mmdc')
    for (let mmd of allFilesMmd) {
        const input = mmd.fullpath
        const output = mmd.fullpath.replace(/\.mmd$/, '.svg')
        exec(`${mmdc} -i ${input} -o ${output}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (stdout) {
                console.log(stdout);
            }
            console.log(`${mmd.filename} --> ${output}`);
        });
    }
}

module.exports = {
    convert
}