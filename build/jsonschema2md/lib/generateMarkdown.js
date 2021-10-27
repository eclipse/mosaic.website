"use strict";
var defined = require('./defined');
var defaultValue = require('./defaultValue');
var sortObject = require('./sortObject');
var schema3 = require('./schema3Resolver');
var schema4 = require('./schema4Resolver');
var style = require('./style');
var enums = require('./enums');

module.exports = generateMarkdown;

/**
* @function generateMarkdown
* Generates the markdown content to represent the json schema provided within the options parameter.
* @param  {object} options - The set of configuration options to be fed into the generator.
* @return {string} The full markdown content based on the requested options.
*/
function generateMarkdown(options) {
    var schema = options.schema;
    options.searchPath = defaultValue(options.searchPath, ['']);

    var mode = enums.styleModeOption.Markdown;
    if (defined(options.styleMode) && options.styleMode === 'AsciiDoctor') {
        mode = enums.styleModeOption.AsciiDoctor;
    }
    style.setStyleMode(mode);

    if (defined(options.checkmark)) {
        style.setCheckmark(options.checkmark);
    }

    // Verify JSON Schema version
    var schemaRef = schema.$schema;
    var resolved = null;
    if (defined(schemaRef)) {
        if (schemaRef === 'http://json-schema.org/draft-03/schema') {
            resolved = schema3.resolve(schema, options.fileName, options.searchPath, options.ignorableTypes, options.debug);
        }
        else if (schemaRef === 'http://json-schema.org/draft-04/schema') {
            resolved = schema4.resolve(schema, options.fileName, options.searchPath, options.ignorableTypes, options.debug);
        }
        else {
            resolved = schema3.resolve(schema, options.fileName, options.searchPath, options.ignorableTypes, options.debug);
        }
    }

    schema = resolved.schema;

    var md = '';
    for (let title in resolved.referencedSchemas) {
        md += '\n\n';
        md += getSchemaMarkdown(
            resolved.referencedSchemas[title].schema,
            resolved.referencedSchemas[title].fileName,
            options.headerLevel + 1,
            options.suppressWarnings,
            options.schemaRelativeBasePath,
            resolved.referencedSchemas,
            options.autoLink,
            options.embedMode);
    }

    return md;
}

////////////////////////////////////////////////////////////////////////////////

/**
* @function getSchemaMarkdown
* Gets the markdown for the first-class elements of a schema.
* @param  {object} schema                 The schema being converted to markdown.
* @param  {string} fileName               The filename of the schema being converted to markdown.
* @param  {int} headerLevel               The starting level for the headers.
* @param  {boolean} suppressWarnings      Indicates if wetzel warnings should be printed in the documentation.
* @param  {string} schemaRelativeBasePath The path, relative to where this documentation lives, that the schema files can be found.
* Leave as null if you don't want the documentation to link to the schema files.
* @param  {object} knownTypes             The dictionary of types and their schema information.
* @param  {string} autoLink               Enum value indicating how the auto-linking should be handled.
* @param  {string} embedMode              Emum value indicating if we are embedding JSON schema include directives.
* @return {string}                        The markdown for the schema.
*/
function getSchemaMarkdown(schema, fileName, headerLevel, suppressWarnings, schemaRelativeBasePath, knownTypes, autoLink, embedMode) {
    var md = '';

    if (schema === undefined) {
        return md;
    }

    // Render section header
    md += style.getSectionMarkdown(schema, headerLevel, suppressWarnings, embedMode);

    // Check if we're generating an abbreviated document with JSON schema include directives.
    if (embedMode === enums.embedMode.writeIncludeStatements) {
        md += style.embedJsonSchema(fileName, schemaRelativeBasePath);
        return md;
    }

    // Render description
    var value = autoLinkDescription(schema.description, knownTypes, autoLink);
    if (defined(value)) {
        md += value + '\n\n';
    }

    // TODO: Add plugin point for custom JSON schema properties like gltf_*
    var extendedDescription = schema.gltf_sectionDescription;
    if (defined(extendedDescription)) {
        md += autoLinkDescription(extendedDescription, knownTypes, autoLink) + '\n\n';
    }

    // Render type
    var schemaType = schema.type;
    if (defined(schemaType)) {
        //      md += styleType('Type') + ': ' + style.typeValue(schemaType) + '\n\n';
    }

    // TODO: Add plugin point for custom JSON schema properties like gltf_*
    var webgl = schema.gltf_webgl;
    if (defined(webgl)) {
        md += style.propertyGltfWebGL('Related WebGL functions') + ': ' + webgl + '\n\n';
    }
    // Render each property if the type is object
    if (schemaType === 'object') {
        // Render table with summary of each property
        md += createPropertiesSummary(schema, knownTypes, autoLink);

        // Schema reference
        if (embedMode === enums.embedMode.referenceIncludeDocument) {
            md += style.bulletItem(style.bold('JSON schema') + ': ' + style.getSchemaEmbedLink(fileName, schema)) + '\n';
        } else if (defined(schemaRelativeBasePath)) {
            if (!schemaRelativeBasePath.endsWith('/')) {
                schemaRelativeBasePath += '/';
            }
            md += style.bulletItem(style.bold('JSON schema') + ': ' + style.getLinkMarkdown(fileName, schemaRelativeBasePath.replace(/\\/g, '/') + fileName)) + '\n';
        }

        // Render section for each property
        var title = defaultValue(schema.title, suppressWarnings ? '' : 'WETZEL_WARNING: title not defined');

        // Add additional property details not included in table (e.g enum)
        var details = createPropertiesDetails(schema, title, headerLevel + 1, knownTypes, autoLink);

        if(details !==''){
            md += details
        }
    }

    return md;
}

