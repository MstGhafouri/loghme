module.exports = string =>
  string
    .replace(/[^a-z0-9_\s-ءاأإآؤئبتثجحخدذرزسشصضطظعغفقكلمنهويةى]#u/, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
