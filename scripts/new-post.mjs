import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'
import path from 'path'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import slugify from 'slugify'

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const argv = yargs(hideBin(process.argv)).option('title', {
  alias: 't',
  describe: 'Title of the blog post',
  demandOption: true,
  type: 'string',
}).argv

// Function to format the current date in YYYY-MM-DD format
function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Function to create a slug from the title
function createSlug(title) {
  return slugify(title, { lower: true })
}

// Function to scaffold a new blog post
function scaffoldBlogPost(title) {
  const currentDate = getCurrentDate()
  const slug = createSlug(title)
  const fileName = `${currentDate}-${slug}.md`
  const filePath = path.join(
    __dirname,
    '..',
    'src',
    'content',
    'blog',
    fileName,
  )

  // Front matter for the Markdown file
  const frontMatter = `---
categories:
comments: true
description:
  WON'T_YOU_FILL_ME_IN
pubDate: "${new Date().toISOString()}"
title: "${title}"
---

`

  // Create the Markdown file with front matter
  fs.writeFileSync(filePath, frontMatter)

  console.log(`Blog post scaffolded successfully at: ${filePath}`)
}

// Scaffold a new blog post with the provided title
scaffoldBlogPost(argv.title)
