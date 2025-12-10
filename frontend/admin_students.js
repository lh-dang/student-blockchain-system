let web3;
let contract;
let currentAccount = null;
let registeredStudents = [];

const contractAddress = "0x0e068999591e59D0eAbff3491E2CD449B2B7D9f2";

// ========== CHỈ DÙNG CLASS MAPPING - KHÔNG CẦN MAPPING THỦ CÔNG ==========
// Program được xác định TỰ ĐỘNG từ Class thông qua setProgramClass() trong smart contract
// Không cần majorCode mapping nữa

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"department","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DeanInfoAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"diplomaHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaIssued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"address","name":"revokedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"approvedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"rejectedBy","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"applicationHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":true,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"programName","type":"string"},{"indexed":false,"internalType":"uint256","name":"minCredits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minGPA","type":"uint256"},{"indexed":false,"internalType":"address","name":"createdBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"semester","type":"string"},{"indexed":false,"internalType":"uint256","name":"courseCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"address","name":"submittedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"SemesterGradesSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentAssignedToProgram","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentInfoUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentRegistered","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allDeanAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allProgramIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allStudentIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"classToProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deans","outputs":[{"internalType":"address","name":"deanAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"diplomaIssuedStudents","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"diplomas","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"electiveGroups","outputs":[{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"graduationApplicants","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"graduationApplications","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDean","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programCourses","outputs":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programElectiveGroupIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"programs","outputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"address","name":"createdBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"semesterGrades","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"submittedAt","type":"uint256"},{"internalType":"address","name":"submittedBy","type":"address"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentIdExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"studentSemesters","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"students","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletToStudentId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"addDeanWithInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getDeanInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getAllActiveDeans","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDeans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"setDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"registerStudent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"updateStudentInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"string[]","name":"dobs","type":"string[]"},{"internalType":"string[]","name":"cccds","type":"string[]"},{"internalType":"string[]","name":"phones","type":"string[]"},{"internalType":"string[]","name":"emails","type":"string[]"},{"internalType":"string[]","name":"hometowns","type":"string[]"},{"internalType":"string[]","name":"classes","type":"string[]"},{"internalType":"string[]","name":"majors","type":"string[]"},{"internalType":"string[]","name":"majorCodes","type":"string[]"},{"internalType":"string[]","name":"departments","type":"string[]"},{"internalType":"string[]","name":"schools","type":"string[]"},{"internalType":"string[]","name":"programsArray","type":"string[]"},{"internalType":"address[]","name":"walletAddresses","type":"address[]"}],"name":"batchRegisterStudents","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"uint16[]","name":"grades","type":"uint16[]"},{"internalType":"string[]","name":"letterGrades","type":"string[]"},{"internalType":"string[]","name":"instructors","type":"string[]"}],"name":"submitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"semesters","type":"string[]"},{"internalType":"string[][]","name":"courseIdsArray","type":"string[][]"},{"internalType":"string[][]","name":"courseNamesArray","type":"string[][]"},{"internalType":"uint8[][]","name":"creditsArray","type":"uint8[][]"},{"internalType":"uint16[][]","name":"gradesArray","type":"uint16[][]"},{"internalType":"string[][]","name":"letterGradesArray","type":"string[][]"},{"internalType":"string[][]","name":"instructorsArray","type":"string[][]"}],"name":"batchSubmitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentInfo","outputs":[{"components":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct StudentManagement.StudentInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentSemesters","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterGrades","outputs":[{"internalType":"string","name":"","type":"string"},{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade[]","name":"","type":"tuple[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterCourseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getCourseGrade","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalStudents","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStudentIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"}],"name":"createProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"}],"name":"addCoursesToProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"string[]","name":"courseIds","type":"string[]"}],"name":"addElectiveGroup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupNames","type":"string[]"},{"internalType":"uint8[]","name":"electiveRequiredCredits","type":"uint8[]"},{"internalType":"uint256[]","name":"electiveGroupCourseStartIdx","type":"uint256[]"},{"internalType":"uint256[]","name":"electiveGroupCourseCount","type":"uint256[]"}],"name":"createProgramComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"}],"name":"updateProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"className","type":"string"}],"name":"setProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"classNames","type":"string[]"}],"name":"batchSetProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgram","outputs":[{"internalType":"string","name":"_programName","type":"string"},{"internalType":"uint256","name":"_totalCredits","type":"uint256"},{"internalType":"uint256","name":"_minCredits","type":"uint256"},{"internalType":"uint256","name":"_minGPA","type":"uint256"},{"internalType":"uint256","name":"_courseCount","type":"uint256"},{"internalType":"bool","name":"_isActive","type":"bool"},{"internalType":"uint256","name":"_createdAt","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramCourses","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"string[]","name":"prerequisites","type":"string[]"},{"internalType":"string[]","name":"corequisites","type":"string[]"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"internalType":"struct StudentManagement.ProgramCourse[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"courseId","type":"string"}],"name":"getProgramCourse","outputs":[{"internalType":"string","name":"_courseId","type":"string"},{"internalType":"string","name":"_courseName","type":"string"},{"internalType":"uint256","name":"_credits","type":"uint256"},{"internalType":"bool","name":"_isRequired","type":"bool"},{"internalType":"string[]","name":"_prerequisites","type":"string[]"},{"internalType":"string[]","name":"_corequisites","type":"string[]"},{"internalType":"uint256","name":"_minCreditsRequired","type":"uint256"},{"internalType":"string","name":"_groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"}],"name":"getElectiveGroup","outputs":[{"internalType":"string","name":"_groupId","type":"string"},{"internalType":"string","name":"_groupName","type":"string"},{"internalType":"uint256","name":"_requiredCredits","type":"uint256"},{"internalType":"string[]","name":"_courseIds","type":"string[]"},{"internalType":"bool","name":"_exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramElectiveGroupIds","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalPrograms","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getProgramIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"className","type":"string"}],"name":"getProgramByClass","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"mintDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"submitGraduationApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"approveGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"rejectGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getGraduationApplication","outputs":[{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notesStr","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalGraduationApplications","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getGraduationApplicantByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"}],"name":"verifyDiploma","outputs":[{"internalType":"bool","name":"valid","type":"bool"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiploma","outputs":[{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"revokeDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"hasDiploma","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"isDiplomaRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiplomaRevokeInfo","outputs":[{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"address","name":"revokedBy","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDiplomasIssued","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getStudentIdByWallet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"address","name":"wallet","type":"address"}],"name":"verifyStudentWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true}];

// ============ HELPER FUNCTIONS ============

/**
 * Chuyển đổi ngày sinh về định dạng dd/mm/yyyy
 * Xử lý các trường hợp:
 * - String dd/mm/yyyy → giữ nguyên
 * - Số (Excel timestamp) → chuyển về dd/mm/yyyy
 * - ISO date (yyyy-mm-dd hoặc yyyy-mm-ddTHH:MM:SS) → chuyển về dd/mm/yyyy
 * - Timestamp Unix → chuyển về dd/mm/yyyy
 */
function normalizeDOB(dob) {
  if (!dob) return '';
  
  // Nếu đã đúng định dạng dd/mm/yyyy (string)
  if (typeof dob === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dob)) {
    return dob; // Giữ nguyên
  }
  
  // Nếu là số (Excel serial date hoặc Unix timestamp)
  if (typeof dob === 'number') {
    let date;
    
    // Excel serial date (thường < 100000)
    // Excel epoch: 1/1/1900 = 1, 1/1/2000 = 36526
    if (dob > 1 && dob < 100000) {
      // Chuyển Excel serial date về JavaScript Date
      // Excel epoch bắt đầu từ 1/1/1900 (sai lệch 2 ngày do Excel bug)
      const excelEpoch = new Date(1899, 11, 30); // 30/12/1899
      date = new Date(excelEpoch.getTime() + dob * 86400000);
    } 
    // Unix timestamp (milliseconds)
    else if (dob > 100000) {
      date = new Date(dob);
    } else {
      return String(dob); // Không xác định được, trả về string
    }
    
    // Format dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Nếu là string ISO date (yyyy-mm-dd hoặc yyyy-mm-ddTHH:MM:SS)
  if (typeof dob === 'string') {
    // Thử parse ISO date
    const isoMatch = dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const year = isoMatch[1];
      const month = isoMatch[2];
      const day = isoMatch[3];
      return `${day}/${month}/${year}`;
    }
  }
  
  // Fallback: trả về string gốc
  return String(dob);
}

// Switch tab
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(t => t.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
  
  // Tự động load danh sách khi chuyển sang tab list
  if (tabName === 'list' && contract) {
    loadRegisteredStudents();
  }
}

// Khởi tạo Web3
async function initializeWeb3() {
  if (!window.ethereum) {
    alert('❌ Không tìm thấy MetaMask!');
    return false;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    currentAccount = accounts[0];
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Listen for account changes
    window.ethereum.on('accountsChanged', function (accounts) {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        location.reload();
      }
    });

    return true;
  } catch (err) {
    console.error(err);
    alert('❌ Lỗi kết nối: ' + err.message);
    return false;
  }
}

// Tự động khởi tạo khi trang load
window.addEventListener('DOMContentLoaded', async () => {
  await initializeWeb3();
});

// Đăng ký từng sinh viên
async function registerSingleStudent() {
  if (!contract || !currentAccount) {
    document.getElementById("singleStatus").innerHTML = '<div class="error-box">❌ Chưa kết nối MetaMask!</div>';
    return;
  }

  const studentId = document.getElementById("singleStudentId").value.trim();
  const name = document.getElementById("singleName").value.trim();
  const dobRaw = document.getElementById("singleDob").value.trim();
  const dob = normalizeDOB(dobRaw); // Chuẩn hóa ngày sinh về dd/mm/yyyy
  const cccd = document.getElementById("singleCccd").value.trim();
  const phone = document.getElementById("singlePhone").value.trim();
  const email = document.getElementById("singleEmail").value.trim();
  const hometown = document.getElementById("singleHometown").value.trim();
  const class_ = document.getElementById("singleClass").value.trim();
  const khoaHoc = document.getElementById("singleKhoaHoc").value.trim();
  const major = document.getElementById("singleMajor").value.trim();
  const department = document.getElementById("singleDepartment").value.trim();
  const school = document.getElementById("singleSchool").value.trim();
  const program = document.getElementById("singleProgram").value.trim();
  const walletAddress = document.getElementById("singleWalletAddress").value.trim();

  if (!studentId) {
    document.getElementById("singleStatus").innerHTML = '<div class="error-box">❌ Vui lòng nhập MSSV!</div>';
    return;
  }
  if (!name) {
    document.getElementById("singleStatus").innerHTML = '<div class="error-box">❌ Vui lòng nhập họ tên!</div>';
    return;
  }
  if (!walletAddress) {
    document.getElementById("singleStatus").innerHTML = '<div class="error-box">❌ Vui lòng nhập địa chỉ ví Ethereum!</div>';
    return;
  }
  
  // Validate Ethereum address
  if (!web3.utils.isAddress(walletAddress)) {
    document.getElementById("singleStatus").innerHTML = '<div class="error-box">❌ Địa chỉ ví không hợp lệ! Phải có dạng 0x + 40 ký tự hex</div>';
    return;
  }

  try {
    document.getElementById("singleStatus").innerHTML = '<div class="info-box">⏳ Bước 1/3: Kiểm tra sinh viên...</div>';

    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    if (studentInfo.exists) {
      document.getElementById("singleStatus").innerHTML = '<div class="warning-box">⚠️ Sinh viên đã được đăng ký rồi!</div>';
      return;
    }

    // Bước 2: Tự động lấy program từ class
    document.getElementById("singleStatus").innerHTML = '<div class="info-box">⏳ Bước 2/3: Tìm chương trình đào tạo từ lớp...</div>';
    
    let finalProgram = program;
    if (class_) {
      try {
        const programFromClass = await contract.methods.getProgramByClass(class_).call();
        if (programFromClass && programFromClass.length > 0) {
          finalProgram = programFromClass;
          console.log(`✅ Tìm thấy chương trình từ class "${class_}": ${programFromClass}`);
        } else {
          console.log(`⚠️ Không tìm thấy chương trình cho class "${class_}", dùng program mặc định`);
        }
      } catch (e) {
        console.warn('Lỗi lấy program từ class:', e);
      }
    }

    document.getElementById("singleStatus").innerHTML = '<div class="info-box">⏳ Bước 3/3: Đăng ký sinh viên lên blockchain...</div>';

    const tx = await contract.methods.registerStudent(
      studentId, name, dob, cccd, phone, email,
      hometown, class_, major, khoaHoc, department, school, 
      finalProgram,  // Dùng program tự động từ class hoặc manual
      walletAddress  // 🔐 Địa chỉ ví để xác thực
    ).send({
      from: currentAccount,
      gas: 5000000
    });

    console.log("✅ Transaction:", tx.transactionHash);

    const studentData = {
      studentId, name, dob, cccd, phone, email,
      hometown, class: class_, major, khoaHoc, department, school, program: finalProgram,
      walletAddress: walletAddress,
      txHash: tx.transactionHash,
      blockNumber: tx.blockNumber,
      timestamp: new Date().toISOString()
    };

    registeredStudents.push(studentData);
    localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));

    document.getElementById("singleStatus").innerHTML = `
      <div class="success-box">
        <h3>✅ Đăng ký thành công!</h3>
        <p><strong>MSSV:</strong> ${studentId} - <strong>Họ tên:</strong> ${name}</p>
        <p><strong>Lớp:</strong> ${class_ || 'N/A'} | <strong>Ngành:</strong> ${major || 'N/A'}</p>
        <p><strong>Chương trình:</strong> ${finalProgram || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>🔐 Ví:</strong> <code style="font-size: 11px;">${walletAddress}</code></p>
        <hr style="margin: 10px 0;">
        <p><strong>Transaction Hash:</strong> <code style="font-size: 11px;">${tx.transactionHash}</code></p>
        <p><strong>Block Number:</strong> ${tx.blockNumber}</p>
        <p style="margin-top: 15px; color: #28a745;">
          <strong>💡 Lưu ý:</strong> Sinh viên CHỈ có thể đăng nhập bằng ví <code>${walletAddress}</code>
        </p>
      </div>
    `;

    clearSingleForm();
  } catch (err) {
    console.error(err);
    document.getElementById("singleStatus").innerHTML = `<div class="error-box">❌ Lỗi: ${err.message}</div>`;
  }
}

