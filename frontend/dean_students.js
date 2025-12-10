let workbookData = null;
let jsonData = null;
let web3;
let contract;
let currentAccount = null;

const contractAddress = "0x0e068999591e59D0eAbff3491E2CD449B2B7D9f2";

// ============ HELPER FUNCTIONS ============
/**
 * Chuẩn hóa ngày sinh về định dạng dd/mm/yyyy
 */
function normalizeDOB(dob) {
  if (!dob) return '';
  if (typeof dob === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
    return dob;
  }
  if (typeof dob === 'number') {
    let date;
    if (dob > 1 && dob < 100000) {
      const excelEpoch = new Date(1899, 11, 30);
      date = new Date(excelEpoch.getTime() + dob * 86400000);
    } else if (dob > 100000) {
      date = new Date(dob);
    } else {
      return String(dob);
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  if (typeof dob === 'string') {
    const isoMatch = dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }
  }
  return String(dob);
}

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"department","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DeanInfoAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"diplomaHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaIssued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"address","name":"revokedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"approvedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"rejectedBy","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"applicationHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":true,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"programName","type":"string"},{"indexed":false,"internalType":"uint256","name":"minCredits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minGPA","type":"uint256"},{"indexed":false,"internalType":"address","name":"createdBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"semester","type":"string"},{"indexed":false,"internalType":"uint256","name":"courseCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"address","name":"submittedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"SemesterGradesSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentAssignedToProgram","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentInfoUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentRegistered","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allDeanAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allProgramIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allStudentIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"classToProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deans","outputs":[{"internalType":"address","name":"deanAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"diplomaIssuedStudents","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"diplomas","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"electiveGroups","outputs":[{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"graduationApplicants","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"graduationApplications","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDean","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programCourses","outputs":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programElectiveGroupIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"programs","outputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"address","name":"createdBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"semesterGrades","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"submittedAt","type":"uint256"},{"internalType":"address","name":"submittedBy","type":"address"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentIdExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"studentSemesters","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"students","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletToStudentId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"addDeanWithInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getDeanInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getAllActiveDeans","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDeans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"setDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"registerStudent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"updateStudentInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"string[]","name":"dobs","type":"string[]"},{"internalType":"string[]","name":"cccds","type":"string[]"},{"internalType":"string[]","name":"phones","type":"string[]"},{"internalType":"string[]","name":"emails","type":"string[]"},{"internalType":"string[]","name":"hometowns","type":"string[]"},{"internalType":"string[]","name":"classes","type":"string[]"},{"internalType":"string[]","name":"majors","type":"string[]"},{"internalType":"string[]","name":"majorCodes","type":"string[]"},{"internalType":"string[]","name":"departments","type":"string[]"},{"internalType":"string[]","name":"schools","type":"string[]"},{"internalType":"string[]","name":"programsArray","type":"string[]"},{"internalType":"address[]","name":"walletAddresses","type":"address[]"}],"name":"batchRegisterStudents","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"uint16[]","name":"grades","type":"uint16[]"},{"internalType":"string[]","name":"letterGrades","type":"string[]"},{"internalType":"string[]","name":"instructors","type":"string[]"}],"name":"submitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"semesters","type":"string[]"},{"internalType":"string[][]","name":"courseIdsArray","type":"string[][]"},{"internalType":"string[][]","name":"courseNamesArray","type":"string[][]"},{"internalType":"uint8[][]","name":"creditsArray","type":"uint8[][]"},{"internalType":"uint16[][]","name":"gradesArray","type":"uint16[][]"},{"internalType":"string[][]","name":"letterGradesArray","type":"string[][]"},{"internalType":"string[][]","name":"instructorsArray","type":"string[][]"}],"name":"batchSubmitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentInfo","outputs":[{"components":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct StudentManagement.StudentInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentSemesters","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterGrades","outputs":[{"internalType":"string","name":"","type":"string"},{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade[]","name":"","type":"tuple[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterCourseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getCourseGrade","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalStudents","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStudentIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"}],"name":"createProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"}],"name":"addCoursesToProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"string[]","name":"courseIds","type":"string[]"}],"name":"addElectiveGroup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupNames","type":"string[]"},{"internalType":"uint8[]","name":"electiveRequiredCredits","type":"uint8[]"},{"internalType":"uint256[]","name":"electiveGroupCourseStartIdx","type":"uint256[]"},{"internalType":"uint256[]","name":"electiveGroupCourseCount","type":"uint256[]"}],"name":"createProgramComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"}],"name":"updateProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"className","type":"string"}],"name":"setProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"classNames","type":"string[]"}],"name":"batchSetProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgram","outputs":[{"internalType":"string","name":"_programName","type":"string"},{"internalType":"uint256","name":"_totalCredits","type":"uint256"},{"internalType":"uint256","name":"_minCredits","type":"uint256"},{"internalType":"uint256","name":"_minGPA","type":"uint256"},{"internalType":"uint256","name":"_courseCount","type":"uint256"},{"internalType":"bool","name":"_isActive","type":"bool"},{"internalType":"uint256","name":"_createdAt","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramCourses","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"string[]","name":"prerequisites","type":"string[]"},{"internalType":"string[]","name":"corequisites","type":"string[]"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"internalType":"struct StudentManagement.ProgramCourse[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"courseId","type":"string"}],"name":"getProgramCourse","outputs":[{"internalType":"string","name":"_courseId","type":"string"},{"internalType":"string","name":"_courseName","type":"string"},{"internalType":"uint256","name":"_credits","type":"uint256"},{"internalType":"bool","name":"_isRequired","type":"bool"},{"internalType":"string[]","name":"_prerequisites","type":"string[]"},{"internalType":"string[]","name":"_corequisites","type":"string[]"},{"internalType":"uint256","name":"_minCreditsRequired","type":"uint256"},{"internalType":"string","name":"_groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"}],"name":"getElectiveGroup","outputs":[{"internalType":"string","name":"_groupId","type":"string"},{"internalType":"string","name":"_groupName","type":"string"},{"internalType":"uint256","name":"_requiredCredits","type":"uint256"},{"internalType":"string[]","name":"_courseIds","type":"string[]"},{"internalType":"bool","name":"_exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramElectiveGroupIds","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalPrograms","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getProgramIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"className","type":"string"}],"name":"getProgramByClass","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"mintDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"submitGraduationApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"approveGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"rejectGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getGraduationApplication","outputs":[{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notesStr","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalGraduationApplications","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getGraduationApplicantByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"}],"name":"verifyDiploma","outputs":[{"internalType":"bool","name":"valid","type":"bool"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiploma","outputs":[{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"revokeDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"hasDiploma","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"isDiplomaRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiplomaRevokeInfo","outputs":[{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"address","name":"revokedBy","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDiplomasIssued","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getStudentIdByWallet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"address","name":"wallet","type":"address"}],"name":"verifyStudentWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true}];

// Kết nối MetaMask
async function connectWallet() {
  try {
    if (typeof window.ethereum === 'undefined') {
      alert('⚠️ Vui lòng cài đặt MetaMask!');
      return;
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    currentAccount = accounts[0];
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    const owner = await contract.methods.owner().call();
    const isDean = await contract.methods.isDean(currentAccount).call();

    let roleText = '';
    if (currentAccount.toLowerCase() === owner.toLowerCase()) {
      roleText = '<strong style="color: #d9534f;">👑 Owner</strong>';
    } else if (isDean) {
      roleText = '<strong style="color: #5cb85c;">🎓 Dean</strong>';
    } else {
      roleText = '<strong style="color: #f0ad4e;">⚠️ Không có quyền</strong>';
    }

    document.getElementById('accountAddress').textContent = currentAccount;
    document.getElementById('accountRole').innerHTML = roleText;
    document.getElementById('walletInfo').style.display = 'block';
    document.getElementById('connectBtn').textContent = '✅ Đã kết nối';
    document.getElementById('connectBtn').disabled = true;
    document.getElementById('walletSection').className = 'success-box';

    window.ethereum.on('accountsChanged', function (accounts) {
      if (accounts.length === 0) {
        location.reload();
      } else {
        currentAccount = accounts[0];
        location.reload();
      }
    });

  } catch (error) {
    console.error(error);
    alert('❌ Lỗi kết nối MetaMask: ' + error.message);
  }
}

// Upload và parse file
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Kiểm tra thư viện XLSX đã load chưa
  if (typeof XLSX === 'undefined') {
    document.getElementById('uploadStatus').innerHTML = 
      '<div class="error-box">❌ Lỗi: Thư viện XLSX chưa được load. Vui lòng tải lại trang.</div>';
    alert('❌ Lỗi: Thư viện XLSX chưa được load. Vui lòng tải lại trang.');
    return;
  }

  document.getElementById('fileName').textContent = file.name;
  document.getElementById('uploadStatus').innerHTML = '<div class="info-box">⏳ Đang đọc file...</div>';

  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      workbookData = workbook;
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonArray = XLSX.utils.sheet_to_json(sheet);
      
      if (jsonArray.length === 0) {
        throw new Error('File không có dữ liệu!');
      }

      displayPreview(jsonArray);
      
      document.getElementById('uploadStatus').innerHTML = `
        <div class="success-box">
          ✅ Đọc file thành công!<br>
          <strong>Sheet:</strong> ${sheetName}<br>
          <strong>Số dòng:</strong> ${jsonArray.length}
        </div>
      `;
      
      document.getElementById('previewSection').style.display = 'block';
      
    } catch (err) {
      console.error(err);
      document.getElementById('uploadStatus').innerHTML = `
        <div class="error-box">❌ Lỗi đọc file: ${err.message}</div>
      `;
    }
  };

  reader.readAsArrayBuffer(file);
}

// Hiển thị preview
function displayPreview(data) {
  if (data.length === 0) return;

  const uniqueStudents = [...new Set(data.map(row => row.F_MASV))].filter(Boolean);
  const uniqueSemesters = [...new Set(data.map(row => row.NHHK))].filter(Boolean);
  
  document.getElementById('previewStats').innerHTML = `
    <div class="info-box">
      <strong>📊 Thống kê:</strong><br>
      • Tổng số dòng: <strong>${data.length}</strong><br>
      • Số sinh viên: <strong>${uniqueStudents.length}</strong><br>
      • Học kỳ: <strong>${uniqueSemesters.join(', ')}</strong>
    </div>
  `;

  const columns = Object.keys(data[0]);
  
  let headerHTML = '<tr>';
  columns.forEach(col => {
    headerHTML += `<th>${col}</th>`;
  });
  headerHTML += '</tr>';
  document.getElementById('previewHeader').innerHTML = headerHTML;

  let bodyHTML = '';
  const previewRows = data.slice(0, 10);
  
  previewRows.forEach(row => {
    bodyHTML += '<tr>';
    columns.forEach(col => {
      bodyHTML += `<td>${row[col] !== undefined ? row[col] : ''}</td>`;
    });
    bodyHTML += '</tr>';
  });
  
  if (data.length > 10) {
    bodyHTML += `<tr><td colspan="${columns.length}" style="text-align: center; font-style: italic; color: #666;">... và ${data.length - 10} dòng nữa</td></tr>`;
  }
  
  document.getElementById('previewBody').innerHTML = bodyHTML;
}

// Convert sang JSON format cho blockchain
function convertToJSON() {
  const sheetName = workbookData.SheetNames[0];
  const sheet = workbookData.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(sheet);

  console.log(`📊 Excel loaded: ${rawData.length} rows`);

  const studentSemesterGroups = {};
  const errorRows = [];
  
  rawData.forEach((row, rowIndex) => {
    const studentId = row.F_MASV;
    const semester = row.NHHK;
    const courseId = row.F_MAMH;
    
    if (!studentId || !semester) return;
    
    // Bỏ qua môn SHCVHT (Sinh hoạt với cố vấn học tập) - không tính vào điểm
    if (courseId === 'SHCVHT' || (row.F_TENMHVN && row.F_TENMHVN.includes('Sinh hoạt'))) {
      return; // Skip this course
    }

    const key = `${studentId}_${semester}`;

    if (!studentSemesterGroups[key]) {
      studentSemesterGroups[key] = {
        studentId: studentId,
        studentName: row.F_TENSV || `Sinh viên ${studentId}`,
        semester: semester,
        class: row.F_TENLOP,
        records: []
      };
    }

    let grade = null;
    if (row.F_DIEM2 !== undefined && row.F_DIEM2 !== '') {
      grade = parseFloat(row.F_DIEM2);
      
      // Validate grade
      if (isNaN(grade)) {
        const error = `Dòng ${rowIndex + 2}: Điểm không hợp lệ cho SV ${studentId}, môn ${courseId}: "${row.F_DIEM2}"`;
        console.warn(`⚠️ ${error}`);
        errorRows.push(error);
        grade = null;
      } else {
        // Xử lý điểm âm (sinh viên bỏ thi) -> chuyển thành 0
        if (grade < 0) {
          console.warn(`⚠️ Dòng ${rowIndex + 2}: SV ${studentId}, môn ${courseId} - Điểm âm (${grade}) -> Chuyển thành 0 (bỏ thi)`);
          grade = 0;
        }
        // Giới hạn điểm tối đa là 10
        if (grade > 10) {
          console.warn(`⚠️ Dòng ${rowIndex + 2}: SV ${studentId}, môn ${courseId} - Điểm > 10 (${grade}) -> Giới hạn về 10`);
          grade = 10;
        }
      }
    }
    
    // Log first few rows for debugging
    if (rowIndex < 3) {
      console.log(`Row ${rowIndex + 2}: ${studentId} - ${courseId} - Grade: ${grade}`);
    }

    // Chuyển đổi điểm hệ 10 sang hệ 4 và chữ
    let grade4 = null;
    let letterGrade = null;
    if (grade !== null) {
      // Hệ chữ và hệ 4
      if (grade >= 9.0) {
        letterGrade = 'A';
        grade4 = 4.0;
      } else if (grade >= 8.0) {
        letterGrade = 'B+';
        grade4 = 3.5;
      } else if (grade >= 7.0) {
        letterGrade = 'B';
        grade4 = 3.0;
      } else if (grade >= 6.5) {
        letterGrade = 'C+';
        grade4 = 2.5;
      } else if (grade >= 5.5) {
        letterGrade = 'C';
        grade4 = 2.0;
      } else if (grade >= 5.0) {
        letterGrade = 'D+';
        grade4 = 1.5;
      } else if (grade >= 4.0) {
        letterGrade = 'D';
        grade4 = 1.0;
      } else {
        letterGrade = 'F';
        grade4 = 0.0;
      }
    } else {
      letterGrade = 'P';
      grade4 = null;
    }

    studentSemesterGroups[key].records.push({
      courseId: row.F_MAMH,
      courseName: row.F_TENMHVN,
      credits: parseInt(row.F_DVHT) || 0,
      grade: grade,
      grade4: grade4,
      letterGrade: letterGrade
    });
  });

  const jsonArray = Object.entries(studentSemesterGroups).map(([key, student]) => {
    const coursesWithGrades = student.records.filter(r => r.grade !== null && r.credits > 0);
    
    let averageGrade = null;
    if (coursesWithGrades.length > 0) {
      const totalPoints = coursesWithGrades.reduce((sum, r) => sum + (r.grade * r.credits), 0);
      const totalCredits = coursesWithGrades.reduce((sum, r) => sum + r.credits, 0);
      averageGrade = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
    }

    return {
      studentId: student.studentId,
      studentName: student.studentName,
      semester: student.semester,
      class: student.class,
      records: student.records,
      summary: {
        totalCourses: student.records.length,
        totalCredits: student.records.reduce((sum, r) => sum + r.credits, 0),
        averageGrade: averageGrade ? parseFloat(averageGrade) : null,
        passedCourses: student.records.filter(r => r.grade === null || r.grade >= 4.0).length,
        failedCourses: student.records.filter(r => r.grade !== null && r.grade < 4.0).length
      },
      metadata: {
        createdAt: new Date().toISOString(),
        source: 'CTU Academic System',
        version: '2.0'
      }
    };
  });

  jsonData = jsonArray;
  
  let summary = `
    <div class="success-box">
      <h3>✅ Đã phân tách thành ${jsonArray.length} file JSON riêng biệt</h3>
      <p style="margin: 10px 0;">
        <strong>Quy tắc:</strong> Mỗi file = 1 sinh viên + 1 học kỳ = 1 transaction blockchain
      </p>
    </div>
    
    <div class="info-box">
      <h4>📋 Danh sách file sẽ tạo:</h4>
      <table style="margin-top: 10px; font-size: 12px;">
        <tr>
          <th>STT</th>
          <th>File name</th>
          <th>MSSV</th>
          <th>Tên SV</th>
          <th>Học kỳ</th>
          <th>Số môn</th>
          <th>Chi tiết</th>
        </tr>
  `;
  
  jsonArray.forEach((item, index) => {
    summary += `
      <tr>
        <td>${index + 1}</td>
        <td><code>${item.studentId}_${item.semester}.json</code></td>
        <td><strong>${item.studentId}</strong></td>
        <td>${item.studentName}</td>
        <td>${item.semester}</td>
        <td>${item.records.length}</td>
        <td><button onclick="viewStudentDetail(${index})" style="padding: 5px 10px; font-size: 11px; cursor: pointer;">👁️ Xem</button></td>
      </tr>
    `;
  });
  
  summary += '</table></div>';
  summary += `
    <div class="warning-box" style="margin-top: 20px;">
      <h4>📄 Preview file đầu tiên: <code>${jsonArray[0].studentId}_${jsonArray[0].semester}.json</code></h4>
      <pre style="background: white; padding: 10px; border-radius: 5px; overflow-x: auto; max-height: 300px; font-size: 11px;">${JSON.stringify(jsonArray[0], null, 2)}</pre>
    </div>
  `;
  
  document.getElementById('jsonOutput').value = JSON.stringify(jsonArray, null, 2);
  
  const summaryDiv = document.createElement('div');
  summaryDiv.innerHTML = summary;
  summaryDiv.id = 'jsonSummary';
  
  const oldSummary = document.getElementById('jsonSummary');
  if (oldSummary) {
    oldSummary.remove();
  }
  
  const jsonSection = document.getElementById('jsonSection');
  const textarea = document.getElementById('jsonOutput');
  jsonSection.insertBefore(summaryDiv, textarea);
  
  document.getElementById('jsonSection').style.display = 'block';
  document.getElementById('jsonSection').scrollIntoView({ behavior: 'smooth' });
}

// Toggle hiển thị JSON
function toggleJSON() {
  const textarea = document.getElementById('jsonOutput');
  textarea.style.display = textarea.style.display === 'none' ? 'block' : 'none';
}

// Xem chi tiết điểm sinh viên
function viewStudentDetail(index) {
  if (!jsonData || jsonData.length === 0) {
    alert('❌ Vui lòng convert sang JSON trước khi xem chi tiết!');
    return;
  }
  
  if (!jsonData[index]) {
    alert('❌ Không tìm thấy dữ liệu tại vị trí ' + index + '!');
    return;
  }

  const student = jsonData[index];
  
  // Tính điểm trung bình
  const avgGrade = student.summary.averageGrade || 'N/A';
  
  // Tạo bảng điểm chi tiết
  let detailHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
      <div style="background: white; border-radius: 10px; padding: 30px; max-width: 900px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 50px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #667eea;">
          <h2 style="color: #667eea; margin: 0;">📊 Chi tiết điểm sinh viên</h2>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">✕ Đóng</button>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div>
              <strong style="color: #666;">MSSV:</strong> 
              <span style="color: #333; font-weight: 600;">${student.studentId}</span>
            </div>
            <div>
              <strong style="color: #666;">Tên sinh viên:</strong> 
              <span style="color: #333; font-weight: 600;">${student.studentName}</span>
            </div>
            <div>
              <strong style="color: #666;">Học kỳ:</strong> 
              <span style="color: #333; font-weight: 600;">${student.semester}</span>
            </div>
            <div>
              <strong style="color: #666;">Lớp:</strong> 
              <span style="color: #333; font-weight: 600;">${student.class || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px;">📈 Tổng kết học kỳ</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 11px; opacity: 0.9; margin-bottom: 5px;">TỔNG SỐ MÔN</div>
              <div style="font-size: 28px; font-weight: bold;">${student.summary.totalCourses}</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 11px; opacity: 0.9; margin-bottom: 5px;">TỔNG TÍN CHỈ</div>
              <div style="font-size: 28px; font-weight: bold;">${student.summary.totalCredits}</div>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; text-align: center;">
              <div style="font-size: 11px; opacity: 0.9; margin-bottom: 5px;">ĐIỂM TRUNG BÌNH</div>
              <div style="font-size: 28px; font-weight: bold;">${avgGrade}</div>
            </div>
          </div>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); display: flex; justify-content: space-around; font-size: 13px;">
            <div>
              <span style="color: #4ade80;">✅ Đạt: <strong>${student.summary.passedCourses}</strong></span>
            </div>
            <div>
              <span style="color: #f87171;">❌ Trượt: <strong>${student.summary.failedCourses}</strong></span>
            </div>
          </div>
        </div>
        
        <h3 style="color: #667eea; margin-bottom: 15px; font-size: 16px;">📚 Danh sách môn học (${student.records.length} môn)</h3>
        <div style="max-height: 400px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead style="position: sticky; top: 0; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <th style="background: #667eea; color: white; padding: 10px; text-align: left; border: 1px solid #ddd;">STT</th>
                <th style="background: #667eea; color: white; padding: 10px; text-align: left; border: 1px solid #ddd;">Mã MH</th>
                <th style="background: #667eea; color: white; padding: 10px; text-align: left; border: 1px solid #ddd;">Tên môn học</th>
                <th style="background: #667eea; color: white; padding: 10px; text-align: center; border: 1px solid #ddd;">TC</th>
                <th style="background: #667eea; color: white; padding: 10px; text-align: center; border: 1px solid #ddd;">Điểm</th>
                <th style="background: #667eea; color: white; padding: 10px; text-align: center; border: 1px solid #ddd;">Hệ 4</th>
                <th style="background: #667eea; color: white; padding: 10px; text-align: center; border: 1px solid #ddd;">Chữ</th>
              </tr>
            </thead>
            <tbody>
  `;
  
  student.records.forEach((record, i) => {
    const bgColor = i % 2 === 0 ? '#f8f9fa' : 'white';
    const gradeColor = record.grade >= 8 ? '#28a745' : record.grade >= 6.5 ? '#ffc107' : record.grade >= 5 ? '#ff9800' : '#dc3545';
    
    detailHTML += `
      <tr style="background: ${bgColor};">
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${i + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>${record.courseId}</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${record.courseName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${record.credits}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: ${gradeColor};">${record.grade !== null ? record.grade.toFixed(1) : 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #667eea;">${record.grade4 !== null ? record.grade4.toFixed(1) : 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: 600;">${record.letterGrade || 'N/A'}</td>
      </tr>
    `;
  });
  
  detailHTML += `
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e9ecef; display: flex; gap: 10px; justify-content: flex-end;">
          <button onclick="downloadSingleStudentJSON(${index})" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">💾 Tải JSON</button>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">Đóng</button>
        </div>
      </div>
    </div>
  `;
  
  // Thêm vào body
  document.body.insertAdjacentHTML('beforeend', detailHTML);
}

// Tải JSON cho một sinh viên cụ thể
function downloadSingleStudentJSON(index) {
  if (!jsonData || !jsonData[index]) {
    alert('Không tìm thấy dữ liệu!');
    return;
  }
  
  const student = jsonData[index];
  const filename = `${student.studentId}_${student.semester}.json`;
  const content = JSON.stringify(student, null, 2);
  
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Download từng file JSON riêng biệt
function downloadSingleJSON() {
  if (!jsonData || jsonData.length === 0) {
    alert('Chưa có dữ liệu JSON!');
    return;
  }

  jsonData.forEach((item, index) => {
    const fileName = `grades_${item.studentId}_${item.semester}.json`;
    const jsonText = JSON.stringify(item, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    
    setTimeout(() => {
      a.click();
      URL.revokeObjectURL(url);
    }, index * 200);
  });

  document.getElementById('submitResult').innerHTML = `
    <div class="success-box">
      ✅ Đang tải xuống ${jsonData.length} file JSON...<br>
      <small>Nếu browser chặn, hãy cho phép multiple downloads.</small>
    </div>
  `;
}

// Download tất cả file JSON
async function downloadAllJSON() {
  if (!jsonData || jsonData.length === 0) {
    alert('Chưa có dữ liệu JSON!');
    return;
  }

  let downloadScript = '';
  jsonData.forEach((item) => {
    const fileName = `grades_${item.studentId}_${item.semester}.json`;
    downloadScript += `# ${fileName}\n`;
    downloadScript += `cat > "${fileName}" << 'EOF'\n`;
    downloadScript += JSON.stringify(item, null, 2);
    downloadScript += `\nEOF\n\n`;
  });

  const blob = new Blob([downloadScript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `create_json_files.sh`;
  a.click();
  URL.revokeObjectURL(url);

  document.getElementById('submitResult').innerHTML = `
    <div class="info-box">
      ✅ Đã tạo file <code>create_json_files.sh</code><br><br>
      <strong>Cách sử dụng:</strong><br>
      1. Mở terminal trong thư mục đã tải<br>
      2. Chạy: <code>chmod +x create_json_files.sh</code><br>
      3. Chạy: <code>./create_json_files.sh</code><br><br>
      → Sẽ tạo ${jsonData.length} file JSON riêng biệt
    </div>
  `;
}

// Submit lên blockchain
async function submitToBlockchain() {
  if (!jsonData || jsonData.length === 0) {
    document.getElementById('submitResult').innerHTML = `
      <div class="error-box">❌ Chưa có dữ liệu JSON!</div>
    `;
    return;
  }

  document.getElementById('submitResult').innerHTML = `
    <div class="info-box">
      <h3>📊 Thông tin submit</h3>
      <strong>Tổng số:</strong> ${jsonData.length} học kỳ (sinh viên + học kỳ)<br>
      <strong>Mỗi transaction gồm:</strong><br>
      • 1 sinh viên (MSSV)<br>
      • 1 học kỳ<br>
      • Điểm của tất cả môn học trong học kỳ đó<br><br>
      
      <strong>📋 Quy trình:</strong><br>
      ${jsonData.map((item, i) => `
        ${i + 1}. <strong>${item.studentId}</strong> - HK ${item.semester} (${item.records.length} môn)<br>
      `).join('')}
    </div>
    <div class="warning-box" style="margin-top: 20px;">
      <strong>⚠️ LƯU Ý QUAN TRỌNG:</strong><br><br>
      
      <strong style="color: #d9534f;">🚫 KHÔNG CHO PHÉP sửa đổi điểm:</strong><br>
      • Nếu học kỳ đã có điểm, hệ thống sẽ TỪ CHỐI submit<br>
      • Chỉ có thể tạo HỌC KỲ MỚI<br>
      • Vui lòng kiểm tra kỹ dữ liệu trước khi submit<br><br>
      
      <strong>Trước khi submit điểm:</strong><br>
      • Sinh viên phải đã được đăng ký qua <a href="admin_students.html">admin_students.html</a><br>
      • Kiểm tra MSSV chính xác<br>
      • Đảm bảo học kỳ CHƯA được submit trước đó<br><br>
      
      <strong>🚀 BATCH SUBMIT - Thông minh & Tự động</strong><br>
      <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #28a745;">
        ✅ <strong>TỰ ĐỘNG chia nhỏ</strong> nếu dữ liệu quá lớn<br>
        ✅ <strong>Chỉ ký 1-3 lần</strong> thay vì ${jsonData.length} lần<br>
        ✅ <strong>Nhanh hơn 10-100 lần</strong> so với submit từng cái<br>
        ✅ <strong>Tiết kiệm gas</strong> và thời gian<br>
        ✅ <strong>Thông minh</strong> - Tự tối ưu số lượng mỗi batch<br>
        ✅ <strong>Hỗ trợ luận văn 15 tín chỉ</strong>
      </div>
      <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="success" onclick="batchSubmitAll()" style="font-size: 18px; padding: 18px 36px; font-weight: bold;">
          🚀 BATCH SUBMIT THÔNG MINH (${jsonData.length} sinh viên)
        </button>
        <button onclick="testSubmitFirst()" style="background: #17a2b8; font-size: 14px; padding: 12px 24px;">
          🧪 Test submit SV đầu tiên (debug)
        </button>
      </div>
    </div>
  `;
}

// BATCH SUBMIT - GỘP TẤT CẢ VÀO 1 TRANSACTION
async function batchSubmitAll() {
  if (!currentAccount) {
    alert('⚠️ Vui lòng kết nối MetaMask trước!');
    return;
  }

  if (!jsonData || jsonData.length === 0) {
    alert('❌ Chưa có dữ liệu JSON!');
    return;
  }

  const isDean = await contract.methods.isDean(currentAccount).call();
  if (!isDean) {
    alert('❌ Account hiện tại không có quyền Dean!\n\nChỉ Dean mới có thể submit điểm.');
    return;
  }

  const confirmMsg = `🚀 BATCH SUBMIT THÔNG MINH ${jsonData.length} HỌC KỲ\n\n` +
    `✅ TỰ ĐỘNG CHIA NHỎ nếu dữ liệu quá lớn!\n` +
    `✅ CHỈ CẦN KÝ 1-3 LẦN trong MetaMask\n` +
    `✅ NHANH HƠN 10-100 LẦN so với cách cũ\n\n` +
    `📊 Thống kê:\n` +
    `• Số sinh viên: ${jsonData.length}\n` +
    `• Ước tính thời gian: ~10-60 giây\n` +
    `• So sánh cách cũ: ~${Math.ceil(jsonData.length * 15 / 60)} phút\n\n` +
    `⚠️ LƯU Ý:\n` +
    `• Hệ thống sẽ tự động chia batch nếu cần\n` +
    `• Kiểm tra kỹ dữ liệu trước khi submit\n` +
    `• Tất cả học kỳ phải chưa tồn tại\n\n` +
    `Tiếp tục?`;
  
  if (!confirm(confirmMsg)) {
    return;
  }

  document.getElementById('submitResult').innerHTML = `
    <div class="info-box" style="position: sticky; top: 0; z-index: 100; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h3>🚀 BATCH SUBMIT - Đang xử lý...</h3>
      
      <div style="margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <strong>Trạng thái</strong>
          <span id="batchStatus">⏳ Đang chuẩn bị...</span>
        </div>
      </div>

      <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>💡 QUAN TRỌNG:</strong><br>
        • MetaMask sẽ mở popup yêu cầu xác nhận transaction<br>
        • Chỉ cần APPROVE 1 LẦN duy nhất<br>
        • Vui lòng chờ đợi, không đóng trang web
      </div>
    </div>

    <div style="margin-top: 20px;">
      <h4>📝 Chi tiết</h4>
      <div id="batchDetailLog" style="max-height: 500px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <div style="color: #666; text-align: center;">Đang bắt đầu...</div>
      </div>
    </div>
  `;

  const batchStatus = document.getElementById('batchStatus');
  const detailLog = document.getElementById('batchDetailLog');
  const startTime = Date.now();

  try {
    // Bước 1: Kiểm tra sinh viên
    detailLog.innerHTML = '<div>🔍 <strong>Bước 1:</strong> Kiểm tra sinh viên đã đăng ký...</div>';
    batchStatus.textContent = '🔍 Kiểm tra sinh viên...';
    
    const studentsToSubmit = [];
    const alreadyExists = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      const item = jsonData[i];
      
      // Check student exists
      try {
        const studentInfo = await contract.methods.getStudentInfo(item.studentId).call();
        if (!studentInfo.exists) {
          detailLog.innerHTML += `<div style="color: #dc3545;">  ❌ ${i + 1}/${jsonData.length}: ${item.studentId} - CHƯA ĐĂNG KÝ</div>`;
          throw new Error(`❌ Sinh viên ${item.studentId} (${item.studentName}) chưa được đăng ký!\n\nVui lòng đăng ký sinh viên này qua admin_students.html trước khi upload điểm.`);
        }
      } catch (e) {
        if (e.message.includes('CHƯA ĐĂNG KÝ')) {
          throw e;
        }
        // Nếu lỗi khác, coi như sinh viên chưa tồn tại
        detailLog.innerHTML += `<div style="color: #dc3545;">  ❌ ${i + 1}/${jsonData.length}: ${item.studentId} - LỖI KHI KIỂM TRA</div>`;
        throw new Error(`❌ Lỗi khi kiểm tra sinh viên ${item.studentId}: ${e.message}`);
      }
      
      // KIỂM TRA Ở FRONTEND - UX tốt hơn (báo lỗi sớm)
      // Tuy nhiên CONTRACT VẪN KIỂM TRA để đảm bảo tính toàn vẹn (chống sửa đổi điểm)
      // Nếu frontend bỏ qua hoặc bị hack, contract sẽ reject transaction
      try {
        const semData = await contract.methods.semesterGrades(item.studentId, String(item.semester)).call();
        if (semData && semData.exists === true) {
          alreadyExists.push(`${item.studentId} (${item.studentName}) - HK ${item.semester}`);
          detailLog.innerHTML += `<div style="color: #ffc107;">  ⚠️ ${i + 1}/${jsonData.length}: ${item.studentId} - HK ${item.semester} ĐÃ TỒN TẠI (KHÔNG THỂ SỬA ĐIỂM)</div>`;
        } else {
          studentsToSubmit.push(item);
          detailLog.innerHTML += `<div>  ✅ ${i + 1}/${jsonData.length}: ${item.studentId} - HK ${item.semester} OK</div>`;
        }
      } catch (e) {
        // Nếu lỗi khi gọi semesterGrades, coi như chưa tồn tại
        studentsToSubmit.push(item);
        detailLog.innerHTML += `<div>  ✅ ${i + 1}/${jsonData.length}: ${item.studentId} - HK ${item.semester} OK (new)</div>`;
      }
    }
    
    if (studentsToSubmit.length === 0) {
      detailLog.innerHTML += '<div class="warning-box" style="margin-top: 15px;"><strong>⚠️ Tất cả học kỳ đã tồn tại!</strong><br>';
      detailLog.innerHTML += '<em>Hệ thống KHÔNG CHO PHÉP sửa đổi điểm đã submit để đảm bảo tính toàn vẹn dữ liệu blockchain.</em><br><br>';
      alreadyExists.forEach(s => {
        detailLog.innerHTML += `• ${s}<br>`;
      });
      detailLog.innerHTML += '</div>';
      batchStatus.textContent = '⚠️ Không có dữ liệu mới';
      return;
    }
    
    if (alreadyExists.length > 0) {
      detailLog.innerHTML += '<div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px;">';
      detailLog.innerHTML += `<strong>⚠️ Bỏ qua ${alreadyExists.length} học kỳ đã tồn tại (KHÔNG THỂ SỬA ĐIỂM):</strong><br>`;
      alreadyExists.forEach(s => {
        detailLog.innerHTML += `• ${s}<br>`;
      });
      detailLog.innerHTML += '</div>';
    }
    
    // Bước 2: Chuẩn bị dữ liệu
    detailLog.innerHTML += `<div style="margin-top: 15px;">📦 <strong>Bước 2:</strong> Chuẩn bị dữ liệu cho ${studentsToSubmit.length} sinh viên...</div>`;
    batchStatus.textContent = '📦 Chuẩn bị dữ liệu...';
    
    const studentIds = [];
    const semesters = [];
    const courseIdsArray = [];
    const courseNamesArray = [];
    const creditsArray = [];
    const gradesArray = [];
    const letterGradesArray = [];
    const instructorsArray = [];
    
    console.log('🔍 DEBUG: Chuẩn bị dữ liệu batch submit...');
    
    for (const item of studentsToSubmit) {
      studentIds.push(String(item.studentId));
      semesters.push(String(item.semester));
      
      const courseIds = [];
      const courseNames = [];
      const credits = [];
      const grades = [];
      const letterGrades = [];
      const instructors = [];
      
      console.log(`📝 SV ${item.studentId} - HK ${item.semester}:`, item.records.length, 'môn học');
      
      item.records.forEach((record, idx) => {
        const courseId = String(record.courseId || '').trim();
        if (!courseId) return;
        
        // Validate grade value
        let gradeValue = 0;
        
        // Xử lý null/undefined/empty -> 0 điểm
        if (record.grade === null || record.grade === undefined || record.grade === '') {
          console.warn(`⚠️ SV ${item.studentId}, môn ${courseId}: Điểm null/empty -> Chuyển thành 0`);
          gradeValue = 0;
        } else {
          gradeValue = parseFloat(record.grade);
          
          if (isNaN(gradeValue)) {
            console.warn(`⚠️ SV ${item.studentId}, môn ${courseId}: Điểm NaN (${record.grade}) -> Chuyển thành 0`);
            gradeValue = 0;
          } else if (gradeValue < 0) {
            // Xử lý điểm âm (bỏ thi) -> 0 điểm
            console.warn(`⚠️ SV ${item.studentId}, môn ${courseId}: Điểm âm (${gradeValue}) -> Chuyển thành 0`);
            gradeValue = 0;
          } else if (gradeValue > 10) {
            // Giới hạn điểm tối đa
            console.warn(`⚠️ SV ${item.studentId}, môn ${courseId}: Điểm > 10 (${gradeValue}) -> Giới hạn về 10`);
            gradeValue = 10;
          }
        }
        
        console.log(`  - Môn ${courseId}: grade=${gradeValue}, credits=${record.credits}`);
        
        courseIds.push(courseId);
        courseNames.push(String(record.courseName || 'N/A').trim());
        
        // Validate credits (cho phép luận văn 15 tín chỉ)
        const creditValue = parseInt(record.credits);
        if (isNaN(creditValue) || creditValue < 0 || creditValue > 20) {
          throw new Error(`Sinh viên ${item.studentId}, môn ${courseId}: Tín chỉ không hợp lệ (${record.credits})`);
        }
        credits.push(creditValue);
        
        // Convert grade to uint16 (multiply by 100)
        const gradeUint = Math.round(gradeValue * 100);
        grades.push(gradeUint);
        
        let letterGrade = String(record.letterGrade || '').trim();
        if (!letterGrade) {
          if (gradeValue >= 8.5) letterGrade = 'A';
          else if (gradeValue >= 7.0) letterGrade = 'B';
          else if (gradeValue >= 5.5) letterGrade = 'C';
          else if (gradeValue >= 4.0) letterGrade = 'D';
          else letterGrade = 'F';
        }
        letterGrades.push(letterGrade);
        
        instructors.push(String(record.instructor || 'N/A').trim());
      });
      
      courseIdsArray.push(courseIds);
      courseNamesArray.push(courseNames);
      creditsArray.push(credits);
      gradesArray.push(grades);
      letterGradesArray.push(letterGrades);
      instructorsArray.push(instructors);
    }
    
    console.log('✅ Dữ liệu đã chuẩn bị:', {
      students: studentIds.length,
      totalCourses: gradesArray.reduce((sum, arr) => sum + arr.length, 0)
    });
    
    detailLog.innerHTML += `<div>  ✅ Dữ liệu đã sẵn sàng</div>`;
    
    // Tính toán gas dựa trên số lượng môn học
    const totalCourses = gradesArray.reduce((sum, arr) => sum + arr.length, 0);
    const estimatedGas = 1000000 + (totalCourses * 200000); // Base 1M + 200k per course
    const MAX_GAS = 100000000; // Max 100M gas (Ganache default block gas limit)
    const gasLimit = Math.min(estimatedGas, MAX_GAS);
    
    console.log(`⛽ Gas estimate: ${estimatedGas.toLocaleString()}, using: ${gasLimit.toLocaleString()}, max: ${MAX_GAS.toLocaleString()}`);
    
    // ============ AUTO-CHUNKING: Tự động chia nhỏ nếu quá lớn ============
    // Tăng lên 200M với Ganache block limit 900M
    const SAFE_GAS_LIMIT = 200000000;     // 200M gas - Chunk siêu lớn (block limit 900M)
    const AVG_GAS_PER_COURSE = 150000;    // 150k gas/môn (ước tính thực tế)
    const BASE_GAS_OVERHEAD = 10000000;   // 10M gas overhead (base + storage)
    
    // Tính số môn học tối đa mỗi batch (an toàn)
    const maxCoursesPerBatch = Math.floor((SAFE_GAS_LIMIT - BASE_GAS_OVERHEAD) / AVG_GAS_PER_COURSE);
    
    // Tính số sinh viên tối đa mỗi batch
    const avgCoursesPerStudent = totalCourses / studentsToSubmit.length;
    const maxStudentsPerBatch = Math.max(1, Math.floor(maxCoursesPerBatch / avgCoursesPerStudent));
    
    console.log(`🔢 Chunking params:`, {
      SAFE_GAS_LIMIT,
      maxCoursesPerBatch,
      avgCoursesPerStudent: avgCoursesPerStudent.toFixed(1),
      maxStudentsPerBatch,
      totalStudents: studentsToSubmit.length,
      totalCourses
    });
    
    // Kiểm tra có cần chia nhỏ không
    const needsChunking = estimatedGas > SAFE_GAS_LIMIT || studentsToSubmit.length > maxStudentsPerBatch;
    
    if (needsChunking) {
      // TỰ ĐỘNG CHIA NHỎ THÀNH NHIỀU BATCH
      const chunks = [];
      for (let i = 0; i < studentsToSubmit.length; i += maxStudentsPerBatch) {
        chunks.push(studentsToSubmit.slice(i, i + maxStudentsPerBatch));
      }
      
      detailLog.innerHTML += `<div style="margin-top: 15px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">`;
      detailLog.innerHTML += `  <h3>⚠️ Dữ liệu quá lớn - Tự động chia nhỏ</h3>`;
      detailLog.innerHTML += `  <p><strong>Tổng số sinh viên:</strong> ${studentsToSubmit.length}</p>`;
      detailLog.innerHTML += `  <p><strong>Ước tính gas:</strong> ${estimatedGas.toLocaleString()} (vượt quá ${SAFE_GAS_LIMIT.toLocaleString()})</p>`;
      detailLog.innerHTML += `  <p><strong>Giải pháp:</strong> Chia thành <strong>${chunks.length} batch</strong></p>`;
      detailLog.innerHTML += `  <p><strong>Mỗi batch:</strong> ~${maxStudentsPerBatch} sinh viên</p>`;
      detailLog.innerHTML += `  <p><strong>Số lần ký:</strong> ${chunks.length} lần</p>`;
      detailLog.innerHTML += `</div>`;
      
      batchStatus.innerHTML = `🔄 Chia nhỏ thành ${chunks.length} batch`;
      
      // SUBMIT TỪNG BATCH
      let totalTxHashes = [];
      let totalGasUsed = 0;
      
      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];
        
        detailLog.innerHTML += `<div style="margin-top: 15px; padding: 12px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196F3;">`;
        detailLog.innerHTML += `  <h4>📦 BATCH ${chunkIndex + 1}/${chunks.length}</h4>`;
        detailLog.innerHTML += `  <p>Sinh viên: ${chunkIndex * maxStudentsPerBatch + 1} → ${Math.min((chunkIndex + 1) * maxStudentsPerBatch, studentsToSubmit.length)} (${chunk.length} sinh viên)</p>`;
        detailLog.innerHTML += `</div>`;
        
        batchStatus.innerHTML = `🔐 Batch ${chunkIndex + 1}/${chunks.length} - Chờ xác nhận MetaMask...`;
        
        // Chuẩn bị dữ liệu cho chunk này
        const chunkStudentIds = [];
        const chunkSemesters = [];
        const chunkCourseIdsArray = [];
        const chunkCourseNamesArray = [];
        const chunkCreditsArray = [];
        const chunkGradesArray = [];
        const chunkLetterGradesArray = [];
        const chunkInstructorsArray = [];
        
        for (const item of chunk) {
          const idx = studentsToSubmit.indexOf(item);
          chunkStudentIds.push(studentIds[idx]);
          chunkSemesters.push(semesters[idx]);
          chunkCourseIdsArray.push(courseIdsArray[idx]);
          chunkCourseNamesArray.push(courseNamesArray[idx]);
          chunkCreditsArray.push(creditsArray[idx]);
          chunkGradesArray.push(gradesArray[idx]);
          chunkLetterGradesArray.push(letterGradesArray[idx]);
          chunkInstructorsArray.push(instructorsArray[idx]);
        }
        
        const chunkTotalCourses = chunkGradesArray.reduce((sum, arr) => sum + arr.length, 0);
        const chunkGasLimit = Math.min(BASE_GAS_OVERHEAD + (chunkTotalCourses * AVG_GAS_PER_COURSE), SAFE_GAS_LIMIT);
        
        detailLog.innerHTML += `<div style="padding-left: 20px;">⛽ Gas limit: ${chunkGasLimit.toLocaleString()} | Môn học: ${chunkTotalCourses}</div>`;
        
        try {
          // ESTIMATE GAS trước khi submit
          detailLog.innerHTML += `<div style="padding-left: 20px; color: #2196F3;">🔍 Estimate gas...</div>`;
          
          let estimatedGasForChunk;
          try {
            estimatedGasForChunk = await contract.methods.batchSubmitSemesterGrades(
              chunkStudentIds,
              chunkSemesters,
              chunkCourseIdsArray,
              chunkCourseNamesArray,
              chunkCreditsArray,
              chunkGradesArray,
              chunkLetterGradesArray,
              chunkInstructorsArray
            ).estimateGas({ from: currentAccount });
            
            const safeGas = Math.ceil(estimatedGasForChunk * 1.2); // Thêm 20% buffer
            detailLog.innerHTML += `<div style="padding-left: 20px; color: #2196F3;">📊 Estimated: ${estimatedGasForChunk.toLocaleString()}, Safe: ${safeGas.toLocaleString()}</div>`;
            
            // Kiểm tra gas có vượt quá limit không
            if (safeGas > SAFE_GAS_LIMIT) {
              detailLog.innerHTML += `<div class="error-box" style="margin: 10px 0 10px 20px;">`;
              detailLog.innerHTML += `  <strong>⚠️ Gas quá cao!</strong><br>`;
              detailLog.innerHTML += `  Estimated: ${safeGas.toLocaleString()}<br>`;
              detailLog.innerHTML += `  Safe limit: ${SAFE_GAS_LIMIT.toLocaleString()}<br>`;
              detailLog.innerHTML += `  <strong>Giải pháp:</strong> Chia file Excel nhỏ hơn (~${Math.floor(chunk.length / 2)} SV/file)`;
              detailLog.innerHTML += `</div>`;
              throw new Error(`Gas quá cao: ${safeGas} > ${SAFE_GAS_LIMIT}`);
            }
            
          } catch (estimateError) {
            console.warn('⚠️ Cannot estimate gas, using calculated limit:', estimateError);
            estimatedGasForChunk = chunkGasLimit;
          }
          
          const finalGasLimit = Math.min(
            estimatedGasForChunk ? Math.ceil(estimatedGasForChunk * 1.2) : chunkGasLimit,
            SAFE_GAS_LIMIT
          );
          
          detailLog.innerHTML += `<div style="padding-left: 20px; color: #2196F3;">🔐 Sending with gas: ${finalGasLimit.toLocaleString()}...</div>`;
          
          const tx = await contract.methods.batchSubmitSemesterGrades(
            chunkStudentIds,
            chunkSemesters,
            chunkCourseIdsArray,
            chunkCourseNamesArray,
            chunkCreditsArray,
            chunkGradesArray,
            chunkLetterGradesArray,
            chunkInstructorsArray
          ).send({
            from: currentAccount,
            gas: finalGasLimit
          });
          
          totalTxHashes.push(tx.transactionHash);
          totalGasUsed += parseInt(tx.gasUsed);
          
          detailLog.innerHTML += `<div style="padding-left: 20px; color: #28a745;">✅ Thành công! Gas used: ${parseInt(tx.gasUsed).toLocaleString()} | TxHash: <code>${tx.transactionHash.substring(0, 20)}...</code></div>`;
          
        } catch (chunkError) {
          detailLog.innerHTML += `<div class="error-box" style="margin-top: 10px;">`;
          detailLog.innerHTML += `  <strong>❌ Batch ${chunkIndex + 1} thất bại!</strong><br>`;
          detailLog.innerHTML += `  Lỗi: ${chunkError.message}<br>`;
          detailLog.innerHTML += `  <em>Các batch trước đó đã submit thành công</em>`;
          detailLog.innerHTML += `</div>`;
          throw chunkError; // Stop on error
        }
      }
      
      // TẤT CẢ BATCH THÀNH CÔNG
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      detailLog.innerHTML += `<div style="margin-top: 20px;" class="success-box">`;
      detailLog.innerHTML += `  <h3>✅ TẤT CẢ BATCH SUBMIT THÀNH CÔNG!</h3>`;
      detailLog.innerHTML += `  <p><strong>📊 Thống kê tổng:</strong></p>`;
      detailLog.innerHTML += `  <ul style="margin-left: 20px;">`;
      detailLog.innerHTML += `    <li>✅ Tổng số batch: <strong>${chunks.length}</strong></li>`;
      detailLog.innerHTML += `    <li>✅ Đã submit: <strong>${studentsToSubmit.length}</strong> học kỳ</li>`;
      if (alreadyExists.length > 0) {
        detailLog.innerHTML += `    <li>⚠️ Đã tồn tại: <strong>${alreadyExists.length}</strong> học kỳ</li>`;
      }
      detailLog.innerHTML += `    <li>📦 Tổng môn học: <strong>${totalCourses}</strong></li>`;
      detailLog.innerHTML += `    <li>⏱️ Thời gian: <strong>${duration}s</strong></li>`;
      detailLog.innerHTML += `    <li>⛽ Tổng Gas Used: <strong>${totalGasUsed.toLocaleString()}</strong></li>`;
      detailLog.innerHTML += `  </ul>`;
      detailLog.innerHTML += `  <p style="margin-top: 10px;"><strong>🔗 Transaction Hashes:</strong></p>`;
      detailLog.innerHTML += `  <ul style="max-height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 5px; font-size: 11px;">`;
      totalTxHashes.forEach((hash, i) => {
        detailLog.innerHTML += `    <li>Batch ${i + 1}: <code>${hash}</code></li>`;
      });
      detailLog.innerHTML += `  </ul>`;
      detailLog.innerHTML += `</div>`;
      
      batchStatus.innerHTML = `<span style="color: #28a745;">✅ Hoàn thành (${chunks.length} batch)!</span>`;
      
    } else {
      // KHÔNG CẦN CHIA NHỎ - Submit 1 batch duy nhất
      // Bước 3: Submit
      detailLog.innerHTML += `<div style="margin-top: 15px;">🔐 <strong>Bước 3:</strong> Gửi batch transaction...</div>`;
      detailLog.innerHTML += `<div style="padding: 10px; background: #d4edda; border-radius: 5px; margin: 10px 0;">`;
      detailLog.innerHTML += `  <strong>💡 GỘP ${studentsToSubmit.length} SINH VIÊN VÀO MỘT TRANSACTION</strong><br>`;
      detailLog.innerHTML += `  📊 Tổng số môn học: <strong>${totalCourses}</strong><br>`;
      detailLog.innerHTML += `  ⛽ Calculated gas: <strong>${gasLimit.toLocaleString()}</strong>`;
      detailLog.innerHTML += `</div>`;
      batchStatus.textContent = '🔍 Estimate gas...';
      
      // ESTIMATE GAS trước khi submit
      detailLog.innerHTML += `<div>  🔍 Estimate gas...</div>`;
      
      let estimatedGasForBatch;
      try {
        estimatedGasForBatch = await contract.methods.batchSubmitSemesterGrades(
          studentIds,
          semesters,
          courseIdsArray,
          courseNamesArray,
          creditsArray,
          gradesArray,
          letterGradesArray,
          instructorsArray
        ).estimateGas({ from: currentAccount });
        
        const safeGas = Math.ceil(estimatedGasForBatch * 1.2); // Thêm 20% buffer
        detailLog.innerHTML += `<div style="color: #2196F3;">  📊 Estimated: ${estimatedGasForBatch.toLocaleString()}, Safe: ${safeGas.toLocaleString()}</div>`;
        
        // Kiểm tra gas có vượt quá limit không
        if (safeGas > SAFE_GAS_LIMIT) {
          detailLog.innerHTML += `<div class="error-box" style="margin-top: 10px;">`;
          detailLog.innerHTML += `  <strong>⚠️ Gas quá cao!</strong><br>`;
          detailLog.innerHTML += `  Estimated: ${safeGas.toLocaleString()}<br>`;
          detailLog.innerHTML += `  Safe limit: ${SAFE_GAS_LIMIT.toLocaleString()}<br>`;
          detailLog.innerHTML += `  <strong>Giải pháp:</strong> Chia file Excel nhỏ hơn (~${Math.floor(studentsToSubmit.length / 2)} SV/file)`;
          detailLog.innerHTML += `</div>`;
          batchStatus.innerHTML = '<span style="color: #ffc107;">⚠️ Gas quá cao</span>';
          return;
        }
        
      } catch (estimateError) {
        console.warn('⚠️ Cannot estimate gas, using calculated limit:', estimateError);
        estimatedGasForBatch = gasLimit;
      }
      
      const finalGasLimit = Math.min(
        estimatedGasForBatch ? Math.ceil(estimatedGasForBatch * 1.2) : gasLimit,
        SAFE_GAS_LIMIT
      );
      
      detailLog.innerHTML += `<div style="padding: 10px; background: #fff3cd; border-radius: 5px; margin: 10px 0;">`;
      detailLog.innerHTML += `  ⛽ Final gas limit: <strong>${finalGasLimit.toLocaleString()}</strong><br>`;
      detailLog.innerHTML += `  Vui lòng xác nhận trong MetaMask...`;
      detailLog.innerHTML += `</div>`;
      batchStatus.textContent = '🔐 Đang chờ xác nhận MetaMask...';
      
      detailLog.innerHTML += `<div>  📤 Đang gửi transaction...</div>`;
      
      const tx = await contract.methods.batchSubmitSemesterGrades(
        studentIds,
        semesters,
        courseIdsArray,
        courseNamesArray,
        creditsArray,
        gradesArray,
        letterGradesArray,
        instructorsArray
      ).send({
        from: currentAccount,
        gas: finalGasLimit
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      // Thành công
      detailLog.innerHTML += `<div style="margin-top: 15px;" class="success-box">`;
      detailLog.innerHTML += `  <h3>✅ BATCH SUBMIT THÀNH CÔNG!</h3>`;
      detailLog.innerHTML += `  <p><strong>📊 Thống kê:</strong></p>`;
      detailLog.innerHTML += `  <ul style="margin-left: 20px;">`;
      detailLog.innerHTML += `    <li>✅ Đã submit: <strong>${studentsToSubmit.length}</strong> học kỳ</li>`;
      if (alreadyExists.length > 0) {
        detailLog.innerHTML += `    <li>⚠️ Đã tồn tại: <strong>${alreadyExists.length}</strong> học kỳ</li>`;
      }
      detailLog.innerHTML += `    <li>🔗 Transaction Hash: <code>${tx.transactionHash}</code></li>`;
      detailLog.innerHTML += `    <li>📦 Block Number: <strong>${tx.blockNumber}</strong></li>`;
      detailLog.innerHTML += `    <li>⏱️ Thời gian: <strong>${duration}s</strong></li>`;
      detailLog.innerHTML += `    <li>⛽ Gas Used: <strong>${tx.gasUsed.toLocaleString()}</strong></li>`;
      detailLog.innerHTML += `  </ul>`;
      
      detailLog.innerHTML += `  <h4 style="margin-top: 15px;">📋 Danh sách đã submit:</h4>`;
      detailLog.innerHTML += `  <ul style="max-height: 300px; overflow-y: auto; background: white; padding: 10px; border-radius: 5px;">`;
      studentsToSubmit.forEach(item => {
        detailLog.innerHTML += `    <li>✅ ${item.studentId} - ${item.studentName} - HK ${item.semester} (${item.records.length} môn)</li>`;
      });
      detailLog.innerHTML += `  </ul>`;
      detailLog.innerHTML += `</div>`;
      
      batchStatus.innerHTML = '<span style="color: #28a745;">✅ Hoàn thành!</span>';
    }
    
  } catch (error) {
    console.error('❌ Batch submit error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      data: error.data,
      receipt: error.receipt
    });
    
    let errorMessage = error.message;
    let errorHint = '';
    let errorDetails = '';
    
    // Phân tích transaction receipt nếu có
    if (error.receipt) {
      errorDetails = `
        <strong>📋 Transaction Receipt:</strong><br>
        • Transaction Hash: <code>${error.receipt.transactionHash || 'N/A'}</code><br>
        • Block Number: ${error.receipt.blockNumber || 'N/A'}<br>
        • Gas Used: ${error.receipt.gasUsed ? error.receipt.gasUsed.toLocaleString() : 'N/A'}<br>
        • Status: ${error.receipt.status ? '✅ Success' : '❌ Failed'}<br>
      `;
    }
    
    // Phân tích lỗi chi tiết
    if (error.message.includes('Internal JSON-RPC error') || error.code === -32603) {
      errorHint = `
        <strong>🔍 Lỗi kết nối blockchain (JSON-RPC):</strong><br>
        • Transaction quá lớn hoặc blockchain bị quá tải<br>
        • <strong>✅ GIẢI PHÁP:</strong> Hệ thống đã tự động chia nhỏ dữ liệu<br>
        • Nếu vẫn lỗi, vui lòng:<br>
        &nbsp;&nbsp;1. Chia file Excel thành nhiều file nhỏ hơn (~10-20 sinh viên/file)<br>
        &nbsp;&nbsp;2. Khởi động lại Ganache<br>
        &nbsp;&nbsp;3. Kiểm tra kết nối mạng<br><br>
        
        <strong>📊 Thống kê hiện tại:</strong><br>
        • Tổng sinh viên cần submit: ${studentsToSubmit ? studentsToSubmit.length : 'N/A'}<br>
        • Tổng môn học: ${typeof totalCourses !== 'undefined' ? totalCourses : 'N/A'}<br>
        • Ước tính gas: ${typeof estimatedGas !== 'undefined' ? estimatedGas.toLocaleString() : 'N/A'}<br>
      `;
    } else if (error.message.includes('revert') || (error.receipt && error.receipt.status === false)) {
      // Transaction bị REVERT - Đây là lỗi phổ biến nhất
      errorHint = `
        <strong>🔍 Smart Contract TỪ CHỐI transaction (Revert):</strong><br><br>
        
        <strong style="color: #dc3545;">Các nguyên nhân có thể:</strong><br>
        1. ❌ <strong>Học kỳ đã tồn tại</strong> - Smart contract KHÔNG CHO PHÉP update điểm<br>
        &nbsp;&nbsp;→ Kiểm tra lại Bước 1, có thể có học kỳ đã submit trước đó<br><br>
        
        2. ❌ <strong>Sinh viên chưa đăng ký</strong><br>
        &nbsp;&nbsp;→ Một hoặc nhiều sinh viên chưa có trong hệ thống<br>
        &nbsp;&nbsp;→ Đăng ký qua <a href="admin_students.html" target="_blank">admin_students.html</a> trước<br><br>
        
        3. ❌ <strong>Lớp chưa được gán chương trình</strong><br>
        &nbsp;&nbsp;→ Kiểm tra class mapping trong smart contract<br>
        &nbsp;&nbsp;→ Dùng setProgramClass() để gán lớp vào chương trình<br><br>
        
        4. ❌ <strong>Không có quyền Dean</strong><br>
        &nbsp;&nbsp;→ Account: <code>${currentAccount || 'N/A'}</code><br>
        &nbsp;&nbsp;→ Chỉ Dean hoặc Owner mới submit được<br><br>
        
        5. ❌ <strong>Dữ liệu không hợp lệ</strong><br>
        &nbsp;&nbsp;→ MSSV, học kỳ, điểm số, tín chỉ sai định dạng<br>
        &nbsp;&nbsp;→ Kiểm tra lại file Excel<br><br>
        
        <strong>💡 CÁCH KHẮC PHỤC:</strong><br>
        <ol style="margin-left: 20px;">
          <li><strong>Kiểm tra Bước 1:</strong> Xem danh sách sinh viên được kiểm tra<br>
          &nbsp;&nbsp;• Có sinh viên nào hiển thị "❌ CHƯA ĐĂNG KÝ"?<br>
          &nbsp;&nbsp;• Có học kỳ nào hiển thị "⚠️ ĐÃ TỒN TẠI"?</li><br>
          
          <li><strong>Mở Console (F12):</strong> Xem log chi tiết<br>
          &nbsp;&nbsp;• Tìm dòng có "revert" hoặc "error"<br>
          &nbsp;&nbsp;• Copy và gửi cho admin nếu cần</li><br>
          
          <li><strong>Thử từng sinh viên:</strong> Để tìm sinh viên bị lỗi<br>
          &nbsp;&nbsp;• Chia file Excel thành nhiều file nhỏ (5-10 SV/file)<br>
          &nbsp;&nbsp;• Submit từng file để xác định sinh viên nào gây lỗi</li>
        </ol>
      `;
    } else if (error.message.includes('gas')) {
      errorHint = `
        <strong>🔍 Lỗi về Gas:</strong><br>
        • Transaction cần nhiều gas hơn dự tính<br>
        • <strong>✅ GIẢI PHÁP:</strong> Hệ thống đã tự động chia nhỏ<br>
        • Nếu vẫn lỗi, thử giảm số lượng sinh viên mỗi file
      `;
    } else if (error.message.includes('rejected') || error.message.includes('denied')) {
      errorHint = `
        <strong>🔍 Người dùng từ chối:</strong><br>
        • Bạn đã từ chối transaction trong MetaMask<br>
        • Vui lòng thử lại và approve transaction
      `;
    } else if (error.message.includes('CHƯA ĐĂNG KÝ')) {
      // Lỗi từ validation ở bước 1
      errorHint = `
        <strong>🔍 Sinh viên chưa đăng ký:</strong><br>
        • Vui lòng đăng ký sinh viên qua <a href="admin_students.html" target="_blank">admin_students.html</a><br>
        • Đảm bảo tất cả sinh viên trong file Excel đã được đăng ký trước
      `;
    }
    
    detailLog.innerHTML += `<div class="error-box" style="margin-top: 15px;">`;
    detailLog.innerHTML += `  <h3>❌ Lỗi khi batch submit</h3>`;
    detailLog.innerHTML += `  <p><strong>Chi tiết lỗi:</strong> ${errorMessage}</p>`;
    detailLog.innerHTML += `  <p><strong>Error code:</strong> ${error.code || 'N/A'}</p>`;
    
    if (errorDetails) {
      detailLog.innerHTML += `  <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 12px;">`;
      detailLog.innerHTML += errorDetails;
      detailLog.innerHTML += `  </div>`;
    }
    
    if (errorHint) {
      detailLog.innerHTML += `  <div style="margin-top: 15px; padding: 15px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">`;
      detailLog.innerHTML += errorHint;
      detailLog.innerHTML += `  </div>`;
    }
    detailLog.innerHTML += `</div>`;
    
    batchStatus.innerHTML = '<span style="color: #dc3545;">❌ Thất bại</span>';
  }
}

// 🧪 TEST SUBMIT - Submit sinh viên đầu tiên để debug
async function testSubmitFirst() {
  if (!currentAccount) {
    alert('⚠️ Vui lòng kết nối MetaMask trước!');
    return;
  }

  if (!jsonData || jsonData.length === 0) {
    alert('❌ Chưa có dữ liệu JSON!');
    return;
  }

  const isDean = await contract.methods.isDean(currentAccount).call();
  if (!isDean) {
    alert('❌ Account hiện tại không có quyền Dean!\n\nChỉ Dean mới có thể submit điểm.');
    return;
  }

  const confirmMsg = `🧪 TEST SUBMIT - Sinh viên đầu tiên\n\n` +
    `Sinh viên: ${jsonData[0].studentId} (${jsonData[0].studentName})\n` +
    `Học kỳ: ${jsonData[0].semester}\n` +
    `Số môn: ${jsonData[0].records.length}\n\n` +
    `Mục đích: Kiểm tra xem có lỗi gì không\n` +
    `Nếu thành công → Có thể batch submit tất cả\n` +
    `Nếu lỗi → Biết chính xác lỗi ở đâu\n\n` +
    `Tiếp tục?`;
  
  if (!confirm(confirmMsg)) {
    return;
  }

  document.getElementById('submitResult').innerHTML = `
    <div class="info-box" style="margin-top: 20px;">
      <h3>🧪 TEST SUBMIT - Đang kiểm tra...</h3>
      <div id="testLog" style="margin-top: 15px; font-family: monospace; font-size: 12px;"></div>
    </div>
  `;

  const testLog = document.getElementById('testLog');
  const item = jsonData[0];

  try {
    // Bước 1: Kiểm tra sinh viên
    testLog.innerHTML += `<div>🔍 Kiểm tra sinh viên ${item.studentId}...</div>`;
    const studentInfo = await contract.methods.getStudentInfo(item.studentId).call();
    
    if (!studentInfo.exists) {
      testLog.innerHTML += `<div style="color: #dc3545;">❌ Sinh viên CHƯA ĐĂNG KÝ!</div>`;
      testLog.innerHTML += `<div class="error-box" style="margin-top: 10px;">`;
      testLog.innerHTML += `  <strong>Lỗi:</strong> Sinh viên ${item.studentId} chưa được đăng ký.<br>`;
      testLog.innerHTML += `  <strong>Giải pháp:</strong> Đăng ký sinh viên qua <a href="admin_students.html" target="_blank">admin_students.html</a>`;
      testLog.innerHTML += `</div>`;
      return;
    }
    
    testLog.innerHTML += `<div style="color: #28a745;">✅ Sinh viên đã đăng ký</div>`;
    testLog.innerHTML += `<div style="padding-left: 20px; font-size: 11px;">`;
    testLog.innerHTML += `  • Tên: ${studentInfo.name}<br>`;
    testLog.innerHTML += `  • Lớp: ${studentInfo.class}<br>`;
    testLog.innerHTML += `  • Chương trình: ${studentInfo.program}<br>`;
    testLog.innerHTML += `  • Wallet: ${studentInfo.walletAddress}`;
    testLog.innerHTML += `</div>`;

    // Bước 2: Kiểm tra học kỳ
    testLog.innerHTML += `<div style="margin-top: 10px;">🔍 Kiểm tra học kỳ ${item.semester}...</div>`;
    try {
      const semData = await contract.methods.semesterGrades(item.studentId, String(item.semester)).call();
      if (semData && semData.exists === true) {
        testLog.innerHTML += `<div style="color: #ffc107;">⚠️ Học kỳ ĐÃ TỒN TẠI - Không thể submit!</div>`;
        testLog.innerHTML += `<div class="warning-box" style="margin-top: 10px;">`;
        testLog.innerHTML += `  <strong>Học kỳ đã có điểm:</strong><br>`;
        testLog.innerHTML += `  • Submitted at: ${new Date(semData.submittedAt * 1000).toLocaleString()}<br>`;
        testLog.innerHTML += `  • Submitted by: ${semData.submittedBy}<br>`;
        testLog.innerHTML += `  • Version: ${semData.version}`;
        testLog.innerHTML += `</div>`;
        return;
      }
    } catch (e) {
      // OK - Học kỳ chưa tồn tại
    }
    testLog.innerHTML += `<div style="color: #28a745;">✅ Học kỳ chưa tồn tại - OK để submit</div>`;

    // Bước 3: Chuẩn bị dữ liệu
    testLog.innerHTML += `<div style="margin-top: 10px;">📦 Chuẩn bị dữ liệu ${item.records.length} môn học...</div>`;
    
    const courseIds = [];
    const courseNames = [];
    const credits = [];
    const grades = [];
    const letterGrades = [];
    const instructors = [];
    
    item.records.forEach(record => {
      const courseId = String(record.courseId || '').trim();
      if (!courseId) return;
      
      let gradeValue = 0;
      if (record.grade === null || record.grade === undefined || record.grade === '') {
        gradeValue = 0;
      } else {
        gradeValue = parseFloat(record.grade);
        if (isNaN(gradeValue)) gradeValue = 0;
        else if (gradeValue < 0) gradeValue = 0;
        else if (gradeValue > 10) gradeValue = 10;
      }
      
      courseIds.push(courseId);
      courseNames.push(String(record.courseName || 'N/A').trim());
      credits.push(parseInt(record.credits));
      grades.push(Math.round(gradeValue * 100));
      
      let letterGrade = String(record.letterGrade || '').trim();
      if (!letterGrade) {
        if (gradeValue >= 8.5) letterGrade = 'A';
        else if (gradeValue >= 7.0) letterGrade = 'B';
        else if (gradeValue >= 5.5) letterGrade = 'C';
        else if (gradeValue >= 4.0) letterGrade = 'D';
        else letterGrade = 'F';
      }
      letterGrades.push(letterGrade);
      instructors.push(String(record.instructor || 'N/A').trim());
    });
    
    testLog.innerHTML += `<div style="color: #28a745;">✅ Dữ liệu đã sẵn sàng: ${courseIds.length} môn</div>`;

    // Bước 4: Submit
    testLog.innerHTML += `<div style="margin-top: 10px;">🔐 Gửi transaction...</div>`;
    testLog.innerHTML += `<div style="padding: 10px; background: #fff3cd; border-radius: 5px; margin: 5px 0;">`;
    testLog.innerHTML += `⏳ Vui lòng xác nhận trong MetaMask...`;
    testLog.innerHTML += `</div>`;
    
    const tx = await contract.methods.submitSemesterGrades(
      item.studentId,
      String(item.semester),
      courseIds,
      courseNames,
      credits,
      grades,
      letterGrades,
      instructors
    ).send({
      from: currentAccount,
      gas: 5000000
    });
    
    // Thành công!
    testLog.innerHTML += `<div class="success-box" style="margin-top: 10px;">`;
    testLog.innerHTML += `  <h3>✅ TEST SUBMIT THÀNH CÔNG!</h3>`;
    testLog.innerHTML += `  <p><strong>Kết luận:</strong> Dữ liệu hợp lệ, có thể batch submit tất cả!</p>`;
    testLog.innerHTML += `  <p><strong>Transaction Hash:</strong> <code>${tx.transactionHash}</code></p>`;
    testLog.innerHTML += `  <p><strong>Gas Used:</strong> ${tx.gasUsed.toLocaleString()}</p>`;
    testLog.innerHTML += `</div>`;
    
  } catch (error) {
    console.error('❌ Test submit error:', error);
    
    testLog.innerHTML += `<div class="error-box" style="margin-top: 10px;">`;
    testLog.innerHTML += `  <h3>❌ TEST SUBMIT THẤT BẠI</h3>`;
    testLog.innerHTML += `  <p><strong>Lỗi:</strong> ${error.message}</p>`;
    
    if (error.message.includes('revert')) {
      testLog.innerHTML += `  <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px;">`;
      testLog.innerHTML += `    <strong>Nguyên nhân có thể:</strong><br>`;
      testLog.innerHTML += `    • Học kỳ đã tồn tại (kiểm tra lại Bước 2)<br>`;
      testLog.innerHTML += `    • Lớp chưa được gán chương trình<br>`;
      testLog.innerHTML += `    • Dữ liệu không hợp lệ (MSSV, điểm, tín chỉ)<br>`;
      testLog.innerHTML += `    • Không có quyền Dean`;
      testLog.innerHTML += `  </div>`;
    }
    
    testLog.innerHTML += `  <p style="margin-top: 10px;"><strong>💡 Gợi ý:</strong> Xem console (F12) để biết chi tiết</p>`;
    testLog.innerHTML += `</div>`;
  }
}

// Submit tự động tất cả
async function autoSubmitAll() {
  if (!currentAccount) {
    alert('⚠️ Vui lòng kết nối MetaMask trước!');
    return;
  }

  if (!jsonData || jsonData.length === 0) {
    alert('❌ Chưa có dữ liệu JSON!');
    return;
  }

  const isDean = await contract.methods.isDean(currentAccount).call();
  if (!isDean) {
    alert('❌ Account hiện tại không có quyền Dean!\n\nChỉ Dean mới có thể submit điểm.');
    return;
  }

  const confirmMsg = `🐌 SUBMIT TỪNG CÁI (CÁCH CŨ - CHẬM)\n\n` +
    `⚠️ KHUYẾN NGHỊ: Dùng BATCH SUBMIT thay vì cách này!\n\n` +
    `📌 Cách này sẽ:\n` +
    `• Gửi ${jsonData.length} transactions riêng lẻ\n` +
    `• Phải ký ${jsonData.length} lần trong MetaMask\n` +
    `• Mất ~${Math.ceil(jsonData.length * 15 / 60)} phút\n\n` +
    `💡 BATCH SUBMIT chỉ cần:\n` +
    `• 1 transaction duy nhất\n` +
    `• Ký 1 lần\n` +
    `• ~10-30 giây\n\n` +
    `Vẫn muốn dùng cách cũ?`;
  
  if (!confirm(confirmMsg)) {
    return;
  }

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;
  const results = [];
  const startTime = Date.now();

  // Tạo progress bar container
  document.getElementById('submitResult').innerHTML = `
    <div class="info-box" style="position: sticky; top: 0; z-index: 100; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <h3>🚀 Đang submit tự động...</h3>
      
      <!-- Overall Progress Bar -->
      <div style="margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <strong>Tiến độ tổng thể</strong>
          <span id="overallProgress">0/${jsonData.length}</span>
        </div>
        <div style="background: #e0e0e0; border-radius: 10px; height: 30px; overflow: hidden;">
          <div id="progressBar" style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: 0%; transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
            0%
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px;">
          <span>✅ Thành công: <strong id="successCounter">0</strong></span>
          <span>⏭️ Bỏ qua: <strong id="skipCounter">0</strong></span>
          <span>❌ Lỗi: <strong id="failCounter">0</strong></span>
        </div>
      </div>

      <!-- Current Task -->
      <div id="currentTask" style="background: #f0f4ff; padding: 12px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 15px;">
        <strong>⏳ Chuẩn bị...</strong>
      </div>

      <!-- Instruction -->
      <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
        <strong>💡 QUAN TRỌNG:</strong><br>
        • MetaMask sẽ mở popup yêu cầu xác nhận từng transaction<br>
        • Bạn có thể APPROVE ALL hoặc approve từng cái<br>
        • <strong>KHÔNG ĐÓNG</strong> trang web cho đến khi hoàn tất<br>
        • Nếu reject một transaction, hệ thống sẽ BỎ QUA và tiếp tục
      </div>
    </div>

    <!-- Detail Log -->
    <div style="margin-top: 20px;">
      <h4>📝 Chi tiết từng transaction</h4>
      <div id="submitDetailLog" style="max-height: 500px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <div style="color: #666; text-align: center;">Đang bắt đầu...</div>
      </div>
    </div>
  `;

  const progressBar = document.getElementById('progressBar');
  const overallProgress = document.getElementById('overallProgress');
  const successCounter = document.getElementById('successCounter');
  const skipCounter = document.getElementById('skipCounter');
  const failCounter = document.getElementById('failCounter');
  const currentTask = document.getElementById('currentTask');
  const detailLog = document.getElementById('submitDetailLog');

  // Clear detail log
  detailLog.innerHTML = '';

  for (let i = 0; i < jsonData.length; i++) {
    const item = jsonData[i];
    const progress = ((i / jsonData.length) * 100).toFixed(1);
    
    // Update progress bar
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;
    overallProgress.textContent = `${i}/${jsonData.length}`;
    
    // Update current task
    currentTask.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>📌 Đang xử lý:</strong> ${i + 1}/${jsonData.length}<br>
          <strong>MSSV:</strong> ${item.studentId} | <strong>Tên:</strong> ${item.studentName}<br>
          <strong>Học kỳ:</strong> ${item.semester} | <strong>Số môn:</strong> ${item.records.length}
        </div>
        <div style="font-size: 24px;">⏳</div>
      </div>
    `;

    // Add log entry
    const logEntry = document.createElement('div');
    logEntry.id = `log-${i}`;
    logEntry.style.cssText = 'padding: 12px; margin-bottom: 10px; border-radius: 6px; border-left: 4px solid #667eea; background: white;';
    logEntry.innerHTML = `
      <div style="display: flex; justify-content: space-between;">
        <strong>${i + 1}. ${item.studentId} - ${item.studentName}</strong>
        <span style="color: #667eea;">⏳ Đang xử lý...</span>
      </div>
      <div style="font-size: 12px; color: #666; margin-top: 5px;">
        Học kỳ: ${item.semester} | Số môn: ${item.records.length}
      </div>
      <div id="log-detail-${i}" style="margin-top: 8px; font-size: 12px;"></div>
    `;
    detailLog.appendChild(logEntry);
    
    // Scroll to current log
    logEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const logDetail = document.getElementById(`log-detail-${i}`);

    try {
      logDetail.innerHTML += '🔍 Kiểm tra sinh viên...';
      
      const studentInfo = await contract.methods.getStudentInfo(item.studentId).call();
      
      if (!studentInfo.exists) {
        const notRegisteredError = new Error('STUDENT_NOT_REGISTERED');
        notRegisteredError.studentId = item.studentId;
        throw notRegisteredError;
      }
      
      logDetail.innerHTML += ' ✅<br>';

      logDetail.innerHTML += '✔️ Validate dữ liệu...';
      
      if (!item.studentId || String(item.studentId).trim() === '') {
        throw new Error('MSSV không được rỗng!');
      }
      
      if (!item.semester || String(item.semester).trim() === '') {
        throw new Error('Học kỳ không được rỗng!');
      }
      
      if (!item.records || item.records.length === 0) {
        throw new Error('Không có môn học nào!');
      }
      
      const semesterStr = String(item.semester);

      logDetail.innerHTML += ' ✅<br>';
      
      logDetail.innerHTML += '📦 Chuẩn bị dữ liệu...';
      
      const courseIds = [];
      const courseNames = [];
      const credits = [];
      const grades = [];
      const letterGrades = [];
      const instructors = [];

      item.records.forEach((record, idx) => {
        const courseId = String(record.courseId || '').trim();
        if (!courseId) return;

        courseIds.push(courseId);
        courseNames.push(String(record.courseName || 'N/A').trim());
        
        // Validate credits (cho phép luận văn 15-20 tín chỉ)
        const creditValue = parseInt(record.credits);
        if (isNaN(creditValue) || creditValue < 0 || creditValue > 20) {
          throw new Error(`Môn ${courseId}: Tín chỉ không hợp lệ (${record.credits})`);
        }
        credits.push(creditValue);
        
        // Validate grade
        let gradeValue = 0;
        if (record.grade !== null && record.grade !== undefined && record.grade !== '') {
          const gradeFloat = parseFloat(record.grade);
          if (isNaN(gradeFloat)) {
            throw new Error(`Môn ${courseId}: Điểm không hợp lệ (${record.grade})`);
          }
          
          // Xử lý điểm âm (bỏ thi) -> 0 điểm
          if (gradeFloat < 0) {
            console.warn(`⚠️ Môn ${courseId}: Điểm âm (${gradeFloat}) -> Chuyển thành 0 (bỏ thi)`);
            gradeValue = 0;
          } else if (gradeFloat > 10) {
            console.warn(`⚠️ Môn ${courseId}: Điểm > 10 (${gradeFloat}) -> Giới hạn về 10`);
            gradeValue = 1000; // 10.0 * 100
          } else {
            gradeValue = Math.round(gradeFloat * 100);
          }
        }
        grades.push(gradeValue);
        
        letterGrades.push(String(record.letterGrade || 'N/A').trim());
        instructors.push('N/A');
      });

      if (courseIds.length !== courseNames.length ||
          courseIds.length !== credits.length ||
          courseIds.length !== grades.length ||
          courseIds.length !== letterGrades.length ||
          courseIds.length !== instructors.length) {
        throw new Error('❌ Dữ liệu không nhất quán!');
      }

      if (courseIds.length === 0) {
        throw new Error('❌ Không có môn học hợp lệ!');
      }

      logDetail.innerHTML += ` ✅ (${courseIds.length} môn)<br>`;

      logDetail.innerHTML += '🔎 Kiểm tra học kỳ...';
      
      try {
        const existingGrades = await contract.methods.getSemesterGrades(
          item.studentId,
          semesterStr
        ).call();
        
        const submittedAt = existingGrades[2] ? parseInt(existingGrades[2]) : 0;
        
        if (submittedAt > 0) {
          const skipError = new Error('SEMESTER_EXISTS');
          skipError.existingData = {
            submittedAt: new Date(submittedAt * 1000).toLocaleString(),
            submittedBy: existingGrades[3] || 'N/A',
            version: existingGrades[4] || '0'
          };
          throw skipError;
        } else {
          logDetail.innerHTML += ' ✅ Mới<br>';
        }
      } catch (err) {
        if (err.message === 'SEMESTER_EXISTS') {
          throw err;
        } else {
          logDetail.innerHTML += ' ✅ Mới<br>';
        }
      }

      logDetail.innerHTML += '⛽ Estimate gas...';
      
      const gasEstimate = await contract.methods.submitSemesterGrades(
        item.studentId,
        semesterStr,
        courseIds,
        courseNames,
        credits,
        grades,
        letterGrades,
        instructors
      ).estimateGas({ from: currentAccount });
      
      logDetail.innerHTML += ` ✅ (${gasEstimate})<br>`;

      logDetail.innerHTML += '<strong>📤 Gửi transaction (chờ xác nhận MetaMask)...</strong><br>';
      
      const tx = await contract.methods.submitSemesterGrades(
        item.studentId,
        semesterStr,
        courseIds,
        courseNames,
        credits,
        grades,
        letterGrades,
        instructors
      ).send({ 
        from: currentAccount,
        gas: Math.round(gasEstimate * 1.2)
      });

      successCount++;
      results.push({
        success: true,
        studentId: item.studentId,
        studentName: item.studentName,
        semester: semesterStr,
        courseCount: courseIds.length,
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      });

      // Update success counter
      successCounter.textContent = successCount;

      // Update log entry to success
      logEntry.style.borderLeftColor = '#28a745';
      logEntry.style.background = '#d4edda';
      logDetail.innerHTML += `
        <div style="color: #155724; font-weight: bold; margin-top: 8px;">
          ✅ THÀNH CÔNG!<br>
          TX: <code style="background: #c3e6cb; padding: 2px 6px; border-radius: 3px;">${tx.transactionHash.substring(0, 20)}...</code><br>
          Block: #${tx.blockNumber}
        </div>
      `;
      document.querySelector(`#log-${i} strong`).innerHTML += ' <span style="color: #28a745;">✅</span>';
      
      // Small delay between transactions
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('❌ Lỗi:', error);
      
      let errorMsg = error.message;
      let isSkipped = false;
      
      // Xử lý sinh viên chưa đăng ký
      if (error.message === 'STUDENT_NOT_REGISTERED') {
        failCount++;
        
        const studentId = error.studentId || item.studentId;
        errorMsg = `Sinh viên chưa được đăng ký`;
        
        results.push({
          success: false,
          skipped: false,
          studentId: studentId,
          studentName: item.studentName,
          semester: item.semester,
          error: `Sinh viên ${studentId} chưa được đăng ký`
        });

        failCounter.textContent = failCount;
        logEntry.style.borderLeftColor = '#dc3545';
        logEntry.style.background = '#f8d7da';
        logDetail.innerHTML += `
          <div style="color: #721c24; font-weight: bold; margin-top: 8px;">
            ❌ SINH VIÊN CHƯA ĐĂNG KÝ<br>
            Vui lòng đăng ký tại <code>admin_students.html</code>
          </div>
        `;
        document.querySelector(`#log-${i} strong`).innerHTML += ' <span style="color: #dc3545;">❌</span>';
        
      } else if (error.message === 'SEMESTER_EXISTS') {
        skipCount++;
        isSkipped = true;
        
        const existingData = error.existingData || {};
        errorMsg = `Học kỳ đã tồn tại`;
        
        results.push({
          success: false,
          skipped: true,
          studentId: item.studentId,
          studentName: item.studentName,
          semester: item.semester,
          error: errorMsg,
          existingData: existingData
        });

        skipCounter.textContent = skipCount;
        logEntry.style.borderLeftColor = '#ffc107';
        logEntry.style.background = '#fff3cd';
        logDetail.innerHTML += `
          <div style="color: #856404; font-weight: bold; margin-top: 8px;">
            ⏭️ BỎ QUA - HỌC KỲ ĐÃ TỒN TẠI<br>
            Submit lúc: ${existingData.submittedAt || 'N/A'}
          </div>
        `;
        document.querySelector(`#log-${i} strong`).innerHTML += ' <span style="color: #ffc107;">⏭️</span>';
        
      } else {
        failCount++;
        
        if (error.message.includes('User denied')) {
          errorMsg = 'User từ chối transaction';
        } else if (error.message.includes('reverted')) {
          errorMsg = 'Transaction bị revert';
        }
        
        results.push({
          success: false,
          skipped: false,
          studentId: item.studentId,
          studentName: item.studentName,
          semester: item.semester,
          error: errorMsg
        });

        failCounter.textContent = failCount;
        logEntry.style.borderLeftColor = '#dc3545';
        logEntry.style.background = '#f8d7da';
        logDetail.innerHTML += `
          <div style="color: #721c24; font-weight: bold; margin-top: 8px;">
            ❌ THẤT BẠI<br>
            Lỗi: ${errorMsg}
          </div>
        `;
        document.querySelector(`#log-${i} strong`).innerHTML += ' <span style="color: #dc3545;">❌</span>';
      }
      
      // Auto continue - không hỏi nữa
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Complete - update to 100%
  progressBar.style.width = '100%';
  progressBar.textContent = '100%';
  overallProgress.textContent = `${jsonData.length}/${jsonData.length}`;
  
  const endTime = Date.now();
  const duration = Math.round((endTime - startTime) / 1000); // seconds
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  currentTask.innerHTML = `
    <div style="text-align: center; color: #28a745;">
      <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
      <strong style="font-size: 18px;">HOÀN THÀNH!</strong><br>
      <span style="font-size: 14px;">Thời gian: ${minutes}p ${seconds}s</span>
    </div>
  `;

  // Tính toán số lượng
  const skippedCount = results.filter(r => r.skipped).length;
  const realFailCount = failCount - skippedCount;

  let resultHTML = `
    <div class="${successCount === jsonData.length ? 'success-box' : failCount === jsonData.length ? 'error-box' : 'warning-box'}" style="margin-top: 20px;">
      <h3>📊 KẾT QUẢ CUỐI CÙNG</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 32px; font-weight: bold; color: #667eea;">${jsonData.length}</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">TỔNG SỐ</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 32px; font-weight: bold; color: #28a745;">${successCount}</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">✅ THÀNH CÔNG</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 32px; font-weight: bold; color: #ffc107;">${skippedCount}</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">⏭️ BỎ QUA</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 32px; font-weight: bold; color: #dc3545;">${realFailCount}</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">❌ LỖI</div>
        </div>
      </div>
      <div style="background: rgba(0,0,0,0.05); padding: 12px; border-radius: 6px; margin-top: 10px;">
        <strong>⏱️ Thời gian:</strong> ${minutes} phút ${seconds} giây<br>
        <strong>📈 Tỷ lệ thành công:</strong> ${((successCount / jsonData.length) * 100).toFixed(1)}%
      </div>
    </div>
  `;

  if (results.length > 0) {
    resultHTML += `
      <details open>
        <summary style="cursor: pointer; font-weight: bold; margin: 10px 0;">
          📋 Chi tiết (${results.length} kết quả)
        </summary>
        <table style="margin-top: 15px; font-size: 12px;">
          <tr>
            <th>STT</th>
            <th>MSSV</th>
            <th>Tên SV</th>
            <th>Học kỳ</th>
            <th>Số môn</th>
            <th>Kết quả</th>
          </tr>
    `;
    
    results.forEach((r, idx) => {
      if (r.success) {
        resultHTML += `
          <tr style="background: #d4edda;">
            <td>${idx + 1}</td>
            <td><strong>${r.studentId}</strong></td>
            <td>${r.studentName}</td>
            <td>${r.semester}</td>
            <td>${r.courseCount}</td>
            <td>
              ✅ TX: <code>${r.txHash.substring(0, 10)}...</code><br>
              Block: ${r.blockNumber}
            </td>
          </tr>
        `;
      } else if (r.skipped) {
        // Học kỳ đã tồn tại - bỏ qua
        resultHTML += `
          <tr style="background: #fff3cd;">
            <td>${idx + 1}</td>
            <td><strong>${r.studentId}</strong></td>
            <td>${r.studentName}</td>
            <td>${r.semester}</td>
            <td>-</td>
            <td style="color: #856404;">
              ⏭️ <strong>BỎ QUA</strong><br>
              ${r.error}<br>
              <small>Submit lúc: ${r.existingData?.submittedAt || 'N/A'}</small>
            </td>
          </tr>
        `;
      } else {
        // Lỗi thật sự
        resultHTML += `
          <tr style="background: #f8d7da;">
            <td>${idx + 1}</td>
            <td><strong>${r.studentId}</strong></td>
            <td>${r.studentName}</td>
            <td>${r.semester}</td>
            <td>-</td>
            <td style="color: #721c24;">
              ❌ ${r.error}
            </td>
          </tr>
        `;
      }
    });
    
    resultHTML += '</table></details>';
  }

  if (successCount > 0) {
    resultHTML += `
      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
        <strong>✅ Hoàn thành!</strong><br><br>
        Đã submit thành công ${successCount} học kỳ lên blockchain.
        ${skippedCount > 0 ? `<br>Đã bỏ qua ${skippedCount} học kỳ (đã tồn tại trước đó).` : ''}
        ${realFailCount > 0 ? `<br><span style="color: #dc3545;">Có ${realFailCount} học kỳ thất bại do lỗi.</span>` : ''}
        <br><br>
        Bạn có thể kiểm tra trên Ganache hoặc qua trang tra cứu điểm.
      </div>
    `;
  } else if (skippedCount > 0 && realFailCount === 0) {
    resultHTML += `
      <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
        <strong>⏭️ Tất cả học kỳ đã tồn tại!</strong><br><br>
        ${skippedCount} học kỳ đã được submit trước đó.<br>
        Hệ thống tự động bỏ qua để tránh trùng lặp dữ liệu.<br><br>
        <strong>💡 Lưu ý:</strong> Không cho phép cập nhật/sửa đổi điểm đã submit.
      </div>
    `;
  }

  resultHTML += '</div>';
  document.getElementById('submitResult').innerHTML = resultHTML;
}

// KHÔNG tự động kết nối - Chỉ kết nối khi user bấm nút
window.addEventListener('load', async () => {
  console.log('✅ Trang đã load. Bấm nút "Kết nối MetaMask" để kết nối ví.');
});

// ==================== TAB SWITCHING ====================
function showTab(tabName) {
  if (tabName === 'upload') {
    document.getElementById('uploadTab').style.display = 'block';
    document.getElementById('viewTab').style.display = 'none';
    document.getElementById('applicationsTab').style.display = 'none';
    document.getElementById('graduateTab').style.display = 'none';
    document.getElementById('tabUpload').style.background = '#667eea';
    document.getElementById('tabUpload').style.color = 'white';
    document.getElementById('tabView').style.background = '#ddd';
    document.getElementById('tabView').style.color = '#333';
    document.getElementById('tabApplications').style.background = '#ddd';
    document.getElementById('tabApplications').style.color = '#333';
    document.getElementById('tabGraduate').style.background = '#ddd';
    document.getElementById('tabGraduate').style.color = '#333';
  } else if (tabName === 'view') {
    document.getElementById('uploadTab').style.display = 'none';
    document.getElementById('viewTab').style.display = 'block';
    document.getElementById('applicationsTab').style.display = 'none';
    document.getElementById('graduateTab').style.display = 'none';
    document.getElementById('tabUpload').style.background = '#ddd';
    document.getElementById('tabUpload').style.color = '#333';
    document.getElementById('tabView').style.background = '#667eea';
    document.getElementById('tabView').style.color = 'white';
    document.getElementById('tabApplications').style.background = '#ddd';
    document.getElementById('tabApplications').style.color = '#333';
    document.getElementById('tabGraduate').style.background = '#ddd';
    document.getElementById('tabGraduate').style.color = '#333';
    
    // Tự động load danh sách lớp khi chuyển sang tab view
    if (contract) {
      loadClasses();
    } else {
      document.getElementById('emptySection').style.display = 'block';
      document.getElementById('emptySection').innerHTML = `
        <h3>⚠️ Chưa kết nối</h3>
        <p>Vui lòng kết nối MetaMask trước khi xem điểm</p>
        <button onclick="connectWallet()">🦊 Kết nối MetaMask</button>
      `;
    }
  } else if (tabName === 'applications') {
    document.getElementById('uploadTab').style.display = 'none';
    document.getElementById('viewTab').style.display = 'none';
    document.getElementById('applicationsTab').style.display = 'block';
    document.getElementById('graduateTab').style.display = 'none';
    document.getElementById('tabUpload').style.background = '#ddd';
    document.getElementById('tabUpload').style.color = '#333';
    document.getElementById('tabView').style.background = '#ddd';
    document.getElementById('tabView').style.color = '#333';
    document.getElementById('tabApplications').style.background = '#667eea';
    document.getElementById('tabApplications').style.color = 'white';
    document.getElementById('tabGraduate').style.background = '#ddd';
    document.getElementById('tabGraduate').style.color = '#333';
    
    // Tự động load danh sách đơn xét tốt nghiệp
    if (contract) {
      loadApplicationsData();
    } else {
      document.getElementById('appEmptySection').style.display = 'block';
      document.getElementById('appEmptySection').innerHTML = `
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <h3>Chưa kết nối</h3>
          <p>Vui lòng kết nối MetaMask trước khi xem đơn xét tốt nghiệp</p>
          <button onclick="connectWallet()">🦊 Kết nối MetaMask</button>
        </div>
      `;
    }
  } else if (tabName === 'graduate') {
    document.getElementById('uploadTab').style.display = 'none';
    document.getElementById('viewTab').style.display = 'none';
    document.getElementById('applicationsTab').style.display = 'none';
    document.getElementById('graduateTab').style.display = 'block';
    document.getElementById('tabUpload').style.background = '#ddd';
    document.getElementById('tabUpload').style.color = '#333';
    document.getElementById('tabView').style.background = '#ddd';
    document.getElementById('tabView').style.color = '#333';
    document.getElementById('tabApplications').style.background = '#ddd';
    document.getElementById('tabApplications').style.color = '#333';
    document.getElementById('tabGraduate').style.background = '#667eea';
    document.getElementById('tabGraduate').style.color = 'white';
    
    // Tự động load danh sách lớp và năm tốt nghiệp
    if (contract) {
      loadGraduateClasses();
    } else {
      document.getElementById('graduateEmptySection').style.display = 'block';
      document.getElementById('graduateEmptySection').innerHTML = `
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <h3>Chưa kết nối</h3>
          <p>Vui lòng kết nối MetaMask trước khi xem danh sách tốt nghiệp</p>
          <button onclick="connectWallet()">🦊 Kết nối MetaMask</button>
        </div>
      `;
    }
  }
}

// ==================== VIEW GRADES FUNCTIONS ====================
let allGradesData = [];
let filteredData = [];
let allClasses = new Set();
let allSemesters = new Set();

// Load danh sách tất cả các lớp
async function loadClasses() {
  try {
    const totalStudents = await contract.methods.getTotalStudents().call();
    console.log('Total students:', totalStudents);
    
    for (let i = 0; i < totalStudents; i++) {
      const studentId = await contract.methods.getStudentIdByIndex(i).call();
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();
      
      if (studentInfo.class) {
        allClasses.add(studentInfo.class);
      }
    }
    
    // Populate class dropdown
    const classFilter = document.getElementById('classFilter');
    classFilter.innerHTML = '<option value="">-- Chọn lớp --</option>';
    
    const sortedClasses = Array.from(allClasses).sort();
    sortedClasses.forEach(className => {
      const option = document.createElement('option');
      option.value = className;
      option.textContent = className;
      classFilter.appendChild(option);
    });
    
    console.log('✅ Loaded classes:', sortedClasses);
    
  } catch (error) {
    console.error('❌ Error loading classes:', error);
    alert('❌ Lỗi tải danh sách lớp: ' + error.message);
  }
}

// Load dữ liệu theo lớp
async function loadClassData() {
  const selectedClass = document.getElementById('classFilter').value;
  
  if (!selectedClass) {
    document.getElementById('dataSection').style.display = 'none';
    document.getElementById('statsSection').style.display = 'none';
    document.getElementById('emptySection').style.display = 'block';
    return;
  }
  
  document.getElementById('loadingSection').style.display = 'block';
  document.getElementById('emptySection').style.display = 'none';
  document.getElementById('dataSection').style.display = 'none';
  document.getElementById('statsSection').style.display = 'none';
  
  try {
    allGradesData = [];
    allSemesters.clear();
    
    const totalStudents = await contract.methods.getTotalStudents().call();
    
    for (let i = 0; i < totalStudents; i++) {
      const studentId = await contract.methods.getStudentIdByIndex(i).call();
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();
      
      // Chỉ lấy sinh viên trong lớp được chọn
      if (studentInfo.class !== selectedClass) continue;
      
      // Lấy địa chỉ ví của sinh viên
      const walletAddress = studentInfo.walletAddress || '0x0000000000000000000000000000000000000000';
      
      const semesters = await contract.methods.getStudentSemesters(studentId).call();
      
      for (let semester of semesters) {
        allSemesters.add(semester);
        
        const gradesData = await contract.methods.getSemesterGrades(studentId, semester).call();
        const courses = gradesData[1]; // courses array
        const submittedAt = parseInt(gradesData[2]);
        const submittedBy = gradesData[3];
        
        courses.forEach(course => {
          allGradesData.push({
            studentId: studentInfo.studentId,
            studentName: studentInfo.name,
            walletAddress: walletAddress,
            class: studentInfo.class,
            semester: semester,
            courseId: course.courseId,
            courseName: course.courseName,
            credits: parseInt(course.credits),
            grade: parseFloat(course.grade) / 10,
            letterGrade: course.letterGrade,
            instructor: course.instructor,
            submittedAt: submittedAt,
            submittedBy: submittedBy
          });
        });
      }
    }
    
    // Populate year filter
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
      yearFilter.innerHTML = '<option value="">Tất cả năm học</option>';
      
      // Extract unique years from semesters
      const allYears = new Set();
      allSemesters.forEach(semester => {
        // Semester format: 20211, 20212 -> year: 2021
        const year = semester.toString().substring(0, 4);
        allYears.add(year);
      });
      
      const sortedYears = Array.from(allYears).sort((a, b) => b - a);
      sortedYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `Năm ${year}-${parseInt(year) + 1}`;
        yearFilter.appendChild(option);
      });
    }
    
    document.getElementById('loadingSection').style.display = 'none';
    
    if (allGradesData.length === 0) {
      document.getElementById('emptySection').style.display = 'block';
      document.getElementById('emptySection').innerHTML = `
        <h3>📭 Chưa có dữ liệu điểm</h3>
        <p>Lớp <strong>${selectedClass}</strong> chưa có điểm nào được upload lên blockchain</p>
      `;
    } else {
      displayStats();
      filterData();
    }
    
  } catch (error) {
    console.error('❌ Error loading class data:', error);
    document.getElementById('loadingSection').style.display = 'none';
    alert('❌ Lỗi tải dữ liệu: ' + error.message);
  }
}

// Hiển thị thống kê
function displayStats() {
  const uniqueStudents = [...new Set(allGradesData.map(d => d.studentId))];
  const uniqueSemesters = [...new Set(allGradesData.map(d => d.semester))];
  const uniqueCourses = [...new Set(allGradesData.map(d => d.courseId))];
  const totalCredits = allGradesData.reduce((sum, d) => sum + d.credits, 0);
  const avgGrade = allGradesData.reduce((sum, d) => sum + d.grade, 0) / allGradesData.length;
  
  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-box">
      <div class="icon">🎓</div>
      <div class="value">${uniqueStudents.length}</div>
      <div class="label">Sinh viên</div>
    </div>
    <div class="stat-box">
      <div class="icon">📅</div>
      <div class="value">${uniqueSemesters.length}</div>
      <div class="label">Học kỳ</div>
    </div>
    <div class="stat-box">
      <div class="icon">📚</div>
      <div class="value">${uniqueCourses.length}</div>
      <div class="label">Môn học</div>
    </div>
    <div class="stat-box">
      <div class="icon">📋</div>
      <div class="value">${allGradesData.length}</div>
      <div class="label">Bản ghi</div>
    </div>
    <div class="stat-box">
      <div class="icon">⭐</div>
      <div class="value">${totalCredits}</div>
      <div class="label">Tổng tín chỉ</div>
    </div>
    <div class="stat-box">
      <div class="icon">🎯</div>
      <div class="value">${avgGrade.toFixed(2)}</div>
      <div class="label">ĐTB</div>
    </div>
  `;
  
  document.getElementById('statsSection').style.display = 'block';
}

// Lọc dữ liệu
function filterData() {
  const yearFilter = document.getElementById('yearFilter')?.value || '';
  const studentFilter = document.getElementById('studentFilter').value.toLowerCase();
  
  filteredData = allGradesData.filter(d => {
    // Filter by year (compare first 4 digits of semester)
    const matchYear = !yearFilter || d.semester.toString().startsWith(yearFilter);
    const matchStudent = !studentFilter || 
      d.studentId.toLowerCase().includes(studentFilter) ||
      d.studentName.toLowerCase().includes(studentFilter);
    
    return matchYear && matchStudent;
  });
  
  displayTable();
}

// Hiển thị bảng dữ liệu
function displayTable() {
  document.getElementById('totalRecords').textContent = allGradesData.length;
  document.getElementById('displayRecords').textContent = filteredData.length;
  
  const tbody = document.getElementById('gradesBody');
  tbody.innerHTML = '';
  
  if (filteredData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="14" style="text-align: center; padding: 40px; color: #999;">
          <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
          <h3>Không tìm thấy kết quả</h3>
          <p>Vui lòng thử thay đổi bộ lọc</p>
        </td>
      </tr>
    `;
    document.getElementById('dataSection').style.display = 'block';
    return;
  }
  
  filteredData.forEach((d, index) => {
    const tr = document.createElement('tr');
    
    // Xác định màu cho điểm chữ
    let gradeClass = 'badge-success';
    if (d.letterGrade.startsWith('A')) gradeClass = 'badge-success';
    else if (d.letterGrade.startsWith('B')) gradeClass = 'badge-primary';
    else if (d.letterGrade.startsWith('C')) gradeClass = 'badge-warning';
    else if (d.letterGrade.startsWith('D') || d.letterGrade.startsWith('F')) gradeClass = 'badge-danger';
    
    const uploadDate = new Date(d.submittedAt * 1000);
    const dateStr = uploadDate.toLocaleString('vi-VN');
    
    // Rút gọn wallet address (hiển thị 6 ký tự đầu + ... + 4 ký tự cuối)
    let walletDisplay = '<span style="color: #999;">Chưa gán</span>';
    if (d.walletAddress && d.walletAddress !== '0x0000000000000000000000000000000000000000') {
      const short = d.walletAddress.substring(0, 6) + '...' + d.walletAddress.substring(38);
      walletDisplay = `<code title="${d.walletAddress}" style="cursor: help;">${short}</code>`;
    }
    
    tr.innerHTML = `
      <td style="text-align: center;">${index + 1}</td>
      <td><strong>${d.studentId}</strong></td>
      <td>${d.studentName}</td>
      <td>${walletDisplay}</td>
      <td><span class="badge badge-primary">${d.class}</span></td>
      <td style="text-align: center;"><strong>${d.semester}</strong></td>
      <td><code>${d.courseId}</code></td>
      <td>${d.courseName}</td>
      <td style="text-align: center;">${d.credits}</td>
      <td style="text-align: center;"><strong>${d.grade.toFixed(1)}</strong></td>
      <td style="text-align: center;"><span class="badge ${gradeClass}">${d.letterGrade}</span></td>
      <td>${d.instructor}</td>
      <td style="font-size: 12px;">${dateStr}</td>
      <td style="font-size: 11px;"><code>${d.submittedBy.substring(0, 10)}...</code></td>
    `;
    tbody.appendChild(tr);
  });
  
  document.getElementById('dataSection').style.display = 'block';
  document.getElementById('emptySection').style.display = 'none';
}

