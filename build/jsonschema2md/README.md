# jsonschema2md

Generate Markdown or AsciiDoctor documentation from JSON Schema

- [jsonschema2md](#jsonschema2md)
  - [Example](#example)
  - [example](#example-1)
    - [example.byteOffset](#examplebyteoffset)
    - [example.type](#exampletype)
  - [Getting Started](#getting-started)
  - [Command-Line Options](#command-line-options)
  - [Limitations](#limitations)
  - [Original Script](#original-script)

<a name="Example"></a>
## Example

This JSON Schema:
```json
{
    "$schema" : "http://json-schema.org/draft-03/schema",
    "title" : "example",
    "type" : "object",
    "description" : "Example description.",
    "properties" : {
        "byteOffset" : {
            "type" : "integer",
            "description" : "The offset relative to the start of the buffer in bytes.",
            "minimum" : 0,
            "default" : 0
        },
        "type" : {
            "type" : "string",
            "description" : "Specifies if the elements are scalars, vectors, or matrices.",
            "enum" : ["SCALAR", "VEC2", "VEC3", "VEC4", "MAT2", "MAT3", "MAT4"],
            "required" : true
        }
    },
    "additionalProperties" : false
}
```

is used to generate this Markdown documentation:

* [`example`](#reference-example) (root object)


---------------------------------------
<a name="reference-example"></a>
## example

Example description.

**`example` Properties**

|   |Type|Description|Required|
|---|---|---|---|
|**byteOffset**|`integer`|The offset relative to the start of the buffer in bytes.|No, default: `0`|
|**type**|`string`|Specifies if the elements are scalars, vectors, or matrices.| &#10003; Yes|

Additional properties are not allowed.

### example.byteOffset

The offset relative to the start of the buffer in bytes.

* **Type**: `integer`
* **Required**: No, default: `0`
* **Minimum**: ` >= 0`

### example.type

Specifies if the elements are scalars, vectors, or matrices.

* **Type**: `string`
* **Required**:  &#10003; Yes
* **Allowed values**:
   * `"SCALAR"`
   * `"VEC2"`
   * `"VEC3"`
   * `"VEC4"`
   * `"MAT2"`
   * `"MAT3"`
   * `"MAT4"`

---

## Getting Started

Install [Node.js](https://nodejs.org/en/) if you don't already have it, clone this repo, and then:
```
cd wetzel
npm install
```
Run `node bin/wetzel.js` and pass it the path to a file with a JSON Schema, and the generated Markdown is output to the console.

To generate a markdown from a json schema and copy it to the clipboard run;

```
node bin/wetzel.js <schema.json> | clip
```


## Command-Line Options

* The `-l` option specifies the starting header level.
* The `-c` option lets you specify a custom symbol to place in front of required properties.
* The `-p` option lets you specify the relative path that should be used when referencing the schema, relative to where you store the documentation.
* The `-s` option lets you specify the path string that should be used when loading the schema reference paths.
* The `-e` option writes an additional output file that embeds the full text of JSON schemas (AsciiDoctor mode only).
* The `-m` option controls the output style mode. The default is `Markdown`, use `-m=a` for `AsciiDoctor` mode.
* The `-n` option will skip writing a Table of Contents.
* The `-w` option will suppress any warnings about potential documentation problems that wetzel normally prints by default.
* The `-d` option lets you specify the root filename that will be used for writing intermediate wetzel artifacts that are useful when doing wetzel development.
* The `-a` option will attempt to aggressively auto-link referenced type names in descriptions between each other.  If it's too agressive, you can add `=cqo` so that it only attempts to auto-link type names that are within "code-quotes only" (cqo) (e.g.: ``typeName``)
* The `-i` option lets you specify an array of schema filenames that might be referenced by others, but shouldn't get their own documentation section.



## Limitations

This tool was developed to generate reference documentaiton for the [glTF](https://github.com/KhronosGroup/glTF) schema.  As such, it currently only supports JSON Schema 3 and 4, and doesn't support the entire JSON Schema spec.  However, wetzel is easy to hack on, just edit [lib/generateMarkdown.js](lib/generateMarkdown.js).

## Original Script

https://github.com/CesiumGS/wetzel