// Xử lý file JSON
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById("fileName").textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById("jsonInput").value = e.target.result;
  };
  reader.readAsText(file);
}

// Validate JSON
function validateJSON() {
  const jsonText = document.getElementById("jsonInput").value.trim();
  if (!jsonText) {
    document.getElementById("bulkStatus").innerHTML = '<div class="error-box">❌ Chưa nhập JSON!</div>';
    return;
  }

  try {
    const data = JSON.parse(jsonText);
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('JSON phải có trường "students" là mảng');
    }

    let html = '<div class="success-box"><h3>✅ JSON hợp lệ!</h3>';
    html += `<p><strong>Số sinh viên:</strong> ${data.students.length}</p>`;
    html += '<ul>';
    data.students.forEach((s, i) => {
      html += `<li>${i + 1}. MSSV: ${s.studentId || 'N/A'} - ${s.name || 'N/A'}</li>`;
    });
    html += '</ul></div>';
    document.getElementById("bulkStatus").innerHTML = html;
  } catch (err) {
    document.getElementById("bulkStatus").innerHTML = `<div class="error-box">❌ JSON không hợp lệ: ${err.message}</div>`;
  }
}

// Đăng ký hàng loạt
async function registerBulkStudents() {
  if (!contract || !currentAccount) {
    document.getElementById("bulkStatus").innerHTML = '<div class="error-box">❌ Chưa kết nối MetaMask!</div>';
    return;
  }

  const jsonText = document.getElementById("jsonInput").value.trim();
  if (!jsonText) {
    document.getElementById("bulkStatus").innerHTML = '<div class="error-box">❌ Chưa nhập JSON!</div>';
    return;
  }

  try {
    const data = JSON.parse(jsonText);
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('JSON phải có trường "students" là mảng');
    }

    document.getElementById("bulkStatus").innerHTML = '<div class="info-box">⏳ Đang đăng ký hàng loạt...</div>';

    let success = 0;
    let failed = 0;
    let results = [];

    for (let i = 0; i < data.students.length; i++) {
      const student = data.students[i];
      const studentId = student.studentId || '';
      const studentName = student.name || 'N/A';
      
      try {
        if (!studentId) {
          throw new Error('Thiếu MSSV (studentId)');
        }
        if (!studentName || studentName === 'N/A') {
          throw new Error('Thiếu tên sinh viên');
        }

        const studentInfo = await contract.methods.getStudentInfo(studentId).call();
        if (studentInfo.exists) {
          results.push(`⚠️ ${studentName}: Đã đăng ký rồi`);
          continue;
        }

        // Validate wallet address TRƯỚC
        const walletAddress = student.walletAddress || '';
        if (!walletAddress) {
          throw new Error('❌ THIẾU WALLET ADDRESS - Cần thêm cột walletAddress trong JSON');
        }
        if (!web3.utils.isAddress(walletAddress)) {
          throw new Error(`❌ WALLET ADDRESS KHÔNG HỢP LỆ: ${walletAddress}`);
        }

        // Kiểm tra Class mapping
        const studentClass = student.class || '';
        if (!studentClass) {
          throw new Error('❌ THIẾU CLASS - Không thể gán vào Program');
        }

        // Tự động lấy program từ class
        let finalProgram = student.program || '';
        try {
          const programFromClass = await contract.methods.getProgramByClass(studentClass).call();
          if (programFromClass && programFromClass.length > 0) {
            finalProgram = programFromClass;
            console.log(`✅ Sinh viên ${studentId} - Lớp "${studentClass}" → Program "${programFromClass}"`);
          } else {
            throw new Error(`❌ CLASS "${studentClass}" CHƯA ĐƯỢC GÁN VÀO PROGRAM! Vào admin_programs.html để gán Class trước!`);
          }
        } catch (e) {
          if (e.message.includes('CHƯA ĐƯỢC GÁN')) {
            throw e; // Throw lại error quan trọng
          }
          console.warn(`Lỗi lấy program từ class "${studentClass}":`, e);
          throw new Error(`❌ LỖI: Class "${studentClass}" chưa được gán vào Program nào. Vào admin_programs.html để gán!`);
        }

        const tx = await contract.methods.registerStudent(
          studentId,
          studentName,
          normalizeDOB(student.dob || ''), // Chuẩn hóa ngày sinh về dd/mm/yyyy
          student.cccd || '',
          student.phone || '',
          student.email || '',
          student.hometown || '',
          student.class || '',
          student.major || '',
          student.khoaHoc || '',
          student.department || '',
          student.school || '',
          finalProgram,  // Dùng program tự động từ class
          walletAddress  // 🔐 Địa chỉ ví để xác thực
        ).send({
          from: currentAccount,
          gas: 5000000
        });

        registeredStudents.push({
          ...student,
          program: finalProgram,
          walletAddress: walletAddress,
          txHash: tx.transactionHash,
          blockNumber: tx.blockNumber,
          timestamp: new Date().toISOString()
        });

        results.push(`✅ ${studentName} (${studentId}): Thành công → Wallet: ${walletAddress.slice(0, 10)}...`);
        success++;
      } catch (err) {
        results.push(`❌ ${studentName}: ${err.message}`);
        failed++;
      }

      document.getElementById("bulkStatus").innerHTML = `
        <div class="info-box">
          <h3>⏳ Đang xử lý... (${i + 1}/${data.students.length})</h3>
          <p>Thành công: ${success} | Thất bại: ${failed}</p>
        </div>
      `;
    }

    localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));

    let html = `
      <div class="${success > 0 ? 'success-box' : 'error-box'}">
        <h3>📊 Kết quả đăng ký</h3>
        <p><strong>Thành công:</strong> ${success} | <strong>Thất bại:</strong> ${failed}</p>
        <ul style="margin-top: 10px; max-height: 300px; overflow-y: auto;">`;
    results.forEach(r => {
      html += `<li>${r}</li>`;
    });
    html += '</ul></div>';
    document.getElementById("bulkStatus").innerHTML = html;
  } catch (err) {
    document.getElementById("bulkStatus").innerHTML = `<div class="error-box">❌ Lỗi: ${err.message}</div>`;
  }
}

