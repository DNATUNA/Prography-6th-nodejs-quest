module.exports = (sequelize, DataTypes) => {
    return sequelize.define('todo', {
        title: {
            type: DataTypes.STRING,
            allowNULL: false,
            unique: false,
        },
        description: {
            type: DataTypes.STRING(300),
            allowNULL: false,
            unique: false,
        },
        isComleted: {
            type: DataTypes.BOOLEAN,
            defautlValue: false,
            allowNULL: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNULL: false,
            defautlValue: sequelize.literal('now()'),
        },
    },{
        timestamp: false,
        paranoid: true,
        underscored: false,
    });
};