const mermaid = require('./mermaid.js');
const jsonSchemes = require('./json-schemes.js');

async function build(arguments) {
    // Convert mermaid files (.mmd) into SVGs
    await mermaid.convert()

    // Convert JSON schemes to Markdown
    await jsonSchemes.convert(...arguments)
}

build(process.argv.slice(2)).catch((e) => {
    console.error(e)
})