// Read the same complete UTF-8 fixture and sum its integer `value` field.
import { readFileSync } from "node:fs"

let records = 0
let total = 0
for (const line of readFileSync(process.argv[2], "utf8").split("\n")) {
  if (line) {
    total += JSON.parse(line).value
    records++
  }
}
console.log(JSON.stringify({ records, sum: total }))
