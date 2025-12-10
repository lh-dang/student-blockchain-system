// admin_programs.js - Quản lý Chương trình Đào tạo (UPDATED for new contract structure)

const contractAddress = "0x0e068999591e59D0eAbff3491E2CD449B2B7D9f2";
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"department","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DeanInfoAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"DeanRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"diplomaHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaIssued","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"address","name":"revokedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DiplomaRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"approvedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"address","name":"rejectedBy","type":"address"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"applicationHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"gpa","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalCredits","type":"uint256"},{"indexed":false,"internalType":"string","name":"classification","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GraduationApplicationSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":true,"internalType":"string","name":"className","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramClassSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"string","name":"programName","type":"string"},{"indexed":false,"internalType":"uint256","name":"minCredits","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minGPA","type":"uint256"},{"indexed":false,"internalType":"address","name":"createdBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProgramUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"semester","type":"string"},{"indexed":false,"internalType":"uint256","name":"courseCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"address","name":"submittedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"SemesterGradesSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":true,"internalType":"string","name":"programId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentAssignedToProgram","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentInfoUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"studentId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"StudentRegistered","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allDeanAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allProgramIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allStudentIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"classToProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deans","outputs":[{"internalType":"address","name":"deanAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"diplomaIssuedStudents","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"diplomas","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"electiveGroups","outputs":[{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"graduationApplicants","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"graduationApplications","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isDean","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programCourses","outputs":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"programElectiveGroupIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"programs","outputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"address","name":"createdBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"}],"name":"semesterGrades","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"submittedAt","type":"uint256"},{"internalType":"address","name":"submittedBy","type":"address"},{"internalType":"uint256","name":"version","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentIdExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"studentSemesters","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"studentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"students","outputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"walletToStudentId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"addDeanWithInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"removeDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getDeanInfo","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"notes","type":"string"},{"internalType":"uint256","name":"addedAt","type":"uint256"},{"internalType":"address","name":"addedBy","type":"address"},{"internalType":"bool","name":"isActive","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getAllActiveDeans","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDeans","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"setDean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"registerStudent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class_","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"}],"name":"updateStudentInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"names","type":"string[]"},{"internalType":"string[]","name":"dobs","type":"string[]"},{"internalType":"string[]","name":"cccds","type":"string[]"},{"internalType":"string[]","name":"phones","type":"string[]"},{"internalType":"string[]","name":"emails","type":"string[]"},{"internalType":"string[]","name":"hometowns","type":"string[]"},{"internalType":"string[]","name":"classes","type":"string[]"},{"internalType":"string[]","name":"majors","type":"string[]"},{"internalType":"string[]","name":"majorCodes","type":"string[]"},{"internalType":"string[]","name":"departments","type":"string[]"},{"internalType":"string[]","name":"schools","type":"string[]"},{"internalType":"string[]","name":"programsArray","type":"string[]"},{"internalType":"address[]","name":"walletAddresses","type":"address[]"}],"name":"batchRegisterStudents","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"uint16[]","name":"grades","type":"uint16[]"},{"internalType":"string[]","name":"letterGrades","type":"string[]"},{"internalType":"string[]","name":"instructors","type":"string[]"}],"name":"submitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"studentIds","type":"string[]"},{"internalType":"string[]","name":"semesters","type":"string[]"},{"internalType":"string[][]","name":"courseIdsArray","type":"string[][]"},{"internalType":"string[][]","name":"courseNamesArray","type":"string[][]"},{"internalType":"uint8[][]","name":"creditsArray","type":"uint8[][]"},{"internalType":"uint16[][]","name":"gradesArray","type":"uint16[][]"},{"internalType":"string[][]","name":"letterGradesArray","type":"string[][]"},{"internalType":"string[][]","name":"instructorsArray","type":"string[][]"}],"name":"batchSubmitSemesterGrades","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentInfo","outputs":[{"components":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"dob","type":"string"},{"internalType":"string","name":"cccd","type":"string"},{"internalType":"string","name":"phone","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"hometown","type":"string"},{"internalType":"string","name":"class","type":"string"},{"internalType":"string","name":"major","type":"string"},{"internalType":"string","name":"majorCode","type":"string"},{"internalType":"string","name":"department","type":"string"},{"internalType":"string","name":"school","type":"string"},{"internalType":"string","name":"program","type":"string"},{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"uint256","name":"registeredAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct StudentManagement.StudentInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentSemesters","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterGrades","outputs":[{"internalType":"string","name":"","type":"string"},{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade[]","name":"","type":"tuple[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"}],"name":"getSemesterCourseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"semester","type":"string"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getCourseGrade","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"uint16","name":"grade","type":"uint16"},{"internalType":"string","name":"letterGrade","type":"string"},{"internalType":"string","name":"instructor","type":"string"}],"internalType":"struct StudentManagement.CourseGrade","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalStudents","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStudentIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"}],"name":"createProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"}],"name":"addCoursesToProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"},{"internalType":"string","name":"groupName","type":"string"},{"internalType":"uint8","name":"requiredCredits","type":"uint8"},{"internalType":"string[]","name":"courseIds","type":"string[]"}],"name":"addElectiveGroup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"string[]","name":"courseIds","type":"string[]"},{"internalType":"string[]","name":"courseNames","type":"string[]"},{"internalType":"uint8[]","name":"credits","type":"uint8[]"},{"internalType":"bool[]","name":"isRequired","type":"bool[]"},{"internalType":"string[][]","name":"prerequisites","type":"string[][]"},{"internalType":"string[][]","name":"corequisites","type":"string[][]"},{"internalType":"uint16[]","name":"minCreditsRequired","type":"uint16[]"},{"internalType":"string[]","name":"groupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupIds","type":"string[]"},{"internalType":"string[]","name":"electiveGroupNames","type":"string[]"},{"internalType":"uint8[]","name":"electiveRequiredCredits","type":"uint8[]"},{"internalType":"uint256[]","name":"electiveGroupCourseStartIdx","type":"uint256[]"},{"internalType":"uint256[]","name":"electiveGroupCourseCount","type":"uint256[]"}],"name":"createProgramComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"programName","type":"string"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"uint256","name":"minCredits","type":"uint256"},{"internalType":"uint256","name":"minGPA","type":"uint256"},{"internalType":"bool","name":"isActive","type":"bool"}],"name":"updateProgram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"className","type":"string"}],"name":"setProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string[]","name":"classNames","type":"string[]"}],"name":"batchSetProgramClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgram","outputs":[{"internalType":"string","name":"_programName","type":"string"},{"internalType":"uint256","name":"_totalCredits","type":"uint256"},{"internalType":"uint256","name":"_minCredits","type":"uint256"},{"internalType":"uint256","name":"_minGPA","type":"uint256"},{"internalType":"uint256","name":"_courseCount","type":"uint256"},{"internalType":"bool","name":"_isActive","type":"bool"},{"internalType":"uint256","name":"_createdAt","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramCourses","outputs":[{"components":[{"internalType":"string","name":"courseId","type":"string"},{"internalType":"string","name":"courseName","type":"string"},{"internalType":"uint8","name":"credits","type":"uint8"},{"internalType":"bool","name":"isRequired","type":"bool"},{"internalType":"string[]","name":"prerequisites","type":"string[]"},{"internalType":"string[]","name":"corequisites","type":"string[]"},{"internalType":"uint16","name":"minCreditsRequired","type":"uint16"},{"internalType":"string","name":"groupId","type":"string"}],"internalType":"struct StudentManagement.ProgramCourse[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"courseId","type":"string"}],"name":"getProgramCourse","outputs":[{"internalType":"string","name":"_courseId","type":"string"},{"internalType":"string","name":"_courseName","type":"string"},{"internalType":"uint256","name":"_credits","type":"uint256"},{"internalType":"bool","name":"_isRequired","type":"bool"},{"internalType":"string[]","name":"_prerequisites","type":"string[]"},{"internalType":"string[]","name":"_corequisites","type":"string[]"},{"internalType":"uint256","name":"_minCreditsRequired","type":"uint256"},{"internalType":"string","name":"_groupId","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"},{"internalType":"string","name":"groupId","type":"string"}],"name":"getElectiveGroup","outputs":[{"internalType":"string","name":"_groupId","type":"string"},{"internalType":"string","name":"_groupName","type":"string"},{"internalType":"uint256","name":"_requiredCredits","type":"uint256"},{"internalType":"string[]","name":"_courseIds","type":"string[]"},{"internalType":"bool","name":"_exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"programId","type":"string"}],"name":"getProgramElectiveGroupIds","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalPrograms","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getProgramIdByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentProgram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"className","type":"string"}],"name":"getProgramByClass","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"mintDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"name":"submitGraduationApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"name":"approveGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"rejectGraduation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getGraduationApplication","outputs":[{"internalType":"string","name":"applicationHash","type":"string"},{"internalType":"uint256","name":"appliedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"uint8","name":"status","type":"uint8"},{"internalType":"uint256","name":"processedAt","type":"uint256"},{"internalType":"address","name":"processedBy","type":"address"},{"internalType":"string","name":"notesStr","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalGraduationApplications","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getGraduationApplicantByIndex","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"diplomaHash","type":"string"}],"name":"verifyDiploma","outputs":[{"internalType":"bool","name":"valid","type":"bool"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiploma","outputs":[{"internalType":"string","name":"diplomaHash","type":"string"},{"internalType":"uint256","name":"issuedAt","type":"uint256"},{"internalType":"uint256","name":"gpa","type":"uint256"},{"internalType":"uint256","name":"totalCredits","type":"uint256"},{"internalType":"string","name":"classification","type":"string"},{"internalType":"bool","name":"exists","type":"bool"},{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"revokedReason","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"string","name":"reason","type":"string"}],"name":"revokeDiploma","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"hasDiploma","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"isDiplomaRevoked","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getDiplomaRevokeInfo","outputs":[{"internalType":"bool","name":"revoked","type":"bool"},{"internalType":"uint256","name":"revokedAt","type":"uint256"},{"internalType":"string","name":"reason","type":"string"},{"internalType":"address","name":"revokedBy","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getTotalDiplomasIssued","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"}],"name":"getStudentWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"wallet","type":"address"}],"name":"getStudentIdByWallet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"studentId","type":"string"},{"internalType":"address","name":"wallet","type":"address"}],"name":"verifyStudentWallet","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true}];

