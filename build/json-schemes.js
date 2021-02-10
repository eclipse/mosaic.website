const path = require('path')
const fs = require('fs')
const { exec, execFile } = require('child_process');

let repoDir = ''
const startWeight = 100
const jsonschema2md = path.join(__dirname, 'jsonschema2md/bin/wetzel.js')
const jsonSchemesFile = path.join(__dirname, '..', 'mosaic-json-schemes.json')
const templateFile = path.join(__dirname, 'json-schemes-template.md')
const exportDir = path.join(__dirname, '../content/docs/mosaic_configuration')
let markdownTemplate = ''

async function isFile(filePath) {
    return new Promise((resolve) => {
        fs.stat(filePath, (error, stats) => {
            if (error) {
                resolve(false)
            } else {
                resolve(stats.isFile())
            }
        })
    })
}

async function isDir(filePath) {
    return new Promise((resolve) => {
        fs.stat(filePath, (error, stats) => {
            if (error) {
                resolve(false)
            } else {
                resolve(stats.isDirectory())
            }
        })
    })
}

async function storeRepoPaths(absoluteRepoPathEclipse) {
    // Check Eclipse MOSAIC repository path
    if (await isDir(absoluteRepoPathEclipse)) {
        repoDir = absoluteRepoPathEclipse
    } else {
        return Promise.reject(new Error(`Eclipse MOSAIC repository directory does not exist at: ${ absoluteRepoPathEclipse }`))
    }
}

async function collectJsonSchemes() {
    if (await isFile(jsonSchemesFile)) {
        let jsonSchemes
        try {
            const jsonSchemesContent = fs.readFileSync(jsonSchemesFile, 'utf-8')
            jsonSchemes = JSON.parse(jsonSchemesContent)
        } catch (error) {
            return Promise.reject(new Error(`Could not parse JSON scheme config file. Reason: ${ error.message }`))
        }
        if (Array.isArray(jsonSchemes)) {
            const ids = []
            for (let jsonScheme of jsonSchemes) {
                if (!jsonScheme.id || typeof jsonScheme.id != 'string') {
                    return Promise.reject(new Error(`JSON scheme entry misses field 'id' or it is not of type 'string'.`))
                }
                if (ids.indexOf(jsonScheme.id) >= 0) {
                    return Promise.reject(new Error(`JSON scheme entries have the same 'id': ${ jsonScheme.id }`))
                }
                ids.push(jsonScheme.id)
                if (!jsonScheme.title || typeof jsonScheme.title != 'string') {
                    return Promise.reject(new Error(`JSON scheme entry misses field 'title' or it is not of type 'string'.`))
                }
                if (!jsonScheme.linkTitle || typeof jsonScheme.linkTitle != 'string') {
                    return Promise.reject(new Error(`JSON scheme entry misses field 'linkTitle' or it is not of type 'string'.`))
                }
                if (!jsonScheme.path || typeof jsonScheme.path != 'string') {
                    return Promise.reject(new Error(`JSON scheme entry misses field 'path' or it is not of type 'string'.`))
                }
            }
            return Promise.resolve(jsonSchemes)
        } else {
            return Promise.reject(new Error(`Expecting JSON config file to have an array as root object.`))
        }
    } else {
        return Promise.reject(new Error(`JSON schemes config file was not found. Expected to be here: ${ jsonSchemesFile }`))
    }
}

async function getMarkdownTemplate() {
    if (await isFile(templateFile)) {
        try {
            markdownTemplate = fs.readFileSync(templateFile, 'utf-8')
        } catch (error) {
            return Promise.reject(error)
        }
    } else {
        return Promise.reject(new Error(`Could not find markdown template file at: ${ templateFile }`))
    }
}

async function createMarkdown(jsonScheme) {
    const jsonSchemeFile = path.join(repoDir, jsonScheme.path)
    if (await isFile(jsonSchemeFile)) {
        return new Promise((resolve, reject) => {
            execFile(jsonschema2md, [jsonSchemeFile], (error, stdout, stderr) => {
                if (error || stderr) {
                    reject(new Error(`Could not execute file '${jsonschema2md}'. Reason: ${error ? error.message : stderr}`))
                } else {
                    const markdown = markdownTemplate
                        .replace('###TITLE###', jsonScheme.title)
                        .replace('###LINK_TITLE###', jsonScheme.linkTitle)
                        .replace('###WEIGHT###', jsonScheme.weight)
                        .replace('###BODY###', stdout)
                    resolve(markdown)
                }
            })
        })
    } else {
        return Promise.reject(new Error(`JSON scheme file could not be found: ${ jsonSchemeFile }`))
    }
}

async function gitAdd(filePath) {
    return new Promise((resolve, reject) => {
        const command = `git add "${ filePath }"`
        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                console.error(`Could not execute command: '${ command }'. Reason: ${error ? error.message : stderr}`)
            }
            resolve()
        })
    })
}

async function convert(absoluteRepoPathEclipse) {
    if (!absoluteRepoPathEclipse) {
        throw new Error(`Missing absolute path to Eclipse MOSAIC repository directory.`)
    } else if (!path.isAbsolute(absoluteRepoPathEclipse)) {
        throw new Error(`Path to Eclipse MOSAIC repository directory is not absolute.`)
    }

    await storeRepoPaths(absoluteRepoPathEclipse)
    const jsonSchemes = await collectJsonSchemes()
    await getMarkdownTemplate()
    for (let index = 0; index < jsonSchemes.length; index++) {
        const jsonScheme = jsonSchemes[index]
        jsonScheme.weight = startWeight + index
        const markdown = await createMarkdown(jsonScheme)
        if (await isDir(exportDir)) {
            const jsonSchemeExportDir = path.join(exportDir, jsonScheme.id)
            const jsonSchemeExportFile = path.join(jsonSchemeExportDir, '_index.md')
            if (!await isDir(jsonSchemeExportDir)) {
                fs.mkdirSync(jsonSchemeExportDir)
            }
            if (await isFile(jsonSchemeExportFile)) {
                fs.unlinkSync(jsonSchemeExportFile)
            }
            fs.writeFileSync(jsonSchemeExportFile, markdown, { encoding: 'utf-8' })
            await gitAdd(jsonSchemeExportFile)
        } else {
            throw new Error(`Export directory does not exist: ${ exportDir }`)
        }
    }
}

module.exports = { convert }