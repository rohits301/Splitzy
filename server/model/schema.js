const mongoose = require('mongoose');
const logger = require('../helper/logger');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 50,
  wtimeoutMS: 2500,
}).then(() => {
  logger.info('DB Connection Established');
  console.log('DB Connected');
}).catch((err) => {
  logger.error(`DB Connection Fail | ${err.stack}`);
  console.log(err);
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  groupDescription: {
    type: String,
  },
  groupCurrency: {
    type: String,
    default: 'INR',
  },
  groupOwner: {
    type: String,
    required: true,
  },
  groupMembers: {
    type: Array,
    required: true,
  },
  groupCategory: {
    type: String,
    default: 'Others',
  },
  groupTotal: {
    type: Number,
    default: 0,
  },
  split: {
    type: Array,
  },
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
  },
  expenseName: {
    type: String,
    required: true,
  },
  expenseDescription: {
    type: String,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
  expenseCategory: {
    type: String,
    default: 'Others',
  },
  expenseCurrency: {
    type: String,
    default: 'INR',
  },
  expenseDate: {
    type: Date,
    default: Date.now,
  },
  expenseOwner: {
    type: String,
    required: true,
  },
  expenseMembers: {
    type: Array,
    required: true,
  },
  expensePerMember: {
    type: Number,
    required: true,
  },
  expenseType: {
    type: String,
    default: 'Cash',
  },
}, { timestamps: true });

const settlementSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
  },
  settleTo: {
    type: String,
    required: true,
  },
  settleFrom: {
    type: String,
    required: true,
  },
  settleDate: {
    type: String,
    required: true,
  },
  settleAmount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports.User = mongoose.model('User', userSchema);
module.exports.Group = mongoose.model('Group', groupSchema);
module.exports.Expense = mongoose.model('Expense', expenseSchema);
module.exports.Settlement = mongoose.model('Settlement', settlementSchema);