let web3;
let contract;
let currentAccount;
let currentProgramData = null; // Data đang được parse từ JSON/CSV

// ============ KHỞI TẠO ============

async function initializeWeb3() {
  try {
    if (typeof window.ethereum === 'undefined') {
      showStatus('Vui lòng cài đặt MetaMask!', 'error');
      return false;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];

    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Kiểm tra contract deployed
    const code = await web3.eth.getCode(contractAddress);
    if (code === '0x' || code === '0x0') {
      showStatus('❌ Contract chưa được deployed!', 'error');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Lỗi khởi tạo:', error);
    showStatus('❌ Lỗi khởi tạo: ' + error.message, 'error');
    return false;
  }
}

// Tự động khởi tạo khi trang load
window.addEventListener('DOMContentLoaded', async () => {
  const initialized = await initializeWeb3();
  if (initialized) {
    await loadPrograms();
    
    // Lắng nghe thay đổi account
    ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        await loadPrograms();
      }
    });
  }
});

function updateWalletUI(connected) {
  // Function giữ lại để tránh lỗi nếu có code gọi đến
  // Không cần cập nhật UI nữa
}

// ============ XỬ LÝ FILE JSON ============

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const fileExt = fileName.split('.').pop().toLowerCase();

  document.getElementById('selectedFile').textContent = `📁 ${fileName}`;

  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      if (fileExt === 'json') {
        const jsonData = JSON.parse(e.target.result);
        parseJSONProgram(jsonData);
      } else {
        showStatus('Chỉ hỗ trợ file JSON!', 'error');
      }
    } catch (error) {
      console.error('Lỗi đọc file:', error);
      showStatus('❌ Lỗi đọc file: ' + error.message, 'error');
    }
  };

  reader.readAsText(file);
}

