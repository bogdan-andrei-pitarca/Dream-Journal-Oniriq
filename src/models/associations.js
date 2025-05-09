const Dream = require('./Dream');
const Tag = require('./Tag');

Dream.belongsToMany(Tag, { through: 'DreamTags' });
Tag.belongsToMany(Dream, { through: 'DreamTags' });

module.exports = { Dream, Tag };