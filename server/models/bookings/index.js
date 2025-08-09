module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pickupDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalDate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    fleetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fleets",
        key: "id",
      },
    },
  });
  return Booking;
};