// Reset filters
function resetFilters() {
  document.getElementById('classFilter').value = '';
  if (document.getElementById('yearFilter')) {
    document.getElementById('yearFilter').value = '';
  }
  document.getElementById('studentFilter').value = '';
  
  // Reset display
  document.getElementById('dataSection').style.display = 'none';
  document.getElementById('statsSection').style.display = 'none';
  document.getElementById('emptySection').style.display = 'block';
}

// Export to Excel
function exportToExcel() {
  if (filteredData.length === 0) {
    alert('❌ Không có dữ liệu để xuất!');
    return;
  }
  
  const exportData = filteredData.map((d, index) => ({
    'STT': index + 1,
    'MSSV': d.studentId,
    'Tên sinh viên': d.studentName,
    'Lớp': d.class,
    'Học kỳ': d.semester,
    'Mã môn học': d.courseId,
    'Tên môn học': d.courseName,
    'Tín chỉ': d.credits,
    'Điểm số': d.grade,
    'Điểm chữ': d.letterGrade,
    'Giảng viên': d.instructor,
    'Ngày upload': new Date(d.submittedAt * 1000).toLocaleString('vi-VN'),
    'Người upload': d.submittedBy
  }));
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Điểm sinh viên');
  
  const selectedClass = document.getElementById('classFilter').value;
  const fileName = `Diem_${selectedClass}_${new Date().getTime()}.xlsx`;
  
  XLSX.writeFile(wb, fileName);
  
  alert(`✅ Đã xuất ${filteredData.length} bản ghi ra file ${fileName}`);
}