// Load danh sách sinh viên từ blockchain
async function loadRegisteredStudents() {
  if (!contract) {
    alert('❌ Vui lòng kết nối MetaMask trước!');
    return;
  }

  const listDiv = document.getElementById("studentList");
  listDiv.innerHTML = '<div class="info-box">⏳ Đang tải danh sách sinh viên từ blockchain...</div>';

  try {
    const totalStudents = await contract.methods.getTotalStudents().call();
    console.log('Total students on blockchain:', totalStudents);

    if (totalStudents == 0) {
      listDiv.innerHTML = '<div class="info-box">ℹ️ Chưa có sinh viên nào được đăng ký trên blockchain.</div>';
      registeredStudents = [];
      updateClassFilter();
      return;
    }

    // Load tất cả sinh viên từ blockchain
    registeredStudents = [];
    for (let i = 0; i < totalStudents; i++) {
      const studentId = await contract.methods.getStudentIdByIndex(i).call();
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();

      if (studentInfo.exists) {
        // Trích xuất khóa học từ lớp (VD: DI20T9A1 -> 2020)
        let khoaHoc = '';
        if (studentInfo.class) {
          const match = studentInfo.class.match(/\d{2}/);
          if (match) {
            khoaHoc = '20' + match[0];
          }
        }
        
        registeredStudents.push({
          studentId: studentInfo.studentId,
          name: studentInfo.name,
          dob: normalizeDOB(studentInfo.dob), // Chuẩn hóa ngày sinh khi hiển thị
          cccd: studentInfo.cccd,
          phone: studentInfo.phone,
          email: studentInfo.email,
          hometown: studentInfo.hometown,
          class: studentInfo.class,
          major: studentInfo.major,
          majorCode: studentInfo.majorCode,
          department: studentInfo.department,
          school: studentInfo.school,
          program: studentInfo.program,
          khoaHoc: khoaHoc,
          registeredAt: new Date(parseInt(studentInfo.registeredAt) * 1000).toLocaleString('vi-VN')
        });
      }
    }

    console.log('Loaded students from blockchain:', registeredStudents.length);

    // Cập nhật các dropdown lọc
    updateFilters();
    
    // Hiển thị tất cả sinh viên ban đầu
    displayStudents(registeredStudents);

  } catch (error) {
    console.error('Error loading students:', error);
    listDiv.innerHTML = `<div class="error-box">❌ Lỗi tải danh sách: ${error.message}</div>`;
  }
}

