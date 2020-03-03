module.exports = (sequelize, DataTypes) => {
    return sequelize.define('todotags', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        todoId: DataTypes.INTEGER,
        tagId: DataTypes.INTEGER
    },{
        timestamp: false,
        underscored: false,
    });
};