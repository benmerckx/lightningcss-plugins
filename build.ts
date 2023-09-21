await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist'
}).then(res => {
  if (!res.success) res.logs.map(log => console.log(log))
})