function parseJSONProgram(data) {
  // Parse JSON theo cấu trúc từ chuong_trinh_cntt_2024.json
  
  // Xử lý blocks: gộp courses + elective courses từ electiveGroups vào courses
  const processedBlocks = (data.blocks || []).map(block => {
    const allCourses = [...(block.courses || [])];
    
    // Thêm các môn từ electiveGroups vào danh sách courses
    if (block.electiveGroups) {
      block.electiveGroups.forEach(group => {
        // Xử lý courses trực tiếp trong group
        if (group.courses) {
          group.courses.forEach(course => {
            allCourses.push({
              courseId: course.courseId,
              courseName: course.courseName,
              credits: course.credits,
              type: 'ELECTIVE', // Đánh dấu là tự chọn
              prerequisites: course.prerequisites || [],
              corequisites: course.corequisites || [],
              minCreditsRequired: course.minCreditsRequired || 0,
              groupId: group.groupId,
              electiveGroupName: group.groupName,
              electiveGroupRequiredCredits: group.requiredCredits
            });
          });
        }
        
        // Xử lý subGroups
        if (group.subGroups) {
          group.subGroups.forEach(subGroup => {
            if (subGroup.courses) {
              subGroup.courses.forEach(course => {
                allCourses.push({
                  courseId: course.courseId,
                  courseName: course.courseName,
                  credits: course.credits,
                  type: 'ELECTIVE',
                  prerequisites: course.prerequisites || [],
                  corequisites: course.corequisites || [],
                  minCreditsRequired: course.minCreditsRequired || 0,
                  groupId: subGroup.subGroupId || group.groupId,
                  electiveGroupName: subGroup.subGroupName || group.groupName,
                  electiveGroupRequiredCredits: group.requiredCredits
                });
              });
            }
          });
        }
      });
    }
    
    return {
      ...block,
      courses: allCourses
    };
  });
  
  currentProgramData = {
    programId: data.programId || '',
    programName: data.programName || '',
    description: data.description || '',
    totalCredits: data.totalCredits || 0,
    minCredits: data.minCredits || 0,
    minGPA: data.minGPA || 0,
    blocks: processedBlocks,
    electiveGroups: data.electiveGroups || []
  };

  displayProgramPreview();
}

