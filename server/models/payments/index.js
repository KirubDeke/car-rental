module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("chappa", "paypal"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Bookings",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", 
        key: "id",
      },
    },
    tx_ref: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paidAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Payment;
};
