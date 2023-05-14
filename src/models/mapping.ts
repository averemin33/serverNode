import { DataTypes } from 'sequelize';
import { sequelize } from '../bd.js';

// fileds ============================================
const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  number: { type: DataTypes.STRING, unique: true },
  login: { type: DataTypes.STRING, unique: true },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

export default User;
