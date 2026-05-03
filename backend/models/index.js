const User = require('./User');
const Event = require('./Event');
const Resource = require('./Resource');
const { EventResource, Registration } = require('./associations');

// Associations
Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Event, { foreignKey: 'created_by' });

Event.belongsToMany(Resource, { through: EventResource, foreignKey: 'event_id', as: 'resources' });
Resource.belongsToMany(Event, { through: EventResource, foreignKey: 'resource_id' });

Event.hasMany(EventResource, { foreignKey: 'event_id' });
EventResource.belongsTo(Resource, { foreignKey: 'resource_id' });

Event.belongsToMany(User, { through: Registration, foreignKey: 'event_id', as: 'students' });
User.belongsToMany(Event, { through: Registration, foreignKey: 'student_id', as: 'registeredEvents' });

Registration.belongsTo(Event, { foreignKey: 'event_id' });
Registration.belongsTo(User, { foreignKey: 'student_id' });

module.exports = { User, Event, Resource, EventResource, Registration };
