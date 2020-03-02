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
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNULL: false,
            defaultValue: false,
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