#!/usr/bin/env node

var fuse = require('fuse-bindings')
var mnt = process.argv[2]

if (!mnt) {
  console.log('Usage: buttsfs [mnt]')
  process.exit(1)
}

fuse.mount(mnt, {
  options: ['direct_io'],
  readdir: function (path, cb) {
    console.log('readdir(%s)', path)
    if (path === '/') return cb(0, ['important.txt'])
    cb(0)
  },
  getattr: function (path, cb) {
    if (path === '/') {
      cb(0, {
        mtime: new Date(),
        atime: new Date(),
        ctime: new Date(),
        size: 100,
        mode: 040755,
        uid: process.getuid(),
        gid: process.getgid()
      })
      return
    }

    cb(0, {
      mtime: new Date(),
      atime: new Date(),
      ctime: new Date(),
      size: 0,
      mode: 0100644,
      uid: process.getuid(),
      gid: process.getgid()
    })
  },
  open: function (path, flags, cb) {
    cb(0, 42)
  },
  read: function (path, fd, buf, len, pos, cb) {
    buf.write('butts\n')
    cb(6)
  }
})

process.on('SIGINT', function () {
  fuse.unmount('./mnt', function () {
    process.exit()
  })
})
