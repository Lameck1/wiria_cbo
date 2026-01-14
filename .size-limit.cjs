module.exports = [
  {
    name: 'Main bundle',
    path: 'dist/assets/index-*.js',
    limit: '300 KB',
    gzip: true
  },
  {
    name: 'Vendor bundle',
    path: 'dist/assets/vendor-*.js',
    limit: '200 KB',
    gzip: true
  },
  {
    name: 'CSS',
    path: 'dist/assets/*.css',
    limit: '50 KB',
    gzip: true
  }
];