////////////////////////////////////////////////////////////////////////////////

function createPropertiesSummary(schema, knownTypes, autoLink) {
    var md = '';

    if (schema.properties !== undefined && Object.keys(schema.properties).length > 0) {
        md += style.beginTable('Properties', ['   ', 'Type', 'Description', 'Required', 'Boundaries', 'Default']);
        var properties = schema.properties;
        var requiredList = schema.required;
        for (var name in properties) {
            if (properties.hasOwnProperty(name)) {
                var property = properties[name];
                var summary = getPropertySummary(schema, property, knownTypes, autoLink, name);
                var required = "No";
                if(typeof requiredList !== "undefined") {
                    if (requiredList.includes(name)) {
                        required = style.requiredIcon + "Yes";
                    }
                }else{
                    required = summary.required;
                }

                md += style.addTableRow([
                    name,
                    summary.formattedType,
                    defaultValue(summary.description, ''),
                    (summary.required === 'Yes' ? style.requiredIcon : '') + required,
                    summary.boundaries,
                    summary.default
                ]);
            }
        }

        md += style.endTable();
    }

    return md;
}

function createPropertiesDetails(schema, title, headerLevel, knownTypes, autoLink) {
    var headerMd = style.getHeaderMarkdown(headerLevel);
    var md = '';
    var properties = schema.properties;

    // display content of oneOf field
    var additionalProperties = '';
    if (defined(schema.oneOf)) {
        for (var name in schema.oneOf) {
            if (defined(schema.oneOf[name].title)){
                additionalProperties += '* [' + schema.oneOf[name].title + '](#reference-' + schema.oneOf[name].title + ') \n';
            }
        }
    }
    if (additionalProperties !== '') {
        md += md += '**Additionally ONE of the following property definitions apply:**  \n';
        md += additionalProperties + '\n';
    }

    // display content of anyOf field
    additionalProperties = '';
    if (defined(schema.anyOf)) {
        for (var name in schema.anyOf) {
            if (defined(schema.anyOf[name].title)){
                additionalProperties += '* ['+schema.anyOf[name].title+'](#reference-'+schema.anyOf[name].title+') \n';
            }
        }
    }
    if (additionalProperties !== '') {
        md += md += '**Additionally ANY of the following property definitions apply:**  \n';
        md += additionalProperties + '\n';
    }

    // display content of additionalProperties field
    additionalProperties = '';
    if (defined(schema.additionalProperties)) {
        if (typeof schema.additionalProperties === 'object' && schema.additionalProperties.type != 'array') {
            additionalProperties += '* ['+schema.additionalProperties.title+'](#reference-'+schema.additionalProperties.title+') \n';
        } else if (schema.additionalProperties.type == 'array') {
            additionalProperties += '* array[['+schema.additionalProperties.items.title+'](#reference-'+schema.additionalProperties.items.title+')] \n';
        }
    }
    if (additionalProperties !== '') {
        md += md += '**The following additional properties are allowed:**  \n';
        md += additionalProperties + '\n';
    }


    var restrictions = '';
    for (var name in properties) {
        if (properties.hasOwnProperty(name)) {
            var propertyDetails = '';
            var property = properties[name];
            var summary = getPropertySummary(property, knownTypes, autoLink, name);
            var type = summary.type;

            var variableTitle = schema.typeName;
            if (!defined(variableTitle)) {
                variableTitle = title;
            }

            var enumString = getEnumString(property, type, 1);
            if (defined(enumString) && enumString !== '') {
                propertyDetails += style.bulletItem(style.propertyDetails('Allowed values') + ':', 0) + enumString;
            }

            var additionalProperties = property.additionalProperties;
            if (defined(additionalProperties) && (typeof additionalProperties === 'object')) {
                var additionalPropertiesType = getPropertyType(additionalProperties);
                if (defined(additionalPropertiesType)) {
                    var formattedType = style.typeValue(additionalPropertiesType);
                    if ((additionalProperties.type === 'object') && defined(property.title)) {
                        formattedType = style.linkType(property.title, property.title, autoLink);
                    }

                    propertyDetails += style.bulletItem(style.propertyDetails('Type of each property') + ': ' + formattedType, 0);
                }
            }


           if (propertyDetails !== '') {
               var linkRestriction = 'restriction-'+(variableTitle + name).replace(/[^a-zA-Z0-9]+/g,'').toLowerCase();
               restrictions += '<a name=\"' + linkRestriction +'\"></a> \n';
               restrictions += headerMd + ' ' + variableTitle + '.' + name + '\n\n';
               restrictions += propertyDetails;
           }
        }
    }

    if (restrictions !== '') {
        md += '**Further property restrictions:**  \n';
        md += restrictions;
    }

    return md;

}