// ==================== GRADUATE TAB FUNCTIONS ====================
let allGraduatesData = [];
let filteredGraduatesData = [];
let graduateClasses = new Set();
let graduateYears = new Set();

// Update graduate filter type
function updateGraduateFilter() {
  const filterType = document.getElementById('graduateFilterType').value;
  
  if (filterType === 'class') {
    document.getElementById('graduateClassGroup').style.display = 'block';
    document.getElementById('graduateYearGroup').style.display = 'none';
  } else {
    document.getElementById('graduateClassGroup').style.display = 'none';
    document.getElementById('graduateYearGroup').style.display = 'block';
  }
}

// Load classes for graduate tab
async function loadGraduateClasses() {
  try {
    const totalDiplomas = await contract.methods.getTotalDiplomasIssued().call();
    console.log('Total diplomas:', totalDiplomas);
    
    graduateClasses.clear();
    graduateYears.clear();
    
    // Get all students with diplomas
    for (let i = 0; i < totalDiplomas; i++) {
      const studentId = await contract.methods.diplomaIssuedStudents(i).call();
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();
      
      if (studentInfo.class) {
        graduateClasses.add(studentInfo.class);
      }
      
      // Get diploma to extract year
      const diploma = await contract.methods.getDiploma(studentId).call();
      if (diploma.exists) {
        const year = new Date(diploma.issuedAt * 1000).getFullYear();
        graduateYears.add(year);
      }
    }
    
    // Populate class dropdown
    const classFilter = document.getElementById('graduateClassFilter');
    classFilter.innerHTML = '<option value="">-- Chọn lớp --</option>';
    Array.from(graduateClasses).sort().forEach(className => {
      classFilter.innerHTML += `<option value="${className}">${className}</option>`;
    });
    
    // Populate year dropdown
    const yearFilter = document.getElementById('graduateYearFilter');
    yearFilter.innerHTML = '<option value="">-- Chọn năm --</option>';
    Array.from(graduateYears).sort((a, b) => b - a).forEach(year => {
      yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });
    
  } catch (error) {
    console.error('Error loading graduate classes:', error);
  }
}

