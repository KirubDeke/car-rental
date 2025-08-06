module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user"
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return User;
}