// client/src/utils/slugify.js

export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // remove non-word characters
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/--+/g, '-');        // remove duplicate hyphens
};