// Load graduate data
async function loadGraduateData() {
  const filterType = document.getElementById('graduateFilterType').value;
  let filterValue = '';
  
  if (filterType === 'class') {
    filterValue = document.getElementById('graduateClassFilter').value;
  } else {
    filterValue = document.getElementById('graduateYearFilter').value;
  }
  
  if (!filterValue || filterValue === '') {
    alert('❌ Vui lòng chọn lớp hoặc năm tốt nghiệp!');
    return;
  }
  
  try {
    document.getElementById('graduateLoadingSection').style.display = 'block';
    document.getElementById('graduateDataSection').style.display = 'none';
    document.getElementById('graduateStatsSection').style.display = 'none';
    document.getElementById('graduateEmptySection').style.display = 'none';
    
    allGraduatesData = [];
    
    const totalDiplomas = await contract.methods.getTotalDiplomasIssued().call();
    
    for (let i = 0; i < totalDiplomas; i++) {
      const studentId = await contract.methods.diplomaIssuedStudents(i).call();
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();
      const diploma = await contract.methods.getDiploma(studentId).call();
      
      if (!diploma.exists) continue;
      
      const year = new Date(diploma.issuedAt * 1000).getFullYear();
      
      // Filter by type
      let shouldInclude = false;
      if (filterType === 'class' && studentInfo.class === filterValue) {
        shouldInclude = true;
      } else if (filterType === 'year') {
        // Compare year as integer to avoid formatting issues
        const yearInt = parseInt(year);
        const filterInt = parseInt(filterValue);
        if (yearInt === filterInt) {
          shouldInclude = true;
        }
      }
      
      if (shouldInclude) {
        const gpa4 = (diploma.gpa / 100).toFixed(2);
        const gpa10 = (parseFloat(gpa4) * 2.5).toFixed(2);
        
        allGraduatesData.push({
          studentId: studentInfo.studentId,
          name: studentInfo.name,
          class: studentInfo.class,
          major: studentInfo.major,
          gpa4: parseFloat(gpa4),
          gpa10: parseFloat(gpa10),
          totalCredits: diploma.totalCredits,
          classification: diploma.classification,
          year: year,
          issuedAt: diploma.issuedAt,
          dob: normalizeDOB(studentInfo.dob), // Chuẩn hóa ngày sinh
          email: studentInfo.email,
          phone: studentInfo.phone,
          walletAddress: studentInfo.walletAddress,
          revoked: diploma.revoked || false,
          revokedAt: diploma.revokedAt || 0,
          revokedReason: diploma.revokedReason || ''
        });
      }
    }
    
    document.getElementById('graduateLoadingSection').style.display = 'none';
    
    if (allGraduatesData.length === 0) {
      document.getElementById('graduateEmptySection').style.display = 'block';
      document.getElementById('graduateEmptySection').innerHTML = `
        <div class="empty-state">
          <div class="icon">📭</div>
          <h3>Không có dữ liệu</h3>
          <p>Không tìm thấy sinh viên tốt nghiệp với điều kiện lọc đã chọn</p>
        </div>
      `;
      return;
    }
    
    filteredGraduatesData = [...allGraduatesData];
    displayGraduateStats();
    displayGraduateTable();
    
  } catch (error) {
    console.error('Error loading graduate data:', error);
    document.getElementById('graduateLoadingSection').style.display = 'none';
    alert('❌ Lỗi khi tải dữ liệu: ' + error.message);
  }
}

