module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        title: {
            type: DataTypes.STRING(30),
            allowNULL: false,
            unique: true,
        },
    },{
        timestamp: false,
        paranoid: true,
        underscored: false,
    });
};