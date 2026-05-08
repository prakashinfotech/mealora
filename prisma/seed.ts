import { main } from './seed/index'

main().catch((e) => {
  console.error(e)
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
})