// Cập nhật tất cả dropdown filters
function updateFilters() {
  const yearFilter = document.getElementById("yearFilter");
  const classFilter = document.getElementById("classFilter");
  
  if (!yearFilter || !classFilter) return;
  
  // Lấy danh sách khóa học và lớp duy nhất
  const uniqueYears = new Set();
  const uniqueClasses = new Set();
  
  registeredStudents.forEach(s => {
    if (s.class) uniqueClasses.add(s.class);
    if (s.khoaHoc) uniqueYears.add(s.khoaHoc);
  });
  
  // Populate khóa học
  let yearOptions = '<option value="">-- Tất cả khóa học --</option>';
  Array.from(uniqueYears).sort((a, b) => b - a).forEach(year => {
    yearOptions += `<option value="${year}">Khóa ${year}</option>`;
  });
  yearFilter.innerHTML = yearOptions;
  
  // Populate lớp học
  let classOptions = '<option value="">-- Tất cả lớp --</option>';
  Array.from(uniqueClasses).sort().forEach(className => {
    classOptions += `<option value="${className}">${className}</option>`;
  });
  classFilter.innerHTML = classOptions;
}

// Lọc sinh viên (hỗ trợ KhoaHoc, Class, và tìm kiếm)
function filterStudents() {
  const yearFilter = document.getElementById("yearFilter");
  const classFilter = document.getElementById("classFilter");
  const searchFilter = document.getElementById("searchFilter");
  
  const selectedYear = yearFilter ? yearFilter.value : '';
  const selectedClass = classFilter ? classFilter.value : '';
  const searchTerm = searchFilter ? searchFilter.value.toLowerCase().trim() : '';
  
  let filtered = registeredStudents;
  
  // Lọc theo khóa học
  if (selectedYear) {
    filtered = filtered.filter(s => s.khoaHoc === selectedYear);
  }
  
  // Lọc theo lớp
  if (selectedClass) {
    filtered = filtered.filter(s => s.class === selectedClass);
  }
  
  // Lọc theo tìm kiếm (MSSV hoặc tên)
  if (searchTerm) {
    filtered = filtered.filter(s => 
      (s.studentId && s.studentId.toLowerCase().includes(searchTerm)) ||
      (s.name && s.name.toLowerCase().includes(searchTerm))
    );
  }
  
  displayStudents(filtered);
}

// Giữ lại để backward compatibility
function filterStudentsByClass() {
  filterStudents();
}

// Cập nhật dropdown filter lớp học phần (giữ lại cho backward compatibility)
function updateClassFilter() {
  updateFilters();
}