function displayProgramPreview() {
  const preview = document.getElementById('csvPreview');
  const content = document.getElementById('csvContent');
  
  if (!currentProgramData) {
    content.innerHTML = '<p style="color: red;">Không có dữ liệu!</p>';
    return;
  }

  const prog = currentProgramData;
  let totalRequiredCredits = 0;
  let totalElectiveCredits = 0;
  prog.blocks.forEach(block => {
    if (block.requiredCredits) totalRequiredCredits += block.requiredCredits;
    if (block.electiveCredits) totalElectiveCredits += block.electiveCredits;
  });
  const grandTotal = totalRequiredCredits + totalElectiveCredits;

  const blocksHtml = prog.blocks.map((block, blockIdx) => {
    const blockCourses = block.courses || [];
    
    // Helper function để xác định label và rowspan cho các nhóm đặc biệt
    const getGroupInfo = (course, courses, currentIdx) => {
      const groupId = course.groupId || '';
      const courseId = course.courseId;
      
      // Đếm số môn trong cùng nhóm
      const sameGroupCourses = courses.filter((c, i) => 
        i >= currentIdx && 
        (c.groupId || '') === groupId && 
        (c.type === 'ELECTIVE' || !c.isRequired)
      );
      const groupCount = sameGroupCourses.length;
      
      // Nhóm Anh văn (ENGLISH)
      if (['XH023', 'XH024', 'XH025', 'XH031', 'XH032', 'XH033'].includes(courseId)) {
        return {
          requiredLabel: 'AV',
          requiredRowspan: 6,
          electiveLabel: 'Chọn 10TC nhóm AV hoặc nhóm PV',
          electiveRowspan: 12, // 6 AV + 6 PV
          isFirstInGroup: courseId === 'XH023',
          isFirstInSuperGroup: courseId === 'XH023'
        };
      }
      
      // Nhóm Pháp văn (FRENCH)
      if (['FL001', 'FL002', 'FL003', 'FL007', 'FL008', 'FL009'].includes(courseId)) {
        return {
          requiredLabel: 'PV',
          requiredRowspan: 6,
          electiveLabel: '', // Đã merge với AV
          electiveRowspan: 0,
          isFirstInGroup: courseId === 'FL001',
          isFirstInSuperGroup: false
        };
      }
      
      // Nhóm tự chọn 2TC (ML007, XH028, XH011, XH012, XH014, KN001, KN002)
      if (['ML007', 'XH028', 'XH011', 'XH012', 'XH014', 'KN001', 'KN002'].includes(courseId)) {
        return {
          requiredLabel: '-',
          requiredRowspan: 7,
          electiveLabel: '2',
          electiveRowspan: 7,
          isFirstInGroup: courseId === 'ML007',
          isFirstInSuperGroup: courseId === 'ML007'
        };
      }
      
      // Nhóm chuyên ngành TT&MMT - An ninh mạng (N1)
      if (['CT227', 'CT228', 'CT229', 'CT222', 'CT344', 'CT232'].includes(courseId)) {
        return {
          requiredLabel: 'N1',
          requiredRowspan: 6,
          electiveLabel: 'Chọn 9TC nhóm N1 hoặc N2',
          electiveRowspan: 11, // 6 môn N1 + 5 môn N2
          isFirstInGroup: courseId === 'CT227',
          isFirstInSuperGroup: courseId === 'CT227'
        };
      }
      
      // Nhóm chuyên ngành TT&MMT - Dữ liệu lớn (N2)
      if (['CT207', 'CT230', 'CT231', 'CT233', 'CT482'].includes(courseId)) {
        return {
          requiredLabel: 'N2',
          requiredRowspan: 5,
          electiveLabel: '', // Đã merge với N1
          electiveRowspan: 0,
          isFirstInGroup: courseId === 'CT207',
          isFirstInSuperGroup: false
        };
      }
      
      // Nhóm chuyên ngành CNTT - An ninh mạng (CN1)
      if (['CT211', 'CT297'].includes(courseId)) {
        return {
          requiredLabel: 'CN1',
          requiredRowspan: 2,
          electiveLabel: 'Chọn 6TC nhóm CN1 hoặc CN2 hoặc CN3',
          electiveRowspan: 6, // 2+2+2
          isFirstInGroup: courseId === 'CT211',
          isFirstInSuperGroup: courseId === 'CT211'
        };
      }
      
      // Nhóm chuyên ngành CNTT - Web & Mobile (CN2)
      if (['CT449', 'CT484'].includes(courseId)) {
        return {
          requiredLabel: 'CN2',
          requiredRowspan: 2,
          electiveLabel: '',
          electiveRowspan: 0,
          isFirstInGroup: courseId === 'CT449',
          isFirstInSuperGroup: false
        };
      }
      
      // Nhóm chuyên ngành CNTT - IoT & Blockchain (CN3)
      if (['CT295', 'CT277'].includes(courseId)) {
        return {
          requiredLabel: 'CN3',
          requiredRowspan: 2,
          electiveLabel: '',
          electiveRowspan: 0,
          isFirstInGroup: courseId === 'CT295',
          isFirstInSuperGroup: false
        };
      }
      
      // Nhóm lý thuyết chuyên ngành (6TC) - TT&MMT
      if (['CT126', 'CT127', 'CT479', 'CT121', 'CT224', 'CT225', 'CT274'].includes(courseId)) {
        return {
          requiredLabel: '-',
          requiredRowspan: 7,
          electiveLabel: '6',
          electiveRowspan: 7,
          isFirstInGroup: courseId === 'CT126',
          isFirstInSuperGroup: courseId === 'CT126'
        };
      }
      
      // Nhóm tốt nghiệp TT&MMT (15TC)
      if (['CT555', 'CT507', 'CT338', 'CT272', 'CT234', 'CT223', 'CT235', 'CT205', 'CT237', 'CT251', 'CT206', 'CT238', 'CT332', 'CT202', 'CT273'].includes(courseId)) {
        return {
          requiredLabel: '-',
          requiredRowspan: 15,
          electiveLabel: '15',
          electiveRowspan: 15,
          isFirstInGroup: courseId === 'CT555',
          isFirstInSuperGroup: courseId === 'CT555'
        };
      }
      
      // Nhóm tốt nghiệp CNTT (15TC)
      if (['CT501', 'CT550', 'CT478', 'CT283', 'CT233', 'CT482', 'CT210', 'CT219', 'CT312'].includes(courseId)) {
        return {
          requiredLabel: '-',
          requiredRowspan: 9,
          electiveLabel: '15',
          electiveRowspan: 9,
          isFirstInGroup: courseId === 'CT501',
          isFirstInSuperGroup: courseId === 'CT501'
        };
      }
      
      // Nhóm thể chất - Kiểm tra các nhóm con
      const peGroups = [
        ['TC016', 'TC017', 'TC018'], // Thể dục nhịp điệu
        ['TC025', 'TC026', 'TC027'], // Cờ vua
        ['TC028', 'TC029', 'TC030'], // Bóng rổ
        ['TC001', 'TC002', 'TC024'], // Điền kinh
        ['TC003', 'TC004', 'TC019'], // Taekwondo
        ['TC005', 'TC006', 'TC020'], // Bóng chuyền
        ['TC007', 'TC008', 'TC021'], // Bóng đá
        ['TC009', 'TC010', 'TC022'], // Bóng bàn
        ['TC011', 'TC012', 'TC023']  // Cầu lông
      ];
      
      for (let peGroup of peGroups) {
        if (peGroup.includes(courseId)) {
          return {
            requiredLabel: '-',
            requiredRowspan: 3,
            electiveLabel: '3',
            electiveRowspan: 3,
            isFirstInGroup: peGroup[0] === courseId,
            isFirstInSuperGroup: peGroup[0] === courseId
          };
        }
      }
      
      // Mặc định
      return null;
    };
    
    let rows = '';
    
    blockCourses.forEach((course, idx) => {
      const isReq = course.type === 'REQUIRED' || course.isRequired === true;
      const prereqs = course.prerequisites && course.prerequisites.length > 0 ? course.prerequisites.join(', ') : '-';
      const coreqs = course.corequisites && course.corequisites.length > 0 ? course.corequisites.join(', ') : '-';
      
      let requiredCell = '';
      let electiveCell = '';
      
      if (isReq) {
        // Môn bắt buộc - hiển thị tín chỉ ở cột bắt buộc, cột tự chọn để trống
        requiredCell = `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${course.credits}</td>`;
        electiveCell = '<td style="padding: 8px; border: 1px solid #ddd; text-align: center; background: #f9f9f9;">-</td>';
      } else {
        // Môn tự chọn - kiểm tra nhóm đặc biệt
        const groupInfo = getGroupInfo(course, blockCourses, idx);
        
        if (groupInfo) {
          // Nhóm đặc biệt với label riêng
          if (groupInfo.isFirstInGroup) {
            requiredCell = `<td rowspan="${groupInfo.requiredRowspan}" style="padding: 8px; border: 1px solid #ddd; text-align: center; vertical-align: middle; background: #fff3cd;">${groupInfo.requiredLabel}</td>`;
          } else {
            requiredCell = '';
          }
          
          if (groupInfo.isFirstInSuperGroup && groupInfo.electiveRowspan > 0) {
            electiveCell = `<td rowspan="${groupInfo.electiveRowspan}" style="padding: 8px; border: 1px solid #ddd; text-align: center; vertical-align: middle; background: #d4edda; font-weight: bold;">${groupInfo.electiveLabel}</td>`;
          } else {
            electiveCell = '';
          }
        } else {
          // Nhóm tự chọn thông thường
          requiredCell = `<td style="padding: 8px; border: 1px solid #ddd; text-align: center; background: #fff3cd;">${course.credits}</td>`;
          electiveCell = '<td style="padding: 8px; border: 1px solid #ddd; text-align: center; background: #f9f9f9;">-</td>';
        }
      }
      
      rows += `
      <tr style="background: ${idx % 2 === 0 ? '#fff' : '#f8f9fa'};">
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;"><strong>${course.courseId}</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${course.courseName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${course.credits}</td>
        ${requiredCell}
        ${electiveCell}
        <td style="padding: 8px; border: 1px solid #ddd; font-size: 0.9em;">${prereqs}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-size: 0.9em;">${coreqs}</td>
      </tr>`;
    });
    
    return `
      <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
        <h4 style="color: #28a745; margin-bottom: 5px;">📚 Khối ${blockIdx + 1}: ${block.blockName}</h4>
        <div style="margin-bottom: 10px; font-size: 0.9em; color: #666;">
          <strong>Tổng:</strong> ${block.totalCredits || 0} TC 
          (<strong style="color: #28a745;">${block.requiredCredits || 0} TC bắt buộc</strong>, 
          <strong style="color: #ffc107;">${block.electiveCredits || 0} TC tự chọn</strong>)
        </div>
        <table style="width: 100%; border-collapse: collapse; background: white;">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 8px; border: 1px solid #ddd;">STT</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Mã HP</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Tên học phần</th>
              <th style="padding: 8px; border: 1px solid #ddd;">TC</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Bắt buộc</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Tự chọn</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Tiên quyết</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Song hành</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>`;
  }).join('');

  html = `
    <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 10px; border-left: 4px solid #667eea;">
      <h3 style="color: #667eea; margin-bottom: 15px;">📋 ${prog.programName}</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
        <div style="padding: 10px; background: #f8f9fa; border-radius: 5px;">
          <div style="font-size: 0.85em; color: #666;">Mã CTĐT</div>
          <div style="font-size: 1.2em; font-weight: bold; color: #667eea;">${prog.programId}</div>
        </div>
        <div style="padding: 10px; background: #d4edda; border-radius: 5px;">
          <div style="font-size: 0.85em; color: #155724;">Tín chỉ Bắt buộc</div>
          <div style="font-size: 1.2em; font-weight: bold; color: #28a745;">${totalRequiredCredits} TC</div>
        </div>
        <div style="padding: 10px; background: #fff3cd; border-radius: 5px;">
          <div style="font-size: 0.85em; color: #856404;">Tín chỉ Tự chọn</div>
          <div style="font-size: 1.2em; font-weight: bold; color: #ffc107;">${totalElectiveCredits} TC</div>
        </div>
      </div>
      <div style="padding: 10px; background: #e7f3ff; border-radius: 5px; margin-bottom: 10px;">
        <div style="font-size: 0.85em; color: #004085;">Tổng tín chỉ</div>
        <div style="font-size: 1.3em; font-weight: bold; color: #0056b3;">${grandTotal} TC</div>
      </div>
      <div style="padding: 10px; background: #f1f1f1; border-radius: 5px; margin-top: 10px;">
        <strong>📝 Mô tả:</strong> ${prog.description}
      </div>
    </div>
    ${blocksHtml}`;

  content.innerHTML = html;
  preview.style.display = 'block';
  document.getElementById('uploadBtn').disabled = false;
}