// Display graduate statistics
function displayGraduateStats() {
  const total = allGraduatesData.length;
  let excellentCount = 0;
  let goodCount = 0;
  let fairCount = 0;
  let totalGPA = 0;
  
  allGraduatesData.forEach(g => {
    totalGPA += g.gpa4;
    
    if (g.classification === 'Xuất sắc') excellentCount++;
    else if (g.classification === 'Giỏi') goodCount++;
    else if (g.classification === 'Khá') fairCount++;
  });
  
  const avgGPA = total > 0 ? (totalGPA / total).toFixed(2) : '0.00';
  
  document.getElementById('totalGraduates').textContent = total;
  document.getElementById('excellentCount').textContent = excellentCount;
  document.getElementById('goodCount').textContent = goodCount;
  document.getElementById('fairCount').textContent = fairCount;
  document.getElementById('avgGPA').textContent = avgGPA;
  
  document.getElementById('graduateStatsSection').style.display = 'block';
}

// Display graduate table
function displayGraduateTable() {
  const tbody = document.getElementById('graduateBody');
  tbody.innerHTML = '';
  
  document.getElementById('totalGraduateRecords').textContent = allGraduatesData.length;
  document.getElementById('displayGraduateRecords').textContent = filteredGraduatesData.length;
  
  filteredGraduatesData.forEach((g, index) => {
    const tr = document.createElement('tr');
    
    // Xếp loại color
    let classColor = '';
    if (g.classification === 'Xuất sắc') classColor = 'background: #d4edda; color: #155724;';
    else if (g.classification === 'Giỏi') classColor = 'background: #d1ecf1; color: #0c5460;';
    else if (g.classification === 'Khá') classColor = 'background: #fff3cd; color: #856404;';
    else classColor = 'background: #f8d7da; color: #721c24;';
    
    // Badge thu hồi nếu bằng đã bị thu hồi
    const revokedBadge = g.revoked 
      ? `<br><span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #721c24; color: white; margin-top: 5px;">🚫 ĐÃ THU HỒI</span>`
      : '';
    
    // Nút thu hồi
    const revokeButton = !g.revoked
      ? `<button onclick="revokeDiploma('${g.studentId}')" style="padding: 5px 12px; font-size: 12px; background: #dc3545; margin: 2px;">
          ❌ Thu hồi
        </button>`
      : `<button onclick="viewRevokeInfo('${g.studentId}')" style="padding: 5px 12px; font-size: 12px; background: #6c757d; margin: 2px;">
          ℹ️ Thông tin thu hồi
        </button>`;
    
    tr.innerHTML = `
      <td style="text-align: center;">${index + 1}</td>
      <td><strong>${g.studentId}</strong>${revokedBadge}</td>
      <td>${g.name}</td>
      <td>${g.class}</td>
      <td>${g.major}</td>
      <td style="text-align: center;"><strong>${g.gpa4}</strong></td>
      <td style="text-align: center;">${g.gpa10}</td>
      <td style="text-align: center;">${g.totalCredits}</td>
      <td><span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; ${classColor}">${g.classification}</span></td>
      <td style="text-align: center;">${g.year}</td>
      <td style="text-align: center;">
        <button onclick="viewGraduateDetail('${g.studentId}')" style="padding: 5px 12px; font-size: 12px; background: #667eea; margin: 2px;">
          👁️ Chi tiết
        </button>
        ${revokeButton}
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  document.getElementById('graduateDataSection').style.display = 'block';
  document.getElementById('graduateEmptySection').style.display = 'none';
}

// Filter graduate data
function filterGraduateData() {
  const searchTerm = document.getElementById('graduateStudentFilter').value.toLowerCase().trim();
  
  if (!searchTerm) {
    filteredGraduatesData = [...allGraduatesData];
  } else {
    filteredGraduatesData = allGraduatesData.filter(g => 
      g.studentId.toLowerCase().includes(searchTerm) ||
      g.name.toLowerCase().includes(searchTerm)
    );
  }
  
  displayGraduateTable();
}

// Reset graduate filters
function resetGraduateFilters() {
  document.getElementById('graduateFilterType').value = 'class';
  document.getElementById('graduateClassFilter').value = '';
  document.getElementById('graduateYearFilter').value = '';
  document.getElementById('graduateStudentFilter').value = '';
  updateGraduateFilter();
  
  document.getElementById('graduateDataSection').style.display = 'none';
  document.getElementById('graduateStatsSection').style.display = 'none';
  document.getElementById('graduateEmptySection').style.display = 'block';
}

// Export graduates to Excel
function exportGraduatesToExcel() {
  if (filteredGraduatesData.length === 0) {
    alert('❌ Không có dữ liệu để xuất!');
    return;
  }
  
  const exportData = filteredGraduatesData.map((g, index) => ({
    'STT': index + 1,
    'MSSV': g.studentId,
    'Tên sinh viên': g.name,
    'Lớp': g.class,
    'Ngành': g.major,
    'GPA (4.0)': g.gpa4,
    'GPA (10)': g.gpa10,
    'Tín chỉ': g.totalCredits,
    'Xếp loại': g.classification,
    'Năm tốt nghiệp': g.year,
    'Ngày cấp bằng': new Date(g.issuedAt * 1000).toLocaleDateString('vi-VN')
  }));
  
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sinh viên tốt nghiệp');
  
  const filterType = document.getElementById('graduateFilterType').value;
  const filterValue = filterType === 'class' ? 
    document.getElementById('graduateClassFilter').value : 
    document.getElementById('graduateYearFilter').value;
  const fileName = `TotNghiep_${filterValue}_${new Date().getTime()}.xlsx`;
  
  XLSX.writeFile(wb, fileName);
  
  alert(`✅ Đã xuất ${filteredGraduatesData.length} sinh viên ra file ${fileName}`);
}

// View student detail
async function viewGraduateDetail(studentId) {
  try {
    // Check if contract is initialized
    if (!contract || !web3) {
      alert('⚠️ Vui lòng kết nối MetaMask trước!');
      return;
    }
    
    const modal = document.getElementById('studentDetailModal');
    const content = document.getElementById('studentDetailContent');
    
    if (!modal || !content) {
      console.error('Modal elements not found');
      alert('❌ Lỗi: Không tìm thấy modal hiển thị chi tiết');
      return;
    }
    
    content.innerHTML = '<div class="loading">Đang tải thông tin...</div>';
    modal.style.display = 'block';
    
    // Get student info
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    const diploma = await contract.methods.getDiploma(studentId).call();
    const semesters = await contract.methods.getStudentSemesters(studentId).call();
    
    // Calculate detailed statistics
    let allGrades = [];
    for (let semester of semesters) {
      const gradeData = await contract.methods.getSemesterGrades(studentId, semester).call();
      const courses = gradeData[1];
      
      courses.forEach(course => {
        const grade10 = parseInt(course.grade) / 100;
        allGrades.push({
          semester: semester,
          courseId: course.courseId,
          courseName: course.courseName,
          credits: parseInt(course.credits),
          grade: grade10,
          letterGrade: course.letterGrade
        });
      });
    }
    
    // Group by course and get best grade
    const courseMap = new Map();
    allGrades.forEach(g => {
      if (!courseMap.has(g.courseId) || courseMap.get(g.courseId).grade < g.grade) {
        courseMap.set(g.courseId, g);
      }
    });
    
    const bestGrades = Array.from(courseMap.values());
    
    // Calculate detailed GPA
    let totalCredits = 0;
    let totalPoints = 0;
    let gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    bestGrades.forEach(g => {
      totalCredits += g.credits;
      totalPoints += g.grade * g.credits;
      
      if (g.grade >= 9.0) gradeDistribution.A++;
      else if (g.grade >= 7.0) gradeDistribution.B++;
      else if (g.grade >= 5.5) gradeDistribution.C++;
      else if (g.grade >= 4.0) gradeDistribution.D++;
      else gradeDistribution.F++;
    });
    
    const calculatedGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    const gpa4 = (parseFloat(calculatedGPA) / 2.5).toFixed(2);
    
    content.innerHTML = `
      <!-- Thông tin cá nhân -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #667eea; margin-bottom: 15px;">👤 Thông tin cá nhân</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          <div><strong>MSSV:</strong> ${studentInfo.studentId}</div>
          <div><strong>Họ tên:</strong> ${studentInfo.name}</div>
          <div><strong>Ngày sinh:</strong> ${normalizeDOB(studentInfo.dob)}</div>
          <div><strong>Lớp:</strong> ${studentInfo.class}</div>
          <div><strong>Ngành:</strong> ${studentInfo.major}</div>
          <div><strong>Mã ngành:</strong> ${studentInfo.majorCode}</div>
          <div><strong>Email:</strong> ${studentInfo.email}</div>
          <div><strong>SĐT:</strong> ${studentInfo.phone}</div>
          <div style="grid-column: 1 / -1;"><strong>Địa chỉ ví:</strong> <code style="font-size: 11px;">${studentInfo.walletAddress}</code></div>
        </div>
      </div>
      
      <!-- Kết quả tốt nghiệp -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; color: white;">
        <h3 style="margin-bottom: 15px;">🎓 Kết quả tốt nghiệp</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
          <div>
            <div style="font-size: 11px; opacity: 0.8;">GPA (Hệ 10)</div>
            <div style="font-size: 28px; font-weight: bold;">${calculatedGPA}</div>
          </div>
          <div>
            <div style="font-size: 11px; opacity: 0.8;">GPA (Hệ 4)</div>
            <div style="font-size: 28px; font-weight: bold;">${gpa4}</div>
          </div>
          <div>
            <div style="font-size: 11px; opacity: 0.8;">Tín chỉ tích lũy</div>
            <div style="font-size: 28px; font-weight: bold;">${totalCredits}</div>
          </div>
          <div>
            <div style="font-size: 11px; opacity: 0.8;">Xếp loại</div>
            <div style="font-size: 20px; font-weight: bold; margin-top: 8px;">${diploma.classification}</div>
          </div>
          <div>
            <div style="font-size: 11px; opacity: 0.8;">Năm tốt nghiệp</div>
            <div style="font-size: 28px; font-weight: bold;">${new Date(diploma.issuedAt * 1000).getFullYear()}</div>
          </div>
        </div>
      </div>
      
      <!-- Phân bố điểm -->
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #856404; margin-bottom: 15px;">📊 Phân bố điểm</h3>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; text-align: center;">
          <div style="background: #d4edda; padding: 15px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: #155724;">${gradeDistribution.A}</div>
            <div style="font-size: 12px; color: #155724;">Điểm A (≥9.0)</div>
          </div>
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: #0c5460;">${gradeDistribution.B}</div>
            <div style="font-size: 12px; color: #0c5460;">Điểm B (≥7.0)</div>
          </div>
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: #856404;">${gradeDistribution.C}</div>
            <div style="font-size: 12px; color: #856404;">Điểm C (≥5.5)</div>
          </div>
          <div style="background: #f8d7da; padding: 15px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: #721c24;">${gradeDistribution.D}</div>
            <div style="font-size: 12px; color: #721c24;">Điểm D (≥4.0)</div>
          </div>
          <div style="background: #f5c6cb; padding: 15px; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: #721c24;">${gradeDistribution.F}</div>
            <div style="font-size: 12px; color: #721c24;">Điểm F (<4.0)</div>
          </div>
        </div>
      </div>
      
      <!-- Chi tiết các môn học -->
      <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #667eea;">
        <h3 style="color: #667eea; margin-bottom: 15px;">📚 Chi tiết các môn học (${bestGrades.length} môn)</h3>
        <div style="max-height: 400px; overflow-y: auto;">
          <table class="data-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th style="width: 40px;">STT</th>
                <th>Mã MH</th>
                <th>Tên môn học</th>
                <th style="text-align: center;">TC</th>
                <th style="text-align: center;">Điểm</th>
                <th style="text-align: center;">Chữ</th>
                <th>Học kỳ</th>
              </tr>
            </thead>
            <tbody>
              ${bestGrades.map((g, idx) => {
                let gradeClass = '';
                if (g.grade >= 9.0) gradeClass = 'grade-A';
                else if (g.grade >= 7.0) gradeClass = 'grade-B';
                else if (g.grade >= 5.5) gradeClass = 'grade-C';
                else if (g.grade >= 4.0) gradeClass = 'grade-D';
                else gradeClass = 'grade-F';
                
                return `
                  <tr>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td><code>${g.courseId}</code></td>
                    <td>${g.courseName}</td>
                    <td style="text-align: center;">${g.credits}</td>
                    <td style="text-align: center;"><strong>${g.grade.toFixed(1)}</strong></td>
                    <td style="text-align: center;"><span class="grade-badge ${gradeClass}">${g.letterGrade}</span></td>
                    <td>${g.semester}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Error loading student detail:', error);
    document.getElementById('studentDetailContent').innerHTML = `
      <div class="error-box">
        <h3>❌ Lỗi tải thông tin</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Close student detail modal
function closeStudentDetail() {
  const modal = document.getElementById('studentDetailModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// ====== THU HỒI BẰNG TỐT NGHIỆP ======
async function viewRevokeInfo(studentId) {
  try {
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    const diploma = await contract.methods.getDiploma(studentId).call();
    
    if (!diploma.revoked) {
      alert('⚠️ Bằng tốt nghiệp chưa bị thu hồi!');
      return;
    }
    
    const revokedDate = new Date(diploma.revokedAt * 1000).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const issuedDate = new Date(diploma.issuedAt * 1000).toLocaleDateString('vi-VN');
    
    alert(`🚫 THÔNG TIN THU HỒI BẰNG TỐT NGHIỆP\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Sinh viên: ${studentInfo.name}\n` +
      `🆔 MSSV: ${studentId}\n` +
      `📚 Lớp: ${studentInfo.class}\n\n` +
      `━━━ THÔNG TIN BẰNG ━━━\n` +
      `📊 GPA: ${(diploma.gpa / 100).toFixed(2)}\n` +
      `📖 Tín chỉ: ${diploma.totalCredits}\n` +
      `🏆 Xếp loại: ${diploma.classification}\n` +
      `📅 Ngày cấp: ${issuedDate}\n\n` +
      `━━━ THÔNG TIN THU HỒI ━━━\n` +
      `🚫 Trạng thái: ĐÃ BỊ THU HỒI\n` +
      `⏰ Thời gian thu hồi: ${revokedDate}\n` +
      `📝 Lý do: ${diploma.revokedReason}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
  } catch (error) {
    console.error('Error viewing revoke info:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

async function revokeDiploma(studentId) {
  if (!currentAccount) {
    alert('⚠️ Vui lòng kết nối MetaMask trước!');
    return;
  }
  
  try {
    // Kiểm tra quyền Dean (cán bộ quản lý điểm)
    const isDean = await contract.methods.isDean(currentAccount).call();
    if (!isDean) {
      alert('❌ Chỉ cán bộ quản lý điểm (Dean) mới có quyền thu hồi bằng tốt nghiệp!');
      return;
    }
    
    // Lấy thông tin sinh viên và bằng
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    const diploma = await contract.methods.getDiploma(studentId).call();
    
    if (!diploma.exists) {
      alert(`❌ Sinh viên ${studentId} chưa có bằng tốt nghiệp!`);
      return;
    }
    
    // Kiểm tra đã bị thu hồi chưa
    if (diploma.revoked) {
      const revokedDate = new Date(diploma.revokedAt * 1000).toLocaleString('vi-VN');
      alert(`⚠️ Bằng tốt nghiệp của sinh viên ${studentId} đã bị thu hồi!\n\n` +
        `Thời gian thu hồi: ${revokedDate}\n` +
        `Lý do: ${diploma.revokedReason || 'Không có lý do'}`);
      return;
    }
    
    // Xác nhận thu hồi
    const confirmMsg = `⚠️ THU HỒI BẰNG TỐT NGHIỆP\n\n` +
      `Sinh viên: ${studentInfo.name} (${studentId})\n` +
      `Xếp loại: ${diploma.classification}\n` +
      `GPA: ${(diploma.gpa / 100).toFixed(2)}\n` +
      `Tín chỉ: ${diploma.totalCredits}\n` +
      `Ngày cấp: ${new Date(diploma.issuedAt * 1000).toLocaleDateString('vi-VN')}\n\n` +
      `⚠️ CẢNH BÁO:\n` +
      `• Hành động này là NGHIÊM TRỌNG và sẽ được ghi lại trên blockchain\n` +
      `• Bằng sẽ bị đánh dấu là ĐÃ THU HỒI\n` +
      `• Không thể hoàn tác sau khi thực hiện\n\n` +
      `LÝ DO thu hồi thường là:\n` +
      `• Phát hiện gian lận trong quá trình học tập\n` +
      `• Vi phạm quy định nghiêm trọng\n` +
      `• Sai sót trong việc cấp bằng\n\n` +
      `Bạn có CHẮC CHẮN muốn thu hồi bằng này?`;
    
    if (!confirm(confirmMsg)) {
      return;
    }
    
    // Yêu cầu nhập lý do
    const reason = prompt('📝 Vui lòng nhập LÝ DO thu hồi bằng:\n(Bắt buộc - tối thiểu 10 ký tự)');
    
    if (!reason || reason.trim().length < 10) {
      alert('❌ Lý do thu hồi không hợp lệ! Vui lòng nhập ít nhất 10 ký tự.');
      return;
    }
    
    // Xác nhận lần 2
    if (!confirm(`⚠️ XÁC NHẬN LẦN CUỐI\n\nLý do: ${reason}\n\nTiếp tục thu hồi bằng?`)) {
      return;
    }
    
    // Thực hiện thu hồi trên blockchain
    console.log('🔄 Đang thu hồi bằng tốt nghiệp...');
    
    const tx = await contract.methods.revokeDiploma(studentId, reason.trim()).send({
      from: currentAccount,
      gas: 500000
    });
    
    console.log('✅ Thu hồi bằng thành công:', tx.transactionHash);
    
    alert(`✅ ĐÃ THU HỒI BẰNG THÀNH CÔNG!\n\n` +
      `Sinh viên: ${studentInfo.name} (${studentId})\n` +
      `Lý do: ${reason}\n` +
      `Transaction: ${tx.transactionHash}\n\n` +
      `Thông tin đã được ghi lại trên blockchain.`);
    
    // Reload dữ liệu
    await loadGraduateData();
    
  } catch (error) {
    console.error('❌ Lỗi thu hồi bằng:', error);
    
    let errorMsg = error.message;
    if (error.message.includes('Diploma not issued yet')) {
      errorMsg = 'Bằng chưa được cấp!';
    } else if (error.message.includes('Diploma already revoked')) {
      errorMsg = 'Bằng đã bị thu hồi trước đó!';
    } else if (error.message.includes('Revoke reason required')) {
      errorMsg = 'Lý do thu hồi không được để trống!';
    } else if (error.message.includes('Only owner') || error.message.includes('only dean')) {
      errorMsg = 'Chỉ cán bộ quản lý điểm mới có quyền thu hồi bằng!';
    }
    
    alert('❌ Lỗi thu hồi bằng: ' + errorMsg);
  }
}

// ==================== GRADUATION APPLICATIONS FUNCTIONS ====================
let allApplicationsData = [];
let filteredApplicationsData = [];

async function loadApplicationsData() {
  if (!contract) {
    alert('⚠️ Vui lòng kết nối MetaMask trước!');
    return;
  }
  
  try {
    // Hiển thị loading
    document.getElementById('appLoadingSection').style.display = 'block';
    document.getElementById('appEmptySection').style.display = 'none';
    document.getElementById('appStatsSection').style.display = 'none';
    document.getElementById('appDataSection').style.display = 'none';
    
    console.log('🔄 Đang tải danh sách đơn xét tốt nghiệp...');
    
    // Lấy tổng số đơn
    const totalApps = await contract.methods.getTotalGraduationApplications().call();
    console.log(`📊 Tổng số đơn: ${totalApps}`);
    
    if (totalApps == 0) {
      document.getElementById('appLoadingSection').style.display = 'none';
      document.getElementById('appEmptySection').style.display = 'block';
      return;
    }
    
    // Lấy danh sách tất cả đơn
    const applications = [];
    for (let i = 0; i < totalApps; i++) {
      const studentId = await contract.methods.getGraduationApplicantByIndex(i).call();
      const appInfo = await contract.methods.getGraduationApplication(studentId).call();
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();
      
      applications.push({
        studentId: studentId,
        name: studentInfo.name,
        class: studentInfo.class,
        major: studentInfo.major,
        applicationHash: appInfo.applicationHash,
        appliedAt: parseInt(appInfo.appliedAt),
        gpa: parseInt(appInfo.gpa),
        totalCredits: parseInt(appInfo.totalCredits),
        classification: appInfo.classification,
        status: parseInt(appInfo.status),
        processedAt: parseInt(appInfo.processedAt),
        processedBy: appInfo.processedBy,
        notes: appInfo.notesStr
      });
    }
    
    console.log(`✅ Đã tải ${applications.length} đơn`);
    
    // Lưu dữ liệu
    allApplicationsData = applications;
    filteredApplicationsData = applications;
    
    // Hiển thị dữ liệu
    displayApplicationsData(applications);
    updateApplicationsStats(applications);
    populateAppYearFilter(applications);
    
    // Hiển thị UI
    document.getElementById('appLoadingSection').style.display = 'none';
    document.getElementById('appStatsSection').style.display = 'block';
    document.getElementById('appDataSection').style.display = 'block';
    
  } catch (error) {
    console.error('Lỗi tải đơn:', error);
    document.getElementById('appLoadingSection').style.display = 'none';
    document.getElementById('appEmptySection').style.display = 'block';
    document.getElementById('appEmptySection').innerHTML = `
      <div class="empty-state">
        <div class="icon">❌</div>
        <h3>Lỗi tải dữ liệu</h3>
        <p>${error.message}</p>
        <button onclick="loadApplicationsData()" style="margin-top: 15px;">🔄 Thử lại</button>
      </div>
    `;
  }
}

function displayApplicationsData(apps) {
  const tbody = document.getElementById('applicationsBody');
  
  if (!apps || apps.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" style="text-align: center; padding: 40px;">
          <div style="color: #999;">
            📭 Chưa có đơn xét tốt nghiệp nào
          </div>
        </td>
      </tr>
    `;
    document.getElementById('totalAppRecords').textContent = '0';
    document.getElementById('displayAppRecords').textContent = '0';
    return;
  }
  
  let html = '';
  apps.forEach((app, index) => {
    const gpa4 = (app.gpa / 100).toFixed(2);
    const gpa10 = (gpa4 * 2.5).toFixed(2);
    const appliedDate = new Date(app.appliedAt * 1000).toLocaleDateString('vi-VN');
    
    let statusBadge = '';
    let actionButtons = '';
    
    if (app.status === 0) {
      // Pending
      statusBadge = '<span class="badge" style="background: #fff3cd; color: #856404; border: 1px solid #ffc107;">⏳ Đang chờ</span>';
      actionButtons = `
        <button onclick="approveGraduationApp('${app.studentId}')" 
          style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 2px; font-size: 12px;"
          title="Duyệt đơn">
          ✅ Duyệt
        </button>
        <button onclick="rejectGraduationApp('${app.studentId}')" 
          style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin: 2px; font-size: 12px;"
          title="Từ chối đơn">
          ❌ Từ chối
        </button>
      `;
    } else if (app.status === 1) {
      // Approved
      const processedDate = new Date(app.processedAt * 1000).toLocaleDateString('vi-VN');
      statusBadge = `<span class="badge" style="background: #d4edda; color: #155724; border: 1px solid #28a745;">✅ Đã duyệt<br><small>${processedDate}</small></span>`;
      actionButtons = `<small style="color: #666;">Đã cấp bằng</small>`;
    } else if (app.status === 2) {
      // Rejected
      const processedDate = new Date(app.processedAt * 1000).toLocaleDateString('vi-VN');
      statusBadge = `<span class="badge" style="background: #f8d7da; color: #721c24; border: 1px solid #dc3545;">❌ Đã từ chối<br><small>${processedDate}</small></span>`;
      actionButtons = `<button onclick="viewAppDetails('${app.studentId}')" 
        style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
        📋 Xem lý do
      </button>`;
    }
    
    html += `
      <tr style="background: ${app.status === 0 ? '#fffbf0' : 'white'};">
        <td style="text-align: center;">${index + 1}</td>
        <td><strong>${app.studentId}</strong></td>
        <td>${app.name}</td>
        <td>${app.class || '-'}</td>
        <td style="text-align: center; font-weight: 600;">${gpa4}</td>
        <td style="text-align: center;">${gpa10}</td>
        <td style="text-align: center;">${app.totalCredits}</td>
        <td>
          <span class="badge badge-${app.classification === 'Xuất sắc' ? 'success' : app.classification === 'Giỏi' ? 'primary' : app.classification === 'Khá' ? 'warning' : 'secondary'}">
            ${app.classification}
          </span>
        </td>
        <td style="font-size: 12px;">${appliedDate}</td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="text-align: center;">
          <button onclick="viewAppDetails('${app.studentId}')" 
            style="background: #17a2b8; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;"
            title="Xem chi tiết sinh viên">
            🔍 Chi tiết
          </button>
        </td>
        <td style="text-align: center;">${actionButtons}</td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
  document.getElementById('totalAppRecords').textContent = apps.length;
  document.getElementById('displayAppRecords').textContent = apps.length;
}

function updateApplicationsStats(apps) {
  const total = apps.length;
  const pending = apps.filter(a => a.status === 0).length;
  const approved = apps.filter(a => a.status === 1).length;
  const rejected = apps.filter(a => a.status === 2).length;
  
  let totalGPA = 0;
  apps.forEach(a => {
    totalGPA += a.gpa / 100;
  });
  const avgGPA = total > 0 ? (totalGPA / total).toFixed(2) : '0.00';
  
  document.getElementById('totalApplications').textContent = total;
  document.getElementById('pendingApplications').textContent = pending;
  document.getElementById('approvedApplications').textContent = approved;
  document.getElementById('rejectedApplications').textContent = rejected;
  document.getElementById('appAvgGPA').textContent = avgGPA;
}

function populateAppYearFilter(apps) {
  const years = new Set();
  apps.forEach(app => {
    const year = new Date(app.appliedAt * 1000).getFullYear();
    years.add(year);
  });
  
  const select = document.getElementById('appYearFilter');
  select.innerHTML = '<option value="">Tất cả năm</option>';
  [...years].sort((a, b) => b - a).forEach(year => {
    select.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

function updateAppFilter() {
  filterApplicationData();
}

function filterApplicationData() {
  const statusFilter = document.getElementById('appFilterType').value;
  const yearFilter = document.getElementById('appYearFilter').value;
  const searchText = document.getElementById('appStudentFilter').value.toLowerCase();
  
  let filtered = allApplicationsData;
  
  // Lọc theo trạng thái
  if (statusFilter === 'pending') {
    filtered = filtered.filter(a => a.status === 0);
  } else if (statusFilter === 'approved') {
    filtered = filtered.filter(a => a.status === 1);
  } else if (statusFilter === 'rejected') {
    filtered = filtered.filter(a => a.status === 2);
  }
  
  // Lọc theo năm
  if (yearFilter) {
    filtered = filtered.filter(a => {
      const year = new Date(a.appliedAt * 1000).getFullYear();
      return year == yearFilter;
    });
  }
  
  // Tìm kiếm theo MSSV/Tên
  if (searchText) {
    filtered = filtered.filter(a => 
      a.studentId.toLowerCase().includes(searchText) ||
      a.name.toLowerCase().includes(searchText)
    );
  }
  
  filteredApplicationsData = filtered;
  displayApplicationsData(filtered);
}

function resetAppFilters() {
  document.getElementById('appFilterType').value = 'all';
  document.getElementById('appYearFilter').value = '';
  document.getElementById('appStudentFilter').value = '';
  filteredApplicationsData = allApplicationsData;
  displayApplicationsData(allApplicationsData);
}

// Xem chi tiết đơn xét tốt nghiệp
async function viewAppDetails(studentId) {
  if (!contract) {
    alert('⚠️ Vui lòng kết nối MetaMask!');
    return;
  }
  
  try {
    // Lấy thông tin đơn và sinh viên
    const appInfo = await contract.methods.getGraduationApplication(studentId).call();
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    
    if (!appInfo.exists) {
      alert('❌ Không tìm thấy đơn xét tốt nghiệp!');
      return;
    }
    
    const gpa4 = (parseInt(appInfo.gpa) / 100).toFixed(2);
    const gpa10 = (gpa4 * 2.5).toFixed(2);
    const appliedDate = new Date(parseInt(appInfo.appliedAt) * 1000).toLocaleString('vi-VN');
    
    let statusText = '';
    if (appInfo.status == 0) {
      statusText = '⏳ Đang chờ duyệt';
    } else if (appInfo.status == 1) {
      const processedDate = new Date(parseInt(appInfo.processedAt) * 1000).toLocaleString('vi-VN');
      statusText = `✅ Đã duyệt vào ${processedDate}`;
    } else if (appInfo.status == 2) {
      const processedDate = new Date(parseInt(appInfo.processedAt) * 1000).toLocaleString('vi-VN');
      statusText = `❌ Đã từ chối vào ${processedDate}`;
    }
    
    let detailsHtml = `
🎓 THÔNG TIN CHI TIẾT ĐƠN XÉT TỐT NGHIỆP

` +
    `┌───────────────────────────────────────────────────────────┐
` +
    `│ THÔNG TIN SINH VIÊN                                             │
` +
    `├───────────────────────────────────────────────────────────┤
` +
    `│ MSSV: ${studentId.padEnd(49)} │
` +
    `│ Họ tên: ${studentInfo.name.padEnd(46)} │
` +
    `│ Lớp: ${(studentInfo.class || '-').padEnd(50)} │
` +
    `│ Ngành: ${(studentInfo.major || '-').padEnd(49)} │
` +
    `│ Khoa: ${(studentInfo.department || '-').padEnd(49)} │
` +
    `├───────────────────────────────────────────────────────────┤
` +
    `│ KẾT QUẢ HỌC TẬP                                                  │
` +
    `├───────────────────────────────────────────────────────────┤
` +
    `│ GPA (hệ 4.0): ${gpa4.padEnd(41)} │
` +
    `│ GPA (hệ 10): ${gpa10.padEnd(41)} │
` +
    `│ Tín chỉ tích lũy: ${appInfo.totalCredits.toString().padEnd(37)} │
` +
    `│ Xếp loại: ${appInfo.classification.padEnd(44)} │
` +
    `├───────────────────────────────────────────────────────────┤
` +
    `│ THÔNG TIN ĐƠN                                                   │
` +
    `├───────────────────────────────────────────────────────────┤
` +
    `│ Ngày nộp đơn: ${appliedDate.padEnd(38)} │
` +
    `│ Trạng thái: ${statusText.padEnd(43)} │
` +
    `│ Mã đơn: ${appInfo.applicationHash.substring(0, 16)}...${' '.repeat(27)} │
`;
    
    if (appInfo.status == 1) {
      detailsHtml += `│ Người duyệt: ${appInfo.processedBy.substring(0, 42)}  │
`;
      if (appInfo.notesStr) {
        detailsHtml += `│ Ghi chú: ${appInfo.notesStr.padEnd(45)} │
`;
      }
    } else if (appInfo.status == 2) {
      detailsHtml += `│ Người từ chối: ${appInfo.processedBy.substring(0, 38)}  │
`;
      if (appInfo.notesStr) {
        detailsHtml += `│ Lý do từ chối: ${appInfo.notesStr.padEnd(39)} │
`;
      }
    }
    
    detailsHtml += `└───────────────────────────────────────────────────────────┘`;
    
    alert(detailsHtml);
    
  } catch (error) {
    console.error('Lỗi xem chi tiết đơn:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

// Duyệt đơn xét tốt nghiệp
async function approveGraduationApp(studentId) {
  if (!contract || !currentAccount) {
    alert('⚠️ Vui lòng kết nối MetaMask!');
    return;
  }
  
  try {
    // Kiểm tra quyền Dean
    const isDean = await contract.methods.isDean(currentAccount).call();
    const owner = await contract.methods.owner().call();
    
    if (!isDean && currentAccount.toLowerCase() !== owner.toLowerCase()) {
      alert('❌ Chỉ Dean hoặc Owner mới có quyền duyệt đơn!');
      return;
    }
    
    // Lấy thông tin đơn
    const appInfo = await contract.methods.getGraduationApplication(studentId).call();
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    
    if (!appInfo.exists) {
      alert('❌ Không tìm thấy đơn xét tốt nghiệp!');
      return;
    }
    
    if (appInfo.status != 0) {
      alert('⚠️ Đơn này đã được xử lý rồi!');
      return;
    }
    
    // Xác nhận
    const gpa4 = (parseInt(appInfo.gpa) / 100).toFixed(2);
    const confirmMsg = `✅ DUYỆT ĐƠN XÉT TỐT NGHIỆP\n\n` +
      `Sinh viên: ${studentInfo.name} (${studentId})\n` +
      `Lớp: ${studentInfo.class}\n` +
      `GPA: ${gpa4} / 4.0\n` +
      `Tín chỉ: ${appInfo.totalCredits}\n` +
      `Xếp loại: ${appInfo.classification}\n\n` +
      `Sau khi duyệt, hệ thống sẽ:\n` +
      `• Tự động cấp bằng tốt nghiệp cho sinh viên\n` +
      `• Ghi nhận thông tin lên blockchain\n` +
      `• Sinh viên có thể xem và chia sẻ bằng\n\n` +
      `Bạn xác nhận DUYỆT đơn này?`;
    
    if (!confirm(confirmMsg)) {
      return;
    }
    
    // Yêu cầu nhập hash của file PDF bằng (hoặc generate từ template)
    const diplomaHash = prompt('📄 Nhập SHA256 hash của file PDF bằng tốt nghiệp:\n(Để trống nếu muốn hệ thống tự tạo hash từ template)', '');
    
    let finalDiplomaHash = diplomaHash;
    if (!diplomaHash || diplomaHash.trim() === '') {
      // Tự động tạo hash từ template
      const diplomaData = {
        studentId: studentId,
        name: studentInfo.name,
        gpa: gpa4,
        credits: appInfo.totalCredits,
        classification: appInfo.classification,
        timestamp: Date.now()
      };
      finalDiplomaHash = CryptoJS.SHA256(JSON.stringify(diplomaData)).toString();
      console.log('🔐 Đã tạo diploma hash:', finalDiplomaHash);
    }
    
    // Gọi contract
    console.log('🔄 Đang duyệt đơn...');
    const receipt = await contract.methods.approveGraduation(
      studentId,
      finalDiplomaHash,
      'Đã duyệt xét tốt nghiệp'
    ).send({ from: currentAccount, gas: 500000 });
    
    console.log('✅ Đã duyệt đơn:', receipt);
    alert(`🎉 Đã duyệt đơn xét tốt nghiệp cho sinh viên ${studentId}!\nBằng tốt nghiệp đã được cấp thành công.`);
    
    // Tải lại dữ liệu
    loadApplicationsData();
    
  } catch (error) {
    console.error('Lỗi duyệt đơn:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

// Từ chối đơn xét tốt nghiệp
async function rejectGraduationApp(studentId) {
  if (!contract || !currentAccount) {
    alert('⚠️ Vui lòng kết nối MetaMask!');
    return;
  }
  
  try {
    // Kiểm tra quyền Dean
    const isDean = await contract.methods.isDean(currentAccount).call();
    const owner = await contract.methods.owner().call();
    
    if (!isDean && currentAccount.toLowerCase() !== owner.toLowerCase()) {
      alert('❌ Chỉ Dean hoặc Owner mới có quyền từ chối đơn!');
      return;
    }
    
    // Lấy thông tin đơn
    const appInfo = await contract.methods.getGraduationApplication(studentId).call();
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    
    if (!appInfo.exists) {
      alert('❌ Không tìm thấy đơn xét tốt nghiệp!');
      return;
    }
    
    if (appInfo.status != 0) {
      alert('⚠️ Đơn này đã được xử lý rồi!');
      return;
    }
    
    // Yêu cầu nhập lý do
    const reason = prompt(`❌ TỪ CHỐI ĐƠN XÉT TỐT NGHIỆP\n\nSinh viên: ${studentInfo.name} (${studentId})\n\nVui lòng nhập LÝ DO từ chối:\n(Bắt buộc - tối thiểu 10 ký tự)`, '');
    
    if (!reason || reason.trim().length < 10) {
      alert('❌ Lý do từ chối không hợp lệ! Vui lòng nhập ít nhất 10 ký tự.');
      return;
    }
    
    // Xác nhận
    if (!confirm(`⚠️ Xác nhận TỪ CHỐI đơn của sinh viên ${studentId}?\n\nLý do: ${reason}\n\nSinh viên sẽ nhận được thông báo này.`)) {
      return;
    }
    
    // Gọi contract
    console.log('🔄 Đang từ chối đơn...');
    const receipt = await contract.methods.rejectGraduation(
      studentId,
      reason
    ).send({ from: currentAccount, gas: 200000 });
    
    console.log('✅ Đã từ chối đơn:', receipt);
    alert(`Đã từ chối đơn xét tốt nghiệp của sinh viên ${studentId}.`);
    
    // Tải lại dữ liệu
    loadApplicationsData();
    
  } catch (error) {
    console.error('Lỗi từ chối đơn:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

// Xem chi tiết đơn
async function viewAppDetails(studentId) {
  try {
    const appInfo = await contract.methods.getGraduationApplication(studentId).call();
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    
    const gpa4 = (parseInt(appInfo.gpa) / 100).toFixed(2);
    const gpa10 = (gpa4 * 2.5).toFixed(2);
    const appliedDate = new Date(parseInt(appInfo.appliedAt) * 1000).toLocaleString('vi-VN');
    
    let statusText = '';
    if (appInfo.status == 0) statusText = '⏳ Đang chờ duyệt';
    else if (appInfo.status == 1) statusText = '✅ Đã duyệt';
    else if (appInfo.status == 2) statusText = '❌ Đã từ chối';
    
    let detailMsg = `📋 CHI TIẾT ĐƠN XÉT TỐT NGHIỆP\n\n` +
      `MSSV: ${studentId}\n` +
      `Họ tên: ${studentInfo.name}\n` +
      `Lớp: ${studentInfo.class}\n` +
      `Ngành: ${studentInfo.major}\n\n` +
      `GPA: ${gpa4} / 4.0 (${gpa10} / 10)\n` +
      `Tổng tín chỉ: ${appInfo.totalCredits}\n` +
      `Xếp loại: ${appInfo.classification}\n\n` +
      `Ngày nộp đơn: ${appliedDate}\n` +
      `Trạng thái: ${statusText}\n`;
    
    if (appInfo.status != 0) {
      const processedDate = new Date(parseInt(appInfo.processedAt) * 1000).toLocaleString('vi-VN');
      detailMsg += `\nNgày xử lý: ${processedDate}\n`;
      detailMsg += `Người xử lý: ${appInfo.processedBy}\n`;
      
      if (appInfo.notesStr) {
        detailMsg += `\nGhi chú: ${appInfo.notesStr}\n`;
      }
    }
    
    detailMsg += `\nMã đơn: ${appInfo.applicationHash}`;
    
    alert(detailMsg);
    
  } catch (error) {
    console.error('Lỗi xem chi tiết:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

function exportApplicationsToExcel() {
  // TODO: Implement export to Excel
  alert('Chức năng xuất Excel đang được phát triển...');
}