// Hiển thị danh sách sinh viên
function displayStudents(students) {
  const listDiv = document.getElementById("studentList");
  
  if (students.length === 0) {
    listDiv.innerHTML = '<div class="info-box">ℹ️ Không tìm thấy sinh viên nào.</div>';
    return;
  }
  
  // Thống kê
  const uniqueClasses = [...new Set(students.map(s => s.class).filter(c => c))];
  const uniqueYears = [...new Set(students.map(s => s.khoaHoc).filter(k => k))];
  
  let html = `
    <div class="info-box" style="margin-bottom: 20px;">
      <strong>📊 Thống kê:</strong> ${students.length} sinh viên<br>
      <strong>Khóa học:</strong> ${uniqueYears.sort((a, b) => b - a).join(', ') || 'N/A'}<br>
      <strong>Các lớp:</strong> ${uniqueClasses.sort().join(', ') || 'N/A'}
    </div>
    
    <div style="max-height: 600px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">STT</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">MSSV</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Họ tên</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Ngày sinh</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">CCCD</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">SĐT</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Email</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Quê quán</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Lớp</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Ngành</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Khoa</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Trường</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Hệ</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Khóa</th>
            <th style="padding: 12px; background: #667eea; color: white; border: 1px solid #ddd; position: sticky; top: 0; z-index: 10;">Đăng ký lúc</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  students.forEach((s, i) => {
    const bgColor = i % 2 === 0 ? '#f8f9fa' : 'white';
    html += `
      <tr style="background: ${bgColor};">
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${i + 1}</td>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${s.studentId || 'N/A'}</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.name || 'N/A'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.dob || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.cccd || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.phone || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${s.email || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.hometown || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${s.class || '-'}</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.major || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.department || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.school || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${s.program || '-'}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;"><strong>${s.khoaHoc || '-'}</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd; font-size: 11px;">${s.registeredAt || '-'}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  listDiv.innerHTML = html;
}

// Clear forms
function clearSingleForm() {
  document.getElementById("singleStudentId").value = '';
  document.getElementById("singleName").value = '';
  document.getElementById("singleDob").value = '';
  document.getElementById("singleCccd").value = '';
  document.getElementById("singlePhone").value = '';
  document.getElementById("singleEmail").value = '';
  document.getElementById("singleHometown").value = '';
  document.getElementById("singleClass").value = '';
  document.getElementById("singleKhoaHoc").value = '';
  document.getElementById("singleMajor").value = '';
  document.getElementById("singleDepartment").value = '';
  document.getElementById("singleSchool").value = '';
  document.getElementById("singleProgram").value = '';
  document.getElementById("singleWalletAddress").value = '';
}

function clearBulkForm() {
  document.getElementById("jsonInput").value = '';
  document.getElementById("jsonFile").value = '';
  document.getElementById("fileName").textContent = 'Chưa chọn file';
  document.getElementById("bulkStatus").innerHTML = '';
}

// ============ UPDATE STUDENT FUNCTIONS ============

// Tìm kiếm sinh viên để cập nhật
async function searchStudentForUpdate() {
  if (!contract || !currentAccount) {
    document.getElementById("updateSearchResult").innerHTML = 
      '<div class="error-box">❌ Chưa kết nối MetaMask!</div>';
    return;
  }

  const mssv = document.getElementById("updateSearchMSSV").value.trim();
  
  if (!mssv) {
    document.getElementById("updateSearchResult").innerHTML = 
      '<div class="error-box">❌ Vui lòng nhập MSSV!</div>';
    return;
  }

  document.getElementById("updateSearchResult").innerHTML = 
    '<div class="info-box">🔍 Đang tìm kiếm...</div>';

  try {
    const studentInfo = await contract.methods.getStudentInfo(mssv).call();
    
    if (!studentInfo.exists) {
      document.getElementById("updateSearchResult").innerHTML = 
        `<div class="error-box">❌ Không tìm thấy sinh viên với MSSV: <strong>${mssv}</strong></div>`;
      document.getElementById("updateFormSection").style.display = 'none';
      return;
    }

    // Hiển thị thông tin hiện tại
    document.getElementById("updateSearchResult").innerHTML = `
      <div class="success-box">
        <h3>✅ Tìm thấy sinh viên</h3>
        <strong>MSSV:</strong> ${studentInfo.studentId}<br>
        <strong>Họ tên:</strong> ${studentInfo.name}<br>
        <strong>Lớp:</strong> ${studentInfo.class || '-'}<br>
        <strong>Ngành:</strong> ${studentInfo.major || '-'}<br>
        <strong>Đã đăng ký lúc:</strong> ${new Date(parseInt(studentInfo.registeredAt) * 1000).toLocaleString('vi-VN')}
      </div>
    `;

    // Fill form với dữ liệu hiện tại
    document.getElementById("updateStudentId").value = studentInfo.studentId;
    document.getElementById("updateName").value = studentInfo.name;
    document.getElementById("updateDob").value = studentInfo.dob;
    document.getElementById("updateCCCD").value = studentInfo.cccd;
    document.getElementById("updatePhone").value = studentInfo.phone;
    document.getElementById("updateEmail").value = studentInfo.email;
    document.getElementById("updateHometown").value = studentInfo.hometown;
    document.getElementById("updateClass").value = studentInfo.class;
    document.getElementById("updateKhoaHoc").value = studentInfo.majorCode;
    document.getElementById("updateMajor").value = studentInfo.major;
    document.getElementById("updateDepartment").value = studentInfo.department;
    document.getElementById("updateSchool").value = studentInfo.school;
    document.getElementById("updateProgram").value = studentInfo.program;
    document.getElementById("updateWalletAddress").value = studentInfo.walletAddress || "";

    // Update confirmation
    document.getElementById("updateConfirmName").textContent = studentInfo.name;
    document.getElementById("updateConfirmId").textContent = studentInfo.studentId;

    document.getElementById("updateFormSection").style.display = 'block';
    document.getElementById("updateFormSection").scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error(err);
    document.getElementById("updateSearchResult").innerHTML = 
      `<div class="error-box">❌ Lỗi: ${err.message}</div>`;
    document.getElementById("updateFormSection").style.display = 'none';
  }
}

// Cập nhật thông tin sinh viên
async function updateStudentInfo() {
  if (!contract || !currentAccount) {
    document.getElementById("updateStatus").innerHTML = 
      '<div class="error-box">❌ Chưa kết nối MetaMask!</div>';
    return;
  }

  const studentId = document.getElementById("updateStudentId").value.trim();
  const name = document.getElementById("updateName").value.trim();
  const dob = document.getElementById("updateDob").value.trim();
  const cccd = document.getElementById("updateCCCD").value.trim();
  const phone = document.getElementById("updatePhone").value.trim();
  const email = document.getElementById("updateEmail").value.trim();
  const hometown = document.getElementById("updateHometown").value.trim();
  const class_ = document.getElementById("updateClass").value.trim();
  const khoaHoc = document.getElementById("updateKhoaHoc").value.trim();
  const major = document.getElementById("updateMajor").value.trim();
  const department = document.getElementById("updateDepartment").value.trim();
  const school = document.getElementById("updateSchool").value.trim();
  const program = document.getElementById("updateProgram").value.trim();
  const walletAddress = document.getElementById("updateWalletAddress").value.trim();

  if (!studentId || !name) {
    document.getElementById("updateStatus").innerHTML = 
      '<div class="error-box">❌ MSSV và Họ tên là bắt buộc!</div>';
    return;
  }

  // Validate wallet address nếu có nhập
  if (walletAddress && !web3.utils.isAddress(walletAddress)) {
    document.getElementById("updateStatus").innerHTML = 
      '<div class="error-box">❌ Địa chỉ ví không hợp lệ!</div>';
    return;
  }

  const confirmMsg = `🔄 Xác nhận cập nhật thông tin sinh viên?\n\n` +
    `MSSV: ${studentId}\n` +
    `Tên: ${name}\n\n` +
    `⚠️ Lưu ý: Chỉ cập nhật thông tin, KHÔNG ảnh hưởng đến điểm số.`;

  if (!confirm(confirmMsg)) {
    return;
  }

  document.getElementById("updateStatus").innerHTML = 
    '<div class="info-box">⏳ Đang cập nhật lên blockchain...</div>';

  try {
    // Nếu không nhập wallet address mới, dùng zero address (nghĩa là giữ nguyên)
    const finalWalletAddress = walletAddress || "0x0000000000000000000000000000000000000000";
    
    const tx = await contract.methods.updateStudentInfo(
      studentId,
      name,
      dob,
      cccd,
      phone,
      email,
      hometown,
      class_,
      major,
      khoaHoc, // khóa học
      department,
      school,
      program,
      finalWalletAddress // walletAddress - zero address means no change
    ).send({ from: currentAccount, gas: 500000 });

    document.getElementById("updateStatus").innerHTML = `
      <div class="success-box">
        <h3>✅ Cập nhật thông tin thành công!</h3>
        <strong>MSSV:</strong> ${studentId}<br>
        <strong>Tên:</strong> ${name}<br>
        ${walletAddress ? `<strong>Địa chỉ ví mới:</strong> ${walletAddress}<br>` : ''}
        <strong>Transaction hash:</strong> <code>${tx.transactionHash}</code><br>
        <strong>Block number:</strong> ${tx.blockNumber}
      </div>
    `;

    // Reload student info
    setTimeout(() => {
      searchStudentForUpdate();
    }, 2000);

  } catch (err) {
    console.error(err);
    document.getElementById("updateStatus").innerHTML = `
      <div class="error-box">
        <strong>❌ Lỗi cập nhật:</strong><br>
        ${err.message}
      </div>
    `;
  }
}

// Xóa form cập nhật
function clearUpdateForm() {
  document.getElementById("updateSearchMSSV").value = '';
  document.getElementById("updateSearchResult").innerHTML = '';
  document.getElementById("updateFormSection").style.display = 'none';
  document.getElementById("updateStatus").innerHTML = '';
  
  // Clear all fields
  document.getElementById("updateStudentId").value = '';
  document.getElementById("updateName").value = '';
  document.getElementById("updateDob").value = '';
  document.getElementById("updateCCCD").value = '';
  document.getElementById("updatePhone").value = '';
  document.getElementById("updateEmail").value = '';
  document.getElementById("updateHometown").value = '';
  document.getElementById("updateClass").value = '';
  document.getElementById("updateKhoaHoc").value = '';
  document.getElementById("updateMajor").value = '';
  document.getElementById("updateDepartment").value = '';
  document.getElementById("updateSchool").value = '';
  document.getElementById("updateProgram").value = '';
  document.getElementById("updateWalletAddress").value = '';
}

// ========== EXCEL UPLOAD FUNCTIONS ==========
let excelStudentData = null;

function handleExcelStudentUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById("excelStudentsFileName").textContent = file.name;
  document.getElementById("excelUploadStatus").innerHTML = '<div class="info-box">⏳ Đang đọc file...</div>';

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      if (jsonData.length < 2) {
        throw new Error('File Excel phải có ít nhất 2 dòng (header + dữ liệu)');
      }

      // Validate header
      const headers = jsonData[0];
      const expectedHeaders = ['MSSV', 'HoTen', 'NgaySinh', 'CCCD', 'SDT', 'Email', 'QueQuan', 'Lop', 'Nganh', 'Khoa', 'Truong', 'HeDaoTao', 'WalletAddress', 'KhoaHoc'];
      
      // Kiểm tra số cột
      if (headers.length < 14) {
        const actualHeaders = headers.map(h => String(h || '').trim()).join(' | ');
        throw new Error(`❌ File Excel thiếu cột!<br><br>
          <strong>Số cột hiện tại:</strong> ${headers.length} cột<br>
          <strong>Số cột yêu cầu:</strong> 14 cột<br><br>
          <strong>Các cột hiện có:</strong><br>${actualHeaders}<br><br>
          <strong>Các cột yêu cầu:</strong><br>${expectedHeaders.join(' | ')}<br><br>
          💡 <strong>Khắc phục:</strong> Thêm các cột còn thiếu vào file Excel`);
      }
      
      // Helper: bỏ dấu tiếng Việt để so sánh
      function removeVietnameseTones(str) {
        return str.normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/đ/g, 'd')
                  .replace(/Đ/g, 'D');
      }
      
      // Kiểm tra header có đúng không (case-insensitive + bỏ dấu)
      const headerCheck = headers.slice(0, 14).map((h, i) => {
        const expected = expectedHeaders[i];
        const actual = String(h || '').trim();
        const normalizedExpected = removeVietnameseTones(expected).toLowerCase();
        const normalizedActual = removeVietnameseTones(actual).toLowerCase();
        return { 
          index: i, 
          expected, 
          actual, 
          match: normalizedActual === normalizedExpected 
        };
      });
      
      const missingHeaders = headerCheck.filter(h => !h.match);
      if (missingHeaders.length > 0 && missingHeaders.length <= 3) {
        const errorMsg = missingHeaders.map(h => `Cột ${h.index + 1}: Mong đợi "${h.expected}" (hoặc có dấu), nhận được "${h.actual}"`).join('<br>');
        throw new Error(`File Excel sai cấu trúc header:<br>${errorMsg}<br><br>Cấu trúc đúng: ${expectedHeaders.join(' | ')}`);
      }

      // Parse dữ liệu
      const students = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        // Debug: show full row data for first 3 rows
        if (i <= 3) {
          console.log(`🔍 RAW ROW ${i}:`, row);
          console.log(`   - Length: ${row.length}`);
          console.log(`   - row[12] (WalletAddress):`, row[12]);
          console.log(`   - row[13] (KhoaHoc):`, row[13]);
        }

        // Clean wallet address - remove all whitespace
        let walletAddr = row[12] ? String(row[12]).replace(/\s+/g, '').trim() : '';
        
        const student = {
          studentId: row[0] ? String(row[0]).trim() : '',
          name: row[1] ? String(row[1]).trim() : '',
          dob: row[2] ? normalizeDOB(row[2]) : '', // Chuẩn hóa ngày sinh từ Excel
          cccd: row[3] ? String(row[3]).trim() : '',
          phone: row[4] ? String(row[4]).trim() : '',
          email: row[5] ? String(row[5]).trim() : '',
          hometown: row[6] ? String(row[6]).trim() : '',
          class: row[7] ? String(row[7]).trim() : '',
          major: row[8] ? String(row[8]).trim() : '',
          department: row[9] ? String(row[9]).trim() : '',
          school: row[10] ? String(row[10]).trim() : '',
          program: row[11] ? String(row[11]).trim() : '',         // HeDaoTao
          walletAddress: walletAddr,                               // WalletAddress (cleaned)
          khoaHoc: row[13] ? String(row[13]).trim() : ''          // KhoaHoc
        };

        // Debug log for first few rows
        if (i <= 3) {
          console.log(`📋 Dòng ${i}: MSSV=${student.studentId}, Wallet="${student.walletAddress}" (length=${student.walletAddress.length})`);
        }

        // Validate wallet address - must be valid Ethereum address
        if (student.walletAddress) {
          if (!student.walletAddress.startsWith('0x') || student.walletAddress.length !== 42) {
            console.warn(`⚠️ Dòng ${i + 1}: Địa chỉ ví sai format - "${student.walletAddress}" (độ dài: ${student.walletAddress.length})`);
            student.walletAddress = '';
          } else if (typeof web3 !== 'undefined' && web3.utils && !web3.utils.isAddress(student.walletAddress)) {
            console.warn(`⚠️ Dòng ${i + 1}: Địa chỉ ví không hợp lệ - ${student.walletAddress}`);
            student.walletAddress = '';
          }
        }

        // Accept student if has basic required fields (MSSV, Name, WalletAddress)
        if (student.studentId && student.name && student.walletAddress) {
          students.push(student);
        } else if (student.studentId && student.name && !student.walletAddress) {
          console.warn(`⚠️ Dòng ${i + 1}: Thiếu địa chỉ ví cho sinh viên ${student.studentId}`);
        }
      }

      if (students.length === 0) {
        throw new Error('Không tìm thấy dữ liệu sinh viên hợp lệ trong file');
      }

      excelStudentData = students;
      displayExcelPreview(students, expectedHeaders);
      document.getElementById("excelUploadStatus").innerHTML = `<div class="success-box">✅ Đọc file thành công! Tìm thấy ${students.length} sinh viên.</div>`;
    } catch (err) {
      console.error(err);
      document.getElementById("excelUploadStatus").innerHTML = `<div class="error-box">❌ Lỗi đọc file: ${err.message}</div>`;
    }
  };

  if (file.name.endsWith('.csv')) {
    reader.readAsText(file, 'UTF-8');
    reader.onload = function(e) {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        if (lines.length < 2) {
          throw new Error('File CSV phải có ít nhất 2 dòng (header + dữ liệu)');
        }

        const headers = lines[0].split(',').map(h => h.trim());
        const students = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(v => v.trim());
          if (row.length < 2) continue;

          const student = {
            studentId: row[0] || '',
            name: row[1] || '',
            dob: row[2] ? normalizeDOB(row[2]) : '', // Chuẩn hóa ngày sinh từ CSV
            cccd: row[3] || '',
            phone: row[4] || '',
            email: row[5] || '',
            hometown: row[6] || '',
            class: row[7] || '',
            major: row[8] || '',
            department: row[9] || '',
            school: row[10] || '',
            program: row[11] || '',
            walletAddress: row[12] || ''  // Cột 12: Wallet Address
          };

          // Validate wallet address
          if (student.walletAddress && !web3.utils.isAddress(student.walletAddress)) {
            console.warn(`⚠️ Dòng ${i + 1}: Địa chỉ ví không hợp lệ - ${student.walletAddress}`);
            student.walletAddress = '';
          }

          if (student.studentId && student.name && student.walletAddress) {
            students.push(student);
          } else if (student.studentId && student.name && !student.walletAddress) {
            console.warn(`⚠️ Dòng ${i + 1}: Thiếu địa chỉ ví cho sinh viên ${student.studentId}`);
          }
        }

        if (students.length === 0) {
          throw new Error('Không tìm thấy dữ liệu sinh viên hợp lệ trong file CSV');
        }

        excelStudentData = students;
        displayExcelPreview(students, headers);
        document.getElementById("excelUploadStatus").innerHTML = `<div class="success-box">✅ Đọc file CSV thành công! Tìm thấy ${students.length} sinh viên.</div>`;
      } catch (err) {
        console.error(err);
        document.getElementById("excelUploadStatus").innerHTML = `<div class="error-box">❌ Lỗi đọc CSV: ${err.message}</div>`;
      }
    };
  } else {
    reader.readAsArrayBuffer(file);
  }
}

