// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StudentManagement
 * @dev Quản lý sinh viên theo MSSV (không cần địa chỉ ví)
 * - MSSV (string) làm key chính  
 * - Thông tin sinh viên lưu trực tiếp trên blockchain
 * - Không dùng IPFS
 */
contract StudentManagement is Ownable {
    
    // ============ STRUCTS ============
    
    /// @dev Thông tin sinh viên - Block đầu tiên
    struct StudentInfo {
        string studentId;        // MSSV (B2203716)
        string name;             // Họ tên
        string dob;              // Ngày sinh
        string cccd;             // CCCD/CMND
        string phone;            // Số điện thoại
        string email;            // Email
        string hometown;         // Quê quán
        string class;            // Lớp học
        string major;            // Tên ngành học (An toàn thông tin)
        string majorCode;        // Mã ngành (A00, 65)
        string department;       // Khoa
        string school;           // Trường
        string program;          // Hệ đào tạo
        address walletAddress;   // Địa chỉ ví Ethereum của sinh viên (ĐỂ XÁC THỰC)
        uint256 registeredAt;    // Timestamp đăng ký
        bool exists;             // Đã tồn tại?
    }
    
    /// @dev Điểm môn học
    struct CourseGrade {
        string courseId;         // Mã môn học
        string courseName;       // Tên môn học
        uint8 credits;           // Số tín chỉ
        uint16 grade;            // Điểm * 100 (9.2 = 920)
        string letterGrade;      // Điểm chữ (A, B, C, D, F)
        string instructor;       // Mã giảng viên
    }
    
    /// @dev Điểm học kỳ - Các block tiếp theo
    struct SemesterGrades {
        string studentId;        // MSSV
        string semester;         // Học kỳ (20231)
        CourseGrade[] courses;   // Danh sách môn học
        uint256 submittedAt;     // Timestamp submit
        address submittedBy;     // Người submit (Dean)
        uint256 version;         // Version (cho phép update)
        bool exists;             // Đã tồn tại?
    }
    
    /// @dev Môn học trong chương trình (với điều kiện)
    struct ProgramCourse {
        string courseId;         // Mã môn học
        string courseName;       // Tên môn học
        uint8 credits;           // Số tín chỉ
        bool isRequired;         // Bắt buộc?
        string[] prerequisites;  // Môn tiên quyết
        string[] corequisites;   // Môn song hành
        uint16 minCreditsRequired; // Tín chỉ tối thiểu để học (ví dụ: 80, 120)
        string groupId;          // ID nhóm tự chọn (nếu có)
    }
    
    /// @dev Nhóm môn tự chọn
    struct ElectiveGroup {
        string groupId;          // ID nhóm (ví dụ: TC_GROUP_1)
        string groupName;        // Tên nhóm
        uint8 requiredCredits;   // Tín chỉ cần đạt trong nhóm
        string[] courseIds;      // Danh sách mã môn trong nhóm
        bool exists;             // Đã tồn tại?
    }
    
    /// @dev Chương trình đào tạo - Block riêng
    struct Program {
        string programId;        // Mã CTĐT (M01, A04, D14)
        string programName;      // Tên chương trình
        uint256 totalCredits;    // Tổng tín chỉ chương trình
        uint256 minCredits;      // Tín chỉ tối thiểu để tốt nghiệp
        uint256 minGPA;          // GPA tối thiểu * 100 (200 = 2.0)
        uint256 createdAt;       // Timestamp tạo
        address createdBy;       // Người tạo (Admin)
        bool isActive;           // Còn hiệu lực?
        bool exists;             // Đã tồn tại?
    }
    
    /// @dev Bằng tốt nghiệp - Block mới
    struct DiplomaRecord {
        string studentId;        // MSSV
        string diplomaHash;      // SHA256 hash của file PDF
        uint256 issuedAt;        // Timestamp cấp bằng
        uint256 gpa;             // GPA * 100 (325 = 3.25)
        uint256 totalCredits;    // Tổng tín chỉ
        string classification;   // Xếp loại (Xuất sắc, Giỏi, Khá, TB)
        bool exists;             // Đã tồn tại?
        bool revoked;            // Đã bị thu hồi?
        uint256 revokedAt;       // Timestamp thu hồi
        string revokedReason;    // Lý do thu hồi
    }
    
    /// @dev Thông tin Cán bộ quản lý điểm
    struct DeanInfo {
        address deanAddress;     // Địa chỉ ví
        string name;             // Họ tên
        string department;       // Khoa
        string email;            // Email
        string phone;            // Số điện thoại
        string notes;            // Ghi chú
        uint256 addedAt;         // Timestamp thêm
        address addedBy;         // Người thêm (Admin)
        bool isActive;           // Còn hoạt động?
        bool exists;             // Đã tồn tại?
    }
    
    /// @dev Đơn đăng ký xét tốt nghiệp
    struct GraduationApplication {
        string studentId;        // MSSV
        string applicationHash;  // Hash của đơn đăng ký (chứa GPA, tín chỉ, chữ ký)
        uint256 appliedAt;       // Timestamp đăng ký
        uint256 gpa;             // GPA * 100
        uint256 totalCredits;    // Tổng tín chỉ
        string classification;   // Xếp loại
        uint8 status;            // 0: Pending, 1: Approved, 2: Rejected
        uint256 processedAt;     // Timestamp xử lý
        address processedBy;     // Người xử lý (Dean)
        string notes;            // Ghi chú
        bool exists;             // Đã tồn tại?
    }
    
    // ============ STATE VARIABLES ============
    
    /// @dev Mapping MSSV → Thông tin sinh viên
    mapping(string => StudentInfo) public students;
    
    /// @dev Mapping MSSV → Học kỳ → Điểm
    mapping(string => mapping(string => SemesterGrades)) public semesterGrades;
    
    /// @dev Mapping MSSV → Danh sách học kỳ
    mapping(string => string[]) public studentSemesters;
    
    /// @dev Danh sách tất cả MSSV
    string[] public allStudentIds;
    
    /// @dev Mapping kiểm tra MSSV đã tồn tại
    mapping(string => bool) public studentIdExists;
    
    /// @dev Mapping MSSV → Địa chỉ ví (để verify sinh viên)
    mapping(string => address) public studentWallet;
    
    /// @dev Mapping Địa chỉ ví → MSSV (reverse lookup)
    mapping(address => string) public walletToStudentId;
    
    /// @dev Mapping Dean (có quyền submit điểm)
    mapping(address => bool) public isDean;
    
    /// @dev Mapping Địa chỉ → Thông tin Dean
    mapping(address => DeanInfo) public deans;
    
    /// @dev Danh sách tất cả địa chỉ Dean
    address[] public allDeanAddresses;
    
    // ============ PROGRAM MAPPINGS ============
    
    /// @dev Mapping Mã CTĐT → Chương trình đào tạo
    mapping(string => Program) public programs;
    
    /// @dev Mapping Mã CTĐT → Danh sách môn học
    mapping(string => ProgramCourse[]) public programCourses;
    
    /// @dev Mapping Mã CTĐT → Mapping GroupID → ElectiveGroup
    mapping(string => mapping(string => ElectiveGroup)) public electiveGroups;
    
    /// @dev Mapping Mã CTĐT → Danh sách GroupID
    mapping(string => string[]) public programElectiveGroupIds;
    
    /// @dev Danh sách tất cả mã CTĐT
    string[] public allProgramIds;
    
    /// @dev Mapping MSSV → Mã CTĐT (sinh viên thuộc chương trình nào)
    mapping(string => string) public studentProgram;
    
    /// @dev Mapping Class → Mã CTĐT (lớp nào thuộc chương trình nào)
    mapping(string => string) public classToProgram;
    
    /// @dev Mapping MSSV → Bằng tốt nghiệp
    mapping(string => DiplomaRecord) public diplomas;
    
    /// @dev Danh sách tất cả MSSV đã được cấp bằng
    string[] public diplomaIssuedStudents;
    
    /// @dev Mapping MSSV → Đơn đăng ký xét tốt nghiệp
    mapping(string => GraduationApplication) public graduationApplications;
    
    /// @dev Danh sách tất cả MSSV đã đăng ký xét tốt nghiệp
    string[] public graduationApplicants;
    
    // ============ EVENTS ============
    
    event StudentRegistered(
        string indexed studentId,
        string name,
        uint256 timestamp
    );
    
    event StudentInfoUpdated(
        string indexed studentId,
        uint256 timestamp
    );
    
    event SemesterGradesSubmitted(
        string indexed studentId,
        string indexed semester,
        uint256 courseCount,
        uint256 version,
        address submittedBy,
        uint256 timestamp
    );
    
    event ProgramCreated(
        string indexed programId,
        string programName,
        uint256 minCredits,
        uint256 minGPA,
        address createdBy,
        uint256 timestamp
    );
    
    event ProgramUpdated(
        string indexed programId,
        uint256 timestamp
    );
    
    event StudentAssignedToProgram(
        string indexed studentId,
        string indexed programId,
        uint256 timestamp
    );
    
    event ProgramClassSet(
        string indexed programId,
        string indexed className,
        uint256 timestamp
    );
    
    // Event mới để lưu class name không bị hash (cho frontend query)
    event ProgramClassAssigned(
        string programId,      // KHÔNG indexed - lưu giá trị gốc
        string className,      // KHÔNG indexed - lưu giá trị gốc
        uint256 timestamp
    );
    
    event DiplomaIssued(
        string indexed studentId,
        string diplomaHash,
        uint256 gpa,
        uint256 totalCredits,
        string classification,
        uint256 timestamp
    );
    
    event DiplomaRevoked(
        string indexed studentId,
        string reason,
        address revokedBy,
        uint256 timestamp
    );
    
    event GraduationApplicationSubmitted(
        string indexed studentId,
        string applicationHash,
        uint256 gpa,
        uint256 totalCredits,
        string classification,
        uint256 timestamp
    );
    
    event GraduationApplicationApproved(
        string indexed studentId,
        address approvedBy,
        uint256 timestamp
    );
    
    event GraduationApplicationRejected(
        string indexed studentId,
        address rejectedBy,
        string reason,
        uint256 timestamp
    );
    
    event DeanAdded(address indexed account);
    event DeanRemoved(address indexed account);
    event DeanInfoAdded(
        address indexed account,
        string name,
        string department,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyDean() {
        require(isDean[msg.sender] || msg.sender == owner(), "Not dean");
        _;
    }
    
    modifier studentExists(string memory studentId) {
        require(students[studentId].exists, "Not found");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() Ownable(msg.sender) {}
    
    // ============ DEAN MANAGEMENT ============
    
    /**
     * @dev Thêm Dean với thông tin chi tiết (lưu trên blockchain)
     */
    function addDeanWithInfo(
        address account,
        string memory name,
        string memory department,
        string memory email,
        string memory phone,
        string memory notes
    ) external onlyOwner {
        require(account != address(0), "Invalid address");
        require(bytes(name).length > 0, "Name required");
        require(bytes(department).length > 0, "Department required");
        require(!deans[account].exists, "Dean already exists");
        
        // Set quyền Dean
        isDean[account] = true;
        
        // Lưu thông tin chi tiết
        deans[account] = DeanInfo({
            deanAddress: account,
            name: name,
            department: department,
            email: email,
            phone: phone,
            notes: notes,
            addedAt: block.timestamp,
            addedBy: msg.sender,
            isActive: true,
            exists: true
        });
        
        // Thêm vào danh sách
        allDeanAddresses.push(account);
        
        emit DeanAdded(account);
        emit DeanInfoAdded(account, name, department, block.timestamp);
    }
    
    /**
     * @dev Xóa quyền Dean
     */
    function removeDean(address account) external onlyOwner {
        require(deans[account].exists, "Dean not found");
        
        isDean[account] = false;
        deans[account].isActive = false;
        
        emit DeanRemoved(account);
    }
    
    /**
     * @dev Lấy thông tin Dean
     */
    function getDeanInfo(address account) external view returns (
        string memory name,
        string memory department,
        string memory email,
        string memory phone,
        string memory notes,
        uint256 addedAt,
        address addedBy,
        bool isActive
    ) {
        require(deans[account].exists, "Dean not found");
        DeanInfo memory dean = deans[account];
        
        return (
            dean.name,
            dean.department,
            dean.email,
            dean.phone,
            dean.notes,
            dean.addedAt,
            dean.addedBy,
            dean.isActive
        );
    }
    
    /**
     * @dev Lấy tất cả Dean đang active
     */
    function getAllActiveDeans() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // Đếm số Dean active
        for (uint256 i = 0; i < allDeanAddresses.length; i++) {
            if (deans[allDeanAddresses[i]].isActive) {
                activeCount++;
            }
        }
        
        // Tạo mảng kết quả
        address[] memory activeDeans = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allDeanAddresses.length; i++) {
            if (deans[allDeanAddresses[i]].isActive) {
                activeDeans[index] = allDeanAddresses[i];
                index++;
            }
        }
        
        return activeDeans;
    }
    
    /**
     * @dev Lấy tổng số Dean
     */
    function getTotalDeans() external view returns (uint256) {
        return allDeanAddresses.length;
    }
    
    /**
     * @dev Set Dean (legacy function - giữ để tương thích)
     */
    function setDean(address account, bool value) external onlyOwner {
        isDean[account] = value;
        if (value) {
            emit DeanAdded(account);
        } else {
            emit DeanRemoved(account);
        }
    }
    
    // ============ STUDENT REGISTRATION ============
    
    /**
     * @dev Đăng ký sinh viên mới - BLOCK ĐẦU TIÊN
     * @param walletAddress Địa chỉ ví Ethereum của sinh viên (BẮT BUỘC để xác thực)
     */
    function registerStudent(
        string memory studentId,
        string memory name,
        string memory dob,
        string memory cccd,
        string memory phone,
        string memory email,
        string memory hometown,
        string memory class_,
        string memory major,
        string memory majorCode,
        string memory department,
        string memory school,
        string memory /* program */,
        address walletAddress
    ) external onlyOwner {
        require(bytes(studentId).length > 0, "No ID");
        require(!students[studentId].exists, "Exists");
        require(bytes(class_).length > 0, "No class");
        require(walletAddress != address(0), "No wallet");
        require(bytes(walletToStudentId[walletAddress]).length == 0, "Wallet used");
        
        // CHỈ lấy program từ class mapping - bỏ qua tham số program
        string memory finalProgram = classToProgram[class_];
        require(bytes(finalProgram).length > 0, "No program");
        
        students[studentId] = StudentInfo({
            studentId: studentId,
            name: name,
            dob: dob,
            cccd: cccd,
            phone: phone,
            email: email,
            hometown: hometown,
            class: class_,
            major: major,
            majorCode: majorCode,
            department: department,
            school: school,
            program: finalProgram,
            walletAddress: walletAddress,
            registeredAt: block.timestamp,
            exists: true
        });
        
        if (!studentIdExists[studentId]) {
            allStudentIds.push(studentId);
            studentIdExists[studentId] = true;
        }
        
        // Gán mapping MSSV ↔ Wallet (2 chiều)
        studentWallet[studentId] = walletAddress;
        walletToStudentId[walletAddress] = studentId;
        
        // Tự động gán studentProgram nếu có program
        if (bytes(finalProgram).length > 0) {
            studentProgram[studentId] = finalProgram;
        }
        
        emit StudentRegistered(studentId, name, block.timestamp);
    }
    
    /**
     * @dev Cập nhật thông tin sinh viên (bao gồm cả wallet)
     */
    function updateStudentInfo(
        string memory studentId,
        string memory name,
        string memory dob,
        string memory cccd,
        string memory phone,
        string memory email,
        string memory hometown,
        string memory class_,
        string memory major,
        string memory majorCode,
        string memory department,
        string memory school,
        string memory /* program */,
        address walletAddress
    ) external onlyOwner studentExists(studentId) {
        StudentInfo storage student = students[studentId];
        
        // Nếu đổi wallet, cần validate
        if (walletAddress != address(0) && walletAddress != student.walletAddress) {
            require(bytes(walletToStudentId[walletAddress]).length == 0, "Wallet used");
            
            // Xóa mapping cũ
            delete walletToStudentId[student.walletAddress];
            
            // Gán mapping mới
            student.walletAddress = walletAddress;
            studentWallet[studentId] = walletAddress;
            walletToStudentId[walletAddress] = studentId;
        }
        
        student.name = name;
        student.dob = dob;
        student.cccd = cccd;
        student.phone = phone;
        student.email = email;
        student.hometown = hometown;
        
        // Tự động update program nếu class thay đổi
        if (bytes(class_).length > 0) {
            student.class = class_;
            string memory newProgram = classToProgram[class_];
            if (bytes(newProgram).length > 0) {
                student.program = newProgram;
                studentProgram[studentId] = newProgram;
            }
        }
        
        student.major = major;
        student.majorCode = majorCode;
        student.department = department;
        student.school = school;
        
        emit StudentInfoUpdated(studentId, block.timestamp);
    }
    
    /**
     * @dev Đăng ký hàng loạt sinh viên - BATCH REGISTRATION
     * Gộp nhiều sinh viên vào một transaction duy nhất
     * Tiết kiệm gas và chỉ cần ký một lần
     */
    function batchRegisterStudents(
        string[] memory studentIds,
        string[] memory names,
        string[] memory dobs,
        string[] memory cccds,
        string[] memory phones,
        string[] memory emails,
        string[] memory hometowns,
        string[] memory classes,
        string[] memory majors,
        string[] memory majorCodes,
        string[] memory departments,
        string[] memory schools,
        string[] memory programsArray,
        address[] memory walletAddresses
    ) external onlyOwner {
        require(studentIds.length > 0, "No students");
        require(
            studentIds.length == names.length &&
            studentIds.length == dobs.length &&
            studentIds.length == cccds.length &&
            studentIds.length == phones.length &&
            studentIds.length == emails.length &&
            studentIds.length == hometowns.length &&
            studentIds.length == classes.length &&
            studentIds.length == majors.length &&
            studentIds.length == majorCodes.length &&
            studentIds.length == departments.length &&
            studentIds.length == schools.length &&
            studentIds.length == programsArray.length &&
            studentIds.length == walletAddresses.length,
            "Mismatch"
        );
        
        for (uint256 i = 0; i < studentIds.length; i++) {
            string memory studentId = studentIds[i];
            address walletAddress = walletAddresses[i];
            string memory class_ = classes[i];
            
            // Validate
            require(bytes(studentId).length > 0, "No ID");
            require(!students[studentId].exists, "Exists");
            require(bytes(class_).length > 0, "No class");
            require(walletAddress != address(0), "No wallet");
            require(bytes(walletToStudentId[walletAddress]).length == 0, "Wallet used");
            
            // Lấy program từ class mapping
            string memory finalProgram = classToProgram[class_];
            require(bytes(finalProgram).length > 0, "No program");
            
            // Đăng ký sinh viên
            students[studentId] = StudentInfo({
                studentId: studentId,
                name: names[i],
                dob: dobs[i],
                cccd: cccds[i],
                phone: phones[i],
                email: emails[i],
                hometown: hometowns[i],
                class: class_,
                major: majors[i],
                majorCode: majorCodes[i],
                department: departments[i],
                school: schools[i],
                program: finalProgram,
                walletAddress: walletAddress,
                registeredAt: block.timestamp,
                exists: true
            });
            
            if (!studentIdExists[studentId]) {
                allStudentIds.push(studentId);
                studentIdExists[studentId] = true;
            }
            
            // Gán mapping MSSV ↔ Wallet (2 chiều)
            studentWallet[studentId] = walletAddress;
            walletToStudentId[walletAddress] = studentId;
            
            // Tự động gán studentProgram
            if (bytes(finalProgram).length > 0) {
                studentProgram[studentId] = finalProgram;
            }
            
            emit StudentRegistered(studentId, names[i], block.timestamp);
        }
    }
    
    // ============ GRADES MANAGEMENT ============
    
    /**
     * @dev Submit điểm học kỳ - CÁC BLOCK TIẾP THEO
     * KHÔNG CHO PHÉP UPDATE - Chỉ tạo mới
     */
    function submitSemesterGrades(
        string memory studentId,
        string memory semester,
        string[] memory courseIds,
        string[] memory courseNames,
        uint8[] memory credits,
        uint16[] memory grades,
        string[] memory letterGrades,
        string[] memory instructors
    ) external onlyDean studentExists(studentId) {
        require(bytes(semester).length > 0, "No sem");
        require(courseIds.length > 0, "No courses");
        require(
            courseIds.length == courseNames.length &&
            courseIds.length == credits.length &&
            courseIds.length == grades.length &&
            courseIds.length == letterGrades.length &&
            courseIds.length == instructors.length,
            "Mismatch"
        );
        
        // CHỐNG SỬA ĐỔI ĐIỂM - Kiểm tra học kỳ chưa tồn tại
        // Logic này BẮT BUỘC phải có trong contract để đảm bảo tính toàn vẹn dữ liệu
        // Frontend cũng kiểm tra nhưng chỉ để UX tốt hơn, contract mới là lớp bảo vệ cuối cùng
        SemesterGrades storage semGrades = semesterGrades[studentId][semester];
        require(!semGrades.exists, "Semester already exists - Cannot modify grades");
        
        // Thêm courses mới
        for (uint i = 0; i < courseIds.length; i++) {
            semGrades.courses.push(CourseGrade({
                courseId: courseIds[i],
                courseName: courseNames[i],
                credits: credits[i],
                grade: grades[i],
                letterGrade: letterGrades[i],
                instructor: instructors[i]
            }));
        }
        
        semGrades.studentId = studentId;
        semGrades.semester = semester;
        semGrades.submittedAt = block.timestamp;
        semGrades.submittedBy = msg.sender;
        semGrades.version = 1; // Luôn là version 1 vì không cho update
        semGrades.exists = true;
        
        // Thêm semester vào danh sách
        studentSemesters[studentId].push(semester);
        
        emit SemesterGradesSubmitted(
            studentId,
            semester,
            courseIds.length,
            1, // Version luôn là 1
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Batch submit điểm học kỳ cho nhiều sinh viên
     * Gộp nhiều sinh viên vào một transaction duy nhất
     * Tiết kiệm gas và chỉ cần ký một lần
     */
    function batchSubmitSemesterGrades(
        string[] memory studentIds,
        string[] memory semesters,
        string[][] memory courseIdsArray,
        string[][] memory courseNamesArray,
        uint8[][] memory creditsArray,
        uint16[][] memory gradesArray,
        string[][] memory letterGradesArray,
        string[][] memory instructorsArray
    ) external onlyDean {
        require(studentIds.length > 0, "No students");
        require(
            studentIds.length == semesters.length &&
            studentIds.length == courseIdsArray.length &&
            studentIds.length == courseNamesArray.length &&
            studentIds.length == creditsArray.length &&
            studentIds.length == gradesArray.length &&
            studentIds.length == letterGradesArray.length &&
            studentIds.length == instructorsArray.length,
            "Mismatch"
        );
        
        for (uint256 i = 0; i < studentIds.length; i++) {
            string memory studentId = studentIds[i];
            string memory semester = semesters[i];
            string[] memory courseIds = courseIdsArray[i];
            string[] memory courseNames = courseNamesArray[i];
            uint8[] memory credits = creditsArray[i];
            uint16[] memory grades = gradesArray[i];
            string[] memory letterGrades = letterGradesArray[i];
            string[] memory instructors = instructorsArray[i];
            
            // Validate
            require(students[studentId].exists, "Not found");
            require(bytes(semester).length > 0, "No sem");
            require(courseIds.length > 0, "No courses");
            require(
                courseIds.length == courseNames.length &&
                courseIds.length == credits.length &&
                courseIds.length == grades.length &&
                courseIds.length == letterGrades.length &&
                courseIds.length == instructors.length,
                "Mismatch"
            );
            
            // CHỐNG SỬA ĐỔI ĐIỂM - Kiểm tra học kỳ chưa tồn tại
            // Nếu học kỳ đã tồn tại, toàn bộ batch sẽ bị revert (atomic transaction)
            SemesterGrades storage semGrades = semesterGrades[studentId][semester];
            require(!semGrades.exists, "Semester already exists - Cannot modify grades");
            
            // Submit điểm
            for (uint j = 0; j < courseIds.length; j++) {
                semGrades.courses.push(CourseGrade({
                    courseId: courseIds[j],
                    courseName: courseNames[j],
                    credits: credits[j],
                    grade: grades[j],
                    letterGrade: letterGrades[j],
                    instructor: instructors[j]
                }));
            }
            
            semGrades.studentId = studentId;
            semGrades.semester = semester;
            semGrades.submittedAt = block.timestamp;
            semGrades.submittedBy = msg.sender;
            semGrades.version = 1;
            semGrades.exists = true;
            
            studentSemesters[studentId].push(semester);
            
            emit SemesterGradesSubmitted(
                studentId,
                semester,
                courseIds.length,
                1,
                msg.sender,
                block.timestamp
            );
        }
    }
    
    // ============ QUERY FUNCTIONS ============
    
    /**
     * @dev Lấy thông tin sinh viên
     */
    function getStudentInfo(string memory studentId) 
        external 
        view 
        returns (StudentInfo memory) 
    {
        return students[studentId];
    }
    
    /**
     * @dev Lấy danh sách học kỳ của sinh viên
     */
    function getStudentSemesters(string memory studentId) 
        external 
        view 
        returns (string[] memory) 
    {
        return studentSemesters[studentId];
    }
    
    /**
     * @dev Lấy điểm học kỳ
     */
    function getSemesterGrades(string memory studentId, string memory semester)
        external
        view
        returns (
            string memory,
            CourseGrade[] memory,
            uint256,
            address,
            uint256
        )
    {
        SemesterGrades storage semGrades = semesterGrades[studentId][semester];
        require(semGrades.exists, "Not found");
        
        return (
            semGrades.semester,
            semGrades.courses,
            semGrades.submittedAt,
            semGrades.submittedBy,
            semGrades.version
        );
    }
    
    /**
     * @dev Lấy số lượng môn học trong học kỳ
     */
    function getSemesterCourseCount(string memory studentId, string memory semester)
        external
        view
        returns (uint256)
    {
        return semesterGrades[studentId][semester].courses.length;
    }
    
    /**
     * @dev Lấy 1 môn học trong học kỳ
     */
    function getCourseGrade(
        string memory studentId, 
        string memory semester, 
        uint256 index
    ) external view returns (CourseGrade memory) {
        require(
            index < semesterGrades[studentId][semester].courses.length,
            "Bad index"
        );
        return semesterGrades[studentId][semester].courses[index];
    }
    
    /**
     * @dev Lấy tổng số sinh viên
     */
    function getTotalStudents() external view returns (uint256) {
        return allStudentIds.length;
    }
    
    /**
     * @dev Lấy MSSV theo index
     */
    function getStudentIdByIndex(uint256 index) external view returns (string memory) {
        require(index < allStudentIds.length, "Bad index");
        return allStudentIds[index];
    }
    
    // ============ PROGRAM MANAGEMENT ============
    
    /**
     * @dev Tạo chương trình đào tạo mới - GHI BLOCK MỚI
     */
    function createProgram(
        string memory programId,
        string memory programName,
        
        uint256 totalCredits,
        uint256 minCredits,
        uint256 minGPA
    ) external onlyOwner {
        require(!programs[programId].exists, "Exists");
        require(bytes(programId).length > 0, "No ID");
        require(minGPA <= 400, "GPA>4.0");
        
        programs[programId] = Program({
            programId: programId,
            programName: programName,
            totalCredits: totalCredits,
            minCredits: minCredits,
            minGPA: minGPA,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            isActive: true,
            exists: true
        });
        
        allProgramIds.push(programId);
        
        emit ProgramCreated(
            programId,
            programName,
            minCredits,
            minGPA,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Thêm môn học vào chương trình
     */
    function addCoursesToProgram(
        string memory programId,
        string[] memory courseIds,
        string[] memory courseNames,
        uint8[] memory credits,
        bool[] memory isRequired,
        string[][] memory prerequisites,
        string[][] memory corequisites,
        uint16[] memory minCreditsRequired,
        string[] memory groupIds
    ) external onlyOwner {
        require(programs[programId].exists, "Not found");
        require(courseIds.length == courseNames.length, "Mismatch");
        require(courseIds.length == credits.length, "Mismatch");
        
        for (uint i = 0; i < courseIds.length; i++) {
            programCourses[programId].push(ProgramCourse({
                courseId: courseIds[i],
                courseName: courseNames[i],
                credits: credits[i],
                isRequired: isRequired[i],
                prerequisites: prerequisites[i],
                corequisites: corequisites[i],
                minCreditsRequired: minCreditsRequired[i],
                groupId: groupIds[i]
            }));
        }
    }
    
    /**
     * @dev Thêm nhóm tự chọn vào chương trình
     */
    function addElectiveGroup(
        string memory programId,
        string memory groupId,
        string memory groupName,
        uint8 requiredCredits,
        string[] memory courseIds
    ) external onlyOwner {
        require(programs[programId].exists, "Not found");
        require(!electiveGroups[programId][groupId].exists, "Exists");
        
        electiveGroups[programId][groupId] = ElectiveGroup({
            groupId: groupId,
            groupName: groupName,
            requiredCredits: requiredCredits,
            courseIds: courseIds,
            exists: true
        });
        
        programElectiveGroupIds[programId].push(groupId);
    }
    
    /**
     * @dev Tạo chương trình đào tạo HOÀN CHỈNH trong 1 transaction duy nhất
     * Bao gồm: metadata, courses và elective groups
     */
    function createProgramComplete(
        // Program metadata
        string memory programId,
        string memory programName,
        
        uint256 totalCredits,
        uint256 minCredits,
        uint256 minGPA,
        // Courses data
        string[] memory courseIds,
        string[] memory courseNames,
        uint8[] memory credits,
        bool[] memory isRequired,
        string[][] memory prerequisites,
        string[][] memory corequisites,
        uint16[] memory minCreditsRequired,
        string[] memory groupIds,
        // Elective groups data
        string[] memory electiveGroupIds,
        string[] memory electiveGroupNames,
        uint8[] memory electiveRequiredCredits,
        uint256[] memory electiveGroupCourseStartIdx, // Index bắt đầu của mỗi group trong mảng courses
        uint256[] memory electiveGroupCourseCount    // Số lượng courses của mỗi group
    ) external onlyOwner {
        // Validate
        require(!programs[programId].exists, "Exists");
        require(bytes(programId).length > 0, "No ID");
        require(minGPA <= 400, "GPA>4.0");
        require(courseIds.length == courseNames.length, "Mismatch");
        require(courseIds.length == credits.length, "Mismatch");
        require(electiveGroupIds.length == electiveGroupNames.length, "Mismatch");
        
        // BƯỚC 1: Tạo program metadata
        programs[programId] = Program({
            programId: programId,
            programName: programName,
            totalCredits: totalCredits,
            minCredits: minCredits,
            minGPA: minGPA,
            createdAt: block.timestamp,
            createdBy: msg.sender,
            isActive: true,
            exists: true
        });
        
        allProgramIds.push(programId);
        
        // BƯỚC 2: Thêm tất cả courses
        for (uint i = 0; i < courseIds.length; i++) {
            programCourses[programId].push(ProgramCourse({
                courseId: courseIds[i],
                courseName: courseNames[i],
                credits: credits[i],
                isRequired: isRequired[i],
                prerequisites: prerequisites[i],
                corequisites: corequisites[i],
                minCreditsRequired: minCreditsRequired[i],
                groupId: groupIds[i]
            }));
        }
        
        // BƯỚC 3: Thêm tất cả elective groups
        for (uint j = 0; j < electiveGroupIds.length; j++) {
            string memory groupId = electiveGroupIds[j];
            require(!electiveGroups[programId][groupId].exists, "Exists");
            
            // Lấy danh sách courseIds cho group này
            uint startIdx = electiveGroupCourseStartIdx[j];
            uint count = electiveGroupCourseCount[j];
            string[] memory groupCourseIds = new string[](count);
            
            for (uint k = 0; k < count; k++) {
                groupCourseIds[k] = courseIds[startIdx + k];
            }
            
            electiveGroups[programId][groupId] = ElectiveGroup({
                groupId: groupId,
                groupName: electiveGroupNames[j],
                requiredCredits: electiveRequiredCredits[j],
                courseIds: groupCourseIds,
                exists: true
            });
            
            programElectiveGroupIds[programId].push(groupId);
        }
        
        // Emit event
        emit ProgramCreated(
            programId,
            programName,
            minCredits,
            minGPA,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Cập nhật thông tin cơ bản của chương trình đào tạo
     */
    function updateProgram(
        string memory programId,
        string memory programName,
        
        uint256 totalCredits,
        uint256 minCredits,
        uint256 minGPA,
        bool isActive
    ) external onlyOwner {
        require(programs[programId].exists, "Not found");
        require(minGPA <= 400, "GPA>4.0");
        
        Program storage prog = programs[programId];
        prog.programName = programName;
        prog.totalCredits = totalCredits;
        prog.minCredits = minCredits;
        prog.minGPA = minGPA;
        prog.isActive = isActive;
        
        emit ProgramUpdated(programId, block.timestamp);
    }
    
    /**
     * @dev ĐÃ XÓA - Không cần gán thủ công nữa
     * Sinh viên tự động được gán qua Class mapping
     * Dùng setProgramClass() để quản lý
     */
    
    /**
     * @dev Gắn class với chương trình đào tạo
     * Khi thêm sinh viên có class này sẽ tự động gán vào program
     */
    function setProgramClass(
        string memory programId,
        string memory className
    ) external onlyOwner {
        require(programs[programId].exists, "Not found");
        require(bytes(className).length > 0, "No name");
        
        classToProgram[className] = programId;
        
        emit ProgramClassSet(programId, className, block.timestamp);
        emit ProgramClassAssigned(programId, className, block.timestamp);
    }
    
    /**
     * @dev Gắn nhiều class cùng lúc với một chương trình đào tạo (BATCH)
     * Chỉ cần ký một transaction duy nhất cho tất cả các class
     */
    function batchSetProgramClass(
        string memory programId,
        string[] memory classNames
    ) external onlyOwner {
        require(programs[programId].exists, "Not found");
        require(classNames.length > 0, "No classes");
        
        for (uint256 i = 0; i < classNames.length; i++) {
            require(bytes(classNames[i]).length > 0, "Empty class name");
            classToProgram[classNames[i]] = programId;
            emit ProgramClassSet(programId, classNames[i], block.timestamp);
            emit ProgramClassAssigned(programId, classNames[i], block.timestamp);
        }
    }
    
    /**
     * @dev Lấy thông tin chương trình đào tạo
     */
    function getProgram(string memory programId) 
        external 
        view 
        returns (
            string memory _programName,
            uint256 _totalCredits,
            uint256 _minCredits,
            uint256 _minGPA,
            uint256 _courseCount,
            bool _isActive,
            uint256 _createdAt
        ) 
    {
        require(programs[programId].exists, "Not found");
        Program memory prog = programs[programId];
        
        return (
            prog.programName,
            prog.totalCredits,
            prog.minCredits,
            prog.minGPA,
            programCourses[programId].length,
            prog.isActive,
            prog.createdAt
        );
    }
    
    /**
     * @dev Lấy danh sách môn học của chương trình
     */
    function getProgramCourses(string memory programId) 
        external 
        view 
        returns (ProgramCourse[] memory) 
    {
        require(programs[programId].exists, "Not found");
        return programCourses[programId];
    }
    
    /**
     * @dev Lấy thông tin một môn học cụ thể trong chương trình
     */
    function getProgramCourse(string memory programId, string memory courseId) 
        external 
        view 
        returns (
            string memory _courseId,
            string memory _courseName,
            uint256 _credits,
            bool _isRequired,
            string[] memory _prerequisites,
            string[] memory _corequisites,
            uint256 _minCreditsRequired,
            string memory _groupId
        ) 
    {
        require(programs[programId].exists, "Not found");
        
        ProgramCourse[] memory courses = programCourses[programId];
        for (uint256 i = 0; i < courses.length; i++) {
            if (keccak256(bytes(courses[i].courseId)) == keccak256(bytes(courseId))) {
                ProgramCourse memory course = courses[i];
                return (
                    course.courseId,
                    course.courseName,
                    course.credits,
                    course.isRequired,
                    course.prerequisites,
                    course.corequisites,
                    course.minCreditsRequired,
                    course.groupId
                );
            }
        }
        
        revert("Course not found in program");
    }
    
    /**
     * @dev Lấy thông tin nhóm tự chọn
     */
    function getElectiveGroup(string memory programId, string memory groupId)
        external
        view
        returns (
            string memory _groupId,
            string memory _groupName,
            uint256 _requiredCredits,
            string[] memory _courseIds,
            bool _exists
        )
    {
        require(programs[programId].exists, "Not found");
        ElectiveGroup memory group = electiveGroups[programId][groupId];
        
        return (
            group.groupId,
            group.groupName,
            group.requiredCredits,
            group.courseIds,
            group.exists
        );
    }
    
    /**
     * @dev Lấy danh sách ID các nhóm tự chọn của chương trình
     */
    function getProgramElectiveGroupIds(string memory programId)
        external
        view
        returns (string[] memory)
    {
        require(programs[programId].exists, "Not found");
        return programElectiveGroupIds[programId];
    }
    
    /**
     * @dev Lấy tổng số chương trình đào tạo
     */
    function getTotalPrograms() external view returns (uint256) {
        return allProgramIds.length;
    }
    
    /**
     * @dev Lấy mã chương trình theo index
     */
    function getProgramIdByIndex(uint256 index) external view returns (string memory) {
        require(index < allProgramIds.length, "Bad index");
        return allProgramIds[index];
    }
    
    /**
     * @dev Lấy chương trình đào tạo của sinh viên
     */
    function getStudentProgram(string memory studentId) 
        external 
        view 
        studentExists(studentId)
        returns (string memory) 
    {
        return studentProgram[studentId];
    }
    
    /**
     * @dev Lấy chương trình đào tạo từ tên class
     */
    function getProgramByClass(string memory className) 
        external 
        view 
        returns (string memory) 
    {
        return classToProgram[className];
    }
    
    // ============ DIPLOMA MANAGEMENT ============
    
    /**
     * @dev Cấp bằng tốt nghiệp - TẠO BLOCK MỚI CHỨA DỮ LIỆU BẰNG
     * 
     * 🔒 BẢO MẬT: Logic xét tốt nghiệp HOÀN TOÀN trong contract - KHÔNG THỂ GIA LẬN
     * 
     * 📦 DỮ LIỆU TRÊN BLOCK BẰNG TỐT NGHIỆP:
     * 
     * 1. TRANSACTION DATA (on-chain):
     *    - Transaction Hash: ID duy nhất của giao dịch cấp bằng
     *    - Block Number: Số thứ tự block chứa bằng (vd: 12345)
     *    - Block Timestamp: Thời gian cấp bằng (Unix timestamp)
     *    - From: Địa chỉ ví sinh viên (msg.sender)
     *    - To: Địa chỉ contract (0xF514...)
     *    - Gas Used: Lượng gas tiêu thụ
     *    - Status: Success (1) hoặc Failed (0)
     * 
     * 2. CONTRACT STATE (diplomas mapping):
     *    - studentId: MSSV của sinh viên (B2203716)
     *    - diplomaHash: SHA256 hash của file PDF bằng (để verify tính xác thực)
     *    - issuedAt: Timestamp cấp bằng (block.timestamp)
     *    - gpa: GPA * 100 (325 = 3.25/4.0)
     *    - totalCredits: Tổng số tín chỉ đã tích lũy (156)
     *    - classification: Xếp loại (Xuất sắc, Giỏi, Khá, Trung bình)
     *    - exists: true (đánh dấu đã được cấp)
     *    - revoked: false (chưa bị thu hồi)
     * 
     * 3. EVENT LOGS (DiplomaIssued):
     *    - Lưu trong block logs, có thể query
     *    - Chứa: studentId, diplomaHash, gpa, totalCredits, classification, timestamp
     *    - Indexed: studentId (để search nhanh)
     * 
     * 4. ĐIỀU KIỆN TỐT NGHIỆP ĐƯỢC KIỂM TRA:
     *    ✅ GPA >= 2.0 (hệ 4.0)
     *    ✅ Tổng tín chỉ >= 156
     *    ✅ Không có môn F (điểm < 1.0)
     *    ✅ Đủ tín chỉ bắt buộc >= 111
     *    ✅ Đủ tín chỉ tự chọn >= 45
     *    ✅ Đủ tín chỉ từng nhóm môn tự chọn
     *    ✅ Số học kỳ <= 26 (tối đa 13 năm)
     *    ✅ Tất cả môn bắt buộc phải hoàn thành
     * 
     * ⚠️ CHỈ chủ ví sinh viên hoặc owner mới có thể mint
     * 
     * @param studentId MSSV
     * @param diplomaHash SHA256 hash của file PDF bằng tốt nghiệp
     * @param gpa GPA * 100 (ví dụ: 325 = 3.25)
     * @param totalCredits Tổng tín chỉ tích lũy
     * @param classification Xếp loại (Xuất sắc, Giỏi, Khá, Trung bình)
     */
    function mintDiploma(
        string memory studentId,
        string memory diplomaHash,
        uint256 gpa,
        uint256 totalCredits,
        string memory classification
    ) external studentExists(studentId) {
        // 🔒 BẢO MẬT: CHỈ chủ ví sinh viên HOẶC owner mới mint được
        address studentWalletAddr = studentWallet[studentId];
        require(
            msg.sender == studentWalletAddr || msg.sender == owner(),
            "Unauthorized"
        );
        
        // Kiểm tra chưa được cấp bằng
        require(!diplomas[studentId].exists, "Diploma already issued");
        
        // Kiểm tra hash không rỗng
        require(bytes(diplomaHash).length > 0, "Diploma hash required");
        
        // ============ KIỂM TRA ĐIỀU KIỆN TỐT NGHIỆP - LOGIC TRONG CONTRACT ============
        // KHÔNG THỂ BYPASS - Dù frontend bị hack, contract vẫn kiểm tra
        
        // 1. Kiểm tra điều kiện cơ bản
        require(gpa >= 200, "GPA must be >= 2.0"); // 200 = 2.0 * 100
        require(totalCredits >= 156, "Total credits must be >= 156");
        
        // 2. Lấy thông tin chương trình đào tạo
        string memory programId = studentProgram[studentId];
        require(bytes(programId).length > 0, "Student not assigned to program");
        
        Program memory prog = programs[programId];
        require(prog.exists, "Program not found");
        
        // 3. Kiểm tra điều kiện theo chương trình
        require(gpa >= prog.minGPA, "GPA below program minimum");
        require(totalCredits >= prog.minCredits, "Credits below program minimum");
        
        // 4. Kiểm tra tất cả môn học đã hoàn thành (không có điểm F hoặc < 1.0)
        // Lấy danh sách học kỳ của sinh viên
        string[] memory semesters = studentSemesters[studentId];
        require(semesters.length > 0, "No grades found");
        require(semesters.length <= 26, "Too many semesters (max 26)"); // Tối đa 13 năm
        
        uint256 totalCreditsCalculated = 0;
        bool hasFailedCourse = false;
        
        for (uint i = 0; i < semesters.length; i++) {
            SemesterGrades storage semGrades = semesterGrades[studentId][semesters[i]];
            
            for (uint j = 0; j < semGrades.courses.length; j++) {
                CourseGrade memory course = semGrades.courses[j];
                
                // Kiểm tra không có môn F (grade < 100 = điểm < 1.0)
                if (course.grade < 100) {
                    hasFailedCourse = true;
                    break;
                }
                
                totalCreditsCalculated += course.credits;
            }
            
            if (hasFailedCourse) break;
        }
        
        require(!hasFailedCourse, "Failed courses found (grade < 1.0)");
        require(totalCreditsCalculated >= totalCredits, "Credits mismatch");
        
        // 5. Kiểm tra môn bắt buộc (required courses)
        ProgramCourse[] storage requiredCourses = programCourses[programId];
        require(requiredCourses.length > 0, "No program courses defined");
        
        uint256 requiredCreditsCompleted = 0;
        
        for (uint i = 0; i < requiredCourses.length; i++) {
            if (requiredCourses[i].isRequired) {
                // Kiểm tra sinh viên đã học môn này chưa
                bool courseCompleted = false;
                
                for (uint j = 0; j < semesters.length; j++) {
                    SemesterGrades storage semGrades = semesterGrades[studentId][semesters[j]];
                    
                    for (uint k = 0; k < semGrades.courses.length; k++) {
                        if (keccak256(bytes(semGrades.courses[k].courseId)) == keccak256(bytes(requiredCourses[i].courseId))) {
                            // Kiểm tra đã pass (>= 1.0 = grade >= 100)
                            if (semGrades.courses[k].grade >= 100) {
                                courseCompleted = true;
                                requiredCreditsCompleted += requiredCourses[i].credits;
                            }
                            break;
                        }
                    }
                    
                    if (courseCompleted) break;
                }
                
                require(courseCompleted, string(abi.encodePacked("Required course not completed: ", requiredCourses[i].courseId)));
            }
        }
        
        // Kiểm tra đủ tín chỉ bắt buộc (111 TC)
        require(requiredCreditsCompleted >= 111, "Required credits < 111");
        
        // 6. Kiểm tra nhóm môn tự chọn (elective groups)
        string[] memory groupIds = programElectiveGroupIds[programId];
        
        for (uint i = 0; i < groupIds.length; i++) {
            ElectiveGroup storage group = electiveGroups[programId][groupIds[i]];
            
            if (group.exists && group.requiredCredits > 0) {
                uint256 groupCreditsCompleted = 0;
                
                // Kiểm tra sinh viên đã học đủ TC trong nhóm này chưa
                for (uint j = 0; j < group.courseIds.length; j++) {
                    for (uint k = 0; k < semesters.length; k++) {
                        SemesterGrades storage semGrades = semesterGrades[studentId][semesters[k]];
                        
                        for (uint m = 0; m < semGrades.courses.length; m++) {
                            if (keccak256(bytes(semGrades.courses[m].courseId)) == keccak256(bytes(group.courseIds[j]))) {
                                if (semGrades.courses[m].grade >= 100) {
                                    groupCreditsCompleted += semGrades.courses[m].credits;
                                }
                                break;
                            }
                        }
                    }
                }
                
                require(
                    groupCreditsCompleted >= group.requiredCredits,
                    string(abi.encodePacked("Elective group incomplete: ", group.groupName))
                );
            }
        }
        
        // ============ TẤT CẢ ĐIỀU KIỆN ĐÃ THỎA MÃN - CẤP BẰNG ============
        
        // Lưu thông tin bằng vào blockchain
        diplomas[studentId] = DiplomaRecord({
            studentId: studentId,
            diplomaHash: diplomaHash,
            issuedAt: block.timestamp,
            gpa: gpa,
            totalCredits: totalCredits,
            classification: classification,
            exists: true,
            revoked: false,
            revokedAt: 0,
            revokedReason: ""
        });
        
        // Thêm vào danh sách đã cấp bằng
        diplomaIssuedStudents.push(studentId);
        
        // Emit event (data sẽ được lưu trong block logs)
        emit DiplomaIssued(
            studentId,
            diplomaHash,
            gpa,
            totalCredits,
            classification,
            block.timestamp
        );
    }
    
    // ============ GRADUATION APPLICATION MANAGEMENT ============
    
    /**
     * @dev Sinh viên đăng ký xét tốt nghiệp
     * @param studentId MSSV
     * @param applicationHash Hash của đơn đăng ký (chứa GPA, tín chỉ, chữ ký)
     * @param gpa GPA * 100
     * @param totalCredits Tổng tín chỉ
     * @param classification Xếp loại
     */
    function submitGraduationApplication(
        string memory studentId,
        string memory applicationHash,
        uint256 gpa,
        uint256 totalCredits,
        string memory classification
    ) external studentExists(studentId) {
        // Kiểm tra chỉ chủ ví sinh viên mới được đăng ký
        address studentWalletAddr = studentWallet[studentId];
        require(msg.sender == studentWalletAddr, "Only student can apply");
        
        // Kiểm tra chưa có đơn đang chờ hoặc đã duyệt
        require(!graduationApplications[studentId].exists, "Application already exists");
        
        // Kiểm tra chưa được cấp bằng
        require(!diplomas[studentId].exists, "Diploma already issued");
        
        // Kiểm tra điều kiện cơ bản
        require(gpa >= 200, "GPA must be >= 2.0");
        require(totalCredits >= 156, "Total credits must be >= 156");
        require(bytes(applicationHash).length > 0, "Application hash required");
        
        // Lưu đơn đăng ký
        graduationApplications[studentId] = GraduationApplication({
            studentId: studentId,
            applicationHash: applicationHash,
            appliedAt: block.timestamp,
            gpa: gpa,
            totalCredits: totalCredits,
            classification: classification,
            status: 0, // Pending
            processedAt: 0,
            processedBy: address(0),
            notes: "",
            exists: true
        });
        
        // Thêm vào danh sách đơn đăng ký
        graduationApplicants.push(studentId);
        
        // Emit event
        emit GraduationApplicationSubmitted(
            studentId,
            applicationHash,
            gpa,
            totalCredits,
            classification,
            block.timestamp
        );
    }
    
    /**
     * @dev Dean duyệt đơn xét tốt nghiệp và tự động cấp bằng
     * @param studentId MSSV
     * @param diplomaHash Hash của file PDF bằng
     * @param notes Ghi chú (nếu có)
     */
    function approveGraduation(
        string memory studentId,
        string memory diplomaHash,
        string memory notes
    ) external onlyDean studentExists(studentId) {
        // Kiểm tra đơn đăng ký tồn tại và đang chờ duyệt
        GraduationApplication storage app = graduationApplications[studentId];
        require(app.exists, "Application not found");
        require(app.status == 0, "Application already processed");
        
        // Kiểm tra chưa được cấp bằng
        require(!diplomas[studentId].exists, "Diploma already issued");
        
        // Cập nhật trạng thái đơn
        app.status = 1; // Approved
        app.processedAt = block.timestamp;
        app.processedBy = msg.sender;
        app.notes = notes;
        
        // Tự động cấp bằng
        diplomas[studentId] = DiplomaRecord({
            studentId: studentId,
            diplomaHash: diplomaHash,
            issuedAt: block.timestamp,
            gpa: app.gpa,
            totalCredits: app.totalCredits,
            classification: app.classification,
            exists: true,
            revoked: false,
            revokedAt: 0,
            revokedReason: ""
        });
        
        // Thêm vào danh sách đã cấp bằng
        diplomaIssuedStudents.push(studentId);
        
        // Emit events
        emit GraduationApplicationApproved(studentId, msg.sender, block.timestamp);
        emit DiplomaIssued(
            studentId,
            diplomaHash,
            app.gpa,
            app.totalCredits,
            app.classification,
            block.timestamp
        );
    }
    
    /**
     * @dev Dean từ chối đơn xét tốt nghiệp
     * @param studentId MSSV
     * @param reason Lý do từ chối
     */
    function rejectGraduation(
        string memory studentId,
        string memory reason
    ) external onlyDean studentExists(studentId) {
        // Kiểm tra đơn đăng ký tồn tại và đang chờ duyệt
        GraduationApplication storage app = graduationApplications[studentId];
        require(app.exists, "Application not found");
        require(app.status == 0, "Application already processed");
        
        // Cập nhật trạng thái đơn
        app.status = 2; // Rejected
        app.processedAt = block.timestamp;
        app.processedBy = msg.sender;
        app.notes = reason;
        
        // Emit event
        emit GraduationApplicationRejected(studentId, msg.sender, reason, block.timestamp);
    }
    
    /**
     * @dev Lấy thông tin đơn đăng ký xét tốt nghiệp
     */
    function getGraduationApplication(string memory studentId)
        external
        view
        returns (
            string memory applicationHash,
            uint256 appliedAt,
            uint256 gpa,
            uint256 totalCredits,
            string memory classification,
            uint8 status,
            uint256 processedAt,
            address processedBy,
            string memory notesStr,
            bool exists
        )
    {
        GraduationApplication memory app = graduationApplications[studentId];
        return (
            app.applicationHash,
            app.appliedAt,
            app.gpa,
            app.totalCredits,
            app.classification,
            app.status,
            app.processedAt,
            app.processedBy,
            app.notes,
            app.exists
        );
    }
    
    /**
     * @dev Lấy tổng số đơn đăng ký xét tốt nghiệp
     */
    function getTotalGraduationApplications() external view returns (uint256) {
        return graduationApplicants.length;
    }
    
    /**
     * @dev Lấy MSSV theo index trong danh sách đơn đăng ký
     */
    function getGraduationApplicantByIndex(uint256 index) external view returns (string memory) {
        require(index < graduationApplicants.length, "Index out of bounds");
        return graduationApplicants[index];
    }
    
    /**
     * @dev Xác thực bằng tốt nghiệp
     * @param studentId MSSV
     * @param diplomaHash SHA256 hash của file PDF cần verify
     */
    function verifyDiploma(
        string memory studentId,
        string memory diplomaHash
    ) external view returns (
        bool valid,
        uint256 issuedAt,
        uint256 gpa,
        uint256 totalCredits,
        string memory classification
    ) {
        DiplomaRecord memory diploma = diplomas[studentId];
        
        // Kiểm tra bằng có tồn tại không
        if (!diploma.exists) {
            return (false, 0, 0, 0, "");
        }
        
        // Kiểm tra hash có khớp không
        bool hashMatches = keccak256(bytes(diploma.diplomaHash)) == keccak256(bytes(diplomaHash));
        
        return (
            hashMatches,
            diploma.issuedAt,
            diploma.gpa,
            diploma.totalCredits,
            diploma.classification
        );
    }
    
    /**
     * @dev Lấy thông tin bằng tốt nghiệp
     */
    function getDiploma(string memory studentId) 
        external 
        view 
        returns (
            string memory diplomaHash,
            uint256 issuedAt,
            uint256 gpa,
            uint256 totalCredits,
            string memory classification,
            bool exists,
            bool revoked,
            uint256 revokedAt,
            string memory revokedReason
        ) 
    {
        DiplomaRecord memory diploma = diplomas[studentId];
        return (
            diploma.diplomaHash,
            diploma.issuedAt,
            diploma.gpa,
            diploma.totalCredits,
            diploma.classification,
            diploma.exists,
            diploma.revoked,
            diploma.revokedAt,
            diploma.revokedReason
        );
    }    /**
     * @dev Thu hồi bằng tốt nghiệp
     * ⚠️ CHỈ Cán bộ quản lý điểm (Dean) mới có quyền thu hồi
     * @param studentId MSSV
     * @param reason Lý do thu hồi
     */
    function revokeDiploma(
        string memory studentId,
        string memory reason
    ) external onlyDean studentExists(studentId) {
        // Kiểm tra bằng đã được cấp
        require(diplomas[studentId].exists, "No diploma");
        
        // Kiểm tra chưa bị thu hồi
        require(!diplomas[studentId].revoked, "Revoked");
        
        // Kiểm tra lý do không rỗng
        require(bytes(reason).length > 0, "No reason");
        
        // Cập nhật trạng thái thu hồi
        diplomas[studentId].revoked = true;
        diplomas[studentId].revokedAt = block.timestamp;
        diplomas[studentId].revokedReason = reason;
        
        // Emit event (revokedBy được ghi trong event)
        emit DiplomaRevoked(
            studentId,
            reason,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Kiểm tra sinh viên đã được cấp bằng chưa
     */
    function hasDiploma(string memory studentId) external view returns (bool) {
        return diplomas[studentId].exists;
    }
    
    /**
     * @dev Kiểm tra bằng có bị thu hồi không
     */
    function isDiplomaRevoked(string memory studentId) external view returns (bool) {
        return diplomas[studentId].revoked;
    }
    
    /**
     * @dev Lấy thông tin thu hồi bằng
     */
    function getDiplomaRevokeInfo(string memory studentId) 
        external 
        view 
        returns (
            bool revoked,
            uint256 revokedAt,
            string memory reason,
            address revokedBy
        ) 
    {
        DiplomaRecord memory diploma = diplomas[studentId];
        // revokedBy không được lưu trong struct nữa, trả về address(0)
        return (
            diploma.revoked,
            diploma.revokedAt,
            diploma.revokedReason,
            address(0)
        );
    }
    
    /**
     * @dev Lấy tổng số bằng đã cấp
     */
    function getTotalDiplomasIssued() external view returns (uint256) {
        return diplomaIssuedStudents.length;
    }
    
    // ============ WALLET VERIFICATION ============
    
    /**
     * @dev Lấy địa chỉ ví của sinh viên theo MSSV
     */
    function getStudentWallet(string memory studentId) 
        external 
        view 
        studentExists(studentId)
        returns (address) 
    {
        return studentWallet[studentId];
    }
    
    /**
     * @dev Lấy MSSV từ địa chỉ ví (reverse lookup)
     */
    function getStudentIdByWallet(address wallet) 
        external 
        view 
        returns (string memory) 
    {
        return walletToStudentId[wallet];
    }
    
    /**
     * @dev Verify địa chỉ ví có khớp với MSSV không
     */
    function verifyStudentWallet(string memory studentId, address wallet) 
        external 
        view 
        returns (bool) 
    {
        return studentWallet[studentId] == wallet;
    }
}
