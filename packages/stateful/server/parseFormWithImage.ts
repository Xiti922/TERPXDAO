import { promises as fs } from 'fs'

import { Fields, Files, IncomingForm } from 'formidable'
import { NextApiRequest } from 'next'

export const parseFormWithImage = async (
  req: NextApiRequest
): Promise<{
  fields: Record<string, string | undefined>
  imageData: Buffer
  mimetype: string
}> => {
  // Get fields and files from form.
  const { fields: _fields, files: _files } = await new Promise<{
    fields: Fields
    files: Files
  }>((resolve, reject) => {
    new IncomingForm().parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        resolve({ fields, files })
      }
    })
  })

  // Flatten files since a value in this object may be an array of files.
  const files = Object.values(_files).flat()

  // Make sure there is only one file.
  if (files.length === 0) {
    throw new Error('No files found.')
  } else if (files.length > 1) {
    throw new Error('Too many files found.')
  }

  const file = files[0]

  // Makes sure file is an image.
  if (!file.mimetype?.startsWith('image')) {
    throw new Error('Only images are supported.')
  }

  // Select only string fields.
  const fields = Object.entries(_fields).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)
  // Read image data from temporarily uploaded location.
  const imageData = await fs.readFile(files[0].filepath)

  return {
    fields,
    imageData,
    mimetype: file.mimetype,
  }
}
