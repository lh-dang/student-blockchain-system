let web3;
let contract;
let currentStudentId = null;
let currentAccount = null; // Địa chỉ ví đã connect
let currentStudentProgram = null; // Chương trình đào tạo của sinh viên
let allStudentGrades = []; // Tất cả điểm của sinh viên

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

// ====== KHỞI TẠO WEB3 ======
// Không cần connectMetaMask nữa vì đã kết nối từ login
async function initWeb3() {
  // Khởi tạo nếu chưa có web3
  if (!web3 || !contract) {
    if (!window.ethereum) {
      throw new Error("MetaMask chưa được cài đặt!");
    }
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
  }
  return true;
}

// ====== CHUYỂN ĐỔI ĐIỂM HỆ 10 SANG HỆ 4 VÀ CHỮ ======
function convertGrade(grade10) {
  if (grade10 === null || grade10 === undefined || isNaN(grade10)) {
    return { grade4: null, letter: 'P' };
  }
  
  let grade4, letter;
  
  if (grade10 >= 9.0) {
    letter = 'A';
    grade4 = 4.0;
  } else if (grade10 >= 8.0) {
    letter = 'B+';
    grade4 = 3.5;
  } else if (grade10 >= 7.0) {
    letter = 'B';
    grade4 = 3.0;
  } else if (grade10 >= 6.5) {
    letter = 'C+';
    grade4 = 2.5;
  } else if (grade10 >= 5.5) {
    letter = 'C';
    grade4 = 2.0;
  } else if (grade10 >= 5.0) {
    letter = 'D+';
    grade4 = 1.5;
  } else if (grade10 >= 4.0) {
    letter = 'D';
    grade4 = 1.0;
  } else {
    letter = 'F';
    grade4 = 0.0;
  }
  
  return { grade4, letter };
}

// ====== XẾP LOẠI SINH VIÊN THEO GPA HỆ 4 ======
function getAcademicRank(gpa4) {
  if (gpa4 >= 3.6) return '🏆 Xuất sắc';
  if (gpa4 >= 3.2) return '🥇 Giỏi';
  if (gpa4 >= 2.5) return '🥈 Khá';
  if (gpa4 >= 2.0) return '🥉 Trung bình';
  if (gpa4 >= 1.0) return '⚠️ Trung bình yếu';
  return '❌ Kém';
}

// ====== TRA CỨU ĐIỂM THEO MSSV ======
// ====== TÌM KIẾM THEO MSSV (KHÔNG CÒN DÙNG - GIỮ LẠI ĐỂ THAM KHẢO) ======
/*
async function searchByMSSV() {
  const mssv = document.getElementById("inputMSSV").value.trim();
  
  if (!mssv) {
    alert("Vui lòng nhập MSSV!");
    return;
  }
  
  if (!web3 || !contract || !currentAccount) {
    alert("Vui lòng kết nối MetaMask trước!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  
  try {
    document.getElementById("status").innerHTML = 
      '<div class="info-box">🔍 Đang tra cứu...</div>';
    
    currentStudentId = mssv;
    
    // Reset hiển thị
    document.getElementById("semestersContainer").innerHTML = "";
    document.getElementById("summarySection").style.display = "none";
    
    const studentInfo = await contract.methods.getStudentInfo(mssv).call();
    
    if (!studentInfo.exists) {
      document.getElementById("status").innerHTML = 
        '<div class="error-box">❌ Không tìm thấy MSSV này!</div>';
      document.getElementById("studentInfoSection").style.display = "none";
      return;
    }
    
    // Kiểm tra quyền sở hữu
    const registeredWallet = await contract.methods.getStudentWallet(mssv).call();
    
    if (registeredWallet.toLowerCase() !== currentAccount.toLowerCase()) {
      document.getElementById("status").innerHTML = `
        <div class="error-box">
          <strong>🚫 Bạn không có quyền xem điểm của MSSV này</strong><br>
          <small>Ví đăng ký: ${registeredWallet}<br>Ví hiện tại: ${currentAccount}</small>
        </div>
      `;
      document.getElementById("studentInfoSection").style.display = "none";
      return;
    }
    
    document.getElementById("status").innerHTML = "";
    
    await displayStudentInfo(studentInfo);
    await loadSummaryOnly(mssv);
    
  } catch (err) {
    console.error("Error:", err);
    document.getElementById("status").innerHTML = 
      '<div class="error-box">❌ Lỗi: ' + err.message + '</div>';
  }
}
*/

// ====== HIỂN THỊ THÔNG TIN SINH VIÊN ======
async function displayStudentInfo(info) {
  document.getElementById("studentInfoSection").style.display = "block";
  
  const registeredDate = new Date(parseInt(info.registeredAt) * 1000);
  
  // Lấy thông tin chương trình đào tạo
  try {
    const programId = await contract.methods.getStudentProgram(info.studentId).call();
    currentStudentProgram = programId;
    console.log("Program ID:", programId);
  } catch (err) {
    console.error("Không thể lấy program ID:", err);
    currentStudentProgram = null;
  }
  
  const html = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
      <div>
        <strong>👤 Họ và tên:</strong> ${info.name || '-'}
      </div>
      <div>
        <strong>🎓 MSSV:</strong> ${info.studentId || '-'}
      </div>
      <div>
        <strong>📅 Ngày sinh:</strong> ${info.dob || '-'}
      </div>
      <div>
        <strong>🏫 Lớp:</strong> ${info.class || '-'}
      </div>
      <div>
        <strong>📚 Ngành học:</strong> ${info.major || '-'}
      </div>
      <div>
        <strong>🏢 Khoa:</strong> ${info.department || '-'}
      </div>
      <div>
        <strong>🏛️ Trường:</strong> ${info.school || '-'}
      </div>
      <div>
        <strong>📋 Hệ đào tạo:</strong> ${info.program || '-'}
      </div>
      ${currentStudentProgram ? `
      <div style="grid-column: 1 / -1;">
        <strong>📚 Chương trình đào tạo:</strong> <code style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px;">${currentStudentProgram}</code>
      </div>` : ''}
      <div>
        <strong>📧 Email:</strong> ${info.email || '-'}
      </div>
      <div>
        <strong>📱 Điện thoại:</strong> ${info.phone || '-'}
      </div>
      <div>
        <strong>🆔 CCCD:</strong> ${info.cccd || '-'}
      </div>
      <div style="grid-column: 1 / -1;">
        <strong>🏠 Quê quán:</strong> ${info.hometown || '-'}
      </div>
      <div style="grid-column: 1 / -1; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 5px;">
        <strong>⏱️ Đăng ký lúc:</strong> ${registeredDate.toLocaleString('vi-VN')}
      </div>
    </div>
  `;
  
  document.getElementById("studentInfoContent").innerHTML = html;
}

// ====== TẢI DỮ LIỆU CHỈ ĐỂ TÍNH TỔNG KẾT (KHÔNG HIỂN THỊ CHI TIẾT) ======
async function loadSummaryOnly(mssv) {
  try {
    // Khởi tạo biến thống kê
    let allGrades = [];
    let allSemesters = [];
    
    // Lấy danh sách học kỳ
    const semesterIds = await contract.methods.getStudentSemesters(mssv).call();
    
    if (semesterIds.length === 0) {
      document.getElementById("status").innerHTML = 
        '<div class="info-box">✅ Tra cứu thành công nhưng chưa có điểm.</div>';
      return;
    }
    
    // Lấy điểm từng học kỳ (chỉ để tính tổng kết)
    for (let i = 0; i < semesterIds.length; i++) {
      const semesterId = semesterIds[i];
      
      try {
        const gradeData = await contract.methods.getSemesterGrades(mssv, semesterId).call();
        
        const semester = gradeData[0];
        const courses = gradeData[1];
        
        // Lưu dữ liệu để tính thống kê
        courses.forEach(course => {
          const grade10 = parseInt(course.grade) / 100;
          const converted = convertGrade(grade10);
          
          allGrades.push({
            courseId: course.courseId,
            courseName: course.courseName,
            credits: parseInt(course.credits),
            grade: grade10,
            grade4: converted.grade4,
            letterGrade: converted.letter,
            instructor: course.instructor,
            semester: semester
          });
        });
        
        allSemesters.push({
          semester: semester,
          studentId: mssv,
          records: courses.map(c => {
            const grade10 = parseInt(c.grade) / 100;
            const converted = convertGrade(grade10);
            return {
              courseId: c.courseId,
              courseName: c.courseName,
              credits: parseInt(c.credits),
              grade: grade10,
              grade4: converted.grade4,
              letterGrade: converted.letter,
              instructor: c.instructor
            };
          })
        });
        
      } catch (err) {
        console.error(`Lỗi tải học kỳ ${semesterId}:`, err);
      }
    }
    
    // Lưu vào biến toàn cục
    allStudentGrades = allGrades;
    
    // Chỉ hiển thị tổng kết, KHÔNG hiển thị chi tiết từng học kỳ
    displaySummary(allGrades, allSemesters);
    
    // Kiểm tra xem sinh viên đã xét tốt nghiệp chưa
    await checkAndDisplayDiploma(mssv);
    
    document.getElementById("status").innerHTML = 
      `<div class="success-box">✅ Đã tải tổng kết cho MSSV ${mssv}. Bấm "Tải điểm tất cả học kỳ" để xem chi tiết.</div>`;
    
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerHTML = 
      '<div class="error-box">❌ Lỗi: ' + err.message + '</div>';
  }
}

// ====== TẢI ĐIỂM THEO MSSV ======
async function loadGradesByMSSV(mssv) {
  try {
    document.getElementById("loadingIndicator").style.display = "block";
    document.getElementById("semestersContainer").innerHTML = "";
    
    // Khởi tạo biến thống kê
    let allGrades = [];
    let allSemesters = [];
    
    // Lấy danh sách học kỳ
    const semesterIds = await contract.methods.getStudentSemesters(mssv).call();
    
    if (semesterIds.length === 0) {
      document.getElementById("semestersContainer").innerHTML = 
        '<div class="info-box">📭 Chưa có điểm học kỳ nào được submit cho sinh viên này.</div>';
      document.getElementById("loadingIndicator").style.display = "none";
      document.getElementById("status").innerHTML = 
        '<div class="info-box">✅ Tra cứu thành công nhưng chưa có điểm.</div>';
      return;
    }
    
    console.log(`Tìm thấy ${semesterIds.length} học kỳ`);
    
    // Lấy điểm từng học kỳ
    for (let i = 0; i < semesterIds.length; i++) {
      const semesterId = semesterIds[i];
      console.log(`Đang tải học kỳ ${i + 1}/${semesterIds.length}: ${semesterId}`);
      
      try {
        const gradeData = await contract.methods.getSemesterGrades(mssv, semesterId).call();
        
        const semester = gradeData[0];
        const courses = gradeData[1];
        const submittedAt = new Date(parseInt(gradeData[2]) * 1000);
        const submittedBy = gradeData[3];
        const version = gradeData[4];
        
        console.log(`Học kỳ ${semester}: ${courses.length} môn`);
        
        // Lưu dữ liệu để tính thống kê
        courses.forEach(course => {
          const grade10 = parseInt(course.grade) / 100;
          const converted = convertGrade(grade10);
          
          allGrades.push({
            courseId: course.courseId,
            courseName: course.courseName,
            credits: parseInt(course.credits),
            grade: grade10,
            grade4: converted.grade4,
            letterGrade: converted.letter,
            instructor: course.instructor,
            semester: semester
          });
        });
        
        allSemesters.push({
          semester: semester,
          studentId: mssv,
          studentName: currentStudentId,
          records: courses.map(c => {
            const grade10 = parseInt(c.grade) / 100;
            const converted = convertGrade(grade10);
            return {
              courseId: c.courseId,
              courseName: c.courseName,
              credits: parseInt(c.credits),
              grade: grade10,
              grade4: converted.grade4,
              letterGrade: converted.letter,
              instructor: c.instructor
            };
          })
        });
        
        // Hiển thị
        displaySemester(
          {
            semester: semester,
            studentId: mssv,
            records: courses.map(c => {
              const grade10 = parseInt(c.grade) / 100;
              const converted = convertGrade(grade10);
              return {
                courseId: c.courseId,
                courseName: c.courseName,
                credits: parseInt(c.credits),
                grade: grade10,
                grade4: converted.grade4,
                letterGrade: converted.letter,
                instructor: c.instructor
              };
            })
          },
          submittedAt,
          submittedBy,
          version,
          i + 1
        );
        
      } catch (err) {
        console.error(`Lỗi tải học kỳ ${semesterId}:`, err);
        document.getElementById("semestersContainer").innerHTML += `
          <div class="error-box">
            ❌ Lỗi tải học kỳ ${semesterId}: ${err.message}
          </div>
        `;
      }
    }
    
    // Lưu vào biến toàn cục
    allStudentGrades = allGrades;
    
    // Tính toán và hiển thị tổng kết
    displaySummary(allGrades, allSemesters);
    
    document.getElementById("loadingIndicator").style.display = "none";
    document.getElementById("status").innerHTML = 
      `<div class="success-box">✅ Đã tải thành công ${semesterIds.length} học kỳ cho MSSV ${mssv}!</div>`;
    
  } catch (err) {
    console.error(err);
    document.getElementById("loadingIndicator").style.display = "none";
    document.getElementById("status").innerHTML = 
      '<div class="error-box">❌ Lỗi: ' + err.message + '</div>';
  }
}

// ====== HIỂN THỊ TỪNG HỌC KỲ ======
function displaySemester(gradeData, submittedAt, submittedBy, version, index) {
  const container = document.getElementById("semestersContainer");
  
  const semesterDiv = document.createElement("div");
  semesterDiv.className = "semester-card";
  
  // Header
  let headerHTML = `
    <div class="semester-header">
      <div>
        <div class="semester-title">📚 Học kỳ ${gradeData.semester || 'N/A'}</div>
        <div class="semester-meta">
          Sinh viên: ${gradeData.studentId || 'N/A'}
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; color: #666;">
          📅 Submit: ${submittedAt.toLocaleString('vi-VN')}
        </div>
        <div style="font-size: 12px; color: #666;">
          🔗 Version: ${version} | By: ${submittedBy.substring(0, 10)}...
        </div>
      </div>
    </div>
  `;
  
  // Xác định các môn học lại và môn nào có điểm cao nhất
  const courseIdMap = new Map();
  
  // Thu thập tất cả các lần học của mỗi môn từ allStudentGrades
  allStudentGrades.forEach(g => {
    if (g.courseId === 'SHCVHT' || g.courseName.includes('Sinh hoạt')) return;
    
    if (!courseIdMap.has(g.courseId)) {
      courseIdMap.set(g.courseId, []);
    }
    courseIdMap.get(g.courseId).push({
      semester: g.semester,
      grade: g.grade,
      grade4: g.grade4
    });
  });
  
  // Tìm điểm cao nhất cho mỗi môn
  const bestGradeMap = new Map();
  courseIdMap.forEach((instances, courseId) => {
    let bestInstance = instances[0];
    for (let i = 1; i < instances.length; i++) {
      if (instances[i].grade > bestInstance.grade) {
        bestInstance = instances[i];
      }
    }
    bestGradeMap.set(courseId, bestInstance.semester);
  });
  
  // Table
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Mã MH</th>
          <th>Tên môn học</th>
          <th>Tín chỉ</th>
          <th>Điểm hệ 10</th>
          <th>Điểm hệ 4</th>
          <th>Điểm chữ</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  gradeData.records.forEach((rec, i) => {
    const isRetake = courseIdMap.has(rec.courseId) && courseIdMap.get(rec.courseId).length > 1;
    const isBestGrade = bestGradeMap.get(rec.courseId) === gradeData.semester;
    
    // Xác định màu nền
    let backgroundColor = '';
    if (rec.courseId === 'SHCVHT' || rec.courseName.includes('Sinh hoạt')) {
      backgroundColor = ''; // Giữ mặc định
    } else if (isRetake && isBestGrade) {
      backgroundColor = 'background-color: #d4edda;'; // Màu xanh nhạt - kết quả được công nhận
    } else if (isRetake && !isBestGrade) {
      backgroundColor = 'background-color: #fff3cd;'; // Màu vàng nhạt - môn học lại nhưng không được tính
    }
    
    tableHTML += `
      <tr style="${backgroundColor}">
        <td>${i + 1}</td>
        <td>${rec.courseId || '-'}${isRetake ? ' <span style="color: #ff6b6b; font-weight: bold;" title="Môn học lại">↻</span>' : ''}</td>
        <td>${rec.courseName || '-'}</td>
        <td style="text-align: center;">${rec.credits || 0}</td>
        <td style="text-align: center; font-weight: 600;">${rec.grade !== undefined ? rec.grade.toFixed(1) : '-'}</td>
        <td style="text-align: center; font-weight: 600; color: #667eea;">${rec.grade4 !== undefined && rec.grade4 !== null ? rec.grade4.toFixed(1) : '-'}</td>
        <td style="text-align: center; font-weight: 600;">${rec.letterGrade || '-'}</td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  // Tính toán tổng kết học kỳ (loại bỏ SHCVHT)
  let semesterTotalCredits = 0;
  let semesterTotalPoints = 0;
  let semesterPassedCourses = 0;
  let semesterFailedCourses = 0;
  let coursesWithGrades = 0;
  
  gradeData.records.forEach(rec => {
    // Bỏ qua môn SHCVHT
    if (rec.courseId === 'SHCVHT' || rec.courseName.includes('Sinh hoạt')) {
      return; // Skip this course
    }
    
    const credits = rec.credits || 0;
    const grade = rec.grade;
    
    semesterTotalCredits += credits;
    
    if (grade !== undefined && grade !== null && !isNaN(grade)) {
      semesterTotalPoints += grade * credits;
      coursesWithGrades++;
      
      if (grade >= 4.0) {
        semesterPassedCourses++;
      } else {
        semesterFailedCourses++;
      }
    }
  });
  
  const semesterGPA = semesterTotalCredits > 0 ? (semesterTotalPoints / semesterTotalCredits).toFixed(2) : "0.00";
  
  // Phần tổng kết học kỳ
  let summaryHTML = `
    <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-top: 20px;">
      <h4 style="margin-bottom: 15px; font-size: 15px; color: #495057; font-weight: 600;">📊 Tổng kết học kỳ ${gradeData.semester || 'N/A'}</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
        <div style="background: white; border: 1px solid #e3e6ea; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 11px; color: #6c757d; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">GPA Học kỳ</div>
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${semesterGPA}</div>
          <div style="font-size: 10px; color: #6c757d; margin-top: 3px;">Thang điểm 10</div>
        </div>
        <div style="background: white; border: 1px solid #e3e6ea; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 11px; color: #6c757d; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Tín chỉ</div>
          <div style="font-size: 24px; font-weight: bold; color: #667eea;">${semesterTotalCredits}</div>
          <div style="font-size: 10px; color: #6c757d; margin-top: 3px;">${gradeData.records.length} môn học</div>
        </div>
        <div style="background: white; border: 1px solid #e3e6ea; padding: 15px; border-radius: 6px; text-align: center;">
          <div style="font-size: 11px; color: #6c757d; margin-bottom: 5px; text-transform: uppercase; font-weight: 500;">Kết quả</div>
          <div style="font-size: 18px; font-weight: 600;">
            <span style="color: #28a745;">${semesterPassedCourses} Đạt</span>
          </div>
          <div style="font-size: 14px; margin-top: 3px;">
            <span style="color: #dc3545;">${semesterFailedCourses} Trượt</span>
          </div>
        </div>
      </div>
      <div style="margin-top: 15px; padding: 10px; background: white; border-radius: 5px; font-size: 12px;">
        <strong>📌 Chú thích màu sắc:</strong><br>
        <span style="display: inline-block; width: 20px; height: 12px; background-color: #d4edda; border: 1px solid #c3e6cb; margin: 5px 5px 0 0;"></span> Màu xanh: Kết quả được công nhận (điểm cao nhất của môn học lại)<br>
        <span style="display: inline-block; width: 20px; height: 12px; background-color: #fff3cd; border: 1px solid #ffeaa7; margin: 5px 5px 0 0;"></span> Màu vàng: Môn học lại (không được tính vào kết quả)<br>
        <span style="color: #ff6b6b; font-weight: bold;">↻</span> Ký hiệu môn học lại
      </div>
    </div>
  `;
  
  semesterDiv.innerHTML = headerHTML + tableHTML + summaryHTML;
  container.appendChild(semesterDiv);
}

