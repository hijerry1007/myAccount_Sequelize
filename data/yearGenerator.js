let year = []
let today = new Date();
for (let i = 2010; i < today.getFullYear() + 1; i++) {
  year.push({ "year": `${i}` })
}

module.exports = year