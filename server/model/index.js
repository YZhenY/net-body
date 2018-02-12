var masses = [];

module.exports = {
    newMass: function(data) {
        console.log('New Mass of ' + data.mass);
        masses.push(data);
    },
    setSun: function(data) {
        console.log('Setting Sun');
        return masses[0];
    }
}