function getPropertySummary(schema, property, knownTypes, autoLink, name) {
    var type = defaultValue(getPropertyType(property), 'any');
    var formattedType = style.linkType(style.typeValue(type), type, autoLink);

    var typeLink;
    var commonTypes = ['string', 'number', 'object', 'array', 'boolean', 'null', 'integer']
    var temp = formattedType.split('<br>')[0];
    var typeName = temp.substring(0,temp.length-1).substring(1);

    if (commonTypes.indexOf(typeName) === -1) {
        var typeLink = typeName
    }

    // add array brackets to the property type in case the property type is 'array'
    var arrayInfo = '';
    if (type === 'array') {
        var insideBrackets = '';
        if ((defined(property.minItems)) && (property.minItems === property.maxItems)) {
            // Min and max are the same so the array is constant size
            insideBrackets = property.minItems;
        } else if (defined(property.minItems) && defined(property.maxItems)) {
            // Min and max define a range
            insideBrackets = property.minItems + '-' + property.maxItems;
        } else if (defined(property.minItems)) {
            // Only min is defined
            insideBrackets = property.minItems + '-*';
        } else if (defined(property.maxItems)) {
            // Only max is defined
            insideBrackets = '*-' + property.maxItems;
        }

        arrayInfo += '[' + insideBrackets + ']';
    }

    if (defined(property.items) && defined(property.items.type)) {
        if ((property.items.type === 'object')) {
            type = getPropertyType(property.items);
            typeLink = type;
            formattedType = '`'+ type + arrayInfo + '`'
        } else {
            type = property.items.type;
            formattedType = '`'+ type + arrayInfo + '`'
        }
    } else {
        type += arrayInfo;
        formattedType = style.typeValue(type);
    }

    // add a link to the property type in case the property type is an object
    if (defined(typeLink)) {
        formattedType = '[' + formattedType + '](#reference-' + typeLink.toLowerCase() + ')';
    }

    var description = autoLinkDescription(property.description, knownTypes, autoLink);

    var required;
    if (defined(property.required) && (property.required)) {
        required = style.requiredIcon + 'Yes';
    } else {
        var propertyDefault = property.default;
        if (defined(propertyDefault)) {
            var defaultString;
            if (Array.isArray(propertyDefault)) {
                defaultString = '[' + propertyDefault.toString() + ']';
            } else if (typeof propertyDefault === 'object') {
                defaultString = JSON.stringify(propertyDefault);
            } else {
                defaultString = propertyDefault;
            }

            required = 'No';
        } else {
            required = 'No';
        }
    }

    var boundaries = getBoundaries(schema, property, name);

    var defaultVal = 'None';
    if(defined(property.default)) {
        defaultVal = '`' + property.default + '`';
        // in case the default is a reference to another type, get that type name and add alink to the type
        if (defined(property.default.title)) {
            defaultVal =  '[' + property.default.title + '](#reference-' + property.default.title.toLowerCase() + ')';
        }
    }

    return {
        type: type,
        formattedType: formattedType,
        description: description,
        required: required,
        boundaries: boundaries,
        default: defaultVal
    };
}

