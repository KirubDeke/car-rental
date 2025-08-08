module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
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
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
    },
  });
  return Booking;
};
