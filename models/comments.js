module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comments', {
        contents: {
            type: DataTypes.STRING,
            allowNULL: false,
            unique: false,
        },
    },{
        timestamp: false,
        underscored: false,
    });
};