/**
 * @function getEnumString
 * Gets the string describing the possible enum values.
 * Will try getting the information from the enum/gltf_enumNames properties, but if they don't exist,
 * it will fall back to trying to get the values from the anyOf object.
 * @param  {object} schema The schema object that may be of an enum type.
 * @param  {string} type The name of the object type for the enum values (e.g. string, integer, etc..)
 * @param  {integer} depth How deep the bullet points for enum values should be.  Maximum is 2.
 * @return {string} A string that enumerates all the possible enum values for this schema object.
 */
function getEnumString(schema, type, depth) {
    var propertyEnum = schema['enum'];
    if (!defined(propertyEnum)) {
        // It's possible that the enum value is defined using the anyOf construct instead.
        return getAnyOfEnumString(schema, type, depth);
    }

    var propertyEnumNames = schema['gltf_enumNames'];

    var allowedValues = '';
    var length = propertyEnum.length;
    for (var i = 0; i < length; ++i) {
        var element = style.enumElement(propertyEnum[i], type);
        if (defined(propertyEnumNames)) {
            element += " " + propertyEnumNames[i];
        }

        allowedValues += style.bulletItem(element, depth);
    }
    return allowedValues;
}

/**
 * @function getAnyOfEnumString
 * Gets the string describing the possible enum values, if they are defined within a JSON anyOf object.
 * @param  {object} schema The schema object that may be of an enum type.
 * @param  {string} type The name of the object type for the enum values (e.g. string, integer, etc..)
 * @param  {integer} depth How deep the bullet points for enum values should be.  Maximum is 2.
 * @return {string} A string that enumerates all the possible enum values for this schema object.
 */
function getAnyOfEnumString(schema, type, depth) {
    var propertyAnyOf = schema['anyOf'];
    if (!defined(propertyAnyOf)) {
        return undefined;
    }

    var allowedValues = '';
    var length = propertyAnyOf.length;
    for (var i = 0; i < length; ++i) {
        var element = propertyAnyOf[i];
        var enumValue = element['enum'];
        var enumDescription = element['description'];

        // The likely scenario when there's no enum value is that it's the object
        // containing the _type_ of the enum.  Otherwise, it should be an array with
        // a single value in it.
        if (!defined(enumValue) || !Array.isArray(enumValue) || enumValue.length === 0) {
            continue;
        }

        var enumString = style.enumElement(enumValue[0], type);
        if (defined(enumDescription)) {
            enumString += " " + enumDescription;
        }

        allowedValues += style.bulletItem(enumString, depth);
    }

    return allowedValues;
}