// ====== TÍNH TOÁN VÀ HIỂN THỊ TỔNG KẾT ======
function displaySummary(allGrades, allSemesters) {
  if (allGrades.length === 0) return;
  
  // Lọc bỏ môn SHCVHT (Sinh hoạt với cố vấn học tập) - không tính vào điểm
  const validGrades = allGrades.filter(g => 
    g.courseId !== 'SHCVHT' && !g.courseName.includes('Sinh hoạt')
  );
  
  // Nhóm các môn học lại (cùng courseId) và lấy điểm cao nhất
  const courseMap = new Map();
  validGrades.forEach(g => {
    const courseId = g.courseId;
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, []);
    }
    courseMap.get(courseId).push(g);
  });
  
  // Lấy điểm cao nhất cho mỗi môn (tính theo grade hệ 10)
  const bestGrades = [];
  courseMap.forEach((grades, courseId) => {
    // Tìm môn có điểm cao nhất
    let bestGrade = grades[0];
    for (let i = 1; i < grades.length; i++) {
      if (grades[i].grade > bestGrade.grade) {
        bestGrade = grades[i];
      }
    }
    bestGrades.push(bestGrade);
  });
  
  // Tính GPA hệ 10 và hệ 4 dựa trên điểm cao nhất
  let totalPoints10 = 0;
  let totalPoints4 = 0;
  let totalCredits = 0;
  let gradeCount = { A: 0, BP: 0, B: 0, CP: 0, C: 0, DP: 0, D: 0, F: 0 };
  let passedCount = 0;
  let failedCount = 0;
  
  bestGrades.forEach(g => {
    const credits = g.credits || 0;
    const grade10 = g.grade;
    const grade4 = g.grade4;
    
    if (!isNaN(grade10) && grade4 !== null) {
      totalPoints10 += grade10 * credits;
      totalPoints4 += grade4 * credits;
      totalCredits += credits;
      
      // Phân loại điểm theo letter grade
      const letter = g.letterGrade;
      if (letter === 'A') gradeCount.A++;
      else if (letter === 'B+') gradeCount.BP++;
      else if (letter === 'B') gradeCount.B++;
      else if (letter === 'C+') gradeCount.CP++;
      else if (letter === 'C') gradeCount.C++;
      else if (letter === 'D+') gradeCount.DP++;
      else if (letter === 'D') gradeCount.D++;
      else if (letter === 'F') gradeCount.F++;
      
      // Pass/Fail (điểm hệ 4 >= 1.0)
      if (grade4 >= 1.0) passedCount++;
      else failedCount++;
    }
  });
  
  const gpa10 = totalCredits > 0 ? (totalPoints10 / totalCredits).toFixed(2) : "0.00";
  const gpa4 = totalCredits > 0 ? (totalPoints4 / totalCredits).toFixed(2) : "0.00";
  
  // Hiển thị
  document.getElementById("summarySection").style.display = "block";
  document.getElementById("overallGPA").innerHTML = `
    ${gpa10} <span style="font-size: 14px; color: rgba(255,255,255,0.8);">(Hệ 10)</span><br>
    <span style="font-size: 24px;">${gpa4}</span> <span style="font-size: 12px; color: rgba(255,255,255,0.8);">(Hệ 4)</span>
  `;
  document.getElementById("totalCredits").textContent = totalCredits;
  
  // Yêu cầu tốt nghiệp: 156 tín chỉ (120 bắt buộc + 36 tự chọn)
  const requiredCredits = 156;
  const creditProgress = Math.min(100, (totalCredits / requiredCredits) * 100).toFixed(0);
  document.getElementById("creditProgress").style.width = creditProgress + "%";
  document.getElementById("creditProgress").textContent = creditProgress + "%";
  
  // Cập nhật yêu cầu tín chỉ
  const creditProgressDiv = document.getElementById("creditProgress").parentElement.nextElementSibling;
  if (creditProgressDiv) {
    creditProgressDiv.innerHTML = `Yêu cầu: ${requiredCredits} tín chỉ`;
  }
  
  // Tổng số môn duy nhất (không tính trùng)
  document.getElementById("totalCourses").textContent = bestGrades.length;
  document.getElementById("passedCourses").textContent = passedCount + " PASS";
  document.getElementById("failedCourses").textContent = failedCount + " FAIL";
  document.getElementById("totalSemesters").textContent = allSemesters.length;
  
  // Phân bố điểm mới
  document.getElementById("gradeA").textContent = gradeCount.A;
  document.getElementById("gradeB").textContent = gradeCount.BP + gradeCount.B;
  document.getElementById("gradeC").textContent = gradeCount.CP + gradeCount.C;
  document.getElementById("gradeD").textContent = gradeCount.DP + gradeCount.D;
  document.getElementById("gradeF").textContent = gradeCount.F;
  
  // Cập nhật label phân bố điểm
  const gradeLabels = document.querySelectorAll('.grade-distribution .grade-badge');
  if (gradeLabels.length >= 5) {
    gradeLabels[0].innerHTML = `<strong id="gradeA">${gradeCount.A}</strong> môn A (9.0-10)`;
    gradeLabels[1].innerHTML = `<strong id="gradeB">${gradeCount.BP + gradeCount.B}</strong> môn B+/B (7.0-8.9)`;
    gradeLabels[2].innerHTML = `<strong id="gradeC">${gradeCount.CP + gradeCount.C}</strong> môn C+/C (5.5-6.9)`;
    gradeLabels[3].innerHTML = `<strong id="gradeD">${gradeCount.DP + gradeCount.D}</strong> môn D+/D (4.0-5.4)`;
    gradeLabels[4].innerHTML = `<strong id="gradeF">${gradeCount.F}</strong> môn F (<4.0)`;
  }
  
  // Xếp loại theo GPA hệ 4
  const gpa4Num = parseFloat(gpa4);
  const rank = getAcademicRank(gpa4Num);
  document.getElementById("academicRank").textContent = rank;
  
  // Kiểm tra điều kiện tốt nghiệp
  const canGraduate = checkGraduationEligibility(totalCredits, gpa4Num, failedCount, allSemesters.length);
  document.getElementById("studyStatus").innerHTML = canGraduate.eligible ? 
    `✅ ${canGraduate.message}` : 
    `⚠️ ${canGraduate.message}`;
}

