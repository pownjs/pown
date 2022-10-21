const { Table } = require('../lib/table')

const t1 = new Table()

t1.push([1, 2, 3, 4, 5])
t1.push([1, 2, 3, 4, 5])
t1.push([1, 2, 3, 4, 5])

console.log(t1.toString())

const t2 = new Table()

t2.push({ 'a': 'b', 'c': 'd' })

console.log(t2.toString())