// ============ UPLOAD LÊN BLOCKCHAIN ============

async function uploadProgramFromJSON() {
  if (!web3 || !currentAccount) {
    showStatus('Vui lòng kết nối MetaMask trước!', 'error');
    return;
  }

  if (!currentProgramData) {
    showStatus('Không có dữ liệu để upload!', 'error');
    return;
  }

  const prog = currentProgramData;
  
  // Kiểm tra quyền owner
  try {
    const owner = await contract.methods.owner().call();
    if (owner.toLowerCase() !== currentAccount.toLowerCase()) {
      showStatus(`❌ Bạn không phải là Owner! Owner hiện tại: ${owner}`, 'error');
      return;
    }
  } catch (error) {
    showStatus('❌ Không thể kiểm tra quyền Owner: ' + error.message, 'error');
    return;
  }
  
  // Kiểm tra program đã tồn tại chưa
  try {
    const existingProgram = await contract.methods.programs(prog.programId).call();
    if (existingProgram.exists) {
      showStatus(`❌ Chương trình ${prog.programId} đã tồn tại trên blockchain!`, 'error');
      return;
    }
  } catch (error) {
    console.warn('Không thể kiểm tra program tồn tại:', error);
  }

  try {
    // Chuẩn bị data
    showStatus(`⏳ Đang chuẩn bị dữ liệu cho chương trình ${prog.programId}...`, 'info');
    
    // Kiểm tra giá trị minGPA
    // Nếu minGPA đã là số lớn (>10), coi như đã nhân 100
    // Nếu minGPA nhỏ (<10), nhân 100
    const minGPAValue = prog.minGPA > 10 ? prog.minGPA : Math.round(prog.minGPA * 100);
    
    // Validate dữ liệu
    if (!prog.programId || prog.programId.trim() === '') {
      showStatus('❌ Lỗi: programId không được rỗng!', 'error');
      return;
    }
    
    if (minGPAValue > 400) {
      showStatus(`❌ Lỗi: minGPA (${minGPAValue}) vượt quá 400 (4.0)! File JSON có minGPA = ${prog.minGPA}`, 'error');
      return;
    }
    
    if (!prog.totalCredits || prog.totalCredits === 0) {
      showStatus('❌ Lỗi: totalCredits phải > 0!', 'error');
      return;
    }
    
    console.log('✅ Validation passed! Upload Program:', {
      programId: prog.programId,
      programName: prog.programName,
      totalCredits: prog.totalCredits,
      minCredits: prog.minCredits || 0,
      minGPA: minGPAValue,
      minGPAOriginal: prog.minGPA
    });
    
    // Gộp tất cả courses từ các blocks
    const allCourses = [];
    prog.blocks.forEach(block => {
      block.courses.forEach(course => {
        allCourses.push(course);
      });
    });

    console.log(`📚 Tổng số môn học: ${allCourses.length}`);

    // Chuẩn bị course data
    const courseIds = allCourses.map(c => c.courseId);
    const courseNames = allCourses.map(c => c.courseName);
    const credits = allCourses.map(c => c.credits);
    const isRequired = allCourses.map(c => c.type === 'REQUIRED' || c.isRequired === true);
    const prerequisites = allCourses.map(c => c.prerequisites || []);
    const corequisites = allCourses.map(c => c.corequisites || []);
    const minCreditsRequired = allCourses.map(c => c.minCreditsRequired || 0);
    const groupIds = allCourses.map(c => c.groupId || '');

    // Chuẩn bị elective group data
    const electiveGroupIds = [];
    const electiveGroupNames = [];
    const electiveRequiredCredits = [];
    const electiveGroupCourseStartIdx = [];
    const electiveGroupCourseCount = [];

    if (prog.electiveGroups && prog.electiveGroups.length > 0) {
      prog.electiveGroups.forEach(group => {
        if (group.subGroups && group.subGroups.length > 0) {
          // Xử lý subGroups
          group.subGroups.forEach((subGroup, idx) => {
            electiveGroupIds.push(subGroup.subGroupId || `${group.groupId}_${idx}`);
            electiveGroupNames.push(subGroup.subGroupName);
            electiveRequiredCredits.push(subGroup.requiredCredits || group.requiredCredits || 0);
            
            // Tìm vị trí courses của group này trong allCourses
            const groupCourseIds = subGroup.courses ? subGroup.courses.map(c => c.courseId) : [];
            const startIdx = allCourses.findIndex(c => groupCourseIds.includes(c.courseId));
            
            electiveGroupCourseStartIdx.push(startIdx >= 0 ? startIdx : 0);
            electiveGroupCourseCount.push(groupCourseIds.length);
          });
        } else if (group.courses && group.courses.length > 0) {
          electiveGroupIds.push(group.groupId);
          electiveGroupNames.push(group.groupName);
          electiveRequiredCredits.push(group.requiredCredits);
          
          const groupCourseIds = group.courses.map(c => c.courseId);
          const startIdx = allCourses.findIndex(c => groupCourseIds.includes(c.courseId));
          
          electiveGroupCourseStartIdx.push(startIdx >= 0 ? startIdx : 0);
          electiveGroupCourseCount.push(groupCourseIds.length);
        } else if (group.courseIds && group.courseIds.length > 0) {
          electiveGroupIds.push(group.groupId);
          electiveGroupNames.push(group.groupName);
          electiveRequiredCredits.push(group.requiredCredits);
          
          const startIdx = allCourses.findIndex(c => group.courseIds.includes(c.courseId));
          
          electiveGroupCourseStartIdx.push(startIdx >= 0 ? startIdx : 0);
          electiveGroupCourseCount.push(group.courseIds.length);
        }
      });
    }

    console.log(`📊 Số nhóm tự chọn: ${electiveGroupIds.length}`);
    console.log('📤 Bắt đầu upload TOÀN BỘ trong 1 transaction...');

    showStatus(`⏳ Đang upload ${allCourses.length} môn học + ${electiveGroupIds.length} nhóm tự chọn... (CHỈ KÝ 1 LẦN!)`, 'info');

    // UPLOAD TẤT CẢ TRONG 1 TRANSACTION DUY NHẤT!
    const tx = await contract.methods
      .createProgramComplete(
        // Program metadata
        prog.programId,
        prog.programName,
        prog.totalCredits,
        prog.minCredits,
        minGPAValue,
        // Courses data
        courseIds,
        courseNames,
        credits,
        isRequired,
        prerequisites,
        corequisites,
        minCreditsRequired,
        groupIds,
        // Elective groups data
        electiveGroupIds,
        electiveGroupNames,
        electiveRequiredCredits,
        electiveGroupCourseStartIdx,
        electiveGroupCourseCount
      )
      .send({ from: currentAccount, gas: 30000000 });

    console.log('✅ Transaction:', tx.transactionHash);
    console.log('⛽ Gas used:', tx.gasUsed);

    showStatus(`✅ Upload thành công! Tx: ${tx.transactionHash}`, 'success');
    
    // Tự động gán classes nếu có trong JSON
    if (prog.classes && Array.isArray(prog.classes) && prog.classes.length > 0) {
      showStatus(`⏳ Đang gán ${prog.classes.length} class cho chương trình...`, 'info');
      
      try {
        for (let i = 0; i < prog.classes.length; i++) {
          const className = prog.classes[i];
          console.log(`Gán class "${className}" cho program "${prog.programId}"`);
          
          const classTx = await contract.methods.setProgramClass(prog.programId, className).send({
            from: currentAccount,
            gas: 300000
          });
          
          console.log(`✅ Đã gán class "${className}":`, classTx.transactionHash);
        }
        
        showStatus(`🎉 HOÀN THÀNH! Upload ${allCourses.length} môn + ${electiveGroupIds.length} nhóm + ${prog.classes.length} class!`, 'success');
      } catch (classError) {
        console.error('Lỗi gán class:', classError);
        showStatus(`⚠️ Upload thành công nhưng gán class lỗi: ${classError.message}`, 'warning');
      }
    } else {
      showStatus(`🎉 HOÀN THÀNH! Đã upload ${allCourses.length} môn + ${electiveGroupIds.length} nhóm trong 1 LẦN KÝ!`, 'success');
    }
    
    // Reset
    currentProgramData = null;
    document.getElementById('csvFile').value = '';
    document.getElementById('selectedFile').textContent = '';
    document.getElementById('csvPreview').style.display = 'none';
    document.getElementById('uploadBtn').disabled = true;

    // Reload danh sách
    await loadPrograms();

  } catch (error) {
    console.error('Lỗi:', error);
    showStatus('❌ Lỗi: ' + error.message, 'error');
  }
}