function displayExcelPreview(students, headers) {
  document.getElementById("excelPreviewSection").style.display = 'block';
  document.getElementById("excelPreviewStats").innerHTML = `
    <div class="info-box">
      <strong>📊 Thống kê:</strong> ${students.length} sinh viên<br>
      <strong>Các lớp:</strong> ${[...new Set(students.map(s => s.class).filter(c => c))].join(', ')}
    </div>
  `;

  let headerHtml = '<tr>';
  ['MSSV', 'Họ tên', 'Ngày sinh', 'CCCD', 'SĐT', 'Email', 'Quê quán', 'Lớp', 'Ngành', 'Khoa', 'Trường', 'Địa chỉ ví'].forEach(h => {
    headerHtml += `<th style="padding: 10px; background: #667eea; color: white; border: 1px solid #ddd;">${h}</th>`;
  });
  headerHtml += '</tr>';
  document.getElementById("excelPreviewHeader").innerHTML = headerHtml;

  let bodyHtml = '';
  students.slice(0, 10).forEach((s, index) => {
    const walletShort = s.walletAddress ? 
      (s.walletAddress.substring(0, 6) + '...' + s.walletAddress.substring(38)) : 
      '<span style="color: #999;">Thiếu</span>';
    
    bodyHtml += `<tr style="background: ${index % 2 === 0 ? '#f8f9fa' : 'white'};">`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.studentId}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.name}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.dob}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.cccd}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.phone}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.email}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.hometown}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.class}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.major}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.department}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${s.school}</td>`;
    bodyHtml += `<td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-size: 10px;" title="${s.walletAddress}">${walletShort}</td>`;
    bodyHtml += '</tr>';
  });

  if (students.length > 10) {
    bodyHtml += `<tr><td colspan="12" style="padding: 10px; text-align: center; font-style: italic;">... và ${students.length - 10} sinh viên khác</td></tr>`;
  }

  document.getElementById("excelPreviewBody").innerHTML = bodyHtml;
}

