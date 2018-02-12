var masses = [];

module.exports = {
    newMass: function(data) {
        console.log('New Mass of ' + data.mass);
        masses.push(data);
    }
}