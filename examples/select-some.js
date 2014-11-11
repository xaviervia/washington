var example = require("../washington")

example("Select some")
example("Other not")
example("Select many")

example.go({
  match: /Select/
})
