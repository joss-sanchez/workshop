/**
 * Take only specified keys of the object passed as argument
 * @param {Object} obj to take keys from
 * @param {Array<String>} keys Array of Strings that contains the keys to get from the object
 */
function pick(obj, keys) {
  return Object.keys(obj)
    .filter(i => keys.includes(i))
    .reduce((acc, key) => {
      acc[key] = obj[key]
      return acc
    }, {})
}

/**
 * Returns a JSON object with the content of the common and specific translations of this project
 * @param {Array<string>} paths If specified, pick only these paths from the lang files
 */
function convertDictionaryToObject(paths = []) {
  const langKeys = ['en', 'es']
  const vk = ['AR', 'CL', 'CO', 'CR', 'DO', 'ES', 'KE', 'MX', 'NG', 'PA', 'PE', 'US', 'ZA']

  return {
    // Iterate over the langs
    ...langKeys.reduce((accLang, lang) => {
      let langCommon = require(`../languages/${lang}/common.js`).default
      if (paths && paths.length) {
        langCommon = pick(langCommon, paths)
      }

      return {
        // adds the previous obeject
        ...accLang,
        // create key-value pair of lang and common & locale
        [lang]: {
          // get the common file
          common: langCommon,
          // iterate over the versions keys
          locale: {
            ...vk.reduce((accVer, ver) => {
              let langVer = require(`../languages/${lang}/locale/${lang}_${ver}.js`).default
              if (paths && paths.length) {
                langVer = pick(langVer, paths)
              }

              return {
                // adds the previous obeject
                ...accVer,
                // create the key-value pair with the name of the file and its content
                [`${lang}_${ver}`]: langVer,
              }
            }, {}),
          },
        },
      }
    }, {}),
  }
}

export {
  // methods
  convertDictionaryToObject,
}