// ====== KIỂM TRA VÀ HIỂN THỊ BẰNG TỐT NGHIỆP NẾU ĐÃ MINT ======
async function checkAndDisplayDiploma(mssv) {
  try {
    // Kiểm tra xem sinh viên đã có bằng chưa
    const hasDiploma = await contract.methods.hasDiploma(mssv).call();
    
    if (hasDiploma) {
      console.log('✅ Sinh viên đã có bằng tốt nghiệp');
      
      // Lấy thông tin bằng
      const diploma = await contract.methods.getDiploma(mssv).call();
      const studentInfo = await contract.methods.getStudentInfo(mssv).call();
      
      // Parse diploma data
      const diplomaData = {
        studentId: mssv,
        name: studentInfo.name,
        dob: normalizeDOB(studentInfo.dob), // Chuẩn hóa ngày sinh
        major: studentInfo.major,
        school: studentInfo.school || 'TRƯỜNG ĐẠI HỌC CẦN THƠ',
        department: studentInfo.department,
        majorCode: studentInfo.majorCode,
        gpa4: (diploma.gpa / 100).toFixed(2),
        gpa10: ((diploma.gpa / 100) * 2.5).toFixed(2),
        classification: diploma.classification,
        credits: diploma.totalCredits,
        graduationDate: new Date(diploma.issuedAt * 1000).toLocaleDateString('vi-VN'),
        diplomaHash: diploma.diplomaHash,
        blockNumber: 'N/A',
        transactionHash: 'N/A',
        // Thông tin thu hồi
        revoked: diploma.revoked,
        revokedAt: diploma.revokedAt,
        revokedReason: diploma.revokedReason
      };
      
      // Hiển thị bằng tốt nghiệp ngay sau phần tổng kết
      showDiplomaCertificate(diplomaData);
      
      // Ẩn nút "Đăng ký xét tốt nghiệp"
      const btnCheckGraduation = document.getElementById('btnCheckGraduation');
      if (btnCheckGraduation) {
        btnCheckGraduation.style.display = 'none';
      }
      
    } else {
      console.log('ℹ️ Sinh viên chưa được cấp bằng');
      
      // Kiểm tra xem đã đăng ký xét tốt nghiệp chưa
      try {
        const appInfo = await contract.methods.getGraduationApplication(currentStudentId).call();
        
        if (appInfo.exists) {
          const status = parseInt(appInfo.status);
          const btnCheckGraduation = document.getElementById('btnCheckGraduation');
          
          if (status === 0) {
            // Đang chờ duyệt - cập nhật nút để kiểm tra trạng thái
            if (btnCheckGraduation) {
              btnCheckGraduation.textContent = '🔍 Kiểm tra trạng thái đơn (Đang chờ duyệt)';
              btnCheckGraduation.onclick = checkApplicationStatus;
              btnCheckGraduation.style.display = 'inline-block';
              btnCheckGraduation.style.background = 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)';
            }
          } else if (status === 2) {
            // Bị từ chối - cập nhật nút để xem chi tiết
            if (btnCheckGraduation) {
              btnCheckGraduation.textContent = '📋 Đơn đã bị từ chối - Xem chi tiết';
              btnCheckGraduation.onclick = checkApplicationStatus;
              btnCheckGraduation.style.display = 'inline-block';
              btnCheckGraduation.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
            }
          }
        } else {
          // Chưa đăng ký
          const btnCheckGraduation = document.getElementById('btnCheckGraduation');
          if (btnCheckGraduation) {
            btnCheckGraduation.style.display = 'inline-block';
          }
        }
      } catch (err) {
        console.warn('Không thể kiểm tra đơn đăng ký:', err);
        // Hiện nút đăng ký bình thường
        const btnCheckGraduation = document.getElementById('btnCheckGraduation');
        if (btnCheckGraduation) {
          btnCheckGraduation.style.display = 'inline-block';
        }
      }
    }
    
  } catch (error) {
    console.error('Lỗi kiểm tra bằng:', error);
  }
}

// ====== KIỂM TRA ĐIỀU KIỆN TỐT NGHIỆP ======
function checkGraduationEligibility(totalCredits, gpa4, failedCount, semesterCount) {
  const reasons = [];
  
  // 1. Hoàn thành 156 tín chỉ
  if (totalCredits < 156) {
    reasons.push(`Thiếu ${156 - totalCredits} tín chỉ`);
  }
  
  // 2. GPA >= 2.0 (hệ 4)
  if (gpa4 < 2.0) {
    reasons.push(`GPA thấp (${gpa4}/4.0, cần >= 2.0)`);
  }
  
  // 3. Không có môn nào dưới 1.0 (hệ 4) - Những môn chưa hoàn thành
  if (failedCount > 0) {
    reasons.push(`Còn ${failedCount} môn chưa hoàn thành (< 1.0)`);
  }
  
  // 4. Tối đa 26 học kỳ (không phải 9 nữa)
  if (semesterCount > 26) {
    reasons.push(`Vượt quá 26 học kỳ (đã học ${semesterCount} kỳ)`);
  }
  
  if (reasons.length === 0) {
    return { eligible: true, message: 'Đủ điều kiện tốt nghiệp' };
  } else {
    return { eligible: false, message: 'Chưa đủ điều kiện: ' + reasons.join(', ') };
  }
}