/**
 * @function getBoundaries
 * Determines the boundaries of of a property, taking into account that it
 * might be defined within an anyOf property for enum values.
 * @param  {object} schema The schema object that may be of an enum type.
 * @return {string} The boundaries of the enum
 */
function getBoundaries(schema, properties, name){
    var boundaries = '';
    // = '[' + formattedType + '](#reference-'+ schema.title + '.' + name + ')';
    var exclusiveMinimum = properties.exclusiveMinimum;
    var minimum = properties.minimum;
    var exclusiveMaximum = properties.exclusiveMaximum;
    var maximum = properties.maximum;
    // For enums stored using anyOf, we'll need to get the boundaries from within anyOf.
    var propertyAnyOf;
    if (defined(properties['anyOf'])) {
        propertyAnyOf = properties['anyOf'];
        // The boundaries will be defined as one of the objects contained within
        // the anyOf property.
        var length = propertyAnyOf.length;
        //console.log(propertyAnyOf);
        for (var i = 0; i < length; ++i) {
            if (defined(propertyAnyOf[i]['exclusiveMinimum'])){
                exclusiveMinimum = propertyAnyOf[i]['exclusiveMinimum'];
            }
        }
    }

    if(defined(exclusiveMinimum)) {
        boundaries += '(' + exclusiveMinimum;
    }else if(defined(minimum)) {
        boundaries += '[' + minimum;
    }else{
        boundaries += '[-$\\infty$';
    }
    if(defined(exclusiveMaximum)) {
        boundaries += ', ' + exclusiveMinimum + ')';
    }else if(defined(maximum)) {
        boundaries += ', ' + maximum + ']';
    }else{
        boundaries += ', +$\\infty$]';
    }
    if(boundaries === '[-$\\infty$, +$\\infty$]' ){
        boundaries = 'None'
    }

    // if the object values are restricted to an enum add link to enum in boundaries
    if (defined(properties.enum)) {
        var linkName = 'restriction-'+(schema.title + name).toLowerCase()
        boundaries = 'Enum[<i class=\"fas fa-info-circle\"></i>](#' + linkName + ')';
        //boundaries = '[Enum](#'+ linkName + ')';
    }

    return boundaries;

}

/**
 * @function getPropertyType
 * Determines the type of of a property, taking into account that it
 * might be defined within an anyOf property for enum values.
 * @param  {object} schema The schema object that may be of an enum type.
 * @return {string} The type of the enum
 */
function getPropertyType(schema) {

    // If the type name was inserted in the schema based on a $ref,
    // then this type name will be returned
    var typeName = schema.typeName;
    if (defined(typeName)) {
        return typeName;
    }

    // For non-anyOf enum types, the type will be a regular property on the object.
    var type = schema.type;
    if (defined(type)) {
        return type;
    }

    // For enums stored using anyOf, we'll need to get it from within anyOf.
    var propertyAnyOf = schema['anyOf'];
    if (!defined(propertyAnyOf)) {
        return undefined;
    }

    // The type will be defined as one of the objects contained within
    // the anyOf property, and the only property within that object with
    // a property name "type" indicating the type of the enum value.
    type = propertyAnyOf[0]['type'];
    var length = propertyAnyOf.length;
    //console.log(propertyAnyOf);
    for (var i = 1; i < length; ++i) {
        type += '`<br>`' + propertyAnyOf[i]['type'];
    }

    return type;
}

/**
* @function autoLinkDescription
* This will take a string that describes a type that may potentially reference _other_ types, and then
* automatically add markdown link refences to those other types inline. This is an admittedly simple
* (and potentially buggy) approach to the problem, but seems sufficient.
* @param  {string} description The string that should be auto-linked
* @param  {string[]} knownTypes  Array of known strings that are types that should be auto-linked if found.
* If there are multiple types with the same starting root string, it's imperative that the array is sorted such that the longer names are ordered first.
* @param  {string} autoLink Enum value indicating how the auto-linking should be handled.
* @return {string} The auto-linked description.
*/
function autoLinkDescription(description, knownTypes, autoLink) {
    for (var type in knownTypes) {
        description = style.linkType(description, type, autoLink);
    }

    return description;
}
