const { body, validationResult } = require('express-validator/check')
const jsonpatch = require('fast-json-patch')


exports.patch_json_patch = [
  body('jsonObject', 'JSON object must not be empty.').isLength({ min: 1 }),
  body('jsonPatchObject', 'JSON patch object must not be empty.').isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const jsonObject = JSON.parse(req.body.jsonObject)
    const jsonPatchObject = JSON.parse(req.body.jsonPatchObject)

    const patchedObject = jsonpatch.applyPatch(jsonObject, jsonPatchObject).newDocument
    res.json({ patchedObject })
  },
]