async function submitExcelStudents() {
  if (!contract || !currentAccount) {
    document.getElementById("excelSubmitResult").innerHTML = '<div class="error-box">❌ Chưa kết nối MetaMask!</div>';
    return;
  }

  if (!excelStudentData || excelStudentData.length === 0) {
    document.getElementById("excelSubmitResult").innerHTML = '<div class="error-box">❌ Không có dữ liệu để submit!</div>';
    return;
  }

  try {
    document.getElementById("excelSubmitResult").innerHTML = '<div class="info-box">⏳ Đang chuẩn bị đăng ký hàng loạt...</div>';

    // Lọc sinh viên chưa đăng ký
    const studentsToRegister = [];
    const alreadyRegistered = [];
    
    for (let i = 0; i < excelStudentData.length; i++) {
      const student = excelStudentData[i];
      try {
        const studentInfo = await contract.methods.getStudentInfo(student.studentId).call();
        if (studentInfo.exists) {
          alreadyRegistered.push(`⚠️ ${student.name} (${student.studentId})`);
        } else {
          studentsToRegister.push(student);
        }
      } catch (err) {
        studentsToRegister.push(student);
      }
      
      // Hiển thị progress kiểm tra
      document.getElementById("excelSubmitResult").innerHTML = `
        <div class="info-box">
          <h3>🔍 Đang kiểm tra sinh viên... (${i + 1}/${excelStudentData.length})</h3>
        </div>
      `;
    }

    if (studentsToRegister.length === 0) {
      let html = '<div class="warning-box"><h3>⚠️ Tất cả sinh viên đã được đăng ký</h3><ul>';
      alreadyRegistered.forEach(s => { html += `<li>${s}</li>`; });
      html += '</ul></div>';
      document.getElementById("excelSubmitResult").innerHTML = html;
      return;
    }

    // Chuẩn bị dữ liệu cho batch registration
    const studentIds = [];
    const names = [];
    const dobs = [];
    const cccds = [];
    const phones = [];
    const emails = [];
    const hometowns = [];
    const classes = [];
    const majors = [];
    const majorCodes = [];
    const departments = [];
    const schools = [];
    const programs = [];
    const walletAddresses = [];

    for (const student of studentsToRegister) {
      studentIds.push(student.studentId);
      names.push(student.name);
      dobs.push(student.dob);
      cccds.push(student.cccd);
      phones.push(student.phone);
      emails.push(student.email);
      hometowns.push(student.hometown);
      classes.push(student.class);
      majors.push(student.major);
      majorCodes.push(student.khoaHoc || '');
      departments.push(student.department);
      schools.push(student.school);
      programs.push(student.program || '');
      walletAddresses.push(student.walletAddress);
    }

    document.getElementById("excelSubmitResult").innerHTML = `
      <div class="info-box">
        <h3>🔐 Đang đăng ký ${studentsToRegister.length} sinh viên...</h3>
        <p>💡 <strong>GỘP VÀO MỘT TRANSACTION DUY NHẤT</strong></p>
        <p>Vui lòng xác nhận transaction trong MetaMask...</p>
      </div>
    `;

    // GỌI BATCH FUNCTION - CHỈ MỘT TRANSACTION DUY NHẤT!
    const tx = await contract.methods.batchRegisterStudents(
      studentIds,
      names,
      dobs,
      cccds,
      phones,
      emails,
      hometowns,
      classes,
      majors,
      majorCodes,
      departments,
      schools,
      programs,
      walletAddresses
    ).send({
      from: currentAccount,
      gas: 3000000 + (studentsToRegister.length * 500000) // Dynamic gas
    });

    console.log("✅ Batch registration transaction:", tx);

    // Lưu vào registered students
    studentsToRegister.forEach(student => {
      registeredStudents.push({
        ...student,
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        timestamp: new Date().toISOString()
      });
    });

    localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));

    // Hiển thị kết quả
    let html = `
      <div class="success-box">
        <h3>✅ Đăng ký hàng loạt thành công!</h3>
        <p><strong>📊 Thống kê:</strong></p>
        <ul style="margin-left: 20px;">
          <li>✅ Đã đăng ký: <strong>${studentsToRegister.length}</strong> sinh viên</li>
          ${alreadyRegistered.length > 0 ? `<li>⚠️ Đã tồn tại: <strong>${alreadyRegistered.length}</strong> sinh viên</li>` : ''}
          <li>🔗 Transaction Hash: <code>${tx.transactionHash}</code></li>
          <li>📦 Block Number: <strong>${tx.blockNumber}</strong></li>
        </ul>
        
        <h4 style="margin-top: 15px;">📋 Danh sách đã đăng ký:</h4>
        <ul style="max-height: 300px; overflow-y: auto; background: white; padding: 10px; border-radius: 5px;">`;
    
    studentsToRegister.forEach(s => {
      html += `<li>✅ ${s.name} (${s.studentId}) - ${s.class}</li>`;
    });
    
    html += '</ul>';
    
    if (alreadyRegistered.length > 0) {
      html += '<h4 style="margin-top: 15px;">⚠️ Sinh viên đã tồn tại (bỏ qua):</h4>';
      html += '<ul style="max-height: 200px; overflow-y: auto; background: white; padding: 10px; border-radius: 5px;">';
      alreadyRegistered.forEach(s => {
        html += `<li>${s}</li>`;
      });
      html += '</ul>';
    }
    
    html += '</div>';
    document.getElementById("excelSubmitResult").innerHTML = html;

  } catch (err) {
    console.error(err);
    document.getElementById("excelSubmitResult").innerHTML = `
      <div class="error-box">
        <h3>❌ Lỗi khi đăng ký hàng loạt</h3>
        <p>${err.message}</p>
        <p style="margin-top: 10px; font-size: 12px;">
          <strong>💡 Gợi ý:</strong><br>
          • Kiểm tra tất cả sinh viên có Class đã gán vào Program chưa<br>
          • Kiểm tra wallet address có hợp lệ không<br>
          • Kiểm tra không có MSSV trùng lặp trong file Excel
        </p>
      </div>
    `;
  }
}

function clearExcelUpload() {
  document.getElementById("excelFileStudents").value = '';
  document.getElementById("excelStudentsFileName").textContent = 'Chưa chọn file';
  document.getElementById("excelUploadStatus").innerHTML = '';
  document.getElementById("excelPreviewSection").style.display = 'none';
  document.getElementById("excelSubmitResult").innerHTML = '';
  excelStudentData = null;
}

// ========== DEAN MANAGEMENT ==========

