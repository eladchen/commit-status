// --projectsGlobs
// take the values and expand them using some glob library
// remove --projectsGlobs from the argv list
// pass the expended values to --projects (add to existing values)

// option #2
// look for --projects and if it exists, try replacing the values
// by expanding them (assume they're globs)

// option #3
// perhaps there is a way to specify path to projects
// and condition it for when CI === true / during commit hooks

// see https://github.com/facebook/jest/pull/7696/commits/cfe4931a4dc3f3e12cd034d3338c2d2a9c6d9c06