// ============ TẢI DANH SÁCH CHƯƠNG TRÌNH ============

async function getProgramClasses() {
  try {
    // Lấy tất cả events ProgramClassAssigned (KHÔNG indexed - có thể đọc được values)
    const events = await contract.getPastEvents('ProgramClassAssigned', {
      fromBlock: 0,
      toBlock: 'latest'
    });

    console.log(`📊 Tìm thấy ${events.length} events ProgramClassAssigned`);

    // Tổ chức dữ liệu: programId -> array of class names
    const programClasses = {};

    for (let event of events) {
      try {
        // Với event không indexed, có thể đọc trực tiếp từ returnValues
        const programId = event.returnValues.programId;
        const className = event.returnValues.className;

        console.log(`  - Event: Program "${programId}" <- Class "${className}"`);

        if (!programClasses[programId]) {
          programClasses[programId] = [];
        }

        // Tránh trùng lặp
        if (className && !programClasses[programId].includes(className)) {
          programClasses[programId].push(className);
        }
      } catch (decodeError) {
        console.warn('Không thể decode event:', decodeError, event);
      }
    }

    console.log('📋 Program Classes Map:', programClasses);
    return programClasses;
  } catch (error) {
    console.error('❌ Lỗi lấy program classes:', error);
    return {};
  }
}