// Thêm Dean (lưu trên blockchain)
async function addDean() {
  if (!contract || !currentAccount) {
    document.getElementById("deanAddStatus").innerHTML = '<div class="error-box">❌ Chưa kết nối MetaMask!</div>';
    return;
  }

  const address = document.getElementById("deanAddress").value.trim();
  const name = document.getElementById("deanName").value.trim();
  const department = document.getElementById("deanDepartment").value.trim();
  const email = document.getElementById("deanEmail").value.trim();
  const phone = document.getElementById("deanPhone").value.trim();
  const notes = document.getElementById("deanNotes").value.trim();

  if (!address || !name || !department) {
    document.getElementById("deanAddStatus").innerHTML = '<div class="error-box">❌ Vui lòng nhập đầy đủ: Địa chỉ ví, Họ tên, Tên khoa!</div>';
    return;
  }

  // Validate địa chỉ Ethereum
  if (!web3.utils.isAddress(address)) {
    document.getElementById("deanAddStatus").innerHTML = '<div class="error-box">❌ Địa chỉ ví không hợp lệ!</div>';
    return;
  }

  document.getElementById("deanAddStatus").innerHTML = '<div class="info-box">⏳ Đang kiểm tra trên blockchain...</div>';

  try {
    // Kiểm tra xem địa chỉ đã là Dean chưa
    const isAlreadyDean = await contract.methods.isDean(address).call();
    if (isAlreadyDean) {
      document.getElementById("deanAddStatus").innerHTML = '<div class="error-box">❌ Địa chỉ này đã là Cán bộ quản lý điểm rồi!</div>';
      return;
    }

    document.getElementById("deanAddStatus").innerHTML = '<div class="info-box">⏳ Đang lưu thông tin Dean lên blockchain...</div>';

    // Gọi addDeanWithInfo() - LƯU TOÀN BỘ THÔNG TIN LÊN BLOCKCHAIN
    const tx = await contract.methods.addDeanWithInfo(
      address,
      name,
      department,
      email || '',
      phone || '',
      notes || ''
    ).send({ 
      from: currentAccount,
      gas: 500000
    });

    console.log("✅ Dean added on blockchain:", tx);

    document.getElementById("deanAddStatus").innerHTML = `
      <div class="success-box">
        ✅ <strong>Đã thêm Cán bộ quản lý điểm thành công!</strong><br>
        - Tên: ${name}<br>
        - Khoa: ${department}<br>
        - Địa chỉ ví: ${address}<br>
        - <strong>📍 Tất cả thông tin đã được lưu trên blockchain</strong><br>
        - Transaction Hash: ${tx.transactionHash}
      </div>
    `;

    clearDeanForm();
    loadDeanList();

  } catch (err) {
    console.error(err);
    document.getElementById("deanAddStatus").innerHTML = `<div class="error-box">❌ Lỗi: ${err.message}</div>`;
  }
}

// Xóa quyền Dean
async function removeDean(address) {
  if (!contract || !currentAccount) {
    alert('❌ Chưa kết nối MetaMask!');
    return;
  }

  if (!confirm(`Bạn có chắc muốn xóa quyền Dean của địa chỉ:\n${address}?`)) {
    return;
  }

  try {
    // Gọi removeDean() trên blockchain
    const tx = await contract.methods.removeDean(address).send({ 
      from: currentAccount,
      gas: 200000
    });

    console.log("✅ Dean removed on blockchain:", tx);

    alert('✅ Đã xóa quyền Dean thành công!');
    loadDeanList();

  } catch (err) {
    console.error(err);
    alert('❌ Lỗi: ' + err.message);
  }
}

// Load danh sách Dean từ blockchain
async function loadDeanList() {
  const listDiv = document.getElementById("deanList");
  
  if (!contract) {
    listDiv.innerHTML = '<div class="warning-box">⚠️ Chưa kết nối contract!</div>';
    return;
  }

  listDiv.innerHTML = '<div class="info-box">⏳ Đang tải danh sách từ blockchain...</div>';

  try {
    // Gọi getAllActiveDeans() để lấy danh sách Dean đang active
    const activeDeanAddresses = await contract.methods.getAllActiveDeans().call();

    if (activeDeanAddresses.length === 0) {
      listDiv.innerHTML = '<div class="info-box">Chưa có Cán bộ quản lý điểm nào.</div>';
      return;
    }

    let html = `<div style="font-weight: 600; margin-bottom: 10px;">Tổng số: ${activeDeanAddresses.length} Cán bộ quản lý điểm</div>`;

    // Lấy thông tin chi tiết của từng Dean
    for (const address of activeDeanAddresses) {
      try {
        const deanInfo = await contract.methods.getDeanInfo(address).call();
        
        // deanInfo returns: name, department, email, phone, notes, addedAt, addedBy, isActive
        const name = deanInfo[0] || 'Chưa có thông tin';
        const department = deanInfo[1] || '...';
        const email = deanInfo[2];
        const phone = deanInfo[3];
        const notes = deanInfo[4];
        const addedAt = deanInfo[5];
        const addedBy = deanInfo[6];
        
        // Convert timestamp to date
        const addedDate = new Date(addedAt * 1000).toLocaleString('vi-VN');
        
        html += `
          <div class="student-item" style="border-left-color: #28a745;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="flex: 1;">
                <strong style="font-size: 16px;">👨‍🏫 ${name}</strong>
                <span style="color: #28a745; font-weight: 600; margin-left: 10px;">✅ Active</span>
                <br>
                <strong>Khoa:</strong> ${department}<br>
                <strong>Địa chỉ ví:</strong> <code>${address}</code><br>
                ${email ? `<strong>Email:</strong> ${email}<br>` : ''}
                ${phone ? `<strong>SĐT:</strong> ${phone}<br>` : ''}
                ${notes ? `<strong>Ghi chú:</strong> ${notes}<br>` : ''}
                <small style="color: #666;">
                  Thêm lúc: ${addedDate} | Bởi: ${addedBy.substring(0, 10)}...
                </small>
                <br>
                <small style="color: #28a745; font-weight: 600;">📍 Dữ liệu từ blockchain</small>
              </div>
              <div>
                <button class="danger" onclick="removeDean('${address}')" style="margin: 0;">🗑️ Xóa quyền</button>
              </div>
            </div>
          </div>
        `;
      } catch (err) {
        console.error(`Error loading dean info for ${address}:`, err);
        html += `
          <div class="student-item" style="border-left-color: #dc3545;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="flex: 1;">
                <strong style="font-size: 16px;">⚠️ Lỗi tải thông tin</strong>
                <br>
                <strong>Địa chỉ ví:</strong> <code>${address}</code><br>
                <small style="color: #dc3545;">Không thể tải thông tin chi tiết</small>
              </div>
              <div>
                <button class="danger" onclick="removeDean('${address}')" style="margin: 0;">🗑️ Xóa quyền</button>
              </div>
            </div>
          </div>
        `;
      }
    }

    listDiv.innerHTML = html;

  } catch (err) {
    console.error("Error loading dean list:", err);
    listDiv.innerHTML = `<div class="error-box">❌ Lỗi khi tải danh sách: ${err.message}</div>`;
  }
}

// Clear form Dean
function clearDeanForm() {
  document.getElementById("deanAddress").value = '';
  document.getElementById("deanName").value = '';
  document.getElementById("deanDepartment").value = '';
  document.getElementById("deanEmail").value = '';
  document.getElementById("deanPhone").value = '';
  document.getElementById("deanNotes").value = '';
}

// Init
window.addEventListener("load", () => {
  document.getElementById("btnConnect").addEventListener("click", connectMetaMask);
  
  const saved = localStorage.getItem('registeredStudents');
  if (saved) {
    registeredStudents = JSON.parse(saved);
  }
});
