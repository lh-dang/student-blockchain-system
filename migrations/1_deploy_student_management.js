const StudentManagement = artifacts.require("StudentManagement");

module.exports = function (deployer) {
  deployer.deploy(StudentManagement);
};