async function loadPrograms() {
  const listDiv = document.getElementById('programList');
  
  if (!web3 || !contract) {
    listDiv.innerHTML = '<p style="color: #999;">Vui lòng kết nối MetaMask để xem danh sách.</p>';
    return;
  }

  try {
    listDiv.innerHTML = '<div class="loading"><div class="spinner"></div><div>Đang tải...</div></div>';

    const totalPrograms = await contract.methods.getTotalPrograms().call();

    if (totalPrograms == 0) {
      listDiv.innerHTML = '<p style="color: #999;">Chưa có chương trình đào tạo nào.</p>';
      return;
    }

    // Lấy danh sách các class đã được gán cho mỗi chương trình từ events
    const programClasses = await getProgramClasses();

    console.log('🔍 Hiển thị program classes:', programClasses);

    let html = '';

    for (let i = 0; i < totalPrograms; i++) {
      const programId = await contract.methods.getProgramIdByIndex(i).call();
      const progInfo = await contract.methods.getProgram(programId).call();

      const createdDate = new Date(progInfo._createdAt * 1000).toLocaleDateString('vi-VN');
      const statusBadge = progInfo._isActive 
        ? '<span class="badge badge-success">Đang hoạt động</span>'
        : '<span class="badge badge-danger">Không hoạt động</span>';

      // Lấy danh sách class cho chương trình này
      const classes = programClasses[programId] || [];
      console.log(`  Program ${programId}: ${classes.length} classes -`, classes);
      
      const classesHtml = classes.length > 0 
        ? `<br>🏫 <strong>Các lớp:</strong> ${classes.join(', ')}`
        : '<br>🏫 <strong>Các lớp:</strong> <span style="color: #999;">(Chưa có lớp nào)</span>';

      html += `
        <div class="program-item" data-program-id="${programId}">
          <h3>${programId} - ${progInfo._programName} ${statusBadge}</h3>
          <div class="meta">
            📊 Tổng tín chỉ: <strong>${progInfo._totalCredits}</strong> TC | 
            Tín chỉ tối thiểu: <strong>${progInfo._minCredits}</strong> TC | 
            GPA tối thiểu: <strong>${(progInfo._minGPA / 100).toFixed(2)}</strong><br>
            📚 Số môn học: <strong>${progInfo._courseCount}</strong><br>
            📅 Tạo ngày: ${createdDate}${classesHtml}
          </div>
          <button onclick="viewProgramDetails('${programId}')" class="btn-view">📋 Xem chi tiết</button>
        </div>`;
    }

    listDiv.innerHTML = html;

  } catch (error) {
    console.error('Lỗi tải danh sách:', error);
    listDiv.innerHTML = '<p style="color: red;">❌ Lỗi tải danh sách: ' + error.message + '</p>';
  }
  
  // Cập nhật dropdown chọn chương trình cho phần gán class
  await updateProgramDropdown();
}

async function updateProgramDropdown() {
  try {
    const dropdown = document.getElementById('classProgramId');
    if (!dropdown || !contract) return;
    
    const totalPrograms = await contract.methods.getTotalPrograms().call();
    
    let options = '<option value="">-- Chọn chương trình --</option>';
    
    for (let i = 0; i < totalPrograms; i++) {
      const programId = await contract.methods.getProgramIdByIndex(i).call();
      const progInfo = await contract.methods.getProgram(programId).call();
      
      if (progInfo._isActive) {
        options += `<option value="${programId}">${programId} - ${progInfo._programName}</option>`;
      }
    }
    
    dropdown.innerHTML = options;
  } catch (error) {
    console.error('Lỗi cập nhật dropdown:', error);
  }
}

async function viewProgramDetails(programId) {
  try {
    showStatus(`⏳ Đang tải chi tiết chương trình ${programId}...`, 'info');

    const progInfo = await contract.methods.getProgram(programId).call();
    
    let courses = [];
    try {
      courses = await contract.methods.getProgramCourses(programId).call();
    } catch (courseError) {
      console.warn('Không thể load courses:', courseError);
      courses = [];
    }
    
    let groupIds = [];
    try {
      groupIds = await contract.methods.getProgramElectiveGroupIds(programId).call();
    } catch (groupError) {
      console.warn('Không thể load groups:', groupError);
      groupIds = [];
    }

    console.log('Program Info:', progInfo);
    console.log('Courses:', courses);
    console.log('Group IDs:', groupIds);

    // Hiển thị chi tiết
    let details = `
=== ${progInfo._programName} ===
Tổng TC: ${progInfo._totalCredits}
Tín chỉ tối thiểu: ${progInfo._minCredits}
GPA tối thiểu: ${(progInfo._minGPA / 100).toFixed(2)}
Số môn học: ${courses.length}

DANH SÁCH MÔN HỌC:
`;

    if (courses.length > 0) {
      courses.forEach((course, idx) => {
        details += `\n${idx + 1}. [${course.courseId}] ${course.courseName} (${course.credits} TC)`;
        details += `\n   - Loại: ${course.isRequired ? 'Bắt buộc' : 'Tự chọn'}`;
        if (course.prerequisites && course.prerequisites.length > 0) {
          details += `\n   - Tiên quyết: ${course.prerequisites.join(', ')}`;
        }
        if (course.corequisites && course.corequisites.length > 0) {
          details += `\n   - Song hành: ${course.corequisites.join(', ')}`;
        }
        if (course.minCreditsRequired > 0) {
          details += `\n   - Yêu cầu tối thiểu: ${course.minCreditsRequired} TC`;
        }
        if (course.groupId) {
          details += `\n   - Nhóm: ${course.groupId}`;
        }
      });
    } else {
      details += '\n(Chưa có môn học)';
    }

    if (groupIds.length > 0) {
      details += `\n\nNHÓM TỰ CHỌN:`;
      for (let groupId of groupIds) {
        try {
          const group = await contract.methods.getElectiveGroup(programId, groupId).call();
          details += `\n- [${group._groupId}] ${group._groupName}`;
          details += `\n  Chọn tối thiểu: ${group._requiredCredits} TC`;
          details += `\n  Các môn: ${group._courseIds.join(', ')}`;
        } catch (e) {
          details += `\n- [${groupId}] (Không thể load chi tiết)`;
        }
      }
    }

    alert(details);
    showStatus('✅ Đã tải xong!', 'success');

  } catch (error) {
    console.error('Lỗi:', error);
    showStatus('❌ Lỗi: ' + error.message, 'error');
  }
}

// ============ HELPER FUNCTIONS ============

