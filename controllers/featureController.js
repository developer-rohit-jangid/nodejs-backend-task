const { body, validationResult } = require('express-validator/check')
const jsonpatch = require('fast-json-patch')
const sharp = require('sharp')
const download = require('image-downloader')
const { fileExtension } = require('../middleware/customMiddleware')

const imageTypes = ['jpg', 'tif', 'gif', 'png', 'svg']

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

exports.create_thumbnail_post = (req, res, next) => {
  const { imageUrl } = req.body
  const imageUrlExt = fileExtension(imageUrl).toLowerCase()

  if (imageTypes.includes(imageUrlExt)) {
    const options = {
      url: imageUrl,
      dest: './public/images/original/',
    }
    const resizeFolder = './public/images/resized/'

    download.image(options)
      .then(({ filename }) => {
        sharp(filename)
          .resize(50, 50)
          .toFile(`${resizeFolder}output.${imageUrlExt}`, (err) => {
            if (err) { return next(err) }
            return res.json({
              converted: true, user: req.user.username, success: 'Image has been resized', thumbnail: resizeFolder,
            })
          })
      })
      .catch(() => {
        res.status(400).json({ error: 'Oops something went wrong. Kindly check your image url and try again' })
      })
  } else {
    res.status(400).json({ error: `We only handle image files with extensions - ${[...imageTypes]}` })
  }
}