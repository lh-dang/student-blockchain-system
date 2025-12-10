// ========================================
// VERIFY DIPLOMA - BLOCKCHAIN VERIFICATION
// Dành cho doanh nghiệp xác thực bằng tốt nghiệp
// ========================================

// Contract configuration
const contractAddress = "0x0e068999591e59D0eAbff3491E2CD449B2B7D9f2";
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"department","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DeanInfoAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"diplomaHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaIssued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"address","name":"revokedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"approvedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"rejectedBy","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"applicationHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":true,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"programName","type":"string"},{"indexed":false,"internalType":"uint256","name":"minCredits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minGPA","type":"uint256"},{"indexed":false,"internalType":"address","name":"createdBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"semester","type":"string"},{"indexed":false,"internalType":"uint256","name":"courseCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"address","name":"submittedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"SemesterGradesSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentAssignedToProgram","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentInfoUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentRegistered","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allDeanAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allProgramIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allStudentIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"classToProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deans","outputs":[{"internalType":"address","name":"deanAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"diplomaIssuedStudents","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"diplomas","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"electiveGroups","outputs":[{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"graduationApplicants","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"graduationApplications","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDean","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programCourses","outputs":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programElectiveGroupIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"programs","outputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"address","name":"createdBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"semesterGrades","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"submittedAt","type":"uint256"},{"internalType":"address","name":"submittedBy","type":"address"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentIdExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"studentSemesters","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"students","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletToStudentId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"addDeanWithInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getDeanInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getAllActiveDeans","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDeans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"setDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"registerStudent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"updateStudentInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"string[]","name":"dobs","type":"string[]"},{"internalType":"string[]","name":"cccds","type":"string[]"},{"internalType":"string[]","name":"phones","type":"string[]"},{"internalType":"string[]","name":"emails","type":"string[]"},{"internalType":"string[]","name":"hometowns","type":"string[]"},{"internalType":"string[]","name":"classes","type":"string[]"},{"internalType":"string[]","name":"majors","type":"string[]"},{"internalType":"string[]","name":"majorCodes","type":"string[]"},{"internalType":"string[]","name":"departments","type":"string[]"},{"internalType":"string[]","name":"schools","type":"string[]"},{"internalType":"string[]","name":"programsArray","type":"string[]"},{"internalType":"address[]","name":"walletAddresses","type":"address[]"}],"name":"batchRegisterStudents","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"uint16[]","name":"grades","type":"uint16[]"},{"internalType":"string[]","name":"letterGrades","type":"string[]"},{"internalType":"string[]","name":"instructors","type":"string[]"}],"name":"submitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"semesters","type":"string[]"},{"internalType":"string[][]","name":"courseIdsArray","type":"string[][]"},{"internalType":"string[][]","name":"courseNamesArray","type":"string[][]"},{"internalType":"uint8[][]","name":"creditsArray","type":"uint8[][]"},{"internalType":"uint16[][]","name":"gradesArray","type":"uint16[][]"},{"internalType":"string[][]","name":"letterGradesArray","type":"string[][]"},{"internalType":"string[][]","name":"instructorsArray","type":"string[][]"}],"name":"batchSubmitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentInfo","outputs":[{"components":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct StudentManagement.StudentInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentSemesters","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterGrades","outputs":[{"internalType":"string","name":"","type":"string"},{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade[]","name":"","type":"tuple[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterCourseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getCourseGrade","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalStudents","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStudentIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"}],"name":"createProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"}],"name":"addCoursesToProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"string[]","name":"courseIds","type":"string[]"}],"name":"addElectiveGroup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupNames","type":"string[]"},{"internalType":"uint8[]","name":"electiveRequiredCredits","type":"uint8[]"},{"internalType":"uint256[]","name":"electiveGroupCourseStartIdx","type":"uint256[]"},{"internalType":"uint256[]","name":"electiveGroupCourseCount","type":"uint256[]"}],"name":"createProgramComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"}],"name":"updateProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"className","type":"string"}],"name":"setProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"classNames","type":"string[]"}],"name":"batchSetProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgram","outputs":[{"internalType":"string","name":"_programName","type":"string"},{"internalType":"uint256","name":"_totalCredits","type":"uint256"},{"internalType":"uint256","name":"_minCredits","type":"uint256"},{"internalType":"uint256","name":"_minGPA","type":"uint256"},{"internalType":"uint256","name":"_courseCount","type":"uint256"},{"internalType":"bool","name":"_isActive","type":"bool"},{"internalType":"uint256","name":"_createdAt","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramCourses","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"string[]","name":"prerequisites","type":"string[]"},{"internalType":"string[]","name":"corequisites","type":"string[]"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"internalType":"struct StudentManagement.ProgramCourse[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"courseId","type":"string"}],"name":"getProgramCourse","outputs":[{"internalType":"string","name":"_courseId","type":"string"},{"internalType":"string","name":"_courseName","type":"string"},{"internalType":"uint256","name":"_credits","type":"uint256"},{"internalType":"bool","name":"_isRequired","type":"bool"},{"internalType":"string[]","name":"_prerequisites","type":"string[]"},{"internalType":"string[]","name":"_corequisites","type":"string[]"},{"internalType":"uint256","name":"_minCreditsRequired","type":"uint256"},{"internalType":"string","name":"_groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"}],"name":"getElectiveGroup","outputs":[{"internalType":"string","name":"_groupId","type":"string"},{"internalType":"string","name":"_groupName","type":"string"},{"internalType":"uint256","name":"_requiredCredits","type":"uint256"},{"internalType":"string[]","name":"_courseIds","type":"string[]"},{"internalType":"bool","name":"_exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramElectiveGroupIds","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalPrograms","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getProgramIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"className","type":"string"}],"name":"getProgramByClass","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"mintDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"submitGraduationApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"approveGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"rejectGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getGraduationApplication","outputs":[{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notesStr","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalGraduationApplications","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getGraduationApplicantByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"}],"name":"verifyDiploma","outputs":[{"internalType":"bool","name":"valid","type":"bool"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiploma","outputs":[{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"revokeDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"hasDiploma","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"isDiplomaRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiplomaRevokeInfo","outputs":[{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"address","name":"revokedBy","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDiplomasIssued","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getStudentIdByWallet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"address","name":"wallet","type":"address"}],"name":"verifyStudentWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true}];

let web3;
let contract;

// ====== INIT ======
window.addEventListener('load', async () => {
  await connectToBlockchain();
  
  // Kiểm tra URL parameters từ QR code
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('studentId');
  const hash = urlParams.get('hash');
  
  if (studentId && hash) {
    console.log('🔍 Auto-verifying from QR code...');
    console.log('  Student ID:', studentId);
    console.log('  Hash:', hash);
    
    // Tự động điền thông tin
    document.getElementById('studentIdInput').value = studentId;
    document.getElementById('autoVerifyNotice').style.display = 'block';
    
    // Tự động xác thực
    setTimeout(() => {
      verifyDiplomaByStudentId(studentId, hash);
    }, 500);
  }
});

// ====== CONNECT TO BLOCKCHAIN ======
async function connectToBlockchain() {
  try {
    // Kết nối đến Ganache
    web3 = new Web3('http://localhost:8545');
    contract = new web3.eth.Contract(contractABI, contractAddress);
    
    // Kiểm tra kết nối
    const networkId = await web3.eth.net.getId();
    console.log('✅ Connected to network:', networkId);
    
    document.getElementById('networkStatus').textContent = '✅ Đã kết nối (Ganache)';
    document.getElementById('contractAddress').textContent = contractAddress;
    
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    document.getElementById('networkStatus').innerHTML = '❌ <span style="color: #dc3545;">Lỗi kết nối</span>';
    alert('⚠️ Không thể kết nối blockchain. Vui lòng kiểm tra Ganache đang chạy!');
    return false;
  }
}

// ====== VERIFY BY STUDENT ID (New Simple Method) ======
async function verifyDiplomaByStudentId(studentId, expectedHash = null) {
  const resultDiv = document.getElementById('verificationResult');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="result-card">
      <div class="spinner"></div>
      <p style="text-align: center; margin-top: 20px; color: #666;">
        Đang truy vấn thông tin từ blockchain...
      </p>
    </div>
  `;
  
  try {
    console.log('🔍 Fetching diploma for student:', studentId);
    
    // Lấy thông tin diploma từ blockchain
    const diploma = await contract.methods.getDiploma(studentId).call();
    
    if (!diploma.exists) {
      resultDiv.innerHTML = `
        <div class="error-box">
          <h2 style="margin-bottom: 15px;">❌ Không tìm thấy bằng tốt nghiệp</h2>
          <p style="font-size: 16px; margin-bottom: 10px;">
            MSSV <strong>${studentId}</strong> chưa có bằng tốt nghiệp trên blockchain.
          </p>
          <div class="badge badge-danger" style="font-size: 14px;">
            ✗ NOT FOUND
          </div>
        </div>
        
        <div class="warning-box" style="margin-top: 20px;">
          <h4 style="margin-bottom: 10px;">⚠️ Các nguyên nhân có thể:</h4>
          <ul style="margin-left: 20px; line-height: 1.8;">
            <li><strong>MSSV sai:</strong> Vui lòng kiểm tra lại mã số sinh viên</li>
            <li><strong>Chưa mint:</strong> Sinh viên chưa thực hiện mint bằng tốt nghiệp</li>
            <li><strong>Chưa đủ điều kiện:</strong> Sinh viên chưa đáp ứng yêu cầu tốt nghiệp</li>
          </ul>
        </div>
      `;
      return;
    }
    
    // Kiểm tra nếu bằng đã bị thu hồi
    if (diploma.revoked) {
      const revokedDate = new Date(diploma.revokedAt * 1000).toLocaleString('vi-VN');
      const studentInfo = await contract.methods.getStudentInfo(studentId).call();
      
      resultDiv.innerHTML = `
        <div style="background: #f8d7da; border: 3px solid #dc3545; border-radius: 10px; padding: 30px; box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);">
          <div style="text-align: center;">
            <h2 style="color: #721c24; font-size: 28px; margin-bottom: 20px;">🚫 BẰNG TỐT NGHIỆP ĐÃ BỊ THU HỒI</h2>
            <div class="badge badge-danger" style="display: inline-block; padding: 12px 30px; background: #721c24; color: white; border-radius: 20px; font-size: 18px; font-weight: 700; margin-bottom: 20px;">
              ⚠️ REVOKED - KHÔNG CÒN HIỆU LỰC
            </div>
          </div>
          
          <div class="warning-box" style="margin-top: 25px;">
            <h3 style="color: #856404; margin-bottom: 15px;">⚠️ CẢNH BÁO QUAN TRỌNG:</h3>
            <p style="color: #856404; font-size: 16px; line-height: 1.6;">
              Bằng tốt nghiệp này đã bị thu hồi bởi nhà trường và <strong>KHÔNG CÒN GIÁ TRỊ PHÁP LÝ</strong>.<br>
              Mọi sử dụng hoặc xuất trình bằng này đều <strong>KHÔNG ĐƯỢC CÔNG NHẬN</strong>.
            </p>
          </div>
          
          <div class="result-card" style="margin-top: 25px;">
            <h3 style="color: #721c24; margin-bottom: 15px;">📋 Thông tin bằng đã bị thu hồi:</h3>
            <table>
              <tr><th>Họ tên</th><td>${studentInfo.name}</td></tr>
              <tr><th>MSSV</th><td>${studentId}</td></tr>
              <tr><th>Ngày sinh</th><td>${studentInfo.dob}</td></tr>
              <tr><th>Ngành</th><td>${studentInfo.major}</td></tr>
              <tr><th>Xếp loại</th><td>${diploma.classification}</td></tr>
              <tr><th>GPA</th><td>${(diploma.gpa / 100).toFixed(2)} / 4.0</td></tr>
              <tr><th>Tín chỉ</th><td>${diploma.totalCredits} TC</td></tr>
              <tr><th>Ngày cấp</th><td>${new Date(diploma.issuedAt * 1000).toLocaleDateString('vi-VN')}</td></tr>
              <tr style="background: #fff3cd;"><th>⚠️ Thời gian thu hồi</th><td style="color: #856404; font-weight: 700;">${revokedDate}</td></tr>
              <tr style="background: #fff3cd;"><th>⚠️ Lý do thu hồi</th><td style="color: #856404; font-weight: 700;">${diploma.revokedReason || 'Không có lý do cụ thể'}</td></tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding: 20px; background: #721c24; color: white; border-radius: 8px;">
            <h3 style="margin-bottom: 10px;">⚠️ KHUYẾN CÁO</h3>
            <p style="font-size: 14px; line-height: 1.6;">
              Nếu bạn đang tuyển dụng ứng viên này, vui lòng <strong>KHÔNG CHẤP NHẬN</strong> bằng tốt nghiệp này.<br>
              Liên hệ với nhà trường để biết thêm thông tin chi tiết.
            </p>
          </div>
        </div>
      `;
      return;
    }
    
    // Kiểm tra hash nếu có
    if (expectedHash && diploma.diplomaHash !== expectedHash) {
      resultDiv.innerHTML = `
        <div class="error-box">
          <h2>❌ Hash không khớp</h2>
          <p style="margin-top: 10px;">Bằng tốt nghiệp có thể đã bị chỉnh sửa!</p>
        </div>
        <div class="result-card">
          <table>
            <tr>
              <th>Hash on Blockchain</th>
              <td><code style="font-size: 11px; word-break: break-all;">${diploma.diplomaHash}</code></td>
            </tr>
            <tr style="background: #f8d7da;">
              <th>Hash from QR Code</th>
              <td><code style="font-size: 11px; word-break: break-all;">${expectedHash}</code></td>
            </tr>
          </table>
        </div>
      `;
      return;
    }
    
    // Lấy thông tin sinh viên
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    
    // Hiển thị bằng tốt nghiệp
    displayDiplomaCertificate(studentInfo, diploma);
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    resultDiv.innerHTML = `
      <div class="error-box">
        <h3>❌ Lỗi xác thực</h3>
        <p style="margin-top: 10px;">${error.message}</p>
      </div>
    `;
  }
}

// ====== VERIFY DIPLOMA (Main Entry Point) ======
async function verifyDiploma() {
  const studentId = document.getElementById('studentIdInput').value.trim();
  
  if (!studentId) {
    alert('❌ Vui lòng nhập MSSV!');
    return;
  }
  
  // Sử dụng method mới đơn giản hơn
  await verifyDiplomaByStudentId(studentId);
}

// ====== DISPLAY DIPLOMA CERTIFICATE (Beautiful & Official) ======
function displayDiplomaCertificate(studentInfo, diploma) {
  const resultDiv = document.getElementById('verificationResult');
  
  const issuedDate = new Date(diploma.issuedAt * 1000);
  const gpa4 = (diploma.gpa / 100).toFixed(2);
  const gpa10 = (gpa4 * 2.5).toFixed(2);
  
  // Chuyển đổi classification sang tiếng Anh
  const classificationEn = {
    'Xuất sắc': 'Excellent',
    'Giỏi': 'Very Good', 
    'Khá': 'Good',
    'Trung bình': 'Fair'
  }[diploma.classification] || diploma.classification;
  
  const html = `
    <!-- Verification Badge -->
    <div class="success-box" style="text-align: center;">
      <h2 style="margin-bottom: 15px; font-size: 24px;">✅ BẰNG TỐT NGHIỆP XÁC THỰC THÀNH CÔNG</h2>
      <div class="badge badge-success" style="display: inline-block; padding: 8px 20px; background: #d4edda; color: #155724; border: 1px solid #28a745; border-radius: 15px; font-size: 16px; font-weight: 600;">
        ✓ VERIFIED ON BLOCKCHAIN
      </div>
      <p style="margin-top: 15px; font-size: 14px; color: #155724;">
        Bằng tốt nghiệp này đã được xác thực trên Blockchain.<br>
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
                  <div style="font-size: 15px; margin-bottom: 15px;">Major: <strong>${studentInfo.major || 'Information Technology'}</strong></div>
                  
                  <div style="font-style: italic; font-size: 14px; color: #555; margin-bottom: 5px;">Upon:</div>
                  <div style="font-family: 'Cinzel', serif; font-size: 26px; font-weight: 700; text-transform: uppercase; color: #2c3e50; margin-bottom: 20px; letter-spacing: 1px;">
                    ${studentInfo.name}
                  </div>
                  
                  <div style="width: 100%; font-size: 14px; line-height: 1.6; text-align: left; padding: 0 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Date of birth:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${studentInfo.dob}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Classification:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${classificationEn}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Year of graduation:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${issuedDate.getFullYear()}</span>
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
                  <div style="font-size: 15px; margin-bottom: 15px;">Ngành: <strong>${studentInfo.major || 'Công nghệ Thông tin'}</strong></div>
                  
                  <div style="font-style: italic; font-size: 14px; color: #555; margin-bottom: 5px;">Cho ${studentInfo.name.toLowerCase().includes('nữ') || studentInfo.name.toLowerCase().includes('thị') ? 'bà' : 'ông'}:</div>
                  <div style="font-family: 'Cinzel', serif; font-size: 26px; font-weight: 700; text-transform: uppercase; color: #2c3e50; margin-bottom: 20px; letter-spacing: 1px;">
                    ${studentInfo.name}
                  </div>
                  
                  <div style="width: 100%; font-size: 14px; line-height: 1.6; text-align: left; padding: 0 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Sinh ngày:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${studentInfo.dob}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Hạng tốt nghiệp:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${diploma.classification}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="white-space: nowrap;">Năm tốt nghiệp:</span>
                      <span style="flex-grow: 1; border-bottom: 1px dotted #aaa; margin: 0 5px; position: relative; top: -5px;"></span>
                      <span style="font-weight: 700; white-space: nowrap;">${issuedDate.getFullYear()}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="flex: 0 0 auto; margin-top: 10px;">
                  <div style="font-style: italic; font-size: 13px; text-align: right; margin-bottom: 10px;">Cần Thơ, ${issuedDate.toLocaleDateString('vi-VN')}</div>
                  <div style="font-weight: 700; text-transform: uppercase; font-size: 13px; color: #003366;">Hiệu Trưởng</div>
                  <div style="font-style: italic; font-size: 10px; color: #666; margin-bottom: 60px;">(Ký, ghi rõ họ tên và đóng dấu)</div>
                  <div style="font-weight: 700; font-size: 14px; margin-top: 10px;">GS. TS. Hà Thanh Toàn</div>
                  
                  <div style="text-align: left; font-size: 10px; margin-top: 20px; color: #444; border-top: 1px solid #eee; padding-top: 5px;">
                    Số hiệu: <b style="color: #b71c1c;">${studentInfo.studentId}_${issuedDate.getFullYear()}</b><br>
                    Số vào sổ cấp văn bằng: <b>${issuedDate.getFullYear()}/CTU/${studentInfo.studentId.substring(1)}</b>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Blockchain Technical Details -->
    <div class="result-card">
      <h3 style="color: #667eea; margin-bottom: 20px; text-align: center;">
        🔐 Thông tin Blockchain Verification
      </h3>
      <table>
        <tr>
          <th style="width: 35%;">Thông tin kỹ thuật</th>
          <th>Giá trị</th>
        </tr>
        <tr>
          <td><strong>SHA256 Hash</strong></td>
          <td><code style="font-size: 11px; word-break: break-all; background: #f0f0f0; padding: 5px; border-radius: 3px;">${diploma.diplomaHash}</code></td>
        </tr>
        <tr>
          <td><strong>Smart Contract</strong></td>
          <td><code style="font-size: 11px; background: #f0f0f0; padding: 5px; border-radius: 3px;">${contractAddress}</code></td>
        </tr>
        <tr>
          <td><strong>Timestamp</strong></td>
          <td>${issuedDate.toLocaleString('vi-VN')}</td>
        </tr>
        <tr>
          <td><strong>Block Time</strong></td>
          <td>${diploma.issuedAt}</td>
        </tr>
        <tr>
          <td><strong>Verification Status</strong></td>
          <td><span style="color: #28a745; font-weight: 700;">✓ VERIFIED</span></td>
        </tr>
      </table>
    </div>
    
    <!-- Employer Notice -->
    <div class="info-box" style="margin-top: 20px;">
      <h4 style="margin-bottom: 10px;">💼 Thông báo cho nhà tuyển dụng</h4>
      <ul style="margin-left: 20px; line-height: 1.8;">
        <li><strong>Bằng chính thức:</strong> Đây là bằng tốt nghiệp được ghi nhận trên blockchain công nghệ cao</li>
        <li><strong>Không thể giả mạo:</strong> Mọi thông tin đã được mã hóa và lưu trữ permanent</li>
        <li><strong>Đã xác thực:</strong> Hệ thống đã kiểm tra và xác nhận tính hợp lệ 100%</li>
        <li><strong>Liên hệ trường:</strong> Có thể liên hệ ${studentInfo.school} để xác nhận thêm nếu cần</li>
      </ul>
      
      <div style="margin-top: 20px; text-align: center;">
        <button onclick="viewAcademicRecord('${studentInfo.studentId}')" style="background: #17a2b8; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 600; margin: 5px;">
          📊 Xem quá trình học tập
        </button>
      </div>
    </div>
  `;
  
  resultDiv.innerHTML = html;
}

// ====== RESET FORM ======
function resetForm() {
  document.getElementById('studentIdInput').value = '';
  document.getElementById('verificationResult').style.display = 'none';
  document.getElementById('autoVerifyNotice').style.display = 'none';
  
  // Xóa URL parameters
  window.history.replaceState({}, document.title, window.location.pathname);
  
  console.log('🔄 Form reset');
}

// ====== XEM QUÁ TRÌNH HỌC TẬP (GIỐNG STUDENT.JS) ======
async function viewAcademicRecord(studentId) {
  const resultDiv = document.getElementById('verificationResult');
  
  try {
    resultDiv.innerHTML = `
      <div class="result-card">
        <div class="spinner"></div>
        <p style="text-align: center; margin-top: 20px; color: #666;">
          Đang tải quá trình học tập từ blockchain...
        </p>
      </div>
    `;
    
    console.log('📚 Loading academic record for:', studentId);
    
    // Get student info
    const studentInfo = await contract.methods.getStudentInfo(studentId).call();
    const semesters = await contract.methods.getStudentSemesters(studentId).call();
    
    if (!semesters || semesters.length === 0) {
      resultDiv.innerHTML = `
        <div class="warning-box">
          <h2>⚠️ Chưa có dữ liệu học tập</h2>
          <p>Sinh viên <strong>${studentId}</strong> chưa có điểm học tập nào được ghi nhận.</p>
        </div>
      `;
      return;
    }
    
    // Load all grades from all semesters
    let allGrades = [];
    let semesterDetails = [];
    
    for (let semester of semesters) {
      const gradeData = await contract.methods.getSemesterGrades(studentId, semester).call();
      const courses = gradeData[1]; // CourseGrade[]
      
      const semesterGrades = courses.map(course => ({
        semester: semester,
        courseId: course.courseId,
        courseName: course.courseName,
        credits: parseInt(course.credits),
        grade: parseInt(course.grade) / 100,
        letterGrade: course.letterGrade,
        instructor: course.instructor
      }));
      
      allGrades.push(...semesterGrades);
      
      semesterDetails.push({
        semester: semester,
        courses: semesterGrades
      });
    }
    
    // Calculate which courses are retakes and find best grade for each course (GIỐNG STUDENT.JS)
    const courseIdMap = new Map();
    const bestGradeMap = new Map();
    
    allGrades.forEach(g => {
      // Skip SHCVHT (không tính GPA)
      if (g.courseId === 'SHCVHT' || g.courseName.includes('Sinh hoạt')) return;
      
      if (!courseIdMap.has(g.courseId)) {
        courseIdMap.set(g.courseId, []);
      }
      courseIdMap.get(g.courseId).push({
        semester: g.semester,
        grade: g.grade
      });
    });
    
    // Find best grade for each course
    courseIdMap.forEach((instances, courseId) => {
      let bestInstance = instances[0];
      for (let i = 1; i < instances.length; i++) {
        if (instances[i].grade > bestInstance.grade) {
          bestInstance = instances[i];
        }
      }
      bestGradeMap.set(courseId, bestInstance.semester);
    });
    
    // Calculate semester GPAs and overall GPA (using best grades only, excluding SHCVHT)
    let overallCredits = 0;
    let overallPoints = 0;
    
    semesterDetails.forEach(sem => {
      let semCredits = 0;
      let semPoints = 0;
      
      sem.courses.forEach(course => {
        // Skip SHCVHT
        if (course.courseId === 'SHCVHT' || course.courseName.includes('Sinh hoạt')) return;
        
        // Check if this is the best grade for this course
        const isBestGrade = bestGradeMap.get(course.courseId) === sem.semester;
        
        if (isBestGrade) {
          const grade4 = convertToGPA4(course.grade);
          semCredits += course.credits;
          semPoints += grade4 * course.credits;
          
          overallCredits += course.credits;
          overallPoints += grade4 * course.credits;
        }
      });
      
      sem.credits = semCredits;
      sem.gpa = semCredits > 0 ? (semPoints / semCredits).toFixed(2) : '0.00';
      sem.courseCount = sem.courses.length;
    });
    
    const overallGPA = overallCredits > 0 ? (overallPoints / overallCredits).toFixed(2) : '0.00';
    
    // Display academic record with detailed courses
    resultDiv.innerHTML = `
      <div class="success-box">
        <h2 style="margin-bottom: 15px;">📚 Quá trình học tập chi tiết</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div><strong>MSSV:</strong> ${studentInfo.studentId}</div>
          <div><strong>Họ tên:</strong> ${studentInfo.name}</div>
          <div><strong>Lớp:</strong> ${studentInfo.class}</div>
          <div><strong>Ngành:</strong> ${studentInfo.major}</div>
        </div>
      </div>
      
      <div class="result-card" style="margin-top: 20px;">
        <h3 style="color: #667eea; margin-bottom: 15px;">📊 Tổng quan học tập</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">${semesters.length}</div>
            <div style="font-size: 12px; color: #666;">Học kỳ</div>
          </div>
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #388e3c;">${allGrades.length}</div>
            <div style="font-size: 12px; color: #666;">Môn học (bao gồm cả học lại)</div>
          </div>
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #f57c00;">${overallCredits}</div>
            <div style="font-size: 12px; color: #666;">Tín chỉ (đã loại bỏ học lại)</div>
          </div>
          <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #7b1fa2;">${overallGPA}</div>
            <div style="font-size: 12px; color: #666;">GPA tích lũy (hệ 4)</div>
          </div>
        </div>
      </div>
      
      ${semesterDetails.map((sem, idx) => {
        return `
        <div class="result-card" style="margin-top: 20px; border-left: 4px solid ${idx % 2 === 0 ? '#667eea' : '#764ba2'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">
            <div>
              <h3 style="color: #333; margin: 0;">📅 Học kỳ: ${sem.semester}</h3>
              <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">
                ${sem.courseCount} môn học • ${sem.credits} tín chỉ (tính GPA)
              </p>
            </div>
            <div style="text-align: right;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 20px; border-radius: 20px; display: inline-block;">
                <div style="font-size: 11px; opacity: 0.9;">GPA học kỳ</div>
                <div style="font-size: 20px; font-weight: bold;">${sem.gpa}</div>
              </div>
            </div>
          </div>
          
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea; width: 40px;">STT</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Mã MH</th>
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Tên môn học</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea; width: 60px;">TC</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea; width: 80px;">Điểm (10)</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea; width: 80px;">Điểm (4)</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea; width: 70px;">Chữ</th>
                </tr>
              </thead>
              <tbody>
                ${sem.courses.map((course, courseIdx) => {
                  const isRetake = courseIdMap.has(course.courseId) && courseIdMap.get(course.courseId).length > 1;
                  const isBestGrade = bestGradeMap.get(course.courseId) === sem.semester;
                  const isSHCVHT = course.courseId === 'SHCVHT' || course.courseName.includes('Sinh hoạt');
                  
                  // Determine background color (GIỐNG STUDENT.JS)
                  let backgroundColor = '';
                  if (!isSHCVHT) {
                    if (isRetake && isBestGrade) {
                      backgroundColor = 'background-color: #d4edda;'; // Green - counted
                    } else if (isRetake && !isBestGrade) {
                      backgroundColor = 'background-color: #fff3cd;'; // Yellow - not counted
                    }
                  }
                  
                  // Determine grade color
                  let gradeColor = '';
                  let gradeBg = '';
                  if (course.grade >= 8.5) {
                    gradeColor = '#155724';
                    gradeBg = '#d4edda';
                  } else if (course.grade >= 7.0) {
                    gradeColor = '#0c5460';
                    gradeBg = '#d1ecf1';
                  } else if (course.grade >= 5.5) {
                    gradeColor = '#856404';
                    gradeBg = '#fff3cd';
                  } else if (course.grade >= 4.0) {
                    gradeColor = '#721c24';
                    gradeBg = '#f8d7da';
                  } else {
                    gradeColor = '#721c24';
                    gradeBg = '#f5c6cb';
                  }
                  
                  const grade4 = convertToGPA4(course.grade);
                  
                  return `
                    <tr style="${backgroundColor} border-bottom: 1px solid #e0e0e0;">
                      <td style="padding: 10px; text-align: center;">${courseIdx + 1}</td>
                      <td style="padding: 10px;">
                        <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${course.courseId}</code>
                        ${isRetake && !isSHCVHT ? '<span style="color: #ff6b6b; font-weight: bold;" title="Môn học lại">↻</span>' : ''}
                      </td>
                      <td style="padding: 10px;">${course.courseName}</td>
                      <td style="padding: 10px; text-align: center; font-weight: 600;">${course.credits}</td>
                      <td style="padding: 10px; text-align: center; font-weight: bold; color: ${gradeColor};">${course.grade.toFixed(1)}</td>
                      <td style="padding: 10px; text-align: center; font-weight: 600; color: ${gradeColor};">${grade4.toFixed(1)}</td>
                      <td style="padding: 10px; text-align: center;">
                        <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${gradeBg}; color: ${gradeColor};">
                          ${course.letterGrade}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
        `;
      }).join('')}
      
      <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-top: 20px;">
        <h3 style="color: #2e7d32; margin: 0 0 10px 0;">📌 Chú thích</h3>
        <div style="display: grid; gap: 8px; font-size: 13px;">
          <div><span style="color: #ff6b6b; font-weight: bold;">↻</span> = Môn học lại</div>
          <div style="padding: 8px; background: #d4edda; border-radius: 4px;">
            <strong>Nền xanh:</strong> Môn học lại với điểm cao nhất → Được tính vào GPA
          </div>
          <div style="padding: 8px; background: #fff3cd; border-radius: 4px;">
            <strong>Nền vàng:</strong> Môn học lại với điểm thấp hơn → Không tính vào GPA
          </div>
          <div><strong>Lưu ý:</strong> Môn "Sinh hoạt cộng đồng" (SHCVHT) không tính vào GPA</div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button onclick="verifyDiploma()" style="background: #667eea; color: white; border: none; padding: 15px 40px; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
          ← Quay lại xác thực bằng
        </button>
      </div>
    `;

  } catch (err) {
    console.error('Error loading academic record:', err);
    resultDiv.innerHTML = `<div class="error-box">❌ Lỗi tải dữ liệu: ${err.message}</div>`;
  }
}

// Convert grade to GPA 4.0
function convertToGPA4(grade) {
  if (grade >= 9.0) return 4.0;
  if (grade >= 8.0) return 3.5;
  if (grade >= 7.0) return 3.0;
  if (grade >= 6.5) return 2.5;
  if (grade >= 5.5) return 2.0;
  if (grade >= 5.0) return 1.5;
  if (grade >= 4.0) return 1.0;
  return 0.0;
}