// ====== ĐĂNG KÝ XÉT TỐT NGHIỆP ======
async function checkGraduationApplication() {
  const resultDiv = document.getElementById("graduationResult");
  
  if (!currentStudentId) {
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="error-box">
        ❌ Vui lòng nhập MSSV và nhấn "Tra cứu" trước khi đăng ký xét tốt nghiệp!
      </div>
    `;
    return;
  }
  
  if (allStudentGrades.length === 0) {
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      <div class="error-box">
        ❌ Vui lòng tải điểm trước khi đăng ký xét tốt nghiệp!
      </div>
    `;
    return;
  }
  
  // Hiển thị loading
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <div class="info-box">
      <div class="spinner" style="width: 30px; height: 30px;"></div>
      <p>⏳ Đang kiểm tra trạng thái đơn xét tốt nghiệp...</p>
    </div>
  `;
  
  try {
    // KIỂM TRA TRƯỚC: Đã có đơn xét tốt nghiệp chưa?
    const appInfo = await contract.methods.getGraduationApplication(currentStudentId).call();
    
    if (appInfo.exists) {
      // Đã có đơn rồi -> hiển thị trạng thái thay vì form đăng ký
      console.log('✅ Sinh viên đã có đơn xét tốt nghiệp, hiển thị trạng thái');
      await checkApplicationStatus();
      return;
    }
    
    // Chưa có đơn -> tiếp tục kiểm tra điều kiện
    console.log('ℹ️ Sinh viên chưa có đơn, kiểm tra điều kiện tốt nghiệp');
    
    resultDiv.innerHTML = `
      <div class="info-box">
        <div class="spinner" style="width: 30px; height: 30px;"></div>
        <p>⏳ Đang kiểm tra chương trình đào tạo và so sánh môn học...</p>
      </div>
    `;
  } catch (error) {
    console.error('Lỗi kiểm tra đơn xét tốt nghiệp:', error);
  }
  
  try {
    // Lấy chương trình đào tạo
    if (!currentStudentProgram) {
      throw new Error("Sinh viên chưa được gán chương trình đào tạo");
    }
    
    console.log('🔍 Kiểm tra chương trình:', currentStudentProgram);
    
    // Kiểm tra chương trình có tồn tại không
    const programInfo = await contract.methods.getProgram(currentStudentProgram).call();
    if (!programInfo || !programInfo._programName) {
      throw new Error(`Chương trình "${currentStudentProgram}" không tồn tại trong hệ thống. Vui lòng liên hệ Admin để cập nhật chương trình đào tạo.`);
    }
    
    console.log('✅ Tìm thấy chương trình:', programInfo._programName);
    
    // Lấy danh sách môn học của chương trình
    const programCourses = await contract.methods.getProgramCourses(currentStudentProgram).call();
    
    // Phân loại môn học
    const requiredCourses = [];
    const electiveCourses = [];
    
    programCourses.forEach(course => {
      if (course.isRequired) {
        requiredCourses.push({
          courseId: course.courseId,
          courseName: course.courseName,
          credits: parseInt(course.credits)
        });
      } else {
        electiveCourses.push({
          courseId: course.courseId,
          courseName: course.courseName,
          credits: parseInt(course.credits),
          groupId: course.groupId
        });
      }
    });
    
    console.log(`📚 Chương trình có ${requiredCourses.length} môn bắt buộc và ${electiveCourses.length} môn tự chọn`);
    console.log('Elective courses:', electiveCourses);
    
    // Lấy thông tin các nhóm tự chọn (tín chỉ yêu cầu)
    let electiveGroupIds = [];
    let electiveGroupsInfo = {};
    
    try {
      electiveGroupIds = await contract.methods.getProgramElectiveGroupIds(currentStudentProgram).call();
      console.log('📋 Danh sách groupId từ blockchain:', electiveGroupIds);
      console.log('📋 Số lượng nhóm từ blockchain:', electiveGroupIds.length);
    } catch (err) {
      console.warn('⚠️ Không lấy được danh sách nhóm từ blockchain:', err.message);
      // Fallback: Lấy groupId từ electiveCourses
      const uniqueGroupIds = [...new Set(electiveCourses.map(ec => ec.groupId).filter(id => id))];
      console.log('📋 Sử dụng groupId từ electiveCourses:', uniqueGroupIds);
      electiveGroupIds = uniqueGroupIds;
    }
    
    // Nếu không có groupId từ blockchain, lấy từ programCourses
    if (electiveGroupIds.length === 0) {
      const uniqueGroupIds = [...new Set(electiveCourses.map(ec => ec.groupId).filter(id => id))];
      console.log('📋 Không có groupId từ blockchain, lấy từ electiveCourses:', uniqueGroupIds);
      electiveGroupIds = uniqueGroupIds;
    }
    
    for (const groupId of electiveGroupIds) {
      try {
        const groupInfo = await contract.methods.getElectiveGroup(currentStudentProgram, groupId).call();
        console.log(`  Thông tin nhóm ${groupId}:`, groupInfo);
        if (groupInfo._exists) {
          electiveGroupsInfo[groupId] = {
            groupId: groupId,
            groupName: groupInfo._groupName,
            requiredCredits: parseInt(groupInfo._requiredCredits),
            courseIds: groupInfo._courseIds
          };
          console.log(`  ✅ Nhóm ${groupId}: ${groupInfo._groupName} - Yêu cầu ${groupInfo._requiredCredits} TC`);
        } else {
          console.warn(`  ⚠️ Nhóm ${groupId} không tồn tại trong blockchain`);
        }
      } catch (err) {
        console.warn(`  ⚠️ Lỗi lấy thông tin nhóm ${groupId}:`, err.message);
      }
    }
    
    console.log('📊 Thông tin các nhóm tự chọn:', electiveGroupsInfo);
    
    // Nếu không có thông tin từ blockchain, sử dụng cấu hình mặc định
    if (Object.keys(electiveGroupsInfo).length === 0 && electiveGroupIds.length > 0) {
      console.log('⚠️ Sử dụng cấu hình mặc định cho các nhóm tự chọn');
      
      // Cấu hình mặc định - gộp các nhóm con thành nhóm lớn
      const defaultGroupConfig = {
        // NHÓM THỂ CHẤT - Gộp tất cả 9 môn thể dục thành 1 nhóm
        'PHYSICAL_EDUCATION': { 
          name: 'Giáo dục thể chất (chọn 1 trong 9 môn)', 
          credits: 3,
          subGroups: ['PE_AEROBIC', 'PE_CHESS', 'PE_BASKETBALL', 'PE_ATHLETICS', 'PE_TAEKWONDO', 'PE_VOLLEYBALL', 'PE_FOOTBALL', 'PE_TABLETENNIS', 'PE_BADMINTON']
        },
        
        // NHÓM NGOẠI NGỮ - Gộp Anh và Pháp thành 1 nhóm
        'FOREIGN_LANGUAGE': { 
          name: 'Ngoại ngữ (chọn Tiếng Anh HOẶC Tiếng Pháp)', 
          credits: 10,
          subGroups: ['ENGLISH', 'FRENCH']
        },
        
        // NHÓM CHUYÊN NGÀNH - Gộp N1 (SECURITY) và N2 (BIG_DATA) thành 1 nhóm
        'SPECIALIZATION': { 
          name: 'Chuyên ngành (chọn N1-An toàn TT HOẶC N2-Dữ liệu lớn)', 
          credits: 9,
          subGroups: ['SECURITY', 'BIG_DATA']
        },
        
        // Các nhóm độc lập
        'ELECTIVE_2TC': { name: 'Tự chọn 2TC', credits: 2, subGroups: [] },
        'SIMPLER_ELECTIVE_GROUP': { name: 'Nhóm lý thuyết tự chọn', credits: 6, subGroups: [] },
        'GRADUATION_GROUP': { name: 'Nhóm tốt nghiệp', credits: 15, subGroups: [] },
        
        // Nhóm CNTT (nếu có)
        'CN_SPECIALIZATION': { 
          name: 'Chuyên ngành CNTT (chọn CN1, CN2 HOẶC CN3)', 
          credits: 9,
          subGroups: ['CN1', 'CN2', 'CN3']
        }
      };
      
      // Xây dựng map từ subGroup sang parentGroup
      const subGroupToParent = {};
      Object.keys(defaultGroupConfig).forEach(parentId => {
        const config = defaultGroupConfig[parentId];
        if (config.subGroups && config.subGroups.length > 0) {
          config.subGroups.forEach(subId => {
            subGroupToParent[subId] = parentId;
          });
        }
      });
      
      console.log('📋 Map subGroup -> parentGroup:', subGroupToParent);
      
      // Gộp các môn học theo nhóm lớn
      const parentGroups = {};
      
      electiveCourses.forEach(ec => {
        const originalGroupId = ec.groupId;
        const parentGroupId = subGroupToParent[originalGroupId] || originalGroupId;
        
        if (!parentGroups[parentGroupId]) {
          parentGroups[parentGroupId] = [];
        }
        
        parentGroups[parentGroupId].push(ec);
      });
      
      console.log('📋 Các nhóm lớn sau khi gộp:', Object.keys(parentGroups));
      
      // Tạo electiveGroupsInfo cho các nhóm lớn
      Object.keys(parentGroups).forEach(parentGroupId => {
        const config = defaultGroupConfig[parentGroupId];
        if (config) {
          electiveGroupsInfo[parentGroupId] = {
            groupId: parentGroupId,
            groupName: config.name,
            requiredCredits: config.credits,
            courseIds: parentGroups[parentGroupId].map(ec => ec.courseId),
            subGroups: config.subGroups || []
          };
          console.log(`  ✅ Nhóm ${parentGroupId}: ${config.name} - ${config.credits} TC - ${parentGroups[parentGroupId].length} môn`);
        }
      });
      
      // Cập nhật lại groupId cho electiveCourses để tính toán đúng
      electiveCourses.forEach(ec => {
        const originalGroupId = ec.groupId;
        const parentGroupId = subGroupToParent[originalGroupId] || originalGroupId;
        ec.parentGroupId = parentGroupId; // Thêm trường mới
      });
      
      console.log('📊 Thông tin các nhóm sau khi áp dụng cấu hình mặc định:', electiveGroupsInfo);
    }
    
    // Lọc bỏ môn SHCVHT
    const validGrades = allStudentGrades.filter(g => 
      g.courseId !== 'SHCVHT' && !g.courseName.includes('Sinh hoạt')
    );
    
    // Nhóm các môn học lại và lấy điểm cao nhất
    const courseMap = new Map();
    validGrades.forEach(g => {
      const courseId = g.courseId;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, []);
      }
      courseMap.get(courseId).push(g);
    });
    
    // Lấy điểm cao nhất cho mỗi môn
    const bestGrades = [];
    courseMap.forEach((grades, courseId) => {
      let bestGrade = grades[0];
      for (let i = 1; i < grades.length; i++) {
        if (grades[i].grade > bestGrade.grade) {
          bestGrade = grades[i];
        }
      }
      bestGrades.push(bestGrade);
    });
    
    // Lấy danh sách môn đã hoàn thành (chỉ tính môn có grade4 >= 1.0)
    const completedCourses = bestGrades.filter(g => g.grade4 >= 1.0);
    
    // Lấy danh sách môn chưa hoàn thành (tất cả môn có grade4 < 1.0)
    const incompleteCourses = bestGrades.filter(g => g.grade4 < 1.0);
    
    // So sánh môn bắt buộc
    const missingRequired = [];
    const completedRequired = [];
    const incompleteRequired = [];
    
    requiredCourses.forEach(reqCourse => {
      const completed = completedCourses.find(c => c.courseId === reqCourse.courseId);
      const incomplete = incompleteCourses.find(c => c.courseId === reqCourse.courseId);
      
      if (completed) {
        completedRequired.push({
          ...reqCourse,
          grade: completed.grade,
          grade4: completed.grade4,
          letterGrade: completed.letterGrade
        });
      } else if (incomplete) {
        // Môn bắt buộc đã học nhưng chưa đạt
        incompleteRequired.push({
          ...reqCourse,
          grade: incomplete.grade,
          grade4: incomplete.grade4,
          letterGrade: incomplete.letterGrade
        });
      } else {
        // Môn bắt buộc chưa học
        missingRequired.push(reqCourse);
      }
    });
    
    // Xử lý môn tự chọn chưa hoàn thành
    // Thêm groupId vào incompleteCourses từ electiveCourses
    const incompleteWithGroup = incompleteCourses.map(ic => {
      const electiveCourse = electiveCourses.find(ec => ec.courseId === ic.courseId);
      return {
        ...ic,
        groupId: electiveCourse?.groupId || 'OTHER'
      };
    });
    
    console.log('Incomplete courses with group:', incompleteWithGroup);
    
    // Tính tín chỉ bắt buộc
    const requiredCreditsCompleted = completedRequired.reduce((sum, c) => sum + c.credits, 0);
    const totalRequiredCredits = 111;  // Đổi từ 120 thành 111
    
    // Tính tín chỉ tự chọn
    const electiveCreditsCompleted = completedCourses
      .filter(c => !requiredCourses.find(r => r.courseId === c.courseId))
      .reduce((sum, c) => sum + c.credits, 0);
    const totalElectiveCredits = 45;  // Đổi từ 36 thành 45
    
    // Tính GPA và tổng tín chỉ (chỉ tính môn có điểm cao nhất và đã hoàn thành)
    let totalPoints4 = 0;
    let totalCredits = 0;
    
    completedCourses.forEach(c => {
      totalPoints4 += c.grade4 * c.credits;
      totalCredits += c.credits;
    });
    
    const gpa4 = totalCredits > 0 ? totalPoints4 / totalCredits : 0;
    
    // Kiểm tra tính đúng đắn của phép tính
    console.log('📊 Kiểm tra tín chỉ:');
    console.log('  - Tín chỉ bắt buộc:', requiredCreditsCompleted);
    console.log('  - Tín chỉ tự chọn:', electiveCreditsCompleted);
    console.log('  - Tổng (bắt buộc + tự chọn):', requiredCreditsCompleted + electiveCreditsCompleted);
    console.log('  - Tổng (completedCourses):', totalCredits);
    console.log('  - Số môn completed:', completedCourses.length);
    console.log('  - Số môn bắt buộc completed:', completedRequired.length);
    console.log('  - Số môn tự chọn completed:', completedCourses.length - completedRequired.length);
    
    // Kiểm tra các điều kiện
    const conditions = {
      totalCredits: totalCredits >= 156,
      requiredCredits: requiredCreditsCompleted >= 111,  // Đổi từ 120 thành 111
      electiveCredits: electiveCreditsCompleted >= 45,   // Đổi từ 36 thành 45
      gpa: gpa4 >= 2.0,
      noFailures: incompleteCourses.length === 0,  // Không có môn nào chưa hoàn thành
      maxSemesters: new Set(allStudentGrades.map(g => g.semester)).size <= 26
    };
    
    const allConditionsMet = Object.values(conditions).every(c => c);
    
    // Hiển thị kết quả
    displayGraduationResult({
      eligible: allConditionsMet,
      conditions,
      totalCredits,
      requiredCreditsCompleted,
      electiveCreditsCompleted,
      gpa4,
      completedRequired,
      missingRequired,
      incompleteRequired,
      incompleteCourses: incompleteWithGroup,  // Sử dụng incomplete có groupId
      completedCourses,
      bestGrades,  // Truyền bestGrades thay vì allStudentGrades
      programElectives: electiveCourses,  // Truyền thêm danh sách môn tự chọn của chương trình
      electiveGroupsInfo: electiveGroupsInfo  // Truyền thêm thông tin nhóm tự chọn
    });
    
  } catch (err) {
    console.error("Lỗi kiểm tra tốt nghiệp:", err);
    resultDiv.innerHTML = `
      <div class="error-box">
        ❌ Lỗi: ${err.message}
      </div>
    `;
  }
}

// ====== HIỂN THỊ KẾT QUẢ XÉT TỐT NGHIỆP ======
function displayGraduationResult(data) {
  const resultDiv = document.getElementById("graduationResult");
  
  const statusClass = data.eligible ? 'success-box' : 'error-box';
  const statusIcon = data.eligible ? '🎉' : '⚠️';
  const statusText = data.eligible ? 'ĐỦ ĐIỀU KIỆN TỐT NGHIỆP' : 'CHƯA ĐỦ ĐIỀU KIỆN TỐT NGHIỆP';
  
  // Tính số môn không đạt (grade4 < 1.0)
  const failedCoursesCount = data.bestGrades.filter(g => g.grade4 < 1.0).length;
  
  let html = `
    <div class="${statusClass}">
      <h2 style="margin-bottom: 15px;">${statusIcon} ${statusText}</h2>
      ${data.eligible ? `
        <button 
          onclick="submitGraduationApplication()" 
          style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; padding: 15px 40px; border-radius: 30px; cursor: pointer; font-size: 18px; font-weight: 700; margin-top: 15px; box-shadow: 0 5px 20px rgba(240, 147, 251, 0.4); transition: transform 0.2s;"
          onmouseover="this.style.transform='translateY(-2px)'"
          onmouseout="this.style.transform='translateY(0)'"
        >
          🎓 Đăng ký xét tốt nghiệp và ký xác nhận
        </button>
      ` : ''}
    </div>
    
    <div class="semester-card" style="margin-top: 20px;">
      <h3 style="color: #667eea; margin-bottom: 15px;">📋 Tổng hợp điều kiện tốt nghiệp</h3>
      
      <table style="margin-bottom: 20px;">
        <tr>
          <th style="width: 50%;">Điều kiện</th>
          <th style="width: 25%; text-align: center;">Yêu cầu</th>
          <th style="width: 25%; text-align: center;">Thực tế</th>
        </tr>
        <tr style="background: ${data.conditions.totalCredits ? '#d4edda' : '#f8d7da'};">
          <td>Tổng tín chỉ tích lũy</td>
          <td style="text-align: center;">≥ 156</td>
          <td style="text-align: center; font-weight: bold;">${data.totalCredits}</td>
        </tr>
        <tr style="background: ${data.conditions.requiredCredits ? '#d4edda' : '#f8d7da'};">
          <td>&nbsp;&nbsp;↳ Tín chỉ bắt buộc</td>
          <td style="text-align: center;">≥ 111</td>
          <td style="text-align: center; font-weight: bold;">${data.requiredCreditsCompleted}</td>
        </tr>
        <tr style="background: ${data.conditions.electiveCredits ? '#d4edda' : '#f8d7da'};">
          <td>&nbsp;&nbsp;↳ Tín chỉ tự chọn</td>
          <td style="text-align: center;">≥ 45</td>
          <td style="text-align: center; font-weight: bold;">${data.electiveCreditsCompleted}</td>
        </tr>
        <tr style="background: ${data.conditions.gpa ? '#d4edda' : '#f8d7da'};">
          <td>GPA tích lũy (hệ 4)</td>
          <td style="text-align: center;">≥ 2.0</td>
          <td style="text-align: center; font-weight: bold;">${data.gpa4.toFixed(2)}</td>
        </tr>
        <tr style="background: ${data.conditions.noFailures ? '#d4edda' : '#f8d7da'};">
          <td>Không có môn nào chưa hoàn thành (< 1.0)</td>
          <td style="text-align: center;">0 môn</td>
          <td style="text-align: center; font-weight: bold;">${data.incompleteCourses.length} môn</td>
        </tr>
        <tr style="background: ${data.conditions.maxSemesters ? '#d4edda' : '#f8d7da'};">
          <td>Số học kỳ</td>
          <td style="text-align: center;">≤ 26</td>
          <td style="text-align: center; font-weight: bold;">${new Set(allStudentGrades.map(g => g.semester)).size}</td>
        </tr>
      </table>
      
      <div style="margin: 15px 0; padding: 10px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 4px;">
        <strong>📌 Lưu ý:</strong> Môn học lại chỉ tính 1 lần tín chỉ và lấy kết quả cao nhất.
      </div>
      
      <h3 style="color: #28a745; margin: 25px 0 15px 0;">✅ Môn bắt buộc đã hoàn thành (${data.completedRequired.length}/${data.completedRequired.length + data.missingRequired.length + (data.incompleteRequired?.length || 0)})</h3>
      <table>
        <tr>
          <th>STT</th>
          <th>Mã MH</th>
          <th>Tên môn</th>
          <th>TC</th>
          <th>Điểm 10</th>
          <th>Điểm 4</th>
          <th>Chữ</th>
        </tr>
        ${data.completedRequired.map((c, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${c.courseId}</td>
            <td>${c.courseName}</td>
            <td style="text-align: center;">${c.credits}</td>
            <td style="text-align: center;">${c.grade.toFixed(1)}</td>
            <td style="text-align: center; font-weight: 600; color: #667eea;">${c.grade4.toFixed(1)}</td>
            <td style="text-align: center; font-weight: 600;">${c.letterGrade}</td>
          </tr>
        `).join('')}
        <tr style="background: #d4edda; font-weight: bold;">
          <td colspan="3" style="text-align: right; padding-right: 20px;">Tổng tín chỉ bắt buộc:</td>
          <td style="text-align: center; color: #28a745;">${data.requiredCreditsCompleted} TC</td>
          <td colspan="3"></td>
        </tr>
      </table>
  `;
  
  // Thêm phần hiển thị môn tự chọn đã hoàn thành
  const completedElectives = data.completedCourses.filter(c => 
    !data.completedRequired.find(r => r.courseId === c.courseId)
  );
  
  if (completedElectives.length > 0) {
    html += `
      <h3 style="color: #28a745; margin: 25px 0 15px 0;">✅ Môn tự chọn đã hoàn thành (${completedElectives.length})</h3>
      <table>
        <tr>
          <th>STT</th>
          <th>Mã MH</th>
          <th>Tên môn</th>
          <th>TC</th>
          <th>Điểm 10</th>
          <th>Điểm 4</th>
          <th>Chữ</th>
        </tr>
        ${completedElectives.map((c, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${c.courseId}</td>
            <td>${c.courseName}</td>
            <td style="text-align: center;">${c.credits}</td>
            <td style="text-align: center;">${c.grade.toFixed(1)}</td>
            <td style="text-align: center; font-weight: 600; color: #667eea;">${c.grade4.toFixed(1)}</td>
            <td style="text-align: center; font-weight: 600;">${c.letterGrade}</td>
          </tr>
        `).join('')}
        <tr style="background: #d4edda; font-weight: bold;">
          <td colspan="3" style="text-align: right; padding-right: 20px;">Tổng tín chỉ tự chọn:</td>
          <td style="text-align: center; color: #28a745;">${data.electiveCreditsCompleted} TC</td>
          <td colspan="3"></td>
        </tr>
      </table>
    `;
  }
  
  if (data.missingRequired.length > 0) {
    html += `
      <h3 style="color: #dc3545; margin: 25px 0 15px 0;">❌ Môn bắt buộc chưa học (${data.missingRequired.length})</h3>
      <table>
        <tr>
          <th>STT</th>
          <th>Mã MH</th>
          <th>Tên môn</th>
          <th>TC</th>
        </tr>
        ${data.missingRequired.map((c, i) => `
          <tr style="background: #f8d7da;">
            <td>${i + 1}</td>
            <td>${c.courseId}</td>
            <td>${c.courseName}</td>
            <td style="text-align: center;">${c.credits}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }
  
  if (data.incompleteRequired && data.incompleteRequired.length > 0) {
    html += `
      <h3 style="color: #ff6b6b; margin: 25px 0 15px 0;">⚠️ Môn bắt buộc đã học nhưng chưa đạt (${data.incompleteRequired.length})</h3>
      <table>
        <tr>
          <th>STT</th>
          <th>Mã MH</th>
          <th>Tên môn</th>
          <th>TC</th>
          <th>Điểm 10</th>
          <th>Điểm 4</th>
          <th>Chữ</th>
        </tr>
        ${data.incompleteRequired.map((c, i) => `
          <tr style="background: #fff3cd;">
            <td>${i + 1}</td>
            <td>${c.courseId}</td>
            <td>${c.courseName}</td>
            <td style="text-align: center;">${c.credits}</td>
            <td style="text-align: center;">${c.grade.toFixed(1)}</td>
            <td style="text-align: center; font-weight: 600; color: #dc3545;">${c.grade4.toFixed(1)}</td>
            <td style="text-align: center; font-weight: 600; color: #dc3545;">${c.letterGrade}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }
  
  // Hiển thị TẤT CẢ các nhóm tự chọn chưa hoàn thành
  // Logic mới: Tính toán các nhóm chưa đủ tín chỉ và hiển thị TẤT CẢ môn trong nhóm đó
  const electiveCourses = data.programElectives || [];
  
  console.log('🔍 DEBUG - Bắt đầu kiểm tra nhóm tự chọn');
  console.log('  - Số môn tự chọn trong chương trình:', electiveCourses.length);
  console.log('  - Chi tiết môn tự chọn:', electiveCourses);
  
  // Lấy danh sách elective groups từ blockchain (cần thêm từ checkGraduationApplication)
  const electiveGroupsInfo = data.electiveGroupsInfo || {};
  
  console.log('  - Thông tin nhóm từ blockchain:', electiveGroupsInfo);
  console.log('  - Số nhóm:', Object.keys(electiveGroupsInfo).length);
  
  // Tính tín chỉ đã hoàn thành cho mỗi nhóm
  const groupCredits = {};
  
  // Duyệt qua tất cả môn tự chọn trong chương trình
  electiveCourses.forEach(ec => {
    // Sử dụng parentGroupId nếu có, nếu không dùng groupId gốc
    const groupId = ec.parentGroupId || ec.groupId || 'OTHER';
    if (!groupCredits[groupId]) {
      groupCredits[groupId] = {
        completed: 0,
        required: electiveGroupsInfo[groupId]?.requiredCredits || 0,
        courses: []
      };
    }
    
    // Kiểm tra môn này đã hoàn thành chưa
    const completedCourse = data.completedCourses?.find(cc => cc.courseId === ec.courseId && cc.grade4 >= 1.0);
    if (completedCourse) {
      groupCredits[groupId].completed += completedCourse.credits;
      console.log(`    ✅ Môn ${ec.courseId} (${ec.courseName}) đã hoàn thành: +${completedCourse.credits} TC vào nhóm ${groupId}`);
    }
    
    groupCredits[groupId].courses.push(ec);
  });
  
  console.log('📊 Tổng hợp tín chỉ các nhóm tự chọn:', groupCredits);
  
  // Tìm các nhóm chưa hoàn thành
  // Hiển thị nhóm nếu:
  // 1. Có yêu cầu tín chỉ (required > 0) và chưa đủ (completed < required), HOẶC
  // 2. Không có thông tin yêu cầu từ blockchain (required = 0) nhưng có môn chưa hoàn thành trong nhóm
  const incompleteGroups = Object.keys(groupCredits).filter(groupId => {
    const group = groupCredits[groupId];
    
    // Kiểm tra xem nhóm này có môn chưa hoàn thành không
    // Cần kiểm tra cả groupId gốc và parentGroupId
    const hasIncompleteCourse = data.incompleteCourses?.some(ic => {
      // Tìm môn trong electiveCourses để lấy parentGroupId
      const electiveCourse = electiveCourses.find(ec => ec.courseId === ic.courseId);
      const courseParentGroupId = electiveCourse?.parentGroupId || ic.groupId;
      return courseParentGroupId === groupId;
    });
    
    // Nếu có thông tin yêu cầu từ blockchain
    if (group.required > 0) {
      const notEnoughCredits = group.completed < group.required;
      console.log(`  - Nhóm ${groupId}: ${group.completed}/${group.required} TC - Đủ TC: ${!notEnoughCredits} - Có môn chưa đạt: ${hasIncompleteCourse} - Hiển thị: ${notEnoughCredits ? 'CÓ' : 'KHÔNG'}`);
      return notEnoughCredits;
    } else {
      // Không có thông tin yêu cầu từ blockchain
      // Chỉ hiển thị nếu có môn đã học nhưng chưa đạt
      console.log(`  - Nhóm ${groupId}: Không có thông tin yêu cầu - Có môn chưa đạt: ${hasIncompleteCourse} - Hiển thị: ${hasIncompleteCourse ? 'CÓ' : 'KHÔNG'}`);
      return hasIncompleteCourse;
    }
  });
  
  console.log('⚠️ CÁC NHÓM CHƯA HOÀN THÀNH:', incompleteGroups);
  console.log('⚠️ SỐ NHÓM CHƯA HOÀN THÀNH:', incompleteGroups.length);
  
  if (incompleteGroups.length > 0) {
    html += `
      <h3 style="color: #ff8c00; margin: 25px 0 15px 0;">📝 Nhóm tự chọn chưa hoàn thành (${incompleteGroups.length} nhóm)</h3>
      <div style="margin: 15px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong>⚠️ Lưu ý:</strong> Các nhóm tự chọn bên dưới chưa đủ tín chỉ yêu cầu.
        <br><br>
        <strong>📌 Quy tắc hiển thị:</strong><br>
        • Hiển thị <strong style="color: #dc3545;">TẤT CẢ các môn</strong> trong nhóm (kể cả đã đạt, chưa đạt, và chưa học)<br>
        • Sinh viên có thể chọn bất kỳ môn nào trong nhóm để đủ tín chỉ yêu cầu<br>
        • Môn đã học nhưng chưa đạt (< 1.0) phải học lại
      </div>
    `;
    
    // Hiển thị từng nhóm chưa hoàn thành
    incompleteGroups.forEach((groupId, groupIndex) => {
      const group = groupCredits[groupId];
      const groupName = getGroupName(groupId);
      
      html += `
        <h4 style="color: #667eea; margin: 20px 0 10px 0; padding: 10px; background: #f0f0f0; border-left: 4px solid #667eea;">
          ${groupIndex + 1}. ${groupName} - 
          <span style="color: #28a745;">${group.completed} TC</span> / 
          <span style="color: #dc3545;">${group.required} TC</span> 
          <span style="color: #ff8c00; font-weight: 600;">(Thiếu ${group.required - group.completed} TC)</span>
        </h4>
        <table>
          <tr>
            <th>STT</th>
            <th>Mã MH</th>
            <th>Tên môn</th>
            <th>TC</th>
            <th>Điểm 10</th>
            <th>Điểm 4</th>
            <th>Chữ</th>
            <th>Trạng thái</th>
          </tr>
      `;
      
      let rowNum = 0;
      
      // Hiển thị TẤT CẢ các môn trong nhóm
      group.courses.forEach(ec => {
        rowNum++;
        
        // Kiểm tra trạng thái môn học
        const completedCourse = data.completedCourses?.find(cc => cc.courseId === ec.courseId && cc.grade4 >= 1.0);
        const incompleteCourse = data.incompleteCourses?.find(ic => ic.courseId === ec.courseId);
        
        let bgColor, status, grade10, grade4, letterGrade;
        
        if (completedCourse) {
          // Môn đã hoàn thành (đạt)
          bgColor = '#d4edda';
          status = '<span style="color: #28a745;">✅ Đã đạt</span>';
          grade10 = completedCourse.grade.toFixed(1);
          grade4 = `<span style="font-weight: 600; color: #28a745;">${completedCourse.grade4.toFixed(1)}</span>`;
          letterGrade = `<span style="font-weight: 600;">${completedCourse.letterGrade}</span>`;
        } else if (incompleteCourse) {
          // Môn đã học nhưng chưa đạt
          bgColor = '#fff3cd';
          status = '<span style="color: #dc3545;">❌ Đã học - Chưa đạt</span>';
          grade10 = incompleteCourse.grade.toFixed(1);
          grade4 = `<span style="font-weight: 600; color: #dc3545;">${incompleteCourse.grade4.toFixed(1)}</span>`;
          letterGrade = `<span style="font-weight: 600; color: #dc3545;">${incompleteCourse.letterGrade}</span>`;
        } else {
          // Môn chưa học
          bgColor = '#e7f3ff';
          status = '<span style="color: #0056b3;">📌 Chưa học - Có thể chọn</span>';
          grade10 = '<span style="color: #999;">-</span>';
          grade4 = '<span style="color: #999;">-</span>';
          letterGrade = '<span style="color: #999;">-</span>';
        }
        
        html += `
          <tr style="background: ${bgColor};">
            <td>${rowNum}</td>
            <td>${ec.courseId}</td>
            <td>${ec.courseName}</td>
            <td style="text-align: center;">${ec.credits}</td>
            <td style="text-align: center;">${grade10}</td>
            <td style="text-align: center;">${grade4}</td>
            <td style="text-align: center;">${letterGrade}</td>
            <td style="text-align: center;">${status}</td>
          </tr>
        `;
      });
      
      html += `
        </table>
      `;
    });
    
    html += `
      <div style="margin: 15px 0; padding: 10px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 4px;">
        <strong>💡 Giải thích màu sắc:</strong><br>
        <span style="display: inline-block; width: 15px; height: 10px; background: #d4edda; border: 1px solid #c3e6cb; margin: 0 5px;"></span> Xanh lá = Môn đã hoàn thành (đạt)<br>
        <span style="display: inline-block; width: 15px; height: 10px; background: #fff3cd; border: 1px solid #ffc107; margin: 0 5px;"></span> Vàng = Môn đã học nhưng chưa đạt (phải học lại)<br>
        <span style="display: inline-block; width: 15px; height: 10px; background: #e7f3ff; border: 1px solid #2196F3; margin: 0 5px;"></span> Xanh dương = Môn chưa học (có thể chọn)
      </div>
    `;
  }
  
  // Thêm bảng tổng kết cuối cùng
  html += `
    <div style="margin-top: 30px; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
      <h3 style="color: white; margin-bottom: 20px; text-align: center;">📊 TỔNG KẾT TOÀN BỘ</h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 14px; opacity: 0.9;">Tổng số môn đã học</div>
          <div style="font-size: 28px; font-weight: bold; margin-top: 5px;">${data.bestGrades.length}</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 14px; opacity: 0.9;">Môn đã hoàn thành</div>
          <div style="font-size: 28px; font-weight: bold; margin-top: 5px; color: #90EE90;">${data.completedCourses.length}</div>
          <div style="font-size: 12px; margin-top: 5px;">
            (${data.completedRequired.length} bắt buộc + ${completedElectives.length} tự chọn)
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 14px; opacity: 0.9;">Môn chưa hoàn thành</div>
          <div style="font-size: 28px; font-weight: bold; margin-top: 5px; color: #FFB6C1;">${data.incompleteCourses.length}</div>
          <div style="font-size: 12px; margin-top: 5px;">
            (${data.incompleteRequired?.length || 0} bắt buộc + ${data.incompleteCourses.length - (data.incompleteRequired?.length || 0)} tự chọn)
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 14px; opacity: 0.9;">Tổng tín chỉ đã tích lũy</div>
          <div style="font-size: 28px; font-weight: bold; margin-top: 5px;">${data.totalCredits} TC</div>
          <div style="font-size: 12px; margin-top: 5px;">
            (${data.requiredCreditsCompleted} bắt buộc + ${data.electiveCreditsCompleted} tự chọn)
          </div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div>
            <strong>GPA tích lũy (hệ 4):</strong>
            <span style="font-size: 24px; font-weight: bold; margin-left: 10px;">${data.gpa4.toFixed(2)}</span>
          </div>
          <div>
            <strong>Xếp loại:</strong>
            <span style="font-size: 20px; font-weight: bold; margin-left: 10px;">${getAcademicRank(data.gpa4)}</span>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.08); border-radius: 6px; font-size: 13px;">
        <strong>⚠️ Lưu ý:</strong> Tổng tín chỉ = ${data.requiredCreditsCompleted} (bắt buộc) + ${data.electiveCreditsCompleted} (tự chọn) = <strong>${data.totalCredits} TC</strong>
      </div>
    </div>
  `;
  
  html += `</div>`;
  
  resultDiv.innerHTML = html;
}

// ====== ĐĂNG KÝ XÉT TỐT NGHIỆP (SUBMIT APPLICATION) ======
async function submitGraduationApplication() {
  if (!currentStudentId) {
    alert('❌ Không tìm thấy thông tin sinh viên!');
    return;
  }
  
  try {
    // Hiển thị loading
    const resultDiv = document.getElementById("graduationResult");
    
    resultDiv.innerHTML = `
      <div class="info-box">
        <div class="spinner" style="width: 40px; height: 40px;"></div>
        <h3 style="margin-top: 20px;">📝 Đang chuẩn bị đơn đăng ký...</h3>
        <p>Vui lòng đợi...</p>
      </div>
    `;
    
    // Lấy thông tin sinh viên
    const studentInfo = await contract.methods.getStudentInfo(currentStudentId).call();
    
    // Tính toán thông tin tốt nghiệp (giống như mintDiploma cũ)
    const totalCredits = allStudentGrades
      .filter(g => g.courseId !== 'SHCVHT')
      .reduce((acc, g) => {
        const courseMap = acc.courseMap || new Map();
        if (!courseMap.has(g.courseId)) {
          courseMap.set(g.courseId, []);
        }
        courseMap.get(g.courseId).push(g);
        acc.courseMap = courseMap;
        return acc;
      }, { courseMap: new Map() });
    
    let credits = 0;
    let totalPoints4 = 0;
    
    totalCredits.courseMap.forEach((grades, courseId) => {
      const bestGrade = grades.reduce((best, current) => 
        current.grade > best.grade ? current : best
      );
      if (bestGrade.grade4 >= 1.0) {
        credits += bestGrade.credits;
        totalPoints4 += bestGrade.grade4 * bestGrade.credits;
      }
    });
    
    const gpa4 = credits > 0 ? (totalPoints4 / credits).toFixed(2) : "0.00";
    const gpa10 = credits > 0 ? (gpa4 * 2.5).toFixed(2) : "0.00";
    
    // Xác định xếp loại
    let classification = '';
    const gpaNum = parseFloat(gpa4);
    if (gpaNum >= 3.6) classification = 'Xuất sắc';
    else if (gpaNum >= 3.2) classification = 'Giỏi';
    else if (gpaNum >= 2.5) classification = 'Khá';
    else if (gpaNum >= 2.0) classification = 'Trung bình';
    else classification = 'Yếu';
    
    // Tạo dữ liệu đơn đăng ký
    const applicationData = {
      studentId: studentInfo.studentId,
      name: studentInfo.name,
      dob: normalizeDOB(studentInfo.dob),
      major: studentInfo.major,
      school: studentInfo.school,
      gpa10: gpa10,
      gpa4: gpa4,
      classification: classification,
      credits: credits,
      timestamp: Date.now()
    };
    
    // Tạo hash của đơn đăng ký
    const applicationHash = CryptoJS.SHA256(JSON.stringify(applicationData, null, 2)).toString();
    console.log('📄 Application Hash:', applicationHash);
    
    // Yêu cầu ký EIP-712
    resultDiv.innerHTML = `
      <div class="info-box">
        <div class="spinner" style="width: 40px; height: 40px;"></div>
        <h3 style="margin-top: 20px;">✍️ Vui lòng ký xác nhận...</h3>
        <p>Hệ thống yêu cầu bạn ký xác nhận đăng ký xét tốt nghiệp qua MetaMask</p>
      </div>
    `;
    
    // Chuẩn bị EIP-712 typed data
    const domain = {
      name: 'Student Graduation Application',
      version: '1',
      chainId: await web3.eth.getChainId(),
      verifyingContract: contractAddress
    };
    
    const types = {
      GraduationApplication: [
        { name: 'studentId', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'gpa4', type: 'string' },
        { name: 'credits', type: 'uint256' },
        { name: 'classification', type: 'string' },
        { name: 'timestamp', type: 'uint256' }
      ]
    };
    
    const message = {
      studentId: applicationData.studentId,
      name: applicationData.name,
      gpa4: applicationData.gpa4,
      credits: applicationData.credits,
      classification: classification,
      timestamp: applicationData.timestamp
    };
    
    // Yêu cầu ký
    const accounts = await web3.eth.getAccounts();
    const signature = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [accounts[0], JSON.stringify({ domain, types, primaryType: 'GraduationApplication', message })],
    });
    
    console.log('✍️ Signature:', signature);
    
    // Cập nhật hash với chữ ký
    const signedApplicationHash = CryptoJS.SHA256(applicationHash + signature).toString();
    
    // Submit lên blockchain
    resultDiv.innerHTML = `
      <div class="info-box">
        <div class="spinner" style="width: 40px; height: 40px;"></div>
        <h3 style="margin-top: 20px;">🔗 Đang gửi đơn lên blockchain...</h3>
        <p>Vui lòng đợi xác nhận từ MetaMask</p>
      </div>
    `;
    
    const gpa4Int = Math.floor(parseFloat(gpa4) * 100); // 3.25 => 325
    
    console.log('🔗 Calling submitGraduationApplication on blockchain...');
    console.log('  Student:', currentStudentId);
    console.log('  Hash:', signedApplicationHash);
    console.log('  GPA:', gpa4Int);
    console.log('  Credits:', credits);
    console.log('  Classification:', classification);
    
    const receipt = await contract.methods.submitGraduationApplication(
      currentStudentId,
      signedApplicationHash,
      gpa4Int,
      credits,
      classification
    ).send({ from: accounts[0], gas: 300000 });
    
    console.log('✅ Transaction receipt:', receipt);
    
    // Lưu thông tin đơn vào localStorage
    localStorage.setItem(`graduation_app_${currentStudentId}`, JSON.stringify(applicationData));
    localStorage.setItem(`graduation_app_hash_${currentStudentId}`, signedApplicationHash);
    localStorage.setItem(`graduation_app_signature_${currentStudentId}`, signature);
    
    // Hiển thị thông báo thành công
    resultDiv.innerHTML = `
      <div class="success-box">
        <h2 style="margin-bottom: 15px;">✅ ĐĂNG KÝ XÉT TỐT NGHIỆP THÀNH CÔNG</h2>
        <p style="font-size: 16px; margin: 15px 0;">
          Đơn đăng ký xét tốt nghiệp của bạn đã được gửi lên blockchain.<br>
          Trạng thái: <strong style="color: #ff9800;">🕐 Đang chờ duyệt</strong>
        </p>
        
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <strong>📌 Thông tin đơn đăng ký:</strong><br>
          <div style="margin-top: 10px; text-align: left;">
            • <strong>MSSV:</strong> ${applicationData.studentId}<br>
            • <strong>Họ tên:</strong> ${applicationData.name}<br>
            • <strong>GPA:</strong> ${applicationData.gpa4} / 4.0 (${applicationData.gpa10} / 10)<br>
            • <strong>Tín chỉ:</strong> ${applicationData.credits} TC<br>
            • <strong>Xếp loại:</strong> ${classification}<br>
            • <strong>Mã đơn:</strong> <code style="font-size: 11px;">${signedApplicationHash.substring(0, 16)}...</code>
          </div>
        </div>
        
        <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <strong>ℹ️ Bước tiếp theo:</strong><br>
          Vui lòng đợi cán bộ quản lý điểm xem xét và duyệt đơn của bạn.<br>
          Sau khi được duyệt, bằng tốt nghiệp sẽ được tự động cấp.<br>
          Bạn có thể quay lại trang này để kiểm tra trạng thái.
        </div>
        
        <div style="margin-top: 20px;">
          <strong>Transaction Hash:</strong><br>
          <code style="font-size: 11px; background: #f0f0f0; padding: 5px 10px; border-radius: 3px; display: inline-block; margin-top: 5px;">${receipt.transactionHash}</code>
        </div>
      </div>
    `;
    
    console.log('✅ Đơn xét tốt nghiệp đã được gửi thành công!');
    
    // Cập nhật nút thành "Kiểm tra trạng thái"
    const btnCheckGraduation = document.getElementById('btnCheckGraduation');
    if (btnCheckGraduation) {
      btnCheckGraduation.textContent = '🔍 Kiểm tra trạng thái đơn';
      btnCheckGraduation.onclick = checkApplicationStatus;
    }
    
  } catch (error) {
    console.error('Lỗi đăng ký xét tốt nghiệp:', error);
    document.getElementById("graduationResult").innerHTML = `
      <div class="error-box">
        ❌ Lỗi: ${error.message}
      </div>
    `;
  }
}

// ====== KIỂM TRA TRẠNG THÁI ĐƠN XÉT TỐT NGHIỆP ======
async function checkApplicationStatus() {
  if (!currentStudentId) {
    alert('❌ Không tìm thấy thông tin sinh viên!');
    return;
  }
  
  try {
    const resultDiv = document.getElementById("graduationResult");
    resultDiv.style.display = "block";
    
    resultDiv.innerHTML = `
      <div class="info-box">
        <div class="spinner" style="width: 30px; height: 30px;"></div>
        <p>⏳ Đang kiểm tra trạng thái...</p>
      </div>
    `;
    
    // Lấy thông tin đơn từ blockchain
    const appInfo = await contract.methods.getGraduationApplication(currentStudentId).call();
    
    if (!appInfo.exists) {
      resultDiv.innerHTML = `
        <div class="error-box">
          ❌ Bạn chưa đăng ký xét tốt nghiệp
        </div>
      `;
      return;
    }
    
    const status = parseInt(appInfo.status);
    const statusText = {
      0: '<span style="color: #ff9800; font-weight: 700;">🕐 ĐANG CHỜ XÉT DUYỆT</span>',
      1: '<span style="color: #28a745; font-weight: 700;">✅ ĐÃ DUYỆT</span>',
      2: '<span style="color: #dc3545; font-weight: 700;">❌ ĐÃ TỪ CHỐI</span>'
    }[status] || 'Không xác định';
    
    const boxClass = status === 1 ? 'success-box' : status === 2 ? 'error-box' : 'warning-box';
    
    let html = `
      <div class="${boxClass}">
        <h2 style="margin-bottom: 20px; ${status === 0 ? 'color: #856404;' : ''}">${status === 0 ? '⏳' : status === 1 ? '✅' : '❌'} TRẠNG THÁI ĐƠN XÉT TỐT NGHIỆP</h2>
        <p style="font-size: 20px; margin: 20px 0; text-align: center;">
          ${statusText}
        </p>
        
        <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-bottom: 15px; ${status === 0 ? 'color: #856404;' : ''}">📌 Thông tin đơn đăng ký</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><strong>Ngày nộp:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1); text-align: right;">${new Date(parseInt(appInfo.appliedAt) * 1000).toLocaleString('vi-VN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><strong>GPA tích lũy:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1); text-align: right;">${(parseInt(appInfo.gpa) / 100).toFixed(2)} / 4.0</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><strong>Tổng tín chỉ:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1); text-align: right;">${appInfo.totalCredits} TC</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);"><strong>Xếp loại:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1); text-align: right;">${appInfo.classification}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Mã xác thực:</strong></td>
              <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 11px;">${appInfo.applicationHash.substring(0, 20)}...</td>
            </tr>
          </table>
        </div>
    `;
    
    if (status === 1) {
      // Đã duyệt - hiển thị bằng
      html += `
        <div style="margin-top: 25px; padding: 20px; background: rgba(40, 167, 69, 0.1); border-radius: 8px; border: 2px solid #28a745;">
          <p style="font-size: 16px; margin-bottom: 15px;">
            <strong>🎉 Chúc mừng!</strong> Đơn của bạn đã được phê duyệt và bằng tốt nghiệp đã được cấp.
          </p>
          <button onclick="viewDiploma()" style="background: #28a745; color: white; border: none; padding: 15px 35px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 16px; box-shadow: 0 3px 10px rgba(40, 167, 69, 0.3);">
            📜 Xem bằng tốt nghiệp
          </button>
        </div>
      `;
    } else if (status === 2) {
      // Bị từ chối
      html += `
        <div style="background: rgba(220, 53, 69, 0.1); border: 2px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <h4 style="color: #dc3545; margin-bottom: 10px;">❌ Lý do từ chối:</h4>
          <p style="font-size: 15px; line-height: 1.6; color: #721c24;">
            ${appInfo.notesStr || 'Không có ghi chú'}
          </p>
        </div>
      `;
    } else if (status === 0) {
      // Đang chờ
      html += `
        <div style="background: rgba(255, 193, 7, 0.15); border: 2px dashed #ffc107; padding: 25px; margin: 25px 0; border-radius: 8px; text-align: center;">
          <h3 style="color: #856404; margin-bottom: 15px;">⏳ Đơn đang chờ xử lý</h3>
          <p style="font-size: 15px; line-height: 1.8; color: #856404;">
            Đơn xét tốt nghiệp của bạn đã được nộp thành công và đang chờ cán bộ quản lý điểm xem xét.<br>
            <strong>Vui lòng kiên nhẫn đợi kết quả phê duyệt.</strong>
          </p>
          <div style="margin-top: 20px; padding: 15px; background: rgba(255, 255, 255, 0.6); border-radius: 6px;">
            <p style="font-size: 13px; color: #666; margin: 0;">
              💡 <em>Bạn có thể quay lại trang này bất cứ lúc nào để kiểm tra trạng thái đơn</em>
            </p>
          </div>
        </div>
      `;
    }
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    
  } catch (error) {
    console.error('Lỗi kiểm tra trạng thái:', error);
    document.getElementById("graduationResult").innerHTML = `
      <div class="error-box">
        ❌ Lỗi: ${error.message}
      </div>
    `;
  }
}

// ====== XEM BẰNG TỐT NGHIỆP (SAU KHI ĐÃ DUYỆT) ======
async function viewDiploma() {
  if (!currentStudentId) {
    alert('❌ Không tìm thấy thông tin sinh viên!');
    return;
  }
  
  try {
    // Lấy thông tin bằng từ blockchain
    const diplomaInfo = await contract.methods.getDiploma(currentStudentId).call();
    
    if (!diplomaInfo.exists) {
      alert('❌ Bạn chưa được cấp bằng tốt nghiệp');
      return;
    }
    
    // Lấy thông tin sinh viên
    const studentInfo = await contract.methods.getStudentInfo(currentStudentId).call();
    
    const gpa4 = (parseInt(diplomaInfo.gpa) / 100).toFixed(2);
    const gpa10 = (gpa4 * 2.5).toFixed(2);
    
    // Hiển thị bằng
    showDiplomaCertificate({
      studentId: studentInfo.studentId,
      name: studentInfo.name,
      dob: normalizeDOB(studentInfo.dob),
      major: studentInfo.major,
      school: studentInfo.school,
      gpa10: gpa10,
      gpa4: gpa4,
      classification: diplomaInfo.classification,
      graduationDate: new Date(parseInt(diplomaInfo.issuedAt) * 1000).toLocaleDateString('vi-VN'),
      graduationYear: new Date(parseInt(diplomaInfo.issuedAt) * 1000).getFullYear(),
      credits: diplomaInfo.totalCredits,
      diplomaHash: diplomaInfo.diplomaHash,
      transactionHash: 'N/A' // Có thể lấy từ events nếu cần
    });
    
  } catch (error) {
    console.error('Lỗi xem bằng:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

// ====== XÉT TỐT NGHIỆP (CŨ - DEPRECATED) ======
async function mintDiploma() {
  if (!currentStudentId) {
    alert('❌ Không tìm thấy thông tin sinh viên!');
    return;
  }
  
  try {
    // Hiển thị loading
    const resultDiv = document.getElementById("graduationResult");
    const originalContent = resultDiv.innerHTML;
    
    resultDiv.innerHTML = `
      <div class="info-box">
        <div class="spinner" style="width: 40px; height: 40px;"></div>
        <h3 style="margin-top: 20px;">🎓 Đang tạo bằng tốt nghiệp...</h3>
        <p>Vui lòng đợi, hệ thống đang ghi thông tin lên blockchain...</p>
      </div>
    `;
    
    // Lấy thông tin sinh viên
    const studentInfo = await contract.methods.getStudentInfo(currentStudentId).call();
    
    // Tính toán thông tin tốt nghiệp
    const totalCredits = allStudentGrades
      .filter(g => g.courseId !== 'SHCVHT')
      .reduce((acc, g) => {
        const courseMap = acc.courseMap || new Map();
        if (!courseMap.has(g.courseId)) {
          courseMap.set(g.courseId, []);
        }
        courseMap.get(g.courseId).push(g);
        acc.courseMap = courseMap;
        return acc;
      }, { courseMap: new Map() });
    
    let credits = 0;
    let totalPoints4 = 0;
    
    totalCredits.courseMap.forEach((grades, courseId) => {
      const bestGrade = grades.reduce((best, current) => 
        current.grade > best.grade ? current : best
      );
      if (bestGrade.grade4 >= 1.0) {
        credits += bestGrade.credits;
        totalPoints4 += bestGrade.grade4 * bestGrade.credits;
      }
    });
    
    const gpa4 = credits > 0 ? (totalPoints4 / credits).toFixed(2) : "0.00";
    const gpa10 = credits > 0 ? (gpa4 * 2.5).toFixed(2) : "0.00";
    
    // Xác định xếp loại
    let classification = '';
    const gpaNum = parseFloat(gpa4);
    if (gpaNum >= 3.6) classification = 'Xuất sắc';
    else if (gpaNum >= 3.2) classification = 'Giỏi';
    else if (gpaNum >= 2.5) classification = 'Khá';
    else if (gpaNum >= 2.0) classification = 'Trung bình';
    else classification = 'Yếu';
    
    // Tạo thời gian tốt nghiệp (năm hiện tại)
    const currentDate = new Date();
    const graduationDate = currentDate.toLocaleDateString('vi-VN');
    const graduationYear = currentDate.getFullYear();
    
    // Tạo nội dung bằng HTML
    const diplomaHTML = generateDiplomaHTML({
      studentId: studentInfo.studentId,
      name: studentInfo.name,
      dob: normalizeDOB(studentInfo.dob), // Chuẩn hóa ngày sinh
      major: studentInfo.major,
      school: studentInfo.school,
      gpa10: gpa10,
      gpa4: gpa4,
      classification: classification,
      graduationDate: graduationDate,
      graduationYear: graduationYear,
      credits: credits
    });
    
    // Tính SHA256 hash của nội dung bằng
    const diplomaHash = CryptoJS.SHA256(diplomaHTML).toString();
    console.log('📄 Diploma Hash:', diplomaHash);
    
    // Gọi smart contract để xét tốt nghiệp
    const accounts = await web3.eth.getAccounts();
    const gpa4Int = Math.floor(parseFloat(gpa4) * 100); // 3.25 => 325
    
    console.log('🔗 Calling mintDiploma on blockchain...');
    console.log('  Student:', currentStudentId);
    console.log('  Hash:', diplomaHash);
    console.log('  GPA:', gpa4Int);
    console.log('  Credits:', credits);
    console.log('  Classification:', classification);
    
    const receipt = await contract.methods.mintDiploma(
      currentStudentId,
      diplomaHash,
      gpa4Int,
      credits,
      classification
    ).send({ from: accounts[0], gas: 500000 });
    
    console.log('✅ Transaction receipt:', receipt);
    
    // Lưu PDF vào localStorage (giả lập lưu file)
    localStorage.setItem(`diploma_${currentStudentId}`, diplomaHTML);
    localStorage.setItem(`diploma_hash_${currentStudentId}`, diplomaHash);
    
    // Hiển thị bằng tốt nghiệp
    showDiplomaCertificate({
      studentId: studentInfo.studentId,
      name: studentInfo.name,
      dob: normalizeDOB(studentInfo.dob), // Chuẩn hóa ngày sinh
      major: studentInfo.major,
      school: studentInfo.school,
      gpa10: gpa10,
      gpa4: gpa4,
      classification: classification,
      graduationDate: graduationDate,
      graduationYear: graduationYear,
      credits: credits,
      diplomaHash: diplomaHash,
      blockNumber: receipt.blockNumber,
      transactionHash: receipt.transactionHash
    });
    
    console.log('✅ Bằng tốt nghiệp đã được tạo thành công!');
    alert('🎉 Xét tốt nghiệp thành công! Bằng của bạn đã được ghi lên blockchain.');
    
  } catch (error) {
    console.error('Lỗi xét tốt nghiệp:', error);
    alert('❌ Lỗi: ' + error.message);
  }
}

// ====== TẠO HTML CHO BẰNG TỐT NGHIỆP ======
function generateDiplomaHTML(data) {
  // Tạo dữ liệu JSON cho bằng tốt nghiệp
  const diplomaData = {
    studentId: data.studentId,
    name: data.name,
    dob: data.dob,
    major: data.major,
    school: data.school,
    gpa10: data.gpa10,
    gpa4: data.gpa4,
    classification: data.classification,
    graduationDate: data.graduationDate,
    credits: data.credits,
    timestamp: Date.now()
  };
  
  // Chuyển thành chuỗi JSON để hash
  return JSON.stringify(diplomaData, null, 2);
}

// ====== HIỂN THỊ GIẤY CHỨNG NHẬN TỐT NGHIỆP (A5 NẰM NGANG) ======
function showDiplomaCertificate(data) {
  const resultDiv = document.getElementById("graduationResult");
  
  // Kiểm tra nếu bằng đã bị thu hồi
  if (data.revoked) {
    const revokedDate = new Date(data.revokedAt * 1000).toLocaleString('vi-VN');
    resultDiv.innerHTML = `
      <div style="background: #f8d7da; border: 3px solid #dc3545; border-radius: 10px; padding: 30px; margin: 30px 0; box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);">
        <div style="text-align: center;">
          <h2 style="color: #721c24; font-size: 28px; margin-bottom: 20px;">🚫 BẰNG TỐT NGHIỆP ĐÃ BỊ THU HỒI</h2>
          <div style="display: inline-block; padding: 12px 30px; background: #721c24; color: white; border-radius: 20px; font-size: 18px; font-weight: 700; margin-bottom: 20px;">
            ⚠️ REVOKED - KHÔNG CÒN HIỆU LỰC
          </div>
        </div>
        
        <div style="background: white; border-radius: 8px; padding: 25px; margin-top: 25px;">
          <h3 style="color: #721c24; margin-bottom: 15px;">📋 Thông tin bằng:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">Họ tên:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">MSSV:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.studentId}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">Ngày sinh:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.dob}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">Ngành:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.major}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">Xếp loại:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.classification}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">GPA:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.gpa4} / 4.0 (${data.gpa10} / 10)</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">Tín chỉ:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.credits} TC</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: 600;">Ngày cấp:</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.graduationDate}</td></tr>
          </table>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-top: 25px; border-radius: 5px;">
            <h3 style="color: #856404; margin-bottom: 10px;">⚠️ Thông tin thu hồi:</h3>
            <p style="color: #856404; margin-bottom: 8px;"><strong>Thời gian thu hồi:</strong> ${revokedDate}</p>
            <p style="color: #856404; margin-bottom: 0;"><strong>Lý do:</strong> ${data.revokedReason || 'Không có lý do cụ thể'}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
          <p style="color: #721c24; font-size: 14px;">
            ⚠️ Bằng này đã bị thu hồi và <strong>KHÔNG CÒN GIÁTRỊ PHÁP LÝ</strong>.<br>
            Mọi sử dụng bằng này đều không được công nhận.
          </p>
        </div>
      </div>
    `;
    resultDiv.style.display = 'block';
    return;
  }
  
  // Chuyển đổi classification sang tiếng Anh
  const classificationEn = {
    'Xuất sắc': 'Excellent',
    'Giỏi': 'Very Good', 
    'Khá': 'Good',
    'Trung bình': 'Fair'
  }[data.classification] || data.classification;
  
  const html = `
    <!-- Verification Badge -->
    <div class="success-box" style="text-align: center;">
      <h2 style="margin-bottom: 15px; font-size: 24px;">✅ BẰNG TỐT NGHIỆP ĐÃ ĐƯỢC MINT THÀNH CÔNG</h2>
      <div class="badge badge-success" style="display: inline-block; padding: 8px 20px; background: #d4edda; color: #155724; border: 1px solid #28a745; border-radius: 15px; font-size: 16px; font-weight: 600;">
        ✓ VERIFIED ON BLOCKCHAIN
      </div>
      <p style="margin-top: 15px; font-size: 14px; color: #155724;">
        Bằng tốt nghiệp của bạn đã được ghi nhận trên Blockchain.<br>
        Tất cả thông tin đã được mã hóa và không thể giả mạo.
      </p>
    </div>
    
    <!-- Official Certificate Display - Dựa trên mẫu bằng CTU -->
    <div style="background: #555; padding: 30px; border-radius: 15px; margin: 30px 0; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
      <div class="page" style="width: 100%; max-width: 1100px; margin: 0 auto; aspect-ratio: 1.414/1; background: #fffbf0; position: relative; padding: 15px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); color: #2c3e50; font-family: 'Noto Serif', 'Times New Roman', serif;">
        
        <!-- Khung viền -->
        <div style="width: 100%; height: 100%; border: 2px solid #003366; position: relative; padding: 4px;">
          <!-- Top border text -->
          <div style="position: absolute; top: 12px; left: 0; width: 100%; text-align: center; font-size: 8px; letter-spacing: 4px; text-transform: uppercase; color: #003366; opacity: 0.5; font-family: sans-serif;">
            SOCIALIST REPUBLIC OF VIETNAM &nbsp; • &nbsp; CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </div>
          
          <!-- Border inner -->
          <div style="width: 100%; height: 100%; border: 4px double #d4af37; padding: 30px 40px; position: relative; z-index: 2; background-image: radial-gradient(circle at center, transparent 30%, rgba(212, 175, 55, 0.05) 70%), repeating-linear-gradient(135deg, rgba(0, 51, 102, 0.015) 0px, rgba(0, 51, 102, 0.015) 1px, transparent 1px, transparent 4px);">
            
            <!-- Watermark -->
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-10deg); font-size: 180px; font-weight: 900; font-family: 'Cinzel', serif; color: rgba(0, 51, 102, 0.04); pointer-events: none; z-index: 1; white-space: nowrap; border: 8px solid rgba(0, 51, 102, 0.04); border-radius: 50%; width: 450px; height: 450px; display: flex; align-items: center; justify-content: center;">
              CTU
            </div>
            
            <!-- Seal decoration -->
            <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(212, 175, 55, 0.4); display: flex; align-items: center; justify-content: center; color: rgba(212, 175, 55, 0.6); font-size: 10px; font-weight: bold; background: radial-gradient(closest-side, white, transparent);">
              CTU<br>OFFICIAL
            </div>
            
            <!-- Content: 2 cột -->
            <div style="display: flex; flex-direction: row; height: 100%; gap: 40px;">
              
              <!-- CỘT TRÁI: TIẾNG ANH -->
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; text-align: center; position: relative; border-right: 1px solid rgba(0,0,0,0.1); padding-right: 20px;">
                <!-- Header -->
                <div style="flex: 0 0 auto; margin-bottom: 10px;">
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 10px; margin-bottom: 3px;">Socialist Republic of Vietnam</div>
                  <div style="font-weight: 700; font-size: 10px; border-bottom: 1px solid #ccc; display: inline-block; padding-bottom: 3px; margin-bottom: 15px; border: none;">Independence – Freedom – Happiness</div>
                  <div style="font-style: italic; font-size: 13px; color: #555; margin-top: 5px;">The Rector of</div>
                  <div style="font-family: 'Cinzel', serif; font-weight: 700; text-transform: uppercase; font-size: 14px; color: #003366; letter-spacing: 0.5px; margin: 2px 0;">Can Tho University</div>
                  <div style="font-style: italic; font-size: 14px; margin-top: 5px;">confers</div>
                </div>
                
                <!-- Body -->
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 10px 0;">
                  <div style="font-family: 'Cinzel', serif; font-size: 22px; font-weight: 900; color: #b71c1c; text-transform: uppercase; margin-bottom: 5px; line-height: 1.2;">
                    The Degree of<br>Engineer
                  </div>
                  <div style="font-size: 15px; margin-bottom: 15px;">Major: <strong>${data.major || 'Information Technology'}</strong></div>
                  
                  <div style="font-style: italic; font-size: 14px; color: #555; margin-bottom: 5px;">Upon:</div>
                  <div style="font-family: 'Cinzel', serif; font-size: 26px; font-weight: 700; text-transform: uppercase; color: #2c3e50; margin-bottom: 20px; letter-spacing: 1px;">
                    ${data.name}
                  </div>
                  
                  <div style="width: 100%; font-size: 14px; line-height: 1.6; text-align: left; padding: 0 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Date of birth:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${data.dob}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Classification:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${classificationEn}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Year of graduation:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${data.graduationYear || new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="flex: 0 0 auto; margin-top: 10px;">
                  <div style="height: 20px;"></div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 13px; color: #003366;">Rector</div>
                  <div style="font-style: italic; font-size: 10px; color: #666; margin-bottom: 60px; visibility: hidden;">(Sign)</div>
                  <div style="font-weight: 700; font-size: 14px; margin-top: 10px; visibility: hidden;">...</div>
                </div>
              </div>
              
              <!-- CỘT PHẢI: TIẾNG VIỆT -->
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; text-align: center; position: relative; padding-left: 20px;">
                <!-- Header -->
                <div style="flex: 0 0 auto; margin-bottom: 10px;">
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 10px; margin-bottom: 3px;">Cộng hòa Xã hội Chủ nghĩa Việt Nam</div>
                  <div style="font-weight: 700; font-size: 10px; border-bottom: 1px solid #ccc; display: inline-block; padding-bottom: 3px; margin-bottom: 15px;">Độc lập – Tự do – Hạnh phúc</div>
                  <div style="font-style: italic; font-size: 13px; color: #555; margin-top: 5px;">Hiệu trưởng</div>
                  <div style="font-family: 'Cinzel', serif; font-weight: 700; text-transform: uppercase; font-size: 14px; color: #003366; letter-spacing: 0.5px; margin: 2px 0;">Trường Đại học Cần Thơ</div>
                  <div style="font-style: italic; font-size: 14px; margin-top: 5px;">cấp</div>
                </div>
                
                <!-- Body -->
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 10px 0;">
                  <div style="font-family: 'Cinzel', serif; font-size: 22px; font-weight: 900; color: #b71c1c; text-transform: uppercase; margin-bottom: 5px; line-height: 1.2;">
                    Bằng Kỹ Sư
                  </div>
                  <div style="font-size: 15px; margin-bottom: 15px;">Ngành: <strong>${data.major || 'Công nghệ Thông tin'}</strong></div>
                  
                  <div style="font-style: italic; font-size: 14px; color: #555; margin-bottom: 5px;">Cho ${data.name.toLowerCase().includes('nữ') || data.name.toLowerCase().includes('thị') ? 'bà' : 'ông'}:</div>
                  <div style="font-family: 'Cinzel', serif; font-size: 26px; font-weight: 700; text-transform: uppercase; color: #2c3e50; margin-bottom: 20px; letter-spacing: 1px;">
                    ${data.name}
                  </div>
                  
                  <div style="width: 100%; font-size: 14px; line-height: 1.6; text-align: left; padding: 0 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Sinh ngày:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${data.dob}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Hạng tốt nghiệp:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${data.classification}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Năm tốt nghiệp:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${data.graduationYear || new Date().getFullYear()}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="flex: 0 0 auto; margin-top: 10px;">
                  <div style="font-style: italic; font-size: 13px; text-align: right; margin-bottom: 10px;">Cần Thơ, ${data.graduationDate}</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 13px; color: #003366;">Hiệu Trưởng</div>
                  <div style="font-style: italic; font-size: 10px; color: #666; margin-bottom: 60px;">(Ký, ghi rõ họ tên và đóng dấu)</div>
                  <div style="font-weight: 700; font-size: 14px; margin-top: 10px;">GS. TS. Hà Thanh Toàn</div>
                  
                  <div style="text-align: left; font-size: 10px; margin-top: 20px; color: #444; border-top: 1px solid #eee; padding-top: 5px;">
                    Số hiệu: <b style="color: #b71c1c;">${data.studentId}_${data.graduationYear || new Date().getFullYear()}</b><br>
                    Số vào sổ cấp văn bằng: <b>${data.graduationYear || new Date().getFullYear()}/CTU/${data.studentId.substring(1)}</b>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Blockchain Info & QR Code Section -->
    <div style="background: white; border: 2px solid #667eea; border-radius: 10px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #667eea; margin-bottom: 20px; text-align: center;">🔗 Thông tin xác thực Blockchain</h3>
        
        <!-- QR Code and Blockchain Info -->
        <div style="padding: 15px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 10px; display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: center;">
          <div>
            <div style="font-size: 13px; color: #333; font-weight: 600; margin-bottom: 10px;">
              📜 Thông tin bằng tốt nghiệp
            </div>
            <div style="font-size: 12px; color: #333; margin: 5px 0;">
              <strong>Họ tên:</strong> ${data.name}
            </div>
            <div style="font-size: 12px; color: #333; margin: 5px 0;">
              <strong>MSSV:</strong> ${data.studentId}
            </div>
            <div style="font-size: 12px; color: #333; margin: 5px 0;">
              <strong>Ngành:</strong> ${data.major}
            </div>
            <div style="font-size: 12px; color: #333; margin: 5px 0;">
              <strong>Xếp loại:</strong> <span style="color: #f5576c; font-weight: 700;">${data.classification}</span>
            </div>
            <div style="font-size: 12px; color: #333; margin: 5px 0;">
              <strong>Năm tốt nghiệp:</strong> ${data.graduationYear || new Date().getFullYear()}
            </div>
            <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;">
              <div style="font-size: 11px; color: #666; font-weight: 600; margin-bottom: 5px;">
                🔗 Blockchain Hash:
              </div>
              <div style="font-family: monospace; font-size: 9px; color: #666; word-break: break-all;">
                ${data.diplomaHash ? data.diplomaHash.substring(0, 40) + '...' : ''}
              </div>
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #667eea; font-weight: 600;">
              📱 Quét mã QR để xác thực trực tuyến →
            </div>
          </div>
          
          <!-- QR Code -->
          <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div id="qrcode_${data.studentId}" style="width: 120px; height: 120px;"></div>
            <div style="text-align: center; font-size: 9px; color: #666; margin-top: 5px;">
              Quét để xác thực
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 30px 0;">
      <button onclick="copyVerifyLink('${data.studentId}', '${data.diplomaHash}')" style="background: #ffc107; color: #333; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-size: 14px; font-weight: 600; margin: 0 10px;">
        🔗 Copy Link Xác Thực
      </button>
    </div>
    
    <!-- Employer Notice -->
    <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 20px; margin-top: 20px; border-radius: 5px;">
      <h4 style="color: #0d47a1; margin-bottom: 10px;">💼 Hướng dẫn chia sẻ với nhà tuyển dụng</h4>
      <p style="color: #333; font-size: 14px; line-height: 1.8; margin-bottom: 10px;">
        <strong>Doanh nghiệp có thể xác thực bằng của bạn bằng 3 cách:</strong>
      </p>
      <ol style="margin-left: 30px; margin-top: 10px; line-height: 1.8; font-size: 14px; color: #333;">
        <li><strong>Quét QR Code:</strong> Sử dụng camera điện thoại quét mã QR trên bằng → Tự động xác thực</li>
        <li><strong>Click Link:</strong> Copy link xác thực (nút phía trên) và gửi cho nhà tuyển dụng → Tự động xác thực</li>
        <li><strong>Nhập MSSV:</strong> Truy cập <code>verify_diploma.html</code> và nhập MSSV: <strong>${data.studentId}</strong></li>
      </ol>
      <div style="margin-top: 15px; padding: 12px; background: rgba(102, 126, 234, 0.1); border-radius: 5px;">
        <strong>🔐 Blockchain Hash:</strong>
        <div style="font-family: monospace; font-size: 11px; margin-top: 5px; word-break: break-all; color: #666;">
          ${data.diplomaHash || ''}
        </div>
      </div>
    </div>
  `;
  
  resultDiv.innerHTML = html;
  resultDiv.style.display = 'block';
  
  // Tạo QR code sau khi HTML đã render
  setTimeout(() => {
    const verifyUrl = `${window.location.origin}${window.location.pathname.replace('student.html', '')}verify_diploma.html?studentId=${data.studentId}&hash=${data.diplomaHash}`;
    
    // Kiểm tra thư viện QRCode có tồn tại không
    if (typeof QRCode !== 'undefined') {
      new QRCode(document.getElementById(`qrcode_${data.studentId}`), {
        text: verifyUrl,
        width: 120,
        height: 120,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      console.warn('QRCode library not loaded. QR code will not be generated.');
      document.getElementById(`qrcode_${data.studentId}`).innerHTML = 
        '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 40px;">📱</div>';
    }
  }, 100);
}

// ====== TẢI XUỐNG BẰNG DẠNG PDF/HTML ======
function downloadDiplomaPDF(studentId) {
  // Sử dụng window.print() để in hoặc lưu PDF
  // Hoặc tạo file JSON chứa thông tin bằng
  const diplomaData = localStorage.getItem(`diploma_${studentId}`);
  const diplomaHash = localStorage.getItem(`diploma_hash_${studentId}`);
  
  if (!diplomaData) {
    alert('❌ Không tìm thấy bằng tốt nghiệp!');
    return;
  }
  
  // Tạo file JSON để download
  const blob = new Blob([diplomaData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Diploma_${studentId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert(`✅ Đã tải xuống bằng!\n\n📄 File: Diploma_${studentId}.json\n🔐 Hash: ${diplomaHash}\n\n💡 Doanh nghiệp có thể dùng file này để xác thực bằng của bạn.`);
}

// ====== COPY LINK XÁC THỰC ======
function copyVerifyLink(studentId, hash) {
  const verifyUrl = `${window.location.origin}${window.location.pathname.replace('student.html', '')}verify_diploma.html?studentId=${studentId}&hash=${hash}`;
  
  // Copy vào clipboard
  navigator.clipboard.writeText(verifyUrl).then(() => {
    alert(`✅ Đã copy link xác thực!\n\n🔗 Link:\n${verifyUrl}\n\n💡 Gửi link này cho doanh nghiệp để họ xác thực bằng của bạn.`);
  }).catch(err => {
    // Fallback nếu clipboard API không hoạt động
    const textarea = document.createElement('textarea');
    textarea.value = verifyUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert(`✅ Đã copy link xác thực!\n\n🔗 Link:\n${verifyUrl}`);
  });
}

// ====== TẢI XUỐNG BẰNG DẠNG HTML (CŨ - DEPRECATED) ======
function downloadDiploma() {
  downloadDiplomaPDF(currentStudentId);
}

// ====== HELPER FUNCTION: LẤY TÊN NHÓM TỰ CHỌN ======
function getGroupName(groupId) {
  const groupNames = {
    'ENGLISH': 'Tiếng Anh',
    'FRENCH': 'Tiếng Pháp', 
    'POLITICS_2TC': 'Chính trị 2TC',
    'SPECIALIZATION_CN1': 'Chuyên ngành 1 (An ninh mạng)',
    'SPECIALIZATION_CN2': 'Chuyên ngành 2 (Web & Mobile)',
    'SPECIALIZATION_CN3': 'Chuyên ngành 3 (IoT & Blockchain)',
    'THESIS': 'Tốt nghiệp',
    'PHYSICAL_EDUCATION': 'Thể chất',
    'OTHER': 'Tự chọn khác'
  };
  
  return groupNames[groupId] || groupId;
}

// ====== TỰ ĐỘNG TẢI THÔNG TIN SINH VIÊN TỪ SESSION ======
async function autoLoadStudentData() {
  try {
    // Lấy thông tin từ sessionStorage
    const userName = sessionStorage.getItem('userName');
    const userAddress = sessionStorage.getItem('userAddress');
    const studentId = sessionStorage.getItem('studentId');
    
    if (!userName || !userAddress || !studentId) {
      document.getElementById("status").innerHTML = 
        '<div class="error-box">❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!</div>';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }
    
    const mssv = studentId;
    currentStudentId = mssv;
    currentAccount = userAddress;
    
    // Khởi tạo Web3 và contract
    document.getElementById("status").innerHTML = 
      '<div class="info-box">🔄 Đang kết nối blockchain...</div>';
    
    if (!window.ethereum) {
      document.getElementById("status").innerHTML = 
        '<div class="error-box">❌ Vui lòng cài đặt MetaMask!</div>';
      return;
    }
    
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Tải thông tin sinh viên
    document.getElementById("status").innerHTML = 
      '<div class="info-box">📋 Đang tải thông tin sinh viên...</div>';
    
    const studentInfo = await contract.methods.getStudentInfo(mssv).call();
    
    if (!studentInfo.exists) {
      document.getElementById("status").innerHTML = 
        '<div class="error-box">❌ Không tìm thấy thông tin sinh viên!</div>';
      return;
    }
    
    // Hiển thị thông tin
    await displayStudentInfo(studentInfo);
    
    // Tải tổng kết và điểm
    document.getElementById("status").innerHTML = 
      '<div class="info-box">📊 Đang tải điểm và thống kê...</div>';
    
    await loadSummaryOnly(mssv);
    
    document.getElementById("status").innerHTML = 
      '<div class="success-box">✅ Đã tải thành công thông tin và điểm!</div>';
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      document.getElementById("status").innerHTML = '';
    }, 3000);
    
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    document.getElementById("status").innerHTML = 
      '<div class="error-box">❌ Lỗi: ' + error.message + '</div>';
  }
}

// ====== EVENT LISTENERS ======
document.addEventListener("DOMContentLoaded", async function() {
  // Tự động tải dữ liệu khi trang load
  await autoLoadStudentData();
  
  // Nút tải điểm
  const btnLoadGrades = document.getElementById("btnLoadGrades");
  if (btnLoadGrades) {
    btnLoadGrades.addEventListener("click", async function() {
      if (!currentStudentId) {
        document.getElementById("status").innerHTML = 
          '<div class="error-box">❌ Không xác định được MSSV!</div>';
        return;
      }
      // Tải điểm khi bấm nút
      await loadGradesByMSSV(currentStudentId);
    });
  }
  
  // Nút đăng ký xét tốt nghiệp
  const btnCheckGraduation = document.getElementById("btnCheckGraduation");
  if (btnCheckGraduation) {
    btnCheckGraduation.addEventListener("click", checkGraduationApplication);
  }
});