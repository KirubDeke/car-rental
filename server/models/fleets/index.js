module.exports = (sequelize, DataTypes) => {
  const Fleet = sequelize.define("Fleet", {
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: DataTypes.STRING,
    year: DataTypes.INTEGER,
    plateNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fuelType: DataTypes.STRING,
    seats: DataTypes.INTEGER,
    transmission: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    bookedDates: {
      type: DataTypes.JSON,
      defaultValue: [],
      index: true
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  return Fleet;
};
