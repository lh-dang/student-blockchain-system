// Script test chức năng Dean Management trên blockchain
// Chạy: npx truffle exec scripts/test_dean_management.js --network development

const StudentManagement = artifacts.require("StudentManagement");

module.exports = async function(callback) {
  try {
    console.log("\n🧪 BẮT ĐẦU TEST DEAN MANAGEMENT\n");
    
    const contract = await StudentManagement.deployed();
    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0];
    const deanAddress1 = accounts[1];
    const deanAddress2 = accounts[2];
    
    console.log("📍 Contract Address:", contract.address);
    console.log("👤 Admin:", admin);
    console.log("👨‍🏫 Dean 1:", deanAddress1);
    console.log("👨‍🏫 Dean 2:", deanAddress2);
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 1: Thêm Dean đầu tiên
    console.log("📝 TEST 1: Thêm Dean đầu tiên");
    console.log("-".repeat(70));
    
    try {
      const tx1 = await contract.addDeanWithInfo(
        deanAddress1,
        "TS. Nguyễn Văn A",
        "Công nghệ Thông tin và Truyền thông",
        "nguyenvana@ctu.edu.vn",
        "0123456789",
        "Phụ trách chương trình An toàn thông tin",
        { from: admin }
      );
      
      console.log("✅ Thêm Dean 1 thành công!");
      console.log("   Gas used:", tx1.receipt.gasUsed);
      console.log("   Events:", tx1.logs.map(log => log.event).join(", "));
    } catch (err) {
      console.log("⚠️  Dean 1 có thể đã tồn tại:", err.message);
    }
    
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 2: Thêm Dean thứ hai
    console.log("📝 TEST 2: Thêm Dean thứ hai");
    console.log("-".repeat(70));
    
    try {
      const tx2 = await contract.addDeanWithInfo(
        deanAddress2,
        "PGS.TS. Trần Thị B",
        "Khoa học Máy tính",
        "tranthib@ctu.edu.vn",
        "0987654321",
        "Phụ trách chương trình Khoa học dữ liệu",
        { from: admin }
      );
      
      console.log("✅ Thêm Dean 2 thành công!");
      console.log("   Gas used:", tx2.receipt.gasUsed);
    } catch (err) {
      console.log("⚠️  Dean 2 có thể đã tồn tại:", err.message);
    }
    
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 3: Kiểm tra isDean
    console.log("📝 TEST 3: Kiểm tra quyền Dean");
    console.log("-".repeat(70));
    
    const isDean1 = await contract.isDean(deanAddress1);
    const isDean2 = await contract.isDean(deanAddress2);
    const isDeanAdmin = await contract.isDean(admin);
    
    console.log("👨‍🏫 Dean 1 có quyền:", isDean1 ? "✅ CÓ" : "❌ KHÔNG");
    console.log("👨‍🏫 Dean 2 có quyền:", isDean2 ? "✅ CÓ" : "❌ KHÔNG");
    console.log("👤 Admin có quyền:", isDeanAdmin ? "✅ CÓ" : "❌ KHÔNG");
    
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 4: Lấy thông tin Dean
    console.log("📝 TEST 4: Lấy thông tin Dean từ blockchain");
    console.log("-".repeat(70));
    
    try {
      const info1 = await contract.getDeanInfo(deanAddress1);
      console.log("\n👨‍🏫 DEAN 1:");
      console.log("   Tên:", info1[0]);
      console.log("   Khoa:", info1[1]);
      console.log("   Email:", info1[2]);
      console.log("   SĐT:", info1[3]);
      console.log("   Ghi chú:", info1[4]);
      console.log("   Thời gian thêm:", new Date(info1[5] * 1000).toLocaleString('vi-VN'));
      console.log("   Được thêm bởi:", info1[6]);
      console.log("   Đang active:", info1[7] ? "✅ CÓ" : "❌ KHÔNG");
      
      const info2 = await contract.getDeanInfo(deanAddress2);
      console.log("\n👨‍🏫 DEAN 2:");
      console.log("   Tên:", info2[0]);
      console.log("   Khoa:", info2[1]);
      console.log("   Email:", info2[2]);
      console.log("   SĐT:", info2[3]);
      console.log("   Ghi chú:", info2[4]);
      console.log("   Thời gian thêm:", new Date(info2[5] * 1000).toLocaleString('vi-VN'));
      console.log("   Được thêm bởi:", info2[6]);
      console.log("   Đang active:", info2[7] ? "✅ CÓ" : "❌ KHÔNG");
    } catch (err) {
      console.log("❌ Lỗi khi lấy thông tin Dean:", err.message);
    }
    
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 5: Lấy tất cả Dean active
    console.log("📝 TEST 5: Lấy danh sách tất cả Dean active");
    console.log("-".repeat(70));
    
    const allActiveDeans = await contract.getAllActiveDeans();
    console.log("📊 Tổng số Dean active:", allActiveDeans.length);
    
    for (let i = 0; i < allActiveDeans.length; i++) {
      const addr = allActiveDeans[i];
      const info = await contract.getDeanInfo(addr);
      console.log(`\n   ${i + 1}. ${info[0]}`);
      console.log(`      Địa chỉ: ${addr}`);
      console.log(`      Khoa: ${info[1]}`);
    }
    
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 6: Đếm tổng số Dean
    console.log("📝 TEST 6: Đếm tổng số Dean (bao gồm cả inactive)");
    console.log("-".repeat(70));
    
    const totalDeans = await contract.getTotalDeans();
    console.log("📊 Tổng số Dean:", totalDeans.toString());
    
    console.log("\n" + "=".repeat(70) + "\n");
    
    // TEST 7: Xóa quyền Dean (optional - uncomment để test)
    /*
    console.log("📝 TEST 7: Xóa quyền Dean");
    console.log("-".repeat(70));
    
    const removeTx = await contract.removeDean(deanAddress2, { from: admin });
    console.log("✅ Đã xóa quyền Dean 2!");
    console.log("   Gas used:", removeTx.receipt.gasUsed);
    
    const isDean2AfterRemove = await contract.isDean(deanAddress2);
    console.log("👨‍🏫 Dean 2 còn quyền:", isDean2AfterRemove ? "✅ CÓ" : "❌ KHÔNG");
    
    const info2AfterRemove = await contract.getDeanInfo(deanAddress2);
    console.log("   Trạng thái active:", info2AfterRemove[7] ? "✅ CÓ" : "❌ KHÔNG");
    
    const allActiveDeansAfterRemove = await contract.getAllActiveDeans();
    console.log("📊 Tổng số Dean active sau khi xóa:", allActiveDeansAfterRemove.length);
    
    console.log("\n" + "=".repeat(70) + "\n");
    */
    
    console.log("\n✅ HOÀN TẤT TẤT CẢ CÁC TEST!\n");
    
    callback();
  } catch (error) {
    console.error("\n❌ LỖI:", error);
    callback(error);
  }
};
