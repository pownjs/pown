const { Bar } = require('../lib/bar')

const b = new Bar()

b.start(100, 0)

let i = 1

const t = () => {
    b.update(i)

    if (i === 100) {
        b.stop()
    }
    else {
        setTimeout(t, 100)
    }

    i += 1
}

t()