async function setProgramClass() {
  if (!contract || !currentAccount) {
    showClassStatus('❌ Chưa kết nối MetaMask!', 'error');
    return;
  }

  const programId = document.getElementById('classProgramId').value.trim();
  const classNames = document.getElementById('className').value.trim();

  if (!programId) {
    showClassStatus('❌ Vui lòng chọn chương trình!', 'error');
    return;
  }

  if (!classNames) {
    showClassStatus('❌ Vui lòng nhập tên lớp!', 'error');
    return;
  }

  try {
    showClassStatus('⏳ Đang kiểm tra và gán class...', 'info');

    // Tách các class bằng dấu phẩy
    const classList = classNames.split(',').map(c => c.trim()).filter(c => c.length > 0);

    if (classList.length === 0) {
      showClassStatus('❌ Không có class hợp lệ!', 'error');
      return;
    }

    console.log('📝 Các lớp muốn gán:', classList);

    // Kiểm tra xem class đã được gán chưa (optional - có thể bỏ qua để tiết kiệm thời gian)
    const validClasses = [];
    for (const className of classList) {
      try {
        const existingProgram = await contract.methods.getProgramByClass(className).call();
        if (existingProgram && existingProgram !== '' && existingProgram !== programId) {
          showClassStatus(`⚠️ Class "${className}" đã thuộc chương trình "${existingProgram}"! Bỏ qua...`, 'error');
          console.log(`⚠️ Class "${className}" đã thuộc chương trình "${existingProgram}"`);
          continue;
        }
      } catch (e) {
        // Class chưa được gán, OK
      }
      validClasses.push(className);
    }

    if (validClasses.length === 0) {
      showClassStatus('❌ Không có class hợp lệ nào để gán!', 'error');
      return;
    }

    if (validClasses.length < classList.length) {
      showClassStatus(`⚠️ Chỉ gán ${validClasses.length}/${classList.length} class (một số đã tồn tại)...`, 'info');
    } else {
      showClassStatus(`⏳ Đang gán ${validClasses.length} class vào chương trình...`, 'info');
    }

    // GỌI batchSetProgramClass() - CHỈ KÝ MỘT LẦN
    const tx = await contract.methods.batchSetProgramClass(programId, validClasses).send({
      from: currentAccount,
      gas: 500000 + (validClasses.length * 100000) // Tính gas động theo số lượng class
    });

    console.log(`✅ Đã gán ${validClasses.length} class trong một transaction:`, tx.transactionHash);

    showClassStatus(
      `✅ Đã gán thành công ${validClasses.length} class!\n` +
      `Classes: ${validClasses.join(', ')}\n` +
      `Transaction: ${tx.transactionHash.substring(0, 10)}...`,
      'success'
    );
    
    // Clear form
    document.getElementById('className').value = '';
    
    // Reload danh sách chương trình để hiển thị class mới được gán
    await loadPrograms();

  } catch (error) {
    console.error('Lỗi gán class:', error);
    showClassStatus('❌ Lỗi: ' + error.message, 'error');
  }
}

function showClassStatus(message, type) {
  const statusDiv = document.getElementById('classStatus');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';

  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';

  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}

// ============ DEBUG FUNCTION ============

async function debugProgramClasses() {
  if (!contract) {
    alert('Vui lòng kết nối MetaMask trước!');
    return;
  }

  console.log('🔍 ========== DEBUG PROGRAM CLASSES ==========');
  
  try {
    // 1. Lấy tất cả các chương trình
    const totalPrograms = await contract.methods.getTotalPrograms().call();
    console.log(`📚 Tổng số chương trình: ${totalPrograms}`);

    // 2. Lấy events
    console.log('\n🔍 Đang lấy events ProgramClassSet...');
    const events = await contract.getPastEvents('ProgramClassSet', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    
    console.log(`📊 Tìm thấy ${events.length} events`);
    
    if (events.length === 0) {
      alert('⚠️ Không tìm thấy event nào!\n\nNguyên nhân có thể:\n1. Chưa gán class cho chương trình nào\n2. Ganache đã reset (mất dữ liệu cũ)\n3. Contract address không đúng');
      console.log('⚠️ Không có events. Có thể Ganache đã được reset!');
      return;
    }

    // 3. Hiển thị chi tiết từng event (decode từ transaction)
    console.log('\n📋 Chi tiết events (decoded):');
    const programClasses = {};
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      try {
        const tx = await web3.eth.getTransaction(event.transactionHash);
        const decoded = web3.eth.abi.decodeParameters(
          ['string', 'string'],
          '0x' + tx.input.slice(10)
        );
        
        const programId = decoded[0];
        const className = decoded[1];
        
        console.log(`  Event ${i + 1}:`);
        console.log(`    - Program ID: "${programId}"`);
        console.log(`    - Class Name: "${className}"`);
        console.log(`    - Block: ${event.blockNumber}`);
        console.log(`    - Transaction: ${event.transactionHash}`);
        
        // Tổng hợp
        if (!programClasses[programId]) {
          programClasses[programId] = [];
        }
        if (!programClasses[programId].includes(className)) {
          programClasses[programId].push(className);
        }
      } catch (e) {
        console.log(`  Event ${i + 1}: ERROR decoding - ${e.message}`);
      }
    }

    // 4. Test trực tiếp bằng getProgramByClass
    console.log('\n🔍 Test getProgramByClass cho từng class:');
    const uniqueClasses = [];
    for (let programId in programClasses) {
      uniqueClasses.push(...programClasses[programId]);
    }
    
    for (let className of uniqueClasses) {
      try {
        const programId = await contract.methods.getProgramByClass(className).call();
        console.log(`  Class "${className}" -> Program "${programId}"`);
      } catch (e) {
        console.log(`  Class "${className}" -> ERROR: ${e.message}`);
      }
    }

    // 5. Tổng hợp theo program
    console.log('\n📊 Tổng hợp classes theo program:');
    for (let programId in programClasses) {
      console.log(`  Program "${programId}": ${programClasses[programId].join(', ')}`);
    }

    console.log('\n✅ Debug hoàn tất! Kiểm tra console để xem chi tiết.');
    alert(`✅ Debug hoàn tất!\n\n${events.length} events được tìm thấy\n${Object.keys(programClasses).length} chương trình có class\n\nXem Console (F12) để biết chi tiết`);

  } catch (error) {
    console.error('❌ Lỗi debug:', error);
    alert('❌ Lỗi: ' + error.message);
  }

  console.log('🔍 ========== END DEBUG ==========\n');
}

// ============ INIT ============

window.onload = async function() {
  // Hiển thị contract address ngay khi load trang
  const contractAddressSpan = document.getElementById('contractAddress');
  if (contractAddressSpan) {
    contractAddressSpan.textContent = contractAddress;
  }
  
  console.log('Admin Programs page loaded. Click "Kết nối MetaMask" to connect.');
  console.log('Contract Address:', contractAddress);
};
